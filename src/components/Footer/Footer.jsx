import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { isDark } = useTheme();
  const footerStyles = {
    backgroundColor: "var(--coffee-dark)",
    color: "var(--white)",
    padding: "2rem 2rem 1.5rem",
  };

  const contentStyles = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "3rem",
    alignItems: "start",
  };

  const logoStyles = {
    height: "120px",
    width: "auto",
    marginBottom: "1.5rem",
    opacity: 1,
  };

  const contactSectionStyles = {
    textAlign: "right",
  };

  const contactHeadingStyles = {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "var(--coffee-cream)",
    fontFamily: "var(--font-accent)",
  };

  const contactInfoStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  };

  const contactItemStyles = {
    color: "var(--coffee-cream)",
    fontSize: "1rem",
    textAlign: "right",
  };

  const copyrightStyles = {
    textAlign: "center",
    marginTop: "1.5rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    color: "var(--coffee-cream)",
    fontSize: "0.9rem",
  };

  return (
    <footer style={footerStyles}>
      <div style={contentStyles}>
        <div>
          <img
            src={
              isDark
                ? `${import.meta.env.BASE_URL}images/lightlogo.png`
                : `${import.meta.env.BASE_URL}images/darklogo.png`
            }
            alt="Coffee Shop Logo"
            style={logoStyles}
          />
        </div>
        <div style={contactSectionStyles}>
          <h3 style={contactHeadingStyles}>Contact Us</h3>
          <div style={contactInfoStyles}>
            <div style={contactItemStyles}>hello@oakandember.cafe</div>
            <div style={contactItemStyles}>(555) 123-BREW</div>
          </div>
        </div>
      </div>
      <div style={copyrightStyles}>&copy; 2025 Sridhar Tiwari</div>
    </footer>
  );
};

export default Footer;
