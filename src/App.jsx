import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { initializePerformanceOptimizations } from "./utils/optimizationUtils";
import { initPerformanceMonitoring } from "./utils/performance";

// Import components
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Menu from "./components/Menu/Menu";
import Recipes from "./components/Recipes/Recipes";
import Reservation from "./components/Reservation/Reservation";
import Footer from "./components/Footer/Footer";

function App() {
  useEffect(() => {
    // Initialize performance optimizations
    const optimizations = initializePerformanceOptimizations();
    const monitoring = initPerformanceMonitoring();

    // Preload critical resources
    const criticalImages = [
      "/images/logo_coffeeshop_dark.svg",
      "/images/logo_coffeeshop_light.svg",
      "/images/background_header.svg",
      "/images/1.png",
      "/images/2.png",
      "/images/3.png",
    ];

    // Preload images asynchronously
    import("./utils/performance").then(({ preloadCriticalImages }) => {
      preloadCriticalImages(criticalImages).catch(console.warn);
    });

    // Set up viewport meta tag for proper mobile rendering
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=5.0";
    }

    // Add performance hints to document head
    const head = document.head;

    // Add preload for critical CSS
    if (!document.querySelector('link[rel="preload"][as="style"]')) {
      const preloadCSS = document.createElement("link");
      preloadCSS.rel = "preload";
      preloadCSS.as = "style";
      preloadCSS.href = "/src/assets/styles/index.css";
      head.appendChild(preloadCSS);
    }

    // Add DNS prefetch for external resources
    if (!document.querySelector('link[rel="dns-prefetch"]')) {
      const dnsPrefetch = document.createElement("link");
      dnsPrefetch.rel = "dns-prefetch";
      dnsPrefetch.href = "//fonts.googleapis.com";
      head.appendChild(dnsPrefetch);
    }

    // Cleanup on unmount
    return () => {
      if (optimizations.cleanup) {
        optimizations.cleanup();
      }
      if (monitoring.cleanup) {
        monitoring.cleanup();
      }
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div
          className="App"
          style={{
            minHeight: "100vh",
            position: "relative",
            isolation: "isolate", // Create stacking context for better performance
          }}
        >
          <Header />
          <main
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <Recipes />
                    <Reservation />
                    <Menu />
                    <About />
                  </>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
