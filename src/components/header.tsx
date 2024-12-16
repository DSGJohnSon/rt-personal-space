"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import Link from "next/link";
import LanguageSelector from "./language-selector";

export default function Header() {
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  const [isBurgerOpened, setIsBurgerOpened] = useState(false);

  //IsBurgerOpened ?
  useEffect(() => {
    if (isBurgerOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isBurgerOpened]);

  //Set header fixed when scrolling
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        setIsHeaderScrolled(true);
      } else {
        setIsHeaderScrolled(false);
      }
    });
  }, []);

  return (
    <header
      className={` ${
        isHeaderScrolled
          ? "p-4 bg-gradient-to-b from-dark to-dark/0"
          : "p-6 lg:p-12"
      } flex fixed w-full justify-between items-center tansition transition-all duration-1000 z-20 text-background`}>
      <Link href="/" title="Return to home">
        <Image
          src="/icons/logo_rt_white.svg"
          alt="Renaud Tixier Logotype Icon"
          width={50}
          height={50}
          className="w-[75%] lg:w-full"
        />
      </Link>
      <div className="flex items-center gap-4">
        <div className={`lg:block ${isBurgerOpened ? "" : ""}`}>
          <LanguageSelector />
        </div>
        {/* Burger Icon */}
        <div
          className="relative flex flex-col items-center justify-center w-10 h-10 z-30 cursor-pointer"
          onClick={() => setIsBurgerOpened(!isBurgerOpened)}>
          <span
            className={`absolute w-[20px] h-[1px] block transition-all ease-in-out duration-700 ${
              isBurgerOpened
                ? "bg-dark translate-x-[100%] opacity-0"
                : "bg-creme translate-x-[0%] opacity-100"
            }`}></span>
          <span
            className={`absolute w-[20px] h-[1px] block transition-all ease-in-out duration-700 ${
              isBurgerOpened
                ? "bg-dark translate-y-0 rotate-45"
                : "bg-creme translate-y-[.8vh]"
            }`}></span>
          <span
            className={`absolute w-[20px] h-[1px] block transition-all ease-in-out duration-700 ${
              isBurgerOpened
                ? "bg-dark translate-y-0 -rotate-45"
                : "bg-creme -translate-y-[.8vh]"
            }`}></span>
        </div>
      </div>
      {/* Menu */}
      <div
        className={`${
          isBurgerOpened ? "right-0" : "right-[-100%]"
        } bg-creme absolute top-0 h-[100vh] w-full lg:w-1/3 flex text-dark font-axiforma py-24 z-0 transition-all ease-in-out duration-700 uppercase`}>
        <nav className="w-full h-full">
          <ul className="w-full">
            <li className="w-full">
              <Link
                href="/"
                title="Return to home"
                onClick={() => setIsBurgerOpened(!isBurgerOpened)}
                className="py-6 hover:bg-dark/10 transition text-center flex items-center justify-center w-full">
                Return to homesite
              </Link>
            </li>
            <li className="w-full">
              <Link
                href={`#genese`}
                title="Genesis"
                onClick={() => setIsBurgerOpened(!isBurgerOpened)}
                className="py-6 hover:bg-dark/10 transition text-center flex items-center justify-center w-full">
                Genesis
              </Link>
            </li>
            <li className="w-full">
              <Link
                href={`#creations`}
                title="Creations"
                onClick={() => setIsBurgerOpened(!isBurgerOpened)}
                className="py-6 hover:bg-dark/10 transition text-center flex items-center justify-center w-full">
                Creations
              </Link>
            </li>
            <li className="w-full">
              <Link
                href={`#team`}
                title="Team RT"
                onClick={() => setIsBurgerOpened(!isBurgerOpened)}
                className="py-6 hover:bg-dark/10 transition text-center flex items-center justify-center w-full">
                <span>Team</span>
                <Image
                  src="/icons/logo_rt_white.svg"
                  alt="Monogramme Renaud Tixier SVG"
                  width={20}
                  height={20}
                  className="invert mb-1 ml-1"
                />
              </Link>
            </li>
            <li className="w-full">
              <Link
                href={`#retailers`}
                title="Retailers"
                onClick={() => setIsBurgerOpened(!isBurgerOpened)}
                className="py-6 hover:bg-dark/10 transition text-center flex items-center justify-center w-full">
                Retailers
              </Link>
            </li>
            <li className="w-full">
              <Link
                href={`#press`}
                title="Press"
                onClick={() => setIsBurgerOpened(!isBurgerOpened)}
                className="py-6 hover:bg-dark/10 transition text-center flex items-center justify-center w-full">
                Press
              </Link>
            </li>
            <li className="w-full">
              <Link
                href={`#contact`}
                title="Contact"
                onClick={() => setIsBurgerOpened(!isBurgerOpened)}
                className="py-6 hover:bg-dark/10 transition text-center flex items-center justify-center w-full">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
