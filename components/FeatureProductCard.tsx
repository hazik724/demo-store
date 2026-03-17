"use client"

import Image from "next/image"
import Link from "next/link"
import CartButton from "@/app/(app)/product/[slug]/CartButton"
import { useCartStore } from "@/app/store/CartStore"
import { urlFor } from "@/sanity/lib/image"
import { toast } from "sonner"
import { useEffect, useState } from "react"

interface Product {
  _id: string
  title: string
  slug: { current: string }
  images: any[]
  price: number
  discountPrice?: number
}

interface Props {
  product: Product
}

export default function FeaturedProductCard({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem)
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
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      slug: product.slug.current,
      title: product.title,
      image:
        product.images?.[0]
          ? urlFor(product.images[0]).width(500).url()
          : "/placeholder.png",
      price: product.discountPrice ?? product.price,
      quantity: 1,
    })
    toast.success("Item added to cart")
  }

  return (
    <div className="group relative bg-white dark:bg-gray-900 overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
      
      {/* IMAGE SLIDER */}
      <Link href={`/product/${product.slug.current}`}>
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          
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
                  : urlFor(img).width(500).height(600).url()

              return (
                <div key={i} className="relative w-full h-full flex-shrink-0">
                  <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )
            })}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
        </div>
      </Link>

      {/* INFO */}
      <div className="p-4 space-y-2">
        <Link href={`/product/${product.slug.current}`}>
          <h2 className="text-sm md:text-base font-medium line-clamp-2 hover:underline min-h-[40px]">
            {product.title}
          </h2>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[#740A03] font-semibold text-sm md:text-base">
            PKR {product.discountPrice ?? product.price}
          </span>
          {product.discountPrice && (
            <span className="line-through text-gray-400 text-xs">
              {product.price}
            </span>
          )}
        </div>

        <div className="pt-6">
          <CartButton
            id={product._id}
            title={product.title}
            slug={product.slug.current}
            price={product.price}
            image={
              product.images?.[0]
                ? urlFor(product.images[0]).width(600).url()
                : "/placeholder.png"
            }
          />
        </div>
      </div>
    </div>
  )
}