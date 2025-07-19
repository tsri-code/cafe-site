import React, { useState } from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import { useTheme } from "../../context/ThemeContext";

const Menu = () => {
  const { isDark } = useTheme();
  const [titleRef, titleVisible] = useScrollAnimation(0.3);
  const [cardsRef, cardsVisible] = useScrollAnimation(0.2);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuData = [
    {
      title: "Filter",
      items: [
        { name: "Regular (12 oz)", price: "$1" },
        { name: "Large (16 oz)", price: "$1.25" },
        { name: "XL (20 oz)", price: "$1.5" },
        { name: "Party-size (24 oz, decaf)", price: "$1.75" },
        { name: "Iced Coffee (16 oz)", price: "$1.25" },
      ],
    },
    {
      title: "Espresso",
      items: [
        { name: "Macchiato", price: "$2.25" },
        { name: "Cortado", price: "$2.5" },
        { name: "Mocha", price: "$3" },
        { name: "Sunrise in the Bay Area (decaf)", price: "$10" },
      ],
    },
    {
      title: "Baked Goods",
      items: [
        { name: "Almond Croissant", price: "$2" },
        { name: "Banana Bread", price: "$1.75" },
        { name: "Key Lime Pie", price: "$3" },
        { name: "Blue Velvet Cake", price: "$3.75" },
        { name: "Web Cookie", price: "$2" },
        { name: "Fresh Bug'uette", price: "$0.25" },
      ],
    },
  ];

  const sectionStyles = {
    padding: "6rem 2rem 5rem",
    backgroundColor: "var(--bg-secondary)",
    textAlign: "center",
    transition: "background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const titleStyles = {
    fontSize: "2.5rem",
    fontWeight: "600",
    color: "var(--text-primary)",
    marginBottom: "1rem",
    fontFamily: "var(--font-accent)",
    opacity: titleVisible ? 1 : 0,
    transform: titleVisible ? "translateY(0)" : "translateY(30px)",
    transition: "all 0.6s ease",
  };

  const subtitleStyles = {
    fontSize: "1.2rem",
    color: "var(--text-secondary)",
    marginBottom: "3rem",
    fontFamily: "var(--font-body)",
    maxWidth: "800px",
    margin: "0 auto 3rem",
    opacity: titleVisible ? 1 : 0,
    transform: titleVisible ? "translateY(0)" : "translateY(20px)",
    transition: "all 0.6s ease 0.2s",
  };

  const cardsContainerStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const getCardStyles = (index, isHovered) => ({
    backgroundColor: "var(--bg-primary)",
    border: `1px solid ${isHovered ? "var(--border-medium)" : "var(--border-light)"}`,
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: isHovered ? "var(--shadow-xl)" : "var(--shadow-md)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: cardsVisible ? 1 : 0,
    transform: cardsVisible
      ? isHovered
        ? "translateY(-5px) scale(1.02)"
        : "translateY(0) scale(1)"
      : "translateY(50px) scale(0.95)",
    transitionDelay: cardsVisible ? `${index * 0.1}s` : "0s",
    willChange: "transform, box-shadow",
    cursor: "pointer",
  });

  const cardTitleStyles = {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "var(--text-primary)",
    marginBottom: "1.5rem",
    fontFamily: "var(--font-accent)",
  };

  const getItemStyles = (itemIndex, cardVisible, isHovered) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem",
    borderBottom: `1px dotted ${isDark ? "var(--border-medium)" : "var(--border-light)"}`,
    borderRadius: "0.5rem",
    fontSize: "1rem",
    color: "var(--text-secondary)",
    backgroundColor: isHovered ? "var(--hover-bg)" : "transparent",
    opacity: cardVisible ? 1 : 0,
    transform: cardVisible
      ? isHovered
        ? "translateX(5px) scale(1.01)"
        : "translateX(0) scale(1)"
      : "translateX(-20px) scale(0.98)",
    transition: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1) ${itemIndex * 0.03}s`,
    cursor: "pointer",
    willChange: "transform, background-color",
  });

  const itemNameStyles = {
    flex: 1,
    textAlign: "left",
    fontWeight: "500",
  };

  const priceStyles = (isHovered) => ({
    fontWeight: "600",
    color: isHovered ? "var(--accent-gold)" : "var(--coffee-light)",
    transition: "color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "1.1rem",
  });

  const handleCardHover = (index) => {
    setHoveredCard(index);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
    setHoveredItem(null);
  };

  const handleItemHover = (cardIndex, itemIndex) => {
    setHoveredItem(`${cardIndex}-${itemIndex}`);
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
  };

  return (
    <section id="menu" style={sectionStyles}>
      <div ref={titleRef}>
        <h2 style={titleStyles}>Menu</h2>
        <p style={subtitleStyles}>
          We brew coffee from locally roasted, Fairtrade certified beans and use
          biodegradable cups. All teas from our collection are $2/cup.
        </p>
      </div>
      <div ref={cardsRef} style={cardsContainerStyles}>
        {menuData.map((category, index) => (
          <div
            key={index}
            className="menu-card"
            style={getCardStyles(index, hoveredCard === index)}
            onMouseEnter={() => handleCardHover(index)}
            onMouseLeave={handleCardLeave}
          >
            <h3 style={cardTitleStyles}>{category.title}</h3>
            <div>
              {category.items.map((item, itemIndex) => {
                const itemKey = `${index}-${itemIndex}`;
                const isItemHovered = hoveredItem === itemKey;

                return (
                  <div
                    key={itemIndex}
                    style={getItemStyles(
                      itemIndex,
                      cardsVisible,
                      isItemHovered,
                    )}
                    onMouseEnter={() => handleItemHover(index, itemIndex)}
                    onMouseLeave={handleItemLeave}
                  >
                    <span style={itemNameStyles}>{item.name}</span>
                    <span style={priceStyles(isItemHovered)}>{item.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .menu-card {
              transform: none !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .menu-card {
              transform: none !important;
              transition: none !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Menu;
