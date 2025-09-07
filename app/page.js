"use client";
import { useEffect } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Earth3D from "./components/Earth3D";
import Footer from "./components/Footer";
import Header from "./components/Header";
import InteractiveCursor from "./components/InteractiveCursor";
import Navbar from "./components/Navbar";
import Service from "./components/Service";
import StarryBackground from "./components/StarryBackground";
import Work from "./components/Work";
import TheOrb from "./components/Globe";
export default function Home() {
  useEffect(() => {
    // Always set dark mode
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
  }, []);

  return (
    <>
      <StarryBackground />
      <InteractiveCursor />
      
      <div className="relative z-10">
        <Navbar />
        <Header />
        <About />
        <Service />
        <Work />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
