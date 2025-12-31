"use client"

import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'

export const Navbar: FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Hardcoded premium links for now
  const navLinks = [
    { name: 'Documentation', href: '/docs' },
    { name: 'API', href: '/docs/api' },
    { name: 'Components', href: '/docs/components' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // Threshold
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.div
        layout
        initial={false}
        animate={scrolled ? "scrolled" : "top"}
        variants={{
          top: {
            width: "95%",
            backgroundColor: "rgba(255,255,255,0)",
            borderColor: "rgba(255,255,255,0)",
            boxShadow: "0 0 0 0 rgba(0,0,0,0)",
            backdropFilter: "blur(0px)",
          },
          scrolled: {
            width: 600,
            backgroundColor: "rgba(255,255,255,0.8)",
            borderColor: "rgba(0,0,0,0.05)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(12px)",
          }
        }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.3
        }}
        className={cn(
          "pointer-events-auto rounded-full flex items-center justify-between px-6 py-3 mx-auto"
        )}
      >

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-primary/20">B</div>
            <span className={cn("transition-opacity duration-300", scrolled ? "hidden md:block" : "block")}>Bamboo</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-black/5 p-1 rounded-full border border-black/5 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-1.5 text-xs font-medium text-foreground/60 hover:text-foreground hover:bg-white rounded-full transition-all"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Login Button */}
        <div className="hidden md:flex">
          <a
            href="/login"
            className="px-5 py-2 text-xs font-bold text-white bg-primary rounded-full hover:shadow-[0_0_15px_-3px_var(--color-primary)] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
          >
            Sign In
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground p-2 bg-black/5 rounded-full hover:bg-black/10 transition-colors">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-20 left-4 right-4 bg-white/95 border border-black/5 backdrop-blur-xl p-6 rounded-3xl flex flex-col gap-4 shadow-2xl pointer-events-auto z-[60]"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-foreground/80 hover:text-foreground"
              >
                {link.name}
              </a>
            ))}
            <a
              href="/login"
              className="mt-2 w-full py-3 text-center text-sm font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/20"
            >
              Sign In
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
