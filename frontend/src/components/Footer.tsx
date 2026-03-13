"use client";

export default function Footer({ dark }: { dark: boolean }) {
  const fg = dark ? "#f0ece4" : "#1a1410";
  const sub = dark ? "rgba(240,236,228,0.42)" : "rgba(26,20,16,0.38)";
  const border = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

  const cols = [
    { title: "Collections", links: [{ l: "All Products", h: "/products" }, { l: "Archive", h: "/archive" }, { l: "New Arrivals", h: "/products" }, { l: "Bestsellers", h: "/products" }] },
    { title: "Company", links: [{ l: "About Us", h: "/about" }, { l: "Atelier", h: "/about" }, { l: "Sustainability", h: "/about" }, { l: "Press", h: "/contact" }] },
    { title: "Account", links: [{ l: "Sign In", h: "/login" }, { l: "Register", h: "/register" }, { l: "My Orders", h: "/orders" }, { l: "My Cart", h: "/cart" }] },
    { title: "Help", links: [{ l: "Contact Us", h: "/contact" }, { l: "Sizing Guide", h: "/contact" }, { l: "Returns", h: "/contact" }, { l: "FAQ", h: "/contact" }] },
  ];

  return (
    <footer style={{ padding: "80px 48px 48px", borderTop: `1px solid ${border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 48, marginBottom: 56 }}>
        <div>
          <a href="/" style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 20, letterSpacing: "0.22em", color: fg, display: "block", marginBottom: 14, textDecoration: "none" }}>LUMIÈRE</a>
          <p style={{ fontSize: 12, lineHeight: 1.8, color: sub, maxWidth: 200 }}>A Paris-based luxury fashion house crafting timeless pieces for the modern era.</p>
        </div>
        {cols.map(col => (
          <div key={col.title}>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 18, fontWeight: 500 }}>{col.title}</p>
            {col.links.map(l => (
              <a key={l.l} href={l.h}
                style={{ display: "block", fontSize: 13, color: sub, textDecoration: "none", marginBottom: 11, transition: "color 0.3s" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = fg; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = sub; }}
              >{l.l}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingTop: 28, borderTop: `1px solid ${border}` }}>
        <p style={{ fontSize: 11, color: dark ? "rgba(240,236,228,0.22)" : "rgba(26,20,16,0.22)" }}>© 2025 LUMIÈRE. All rights reserved.</p>
        <p style={{ fontSize: 11, color: dark ? "rgba(240,236,228,0.22)" : "rgba(26,20,16,0.22)", fontFamily: "var(--font-cormorant),serif", fontStyle: "italic" }}>Paris — New York — Milan</p>
      </div>
    </footer>
  );
}
