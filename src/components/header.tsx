"use client"

import { useEffect, useState } from 'react'
import '@/app/App.css'
import logoDark from '@/assets/GREX LOGO WHITE.png'
import logoLight from '@/assets/GREX LOGO BLACK.png'
import Image from "next/image"
import { usePathname, useRouter } from 'next/navigation'


function Header() {

  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    async function checkDarkMode() {
      setIsDark(mediaQuery.matches);
    };
    checkDarkMode();

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  function handleNavClick(section: string) {
    setOpen(false);
    if (pathname === '/') {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${section}`);
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <div className="logo">
            <Image src={isDark ? logoDark : logoLight} alt="SLIC Logo" />
            {/* <h1>GRACE EXPLOSION CONCERT</h1> */}
          </div>

          {/* Hamburger */}
          <div className="hamburger" onClick={() => setOpen(!open)}>
            <div className={open ? "bar rotate1" : "bar"}></div>
            <div className={open ? "bar hide" : "bar"}></div>
            <div className={open ? "bar rotate2" : "bar"}></div>
          </div>

          <div className={`navlink ${open ? "active" : ""}`}>
            <li className="li" onClick={() => handleNavClick('home')}>Home</li>
            <li className="li" onClick={() => handleNavClick('about')}>About</li>
            <li className="li" onClick={() => handleNavClick('ministries')}>LineUps</li>
            <li className="li" onClick={() => handleNavClick('events')}>Events</li>
            <li className="li" onClick={() => handleNavClick('contacts')}>Contact</li>

            <button className="donatebtn mobile-donate" onClick={() => router.push("/support")}>
              Donate
            </button>
          </div>

          <button className="donatebtn" onClick={() => router.push("/support")}>Donate</button>
        </div>
      </nav>
    </>
  )
}

export default Header