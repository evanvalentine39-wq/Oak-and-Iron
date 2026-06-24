import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { fetchProduct } from "@/lib/api";

const STATUS_META = {
  for_sale: {
    label: "For Sale",
    note: "This piece is available. Use the contact form to inquire about price and shipping.",
    classes: "bg-[#4A5D23] text-[#F9F6F0]",
  },
  sold: {
    label: "Sold",
    note: "This one has found its home. I can build something similar — get in touch to start a conversation.",
    classes: "bg-[#2C2A28] text-[#F9F6F0]",
  },
  not_for_sale: {
    label: "Not For Sale",
    note: "Kept for the record. If you want one like it, reach out and we can talk commission.",
    classes: "bg-[#F9F6F0] text-[#2C2A28] border border-[#2C2A28]",
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchProduct(id)
      .then((data) => {
        setProduct(data);
        setError("");
      })
      .catch(() => setError("Piece not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div
        data-testid="product-loading"
        className="pt-40 pb-24 text-center label-eyebrow text-[#5C5852]"
      >
        Loading…
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-40 pb-24 max-w-3xl mx-auto px-6 text-center">
        <p
          data-testid="product-error"
          className="label-eyebrow text-[#B22222] mb-6"
        >
          {error || "Piece not found."}
        </p>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 label-eyebrow text-[#8C4A32] border-b border-[#8C4A32] pb-1"
        >
          <ArrowLeft size={14} /> Back to the portfolio
        </Link>
      </div>
    );
  }

  const status = STATUS_META[product.status] || STATUS_META.not_for_sale;

  return (
    <div data-testid="product-detail-page" className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <Link
          to="/portfolio"
          data-testid="product-back-link"
          className="inline-flex items-center gap-2 label-eyebrow text-[#5C5852] hover:text-[#8C4A32] mb-12"
        >
          <ArrowLeft size={14} /> All work
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-7 lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F1EBE4]">
              <img
                data-testid="product-image"
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span
                  data-testid="product-status-badge"
                  className={`label-eyebrow px-3 py-1 ${status.classes}`}
                >
                  {status.label}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-10">
            <div>
              <p className="label-eyebrow text-[#8C4A32] mb-4">
                {product.category}
                {product.year ? ` — ${product.year}` : ""}
              </p>
              <h1
                data-testid="product-name"
                className="font-serif-display text-4xl sm:text-5xl text-[#2C2A28] leading-[1.05] tracking-tight"
              >
                {product.name}
              </h1>
              <p className="mt-3 italic text-lg text-[#5C5852]">
                {product.tagline}
              </p>
            </div>

            <div className="border-y border-[#E3DACD] py-6">
              <p className="label-eyebrow text-[#5C5852] mb-2">Status</p>
              <p
                data-testid="product-status-note"
                className="font-serif-display text-xl text-[#2C2A28] leading-snug"
              >
                {status.note}
              </p>
            </div>

            <p className="text-[#5C5852] leading-relaxed text-lg">
              {product.description}
            </p>

            <div>
              <p className="label-eyebrow text-[#8C4A32] mb-4">Details</p>
              <ul className="space-y-2 text-[#5C5852]">
                {product.specs.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 border-b border-[#E3DACD] pb-2"
                  >
                    <span className="font-serif-display text-[#C8A07A] text-sm pt-1">
                      0{i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Link
                to="/contact"
                data-testid="product-inquire-link"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-5 bg-[#2C2A28] text-[#F9F6F0] label-eyebrow hover:bg-[#8C4A32] transition-colors duration-300"
              >
                Inquire about this piece <ArrowRight size={16} />
              </Link>
              <p className="text-xs text-[#5C5852] text-center pt-3">
                All inquiries go directly to the maker in Hutto, TX.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
