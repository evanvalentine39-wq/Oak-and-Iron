import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";
import { getPaymentStatus } from "@/lib/api";

const MAX_ATTEMPTS = 8;
const POLL_INTERVAL_MS = 2000;

export default function PaymentReturn() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState({
    phase: "checking", // checking | paid | failed | expired | timeout
    payload: null,
  });
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!sessionId) {
      setState({ phase: "failed", payload: { reason: "Missing session id" } });
      return;
    }

    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      try {
        const data = await getPaymentStatus(sessionId);
        if (cancelled) return;

        if (data.payment_status === "paid") {
          setState({ phase: "paid", payload: data });
          return;
        }
        if (data.status === "expired") {
          setState({ phase: "expired", payload: data });
          return;
        }
        attemptsRef.current += 1;
        if (attemptsRef.current >= MAX_ATTEMPTS) {
          setState({ phase: "timeout", payload: data });
          return;
        }
        setTimeout(poll, POLL_INTERVAL_MS);
      } catch (e) {
        if (cancelled) return;
        attemptsRef.current += 1;
        if (attemptsRef.current >= MAX_ATTEMPTS) {
          setState({ phase: "failed", payload: { reason: "Network error" } });
          return;
        }
        setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div
      data-testid="payment-return-page"
      className="pt-40 pb-24 max-w-3xl mx-auto px-6 sm:px-12 text-center min-h-[70vh] flex flex-col items-center justify-center"
    >
      {state.phase === "checking" && (
        <>
          <Loader2 size={42} className="text-[#8C4A32] animate-spin mb-8" />
          <p
            data-testid="payment-status-label"
            className="label-eyebrow text-[#8C4A32] mb-4"
          >
            Confirming your purchase
          </p>
          <h1 className="font-serif-display text-4xl sm:text-5xl text-[#2C2A28] leading-tight">
            One moment.
            <br />
            <span className="italic">Hand on the chisel.</span>
          </h1>
        </>
      )}

      {state.phase === "paid" && (
        <>
          <CheckCircle2 size={48} className="text-[#4A5D23] mb-8" />
          <p
            data-testid="payment-status-label"
            className="label-eyebrow text-[#4A5D23] mb-4"
          >
            Payment received
          </p>
          <h1 className="font-serif-display text-4xl sm:text-5xl text-[#2C2A28] leading-tight">
            Thank you.
            <br />
            <span className="italic">It&apos;s on the bench.</span>
          </h1>
          <p className="mt-8 text-[#5C5852] leading-relaxed max-w-lg">
            I&apos;ll send you a personal note within 24 hours with shipping
            details and the story of the piece you just bought.
          </p>
          <Link
            to="/shop"
            data-testid="payment-back-to-shop"
            className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-[#2C2A28] text-[#F9F6F0] label-eyebrow hover:bg-[#8C4A32] transition-colors duration-300"
          >
            Back to the shop <ArrowRight size={14} />
          </Link>
        </>
      )}

      {(state.phase === "failed" || state.phase === "expired" || state.phase === "timeout") && (
        <>
          <XCircle size={42} className="text-[#B22222] mb-8" />
          <p
            data-testid="payment-status-label"
            className="label-eyebrow text-[#B22222] mb-4"
          >
            {state.phase === "expired"
              ? "Checkout expired"
              : state.phase === "timeout"
              ? "Still processing"
              : "Couldn't confirm payment"}
          </p>
          <h1 className="font-serif-display text-4xl sm:text-5xl text-[#2C2A28] leading-tight">
            Something didn&apos;t take.
          </h1>
          <p className="mt-6 text-[#5C5852] leading-relaxed max-w-lg">
            No charge was completed on our side. Try again, or reach out
            directly and I&apos;ll help you finish the order.
          </p>
          <div className="flex flex-wrap items-center gap-4 justify-center mt-10">
            <Link
              to="/shop"
              data-testid="payment-retry-link"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2C2A28] text-[#F9F6F0] label-eyebrow hover:bg-[#8C4A32]"
            >
              Back to the shop
            </Link>
            <Link
              to="/contact"
              data-testid="payment-contact-link"
              className="inline-flex items-center gap-2 px-8 py-4 border border-[#2C2A28] text-[#2C2A28] label-eyebrow hover:bg-[#2C2A28] hover:text-[#F9F6F0]"
            >
              Contact the maker
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
