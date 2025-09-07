import React from "react";
import Image from "next/image";
import { assets } from "../../assets/assets";
import { motion } from "motion/react";
import TheOrb from "./Globe";

const Header = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* The Orb Background - Centered */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full z-0">
        <TheOrb />
      </div>
      
      {/* Content */}
      <div className="w-11/12 max-w-3xl text-center mx-auto relative z-10 flex flex-col items-center justify-center gap-4">
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
          className="flex items-end gap-2 text-xl md:text-2xl mb-3 font-Ovo text-white"
        >
          Hi! I'm Prean Kimlon
        </motion.h3>
        <motion.h1 
          className="w-[20ch] typing-loop text-3xl sm:text-6xl lg:text-[66px] font-Ovo text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          web developer based in Cambodia.
        </motion.h1>
        <motion.p 
          className="max-w-2xl mx-auto font-Ovo text-white/80"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          I create responsive websites that are displayed on all devices desktops
          and smartphones. I am passionate about building excellent software that
          improves the lives of those around me.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <a
            href="#contact"
            className="px-10 py-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center gap-2 hover:bg-white/20 transition-all duration-300"
          >
            contact me
            <Image src={assets.right_arrow_white} alt="" className="w-4" />
          </a>
          <a
            href="https://drive.google.com/file/d/1A6IGUjTVcjtLSJWQndabUfXCVk-9d04U/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center gap-2 hover:bg-white/20 transition-all duration-300"
          >
            my resume
            <Image src={assets.download_icon} alt="" className="w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Header;
