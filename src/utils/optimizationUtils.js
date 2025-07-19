// Advanced Performance Optimization Utilities

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 */
export const throttle = (func, wait) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
};

/**
 * Optimized scroll handler using requestAnimationFrame
 * Prevents multiple scroll events per frame for better performance
 */
export const createOptimizedScrollHandler = (callback) => {
  let isRunning = false;

  return () => {
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(() => {
        callback();
        isRunning = false;
      });
    }
  };
};

/**
 * Intersection Observer utility for lazy loading and scroll animations
 */
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: "0px 0px -100px 0px", // Trigger when 100px from bottom
    threshold: 0.1,
    ...options,
  };

  if (!window.IntersectionObserver) {
    // Fallback for older browsers
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {},
    };
  }

  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Preload images for better performance
 */
export const preloadImages = (imageUrls) => {
  const promises = imageUrls.map((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  });

  return Promise.allSettled(promises);
};

/**
 * Lazy load images when they come into view
 */
export const createLazyImageLoader = () => {
  const imageObserver = createIntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          const srcset = img.dataset.srcset;

          if (src) {
            img.src = src;
          }
          if (srcset) {
            img.srcset = srcset;
          }

          img.classList.remove("lazy-loading");
          img.classList.add("lazy-loaded");
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px 0px", // Start loading 50px before image is visible
      threshold: 0.01,
    },
  );

  return {
    observe: (img) => imageObserver.observe(img),
    disconnect: () => imageObserver.disconnect(),
  };
};

/**
 * Optimize animations by using will-change and removing it after animation
 */
export const optimizeAnimation = (
  element,
  animationFunction,
  duration = 300,
) => {
  if (!element) return Promise.resolve();

  return new Promise((resolve) => {
    // Add will-change for better performance
    element.style.willChange = "transform, opacity";

    // Run the animation
    animationFunction();

    // Remove will-change after animation completes
    setTimeout(() => {
      element.style.willChange = "auto";
      resolve();
    }, duration);
  });
};

/**
 * Batch DOM reads and writes for better performance
 */
export const batchDOMOperations = (operations) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const reads = [];
      const writes = [];

      operations.forEach((op) => {
        if (op.type === "read") {
          reads.push(op.fn);
        } else if (op.type === "write") {
          writes.push(op.fn);
        }
      });

      // Perform all reads first
      const readResults = reads.map((fn) => fn());

      // Then perform all writes
      requestAnimationFrame(() => {
        writes.forEach((fn) => fn());
        resolve(readResults);
      });
    });
  });
};

/**
 * Create smooth transition helpers
 */
export const createSmoothTransition = (
  duration = 300,
  easing = "cubic-bezier(0.4, 0, 0.2, 1)",
) => ({
  transition: `all ${duration}ms ${easing}`,
  willChange: "transform, opacity",
});

/**
 * Resource hints for better loading performance
 */
export const addResourceHints = () => {
  const head = document.head;

  // Preconnect to external domains
  const preconnectDomains = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ];

  preconnectDomains.forEach((domain) => {
    if (!document.querySelector(`link[href="${domain}"]`)) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = domain;
      link.crossOrigin = "anonymous";
      head.appendChild(link);
    }
  });
};

/**
 * Viewport utilities for responsive optimizations
 */
export const getViewportInfo = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
  isMobile: window.innerWidth <= 768,
  isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
  isDesktop: window.innerWidth > 1024,
  devicePixelRatio: window.devicePixelRatio || 1,
});

/**
 * Memory optimization - cleanup functions
 */
export const createCleanupManager = () => {
  const cleanupFunctions = [];

  return {
    add: (cleanupFn) => {
      cleanupFunctions.push(cleanupFn);
    },
    cleanup: () => {
      cleanupFunctions.forEach((fn) => {
        try {
          fn();
        } catch (error) {
          console.warn("Cleanup function failed:", error);
        }
      });
      cleanupFunctions.length = 0;
    },
  };
};

/**
 * Animation frame utilities for smooth animations
 */
export const createAnimationLoop = (callback) => {
  let isRunning = false;
  let animationId;

  const loop = (timestamp) => {
    if (isRunning) {
      callback(timestamp);
      animationId = requestAnimationFrame(loop);
    }
  };

  return {
    start: () => {
      if (!isRunning) {
        isRunning = true;
        animationId = requestAnimationFrame(loop);
      }
    },
    stop: () => {
      isRunning = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    },
  };
};

/**
 * Performance monitoring utilities
 */
export const createPerformanceMonitor = () => {
  const metrics = {
    renderTimes: [],
    scrollTimes: [],
    clickTimes: [],
  };

  const measureOperation = (operation, type = "render") => {
    const start = performance.now();

    const finish = () => {
      const end = performance.now();
      const duration = end - start;

      metrics[`${type}Times`].push(duration);

      // Keep only last 100 measurements
      if (metrics[`${type}Times`].length > 100) {
        metrics[`${type}Times`].shift();
      }

      // Warn if operation takes too long
      if (duration > 16.67) {
        // Longer than 1 frame (60fps)
        console.warn(
          `Slow ${type} operation detected: ${duration.toFixed(2)}ms`,
        );
      }
    };

    if (operation instanceof Promise) {
      return operation.then((result) => {
        finish();
        return result;
      });
    } else {
      const result = operation();
      finish();
      return result;
    }
  };

  const getAverageTime = (type = "render") => {
    const times = metrics[`${type}Times`];
    if (times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  };

  return {
    measureOperation,
    getAverageTime,
    getMetrics: () => ({ ...metrics }),
  };
};

/**
 * Browser feature detection for progressive enhancement
 */
export const getFeatureSupport = () => ({
  intersectionObserver: "IntersectionObserver" in window,
  webp: (() => {
    const canvas = document.createElement("canvas");
    return canvas.toDataURL("image/webp").indexOf("webp") > -1;
  })(),
  css: {
    grid: CSS.supports("display", "grid"),
    flexbox: CSS.supports("display", "flex"),
    customProperties: CSS.supports("color", "var(--fake-var)"),
    backdropFilter: CSS.supports("backdrop-filter", "blur(1px)"),
  },
  prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches,
  touch: "ontouchstart" in window,
});

/**
 * Initialize all performance optimizations
 */
export const initializePerformanceOptimizations = () => {
  // Add resource hints
  addResourceHints();

  // Set up critical rendering path optimizations
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      // Defer non-critical JavaScript
      const scripts = document.querySelectorAll('script[data-defer="true"]');
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        newScript.src = script.src;
        newScript.async = true;
        document.body.appendChild(newScript);
      });
    });
  }

  // Monitor performance
  const monitor = createPerformanceMonitor();

  // Add scroll performance monitoring
  const optimizedScrollHandler = createOptimizedScrollHandler(() => {
    monitor.measureOperation(() => {
      // Scroll handler logic here
    }, "scroll");
  });

  window.addEventListener("scroll", optimizedScrollHandler, { passive: true });

  return {
    monitor,
    features: getFeatureSupport(),
    cleanup: () => {
      window.removeEventListener("scroll", optimizedScrollHandler);
    },
  };
};
