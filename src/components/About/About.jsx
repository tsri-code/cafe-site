import React from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { useTheme } from "../../context/ThemeContext";

const About = () => {
  const { isDark } = useTheme();
  const [contentRef, contentVisible] = useScrollAnimation(0.3);
  const [circlesRef, circlesVisible] = useScrollAnimation(0.2);

  const sectionStyles = {
    position: "relative",
    padding: "6rem 2rem 5rem",
    backgroundColor: "var(--bg-primary)",
    background: isDark
      ? "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%)"
      : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
    overflow: "hidden",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const containerStyles = {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "4rem",
    alignItems: "center",
  };

  const contentStyles = {
    zIndex: 2,
    position: "relative",
    opacity: contentVisible ? 1 : 0,
    transform: contentVisible ? "translateX(0)" : "translateX(-50px)",
    transition: "all 0.8s ease",
  };

  const titleStyles = {
    fontSize: "2.5rem",
    fontWeight: "600",
    color: "var(--text-primary)",
    marginBottom: "2rem",
    fontFamily: "var(--font-accent)",
    opacity: contentVisible ? 1 : 0,
    transform: contentVisible ? "translateY(0)" : "translateY(30px)",
    transition: "all 0.6s ease 0.2s",
  };

  const paragraphStyles = (index) => ({
    fontSize: "1.1rem",
    lineHeight: "1.8",
    color: "var(--text-secondary)",
    marginBottom: "1.5rem",
    fontFamily: "var(--font-body)",
    opacity: contentVisible ? 1 : 0,
    transform: contentVisible ? "translateY(0)" : "translateY(20px)",
    transition: `all 0.6s ease ${0.3 + index * 0.1}s`,
  });

  const circlesContainerStyles = {
    position: "relative",
    height: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: circlesVisible ? 1 : 0,
    transform: circlesVisible ? "scale(1)" : "scale(0.8)",
    transition: "all 0.8s ease 0.3s",
  };

  const circle1Styles = {
    position: "absolute",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    backgroundColor: "var(--accent-gold)",
    opacity: circlesVisible ? (isDark ? 0.2 : 0.4) : 0,
    animation: circlesVisible ? "float 6s ease-in-out infinite" : "none",
    transition: "opacity 0.8s ease 0.5s",
  };

  const circle2Styles = {
    position: "absolute",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    backgroundColor: "var(--coffee-light)",
    opacity: circlesVisible ? (isDark ? 0.15 : 0.3) : 0,
    top: "50px",
    right: "20px",
    animation: circlesVisible
      ? "float 8s ease-in-out infinite reverse"
      : "none",
    transition: "opacity 0.8s ease 0.7s",
  };

  const circle3Styles = {
    position: "absolute",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "var(--accent-orange)",
    opacity: circlesVisible ? (isDark ? 0.1 : 0.2) : 0,
    top: "20px",
    left: "30px",
    animation: circlesVisible ? "float 5s ease-in-out infinite" : "none",
    transition: "opacity 0.8s ease 0.9s",
  };

  const circle4Styles = {
    position: "absolute",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "var(--accent-sage)",
    opacity: circlesVisible ? (isDark ? 0.08 : 0.15) : 0,
    bottom: "30px",
    right: "60px",
    animation: circlesVisible ? "float 7s ease-in-out infinite" : "none",
    transition: "opacity 0.8s ease 1.1s",
  };

  const paragraphData = [
    "Oak & Ember is a quiet refuge for slow mornings, focused afternoons, and glowing conversation. With just six welcoming tables, free Wi-Fi, and a love for detail, we keep things simple and soulful.",
    "We exist to keep you cozy and fueled — mindfully. That's why we've said goodbye to single-use cups. Bring your own or take home one of our timeless reusables.",
  ];

  return (
    <section id="about" style={sectionStyles}>
      <div style={containerStyles}>
        <div ref={contentRef} style={contentStyles}>
          <h2 style={titleStyles}>About The Coffee Shop</h2>
          {paragraphData.map((text, index) => (
            <p key={index} style={paragraphStyles(index)}>
              {text}
            </p>
          ))}
        </div>

        <div ref={circlesRef} style={circlesContainerStyles}>
          <div style={circle1Styles}></div>
          <div style={circle2Styles}></div>
          <div style={circle3Styles}></div>
          <div style={circle4Styles}></div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }

          @media (max-width: 768px) {
            #about .about-grid {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
              text-align: center;
            }

            #about .circles-container {
              height: 200px !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            @keyframes float {
              0%, 100% { transform: translateY(0); }
            }
          }
        `}
      </style>
    </section>
  );
};

export default About;
