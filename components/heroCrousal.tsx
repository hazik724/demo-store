"use client"

import useEmblaCarousel from "embla-carousel-react"
import { useEffect, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"

const slides = [
  {
    desktop: "/hero/dd1.jpg",
    mobile: "/hero/w2.jpg",
    label: "Winter 2026",
    headline: "Silhouettes in Black",
  },
  {
    desktop: "/hero/dd2.jpg",
    mobile: "/hero/w1.jpg",
    label: "New Collection",
    headline: "Refined Essentials",
  },
  {
    desktop: "/hero/dd3.jpg",
    mobile: "/hero/w.jpg",
    label: "The Edit",
    headline: "Modern Icons",
  },
]

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 40,
  })
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  const autoplay = useCallback(() => {
    if (!emblaApi) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 7000)
    return () => clearInterval(interval)
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)

    const cleanup = autoplay()
    return cleanup
  }, [emblaApi, onSelect, autoplay])

  return (
    <section className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-black">

      {/* Carousel */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">

          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] h-full md:h-screen"
            >

             {/* Desktop Image */}
<Image
  src={slide.desktop}
  alt={slide.headline}
  fill
  priority
  className="object-cover hidden md:block"
/>

{/* Mobile Image */}
<Image
  src={slide.mobile}
  alt={slide.headline}
  fill
  priority
  className="object-cover block md:hidden"
/>

              {/* Luxury Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">

                {/* Label */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-xs tracking-[0.5em] uppercase mb-6"
                >
                  {slide.label}
                </motion.p>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-4xl md:text-6xl font-light tracking-wide max-w-3xl"
                >
                  {slide.headline}
                </motion.h1>

              <motion.button
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 80 }}
  whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
  whileTap={{ scale: 0.95 }}
  onClick={() => router.push("/product")}
  className="mt-12 border border-white px-12 py-4 text-xs tracking-[0.4em] uppercase transition-colors duration-500 rounded-lg shadow-lg hover:shadow-xl"
>
  Discover
</motion.button>

              </div>

            </div>
          ))}

        </div>
      </div>

      {/* Glass Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 backdrop-blur-md bg-white/10 px-4 py-2 rounded-full">

        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === selectedIndex
                ? "bg-white scale-125"
                : "bg-white/40"
            }`}
          />
        ))}

      </div>

     

    </section>
  )
}