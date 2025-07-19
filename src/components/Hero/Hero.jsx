import React, { useState, useEffect, useMemo, useCallback } from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import useImageCarousel from "../../hooks/useImageCarousel";
import useTypewriter from "../../hooks/useTypewriter";
import { getTimeBasedGreeting, getCoffeeFact } from "../../utils/timeGreeting";
import {
  getCurrentStatus,
  getCurrentDayInfo,
  getPeakTimesInfo,
} from "../../utils/popularTimes";
import { useTheme } from "../../context/ThemeContext";
import {
  getOptimizedScrollHandler,
  getOptimizedTransition,
} from "../../utils/performance";
import { getFeatureSupport } from "../../utils/optimizationUtils";

const Hero = React.memo(() => {
  const { isDark } = useTheme();
  const [contentRef, contentVisible] = useScrollAnimation(0.2);
  const [imageRef, imageVisible] = useScrollAnimation(0.3);
  const [timeGreeting, setTimeGreeting] = useState(getTimeBasedGreeting());
  const [coffeeFact, setCoffeeFact] = useState(getCoffeeFact());
  const [scrollY, setScrollY] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(getCurrentStatus());
  const [dayInfo, setDayInfo] = useState(getCurrentDayInfo());
  const [peakInfo, setPeakInfo] = useState(getPeakTimesInfo());
  const [selectedDayIndex, setSelectedDayIndex] = useState(
    getCurrentDayInfo().currentDayIndex,
  );

  // Memoize carousel images to prevent recreation on every render
  const carouselImages = useMemo(
    () => [
      {
        src: "/images/1.png",
        alt: "Artisan coffee brewing",
        caption: "Crafted with passion & precision",
      },
      {
        src: "/images/2.png",
        alt: "Premium coffee experience",
        caption: "Quality you can taste in every sip",
      },
      {
        src: "/images/3.png",
        alt: "Coffee culture at its finest",
        caption: "Where great coffee meets community",
      },
    ],
    [],
  );

  const {
    currentImage,
    currentIndex,
    isTransitioning,
    isPlaying,
    goToNext,
    goToPrevious,
    goToSlide,
    pauseAutoPlay,
    resumeAutoPlay,
    totalSlides,
  } = useImageCarousel(carouselImages, 6000);

  // Typewriter effect for the main title
  const { displayText: typewriterText, isComplete } = useTypewriter(
    "Oak & Ember",
    150,
    1000,
  );

  // Memoize the optimized scroll handler
  const handleScroll = useCallback(
    getOptimizedScrollHandler(() => setScrollY(window.pageYOffset)),
    [],
  );

  // Update greeting every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeGreeting(getTimeBasedGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Update coffee fact every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCoffeeFact(getCoffeeFact());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Update popular times data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const newDayInfo = getCurrentDayInfo();
      setCurrentStatus(getCurrentStatus());
      setDayInfo(newDayInfo);
      setPeakInfo(getPeakTimesInfo());
      // Update selected day if the day actually changed
      setSelectedDayIndex(newDayInfo.currentDayIndex);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Helper function to get popularity for any day with unique patterns
  const getPopularityForDay = useCallback((dayIndex) => {
    return (hour) => {
      switch (dayIndex) {
        case 0: // Sunday - Relaxed study day
          if (hour >= 11 && hour <= 18) {
            if (hour === 11) return 60; // Slow start
            if (hour === 12) return 75; // Late brunch
            if (hour >= 13 && hour <= 15) return 85; // Peak study time
            if (hour >= 16 && hour <= 17) return 70; // Afternoon steady
            if (hour === 18) return 40; // Winding down
          }
          return 0;

        case 1: // Monday - "Need coffee" day
          if (hour >= 10 && hour <= 19) {
            if (hour === 10) return 80; // Monday morning caffeine rush
            if (hour === 11) return 85; // Pre-lunch energy boost
            if (hour >= 12 && hour <= 13) return 95; // Heavy lunch rush
            if (hour === 14) return 90; // Post-lunch slump coffee
            if (hour === 15) return 85; // Afternoon pick-me-up
            if (hour === 16) return 75; // Late afternoon
            if (hour >= 17 && hour <= 19) return 55; // Evening taper
          }
          return 0;

        case 2: // Tuesday - Peak work day
          if (hour >= 10 && hour <= 19) {
            if (hour === 10) return 70; // Steady morning
            if (hour === 11) return 80; // Building energy
            if (hour >= 12 && hour <= 14) return 100; // Busiest lunch (peak day)
            if (hour === 15) return 85; // Strong afternoon rush
            if (hour === 16) return 75; // Consistent flow
            if (hour >= 17 && hour <= 19) return 60; // Good evening traffic
          }
          return 0;

        case 3: // Wednesday - "Hump day" breaks
          if (hour >= 10 && hour <= 19) {
            if (hour === 10) return 65; // Regular morning
            if (hour === 11) return 75; // Pre-lunch
            if (hour >= 12 && hour <= 14) return 90; // Solid lunch rush
            if (hour === 15) return 90; // "Hump day" coffee break peak
            if (hour === 16) return 80; // Extended afternoon
            if (hour >= 17 && hour <= 19) return 50; // Normal evening
          }
          return 0;

        case 4: // Thursday - Preparing for weekend
          if (hour >= 10 && hour <= 19) {
            if (hour === 10) return 60; // Calmer morning
            if (hour === 11) return 70; // Steady build
            if (hour >= 12 && hour <= 14) return 85; // Good lunch rush
            if (hour === 15) return 75; // Moderate afternoon
            if (hour === 16) return 70; // Consistent
            if (hour >= 17 && hour <= 19) return 65; // Higher evening (weekend prep)
          }
          return 0;

        case 5: // Friday - Social & wind-down day
          if (hour >= 10 && hour <= 19) {
            if (hour === 10) return 55; // Relaxed start
            if (hour === 11) return 65; // Building slowly
            if (hour >= 12 && hour <= 14) return 80; // Moderate lunch
            if (hour === 15) return 70; // Afternoon socializing
            if (hour === 16) return 75; // Building to evening
            if (hour >= 17 && hour <= 19) return 85; // Friday evening social peak
          }
          return 0;

        case 6: // Saturday - Brunch & leisure day
          if (hour >= 11 && hour <= 18) {
            if (hour === 11) return 90; // Brunch rush start
            if (hour >= 12 && hour <= 13) return 95; // Peak brunch time
            if (hour === 14) return 85; // Post-brunch socializing
            if (hour >= 15 && hour <= 16) return 75; // Afternoon leisure
            if (hour >= 17 && hour <= 18) return 50; // Early evening wind down
          }
          return 0;

        default:
          return 0;
      }
    };
  }, []);

  // Handle day selection
  const handleDayClick = useCallback((dayIndex) => {
    setSelectedDayIndex(dayIndex);
  }, []);

  // Get day-specific characteristics
  const getDayCharacteristics = useCallback((dayIndex) => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const characteristics = {
      0: {
        // Sunday
        pattern: "Relaxed Study Day",
        peakTime: "1-3 PM (Study time)",
        avgStay: "2-2.5 hours",
        vibe: "Calm study sessions",
      },
      1: {
        // Monday
        pattern: "Monday Motivation",
        peakTime: "12-2 PM (Energy boost)",
        avgStay: "45 minutes",
        vibe: "Need caffeine energy",
      },
      2: {
        // Tuesday
        pattern: "Peak Productivity",
        peakTime: "12-2 PM (Busiest)",
        avgStay: "60 minutes",
        vibe: "Highest work activity",
      },
      3: {
        // Wednesday
        pattern: "Midweek Boost",
        peakTime: "3 PM (Hump day break)",
        avgStay: "75 minutes",
        vibe: "Extended coffee breaks",
      },
      4: {
        // Thursday
        pattern: "Weekend Prep",
        peakTime: "5-7 PM (Planning)",
        avgStay: "90 minutes",
        vibe: "Social preparation",
      },
      5: {
        // Friday
        pattern: "Social Wind-down",
        peakTime: "5-7 PM (Social time)",
        avgStay: "2+ hours",
        vibe: "Relaxed socializing",
      },
      6: {
        // Saturday
        pattern: "Brunch & Leisure",
        peakTime: "12-1 PM (Brunch)",
        avgStay: "2-3 hours",
        vibe: "Leisurely brunch",
      },
    };
    return characteristics[dayIndex] || characteristics[0];
  }, []);

  // Optimized parallax scroll effect
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Memoize styles that depend on props/state
  const heroStyles = useMemo(
    () => ({
      position: "relative",
      minHeight: "110vh",
      display: "flex",
      alignItems: "center",
      background: isDark
        ? "linear-gradient(135deg, var(--bg-accent) 0%, var(--bg-tertiary) 100%)"
        : "linear-gradient(135deg, #f8f0e7 0%, #f1e8d9 100%)",
      overflow: "hidden",
      paddingTop: "120px",
      paddingBottom: "2rem",
      ...getOptimizedTransition(),
    }),
    [isDark],
  );

  // Memoize parallax calculations to avoid recalculating on every scroll
  const parallaxTransforms = useMemo(() => {
    if (getFeatureSupport().prefersReducedMotion) {
      return {
        layer1: "translateY(0px)",
        layer2: "translate(0px, 0px)",
        layer3: "translate(0px, 0px)",
      };
    }

    return {
      layer1: `translateY(${scrollY * 0.5}px)`,
      layer2: `translate(${scrollY * 0.3}px, ${scrollY * 0.2}px)`,
      layer3: `translate(-${scrollY * 0.4}px, ${scrollY * 0.1}px)`,
    };
  }, [scrollY]);

  // Parallax background elements with optimized styles
  const parallaxLayer1Styles = useMemo(
    () => ({
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `url(/images/background_header.svg) repeat`,
      opacity: isDark ? 0.05 : 0.1,
      transform: parallaxTransforms.layer1,
      ...getOptimizedTransition("0.1s"),
    }),
    [isDark, parallaxTransforms.layer1],
  );

  const parallaxLayer2Styles = useMemo(
    () => ({
      position: "absolute",
      top: "20%",
      left: "10%",
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      backgroundColor: "var(--accent-gold)",
      opacity: isDark ? 0.1 : 0.2,
      transform: parallaxTransforms.layer2,
      ...getOptimizedTransition("0.1s"),
    }),
    [isDark, parallaxTransforms.layer2],
  );

  const parallaxLayer3Styles = useMemo(
    () => ({
      position: "absolute",
      bottom: "30%",
      right: "15%",
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "var(--coffee-light)",
      opacity: isDark ? 0.15 : 0.3,
      transform: parallaxTransforms.layer3,
      ...getOptimizedTransition("0.1s"),
    }),
    [isDark, parallaxTransforms.layer3],
  );

  const containerStyles = useMemo(
    () => ({
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 2rem",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "4rem",
      alignItems: "center",
      zIndex: 2,
      position: "relative",
    }),
    [],
  );

  const contentStyles = useMemo(
    () => ({
      maxWidth: "600px",
      opacity: contentVisible ? 1 : 0,
      transform: contentVisible ? "translateX(0)" : "translateX(-50px)",
      ...getOptimizedTransition("0.8s"),
    }),
    [contentVisible],
  );

  const greetingStyles = useMemo(
    () => ({
      fontSize: "1.2rem",
      color: "var(--accent-gold)",
      fontWeight: "600",
      marginBottom: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      opacity: contentVisible ? 1 : 0,
      transform: contentVisible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
    }),
    [contentVisible],
  );

  const titleStyles = useMemo(
    () => ({
      fontSize: "3.5rem",
      fontWeight: "700",
      lineHeight: "1.1",
      marginBottom: "1.5rem",
      color: "var(--text-primary)",
      fontFamily: "var(--font-accent)",
      opacity: contentVisible ? 1 : 0,
      transform: contentVisible ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
    }),
    [contentVisible],
  );

  const typewriterStyles = useMemo(
    () => ({
      display: "block",
      color: "var(--accent-gold)",
      fontStyle: "italic",
      fontSize: "4rem",
      minHeight: "4.5rem",
      position: "relative",
    }),
    [],
  );

  const cursorStyles = useMemo(
    () => ({
      display: isComplete ? "none" : "inline-block",
      width: "3px",
      height: "4rem",
      backgroundColor: "var(--accent-gold)",
      marginLeft: "2px",
      animation: "blink 1s infinite",
    }),
    [isComplete],
  );

  const subtitleStyles = useMemo(
    () => ({
      fontSize: "1.3rem",
      lineHeight: "1.6",
      color: "var(--text-secondary)",
      marginBottom: "1rem",
      fontFamily: "var(--font-body)",
      opacity: contentVisible ? 1 : 0,
      transform: contentVisible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s",
    }),
    [contentVisible],
  );

  const descriptionStyles = useMemo(
    () => ({
      fontSize: "1.1rem",
      lineHeight: "1.6",
      color: "var(--text-secondary)",
      marginBottom: "2rem",
      fontFamily: "var(--font-body)",
      opacity: contentVisible ? 1 : 0,
      transform: contentVisible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s",
    }),
    [contentVisible],
  );

  const coffeeFactStyles = useMemo(
    () => ({
      backgroundColor: isDark
        ? "rgba(255, 215, 0, 0.1)"
        : "rgba(204, 153, 0, 0.1)",
      border: "1px solid var(--accent-gold)",
      borderRadius: "0.5rem",
      padding: "1rem",
      marginBottom: "2rem",
      fontSize: "0.9rem",
      color: "var(--text-primary)",
      fontStyle: "italic",
      opacity: contentVisible ? 1 : 0,
      transform: contentVisible ? "translateY(0)" : "translateY(20px)",
      ...getOptimizedTransition("0.8s", "cubic-bezier(0.4, 0, 0.2, 1)"),
      transitionDelay: "0.6s",
    }),
    [isDark, contentVisible],
  );

  const imageContainerStyles = useMemo(
    () => ({
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: imageVisible ? 1 : 0,
      transform: imageVisible
        ? "translateX(0) scale(1)"
        : "translateX(50px) scale(0.9)",
      transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
    }),
    [imageVisible],
  );

  const carouselContainerStyles = useMemo(
    () => ({
      position: "relative",
      width: "100%",
      maxWidth: "500px",
      height: "400px",
      borderRadius: "1rem",
      boxShadow: "var(--shadow-xl)",
      backgroundColor: isDark ? "var(--bg-secondary)" : "var(--bg-primary)",
      padding: "1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    [isDark],
  );

  const imageStyles = useMemo(
    () => ({
      width: "calc(100% - 3rem)",
      height: "calc(100% - 3rem)",
      maxWidth: "420px",
      maxHeight: "320px",
      objectFit: "cover",
      borderRadius: "0.75rem",
      border: isDark ? "none" : `3px solid var(--coffee-medium)`,
      ...getOptimizedTransition("0.5s"),
      opacity: isTransitioning ? 0.7 : 1,
      filter: isDark
        ? "brightness(0.8) contrast(1.1)"
        : "brightness(1.05) contrast(1.1)",
      boxShadow: isDark
        ? "0 8px 32px rgba(0, 0, 0, 0.3)"
        : "0 8px 32px rgba(0, 0, 0, 0.1)",
    }),
    [isTransitioning, isDark],
  );

  // Optimize carousel control handlers
  const handlePrevious = useCallback(() => {
    goToPrevious();
  }, [goToPrevious]);

  const handleNext = useCallback(() => {
    goToNext();
  }, [goToNext]);

  const handleSlideClick = useCallback(
    (index) => {
      goToSlide(index);
    },
    [goToSlide],
  );

  // Rest of the component styles remain the same but memoized
  const carouselControlsStyles = useMemo(
    () => ({
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: isDark
        ? "rgba(45, 24, 16, 0.8)"
        : "rgba(255, 255, 255, 0.8)",
      border: "none",
      borderRadius: "50%",
      width: "28px",
      height: "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "14px",
      color: isDark ? "var(--accent-gold)" : "var(--coffee-dark)",
      ...getOptimizedTransition(),
      zIndex: 3,
      backdropFilter: "blur(4px)",
    }),
    [isDark],
  );

  const hoursStyles = useMemo(
    () => ({
      marginTop: "3rem",
      padding: "1.5rem",
      backgroundColor: "var(--bg-secondary)",
      borderRadius: "1rem",
      boxShadow: "var(--shadow-md)",
      border: "1px solid var(--border-light)",
      opacity: contentVisible ? 1 : 0,
      transform: contentVisible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s",
    }),
    [contentVisible],
  );

  return (
    <section id="hero" style={heroStyles}>
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>

      {/* Parallax Background Elements */}
      <div style={parallaxLayer1Styles}></div>
      <div style={parallaxLayer2Styles}></div>
      <div style={parallaxLayer3Styles}></div>

      <div style={containerStyles}>
        <div ref={contentRef} style={contentStyles}>
          <h1 style={titleStyles}>
            <span style={typewriterStyles}>
              {typewriterText}
              <span style={cursorStyles}></span>
            </span>
          </h1>

          <p style={subtitleStyles}>Where warmth meets craft</p>

          <p style={descriptionStyles}>
            Coffee that comforts, energy that lingers
          </p>

          <p style={descriptionStyles}>
            Settle in. Whether you're deep in thought or catching up with a
            friend, our space was made to hold moments that matter.
          </p>

          <div style={coffeeFactStyles}>💡 {coffeeFact}</div>

          <div style={hoursStyles}>
            <div
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                lineHeight: "1.6",
              }}
            >
              <strong>Hours:</strong>
              <br />
              Monday – Friday (10:00 – 19:00)
              <br />
              Saturday – Sunday (11:00 – 18:00)
              <br />
              <br />
              {/* Popular Times Widget */}
              <div
                style={{
                  backgroundColor: isDark
                    ? "var(--bg-secondary)"
                    : "var(--bg-tertiary)",
                  border: `1px solid ${isDark ? "var(--border-medium)" : "var(--border-light)"}`,
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor:
                        selectedDayIndex === dayInfo.currentDayIndex
                          ? currentStatus.level === "high"
                            ? "#ff6b6b"
                            : currentStatus.level === "medium"
                              ? "#ffa726"
                              : currentStatus.level === "low"
                                ? "#66bb6a"
                                : "#9e9e9e"
                          : "#6c7293", // Neutral color for pattern view
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                    }}
                  >
                    {
                      selectedDayIndex === dayInfo.currentDayIndex
                        ? "👥"
                        : selectedDayIndex === 0
                          ? "📚" // Sunday - study
                          : selectedDayIndex === 1
                            ? "☕" // Monday - need coffee
                            : selectedDayIndex === 2
                              ? "💼" // Tuesday - peak work
                              : selectedDayIndex === 3
                                ? "⚡" // Wednesday - energy boost
                                : selectedDayIndex === 4
                                  ? "🎯" // Thursday - planning
                                  : selectedDayIndex === 5
                                    ? "🎉" // Friday - social
                                    : "🥐" // Saturday - brunch
                    }
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "var(--text-primary)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {selectedDayIndex === dayInfo.currentDayIndex
                        ? currentStatus.status
                        : getDayCharacteristics(selectedDayIndex).pattern}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {selectedDayIndex === dayInfo.currentDayIndex
                        ? currentStatus.detail
                        : `${getDayCharacteristics(selectedDayIndex).vibe} • Peak: ${getDayCharacteristics(selectedDayIndex).peakTime}`}
                    </div>
                  </div>
                </div>

                {/* Day indicators */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {dayInfo.dayNames.map((day, index) => (
                    <div
                      key={day}
                      style={{
                        fontWeight: index === selectedDayIndex ? "600" : "400",
                        color:
                          index === selectedDayIndex
                            ? "var(--accent-gold)"
                            : "var(--text-muted)",
                        cursor: "pointer",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        backgroundColor:
                          index === selectedDayIndex
                            ? isDark
                              ? "rgba(201, 169, 110, 0.2)"
                              : "rgba(204, 153, 0, 0.1)"
                            : "transparent",
                        transition: "all 0.2s ease",
                        userSelect: "none",
                      }}
                      onClick={() => handleDayClick(index)}
                      onMouseEnter={(e) => {
                        if (index !== selectedDayIndex) {
                          e.target.style.backgroundColor = isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(90, 62, 43, 0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (index !== selectedDayIndex) {
                          e.target.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {day}
                      {index === dayInfo.currentDayIndex && (
                        <div
                          style={{
                            fontSize: "0.5rem",
                            textAlign: "center",
                            marginTop: "1px",
                            opacity: 0.7,
                          }}
                        >
                          •
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Popularity bars for current day */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "space-between",
                    height: "60px",
                    gap: "2px",
                    marginBottom: "0.5rem",
                  }}
                >
                  {Array.from({ length: 18 }, (_, index) => {
                    const hour = index + 6; // 6am to 11pm
                    const getPopularityForSelectedDay =
                      getPopularityForDay(selectedDayIndex);
                    const popularity = getPopularityForSelectedDay(hour);

                    const isCurrentHour =
                      hour === dayInfo.currentHour &&
                      selectedDayIndex === dayInfo.currentDayIndex;
                    const barHeight = Math.max(2, (popularity / 100) * 50);

                    return (
                      <div
                        key={hour}
                        style={{
                          height: `${barHeight}px`,
                          backgroundColor: isCurrentHour
                            ? "var(--accent-gold)"
                            : popularity > 0
                              ? isDark
                                ? "rgba(255, 255, 255, 0.3)"
                                : "rgba(90, 62, 43, 0.3)"
                              : isDark
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(90, 62, 43, 0.1)",
                          width: "100%",
                          maxWidth: "12px",
                          borderRadius: "2px",
                          position: "relative",
                          transition: "all 0.2s ease",
                        }}
                        title={`${hour === 12 ? "12pm" : hour > 12 ? `${hour - 12}pm` : `${hour}am`}: ${popularity > 0 ? "Open" : "Closed"}`}
                      >
                        {isCurrentHour && (
                          <div
                            style={{
                              position: "absolute",
                              top: "-8px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              fontSize: "8px",
                              color: "var(--accent-gold)",
                            }}
                          >
                            ▼
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Time labels */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.6rem",
                    color: "var(--text-muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span>6am</span>
                  <span>9am</span>
                  <span>12pm</span>
                  <span>3pm</span>
                  <span>6pm</span>
                  <span>9pm</span>
                </div>

                {/* Peak times info */}
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    textAlign: "center",
                    borderTop: `1px solid ${isDark ? "var(--border-light)" : "var(--border-light)"}`,
                    paddingTop: "0.5rem",
                  }}
                >
                  ⏱️{" "}
                  {selectedDayIndex === dayInfo.currentDayIndex
                    ? selectedDayIndex === 0 || selectedDayIndex === 6
                      ? "People typically spend up to 2 hours here"
                      : "People typically spend up to 90 minutes here"
                    : `Typical stay: ${getDayCharacteristics(selectedDayIndex).avgStay}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={imageRef} style={imageContainerStyles}>
          <div
            style={carouselContainerStyles}
            onMouseEnter={pauseAutoPlay}
            onMouseLeave={resumeAutoPlay}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              style={imageStyles}
              loading="lazy"
            />

            {/* Carousel Controls */}
            <button
              style={{ ...carouselControlsStyles, left: "0.5rem" }}
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              style={{ ...carouselControlsStyles, right: "0.5rem" }}
              onClick={handleNext}
              aria-label="Next image"
            >
              ›
            </button>

            {/* Carousel Indicators */}
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "0.5rem",
                zIndex: 3,
              }}
            >
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor:
                      index === currentIndex
                        ? "var(--accent-gold)"
                        : isDark
                          ? "rgba(255, 255, 255, 0.5)"
                          : "rgba(90, 62, 43, 0.4)",
                    border: isDark
                      ? "none"
                      : index === currentIndex
                        ? "2px solid var(--accent-gold)"
                        : "1px solid rgba(90, 62, 43, 0.3)",
                    cursor: "pointer",
                    ...getOptimizedTransition(),
                  }}
                  onClick={() => handleSlideClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Image Caption */}
            <div
              style={{
                position: "absolute",
                bottom: "2.875rem",
                left: "1rem",
                right: "1rem",
                backgroundColor: isDark
                  ? "rgba(45, 24, 16, 0.9)"
                  : "rgba(0, 0, 0, 0.7)",
                color: isDark ? "var(--text-primary)" : "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                textAlign: "center",
                zIndex: 3,
                ...getOptimizedTransition(),
              }}
            >
              {currentImage.caption}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

export default Hero;
