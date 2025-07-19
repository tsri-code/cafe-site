// Smart Popular Times Generator for Coffee Shop

/**
 * Business hours from form validation
 */
const BUSINESS_HOURS = {
  monday: { open: 10, close: 19 },
  tuesday: { open: 10, close: 19 },
  wednesday: { open: 10, close: 19 },
  thursday: { open: 10, close: 19 },
  friday: { open: 10, close: 19 },
  saturday: { open: 11, close: 18 },
  sunday: { open: 11, close: 18 },
};

/**
 * Get realistic popularity levels for each hour based on coffee shop patterns
 */
const getPopularityPattern = (dayType, hour) => {
  // Scale: 0-100 (0 = closed, 100 = peak busy)

  if (dayType === "weekend") {
    // Weekend patterns - more steady, brunch focused
    if (hour >= 11 && hour <= 18) {
      if (hour >= 11 && hour <= 13) return 85; // Brunch rush
      if (hour >= 14 && hour <= 16) return 70; // Afternoon steady
      if (hour >= 17 && hour <= 18) return 45; // Evening wind down
    }
    return 0; // Closed
  } else {
    // Weekday patterns - office worker focused
    if (hour >= 10 && hour <= 19) {
      if (hour === 10) return 65; // Late morning coffee
      if (hour === 11) return 75; // Pre-lunch pickup
      if (hour >= 12 && hour <= 14) return 95; // Lunch rush (peak)
      if (hour === 15) return 80; // Afternoon coffee break
      if (hour === 16) return 70; // Late afternoon
      if (hour >= 17 && hour <= 19) return 50; // Evening taper
    }
    return 0; // Closed
  }
};

/**
 * Get current day info
 */
export const getCurrentDayInfo = () => {
  const now = new Date();
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const currentDay = days[now.getDay()];
  const currentDayIndex = now.getDay();
  const currentHour = now.getHours();

  return {
    currentDay,
    currentDayIndex,
    currentHour,
    dayNames,
    isWeekend: currentDayIndex === 0 || currentDayIndex === 6,
  };
};

/**
 * Generate popular times data for the week
 */
export const getPopularTimesData = () => {
  const { currentDayIndex, currentHour } = getCurrentDayInfo();

  const weekData = [];

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = dayNames[dayIndex];
    const isWeekend = dayIndex === 0 || dayIndex === 6;
    const dayType = isWeekend ? "weekend" : "weekday";

    const hours = [];
    for (let hour = 6; hour <= 23; hour++) {
      const popularity = getPopularityPattern(dayType, hour);
      const isCurrentTime =
        dayIndex === currentDayIndex && hour === currentHour;

      hours.push({
        hour,
        popularity,
        isOpen: popularity > 0,
        isCurrentTime,
        displayHour:
          hour === 12
            ? "12pm"
            : hour > 12
              ? `${hour - 12}pm`
              : hour === 0
                ? "12am"
                : `${hour}am`,
      });
    }

    weekData.push({
      dayIndex,
      dayName,
      dayType,
      hours,
      isToday: dayIndex === currentDayIndex,
      businessHours: BUSINESS_HOURS[dayName],
    });
  }

  return weekData;
};

/**
 * Get current status text based on time and day
 */
export const getCurrentStatus = () => {
  const { currentDay, currentHour, isWeekend } = getCurrentDayInfo();
  const hours = BUSINESS_HOURS[currentDay];

  if (!hours)
    return { status: "Closed", detail: "Business hours not available" };

  const isOpen = currentHour >= hours.open && currentHour < hours.close;

  if (isOpen) {
    const popularity = getPopularityPattern(
      isWeekend ? "weekend" : "weekday",
      currentHour,
    );

    if (popularity >= 85) {
      return {
        status: "Very busy",
        detail: "Usually a little busy",
        level: "high",
      };
    } else if (popularity >= 65) {
      return {
        status: "Moderately busy",
        detail: "Popular time to visit",
        level: "medium",
      };
    } else if (popularity >= 40) {
      return {
        status: "Somewhat busy",
        detail: "Good time to visit",
        level: "low",
      };
    } else {
      return { status: "Not too busy", detail: "Quiet time", level: "low" };
    }
  } else {
    const nextOpenDay = getNextOpenTime(currentDay, currentHour);
    return {
      status: "Closed",
      detail: `Opens ${nextOpenDay}`,
      level: "closed",
    };
  }
};

/**
 * Get next opening time
 */
const getNextOpenTime = (currentDay, currentHour) => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentDayIndex = days.indexOf(currentDay);
  const hours = BUSINESS_HOURS[currentDay];

  // Check if we can open today
  if (currentHour < hours.open) {
    const openTime =
      hours.open === 12
        ? "12:00 PM"
        : hours.open > 12
          ? `${hours.open - 12}:00 PM`
          : `${hours.open}:00 AM`;
    return `today at ${openTime}`;
  }

  // Find next day we're open
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7;
    const nextDay = days[nextDayIndex];
    const nextHours = BUSINESS_HOURS[nextDay];

    if (nextHours) {
      const openTime =
        nextHours.open === 12
          ? "12:00 PM"
          : nextHours.open > 12
            ? `${nextHours.open - 12}:00 PM`
            : `${nextHours.open}:00 AM`;
      return `${dayNames[nextDayIndex]} at ${openTime}`;
    }
  }

  return "tomorrow";
};

/**
 * Get peak times description
 */
export const getPeakTimesInfo = () => {
  const { isWeekend } = getCurrentDayInfo();

  if (isWeekend) {
    return {
      message: "People typically spend up to 2 hours here",
      peakTimes: "Peak times: 11 AM - 1 PM (Brunch rush)",
    };
  } else {
    return {
      message: "People typically spend up to 90 minutes here",
      peakTimes: "Peak times: 12 PM - 2 PM (Lunch rush)",
    };
  }
};
