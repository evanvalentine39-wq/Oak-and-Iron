import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCheckoutSession, fetchProduct } from "@/lib/api";

const formatPrice = (n, c = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(n);

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
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

  const handleBuy = async () => {
    if (!product) return;
    setCheckingOut(true);
    try {
      const { url } = await createCheckoutSession(product.id);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL");
      }
    } catch (e) {
      toast.error("Couldn't start checkout. Please try again or reach out directly.");
      setCheckingOut(false);
    }
  };

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
        <p data-testid="product-error" className="label-eyebrow text-[#B22222] mb-6">
          {error || "Piece not found."}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 label-eyebrow text-[#8C4A32] border-b border-[#8C4A32] pb-1"
        >
          <ArrowLeft size={14} /> Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="product-detail-page" className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <Link
          to="/shop"
          data-testid="product-back-link"
          className="inline-flex items-center gap-2 label-eyebrow text-[#5C5852] hover:text-[#8C4A32] mb-12"
        >
          <ArrowLeft size={14} /> All pieces
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
            </div>
          </div>

          <div className="lg:col-span-5 space-y-10">
            <div>
              <p className="label-eyebrow text-[#8C4A32] mb-4">
                {product.category}
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

            <div className="flex items-baseline justify-between border-y border-[#E3DACD] py-6">
              <p className="label-eyebrow text-[#5C5852]">Price</p>
              <p
                data-testid="product-price"
                className="font-serif-display text-3xl text-[#2C2A28]"
              >
                {formatPrice(product.price, product.currency)}
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

            <div className="space-y-4 pt-4">
              <button
                data-testid="product-buy-btn"
                onClick={handleBuy}
                disabled={checkingOut}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-5 bg-[#2C2A28] text-[#F9F6F0] label-eyebrow hover:bg-[#8C4A32] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {checkingOut ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Taking you to checkout…
                  </>
                ) : (
                  <>Buy this piece — {formatPrice(product.price, product.currency)}</>
                )}
              </button>
              <Link
                to="/contact"
                data-testid="product-commission-link"
                className="block text-center w-full px-8 py-4 border border-[#2C2A28] text-[#2C2A28] label-eyebrow hover:bg-[#2C2A28] hover:text-[#F9F6F0] transition-colors duration-300"
              >
                Or commission something similar
              </Link>
              <p className="text-xs text-[#5C5852] text-center pt-2">
                Secure checkout via Stripe. Ships from Asheville, NC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
