import React, { useState, useEffect } from "react";

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentProgress = window.pageYOffset;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;

      if (scrollHeight) {
        setScrollProgress((currentProgress / scrollHeight) * 100);
      }
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  const progressBarStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "3px",
    zIndex: 1001,
    backgroundColor: "rgba(212, 175, 55, 0.2)",
  };

  const progressFillStyles = {
    height: "100%",
    width: `${scrollProgress}%`,
    backgroundColor: "var(--accent-gold)",
    borderRadius: "0 2px 2px 0",
    boxShadow: "0 0 10px rgba(212, 175, 55, 0.5)",
    transition: "width 0.1s ease-out",
  };

  return (
    <div style={progressBarStyles}>
      <div style={progressFillStyles} />
    </div>
  );
};

export default ScrollProgress;
