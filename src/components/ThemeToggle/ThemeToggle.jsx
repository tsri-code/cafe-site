import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const toggleContainerStyles = {
    position: "fixed",
    top: "100px",
    right: "2rem",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    backgroundColor: isDark
      ? "rgba(45, 24, 16, 0.95)"
      : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(12px)",
    borderRadius: "2rem",
    padding: "0.5rem 1rem",
    boxShadow: isDark
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${isDark ? "rgba(212, 175, 55, 0.2)" : "rgba(109, 78, 55, 0.15)"}`,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isHovered
      ? "scale(1.02) translateY(-1px)"
      : "scale(1) translateY(0)",
    cursor: "pointer",
  };

  const toggleButtonStyles = {
    position: "relative",
    width: "54px",
    height: "28px",
    backgroundColor: isDark ? "var(--accent-gold)" : "var(--coffee-light)",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
    overflow: "hidden",
  };

  const toggleSliderStyles = {
    position: "absolute",
    top: "2px",
    left: isDark ? "28px" : "2px",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: isDark ? "var(--coffee-dark)" : "var(--white)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
  };

  const labelStyles = {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: isDark ? "var(--text-primary)" : "var(--coffee-dark)",
    userSelect: "none",
    transition: "color 0.2s ease",
    letterSpacing: "0.025em",
  };

  return (
    <div
      style={toggleContainerStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={toggleTheme}
    >
      <button
        style={toggleButtonStyles}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <div style={toggleSliderStyles}>{isDark ? "🌙" : "☀️"}</div>
      </button>

      <span style={labelStyles}>{isDark ? "Dark" : "Light"}</span>
    </div>
  );
};

export default ThemeToggle;
