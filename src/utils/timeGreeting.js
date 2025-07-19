export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      greeting: "Good Morning",
      subtitle: "Start your day with the perfect cup",
      emoji: "🌅",
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: "Good Afternoon",
      subtitle: "Fuel your productivity with our specialty coffee",
      emoji: "☀️",
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: "Good Evening",
      subtitle: "Unwind with our cozy atmosphere",
      emoji: "🌆",
    };
  } else {
    return {
      greeting: "Welcome",
      subtitle: "Perfect coffee, anytime you need it",
      emoji: "🌙",
    };
  }
};

export const getCoffeeFact = () => {
  const coffeeFacts = [
    "Did you know? Coffee is the second most traded commodity in the world after oil!",
    "Fun fact: Espresso actually has less caffeine than regular drip coffee per serving.",
    "Coffee tip: Store your beans in an airtight container away from light and heat.",
    "Interesting: The word 'coffee' comes from the Arabic word 'qahwah'.",
    "Did you know? Finland consumes the most coffee per capita in the world!",
    "Coffee fact: Light roast coffee has slightly more caffeine than dark roast.",
    "Fun tip: The best brewing temperature for coffee is between 195°F and 205°F.",
    "Amazing: Coffee plants can live and produce for over 100 years!",
    "Did you know? Instant coffee was invented in 1901 by Japanese scientist Satori Kato.",
    "Coffee tip: Grinding your beans right before brewing gives the freshest taste!",
  ];

  const randomIndex = Math.floor(Math.random() * coffeeFacts.length);
  return coffeeFacts[randomIndex];
};
