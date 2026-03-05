"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: number;
  tag: string;
  image: string;
  hoverImage?: string;
  bgColor: string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

interface Collection {
  name: string;
  season: string;
  pieces: string;
  image: string;
  tint: string;
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const BagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

// ─── IMAGE DATA ───────────────────────────────────────────────────────────────
// All images use free Unsplash URLs — no API key required.
// ✏️  To use YOUR OWN images: replace any `image` value with a local path
//     e.g.  image: "/images/blazer.jpg"   (put files in /public/images/)

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=90&fit=crop";

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Ironline Denim Jacket",
    price: 480,
    tag: "New Season",
    image:
      "https://i.pinimg.com/736x/84/16/cc/8416cc945dc76b6cd604d82cab41177f.jpg",
    hoverImage:
      "https://i.pinimg.com/736x/f7/9b/68/f79b684b56c55c5a806cd7ebb604f418.jpg",
    bgColor: "#1c1812",
  },
  {
    id: 2,
    name: "Red Silk Midi Dress",
    price: 620,
    tag: "Bestseller",
    image:
      "https://i.pinimg.com/1200x/72/b0/7e/72b07e19b5bd95bb1a2a102bc70d55a6.jpg",
    hoverImage:
      "https://i.pinimg.com/736x/0a/51/b3/0a51b35d49f77c012d7c62fba4c180e0.jpg",
    bgColor: "#f0ece4",
  },
  {
    id: 3,
    name: "Cashmere Wide Trousers",
    price: 395,
    tag: "Limited",
    image:
      "https://i.pinimg.com/736x/2b/a6/78/2ba6780d1e643a6892de3eb5e30a976e.jpg",
    hoverImage:
      "https://i.pinimg.com/736x/97/18/4f/97184f364dfdcdb95f56ade60207e3c9.jpg",
    bgColor: "#e8ddd0",
  },
  {
    id: 4,
    name: "Obsidian Longline Coat",
    price: 1250,
    tag: "Archive",
    image:
      "https://i.pinimg.com/1200x/0e/d9/6d/0ed96dec58c404d38acd55c3956cf1e1.jpg",
    hoverImage:
      "https://i.pinimg.com/1200x/ac/a3/ba/aca3ba6ef74c098375f129985f08bc4c.jpg",
    bgColor: "#2d1f14",
  },
];

const COLLECTIONS: Collection[] = [
  {
    name: "L'Automne",
    season: "AW 2025",
    pieces: "23 Pieces",
    image:
      "https://i.pinimg.com/1200x/8e/dc/93/8edc93d66edcfe3811858b384355393d.jpg",
    tint: "rgba(30,20,10,0.45)",
  },
  {
    name: "L'Éclat",
    season: "SS 2025",
    pieces: "18 Pieces",
    image:
      "https://i.pinimg.com/736x/4c/b6/75/4cb6759f5ce0d6288ca7f6a936ffa2ef.jpg",
    tint: "rgba(10,30,25,0.4)",
  },
  {
    name: "La Nuit",
    season: "Resort",
    pieces: "12 Pieces",
    image:
      "https://i.pinimg.com/736x/0b/4e/60/0b4e602e962d60dd6a3e9b6e81e7447c.jpg",
    tint: "rgba(5,5,20,0.55)",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "An absolutely masterful collection. LUMIÈRE redefined what modern luxury means to me — the craftsmanship is unlike anything I've experienced.",
    author: "Amélie Fontaine",
    role: "Creative Director, Paris",
    rating: 5,
  },
  {
    quote:
      "I wore the Noir Blazer to three gallery openings and received endless compliments. The quality speaks for itself — this is fashion as art.",
    author: "Isabelle Chen",
    role: "Art Curator, New York",
    rating: 5,
  },
  {
    quote:
      "Every detail is considered. The silk midi dress drapes like water. LUMIÈRE is the only brand I trust for events that matter.",
    author: "Margaux Delacroix",
    role: "Architect, Milan",
    rating: 5,
  },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useInView(
  threshold = 0.15
): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function Skeleton({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{
        borderRadius: 4,
        background:
          "linear-gradient(90deg, var(--sk1) 25%, var(--sk2) 50%, var(--sk1) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s infinite",
        ...style,
      }}
    />
  );
}

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const rpos = useRef({ x: 0, y: 0 });
  const hovered = useRef(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    const enter = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,[data-cursor]"))
        hovered.current = true;
    };
    const leave = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,[data-cursor]"))
        hovered.current = false;
    };
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout", leave);
    let raf: number;
    const animate = () => {
      if (dot.current)
        dot.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      if (ring.current) {
        rpos.current.x += (pos.current.x - rpos.current.x) * 0.1;
        rpos.current.y += (pos.current.y - rpos.current.y) * 0.1;
        const s = hovered.current ? 2 : 1;
        ring.current.style.transform = `translate(${rpos.current.x - 16}px, ${rpos.current.y - 16}px) scale(${s})`;
        ring.current.style.opacity = hovered.current ? "0.4" : "0.7";
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        style={{
          position: "fixed", top: 0, left: 0, width: 8, height: 8,
          borderRadius: "50%", background: "#c8a96e",
          pointerEvents: "none", zIndex: 9999,
        }}
      />
      <div
        ref={ring}
        style={{
          position: "fixed", top: 0, left: 0, width: 32, height: 32,
          borderRadius: "50%", border: "1px solid #c8a96e",
          pointerEvents: "none", zIndex: 9998, transition: "opacity 0.3s",
        }}
      />
    </>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({
  dark,
  toggleDark,
}: {
  dark: boolean;
  toggleDark: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const scrollY = useScrollY();
  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
  }, []);
  const scrolled = scrollY > 40;
  const links = ["Collections", "Archive", "Atelier", "About"];

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: scrolled ? "12px 48px" : "24px 48px",
          background: scrolled
            ? dark ? "rgba(8,8,8,0.92)" : "rgba(248,245,240,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`
            : "none",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(-10px)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-cormorant),'Cormorant Garamond',serif",
            fontSize: 22, letterSpacing: "0.25em", fontWeight: 300,
            color: dark ? "#f0ece4" : "#1a1410",
          }}
        >
          LUMIÈRE
        </div>
        <div className="hidden md:flex" style={{ gap: 40, alignItems: "center" }}>
          {links.map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
                color: dark ? "rgba(240,236,228,0.7)" : "rgba(26,20,16,0.6)",
                textDecoration: "none", transition: "color 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = dark ? "#f0ece4" : "#1a1410";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = dark
                  ? "rgba(240,236,228,0.7)"
                  : "rgba(26,20,16,0.6)";
              }}
            >
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button
            onClick={toggleDark}
            style={{
              background: "none", border: "none", padding: 4,
              color: dark ? "#c8a96e" : "#8b7355", opacity: 0.8,
            }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            style={{
              background: "none", border: "none", padding: 4,
              color: dark ? "#f0ece4" : "#1a1410",
            }}
          >
            <BagIcon />
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden"
            style={{
              background: "none", border: "none", padding: 4,
              color: dark ? "#f0ece4" : "#1a1410",
            }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 99,
          background: dark ? "rgba(8,8,8,0.98)" : "rgba(248,245,240,0.98)",
          backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 48,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "opacity 0.4s ease",
        }}
      >
        {links.map((l, i) => (
          <a
            key={l}
            href="#"
            onClick={() => setOpen(false)}
            style={{
              fontFamily: "var(--font-cormorant),serif",
              fontSize: 36, fontWeight: 300, letterSpacing: "0.1em",
              color: dark ? "#f0ece4" : "#1a1410", textDecoration: "none",
              opacity: open ? 1 : 0,
              transform: open ? "none" : "translateY(20px)",
              transition: `opacity 0.4s ${i * 0.06}s, transform 0.4s ${i * 0.06}s`,
            }}
          >
            {l}
          </a>
        ))}
      </div>
    </>
  );
}

// ─── HERO (cinematic background image + parallax) ─────────────────────────────
function Hero({ dark }: { dark: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const scrollY = useScrollY();

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        padding: "120px 24px 80px",
      }}
    >
      {/* ── Real photo with parallax ── */}
      <div
        style={{
          position: "absolute", inset: 0,
          transform: `translateY(${scrollY * 0.25}px) scale(1.1)`,
          transformOrigin: "center top",
        }}
      >
        <Image
          src={HERO_IMAGE}
          alt="LUMIÈRE Editorial"
          fill
          priority
          quality={90}
          style={{ objectFit: "cover", objectPosition: "center top" }}
          onLoad={() => setImgLoaded(true)}
        />
      </div>

      {/* Fallback bg while image loads */}
      {!imgLoaded && (
        <div
          style={{
            position: "absolute", inset: 0,
            background: dark ? "#0d0d0a" : "#ede9e2",
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: dark
            ? "linear-gradient(to bottom, rgba(8,8,6,0.5) 0%, rgba(8,8,6,0.15) 40%, rgba(8,8,6,0.65) 80%, rgba(8,8,6,0.95) 100%)"
            : "linear-gradient(to bottom, rgba(248,245,240,0.4) 0%, rgba(248,245,240,0.08) 40%, rgba(248,245,240,0.6) 80%, rgba(248,245,240,0.95) 100%)",
          transition: "background 0.6s",
        }}
      />

      {/* Grain */}
      <div
        style={{
          position: "absolute", inset: 0, opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px",
        }}
      />

      {/* Season tag */}
      <div
        style={{
          position: "relative", zIndex: 2,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(-10px)",
          transition: "all 0.8s 0.2s",
          display: "flex", alignItems: "center", gap: 12, marginBottom: 48,
        }}
      >
        <div style={{ width: 40, height: 1, background: "#c8a96e" }} />
        <span
          style={{
            fontSize: 11, letterSpacing: "0.25em",
            textTransform: "uppercase", color: "#a17a32",
          }}
        >
          Autumn / Winter 2025
        </span>
        <div style={{ width: 40, height: 1, background: "#c8a96e" }} />
      </div>

      {/* Title */}
      <h1
        style={{
          position: "relative", zIndex: 2,
          fontFamily: "var(--font-cormorant),'Cormorant Garamond',serif",
          fontSize: "clamp(64px, 13vw, 180px)",
          fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 0.88,
          textAlign: "center", margin: 0, color: "#ededed",
          textShadow: "0 2px 40px rgba(0,0,0,0.4)",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(30px)",
          transition: "all 1s 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        LUMIÈRE
      </h1>

      {/* Subtitle */}
      <p
        style={{
          position: "relative", zIndex: 2,
          fontFamily: "var(--font-cormorant),serif",
          fontSize: "clamp(18px, 3vw, 32px)", fontWeight: 300, fontStyle: "italic",
          color: "rgba(240,236,228,0.75)", marginTop: 24, letterSpacing: "0.05em",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(20px)",
          transition: "all 0.9s 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        A new vision of modern luxury.
      </p>

      {/* CTAs */}
      <div
        style={{
          position: "relative", zIndex: 2, marginTop: 56,
          display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(20px)",
          transition: "all 0.9s 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <button
          data-cursor
          style={{
            padding: "14px 40px", background: "#f0ece4", color: "#1a1410",
            border: "none", fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", fontWeight: 500, transition: "all 0.4s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = "#c8a96e";
            el.style.color = "#1a1410";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "#f0ece4";
            el.style.color = "#1a1410";
          }}
        >
          Explore Collection
        </button>
        <button
          data-cursor
          style={{
            padding: "14px 40px", background: "transparent",
            border: "1px solid rgba(240,236,228,0.4)",
            color: "rgba(240,236,228,0.85)", fontSize: 11,
            letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500,
            transition: "all 0.4s",
          }}
        >
          The Archive
        </button>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute", bottom: 32, left: "50%",
          transform: "translateX(-50%)", zIndex: 2,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: loaded ? 0.6 : 0, transition: "opacity 1s 1.4s",
        }}
      >
        <span
          style={{
            fontSize: 9, letterSpacing: "0.2em",
            textTransform: "uppercase", color: dark ? "#f0ece4": "#686153",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1, height: 40, background: dark ? "#f0ece4": "#686153",
            animation: "scrollLine 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}

// ─── COLLECTION PREVIEW (real images, horizontal scroll) ─────────────────────
function CollectionPreview({ dark }: { dark: boolean }) {
  const [ref, inView] = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={{ padding: "120px 0", overflow: "hidden" }}
    >
      <div
        style={{
          padding: "0 48px", marginBottom: 64,
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <p
          style={{
            fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#c8a96e", marginBottom: 16,
          }}
        >
          Our World
        </p>
        <h2
          style={{
            fontFamily: "var(--font-cormorant),serif",
            fontSize: "clamp(36px,5vw,72px)", fontWeight: 300,
            color: dark ? "#f0ece4" : "#1a1410", lineHeight: 1.1,
          }}
        >
          The Collections
        </h2>
      </div>

      <div
        className="scrollbar-none"
        style={{
          display: "flex", gap: 3, overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingLeft: 48, paddingRight: 48,
        }}
      >
        {COLLECTIONS.map((col, i) => (
          <div
            key={i}
            data-cursor
            style={{
              minWidth: "clamp(300px,32vw,460px)",
              height: "clamp(420px,52vw,640px)",
              scrollSnapAlign: "start", position: "relative",
              overflow: "hidden", flexShrink: 0, borderRadius: 2,
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(50px)",
              transition: `all 0.9s ${i * 0.15}s cubic-bezier(0.16,1,0.3,1)`,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              const img = el.querySelector(".col-photo") as HTMLElement;
              const ov = el.querySelector(".col-overlay") as HTMLElement;
              if (img) img.style.transform = "scale(1.07)";
              if (ov) ov.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              const img = el.querySelector(".col-photo") as HTMLElement;
              const ov = el.querySelector(".col-overlay") as HTMLElement;
              if (img) img.style.transform = "scale(1)";
              if (ov) ov.style.opacity = "0";
            }}
          >
            {/* Real photo */}
            <div
              className="col-photo"
              style={{
                position: "absolute", inset: 0,
                transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <Image
                src={col.image}
                alt={col.name}
                fill
                quality={85}
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>

            {/* Persistent gradient at bottom */}
            <div
              style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(to bottom, transparent 30%, ${col.tint} 70%, rgba(0,0,0,0.8) 100%)`,
              }}
            />

            {/* Hover shimmer */}
            <div
              className="col-overlay"
              style={{
                position: "absolute", inset: 0,
                background: "rgba(200,169,110,0.07)",
                opacity: 0, transition: "opacity 0.4s",
              }}
            />

            {/* Text */}
            <div
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 36px" }}
            >
              <p
                style={{
                  fontSize: 10, letterSpacing: "0.25em",
                  textTransform: "uppercase", color: "rgba(240,236,228,0.6)",
                  marginBottom: 10,
                }}
              >
                {col.season} &nbsp;·&nbsp; {col.pieces}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-cormorant),serif",
                  fontSize: "clamp(28px,3vw,40px)", fontWeight: 300, color: "#f0ece4", lineHeight: 1,
                }}
              >
                {col.name}
              </h3>
              <div
                style={{
                  marginTop: 18, display: "flex", alignItems: "center", gap: 8,
                  color: "#c8a96e", fontSize: 12, letterSpacing: "0.12em",
                }}
              >
                <span style={{ textTransform: "uppercase" }}>View</span>
                <ArrowRight />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PRODUCT SHOWCASE (real images + hover swap) ──────────────────────────────
function ProductShowcase({ dark }: { dark: boolean }) {
  const [ref, inView] = useInView(0.05);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ padding: "120px 48px" }}>
      {/* Section header */}
      <div
        style={{
          marginBottom: 80,
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <p
          style={{
            fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#c8a96e", marginBottom: 16,
          }}
        >
          Curated Selection
        </p>
        <div
          style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", flexWrap: "wrap", gap: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-cormorant),serif",
              fontSize: "clamp(36px,5vw,72px)", fontWeight: 300,
              color: dark ? "#f0ece4" : "#1a1410", lineHeight: 1.1,
            }}
          >
            Featured Pieces
          </h2>
          <a
            href="#"
            style={{
              fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
              color: dark ? "rgba(240,236,228,0.5)" : "rgba(26,20,16,0.45)",
              textDecoration: "none", display: "flex", alignItems: "center",
              gap: 8, transition: "color 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#c8a96e";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = dark
                ? "rgba(240,236,228,0.5)"
                : "rgba(26,20,16,0.45)";
            }}
          >
            View All <ArrowRight />
          </a>
        </div>
      </div>

      {/* Product grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(280px,100%), 1fr))",
          gap: 24,
        }}
      >
        {PRODUCTS.map((p, i) => (
          <div
            key={p.id}
            data-cursor
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(60px)",
              transition: `opacity 0.9s ${i * 0.12}s cubic-bezier(0.16,1,0.3,1),
                           transform 0.9s ${i * 0.12}s cubic-bezier(0.16,1,0.3,1)`,
            }}
          >
            {loading ? (
              /* Skeleton */
              <div>
                <Skeleton
                  style={{ height: 420, marginBottom: 16, background: dark ? "#1e1e1e" : "#eae7e2" }}
                />
                <Skeleton
                  style={{ height: 20, width: "70%", marginBottom: 8, background: dark ? "#1e1e1e" : "#eae7e2" }}
                />
                <Skeleton
                  style={{ height: 16, width: "40%", background: dark ? "#1e1e1e" : "#eae7e2" }}
                />
              </div>
            ) : (
              /* Card */
              <div
                style={{
                  background: dark ? "rgba(18,15,12,0.9)" : "rgba(255,255,255,0.95)",
                  border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                  borderRadius: 3, overflow: "hidden",
                  boxShadow:
                    hovered === p.id
                      ? "0 40px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(200,169,110,0.15)"
                      : "0 8px 32px rgba(0,0,0,0.09)",
                  transform: hovered === p.id ? "translateY(-10px)" : "none",
                  transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {/* ── Image zone ── */}
                <div
                  style={{
                    height: 420, position: "relative",
                    overflow: "hidden", background: p.bgColor,
                  }}
                >
                  {/* Primary image */}
                  <div
                    style={{
                      position: "absolute", inset: 0,
                      opacity: hovered === p.id && p.hoverImage ? 0 : 1,
                      transition: "opacity 0.65s ease",
                    }}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      quality={85}
                      style={{
                        objectFit: "cover", objectPosition: "center top",
                        transform: hovered === p.id ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  </div>

                  {/* Hover / alternate image */}
                  {p.hoverImage && (
                    <div
                      style={{
                        position: "absolute", inset: 0,
                        opacity: hovered === p.id ? 1 : 0,
                        transition: "opacity 0.65s ease",
                      }}
                    >
                      <Image
                        src={p.hoverImage}
                        alt={`${p.name} — alternate view`}
                        fill
                        quality={85}
                        style={{
                          objectFit: "cover", objectPosition: "center top",
                          transform: hovered === p.id ? "scale(1.05)" : "scale(1.1)",
                          transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                        }}
                      />
                    </div>
                  )}

                  {/* Tag badge */}
                  <div
                    style={{
                      position: "absolute", top: 16, left: 16,
                      background: "rgba(8,8,6,0.68)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(200,169,110,0.3)",
                      padding: "5px 12px", borderRadius: 2,
                      fontSize: 9, letterSpacing: "0.18em",
                      textTransform: "uppercase", color: "#c8a96e", fontWeight: 500,
                    }}
                  >
                    {p.tag}
                  </div>

                  {/* Quick-add on hover */}
                  <div
                    style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "linear-gradient(to top, rgba(8,8,6,0.85) 0%, transparent 100%)",
                      padding: "32px 20px 20px",
                      opacity: hovered === p.id ? 1 : 0,
                      transform: hovered === p.id ? "translateY(0)" : "translateY(10px)",
                      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    <button
                      style={{
                        width: "100%", padding: 12, background: "#c8a96e",
                        border: "none", color: "#1a1410", fontSize: 10,
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        fontWeight: 600, borderRadius: 1, transition: "background 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#d4b980";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#c8a96e";
                      }}
                    >
                      Quick Add
                    </button>
                  </div>
                </div>

                {/* ── Card info ── */}
                <div style={{ padding: "22px 24px 26px" }}>
                  <div
                    style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start", gap: 12,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-cormorant),serif",
                          fontSize: 21, fontWeight: 400,
                          color: dark ? "#f0ece4" : "#1a1410",
                          lineHeight: 1.2, marginBottom: 6,
                        }}
                      >
                        {p.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-cormorant),serif",
                          fontSize: 17, fontWeight: 300,
                          color: dark ? "rgba(240,236,228,0.55)" : "rgba(26,20,16,0.5)",
                        }}
                      >
                        €{p.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      style={{
                        marginTop: 4, flexShrink: 0,
                        background: "none",
                        border: `1px solid ${dark ? "rgba(240,236,228,0.18)" : "rgba(26,20,16,0.14)"}`,
                        padding: "8px 18px", fontSize: 9, letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: dark ? "rgba(240,236,228,0.65)" : "rgba(26,20,16,0.55)",
                        transition: "all 0.3s", whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.background = "#c8a96e";
                        el.style.borderColor = "#c8a96e";
                        el.style.color = "#1a1410";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.background = "none";
                        el.style.borderColor = dark
                          ? "rgba(240,236,228,0.18)"
                          : "rgba(26,20,16,0.14)";
                        el.style.color = dark
                          ? "rgba(240,236,228,0.65)"
                          : "rgba(26,20,16,0.55)";
                      }}
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── EDITORIAL MARQUEE ────────────────────────────────────────────────────────
function EditorialStrip({ dark }: { dark: boolean }) {
  const words = [
    "Handcrafted", "·", "Sustainable", "·", "Timeless", "·",
    "Paris", "·", "Exclusive", "·",
  ];
  return (
    <section
      style={{
        padding: "70px 0", overflow: "hidden",
        borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0, 0, 0, 0.06)"}`,
        borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      }}
    >
      <div
        style={{
          display: "flex",
          animation: "marquee 22s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {Array.from({ length: 3 }, (_, k) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 48, paddingRight: 48 }}>
            {words.map((t, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-cormorant),serif",
                  fontSize: "clamp(18px,2.5vw,28px)", fontWeight: dark ? 500 : 700,
                  fontStyle: t === "·" ? "normal" : "italic",
                  color:
                    t === "·"
                      ? "#c8a96e"
                      : dark ? "rgba(240,236,228,0.38)" : "rgba(0, 0, 0, 0.32)",
                  letterSpacing: "0.05em",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials({ dark }: { dark: boolean }) {
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [dir, setDir] = useState(1);
  const [ref, inView] = useInView(0.2);
  const [autoplay, setAutoplay] = useState(true);

  const go = useCallback((d: number) => {
    setDir(d);
    setIndex((i) => (i + d + TESTIMONIALS.length) % TESTIMONIALS.length);
    setAnimKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [autoplay, go]);

  const t = TESTIMONIALS[index];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      style={{ padding: "140px 48px", textAlign: "center" }}
    >
      <div
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <p
          style={{
            fontSize: 11, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#c8a96e", marginBottom: 16,
          }}
        >
          What They Say
        </p>
        <h2
          style={{
            fontFamily: "var(--font-cormorant),serif",
            fontSize: "clamp(32px,4vw,56px)", fontWeight: 300,
            color: dark ? "#f0ece4" : "#1a1410", marginBottom: 80,
          }}
        >
          Client Stories
        </h2>
      </div>

      <div
        style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
      >
        <div
          style={{
            background: dark ? "rgba(30,26,20,0.6)" : "rgba(255,255,255,0.75)",
            backdropFilter: "blur(30px)",
            border: `1px solid ${dark ? "rgba(200,169,110,0.12)" : "rgba(200,169,110,0.2)"}`,
            borderRadius: 8,
            padding: "clamp(32px,5vw,60px) clamp(28px,7vw,80px)",
            position: "relative",
            boxShadow: dark
              ? "0 40px 100px rgba(0,0,0,0.5)"
              : "0 40px 100px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              position: "absolute", top: -20, left: 60,
              fontFamily: "var(--font-cormorant),serif",
              fontSize: 120, lineHeight: 1, color: "#c8a96e", opacity: 0.15,
              userSelect: "none",
            }}
          >
            &ldquo;
          </div>

          <div
            key={animKey}
            style={{
              animation: `${dir > 0 ? "fadeSlideIn" : "fadeSlideInLeft"} 0.6s cubic-bezier(0.16,1,0.3,1)`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 32 }}>
              {Array.from({ length: t.rating }, (_, i) => (
                <span key={i} style={{ color: "#c8a96e", fontSize: 14 }}>★</span>
              ))}
            </div>
            <p
              style={{
                fontFamily: "var(--font-cormorant),serif",
                fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 300, fontStyle: "italic",
                color: dark ? "rgba(240,236,228,0.85)" : "rgba(26,20,16,0.75)",
                lineHeight: 1.7, marginBottom: 40,
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
            <div style={{ width: 40, height: 1, background: "#c8a96e", margin: "0 auto 24px" }} />
            <p
              style={{
                fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase",
                color: dark ? "#f0ece4" : "#1a1410", marginBottom: 6, fontWeight: 500,
              }}
            >
              {t.author}
            </p>
            <p
              style={{
                fontSize: 11, letterSpacing: "0.1em",
                color: dark ? "rgba(240,236,228,0.4)" : "rgba(26,20,16,0.4)",
                textTransform: "uppercase",
              }}
            >
              {t.role}
            </p>
          </div>
        </div>

        {/* Slider controls */}
        <div
          style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", gap: 24, marginTop: 40,
          }}
        >
          <button
            onClick={() => go(-1)}
            style={{
              background: "none",
              border: `1px solid ${dark ? "rgba(240,236,228,0.2)" : "rgba(26,20,16,0.15)"}`,
              borderRadius: "50%", width: 44, height: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: dark ? "rgba(240,236,228,0.6)" : "rgba(26,20,16,0.5)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "#c8a96e";
              el.style.color = "#c8a96e";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = dark ? "rgba(240,236,228,0.2)" : "rgba(26,20,16,0.15)";
              el.style.color = dark ? "rgba(240,236,228,0.6)" : "rgba(26,20,16,0.5)";
            }}
          >
            <ArrowLeft />
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  setIndex(i);
                  setAnimKey((k) => k + 1);
                }}
                style={{
                  width: i === index ? 24 : 6, height: 6, borderRadius: 3,
                  background:
                    i === index
                      ? "#c8a96e"
                      : dark ? "rgba(240,236,228,0.2)" : "rgba(26,20,16,0.15)",
                  border: "none", padding: 0,
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            style={{
              background: "none",
              border: `1px solid ${dark ? "rgba(240,236,228,0.2)" : "rgba(26,20,16,0.15)"}`,
              borderRadius: "50%", width: 44, height: 44,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: dark ? "rgba(240,236,228,0.6)" : "rgba(26,20,16,0.5)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "#c8a96e";
              el.style.color = "#c8a96e";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = dark ? "rgba(240,236,228,0.2)" : "rgba(26,20,16,0.15)";
              el.style.color = dark ? "rgba(240,236,228,0.6)" : "rgba(26,20,16,0.5)";
            }}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ dark }: { dark: boolean }) {
  const [ref, inView] = useInView(0.1);
  const columns: [string, string[]][] = [
    ["Collections", ["L'Automne", "L'Éclat", "La Nuit", "Archive"]],
    ["Atelier", ["Our Story", "Craftsmanship", "Sustainability", "Press"]],
    ["Support", ["Care Guide", "Returns", "Sizing", "Contact"]],
  ];

  return (
    <footer
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        padding: "80px 48px 48px",
        borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
          gap: 48, marginBottom: 64,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-cormorant),serif",
              fontSize: 20, letterSpacing: "0.2em",
              color: dark ? "#f0ece4" : "#1a1410", marginBottom: 16,
            }}
          >
            LUMIÈRE
          </p>
          <p
            style={{
              fontSize: 12, lineHeight: 1.8,
              color: dark ? "rgba(240,236,228,0.4)" : "rgba(26,20,16,0.4)",
              maxWidth: 220,
            }}
          >
            A Paris-based luxury fashion house crafting timeless pieces for the modern era.
          </p>
        </div>
        {columns.map(([title, links]) => (
          <div key={title}>
            <p
              style={{
                fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
                color: "#c8a96e", marginBottom: 20, fontWeight: 500,
              }}
            >
              {title}
            </p>
            {links.map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  display: "block", fontSize: 13,
                  color: dark ? "rgba(240,236,228,0.45)" : "rgba(26,20,16,0.45)",
                  textDecoration: "none", marginBottom: 12,
                  letterSpacing: "0.05em", transition: "color 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = dark ? "#f0ece4" : "#1a1410";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = dark
                    ? "rgba(240,236,228,0.45)"
                    : "rgba(26,20,16,0.45)";
                }}
              >
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 16, paddingTop: 32,
          borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: dark ? "rgba(240,236,228,0.3)" : "rgba(26,20,16,0.3)",
            letterSpacing: "0.05em",
          }}
        >
          © 2025 LUMIÈRE. All rights reserved.
        </p>
        <p
          style={{
            fontSize: 11,
            color: dark ? "rgba(240,236,228,0.3)" : "rgba(26,20,16,0.3)",
            fontFamily: "var(--font-cormorant),serif",
            fontStyle: "italic", letterSpacing: "0.1em",
          }}
        >
          Paris — New York — Milan
        </p>
      </div>
    </footer>
  );
}

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────
export default function Home() {
  const [dark, setDark] = useState(true);

  return (
    <div
      style={{
        fontFamily: "'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",
        background: dark ? "#080806" : "#f8f5f0",
        color: dark ? "#f0ece4" : "#1a1410",
        minHeight: "100vh",
        transition: "background 0.6s ease, color 0.6s ease",
      }}
    >
      <style>{`
        :root {
          --sk1: ${dark ? "#1e1a16" : "#eae7e2"};
          --sk2: ${dark ? "#2a2520" : "#f5f2ee"};
        }
        * { cursor: none !important; }
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .scrollbar-none { scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #c8a96e; border-radius: 2px; }
        .hidden { display: none; }
        @media (min-width: 768px) { .md\\:flex { display: flex !important; } }
      `}</style>

      <CustomCursor />
      <Navbar dark={dark} toggleDark={() => setDark((d) => !d)} />

      <main>
        <Hero dark={dark} />
        <CollectionPreview dark={dark} />
        <EditorialStrip dark={dark} />
        <ProductShowcase dark={dark} />
        <Testimonials dark={dark} />
      </main>

      <Footer dark={dark} />
    </div>
  );
}