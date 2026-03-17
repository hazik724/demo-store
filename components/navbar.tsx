"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import CartDrawer from "@/components/CartDrawer"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const menuLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/product" },
    { name: "About", href: "/about" },
  ]

  return (
    <nav className="w-full bg-[#740A03] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-6">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl tracking-[0.3em] font-light uppercase"
        >
           DRIP CULT
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-12 text-xs tracking-[0.25em] uppercase">

          {menuLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative group"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-8">

          {/* Cart */}
          <CartDrawer />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* FULLSCREEN MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-[#740A03] text-white flex flex-col items-center justify-center z-40"
          >

            <button
              className="absolute top-8 right-8"
              onClick={() => setIsOpen(false)}
            >
              <X size={28} />
            </button>

            <motion.ul
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.15 } },
                hidden: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
              }}
              className="flex flex-col gap-10 text-2xl tracking-[0.3em] uppercase"
            >
              {menuLinks.map((link) => (
                <motion.li
                  key={link.name}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="hover:opacity-60 transition"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}