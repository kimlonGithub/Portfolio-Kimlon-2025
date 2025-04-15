"use client"

import Image from "next/image"
import { assets } from "@/assets/assets"
import { useRef, useState, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const [IsScroll, setIsScroll] = useState(false)
  const sideMenuRef = useRef()
  const isMobile = useMobile()

  const openMenu = () => {
    sideMenuRef.current.style.transform = "translateX(0)"
  }

  const closeMenu = () => {
    sideMenuRef.current.style.transform = "translateX(100%)"
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sideMenuRef.current &&
        !sideMenuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Open menu"]')
      ) {
        closeMenu()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <div className="fixed top-0 right-0 w-11/12 -z-10 translate-y-[-80%] dark:hidden">
        <Image src={assets.header_bg_color || "/placeholder.svg"} alt="" className="w-full" />
      </div>

      <nav
        className={`w-full fixed px-5 lg:px-8 xl:px-[8%] py-4 flex item-center justify-between z-50 ${
          IsScroll ? "bg-white bg-opacity-50 backdrop-blur-lg shadow-sm dark:bg-darkTheme dark:shadow-white/20" : ""
        }`}
      >
        <a href="#top">
          <Image src={isDarkMode ? assets.logo_dark : assets.logo} alt="Logo" className="w-32 cursor-pointer mr-14" />
        </a>

        {!isMobile && (
          <ul
            className={`flex items-center gap-6 lg:gap-8 rounded-full px-12 py-3 ${
              IsScroll ? "" : "bg-white bg-opacity-50 dark:border dark:border-white/50 dark:bg-transparent"
            }`}
          >
            <li>
              <a className="font-Ovo" href="#top">
                Home
              </a>
            </li>
            <li>
              <a className="font-Ovo" href="#about">
                About Me
              </a>
            </li>
            <li>
              <a className="font-Ovo" href="#services">
                Services
              </a>
            </li>
            <li>
              <a className="font-Ovo" href="#work">
                My Work
              </a>
            </li>
            <li>
              <a className="font-Ovo" href="#contact">
                Contact Me
              </a>
            </li>
          </ul>
        )}

        <div className="flex items-center gap-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)}>
            <Image src={isDarkMode ? assets.sun_icon : assets.moon_icon} alt="" className="w-6 " />
          </button>

          {!isMobile && (
            <a
              href="#contact"
              className="flex items-center gap-3 px-10 py-2.5 border border-gray-500 rounded-full ml-4 font-Ovo dark:border-white/50"
            >
              <span>Contact</span>
              <Image src={isDarkMode ? assets.arrow_icon_dark : assets.arrow_icon} alt="arrow_icon" className="w-3" />
            </a>
          )}

          {isMobile && (
            <button className="ml-3" onClick={openMenu} aria-label="Open menu">
              <Image src={isDarkMode ? assets.menu_white : assets.menu_black} alt="" className="w-6" />
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && (
          <ul
            ref={sideMenuRef}
            className="flex flex-col gap-4 py-20 px-10 fixed right-0 top-0 bottom-0 w-64 z-50 h-screen bg-gray-50 translate-x-full transition-transform duration-500 ease-in-out dark:bg-darkHover dark:text-white"
          >
            <div className="absolute right-6 top-6" onClick={closeMenu}>
              <Image src={isDarkMode ? assets.close_white : assets.close_black} alt="" className="w-5 cursor-pointer" />
            </div>

            <li>
              <a className="font-Ovo" onClick={closeMenu} href="#top">
                Home
              </a>
            </li>
            <li>
              <a className="font-Ovo" onClick={closeMenu} href="#about">
                About Me
              </a>
            </li>
            <li>
              <a className="font-Ovo" onClick={closeMenu} href="#services">
                Services
              </a>
            </li>
            <li>
              <a className="font-Ovo" onClick={closeMenu} href="#work">
                My Work
              </a>
            </li>
            <li>
              <a className="font-Ovo" onClick={closeMenu} href="#contact">
                Contact Me
              </a>
            </li>
          </ul>
        )}
      </nav>
    </>
  )
}

export default Navbar
