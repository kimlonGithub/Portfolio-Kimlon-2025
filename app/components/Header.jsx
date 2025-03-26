import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { motion } from "motion/react";

const Header = () => {
  return (
    <div className="w-11/12 max-w-3xl text-center mx-auto h-screen flex flex-col items-center justify-center gap-4">
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        <Image src={assets.profile_img} alt="" className="rounded-full w-32" />
      </motion.div>
      <motion.h3
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="flex items-end gap-2 text-xl md:text-2xl mb-3 font-Ovo"
      >
        Hi! I'm Prean Kimlon
      </motion.h3>
      <h1 className="w-[20ch] typing-loop text-3xl sm:text-6xl lg:text-[66px] font-Ovo">
        web developer based in Cambodia.
      </h1>
      <p className="max-w-2xl mx-auto font-Ovo">
        I create responsive websites that are displayed on all devices desktops
        and smartphones. I am passionate about building excellent software that
        improves the lives of those around me.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
        <a
          href="#contact"
          className="px-10 py-3 border border-white rounded-full bg-black text-white flex items-center gap-2 dark:bg-transparent"
        >
          contact me
          <Image src={assets.right_arrow_white} alt="" className="w-4" />
        </a>
        <a
          href="https://drive.google.com/file/d/1A6IGUjTVcjtLSJWQndabUfXCVk-9d04U/view?usp=sharing"
          target="_blank" // Opens the PDF in a new tab
          rel="noopener noreferrer" // Adds security when opening in a new tab
          className="px-10 py-2 border rounded-full border-gray-500 flex items-center gap-2 bg-white dark:text-black"
        >
          my resume
          <Image src={assets.download_icon} alt="" className="w-4" />
        </a>
      </div>
    </div>
  );
};

export default Header;
