import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [systemPreference, setSystemPreference] = useState("light");

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemPreference(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e) => {
      setSystemPreference(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("coffee-shop-theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(systemPreference);
    }
  }, [systemPreference]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("coffee-shop-theme", newTheme);
  };

  const setLightTheme = () => {
    setTheme("light");
    localStorage.setItem("coffee-shop-theme", "light");
  };

  const setDarkTheme = () => {
    setTheme("dark");
    localStorage.setItem("coffee-shop-theme", "dark");
  };

  const useSystemTheme = () => {
    setTheme(systemPreference);
    localStorage.removeItem("coffee-shop-theme");
  };

  const value = {
    theme,
    systemPreference,
    isDark: theme === "dark",
    isLight: theme === "light",
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    useSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
