"use client"

import { useEffect, useState } from "react"
import { client } from "@/sanity/lib/client"
import ProductCard from "@/components/ProductCard"
import ProductFilter, { FiltersState } from "@/components/ProductFilter"

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<FiltersState>({
    minPrice: 0,
    maxPrice: 10000,
    colors: [],
    sizes: [],
    onSale: false,
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortOption, setSortOption] = useState("newest")

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      const query = `*[_type == "product"] | order(_createdAt desc){
        _id,
        title,
        slug,
        images,
        price,
        discountPrice,
        variants
      }`

      const result = await client.fetch(query)
      setProducts(result)
      setFilteredProducts(result)
    }

    fetchProducts()
  }, [])

  // Apply Filters + Sorting
  useEffect(() => {
    let updated = [...products]

    // Price Filter
    updated = updated.filter(
      (p) =>
        (p.discountPrice ?? p.price) >= filters.minPrice &&
        (p.discountPrice ?? p.price) <= filters.maxPrice
    )

    // Color Filter
    if (filters.colors.length > 0) {
      updated = updated.filter((p) =>
        p.variants?.some((v) => v.color && filters.colors.includes(v.color))
      )
    }

    // Size Filter
    if (filters.sizes.length > 0) {
      updated = updated.filter((p) =>
        p.variants?.some((v) => v.size && filters.sizes.includes(v.size))
      )
    }

    // On Sale Filter
    if (filters.onSale) {
      updated = updated.filter(
        (p) => p.discountPrice && p.discountPrice < p.price
      )
    }

    // Sorting
    if (sortOption === "price-low") {
      updated.sort(
        (a, b) =>
          (a.discountPrice ?? a.price) -
          (b.discountPrice ?? b.price)
      )
    }

    if (sortOption === "price-high") {
      updated.sort(
        (a, b) =>
          (b.discountPrice ?? b.price) -
          (a.discountPrice ?? a.price)
      )
    }

    setFilteredProducts(updated)
  }, [filters, products, sortOption])

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

      {/* Editorial Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-light tracking-[0.15em] mb-4">
          COLLECTION
        </h1>
        <p className="text-sm text-gray-500 tracking-widest uppercase">
          {filteredProducts.length} Pieces
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex justify-between items-center mb-12 border-b pb-6">

        {/* Filter Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="text-sm tracking-widest uppercase hover:opacity-60 transition"
        >
          Filter
        </button>

        {/* Sort Dropdown */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="text-sm tracking-widest uppercase bg-transparent outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-16">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No products found.
          </p>
        )}
      </div>

      {/* FILTER DRAWER */}
      {isFilterOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-[420px] bg-white z-50 p-12 shadow-2xl overflow-y-auto">

            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl tracking-widest uppercase">
                Filters
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-xs tracking-widest uppercase hover:opacity-60"
              >
                Close
              </button>
            </div>

            <ProductFilter applyFilters={(f) => setFilters(f)} />
          </div>
        </>
      )}
    </div>
    
  )
}