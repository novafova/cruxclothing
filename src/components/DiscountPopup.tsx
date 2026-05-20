import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import markStar from "@/assets/mark-star.png";

export function DiscountPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [emailInput, setEmailInput] = useState("");

    useEffect(() => {
        // Only show once per session
        if (typeof window === "undefined") return;
        if (sessionStorage.getItem("crux_popup_dismissed")) return;

        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailInput) return;

        setIsOpen(false);
        sessionStorage.setItem("crux_popup_dismissed", "true");

        navigator.clipboard.writeText("REVERENCE10");

        toast.success("✦ 10% DISCOUNT COMMITTED ✦", {
            description: "Code 'REVERENCE10' copied to clipboard. Enjoy your dedication.",
            style: {
                background: "#111111",
                border: "1px solid rgba(236, 232, 225, 0.15)",
                color: "#ECE8E1",
                fontFamily: "JetBrains Mono, monospace",
            },
        });
    };

    const handleDismiss = () => {
        setIsOpen(false);
        sessionStorage.setItem("crux_popup_dismissed", "true");

        toast.error("✦ TRIBUTE COMMITMENT ACKNOWLEDGED ✦", {
            description: "Full price accepted. Respect.",
            style: {
                background: "#111111",
                border: "1px solid rgba(236, 232, 225, 0.15)",
                color: "#ECE8E1",
                fontFamily: "JetBrains Mono, monospace",
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center p-4 animate-fade-in"
            style={{ zIndex: 99999, backgroundColor: "rgba(17, 17, 17, 0.8)", backdropFilter: "blur(12px)" }}
        >
            <div className="bg-void border border-bone/15 max-w-md w-full p-8 md:p-10 relative text-center animate-scale-up" style={{ boxShadow: "0 0 50px rgba(0,0,0,0.8)" }}>
                {/* Close Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 text-silver/60 hover:text-bone transition-colors cursor-pointer"
                    aria-label="Close dialog"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Icon */}
                <img src={markStar} alt="" className="w-8 mx-auto mb-6 opacity-60 animate-pulse" />

                <h3 className="font-serif text-2xl tracking-[0.15em] uppercase mb-4 text-bone">
                    INITIATION DROP
                </h3>

                <p className="text-silver text-[11px] tracking-wide leading-relaxed mb-8 max-w-xs mx-auto font-light">
                    Incorporate your email into the order registry to receive a{" "}
                    <span className="text-bone font-medium">10% discount code</span> for your first acquisition.
                </p>

                <form onSubmit={handleSubscribe} className="space-y-4">
                    <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="EMAIL ADDRESS"
                        className="w-full bg-transparent border border-bone/25 px-6 py-4 text-[11px] tracking-[0.25em] uppercase text-center focus:outline-none focus:border-bone transition-colors placeholder:text-iron"
                    />
                    <button
                        type="submit"
                        className="w-full bg-bone text-void py-4 text-[11px] tracking-[0.3em] uppercase font-semibold btn-glow-sweep transition-colors hover:bg-silver cursor-pointer"
                    >
                        Claim 10% Discount
                    </button>
                </form>

                <div className="mt-6">
                    <button
                        onClick={handleDismiss}
                        className="text-[10px] tracking-[0.2em] uppercase text-silver/45 hover:text-silver transition-colors cursor-pointer"
                    >
                        no i'll pay full price
                    </button>
                </div>
            </div>
        </div>
    );
}
