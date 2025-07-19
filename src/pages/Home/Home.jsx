import React from "react";
import Hero from "../../components/Hero/Hero";
import Recipes from "../../components/Recipes/Recipes";
import Reservation from "../../components/Reservation/Reservation";
import Menu from "../../components/Menu/Menu";
import About from "../../components/About/About";

const Home = () => {
  return (
    <div>
      <Hero />
      <Recipes />
      <Reservation />
      <Menu />
      <About />
    </div>
  );
};

export default Home;
