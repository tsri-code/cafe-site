import React, { useState, useRef, useMemo, useCallback } from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { useTheme } from "../../context/ThemeContext";
import BookingSuccessModal from "../BookingSuccessModal/BookingSuccessModal";
import {
  validateForm,
  validateName,
  validateEmail,
  validateGuests,
  validateDateTime,
  getMinBookingDateTime,
  getMaxBookingDateTime,
} from "../../utils/formValidation";

const Reservation = () => {
  const { isDark } = useTheme();
  const [titleRef, titleVisible] = useScrollAnimation(0.3);
  const [formRef, formVisible] = useScrollAnimation(0.2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    guests: "",
    datetime: "",
    email: "",
    agreedToTerms: false,
  });

  const nameRef = useRef(null);
  const guestsRef = useRef(null);
  const datetimeRef = useRef(null);
  const emailRef = useRef(null);

  // Real-time validation for individual fields
  const validateField = useCallback((fieldName, value) => {
    let validation;

    switch (fieldName) {
      case "name":
        validation = validateName(value);
        break;
      case "email":
        validation = validateEmail(value);
        break;
      case "guests":
        validation = validateGuests(value);
        break;
      case "datetime":
        validation = validateDateTime(value);
        break;
      default:
        return;
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: validation.isValid ? null : validation.error,
    }));
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      // Real-time validation for non-checkbox fields
      if (type !== "checkbox" && touched[name]) {
        validateField(name, newValue);
      }
    },
    [touched, validateField],
  );

  const handleInputBlur = useCallback(
    (e) => {
      const { name, value } = e.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      validateField(name, value);
    },
    [validateField],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate entire form
    const validation = validateForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched({
        name: true,
        email: true,
        guests: true,
        datetime: true,
      });
      setIsSubmitting(false);
      return;
    }

    // Clear any existing errors
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Reservation submitted:", formData);

      // Store booking data for modal
      setCompletedBooking({ ...formData });
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        name: "",
        guests: "",
        datetime: "",
        email: "",
        agreedToTerms: false,
      });
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error("Reservation error:", error);
      alert(
        "Sorry, there was an error processing your reservation. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoized styles for better performance
  const sectionStyles = useMemo(
    () => ({
      padding: "6rem 2rem 5rem",
      backgroundColor: "var(--bg-primary)",
      transition: "background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [],
  );

  const containerStyles = useMemo(
    () => ({
      maxWidth: "600px",
      margin: "0 auto",
      textAlign: "center",
    }),
    [],
  );

  const titleStyles = useMemo(
    () => ({
      fontSize: "2.5rem",
      fontWeight: "600",
      color: "var(--text-primary)",
      marginBottom: "3rem",
      fontFamily: "var(--font-accent)",
      opacity: titleVisible ? 1 : 0,
      transform: titleVisible ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.6s ease",
    }),
    [titleVisible],
  );

  const formStyles = useMemo(
    () => ({
      backgroundColor: "var(--bg-secondary)",
      border: `1px solid var(--border-light)`,
      padding: "2.5rem",
      borderRadius: "1rem",
      boxShadow: "var(--shadow-lg)",
      textAlign: "left",
      opacity: formVisible ? 1 : 0,
      transform: formVisible ? "translateY(0)" : "translateY(50px)",
      transition: "all 0.6s ease 0.2s",
    }),
    [formVisible],
  );

  const getInputContainerStyles = useCallback(
    (index) => ({
      marginBottom: "1.5rem",
      opacity: formVisible ? 1 : 0,
      transform: formVisible ? "translateX(0)" : "translateX(-20px)",
      transition: `all 0.5s ease ${0.3 + index * 0.1}s`,
    }),
    [formVisible],
  );

  const getInputStyles = useCallback(
    (fieldName, hasError) => ({
      width: "100%",
      padding: "1rem",
      border: `2px solid ${hasError ? "var(--accent-orange)" : "var(--border-medium)"}`,
      borderRadius: "0.5rem",
      fontSize: "1rem",
      backgroundColor: "var(--bg-primary)",
      color: "var(--text-primary)",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      outline: "none",
    }),
    [],
  );

  const labelStyles = useMemo(
    () => ({
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "500",
      color: "var(--text-primary)",
    }),
    [],
  );

  const errorStyles = useMemo(
    () => ({
      color: "var(--accent-orange)",
      fontSize: "0.85rem",
      marginTop: "0.5rem",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
    }),
    [],
  );

  const getButtonStyles = useCallback(
    () => ({
      width: "100%",
      padding: "1rem",
      backgroundColor: isSubmitting
        ? "var(--border-medium)"
        : isButtonHovered
          ? "var(--coffee-medium)" // Same hover color for both themes
          : "var(--accent-gold)", // Same base color for both themes
      color: isSubmitting ? "var(--text-muted)" : "var(--white)", // Always white text for better contrast
      border: "none",
      borderRadius: "0.5rem",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: isSubmitting ? "not-allowed" : "pointer",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      opacity: formVisible ? 1 : 0,
      transform: formVisible
        ? isButtonHovered && !isSubmitting
          ? "translateY(-2px)"
          : "translateY(0)"
        : "translateY(20px)",
      transitionDelay: "0.8s",
      boxShadow: isButtonHovered && !isSubmitting ? "var(--shadow-lg)" : "none",
    }),
    [isSubmitting, isButtonHovered, formVisible],
  );

  const checkboxContainerStyles = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "2rem",
      opacity: formVisible ? 1 : 0,
      transform: formVisible ? "translateX(0)" : "translateX(-20px)",
      transition: "all 0.5s ease 0.7s",
    }),
    [formVisible],
  );

  const checkboxStyles = useMemo(
    () => ({
      width: "1.2rem",
      height: "1.2rem",
      cursor: "pointer",
      accentColor: "var(--accent-gold)",
    }),
    [],
  );

  const checkboxLabelStyles = useMemo(
    () => ({
      color: "var(--text-secondary)",
      fontSize: "0.9rem",
      cursor: "pointer",
      userSelect: "none",
    }),
    [],
  );

  const formFields = useMemo(
    () => [
      {
        name: "name",
        type: "text",
        label: "Name *",
        placeholder: "John Doe",
      },
      {
        name: "guests",
        type: "number",
        label: "Number of guests *",
        placeholder: "1-8 guests",
        min: "1",
        max: "8",
      },
      {
        name: "datetime",
        type: "datetime-local",
        label: "Date & time *",
        placeholder: "",
        min: getMinBookingDateTime(),
        max: getMaxBookingDateTime(),
      },
      {
        name: "email",
        type: "email",
        label: "Your email *",
        placeholder: "john@example.com",
      },
    ],
    [],
  );

  const handleCloseModal = useCallback(() => {
    setShowSuccessModal(false);
    setCompletedBooking(null);
  }, []);

  return (
    <section id="reservation" style={sectionStyles}>
      <div style={containerStyles}>
        <div ref={titleRef}>
          <h2 style={titleStyles}>Book a table</h2>
        </div>

        <form
          ref={formRef}
          style={formStyles}
          onSubmit={handleSubmit}
          noValidate
        >
          {formFields.map((field, index) => {
            const hasError = errors[field.name] && touched[field.name];

            return (
              <div key={field.name} style={getInputContainerStyles(index)}>
                <label htmlFor={field.name} style={labelStyles}>
                  {field.label}
                </label>
                <input
                  ref={
                    field.name === "name"
                      ? nameRef
                      : field.name === "guests"
                        ? guestsRef
                        : field.name === "datetime"
                          ? datetimeRef
                          : field.name === "email"
                            ? emailRef
                            : null
                  }
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  style={getInputStyles(field.name, hasError)}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent-gold)";
                    e.target.style.boxShadow = `0 0 0 3px ${isDark ? "rgba(255, 215, 0, 0.2)" : "rgba(204, 153, 0, 0.1)"}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = hasError
                      ? "var(--accent-orange)"
                      : "var(--border-medium)";
                    e.target.style.boxShadow = "none";
                    handleInputBlur(e);
                  }}
                  required
                />
                {hasError && (
                  <div style={errorStyles}>
                    <span>⚠️</span>
                    <span>{errors[field.name]}</span>
                  </div>
                )}
              </div>
            );
          })}

          <div style={checkboxContainerStyles}>
            <input
              type="checkbox"
              id="agreedToTerms"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleInputChange}
              style={checkboxStyles}
              required
            />
            <label htmlFor="agreedToTerms" style={checkboxLabelStyles}>
              I agree with the terms of use
            </label>
          </div>

          <button
            type="submit"
            style={getButtonStyles()}
            disabled={isSubmitting}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            {isSubmitting ? (
              <>
                <span>Booking...</span>
                <span style={{ animation: "spin 1s linear infinite" }}>⏳</span>
              </>
            ) : (
              "Book Table"
            )}
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          input::placeholder {
            color: var(--text-muted);
            opacity: 0.7;
          }

          input:focus::placeholder {
            opacity: 0.5;
          }

          /* Remove number input arrows for guests field */
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          input[type="number"] {
            -moz-appearance: textfield;
          }

          /* Fix calendar icon visibility for datetime-local inputs */
          input[type="datetime-local"]::-webkit-calendar-picker-indicator {
            background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="${isDark ? "%23c9a96e" : "%236B4423"}" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>');
            background-size: 16px 16px;
            background-repeat: no-repeat;
            background-position: center;
            cursor: pointer;
            opacity: 1;
            filter: none;
            width: 20px;
            height: 20px;
          }

          input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
            opacity: 0.8;
          }

          /* Firefox datetime input styling */
          input[type="datetime-local"] {
            position: relative;
          }

          @media (max-width: 768px) {
            #reservation form {
              padding: 1.5rem !important;
            }

            #reservation .container {
              padding: 0 1rem !important;
            }
          }

          /* Smooth focus transitions */
          input:focus {
            transform: scale(1.02);
          }
        `}
      </style>

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        bookingData={completedBooking}
      />
    </section>
  );
};

export default Reservation;
