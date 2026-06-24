import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const HERO_IMG = "https://images.pexels.com/photos/313776/pexels-photo-313776.jpeg";
const CRAFTSMAN_IMG = "https://images.unsplash.com/photo-1659930087003-2d64e33181f7";
const WORKSHOP_IMG = "https://images.pexels.com/photos/14951839/pexels-photo-14951839.jpeg";

export default function Home() {
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
              Hutto, TX — Est. 2014
            </p>
            <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl text-[#F9F6F0] leading-[0.95] tracking-tight">
              Heirloom wood,
              <br />
              <span className="italic text-[#C8A07A]">made slow.</span>
            </h1>
            <p className="mt-8 text-lg text-[#E3DACD] max-w-xl leading-relaxed">
              Hand-built pieces using traditional joinery and American
              hardwoods. One bench. One pair of hands. One piece at a time.
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
