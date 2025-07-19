// Form Validation Utilities

/**
 * Business hours for the coffee shop
 */
export const BUSINESS_HOURS = {
  monday: { open: "10:00", close: "19:00" },
  tuesday: { open: "10:00", close: "19:00" },
  wednesday: { open: "10:00", close: "19:00" },
  thursday: { open: "10:00", close: "19:00" },
  friday: { open: "10:00", close: "19:00" },
  saturday: { open: "11:00", close: "18:00" },
  sunday: { open: "11:00", close: "18:00" },
};

/**
 * Validate name field
 * @param {string} name - The name to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: "Name is required" };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters" };
  }

  if (name.trim().length > 50) {
    return { isValid: false, error: "Name must be less than 50 characters" };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name.trim())) {
    return {
      isValid: false,
      error: "Name can only contain letters, spaces, hyphens, and apostrophes",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate email field
 * @param {string} email - The email to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: "Email is required" };
  }

  // Comprehensive email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  if (email.length > 254) {
    return { isValid: false, error: "Email address is too long" };
  }

  return { isValid: true, error: null };
};

/**
 * Validate number of guests
 * @param {string|number} guests - The number of guests
 * @returns {object} - Validation result with isValid and error message
 */
export const validateGuests = (guests) => {
  if (!guests || guests === "") {
    return { isValid: false, error: "Number of guests is required" };
  }

  const numGuests = parseInt(guests, 10);

  if (isNaN(numGuests)) {
    return { isValid: false, error: "Please enter a valid number" };
  }

  if (numGuests < 1) {
    return { isValid: false, error: "At least 1 guest is required" };
  }

  if (numGuests > 8) {
    return {
      isValid: false,
      error: "Maximum 8 guests allowed per reservation",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate date and time against business hours
 * @param {string} datetime - The datetime string in ISO format
 * @returns {object} - Validation result with isValid and error message
 */
export const validateDateTime = (datetime) => {
  if (!datetime || datetime.trim().length === 0) {
    return { isValid: false, error: "Date and time are required" };
  }

  const selectedDate = new Date(datetime);
  const now = new Date();

  // Check if date is valid
  if (isNaN(selectedDate.getTime())) {
    return { isValid: false, error: "Please enter a valid date and time" };
  }

  // Check if date is in the past
  if (selectedDate < now) {
    return { isValid: false, error: "Cannot book a table in the past" };
  }

  // Check if date is too far in the future (e.g., more than 3 months)
  const maxDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
  if (selectedDate > maxDate) {
    return {
      isValid: false,
      error: "Cannot book more than 3 months in advance",
    };
  }

  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = selectedDate.getDay();
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayName = dayNames[dayOfWeek];

  // Get business hours for this day
  const businessHours = BUSINESS_HOURS[dayName];

  // Extract time from selected datetime
  const selectedTime = selectedDate.toTimeString().slice(0, 5); // HH:MM format

  // Convert business hours to comparable format
  const openTime = businessHours.open;
  const closeTime = businessHours.close;

  // Check if selected time is within business hours
  if (selectedTime < openTime) {
    return {
      isValid: false,
      error: `We open at ${convertTo12Hour(openTime)} on ${capitalizeFirstLetter(dayName)}s`,
    };
  }

  if (selectedTime >= closeTime) {
    return {
      isValid: false,
      error: `We close at ${convertTo12Hour(closeTime)} on ${capitalizeFirstLetter(dayName)}s`,
    };
  }

  // Check if booking is at least 1 hour from now
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  if (selectedDate < oneHourFromNow) {
    return { isValid: false, error: "Please book at least 1 hour in advance" };
  }

  return { isValid: true, error: null };
};

/**
 * Convert 24-hour time to 12-hour time with AM/PM
 * @param {string} time24 - Time in HH:MM format
 * @returns {string} - Time in 12-hour format
 */
export const convertTo12Hour = (time24) => {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Capitalize first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Validate entire form
 * @param {object} formData - The form data object
 * @returns {object} - Validation result with errors for each field
 */
export const validateForm = (formData) => {
  const errors = {};

  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }

  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  const guestsValidation = validateGuests(formData.guests);
  if (!guestsValidation.isValid) {
    errors.guests = guestsValidation.error;
  }

  const datetimeValidation = validateDateTime(formData.datetime);
  if (!datetimeValidation.isValid) {
    errors.datetime = datetimeValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get minimum datetime for booking (1 hour from now)
 * @returns {string} - Datetime string in YYYY-MM-DDTHH:MM format
 */
export const getMinBookingDateTime = () => {
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

  // Format to YYYY-MM-DDTHH:MM
  const year = oneHourFromNow.getFullYear();
  const month = String(oneHourFromNow.getMonth() + 1).padStart(2, "0");
  const day = String(oneHourFromNow.getDate()).padStart(2, "0");
  const hours = String(oneHourFromNow.getHours()).padStart(2, "0");
  const minutes = String(oneHourFromNow.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Get maximum datetime for booking (3 months from now)
 * @returns {string} - Datetime string in YYYY-MM-DDTHH:MM format
 */
export const getMaxBookingDateTime = () => {
  const now = new Date();
  const threeMonthsFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

  // Format to YYYY-MM-DDTHH:MM
  const year = threeMonthsFromNow.getFullYear();
  const month = String(threeMonthsFromNow.getMonth() + 1).padStart(2, "0");
  const day = String(threeMonthsFromNow.getDate()).padStart(2, "0");
  const hours = String(threeMonthsFromNow.getHours()).padStart(2, "0");
  const minutes = String(threeMonthsFromNow.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
