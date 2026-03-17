"use client"

import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"
import { useEffect, useState } from "react"

interface Variant {
  size?: string
  color?: string
  variantStock?: number
}

interface Product {
  _id: string
  title: string
  slug: { current: string }
  images: any[]
  price: number
  discountPrice?: number
  variants?: Variant[]
}

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = product.images?.length
    ? product.images
    : ["/placeholder.png"]

  // 🔥 Auto Slide
  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <Link
      href={`/product/${product.slug.current}`}
      className="group block"
    >
      {/* IMAGE SLIDER */}
      <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">

        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((img, i) => {
            const imageUrl =
              typeof img === "string"
                ? img
                : urlFor(img).width(800).height(1000).url()

            return (
              <div key={i} className="relative w-full h-full flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
              </div>
            )
          })}
        </div>

      </div>

      {/* TEXT */}
      <div className="pt-4 space-y-1">
        <h2 className="text-sm md:text-base font-normal tracking-wide text-neutral-900">
          {product.title}
        </h2>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-black font-medium">
            PKR {product.discountPrice ?? product.price}
          </span>

          {product.discountPrice && (
            <span className="line-through text-neutral-400">
              {product.price}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}