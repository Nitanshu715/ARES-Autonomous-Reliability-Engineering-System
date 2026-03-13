"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const rpos = useRef({ x: 0, y: 0 });
  const hov = useRef(false);

  useEffect(() => {
    const mv = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const ov = (e: MouseEvent) => { if ((e.target as HTMLElement).closest("a,button,input,textarea,[data-cursor]")) hov.current = true; };
    const ou = (e: MouseEvent) => { if ((e.target as HTMLElement).closest("a,button,input,textarea,[data-cursor]")) hov.current = false; };
    window.addEventListener("mousemove", mv);
    document.addEventListener("mouseover", ov);
    document.addEventListener("mouseout", ou);
    let raf: number;
    const tick = () => {
      if (dot.current) dot.current.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px)`;
      if (ring.current) {
        rpos.current.x += (pos.current.x - rpos.current.x) * 0.1;
        rpos.current.y += (pos.current.y - rpos.current.y) * 0.1;
        ring.current.style.transform = `translate(${rpos.current.x - 16}px,${rpos.current.y - 16}px) scale(${hov.current ? 2 : 1})`;
        ring.current.style.opacity = hov.current ? "0.35" : "0.7";
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("mousemove", mv); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dot} style={{ position: "fixed", top: 0, left: 0, width: 8, height: 8, borderRadius: "50%", background: "#c8a96e", pointerEvents: "none", zIndex: 9999, willChange: "transform" }} />
      <div ref={ring} style={{ position: "fixed", top: 0, left: 0, width: 32, height: 32, borderRadius: "50%", border: "1px solid #c8a96e", pointerEvents: "none", zIndex: 9998, transition: "opacity 0.3s, transform 0.15s", willChange: "transform" }} />
    </>
  );
}
