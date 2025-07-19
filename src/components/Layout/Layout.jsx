import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ScrollProgress from "../ScrollProgress/ScrollProgress";

const Layout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ScrollProgress />
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
