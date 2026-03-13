"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

const GOLD = "#c8a96e";

const PRODUCTS = [
  { id:1, name:"Ironline Denim Jacket", price:480, tag:"New Season", image:"https://i.pinimg.com/736x/84/16/cc/8416cc945dc76b6cd604d82cab41177f.jpg", hover:"https://i.pinimg.com/736x/f7/9b/68/f79b684b56c55c5a806cd7ebb604f418.jpg", bg:"#1c1812" },
  { id:2, name:"Red Silk Midi Dress", price:620, tag:"Bestseller", image:"https://i.pinimg.com/1200x/72/b0/7e/72b07e19b5bd95bb1a2a102bc70d55a6.jpg", hover:"https://i.pinimg.com/736x/0a/51/b3/0a51b35d49f77c012d7c62fba4c180e0.jpg", bg:"#f0ece4" },
  { id:3, name:"Cashmere Wide Trousers", price:395, tag:"Limited", image:"https://i.pinimg.com/736x/2b/a6/78/2ba6780d1e643a6892de3eb5e30a976e.jpg", hover:"https://i.pinimg.com/736x/97/18/4f/97184f364dfdcdb95f56ade60207e3c9.jpg", bg:"#e8ddd0" },
  { id:4, name:"Obsidian Longline Coat", price:1250, tag:"Archive", image:"https://i.pinimg.com/1200x/0e/d9/6d/0ed96dec58c404d38acd55c3956cf1e1.jpg", hover:"https://i.pinimg.com/1200x/ac/a3/ba/aca3ba6ef74c098375f129985f08bc4c.jpg", bg:"#2d1f14" },
];
const COLS = [
  { name:"L'Automne", season:"AW 2025", pieces:"23 Pieces", image:"https://i.pinimg.com/1200x/8e/dc/93/8edc93d66edcfe3811858b384355393d.jpg", tint:"rgba(30,20,10,0.5)" },
  { name:"L'Éclat", season:"SS 2025", pieces:"18 Pieces", image:"https://i.pinimg.com/736x/4c/b6/75/4cb6759f5ce0d6288ca7f6a936ffa2ef.jpg", tint:"rgba(10,30,25,0.45)" },
  { name:"La Nuit", season:"Resort", pieces:"12 Pieces", image:"https://i.pinimg.com/736x/0b/4e/60/0b4e602e962d60dd6a3e9b6e81e7447c.jpg", tint:"rgba(5,5,20,0.55)" },
];
const TESTIMONIALS = [
  { quote:"LUMIÈRE redefined what modern luxury means to me — the craftsmanship is unlike anything I've experienced.", author:"Amélie Fontaine", role:"Creative Director, Paris" },
  { quote:"The quality speaks for itself. I wore the Obsidian Coat to three gallery openings and received endless compliments.", author:"Isabelle Chen", role:"Art Curator, New York" },
  { quote:"Every detail is considered. The silk midi dress drapes like water. LUMIÈRE is the only brand I trust.", author:"Margaux Delacroix", role:"Architect, Milan" },
];

function useScrollY() { const [y,setY]=useState(0);useEffect(()=>{const h=()=>setY(window.scrollY);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h)},[]);return y; }
function useInView(t=0.1):[React.RefObject<HTMLElement|null>,boolean]{const ref=useRef<HTMLElement>(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:t});if(ref.current)o.observe(ref.current);return()=>o.disconnect()},[t]);return[ref,v];}

export default function Home() {
  const [dark, setDark] = useState(true);
  const scrollY = useScrollY();
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState<number|null>(null);
  const [tIdx, setTIdx] = useState(0);
  const [tKey, setTKey] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [colRef,colV] = useInView(0.08);
  const [prodRef,prodV] = useInView(0.04);
  const [testRef,testV] = useInView(0.15);
  useEffect(()=>{setTimeout(()=>setLoaded(true),80)},[]);
  const go=useCallback((d:number)=>{setTIdx(i=>(i+d+TESTIMONIALS.length)%TESTIMONIALS.length);setTKey(k=>k+1)},[]);
  useEffect(()=>{if(!autoplay)return;const t=setInterval(()=>go(1),5000);return()=>clearInterval(t)},[autoplay,go]);

  const D=dark;
  const bg=D?"#080806":"#f8f5f0";
  const fg=D?"#f0ece4":"#1a1410";
  const sub=D?"rgba(240,236,228,0.42)":"rgba(26,20,16,0.38)";
  const border=D?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";
  const card=D?"rgba(16,12,8,0.92)":"rgba(255,255,255,0.96)";

  return (
    <div style={{fontFamily:"'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",background:bg,color:fg,minHeight:"100vh",transition:"background 0.6s,color 0.6s"}}>
      <style>{`*{cursor:none!important}@keyframes scrollLine{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
      <Cursor/>
      <Navbar dark={dark} toggleDark={()=>setDark(d=>!d)}/>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",padding:"120px 24px 80px"}}>
        <div style={{position:"absolute",inset:0,transform:`translateY(${scrollY*.25}px) scale(1.1)`,transformOrigin:"center top"}}>
          <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=90&fit=crop" alt="LUMIÈRE" fill priority quality={90} style={{objectFit:"cover",objectPosition:"center top"}}/>
        </div>
        <div style={{position:"absolute",inset:0,background:D?"linear-gradient(to bottom,rgba(8,8,6,0.52) 0%,rgba(8,8,6,0.12) 38%,rgba(8,8,6,0.68) 78%,rgba(8,8,6,0.97) 100%)":"linear-gradient(to bottom,rgba(248,245,240,0.48) 0%,rgba(248,245,240,0.1) 38%,rgba(248,245,240,0.66) 78%,rgba(248,245,240,0.97) 100%)",transition:"background 0.6s"}}/>

        <div style={{position:"relative",zIndex:2,display:"flex",alignItems:"center",gap:12,marginBottom:44,opacity:loaded?1:0,transition:"all 0.8s 0.2s"}}>
          <div style={{width:36,height:1,background:GOLD}}/><span style={{fontSize:10,letterSpacing:"0.28em",textTransform:"uppercase",color:"#a17a32"}}>Autumn / Winter 2025</span><div style={{width:36,height:1,background:GOLD}}/>
        </div>
        <h1 style={{position:"relative",zIndex:2,fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(64px,13vw,180px)",fontWeight:500,letterSpacing:"-0.02em",lineHeight:0.88,textAlign:"center",margin:0,color:"#ededed",textShadow:"0 2px 40px rgba(0,0,0,0.35)",opacity:loaded?1:0,transform:loaded?"none":"translateY(28px)",transition:"all 1s 0.32s cubic-bezier(0.16,1,0.3,1)"}}>LUMIÈRE</h1>
        <p style={{position:"relative",zIndex:2,fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(17px,2.8vw,30px)",fontWeight:300,fontStyle:"italic",color:"rgba(240,236,228,0.72)",marginTop:22,letterSpacing:"0.05em",opacity:loaded?1:0,transform:loaded?"none":"translateY(18px)",transition:"all 0.9s 0.62s cubic-bezier(0.16,1,0.3,1)"}}>A new vision of modern luxury.</p>
        <div style={{position:"relative",zIndex:2,marginTop:52,display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center",opacity:loaded?1:0,transition:"all 0.9s 0.9s cubic-bezier(0.16,1,0.3,1)"}}>
          <a href="/products" style={{padding:"13px 38px",background:"#f0ece4",color:"#1a1410",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:600,textDecoration:"none",transition:"background 0.3s"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=GOLD}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#f0ece4"}}>Explore Collection</a>
          <a href="/archive" style={{padding:"13px 38px",background:"transparent",border:"1px solid rgba(240,236,228,0.38)",color:"rgba(240,236,228,0.82)",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:500,textDecoration:"none"}}>The Archive</a>
        </div>
        <div style={{position:"absolute",bottom:30,left:"50%",transform:"translateX(-50%)",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center",gap:8,opacity:loaded?0.52:0,transition:"opacity 1s 1.5s"}}>
          <span style={{fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",color:D?"#f0ece4":"#686153"}}>Scroll</span>
          <div style={{width:1,height:38,background:D?"#f0ece4":"#686153",animation:"scrollLine 2s ease-in-out infinite"}}/>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section ref={colRef as React.RefObject<HTMLElement>} style={{padding:"110px 0",overflow:"hidden"}}>
        <div style={{padding:"0 48px",marginBottom:60,opacity:colV?1:0,transform:colV?"none":"translateY(28px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1)"}}>
          <p style={{fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:GOLD,marginBottom:14}}>Our World</p>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:14}}>
            <h2 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(34px,4.8vw,68px)",fontWeight:300,color:fg,lineHeight:1.1}}>The Collections</h2>
            <a href="/products" style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:sub,textDecoration:"none",transition:"color 0.3s"}} onMouseEnter={e=>{(e.target as HTMLElement).style.color=GOLD}} onMouseLeave={e=>{(e.target as HTMLElement).style.color=sub}}>View All →</a>
          </div>
        </div>
        <div style={{display:"flex",gap:3,overflowX:"auto",scrollSnapType:"x mandatory",paddingLeft:48,paddingRight:48,scrollbarWidth:"none"}}>
          {COLS.map((c,i)=>(
            <a key={i} href="/products" style={{minWidth:"clamp(280px,30vw,440px)",height:"clamp(380px,48vw,600px)",scrollSnapAlign:"start",position:"relative",overflow:"hidden",flexShrink:0,borderRadius:2,textDecoration:"none",display:"block",opacity:colV?1:0,transform:colV?"none":"translateY(48px)",transition:`all 0.9s ${i*.14}s cubic-bezier(0.16,1,0.3,1)`}}
              onMouseEnter={e=>{(e.currentTarget.querySelector(".cp") as HTMLElement).style.transform="scale(1.07)"}}
              onMouseLeave={e=>{(e.currentTarget.querySelector(".cp") as HTMLElement).style.transform="scale(1)"}}
            >
              <div className="cp" style={{position:"absolute",inset:0,transition:"transform 0.8s cubic-bezier(0.16,1,0.3,1)"}}>
                <Image src={c.image} alt={c.name} fill quality={85} style={{objectFit:"cover",objectPosition:"center"}}/>
              </div>
              <div style={{position:"absolute",inset:0,background:`linear-gradient(to bottom,transparent 28%,${c.tint} 68%,rgba(0,0,0,0.88) 100%)`}}/>
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"28px 32px"}}>
                <p style={{fontSize:9,letterSpacing:"0.24em",textTransform:"uppercase",color:"rgba(240,236,228,0.58)",marginBottom:9}}>{c.season} · {c.pieces}</p>
                <h3 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(26px,2.8vw,38px)",fontWeight:300,color:"#f0ece4",lineHeight:1,marginBottom:12}}>{c.name}</h3>
                <span style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:GOLD}}>View Collection →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{padding:"56px 0",overflow:"hidden",borderTop:`1px solid ${border}`,borderBottom:`1px solid ${border}`}}>
        <div style={{display:"flex",animation:"marquee 22s linear infinite",whiteSpace:"nowrap"}}>
          {[0,1,2].map(k=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:44,paddingRight:44}}>
              {["Handcrafted","·","Sustainable","·","Timeless","·","Paris","·","Exclusive","·"].map((t,i)=>(
                <span key={i} style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(17px,2.3vw,26px)",fontStyle:t==="·"?"normal":"italic",color:t==="·"?GOLD:D?"rgba(240,236,228,0.32)":"rgba(0,0,0,0.26)",letterSpacing:"0.05em"}}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section ref={prodRef as React.RefObject<HTMLElement>} style={{padding:"110px 48px"}}>
        <div style={{marginBottom:68,opacity:prodV?1:0,transform:prodV?"none":"translateY(28px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1)"}}>
          <p style={{fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:GOLD,marginBottom:14}}>Curated Selection</p>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:14}}>
            <h2 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(34px,4.8vw,68px)",fontWeight:300,color:fg,lineHeight:1.1}}>Featured Pieces</h2>
            <a href="/products" style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:sub,textDecoration:"none",transition:"color 0.3s"}} onMouseEnter={e=>{(e.target as HTMLElement).style.color=GOLD}} onMouseLeave={e=>{(e.target as HTMLElement).style.color=sub}}>View All →</a>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(270px,100%),1fr))",gap:22}}>
          {PRODUCTS.map((p,i)=>(
            <div key={p.id} onMouseEnter={()=>setHovered(p.id)} onMouseLeave={()=>setHovered(null)} style={{opacity:prodV?1:0,transform:prodV?"none":"translateY(56px)",transition:`opacity 0.9s ${i*.11}s cubic-bezier(0.16,1,0.3,1),transform 0.9s ${i*.11}s cubic-bezier(0.16,1,0.3,1)`}}>
              <div style={{background:card,border:`1px solid ${border}`,borderRadius:3,overflow:"hidden",boxShadow:hovered===p.id?"0 36px 72px rgba(0,0,0,0.24)":"0 6px 28px rgba(0,0,0,0.08)",transform:hovered===p.id?"translateY(-8px)":"none",transition:"all 0.55s cubic-bezier(0.16,1,0.3,1)"}}>
                <div style={{height:390,position:"relative",overflow:"hidden",background:p.bg}}>
                  <div style={{position:"absolute",inset:0,opacity:hovered===p.id?0:1,transition:"opacity 0.6s"}}>
                    <Image src={p.image} alt={p.name} fill quality={85} style={{objectFit:"cover",objectPosition:"center top",transform:hovered===p.id?"scale(1.05)":"scale(1)",transition:"transform 0.8s cubic-bezier(0.16,1,0.3,1)"}}/>
                  </div>
                  <div style={{position:"absolute",inset:0,opacity:hovered===p.id?1:0,transition:"opacity 0.6s"}}>
                    <Image src={p.hover} alt={p.name} fill quality={85} style={{objectFit:"cover",objectPosition:"center top"}}/>
                  </div>
                  <div style={{position:"absolute",top:13,left:13,background:"rgba(8,8,6,0.72)",backdropFilter:"blur(8px)",border:`1px solid ${GOLD}40`,padding:"4px 11px",borderRadius:2,fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:GOLD}}>{p.tag}</div>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"24px 16px 16px",background:"linear-gradient(to top,rgba(8,8,6,0.9) 0%,transparent 100%)",opacity:hovered===p.id?1:0,transform:hovered===p.id?"translateY(0)":"translateY(10px)",transition:"all 0.38s"}}>
                    <a href="/cart" style={{display:"block",padding:11,background:GOLD,color:"#1a1410",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:700,textDecoration:"none",textAlign:"center"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#d4b980"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=GOLD}}>Quick Add</a>
                  </div>
                </div>
                <div style={{padding:"18px 20px 22px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                  <div>
                    <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:20,fontWeight:400,color:fg,lineHeight:1.2,marginBottom:4}}>{p.name}</p>
                    <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:16,fontWeight:300,color:sub}}>€{p.price.toLocaleString()}</p>
                  </div>
                  <a href="/cart" style={{flexShrink:0,background:"none",border:`1px solid ${border}`,padding:"7px 15px",fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:sub,textDecoration:"none",marginTop:3,transition:"all 0.3s"}} onMouseEnter={e=>{const el=e.currentTarget;el.style.background=GOLD;el.style.borderColor=GOLD;el.style.color="#1a1410"}} onMouseLeave={e=>{const el=e.currentTarget;el.style.background="none";el.style.borderColor=border;el.style.color=sub}}>Add to Bag</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section ref={testRef as React.RefObject<HTMLElement>} style={{padding:"110px 48px",textAlign:"center"}}>
        <div style={{opacity:testV?1:0,transform:testV?"none":"translateY(26px)",transition:"all 0.8s"}}>
          <p style={{fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:GOLD,marginBottom:12}}>What They Say</p>
          <h2 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(30px,3.8vw,52px)",fontWeight:300,color:fg,marginBottom:60}}>Client Stories</h2>
        </div>
        <div style={{maxWidth:740,margin:"0 auto"}} onMouseEnter={()=>setAutoplay(false)} onMouseLeave={()=>setAutoplay(true)}>
          <div style={{background:D?"rgba(26,20,14,0.72)":"rgba(255,255,255,0.82)",backdropFilter:"blur(28px)",border:`1px solid ${D?"rgba(200,169,110,0.12)":"rgba(200,169,110,0.22)"}`,borderRadius:8,padding:"48px 60px",position:"relative"}}>
            <div style={{position:"absolute",top:-14,left:48,fontFamily:"var(--font-cormorant),serif",fontSize:100,lineHeight:1,color:GOLD,opacity:0.11,userSelect:"none"}}>&ldquo;</div>
            <div key={tKey} style={{animation:"fadeIn 0.5s both"}}>
              <div style={{display:"flex",justifyContent:"center",gap:3,marginBottom:26}}>{[1,2,3,4,5].map(s=><span key={s} style={{color:GOLD,fontSize:13}}>★</span>)}</div>
              <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(16px,2vw,22px)",fontWeight:300,fontStyle:"italic",color:D?"rgba(240,236,228,0.82)":"rgba(26,20,16,0.72)",lineHeight:1.75,marginBottom:32}}>&ldquo;{TESTIMONIALS[tIdx].quote}&rdquo;</p>
              <div style={{width:28,height:1,background:GOLD,margin:"0 auto 18px"}}/>
              <p style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:fg,marginBottom:3,fontWeight:500}}>{TESTIMONIALS[tIdx].author}</p>
              <p style={{fontSize:10,color:sub,letterSpacing:"0.08em",textTransform:"uppercase"}}>{TESTIMONIALS[tIdx].role}</p>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:18,marginTop:32}}>
            <button onClick={()=>go(-1)} style={{background:"none",border:`1px solid ${border}`,borderRadius:"50%",width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",color:sub,transition:"all 0.3s"}} onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor=GOLD;el.style.color=GOLD}} onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor=border;el.style.color=sub}}>←</button>
            <div style={{display:"flex",gap:5}}>{TESTIMONIALS.map((_,i)=><button key={i} onClick={()=>{setTIdx(i);setTKey(k=>k+1)}} style={{width:i===tIdx?20:5,height:5,borderRadius:3,background:i===tIdx?GOLD:border,border:"none",padding:0,transition:"all 0.4s"}}/>)}</div>
            <button onClick={()=>go(1)} style={{background:"none",border:`1px solid ${border}`,borderRadius:"50%",width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",color:sub,transition:"all 0.3s"}} onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor=GOLD;el.style.color=GOLD}} onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor=border;el.style.color=sub}}>→</button>
          </div>
        </div>
      </section>

      <Footer dark={dark}/>
    </div>
  );
}
