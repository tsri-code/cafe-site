import { useState, useEffect } from "react";

const useActiveSection = (sectionIds) => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // Triggers when section is 20% from top
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [sectionIds]);

  return activeSection;
};

export default useActiveSection;
