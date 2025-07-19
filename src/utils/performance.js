// Enhanced Performance Utilities
import {
  debounce,
  throttle,
  createOptimizedScrollHandler,
  optimizeAnimation,
  createSmoothTransition,
  getFeatureSupport,
} from "./optimizationUtils";

/**
 * Enhanced debounce function with memory optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @param {boolean} immediate - Execute on leading edge
 * @returns {Function} - Debounced function
 */
export const optimizedDebounce = (func, wait = 300, immediate = false) => {
  return debounce(func, wait, immediate);
};

/**
 * Enhanced throttle function for high-frequency events
 * @param {Function} func - Function to throttle
 * @param {number} wait - Delay in milliseconds
 * @returns {Function} - Throttled function
 */
export const optimizedThrottle = (func, wait = 16) => {
  // 60fps default
  return throttle(func, wait);
};

/**
 * Optimized scroll handler with enhanced performance
 * Uses requestAnimationFrame and throttling for smooth scrolling
 * @param {Function} callback - Scroll callback function
 * @returns {Function} - Optimized scroll handler
 */
export const getOptimizedScrollHandler = (callback) => {
  return createOptimizedScrollHandler(callback);
};

/**
 * Enhanced intersection observer for better scroll animations
 * @param {Function} callback - Callback function for intersection
 * @param {Object} options - Intersection observer options
 * @returns {IntersectionObserver} - Observer instance
 */
export const createOptimizedIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: "10px",
    threshold: [0, 0.1, 0.5, 1.0], // Multiple thresholds for smoother animations
    ...options,
  };

  if (!getFeatureSupport().intersectionObserver) {
    // Enhanced fallback for older browsers
    return {
      observe: (element) => {
        // Use throttled scroll listener as fallback
        const scrollHandler = optimizedThrottle(() => {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          if (isVisible) {
            callback([{ target: element, isIntersecting: true }]);
          }
        }, 100);

        window.addEventListener("scroll", scrollHandler, { passive: true });

        // Return cleanup function
        element._cleanupScroll = () => {
          window.removeEventListener("scroll", scrollHandler);
        };
      },
      unobserve: (element) => {
        if (element._cleanupScroll) {
          element._cleanupScroll();
          delete element._cleanupScroll;
        }
      },
      disconnect: () => {},
    };
  }

  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Preload critical images for better performance
 * @param {Array<string>} imageSrcs - Array of image URLs to preload
 * @returns {Promise<Array>} - Promise resolving when images are loaded
 */
export const preloadCriticalImages = async (imageSrcs) => {
  const loadPromises = imageSrcs.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      const onLoad = () => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
        resolve(src);
      };

      const onError = () => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
        console.warn(`Failed to preload image: ${src}`);
        resolve(null); // Resolve with null instead of rejecting
      };

      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);
      img.src = src;
    });
  });

  try {
    const results = await Promise.allSettled(loadPromises);
    return results.map((result) =>
      result.status === "fulfilled" ? result.value : null,
    );
  } catch (error) {
    console.error("Error preloading images:", error);
    return [];
  }
};

/**
 * Enhanced transition helper with performance optimizations
 * @param {number} duration - Animation duration in milliseconds
 * @param {string} easing - CSS easing function
 * @returns {Object} - Transition styles
 */
export const getOptimizedTransition = (
  duration = 300,
  easing = "cubic-bezier(0.4, 0, 0.2, 1)",
) => {
  const features = getFeatureSupport();

  const baseTransition = createSmoothTransition(duration, easing);

  // Add reduced motion support
  if (features.prefersReducedMotion) {
    return {
      ...baseTransition,
      transition: `all ${Math.min(duration, 150)}ms ${easing}`, // Faster transitions for reduced motion
    };
  }

  return baseTransition;
};

/**
 * Optimize component animations with will-change
 * @param {HTMLElement} element - Element to animate
 * @param {Function} animationFn - Animation function
 * @param {number} duration - Animation duration
 * @returns {Promise} - Promise resolving when animation completes
 */
export const optimizeComponentAnimation = (
  element,
  animationFn,
  duration = 300,
) => {
  return optimizeAnimation(element, animationFn, duration);
};

/**
 * Create smooth hover effects with proper cleanup
 * @param {Object} baseStyles - Base element styles
 * @param {Object} hoverStyles - Hover state styles
 * @param {number} duration - Transition duration
 * @returns {Object} - Hover effect handlers
 */
export const createSmoothHover = (
  baseStyles = {},
  hoverStyles = {},
  duration = 200,
) => {
  const transition = getOptimizedTransition(duration);

  return {
    baseStyles: {
      ...baseStyles,
      ...transition,
      cursor: "pointer",
    },
    hoverStyles: {
      ...baseStyles,
      ...hoverStyles,
      ...transition,
    },
    onMouseEnter: (setState) => {
      setState(true);
    },
    onMouseLeave: (setState) => {
      setState(false);
    },
  };
};

/**
 * Batch multiple style updates for better performance
 * @param {Array<Object>} updates - Array of {element, styles} objects
 * @returns {Promise} - Promise resolving when updates are complete
 */
export const batchStyleUpdates = (updates) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      updates.forEach(({ element, styles }) => {
        if (element && styles) {
          Object.assign(element.style, styles);
        }
      });
      resolve();
    });
  });
};

/**
 * Create memory-efficient event listeners
 * @param {HTMLElement} element - Element to attach listener to
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event listener options
 * @returns {Function} - Cleanup function
 */
export const createOptimizedEventListener = (
  element,
  event,
  handler,
  options = {},
) => {
  const optimizedHandler = optimizedThrottle(handler, options.throttle || 16);
  const listenerOptions = {
    passive: true,
    ...options,
  };

  element.addEventListener(event, optimizedHandler, listenerOptions);

  return () => {
    element.removeEventListener(event, optimizedHandler, listenerOptions);
  };
};

/**
 * Initialize performance monitoring for development
 * @returns {Object} - Performance monitoring utilities
 */
export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV !== "development") {
    return {
      measureRender: (fn) => fn(),
      logMetrics: () => {},
      cleanup: () => {},
    };
  }

  const renderTimes = [];
  const maxSamples = 100;

  const measureRender = (renderFunction) => {
    const start = performance.now();
    const result = renderFunction();
    const end = performance.now();

    const duration = end - start;
    renderTimes.push(duration);

    if (renderTimes.length > maxSamples) {
      renderTimes.shift();
    }

    // Warn about slow renders
    if (duration > 16.67) {
      // Slower than 60fps
      console.warn(`Slow render detected: ${duration.toFixed(2)}ms`);
    }

    return result;
  };

  const logMetrics = () => {
    if (renderTimes.length > 0) {
      const avg =
        renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length;
      const max = Math.max(...renderTimes);
      console.log(
        `Render performance - Avg: ${avg.toFixed(2)}ms, Max: ${max.toFixed(2)}ms`,
      );
    }
  };

  // Log metrics every 30 seconds in development
  const metricsInterval = setInterval(logMetrics, 30000);

  return {
    measureRender,
    logMetrics,
    cleanup: () => clearInterval(metricsInterval),
  };
};

/**
 * Default export with all performance utilities
 */
export default {
  optimizedDebounce,
  optimizedThrottle,
  getOptimizedScrollHandler,
  createOptimizedIntersectionObserver,
  preloadCriticalImages,
  getOptimizedTransition,
  optimizeComponentAnimation,
  createSmoothHover,
  batchStyleUpdates,
  createOptimizedEventListener,
  initPerformanceMonitoring,
};
