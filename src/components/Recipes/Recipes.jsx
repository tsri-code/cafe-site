import React, { useState } from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { useTheme } from "../../context/ThemeContext";

const Recipes = () => {
  const { isDark } = useTheme();
  const [titleRef, titleVisible] = useScrollAnimation(0.3);
  const [videosRef, videosVisible] = useScrollAnimation(0.2);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  const sectionStyles = {
    padding: "6rem 2rem 5rem",
    backgroundColor: "var(--bg-secondary)",
    textAlign: "center",
    transition: "background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const titleStyles = {
    fontSize: "2.5rem",
    fontWeight: "600",
    color: "var(--text-primary)",
    marginBottom: "1rem",
    fontFamily: "var(--font-accent)",
    opacity: titleVisible ? 1 : 0,
    transform: titleVisible ? "translateY(0)" : "translateY(30px)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const subtitleStyles = {
    fontSize: "1.2rem",
    color: "var(--text-secondary)",
    marginBottom: "3rem",
    fontFamily: "var(--font-body)",
    opacity: titleVisible ? 1 : 0,
    transform: titleVisible ? "translateY(0)" : "translateY(20px)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
  };

  const videosContainerStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "3rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const getVideoCardStyles = (index, isHovered) => ({
    backgroundColor: "var(--bg-primary)",
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: isHovered ? "var(--shadow-xl)" : "var(--shadow-md)",
    border: `1px solid ${isHovered ? "var(--border-medium)" : "var(--border-light)"}`,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: videosVisible ? 1 : 0,
    transform: videosVisible
      ? isHovered
        ? "translateY(-8px) scale(1.02)"
        : "translateY(0) scale(1)"
      : "translateY(50px) scale(0.95)",
    transitionDelay: videosVisible ? `${index * 0.1}s` : "0s",
    willChange: "transform, box-shadow",
    cursor: "pointer",
  });

  const iframeContainerStyles = (isHovered) => ({
    position: "relative",
    borderRadius: "0.75rem",
    overflow: "hidden",
    marginBottom: "1rem",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isHovered ? "scale(1.02)" : "scale(1)",
    boxShadow: isHovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
  });

  const iframeStyles = {
    width: "100%",
    height: "250px",
    border: "none",
    display: "block",
    backgroundColor: isDark ? "#1a1a1a" : "#f8f9fa",
  };

  const overlayStyles = (isHovered) => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isHovered
      ? "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)"
      : "transparent",
    transition: "background 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: "none",
  });

  const captionStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1rem",
    color: "var(--text-secondary)",
    fontWeight: "500",
    padding: "0.5rem 0",
  };

  const recipeNameStyles = (isHovered) => ({
    color: isHovered ? "var(--accent-gold)" : "var(--text-secondary)",
    transition: "color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    fontWeight: "600",
  });

  const timeStyles = {
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    padding: "0.25rem 0.5rem",
    backgroundColor: "var(--bg-tertiary)",
    borderRadius: "0.5rem",
    border: "1px solid var(--border-light)",
  };

  const videoData = [
    {
      src: "https://www.youtube.com/embed/j6VlT_jUVPc?si=ICm7cEiUmDr8XoPb",
      title: "Aeropress Recipe",
      name: "Aeropress recipe",
      time: "~5 min",
    },
    {
      src: "https://www.youtube.com/embed/st571DYYTR8?si=sr36BIDf1b681BfY",
      title: "French Press Recipe",
      name: "French press recipe",
      time: "~15 min",
    },
  ];

  const handleVideoHover = (index) => {
    setHoveredVideo(index);
  };

  const handleVideoLeave = () => {
    setHoveredVideo(null);
  };

  return (
    <section id="recipes" style={sectionStyles}>
      <div ref={titleRef}>
        <h2 style={titleStyles}>Recipes</h2>
        <p style={subtitleStyles}>
          Check out some recipes we've collected for
          <br />
          your home-brewing convenience:
        </p>
      </div>
      <div ref={videosRef} style={videosContainerStyles}>
        {videoData.map((video, index) => (
          <div
            key={index}
            className="video-container"
            style={getVideoCardStyles(index, hoveredVideo === index)}
            onMouseEnter={() => handleVideoHover(index)}
            onMouseLeave={handleVideoLeave}
          >
            <div style={iframeContainerStyles(hoveredVideo === index)}>
              <iframe
                src={video.src}
                style={iframeStyles}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <div style={overlayStyles(hoveredVideo === index)} />
            </div>
            <div style={captionStyles}>
              <span style={recipeNameStyles(hoveredVideo === index)}>
                {video.name}
              </span>
              <span style={timeStyles}>{video.time}</span>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .video-container {
              transform: none !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .video-container {
              transform: none !important;
              transition: none !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Recipes;
