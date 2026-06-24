import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { fetchProducts } from "@/lib/api";

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
            <p className="label-eyebrow text-[#8C4A32] mb-6">The Portfolio</p>
            <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl text-[#2C2A28] leading-[0.95] tracking-tight">
              Work from
              <br />
              <span className="italic">the bench.</span>
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-[#5C5852] leading-relaxed">
              A record of pieces built by hand in Hutto, TX. If something
              catches your eye and you&apos;d like one of your own, get in
              touch.
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
        ) : products.length === 0 ? (
          <div
            data-testid="shop-empty"
            className="border border-[#E3DACD] bg-[#F1EBE4] py-24 px-8 text-center"
          >
            <p className="label-eyebrow text-[#8C4A32] mb-4">
              More work coming soon
            </p>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#2C2A28] leading-tight max-w-2xl mx-auto">
              New pieces are being photographed.
              <br />
              <span className="italic">Check back shortly.</span>
            </h2>
            <Link
              to="/contact"
              data-testid="shop-empty-contact"
              className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-[#2C2A28] text-[#F9F6F0] label-eyebrow hover:bg-[#8C4A32] transition-colors duration-300"
            >
              Reach out in the meantime
            </Link>
          </div>
        ) : (
          <div
            data-testid="shop-grid"
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20"
          >
            {products.map((p, idx) => (
              <Link
                key={p.id}
                to={`/portfolio/${p.id}`}
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
                  {p.status && (
                    <div className="absolute top-4 right-4">
                      <span
                        data-testid={`shop-card-status-${p.id}`}
                        className={`label-eyebrow px-3 py-1 ${
                          p.status === "for_sale"
                            ? "bg-[#4A5D23] text-[#F9F6F0]"
                            : p.status === "sold"
                            ? "bg-[#2C2A28] text-[#F9F6F0]"
                            : "bg-[#F9F6F0] text-[#2C2A28] border border-[#2C2A28]"
                        }`}
                      >
                        {p.status === "for_sale"
                          ? "For Sale"
                          : p.status === "sold"
                          ? "Sold"
                          : "Not For Sale"}
                      </span>
                    </div>
                  )}
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
                  {p.year && (
                    <p className="font-serif-display text-lg text-[#8C4A32] whitespace-nowrap">
                      {p.year}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
