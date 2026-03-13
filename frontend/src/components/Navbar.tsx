"use client";
import { useState, useEffect } from "react";

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

export default function Navbar({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const scrollY = useScrollY();
  useEffect(() => { setTimeout(() => setLoaded(true), 150); }, []);
  const scrolled = scrollY > 40;

  const NAV = [
    { label: "Collections", href: "/products" },
    { label: "Archive", href: "/archive" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const lc = dark ? "rgba(240,236,228,0.68)" : "rgba(26,20,16,0.58)";
  const lh = dark ? "#f0ece4" : "#1a1410";

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: scrolled ? "10px 48px" : "22px 48px",
        background: scrolled ? (dark ? "rgba(8,8,6,0.95)" : "rgba(248,245,240,0.95)") : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` : "none",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(-12px)",
      }}>
        {/* LOGO */}
        <a href="/" style={{ fontFamily: "var(--font-cormorant),'Cormorant Garamond',serif", fontSize: 21, letterSpacing: "0.26em", fontWeight: 300, color: dark ? "#f0ece4" : "#1a1410", textDecoration: "none" }}>LUMIÈRE</a>

        {/* CENTRE LINKS */}
<div style={{ display: "flex", gap: 42, alignItems: "center" }}>
  {NAV.map(l => (
    <a
      key={l.label}
      href={l.href}
      style={{
        fontFamily: "var(--font-cormorant),'Cormorant Garamond',serif",
        fontSize: 14,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: lc,
        textDecoration: "none",
        paddingBottom: 4,
        borderBottom: "1px solid transparent",
        transition: "color 0.3s, border-color 0.3s"
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.color = lh;
        el.style.borderColor = "#c8a96e";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.color = lc;
        el.style.borderColor = "transparent";
      }}
    >
      {l.label}
    </a>
  ))}
</div>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Sign In */}
          <a href="/login"
            style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: dark ? "rgba(240,236,228,0.62)" : "rgba(26,20,16,0.52)", textDecoration: "none", border: `1px solid ${dark ? "rgba(240,236,228,0.2)" : "rgba(26,20,16,0.16)"}`, padding: "6px 16px", transition: "all 0.3s" }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "#c8a96e"; el.style.color = "#c8a96e"; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = dark ? "rgba(240,236,228,0.2)" : "rgba(26,20,16,0.16)"; el.style.color = dark ? "rgba(240,236,228,0.62)" : "rgba(26,20,16,0.52)"; }}
          >Sign In</a>

          {/* Dark/Light toggle */}
          <button onClick={toggleDark} style={{ background: "none", border: "none", padding: 4, color: dark ? "#c8a96e" : "#8b7355", opacity: 0.85, display: "flex", alignItems: "center" }}>
            {dark
              ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            }
          </button>

          {/* Cart */}
          <a href="/cart" style={{ color: dark ? "#f0ece4" : "#1a1410", display: "inline-flex", padding: 4, textDecoration: "none" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </a>

          {/* Hamburger */}
          <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", padding: 4, color: dark ? "#f0ece4" : "#1a1410", display: "flex" }}>
            {open
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </div>
      </nav>

      {/* OVERLAY MENU */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 199,
        background: dark ? "rgba(8,8,6,0.98)" : "rgba(248,245,240,0.98)",
        backdropFilter: "blur(24px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
        opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none", transition: "opacity 0.4s ease",
      }}>
        {NAV.map((l, i) => (
          <a key={l.label} href={l.href} onClick={() => setOpen(false)}
            style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 42, fontWeight: 300, letterSpacing: "0.06em", color: dark ? "#f0ece4" : "#1a1410", textDecoration: "none", opacity: open ? 1 : 0, transform: open ? "none" : "translateY(20px)", transition: `opacity 0.4s ${i * 0.07}s, transform 0.4s ${i * 0.07}s` }}
          >{l.label}</a>
        ))}
        <div style={{ width: 48, height: 1, background: "rgba(200,169,110,0.35)", margin: "8px 0" }} />
        <a href="/login" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 28, fontWeight: 300, color: "#c8a96e", textDecoration: "none" }}>Sign In</a>
        <a href="/register" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 22, fontWeight: 300, color: dark ? "rgba(240,236,228,0.42)" : "rgba(26,20,16,0.42)", textDecoration: "none" }}>Create Account</a>
        <a href="/orders" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 22, fontWeight: 300, color: dark ? "rgba(240,236,228,0.42)" : "rgba(26,20,16,0.42)", textDecoration: "none" }}>My Orders</a>
        <a href="/cart" onClick={() => setOpen(false)} style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 22, fontWeight: 300, color: dark ? "rgba(240,236,228,0.42)" : "rgba(26,20,16,0.42)", textDecoration: "none" }}>My Cart</a>
      </div>
    </>
  );
}
