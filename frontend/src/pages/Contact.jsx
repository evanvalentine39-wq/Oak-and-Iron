import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, Clock } from "lucide-react";
import { submitContact } from "@/lib/api";

const WORKSHOP_IMG = "https://images.pexels.com/photos/14951839/pexels-photo-14951839.jpeg";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Name, email, and message are required.");
      return;
    }
    setSubmitting(true);
    try {
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
      });
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent. I'll be in touch soon.");
    } catch (err) {
      toast.error("Couldn't send the message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page" className="pt-28 pb-0">
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: atmospheric image + meta */}
          <div className="lg:col-span-5">
            <p className="label-eyebrow text-[#8C4A32] mb-6">Contact Here</p>
            <h1 className="font-serif-display text-5xl sm:text-6xl text-[#2C2A28] leading-[0.95] tracking-tight">
              Drop me
              <br />
              <span className="italic">a line.</span>
            </h1>
            <p className="mt-8 text-[#5C5852] leading-relaxed text-lg">
              Whether you have a commission in mind, a question about a piece
              in the shop, or you just want to talk wood — I read every
              message myself.
            </p>

            <div className="mt-12 relative overflow-hidden aspect-[4/5]">
              <img
                src={WORKSHOP_IMG}
                alt="The workshop"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <ul className="mt-10 space-y-5 text-[#5C5852]">
              <li className="flex items-start gap-4">
                <Mail size={18} className="mt-1 text-[#8C4A32]" />
                <div>
                  <p className="label-eyebrow text-[#8C4A32]">Email</p>
                  <p>hello@hearthwood.studio</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin size={18} className="mt-1 text-[#8C4A32]" />
                <div>
                  <p className="label-eyebrow text-[#8C4A32]">Workshop</p>
                  <p>Asheville, NC — visits by appointment</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Clock size={18} className="mt-1 text-[#8C4A32]" />
                <div>
                  <p className="label-eyebrow text-[#8C4A32]">Reply Time</p>
                  <p>Usually within 1–3 days. Faster on rainy ones.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-6 lg:col-start-7">
            <form
              data-testid="contact-form"
              onSubmit={onSubmit}
              className="bg-[#F1EBE4] p-8 sm:p-12 border border-[#E3DACD] space-y-8"
            >
              <div>
                <label className="label-eyebrow text-[#8C4A32] block mb-3">
                  Your Name
                </label>
                <input
                  data-testid="contact-name-input"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  className="w-full bg-transparent border-0 border-b border-[#8C4A32]/40 focus:border-[#8C4A32] outline-none py-2 text-[#2C2A28] font-serif-display text-xl placeholder:text-[#5C5852]/60"
                  placeholder="Jane Carpenter"
                />
              </div>
              <div>
                <label className="label-eyebrow text-[#8C4A32] block mb-3">
                  Email
                </label>
                <input
                  data-testid="contact-email-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  className="w-full bg-transparent border-0 border-b border-[#8C4A32]/40 focus:border-[#8C4A32] outline-none py-2 text-[#2C2A28] font-serif-display text-xl placeholder:text-[#5C5852]/60"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="label-eyebrow text-[#8C4A32] block mb-3">
                  Subject (optional)
                </label>
                <input
                  data-testid="contact-subject-input"
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={onChange}
                  className="w-full bg-transparent border-0 border-b border-[#8C4A32]/40 focus:border-[#8C4A32] outline-none py-2 text-[#2C2A28] font-serif-display text-xl placeholder:text-[#5C5852]/60"
                  placeholder="A dining table for six"
                />
              </div>
              <div>
                <label className="label-eyebrow text-[#8C4A32] block mb-3">
                  Message
                </label>
                <textarea
                  data-testid="contact-message-input"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  required
                  rows={6}
                  className="w-full bg-transparent border border-[#8C4A32]/30 focus:border-[#8C4A32] outline-none p-4 text-[#2C2A28] placeholder:text-[#5C5852]/60 resize-none"
                  placeholder="Tell me about the piece, the room it'll live in, when you'd like it…"
                />
              </div>

              <button
                data-testid="contact-submit-btn"
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-5 bg-[#2C2A28] text-[#F9F6F0] label-eyebrow hover:bg-[#8C4A32] transition-colors duration-300 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>Send the message →</>
                )}
              </button>

              {sent && (
                <p
                  data-testid="contact-success-message"
                  className="text-center label-eyebrow text-[#4A5D23] border-t border-[#E3DACD] pt-6"
                >
                  Thank you. I&apos;ll be in touch.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
