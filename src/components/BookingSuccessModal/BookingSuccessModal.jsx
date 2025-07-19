import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";

const BookingSuccessModal = ({ isOpen, onClose, bookingData }) => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else if (isVisible) {
      setIsClosing(true);
      // Restore body scroll
      document.body.style.overflow = "unset";
      // Wait for animation to complete before hiding
      setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 300);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isVisible]);

  // Format date and time
  const formatDateTime = (datetime) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const { date, time } = bookingData
    ? formatDateTime(bookingData.datetime)
    : { date: "", time: "" };

  // Memoized styles for better performance
  const overlayStyles = useMemo(
    () => ({
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      padding: "1rem",
      opacity: isOpen && !isClosing ? 1 : 0,
      transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backdropFilter: "blur(4px)",
    }),
    [isOpen, isClosing],
  );

  const modalStyles = useMemo(
    () => ({
      backgroundColor: "var(--bg-secondary)",
      borderRadius: "1rem",
      padding: "2rem",
      maxWidth: "500px",
      width: "100%",
      maxHeight: "90vh",
      overflow: "auto",
      position: "relative",
      boxShadow: isDark
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
        : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      border: `1px solid var(--border-light)`,
      transform:
        isOpen && !isClosing
          ? "scale(1) translateY(0)"
          : "scale(0.95) translateY(20px)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [isDark, isOpen, isClosing],
  );

  const headerStyles = useMemo(
    () => ({
      textAlign: "center",
      marginBottom: "1.5rem",
    }),
    [],
  );

  const iconStyles = useMemo(
    () => ({
      fontSize: "4rem",
      marginBottom: "1rem",
      animation: "bounce 1s ease-in-out",
    }),
    [],
  );

  const titleStyles = useMemo(
    () => ({
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "var(--text-primary)",
      marginBottom: "0.5rem",
      fontFamily: "var(--font-accent)",
    }),
    [],
  );

  const subtitleStyles = useMemo(
    () => ({
      fontSize: "1rem",
      color: "var(--text-secondary)",
      lineHeight: "1.5",
    }),
    [],
  );

  const detailsStyles = useMemo(
    () => ({
      backgroundColor: "var(--bg-primary)",
      borderRadius: "0.75rem",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      border: `1px solid var(--border-medium)`,
    }),
    [],
  );

  const detailItemStyles = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.75rem 0",
      borderBottom: `1px solid var(--border-light)`,
    }),
    [],
  );

  const detailLabelStyles = useMemo(
    () => ({
      fontWeight: "600",
      color: "var(--text-secondary)",
      fontSize: "0.9rem",
    }),
    [],
  );

  const detailValueStyles = useMemo(
    () => ({
      fontWeight: "600",
      color: "var(--text-primary)",
      textAlign: "right",
    }),
    [],
  );

  const buttonContainerStyles = useMemo(
    () => ({
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      marginTop: "1rem",
    }),
    [],
  );

  const buttonStyles = useMemo(
    () => ({
      padding: "0.75rem 1.5rem",
      borderRadius: "0.5rem",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      fontSize: "1rem",
    }),
    [],
  );

  const primaryButtonStyles = useMemo(
    () => ({
      ...buttonStyles,
      backgroundColor: "var(--accent-gold)",
      color: "var(--white)",
    }),
    [buttonStyles],
  );

  const closeButtonStyles = useMemo(
    () => ({
      position: "absolute",
      top: "1rem",
      right: "1rem",
      background: "transparent",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "var(--text-muted)",
      padding: "0.25rem",
      borderRadius: "0.25rem",
      transition: "all 0.2s ease",
      width: "2rem",
      height: "2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    [],
  );

  if (!isVisible && !isOpen) return null;

  return (
    <div
      style={overlayStyles}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        <button
          style={closeButtonStyles}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "var(--border-medium)";
            e.target.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "var(--text-muted)";
          }}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div style={headerStyles}>
          <div style={iconStyles}>🎉</div>
          <h2 style={titleStyles}>Booking Confirmed!</h2>
          <p style={subtitleStyles}>
            Your table has been successfully reserved. We look forward to
            serving you!
          </p>
        </div>

        {bookingData && (
          <div style={detailsStyles}>
            <div style={detailItemStyles}>
              <span style={detailLabelStyles}>Name</span>
              <span style={detailValueStyles}>{bookingData.name}</span>
            </div>
            <div style={detailItemStyles}>
              <span style={detailLabelStyles}>Email</span>
              <span style={detailValueStyles}>{bookingData.email}</span>
            </div>
            <div style={detailItemStyles}>
              <span style={detailLabelStyles}>Guests</span>
              <span style={detailValueStyles}>
                {bookingData.guests}{" "}
                {bookingData.guests === "1" ? "Guest" : "Guests"}
              </span>
            </div>
            <div style={detailItemStyles}>
              <span style={detailLabelStyles}>Date</span>
              <span style={detailValueStyles}>{date}</span>
            </div>
            <div style={{ ...detailItemStyles, borderBottom: "none" }}>
              <span style={detailLabelStyles}>Time</span>
              <span style={detailValueStyles}>{time}</span>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            📧 A confirmation email has been sent to your inbox
            <br />
            📞 Need to make changes? Call us at (555) 123-BREW
          </p>
        </div>

        <div style={buttonContainerStyles}>
          <button
            style={primaryButtonStyles}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "var(--coffee-medium)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "var(--shadow-lg)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "var(--accent-gold)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            Perfect! 👍
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translate3d(0, 0, 0);
            }
            40%, 43% {
              transform: translate3d(0, -8px, 0);
            }
            70% {
              transform: translate3d(0, -4px, 0);
            }
            90% {
              transform: translate3d(0, -2px, 0);
            }
          }

          @media (max-width: 768px) {
            .booking-modal {
              margin: 1rem;
              padding: 1.5rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BookingSuccessModal;
