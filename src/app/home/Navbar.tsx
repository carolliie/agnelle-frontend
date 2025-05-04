"use client";

import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Produtos", href: "/catalogo" },
  { name: "Sobre", href: "/#sobre" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const lastScrollY = useRef(0);

  const checkHeroVisibility = useCallback(() => {
    const heroElement = document.querySelector('.hero');
    if (!heroElement) {
      setIsHeroVisible(false);
      return;
    }

    const rect = heroElement.getBoundingClientRect();
    setIsHeroVisible(rect.top <= 50 && rect.bottom >= 50);
  }, []);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;

    if (scrollY > lastScrollY.current) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    lastScrollY.current = scrollY;
    checkHeroVisibility();
  }, [checkHeroVisibility]);

  useEffect(() => {
    checkHeroVisibility();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, checkHeroVisibility]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-2 lg:px-24 xl:px-[225px] transition-opacity duration-200 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <nav aria-label="Global" className="flex items-center justify-between lg:justify-center p-6 lg:px-8">
        <div className="flex w-[40px] lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${
              isHeroVisible ? 'text-white' : 'text-[#11589A]'
            }`}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className={`size-10 ${
              isHeroVisible ? 'fill-white' : 'fill-[#11589A]'
            }`} />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`bloom font-normal text-[28px] ${
                isHeroVisible 
                  ? "text-white hover:text-[#11589A]" 
                  : "text-[#11589A] hover:text-[#00376B]"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:justify-center lg:mx-12">
          <Link
            href="#contato"
            className={`flex justify-center items-center text-sm/6 text-[#C06C82] fill-[#C06C82] font-medium p-2 px-6 rounded-3xl bg-[#FFE3EA] transition-all duration-300 hover:bg-[#11589A] hover:text-[white] hover:fill-white`}
          >
            Contato
            <svg className="mx-1" height="15px" viewBox="-23 -21 682 682.66669" width="15px"
                xmlns="http://www.w3.org/2000/svg" id="fi_1384023">
                <path
                d="m544.386719 93.007812c-59.875-59.945312-139.503907-92.9726558-224.335938-93.007812-174.804687 0-317.070312 142.261719-317.140625 317.113281-.023437 55.894531 14.578125 110.457031 42.332032 158.550781l-44.992188 164.335938 168.121094-44.101562c46.324218 25.269531 98.476562 38.585937 151.550781 38.601562h.132813c174.785156 0 317.066406-142.273438 317.132812-317.132812.035156-84.742188-32.921875-164.417969-92.800781-224.359376zm-224.335938 487.933594h-.109375c-47.296875-.019531-93.683594-12.730468-134.160156-36.742187l-9.621094-5.714844-99.765625 26.171875 26.628907-97.269531-6.269532-9.972657c-26.386718-41.96875-40.320312-90.476562-40.296875-140.28125.054688-145.332031 118.304688-263.570312 263.699219-263.570312 70.40625.023438 136.589844 27.476562 186.355469 77.300781s77.15625 116.050781 77.132812 186.484375c-.0625 145.34375-118.304687 263.59375-263.59375 263.59375zm144.585938-197.417968c-7.921875-3.96875-46.882813-23.132813-54.148438-25.78125-7.257812-2.644532-12.546875-3.960938-17.824219 3.96875-5.285156 7.929687-20.46875 25.78125-25.09375 31.066406-4.625 5.289062-9.242187 5.953125-17.167968 1.984375-7.925782-3.964844-33.457032-12.335938-63.726563-39.332031-23.554687-21.011719-39.457031-46.960938-44.082031-54.890626-4.617188-7.9375-.039062-11.8125 3.476562-16.171874 8.578126-10.652344 17.167969-21.820313 19.808594-27.105469 2.644532-5.289063 1.320313-9.917969-.664062-13.882813-1.976563-3.964844-17.824219-42.96875-24.425782-58.839844-6.4375-15.445312-12.964843-13.359374-17.832031-13.601562-4.617187-.230469-9.902343-.277344-15.1875-.277344-5.28125 0-13.867187 1.980469-21.132812 9.917969-7.261719 7.933594-27.730469 27.101563-27.730469 66.105469s28.394531 76.683594 32.355469 81.972656c3.960937 5.289062 55.878906 85.328125 135.367187 119.648438 18.90625 8.171874 33.664063 13.042968 45.175782 16.695312 18.984374 6.03125 36.253906 5.179688 49.910156 3.140625 15.226562-2.277344 46.878906-19.171875 53.488281-37.679687 6.601563-18.511719 6.601563-34.375 4.617187-37.683594-1.976562-3.304688-7.261718-5.285156-15.183593-9.253906zm0 0"
                fillRule="evenodd"></path>
            </svg>
          </Link>
        </div>
      </nav>

      <Transition show={mobileMenuOpen}>
        {/* Overlay */}
        <TransitionChild
          enter="transition-opacity ease-linear duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 z-40" />
        </TransitionChild>

        {/* Menu */}
        <TransitionChild
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <Dialog 
            open={mobileMenuOpen} 
            onClose={setMobileMenuOpen} 
            className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-[#AAD0F4] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white"
            static
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">agnelle</span>
                <Image
                  alt="agnelle logo"
                  src="https://agnelles.com.br/images/agnelle.svg"
                  height={120}
                  width={120}
                  loading="lazy"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-white hover:text-[#11589A]"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:text-[#11589A]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href="/#contato"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:text-[#FFA0D4]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contato
                  </Link>
                </div>
              </div>
            </div>
          </Dialog>
        </TransitionChild>
      </Transition>
    </header>
  );
}