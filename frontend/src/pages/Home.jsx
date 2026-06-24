import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { fetchProducts } from "@/lib/api";

const HERO_IMG = "https://images.pexels.com/photos/313776/pexels-photo-313776.jpeg";
const CRAFTSMAN_IMG = "https://images.unsplash.com/photo-1659930087003-2d64e33181f7";
const WORKSHOP_IMG = "https://images.pexels.com/photos/14951839/pexels-photo-14951839.jpeg";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  return (
    <div data-testid="home-page">
      {/* Hero */}
      <section
        data-testid="hero-section"
        className="relative h-[92vh] min-h-[600px] w-full overflow-hidden"
      >
        <img
          src={HERO_IMG}
          alt="Woodworker at the bench"
          className="absolute inset-0 w-full h-full object-cover ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1816]/85 via-[#1a1816]/55 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 h-full flex flex-col justify-end pb-24">
          <div className="max-w-2xl fade-up">
            <p className="label-eyebrow text-[#C8A07A] mb-6">
              Asheville, NC — Est. 2014
            </p>
            <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl text-[#F9F6F0] leading-[0.95] tracking-tight">
              Heirloom wood,
              <br />
              <span className="italic text-[#C8A07A]">made slow.</span>
            </h1>
            <p className="mt-8 text-lg text-[#E3DACD] max-w-xl leading-relaxed">
              Hand-built furniture and kitchen pieces from American hardwoods.
              One bench. One pair of hands. One piece at a time.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                data-testid="hero-shop-cta"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F9F6F0] text-[#2C2A28] label-eyebrow hover:bg-[#C8A07A] transition-colors duration-300"
              >
                Browse the Shop <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                data-testid="hero-contact-cta"
                className="inline-flex items-center gap-2 px-8 py-4 border border-[#F9F6F0]/70 text-[#F9F6F0] label-eyebrow hover:bg-[#F9F6F0] hover:text-[#2C2A28] transition-colors duration-300"
              >
                Contact Here <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 sm:right-12 z-10 hidden sm:block">
          <p className="label-eyebrow text-[#C8A07A] writing-mode-vertical text-right">
            Scroll ↓
          </p>
        </div>
      </section>

      {/* About / Story */}
      <section
        data-testid="about-section"
        className="max-w-7xl mx-auto px-6 sm:px-12 py-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-20 items-start">
          <div className="md:col-span-5 md:sticky md:top-32">
            <p className="label-eyebrow text-[#8C4A32] mb-6">The Maker</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl text-[#2C2A28] leading-[1.05] tracking-tight">
              A small workshop.
              <br />
              <span className="italic">A long apprenticeship.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 space-y-6 text-[#5C5852] text-lg leading-relaxed">
            <p>
              I&apos;ve been working wood for the better part of two decades.
              What started in my grandfather&apos;s garage with a dull chisel
              and a stubborn piece of cherry is now a one-person shop tucked
              into a converted hay barn in the Blue Ridge.
            </p>
            <p>
              Every board passes through my hands. I source domestic
              hardwoods—walnut, oak, ash, cherry—from sawyers I&apos;ve known
              for years. There are no shortcuts here. No CNC. No assembly line.
            </p>
            <p>
              If you commission a piece, you&apos;ll hear from me directly.
              We&apos;ll talk about how you live, where it&apos;ll sit, what
              you want it to feel like in twenty years.
            </p>
            <Link
              to="/contact"
              data-testid="about-contact-link"
              className="inline-flex items-center gap-2 label-eyebrow text-[#8C4A32] hover:text-[#703B28] border-b border-[#8C4A32] pb-1 mt-4"
            >
              Start a commission <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Work / Portfolio strip */}
      <section
        data-testid="portfolio-section"
        className="bg-[#F1EBE4] py-32"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="label-eyebrow text-[#8C4A32] mb-4">
                Featured Pieces
              </p>
              <h2 className="font-serif-display text-4xl sm:text-5xl text-[#2C2A28] leading-tight">
                Recent work from
                <br />
                <span className="italic">the bench.</span>
              </h2>
            </div>
            <Link
              to="/shop"
              data-testid="portfolio-shop-link"
              className="label-eyebrow text-[#8C4A32] border-b border-[#8C4A32] pb-1 hover:text-[#703B28]"
            >
              See everything →
            </Link>
          </div>

          {/* Asymmetric grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            {products.slice(0, 4).map((p, idx) => {
              const spans = [
                "md:col-span-7 md:row-span-2 aspect-[4/5]",
                "md:col-span-5 aspect-[4/3]",
                "md:col-span-5 aspect-[5/4]",
                "md:col-span-7 aspect-[5/3]",
              ];
              return (
                <Link
                  key={p.id}
                  to={`/shop/${p.id}`}
                  data-testid={`portfolio-card-${p.id}`}
                  className={`group product-card relative overflow-hidden bg-[#2C2A28] ${spans[idx]}`}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="product-card-image absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1816]/85 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-[#F9F6F0]">
                    <p className="label-eyebrow text-[#C8A07A] mb-2">
                      {p.category}
                    </p>
                    <h3 className="font-serif-display text-2xl sm:text-3xl leading-tight">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-sm text-[#E3DACD] italic">
                      {p.tagline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process strip */}
      <section
        data-testid="process-section"
        className="max-w-7xl mx-auto px-6 sm:px-12 py-32"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <img
              src={CRAFTSMAN_IMG}
              alt="Hands at work"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="label-eyebrow text-[#8C4A32] mb-6">The Process</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl text-[#2C2A28] leading-[1.05] mb-10">
              From rough lumber
              <br />
              <span className="italic">to finished piece.</span>
            </h2>
            <ol className="space-y-8">
              {[
                ["01", "Source", "Domestic hardwoods from local sawyers."],
                ["02", "Mill", "Boards rough-cut and stickered to dry."],
                ["03", "Shape", "Hand tools and a few well-tuned machines."],
                ["04", "Finish", "Oils, waxes, and a final hand-sand."],
              ].map(([num, title, body]) => (
                <li key={num} className="grid grid-cols-12 gap-4 items-start">
                  <span className="col-span-2 font-serif-display text-3xl text-[#C8A07A]">
                    {num}
                  </span>
                  <div className="col-span-10">
                    <h3 className="font-serif-display text-xl text-[#2C2A28] mb-1">
                      {title}
                    </h3>
                    <p className="text-[#5C5852] leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Workshop banner */}
      <section
        data-testid="workshop-banner"
        className="relative h-[60vh] min-h-[420px] overflow-hidden"
      >
        <img
          src={WORKSHOP_IMG}
          alt="The workshop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1a1816]/55" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 h-full flex items-center">
          <div className="max-w-2xl">
            <p className="label-eyebrow text-[#C8A07A] mb-6">Visit the Shop</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl text-[#F9F6F0] leading-[1.05]">
              The workshop is open
              <br />
              <span className="italic text-[#C8A07A]">by appointment.</span>
            </h2>
            <Link
              to="/contact"
              data-testid="workshop-contact-cta"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-[#F9F6F0] text-[#2C2A28] label-eyebrow hover:bg-[#C8A07A]"
            >
              Contact Here <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
