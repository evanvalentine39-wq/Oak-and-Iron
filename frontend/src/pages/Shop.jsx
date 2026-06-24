import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { fetchProducts } from "@/lib/api";

const formatPrice = (n, c = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(n);

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="shop-page" className="pt-32 pb-24">
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-20">
          <div className="md:col-span-7">
            <p className="label-eyebrow text-[#8C4A32] mb-6">The Shop</p>
            <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl text-[#2C2A28] leading-[0.95] tracking-tight">
              Pieces for
              <br />
              <span className="italic">the long haul.</span>
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-[#5C5852] leading-relaxed">
              A small selection of finished work, ready to ship. Each piece is
              one of a kind. When it&apos;s gone, it&apos;s gone — but I can
              always make you another.
            </p>
          </div>
        </div>

        {loading ? (
          <p
            data-testid="shop-loading"
            className="text-center text-[#5C5852] label-eyebrow"
          >
            Loading the bench…
          </p>
        ) : (
          <div
            data-testid="shop-grid"
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20"
          >
            {products.map((p, idx) => (
              <Link
                key={p.id}
                to={`/shop/${p.id}`}
                data-testid={`shop-card-${p.id}`}
                className={`group product-card block ${
                  idx % 2 === 1 ? "md:mt-24" : ""
                }`}
              >
                <div className="relative overflow-hidden aspect-[4/5] bg-[#F1EBE4]">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="product-card-image w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="label-eyebrow bg-[#F9F6F0]/90 backdrop-blur-sm text-[#2C2A28] px-3 py-1">
                      {p.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <span className="inline-flex items-center gap-2 bg-[#2C2A28] text-[#F9F6F0] label-eyebrow px-4 py-2">
                      View piece <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-6">
                  <div>
                    <h2 className="font-serif-display text-2xl sm:text-3xl text-[#2C2A28] group-hover:text-[#8C4A32] transition-colors duration-300">
                      {p.name}
                    </h2>
                    <p className="mt-1 italic text-[#5C5852]">{p.tagline}</p>
                  </div>
                  <p className="font-serif-display text-xl text-[#2C2A28] whitespace-nowrap">
                    {formatPrice(p.price, p.currency)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
