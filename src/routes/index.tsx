import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Trash2, Plus, Minus, ShoppingBag, Sparkles, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

import featuredDenim from "@/assets/featured-denim.png";
import productStarDenim from "@/assets/product-star-denim.png";
import productHoodie from "@/assets/product-hoodie.jpg";
import productKnit from "@/assets/product-knit.jpg";
import productBelt from "@/assets/product-belt.jpg";
import markCross from "@/assets/mark-cross.png";
import markStar from "@/assets/mark-star.png";
import cruxLogo from "@/assets/crux-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CRUX — Worn With Reverence | Alternative Archive Clothing" },
      {
        name: "description",
        content:
          "CRUX is an alternative archive clothing label. Hand-distressed denim, gothic knits, and luxury decay. Built from conflict.",
      },
      { property: "og:title", content: "CRUX — Worn With Reverence" },
      {
        property: "og:description",
        content: "Alternative archive clothing. Luxury decay. Limited drops.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400&display=swap",
      },
    ],
  }),
  loader: async () => {
    const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
    const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

    if (!domain || !token) {
      return { shopifyProducts: [] };
    }

    try {
      const res = await fetch(
        `https://${domain}/api/2026-04/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
          },
          body: JSON.stringify({
            query: `
              {
                products(first: 10) {
                  edges {
                    node {
                      title
                      handle
                      descriptionHtml
                      description
                      featuredImage {
                        url
                      }
                      priceRange {
                        minVariantPrice {
                          amount
                          currencyCode
                        }
                      }
                      variants(first: 10) {
                        edges {
                          node {
                            id
                            title
                            availableForSale
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
          }),
        }
      );

      const data = await res.json();
      return {
        shopifyProducts: data?.data?.products?.edges?.map((e: any) => e.node) || [],
      };
    } catch (err) {
      console.error("Shopify fetch failed:", err);
      return { shopifyProducts: [] };
    }
  },
  component: Index,
});

// Static fallback images and details keyed by lowercase product name fragment
const staticFallbacks: Record<string, { image: string; ref: string; details: string[] }> = {
  "starfall": {
    image: featuredDenim,
    ref: "CRX-01 / Raw Indigo",
    details: ["14oz raw Japanese selvedge denim", "Embroidered 4-point stars at cuffs and knees", "Signature metal cross buttons", "Relaxed baggy fit", "Hand-distressed hems"],
  },
  "stellar": {
    image: productStarDenim,
    ref: "CRX-02 / Bone White",
    details: ["13.5oz heavyweight denim canvas", "Bone white aged wash", "Frayed detailing along seams and pockets", "Wide-leg stacked silhouette", "Washed iron hardware"],
  },
  "knit": {
    image: productKnit,
    ref: "CRX-03 / Distressed Black",
    details: ["40% Mohair, 30% Wool, 30% Acrylic", "Laddered and dropped stitch distressing", "Custom aged black horn buttons", "Dropped shoulder fit", "Dry clean only"],
  },
  "cardigan": {
    image: productKnit,
    ref: "CRX-03 / Distressed Black",
    details: ["40% Mohair, 30% Wool, 30% Acrylic", "Laddered and dropped stitch distressing", "Custom aged black horn buttons", "Dropped shoulder fit", "Dry clean only"],
  },
  "hoodie": {
    image: productHoodie,
    ref: "CRX-04 / Aged Charcoal",
    details: ["450gsm 100% organic cotton loopback French terry", "Aged oil-washed finish", "Gothic cross graphic printed on front", "Raw-edge hems and hood detailing", "Double-layered spacious hood"],
  },
  "belt": {
    image: productBelt,
    ref: "CRX-05 / Antique Silver",
    details: ["100% vegetable-tanned bridle leather", "Solid metal cast CRUX buckle", "Antique silver finish with distressed patina", "Hand-burnished wax edges", "Made in Japan"],
  },
};

const fallbackImages = [featuredDenim, productStarDenim, productKnit, productHoodie, productBelt];

function findFallback(title: string) {
  const lower = title.toLowerCase();
  for (const key of Object.keys(staticFallbacks)) {
    if (lower.includes(key)) return staticFallbacks[key];
  }
  return null;
}

// Hardcoded fallback products if Shopify is unavailable
const fallbackProducts = [
  {
    name: "Starfall Baggy Denim",
    ref: "CRX-01 / Raw Indigo",
    price: 90,
    displayPrice: "$90.00",
    image: featuredDenim,
    description: "Cut from 14oz raw indigo Japanese selvedge with a relaxed baggy silhouette. Embroidered star patterns scatter from the hem upward — quietly devotional, made to fade with wear.",
    sizes: ["S", "M", "L", "XL"],
    details: ["14oz raw Japanese selvedge denim", "Embroidered 4-point stars at cuffs and knees", "Signature metal cross buttons", "Relaxed baggy fit", "Hand-distressed hems"],
    handle: "starfall-baggy-denim",
    variants: [],
  },
  {
    name: "Stellar Wide-Leg Denim",
    ref: "CRX-02 / Bone White",
    price: 80,
    displayPrice: "$80.00",
    image: productStarDenim,
    description: "Wide-leg silhouette crafted from heavy 13.5oz bone white denim canvas. Features custom hardware, gothic seam paneling, and frayed edge distressing that continues to decay beautifully.",
    sizes: ["S", "M", "L", "XL"],
    details: ["13.5oz heavyweight denim canvas", "Bone white aged wash", "Frayed detailing along seams and pockets", "Wide-leg stacked silhouette", "Washed iron hardware"],
    handle: "stellar-wide-leg-denim",
    variants: [],
  },
  {
    name: "Gothic Knit Cardigan",
    ref: "CRX-03 / Distressed Black",
    price: 145,
    displayPrice: "$145.00",
    image: productKnit,
    description: "Ultra-heavyweight mohair-blend cardigan in distressed black. Intentionally laddered and dropped stitches throughout create a shredded, luxury decay texture. Relaxed drape.",
    sizes: ["S", "M", "L", "XL"],
    details: ["40% Mohair, 30% Wool, 30% Acrylic", "Laddered and dropped stitch distressing", "Custom aged black horn buttons", "Dropped shoulder fit", "Dry clean only"],
    handle: "gothic-knit-cardigan",
    variants: [],
  },
  {
    name: "Crux Emblem Hoodie",
    ref: "CRX-04 / Aged Charcoal",
    price: 120,
    displayPrice: "$120.00",
    image: productHoodie,
    description: "Heavy 450gsm French Terry hoodie in an aged, oil-washed charcoal tone. Features hand-painted gothic chest print, raw edge cuffs, and distressing at seams. Built to endure.",
    sizes: ["S", "M", "L", "XL"],
    details: ["450gsm 100% organic cotton loopback French terry", "Aged oil-washed finish", "Gothic cross graphic printed on front", "Raw-edge hems and hood detailing", "Double-layered spacious hood"],
    handle: "crux-emblem-hoodie",
    variants: [],
  },
  {
    name: "Belt 01 — Logo Buckle",
    ref: "CRX-05 / Antique Silver",
    price: 185,
    displayPrice: "$185.00",
    image: productBelt,
    description: "Full-grain thick bridle leather belt with custom gothic cross hardware. The buckle is cast in solid metal with a heavy antique silver patina. Hand-finished edges.",
    sizes: ["S", "M", "L"],
    details: ["100% vegetable-tanned bridle leather", "Solid metal cast CRUX buckle", "Antique silver finish with distressed patina", "Hand-burnished wax edges", "Made in Japan"],
    handle: "belt-01-logo-buckle",
    variants: [],
  },
];

function buildProducts(shopifyProducts: any[]) {
  if (!shopifyProducts || shopifyProducts.length === 0) return fallbackProducts;

  return shopifyProducts.map((sp: any, i: number) => {
    const fb = findFallback(sp.title);
    const price = parseFloat(sp.priceRange?.minVariantPrice?.amount || "0");
    const sizes = sp.variants?.edges
      ?.map((v: any) => v.node.title)
      ?.filter((s: string) => s !== "Default Title") || ["S", "M", "L", "XL"];

    const variants = sp.variants?.edges?.map((v: any) => ({
      id: v.node.id,
      title: v.node.title,
    })) || [];

    return {
      name: sp.title,
      ref: fb?.ref || `CRX-${String(i + 1).padStart(2, "0")}`,
      price,
      displayPrice: `$${price.toFixed(2)}`,
      image: sp.featuredImage?.url || fb?.image || fallbackImages[i % fallbackImages.length],
      description: sp.description || "",
      sizes: sizes.length > 0 ? sizes : ["S", "M", "L", "XL"],
      details: fb?.details || [],
      handle: sp.handle,
      variants,
    };
  });
}

function Index() {
  const { shopifyProducts } = Route.useLoaderData();
  const products = buildProducts(shopifyProducts);

  const [cart, setCart] = useState<{ product: (typeof products)[0]; size: string; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [productDrawerSize, setProductDrawerSize] = useState("M");
  const [featuredSize, setFeaturedSize] = useState("M");
  const [cartBounce, setCartBounce] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const activeProduct = products[activeProductIndex] || products[0];
  const featuredProduct = activeProduct;

  const cartBtnRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const handleFeaturedProductChange = (nextIndex: number) => {
    const nextProduct = products[nextIndex] || products[0];
    setActiveProductIndex(nextIndex);
    setFeaturedSize(nextProduct?.sizes?.[0] || "M");
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!featuredProduct) return;
    if (!featuredProduct.sizes.includes(featuredSize)) {
      setFeaturedSize(featuredProduct.sizes[0] || "M");
    }
  }, [featuredProduct, featuredSize]);


  const triggerCartBounce = () => {
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 600);
  };

  const spawnParticles = (startX: number, startY: number) => {
    if (!cartBtnRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cartRect = cartBtnRef.current.getBoundingClientRect();
    const targetX = cartRect.left + cartRect.width / 2;
    const targetY = cartRect.top + cartRect.height / 2;

    const newParticles: any[] = [];
    const shapes = ["star", "cross", "dot"];

    for (let i = 0; i < 22; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      newParticles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.45 ? "#ECE8E1" : "#B8B8B8",
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        life: 0,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    if (!animFrameRef.current) {
      const runLoop = () => {
        const currentCanvas = canvasRef.current;
        if (!currentCanvas) return;
        const currentCtx = currentCanvas.getContext("2d");
        if (!currentCtx) return;

        currentCtx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);

        const pList = particlesRef.current;
        if (pList.length === 0) {
          animFrameRef.current = null;
          return;
        }

        const freshCartRect = cartBtnRef.current?.getBoundingClientRect();
        const currentTargetX = freshCartRect ? (freshCartRect.left + freshCartRect.width / 2) : targetX;
        const currentTargetY = freshCartRect ? (freshCartRect.top + freshCartRect.height / 2) : targetY;

        for (let i = pList.length - 1; i >= 0; i--) {
          const p = pList[i];
          p.life += 1;

          const dx = currentTargetX - p.x;
          const dy = currentTargetY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 15) {
            pList.splice(i, 1);
            triggerCartBounce();
            continue;
          }

          const pull = 0.08 + (p.life > 8 ? 0.18 : 0);
          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;

          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          const maxSpeed = 16;
          if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
          }

          p.vx *= 0.96;
          p.vy *= 0.96;

          p.x += p.vx;
          p.y += p.vy;

          currentCtx.save();
          currentCtx.globalAlpha = p.alpha;
          currentCtx.shadowBlur = 6;
          currentCtx.shadowColor = "rgba(236, 232, 225, 0.4)";
          currentCtx.fillStyle = p.color;
          currentCtx.strokeStyle = p.color;
          currentCtx.lineWidth = 1.2;

          if (p.shape === "cross") {
            currentCtx.beginPath();
            currentCtx.moveTo(p.x - p.size, p.y);
            currentCtx.lineTo(p.x + p.size, p.y);
            currentCtx.moveTo(p.x, p.y - p.size);
            currentCtx.lineTo(p.x, p.y + p.size);
            currentCtx.stroke();
          } else if (p.shape === "star") {
            currentCtx.beginPath();
            currentCtx.moveTo(p.x, p.y - p.size);
            currentCtx.quadraticCurveTo(p.x, p.y, p.x + p.size, p.y);
            currentCtx.quadraticCurveTo(p.x, p.y, p.x, p.y + p.size);
            currentCtx.quadraticCurveTo(p.x, p.y, p.x - p.size, p.y);
            currentCtx.quadraticCurveTo(p.x, p.y, p.x, p.y - p.size);
            currentCtx.fill();
          } else {
            currentCtx.beginPath();
            currentCtx.arc(p.x, p.y, p.size / 2.5, 0, Math.PI * 2);
            currentCtx.fill();
          }

          currentCtx.restore();
        }

        animFrameRef.current = requestAnimationFrame(runLoop);
      };
      animFrameRef.current = requestAnimationFrame(runLoop);
    }
  };

  const addToCart = (product: typeof products[0], size: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.name === product.name && item.size === size
      );
      if (existingIdx > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIdx].quantity += 1;
        return nextCart;
      }
      return [...prevCart, { product, size, quantity: 1 }];
    });

    const rect = event.currentTarget.getBoundingClientRect();
    const startX = event.clientX || (rect.left + rect.width / 2);
    const startY = event.clientY || (rect.top + rect.height / 2);

    spawnParticles(startX, startY);

    toast.success(`✦ ${product.name.toUpperCase()} COMMITTED ✦`, {
      description: `Added size ${size} to collection.`,
      action: {
        label: "VIEW CART",
        onClick: () => setIsCartOpen(true),
      },
      style: {
        background: "#111111",
        border: "1px solid rgba(236, 232, 225, 0.15)",
        color: "#ECE8E1",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "11px",
        letterSpacing: "0.1em",
      },
    });

    setTimeout(() => {
      setIsCartOpen(true);
    }, 700);
  };

  const updateQuantity = (productName: string, size: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.name === productName && item.size === size) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (productName: string, size: string) => {
    setCart((prevCart) => prevCart.filter((item) => !(item.product.name === productName && item.size === size)));
    toast.error("✦ ITEM DE-COMMITTED ✦", {
      description: "Removed from collection holdings.",
      style: {
        background: "#111111",
        border: "1px solid rgba(236, 232, 225, 0.15)",
        color: "#ECE8E1",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "11px",
      },
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Show loading state
    toast.loading("✦ ESTABLISHING TRANSIT LINK ✦", {
      style: {
        background: "#111111",
        border: "1px solid rgba(236, 232, 225, 0.15)",
        color: "#ECE8E1",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: "11px",
      },
      id: "checkout-loading"
    });

    const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
    const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

    // Map items to variant IDs
    const lineItems = cart.map(item => {
      // Find the variant that matches the selected size
      const variant = item.product.variants.find((v: any) => v.title === item.size) || item.product.variants[0];
      return {
        variantId: variant?.id,
        quantity: item.quantity
      };
    }).filter(li => li.variantId);

    try {
      const response = await fetch(`https://${domain}/api/2026-04/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({
          query: `
            mutation checkoutCreate($input: CheckoutCreateInput!) {
              checkoutCreate(input: $input) {
                checkout {
                  webUrl
                }
                checkoutUserErrors {
                  code
                  field
                  message
                }
              }
            }
          `,
          variables: {
            input: {
              lineItems: lineItems
            }
          }
        })
      });

      const result = await response.json();
      const checkout = result.data?.checkoutCreate?.checkout;
      const errors = result.data?.checkoutCreate?.checkoutUserErrors;

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      if (checkout?.webUrl) {
        toast.success("✦ TRANSIT LINK SECURED ✦", { id: "checkout-loading" });
        // Optional: Postscript / Analytics tracking for "Initiate Checkout"
        console.log("Redirecting to Shopify Checkout:", checkout.webUrl);
        window.location.href = checkout.webUrl;
      } else {
        throw new Error("Failed to create checkout");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("✦ TRANSIT INTERRUPTED ✦", {
        description: error instanceof Error ? error.message : "Failed to establish Shopify link. Please try again.",
        id: "checkout-loading"
      });
    }

    // Confetti effect anyway for flair
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2);
  };

  return (
    <div className="min-h-screen bg-void text-bone relative overflow-x-hidden">
      {/* Canvas for Flying Particles */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-void/85 backdrop-blur-md border-b border-bone/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-10">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-bone hover:text-silver transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <a href="#" aria-label="CRUX home" className="flex items-center hover:opacity-85 transition-opacity">
              <img src={cruxLogo} alt="CRUX" className="h-10 w-auto" />
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#shop" className="text-[11px] tracking-[0.25em] uppercase text-bone/80 hover:text-bone transition-all relative py-2 group">
                Shop
                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-bone transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
              <a href="#archive" className="text-[11px] tracking-[0.25em] uppercase text-bone/80 hover:text-bone transition-all relative py-2 group">
                Archive
                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-bone transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
              <a href="#story" className="text-[11px] tracking-[0.25em] uppercase text-bone/80 hover:text-bone transition-all relative py-2 group">
                Story
                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-bone transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
              <a href="#contact" className="text-[11px] tracking-[0.25em] uppercase text-bone/80 hover:text-bone transition-all relative py-2 group">
                Contact
                <span className="absolute bottom-0 left-1/2 w-0 h-px bg-bone transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
            </div>
          </div>
          <button
            ref={cartBtnRef}
            onClick={() => setIsCartOpen(true)}
            className={`flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase hover:text-silver transition-all duration-300 relative py-2 ${cartBounce ? "animate-cart-pop text-bone scale-110" : ""
              }`}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
              <path d="M1.75 1.002a.75.75 0 1 0 0 1.5h.342l1.01 5.341a2.75 2.75 0 0 0 2.701 2.24h5.275a2.75 2.75 0 0 0 2.686-2.145l1.04-4.83a.75.75 0 0 0-1.464-.315l-1.04 4.83a1.25 1.25 0 0 1-1.22 1.018H5.803a1.25 1.25 0 0 1-1.227-1.018L3.566 1.5H14.25a.75.75 0 0 0 0-1.5H1.75Z" />
              <path d="M6 14a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
            <span className="hidden sm:inline">Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-1 w-1.5 h-1.5 bg-bone rounded-full animate-pulse shadow-[0_0_8px_#ECE8E1]" />
            )}
          </button>


        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-[80vw] max-w-xs bg-void border-r border-bone/10 text-bone p-8 sm:p-10 flex flex-col z-100 outline-none">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Main site navigation</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-10 sm:gap-12 mt-8 sm:mt-10">
            <a
              href="#shop"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg tracking-[0.3em] uppercase text-bone hover:text-silver transition-all"
            >
              Shop
            </a>
            <a
              href="#archive"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg tracking-[0.3em] uppercase text-bone hover:text-silver transition-all"
            >
              Archive
            </a>
            <a
              href="#story"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg tracking-[0.3em] uppercase text-bone hover:text-silver transition-all"
            >
              Story
            </a>
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="text-lg tracking-[0.3em] uppercase text-bone hover:text-silver transition-all"
            >
              Contact
            </a>
          </div>
          <div className="mt-auto py-8 sm:py-10 border-t border-bone/10">
            <img src={cruxLogo} alt="CRUX" className="h-8 w-auto mb-6 opacity-50" />
            <p className="text-[10px] tracking-[0.2em] uppercase text-silver font-mono">
              Luxury Decay / Est. 2024
            </p>
          </div>
        </SheetContent>
      </Sheet>

      {/* Hero */}
      <section className="relative py-16 sm:py-28 md:py-40 border-b border-bone/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center animate-reveal">
          <h1 className="mb-10">
            <span className="sr-only">CRUX</span>
            <img
              src={cruxLogo}
              alt="CRUX"
              className="w-[min(80vw,640px)] h-auto mx-auto hover:scale-[1.02] transition-transform duration-700"
            />
          </h1>
          <p className="text-xs sm:text-sm md:text-base tracking-[0.3em] sm:tracking-[0.5em] uppercase text-silver mb-10 sm:mb-14 animate-pulse">
            Reverence Embodied
          </p>
          <a
            href="#archive"
            className="group inline-flex items-center gap-3 bg-bone text-void px-6 sm:px-10 py-3.5 sm:py-4 ring-1 ring-bone hover:bg-transparent hover:text-bone transition-all duration-500 btn-glow-sweep"
          >
            <span className="text-[11px] tracking-[0.3em] uppercase font-medium">Enter the Archive</span>
            <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </a>
        </div>
        <img
          src={markCross}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -right-10 w-72 opacity-[0.03] rotate-12"
        />
      </section>

      {/* Featured Drop */}
      <section id="shop" className="py-16 sm:py-24 md:py-32 bg-ash/20 border-b border-bone/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="relative aspect-3/4 overflow-hidden bg-ash border border-bone/10 shimmer-card group">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover img-zoom"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="lg:col-span-5">
              <label className="block mb-6">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-silver block mb-3">
                  Select Piece
                </span>
                <select
                  value={activeProductIndex}
                  onChange={(event) => handleFeaturedProductChange(Number(event.target.value))}
                  onInput={(event) => handleFeaturedProductChange(Number(event.currentTarget.value))}
                  className="w-full bg-void border border-bone/25 text-bone px-4 py-3 text-[11px] font-mono tracking-[0.18em] uppercase outline-none transition-colors cursor-pointer hover:border-bone focus:border-bone"
                  aria-label="Select product"
                >
                  {products.map((product, index) => (
                    <option key={product.name} value={index} className="bg-void text-bone">
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
              <span className="text-[11px] tracking-[0.3em] uppercase text-silver mb-6 block">{featuredProduct.ref}</span>
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl tracking-wide mb-6 sm:mb-8 uppercase leading-tight whitespace-pre-line">
                {featuredProduct.name.replace(/\s+/g, '\n')}
              </h2>
              <p className="text-silver leading-relaxed mb-8 max-w-md font-light">
                {featuredProduct.description}
              </p>

              {/* Sizing Selection */}
              <div className="mb-8">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-silver block mb-3">
                  Select Size
                </span>
                <div className="flex gap-2">
                  {featuredProduct.sizes.map((size: string) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setFeaturedSize(size)}
                      className={`w-10 h-10 border text-[10px] font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer ${featuredSize === size
                        ? "bg-bone text-void border-bone shadow-[0_0_12px_rgba(236,232,225,0.25)] font-semibold"
                        : "border-bone/25 text-bone hover:border-bone"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-6 border-y border-bone/15 mb-10">
                <span className="text-2xl font-serif">{featuredProduct.displayPrice}</span>
                <span className="text-[11px] uppercase tracking-[0.25em] text-silver font-mono">Preorder Limited</span>
              </div>
              <button
                type="button"
                onClick={(e) => addToCart(featuredProduct, featuredSize, e)}
                className="w-full bg-transparent border border-bone/25 hover:bg-bone hover:text-void py-4 transition-all duration-500 text-[11px] tracking-[0.3em] uppercase btn-glow-sweep cursor-pointer font-medium"
              >
                Add to Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Archive Grid */}
      <section id="archive" className="py-16 sm:py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-10 sm:mb-16">
            <div>
              <h3 className="font-serif text-xl sm:text-3xl md:text-4xl tracking-[0.08em] sm:tracking-[0.15em] uppercase">Archive Catalog</h3>
              <p className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-silver mt-2 sm:mt-3">Permanent Collection</p>
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-silver font-mono">Vol. 024–025</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((p, index) => (
              <article
                key={p.name}
                onClick={() => {
                  handleFeaturedProductChange(index);
                  window.scrollTo({ top: document.getElementById('shop')?.offsetTop ? document.getElementById('shop')!.offsetTop - 80 : 0, behavior: 'smooth' });
                  // We still keep the drawer as an option or remove it? 
                  // User said "one page", let's keep it for now but prioritize the main view
                  // setSelectedProduct(p);
                  // setIsProductOpen(true);
                }}
                className="bg-void p-4 sm:p-6 group cursor-pointer border border-bone/0 hover:border-bone/15 transition-all duration-500 shimmer-card flex flex-col justify-between"
              >
                <div className="relative aspect-4/5 bg-ash overflow-hidden mb-6 border border-bone/5">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover img-zoom"
                    loading="lazy"
                  />
                  {/* Inspect Overlay */}
                  <div className="absolute inset-0 bg-void/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="border border-bone/20 bg-void/90 px-4 py-2 text-[10px] tracking-[0.3em] uppercase text-bone font-mono transition-transform duration-500 translate-y-3 group-hover:translate-y-0 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-silver" />
                      <span>Inspect Piece</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[12px] tracking-[0.2em] uppercase mb-1 font-serif group-hover:text-bone transition-colors">{p.name}</h4>
                    <span className="text-[10px] text-silver font-mono tracking-wider">{p.ref}</span>
                  </div>
                  <span className="text-sm font-serif">{p.displayPrice}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto Strip */}
      <section className="py-10 border-y border-bone/10 bg-bone text-void overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center shrink-0 font-serif text-lg sm:text-2xl md:text-4xl tracking-[0.3em] sm:tracking-[0.5em] uppercase font-semibold"
            >
              <span className="px-4 sm:px-10">Chaos</span><span className="opacity-45">✦</span>
              <span className="px-4 sm:px-10">Faith</span><span className="opacity-45">✦</span>
              <span className="px-4 sm:px-10">Pain</span><span className="opacity-45">✦</span>
              <span className="px-4 sm:px-10">Beauty</span><span className="opacity-45">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ethos Story */}
      <section id="story" className="py-16 sm:py-24 md:py-32 border-b border-bone/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center z-10 relative">
          <img src={markCross} alt="" className="w-10 mx-auto mb-10 opacity-50 hover:rotate-180 transition-transform duration-1000" />
          <span className="text-[11px] tracking-[0.3em] uppercase text-silver mb-6 block">Our Ethos</span>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-6xl uppercase tracking-[0.04em] sm:tracking-[0.08em] mb-8 sm:mb-10 leading-tight">
            Refined through<br />the struggle.
          </h2>
          <p className="text-silver leading-relaxed text-sm sm:text-lg font-light max-w-2xl mx-auto">
            CRUX exists at the intersection of high fashion and subculture. We
            don't believe in perfection — we believe in the beauty of the worn,
            the repaired, the resilient. Every piece is an archive in the
            making, hand-distressed in limited counts and never restocked.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section id="contact" className="py-16 sm:py-24 md:py-32">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <img src={markStar} alt="" className="w-8 mx-auto mb-8 opacity-40 animate-pulse" />
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl tracking-[0.08em] sm:tracking-[0.15em] uppercase mb-6">Join the Order</h2>
          <p className="text-silver text-[12px] tracking-[0.25em] uppercase mb-12">
            Early access to drops and archival releases.
          </p>
          <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); toast.success("✦ INCORPORATED INTO THE ORDER ✦", { description: "You will be alerted at next dispatch." }); }}>
            <input
              type="email"
              required
              placeholder="EMAIL ADDRESS"
              className="bg-transparent border border-bone/20 px-6 py-4 text-[12px] tracking-[0.25em] uppercase focus:outline-none focus:border-bone transition-colors placeholder:text-iron"
            />
            <button
              type="submit"
              className="bg-bone text-void py-4 text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-silver transition-colors btn-glow-sweep cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-bone/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-10">
            <img src={cruxLogo} alt="CRUX" className="h-8 w-auto" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-silver font-mono">Luxury Decay / Est. 2024</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-[10px] tracking-[0.25em] uppercase text-silver">
            <a href="#" className="hover:text-bone transition-colors">Instagram</a>
            <a href="#" className="hover:text-bone transition-colors">TikTok</a>
            <a href="#" className="hover:text-bone transition-colors">Shipping</a>
            <a href="#" className="hover:text-bone transition-colors">Legal</a>
          </div>
        </div>
      </footer>

      {/* Cart Sheet Drawer */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-void border-l border-bone/10 text-bone p-6 flex flex-col h-full z-100 outline-none">
          <SheetHeader className="pb-4 border-b border-bone/15">
            <SheetTitle className="font-serif text-lg tracking-[0.2em] uppercase text-bone">
              Your Collection
            </SheetTitle>
            <SheetDescription className="text-[10px] tracking-[0.2em] uppercase text-silver font-mono">
              CRX Archival Holdings
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <ShoppingBag className="w-8 h-8 text-silver/30 mb-4 stroke-1" />
                <p className="text-[11px] tracking-[0.25em] uppercase text-silver leading-relaxed">
                  Your collection archive is currently empty.
                </p>
                <p className="text-[9px] tracking-[0.2em] uppercase text-iron mt-2">
                  Select and inspect pieces to build.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={`${item.product.name}-${item.size}`}
                    className="flex items-center gap-4 p-3 bg-ash/10 border border-bone/5 hover:border-bone/10 transition-colors animate-fade-in-up"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-20 object-cover bg-ash border border-bone/10"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-serif tracking-wider uppercase truncate text-bone">
                        {item.product.name}
                      </h4>
                      <p className="text-[9px] font-mono text-silver uppercase mt-0.5">
                        Size: {item.size}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.name, item.size, -1)}
                          className="p-1 hover:text-bone text-silver transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[10px] font-mono text-bone">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.name, item.size, 1)}
                          className="p-1 hover:text-bone text-silver transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-serif font-medium text-bone block">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.name, item.size)}
                        className="mt-2 text-silver/40 hover:text-destructive transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="pt-6 border-t border-bone/15 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-silver block">
                    Subtotal
                  </span>
                  <span className="text-[9px] font-mono tracking-wider text-iron uppercase">
                    Duties & taxes calculated at checkout
                  </span>
                </div>
                <span className="text-2xl font-serif text-bone">
                  ${cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-bone text-void py-4 text-[11px] tracking-[0.3em] uppercase font-semibold btn-glow-sweep transition-colors hover:bg-silver cursor-pointer text-center"
              >
                Commit Collection
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Product Detail Drawer */}
      <Sheet open={isProductOpen} onOpenChange={setIsProductOpen}>
        <SheetContent className="w-full sm:max-w-md bg-void border-l border-bone/10 text-bone p-6 flex flex-col h-full z-100 outline-none overflow-y-auto">
          {selectedProduct && (
            <div className="space-y-8 pb-8 flex-1">
              <div className="relative aspect-4/5 bg-ash overflow-hidden border border-bone/10 group shimmer-card">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-silver block mb-1">
                  {selectedProduct.ref}
                </span>
                <h3 className="font-serif text-2xl tracking-wide uppercase text-bone leading-tight">
                  {selectedProduct.name}
                </h3>
                <span className="text-xl font-serif text-bone mt-2 block font-medium">
                  {selectedProduct.displayPrice}
                </span>
              </div>

              <p className="text-xs text-silver leading-relaxed font-light">
                {selectedProduct.description}
              </p>

              {/* Size Selection */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-silver block">
                  Select Size
                </span>
                <div className="flex gap-2">
                  {selectedProduct.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setProductDrawerSize(size)}
                      className={`w-10 h-10 border text-[10px] font-mono tracking-widest uppercase transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer ${productDrawerSize === size
                        ? "bg-bone text-void border-bone shadow-[0_0_12px_rgba(236,232,225,0.25)] font-semibold"
                        : "border-bone/25 text-bone hover:border-bone"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div className="space-y-3 pt-6 border-t border-bone/10">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-silver block">
                  Specifications
                </span>
                <ul className="space-y-2">
                  {selectedProduct.details.map((detail, index) => (
                    <li key={index} className="text-[10px] text-silver font-mono tracking-wide flex items-start gap-2">
                      <span className="text-bone">✦</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add to Collection Button */}
              <button
                onClick={(e) => {
                  addToCart(selectedProduct, productDrawerSize, e);
                  setIsProductOpen(false);
                }}
                className="w-full bg-bone text-void py-4 text-[11px] tracking-[0.3em] uppercase font-semibold btn-glow-sweep transition-colors hover:bg-silver mt-8 cursor-pointer text-center"
              >
                Add to Collection
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>


    </div>
  );
}
