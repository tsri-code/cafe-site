import React, { useState, useEffect } from "react";
import useActiveSection from "../../hooks/useActiveSection";
import { smoothScrollTo, scrollToTop } from "../../utils/smoothScroll";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const Header = () => {
  const { isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  // Track active section
  const sectionIds = ["hero", "recipes", "reservation", "menu", "about"];
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    if (sectionId === "hero") {
      scrollToTop();
    } else {
      smoothScrollTo(sectionId);
    }
    setIsMobileMenuOpen(false);
    setHoveredLink(null); // Clear hover state on click
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const headerStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: isDark
      ? isScrolled
        ? "rgba(26, 26, 26, 0.95)"
        : "rgba(26, 26, 26, 0.90)"
      : isScrolled
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(255, 255, 255, 0.90)",
    backdropFilter: "blur(20px)",
    borderBottom: isScrolled
      ? `1px solid ${isDark ? "rgba(212, 175, 55, 0.2)" : "rgba(109, 78, 55, 0.2)"}`
      : `1px solid ${isDark ? "rgba(212, 175, 55, 0.1)" : "rgba(109, 78, 55, 0.1)"}`,
    boxShadow: isScrolled
      ? isDark
        ? "0 4px 20px rgba(0, 0, 0, 0.3)"
        : "0 4px 20px rgba(0, 0, 0, 0.1)"
      : isDark
        ? "0 2px 10px rgba(0, 0, 0, 0.2)"
        : "0 2px 10px rgba(0, 0, 0, 0.05)",
    zIndex: 1000,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    padding: isScrolled ? "0.75rem 0" : "1rem 0",
    height: isScrolled ? "60px" : "70px",
  };

  const navStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 2rem",
    maxWidth: "1200px",
    margin: "0 auto",
    height: "100%",
    overflow: "visible",
  };

  const logoStyles = {
    height: isScrolled ? "100px" : "120px",
    width: "auto",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    opacity: 1,
  };

  const desktopLinksStyles = {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  };

  const getLinkStyles = (linkId, isActive, isHovered) => ({
    color: isActive
      ? "var(--accent-gold)"
      : isHovered
        ? isDark
          ? "var(--accent-gold)"
          : "var(--coffee-dark)"
        : "var(--text-secondary)",
    textDecoration: "none",
    fontWeight: isActive ? "600" : "500",
    fontSize: "15px",
    padding: "0.6rem 1rem",
    borderRadius: "0.5rem",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    position: "relative",
    backgroundColor: isHovered
      ? isDark
        ? "rgba(212, 175, 55, 0.1)"
        : "var(--coffee-cream)"
      : "transparent",
    transform: isHovered ? "translateY(-1px)" : "translateY(0)",
    boxShadow: isHovered
      ? isDark
        ? "0 4px 12px rgba(0, 0, 0, 0.3)"
        : "0 4px 12px rgba(0, 0, 0, 0.1)"
      : "none",
  });

  // Mobile hamburger styles
  const hamburgerStyles = {
    display: "none",
    flexDirection: "column",
    cursor: "pointer",
    padding: "0.5rem",
    zIndex: 1001,
    transition: "transform 0.2s ease",
  };

  const hamburgerLineStyles = (index) => ({
    width: "25px",
    height: "3px",
    backgroundColor: isDark ? "var(--text-primary)" : "var(--coffee-dark)",
    margin: "3px 0",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    transformOrigin: "center",
    transform: isMobileMenuOpen
      ? index === 0
        ? "rotate(45deg) translate(7px, 7px)"
        : index === 1
          ? "opacity(0)"
          : "rotate(-45deg) translate(7px, -7px)"
      : "none",
  });

  // Mobile menu overlay styles
  const mobileMenuStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isDark
      ? "rgba(26, 26, 26, 0.98)"
      : "rgba(255, 255, 255, 0.98)",
    backdropFilter: "blur(20px)",
    display: isMobileMenuOpen ? "flex" : "none",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    zIndex: 999,
    opacity: isMobileMenuOpen ? 1 : 0,
    transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const mobileNavLinks = [
    { id: "hero", label: "Home" },
    { id: "recipes", label: "Recipes" },
    { id: "reservation", label: "Book a Table" },
    { id: "menu", label: "Menu" },
    { id: "about", label: "About" },
  ];

  const desktopNavLinks = [
    { id: "recipes", label: "Recipes" },
    { id: "reservation", label: "Book a Table" },
    { id: "menu", label: "Menu" },
    { id: "about", label: "About" },
  ];

  return (
    <>
      <header style={headerStyles}>
        <nav style={navStyles}>
          <img
            src={
              isDark
                ? `${import.meta.env.BASE_URL}images/darklogo.png`
                : `${import.meta.env.BASE_URL}images/lightlogo.png`
            }
            alt="Coffee Shop Logo"
            style={logoStyles}
            onClick={() => handleNavClick("hero")}
          />

          {/* Desktop Navigation */}
          <ul style={desktopLinksStyles} className="desktop-nav">
            {desktopNavLinks.map((link) => (
              <li key={link.id}>
                <span
                  style={getLinkStyles(
                    link.id,
                    activeSection === link.id,
                    hoveredLink === link.id,
                  )}
                  onClick={() => handleNavClick(link.id)}
                  onMouseEnter={() => setHoveredLink(link.id)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "8px",
                        left: "50%",
                        width: "4px",
                        height: "4px",
                        backgroundColor: "var(--accent-gold)",
                        borderRadius: "50%",
                        transform: "translateX(-50%)",
                        transition: "all 0.2s ease",
                      }}
                    />
                  )}
                </span>
              </li>
            ))}
          </ul>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Hamburger Menu */}
          <div
            style={hamburgerStyles}
            className="mobile-hamburger"
            onClick={toggleMobileMenu}
          >
            <div style={hamburgerLineStyles(0)}></div>
            <div style={hamburgerLineStyles(1)}></div>
            <div style={hamburgerLineStyles(2)}></div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={mobileMenuStyles}>
          {mobileNavLinks.map((link, index) => (
            <span
              key={link.id}
              style={{
                color:
                  activeSection === link.id
                    ? "var(--accent-gold)"
                    : "var(--text-secondary)",
                textDecoration: "none",
                fontWeight: activeSection === link.id ? "600" : "500",
                fontSize: "1.5rem",
                padding: "1rem 2rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`,
                opacity: isMobileMenuOpen ? 1 : 0,
                transform: isMobileMenuOpen
                  ? "translateY(0)"
                  : "translateY(20px)",
              }}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </span>
          ))}

          {/* Mobile Theme Toggle */}
          <div
            style={{
              padding: "1rem 2rem",
              display: "flex",
              justifyContent: "center",
              opacity: isMobileMenuOpen ? 1 : 0,
              transform: isMobileMenuOpen
                ? "translateY(0)"
                : "translateY(20px)",
              transition: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1) ${mobileNavLinks.length * 0.05}s`,
            }}
          >
            <ThemeToggle />
          </div>
        </div>
      )}

      <style>
        {`
          @media (max-width: 768px) {
            .desktop-nav {
              display: none !important;
            }
            .mobile-hamburger {
              display: flex !important;
            }
          }
          @media (min-width: 769px) {
            .mobile-hamburger {
              display: none !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Header;
