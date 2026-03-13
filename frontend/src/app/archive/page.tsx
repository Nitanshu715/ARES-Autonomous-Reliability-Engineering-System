"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

const ARCHIVE = [
  { year:"2024", season:"AW", title:"La Pénombre", pieces:28, image:"https://i.pinimg.com/1200x/0e/d9/6d/0ed96dec58c404d38acd55c3956cf1e1.jpg", desc:"A study in shadow and weight. Voluminous silhouettes in charcoal, midnight, and deep forest." },
  { year:"2024", season:"SS", title:"L'Aube", pieces:22, image:"https://i.pinimg.com/1200x/72/b0/7e/72b07e19b5bd95bb1a2a102bc70d55a6.jpg", desc:"Dawn light translated into silk and linen. Pale rose, champagne, and the white of morning." },
  { year:"2023", season:"AW", title:"Le Silence", pieces:31, image:"https://i.pinimg.com/1200x/8e/dc/93/8edc93d66edcfe3811858b384355393d.jpg", desc:"Quiet luxury at its most distilled. Cashmere, wool, and nothing unnecessary." },
  { year:"2023", season:"SS", title:"La Lumière", pieces:18, image:"https://i.pinimg.com/736x/4c/b6/75/4cb6759f5ce0d6288ca7f6a936ffa2ef.jpg", desc:"Our founding collection, reinterpreted. The one that started everything." },
  { year:"2022", season:"AW", title:"L'Obscur", pieces:24, image:"https://i.pinimg.com/736x/0b/4e/60/0b4e602e962d60dd6a3e9b6e81e7447c.jpg", desc:"Darkness as texture. Black on black, with unexpected softness in every seam." },
  { year:"2022", season:"SS", title:"La Chaleur", pieces:20, image:"https://i.pinimg.com/736x/2b/a6/78/2ba6780d1e643a6892de3eb5e30a976e.jpg", desc:"Warmth without weight. Linen structured to hold shape through the hottest months." },
];

export default function ArchivePage() {
  const [dark, setDark] = useState(true);
  const [hovered, setHovered] = useState<number|null>(null);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLDivElement|null)[]>([]);
  useEffect(()=>{setTimeout(()=>setLoaded(true),80)},[]);

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){const i=Number((e.target as HTMLElement).dataset.i);setVisible(v=>new Set([...v,i]));obs.unobserve(e.target);}})},{threshold:0.08});
    refs.current.forEach(r=>{if(r)obs.observe(r)});
    return()=>obs.disconnect();
  },[]);

  const D=dark;
  const bg=D?"#080806":"#f8f5f0";
  const fg=D?"#f0ece4":"#1a1410";
  const sub=D?"rgba(240,236,228,0.42)":"rgba(26,20,16,0.38)";
  const border=D?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";

  return (
    <div style={{minHeight:"100vh",background:bg,color:fg,fontFamily:"'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",transition:"background 0.6s,color 0.6s"}}>
      <style>{`*{cursor:none!important}@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Cursor/><Navbar dark={dark} toggleDark={()=>setDark(d=>!d)}/>

      {/* HEADER */}
      <div style={{padding:"110px 48px 60px",borderBottom:`1px solid ${border}`,opacity:loaded?1:0,animation:loaded?"fadeUp 0.8s both":"none"}}>
        <p style={{fontSize:10,letterSpacing:"0.28em",textTransform:"uppercase",color:"#c8a96e",marginBottom:12}}>LUMIÈRE Archives</p>
        <h1 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(44px,7.5vw,110px)",fontWeight:300,color:fg,lineHeight:0.88,marginBottom:20}}>The Archive</h1>
        <p style={{fontSize:13,color:sub,maxWidth:440,lineHeight:1.7}}>Every collection we have ever made. Past seasons remain available in limited quantities — timelessness has no expiry date.</p>
      </div>

      {/* TIMELINE */}
      <div style={{padding:"60px 48px 100px"}}>
        {["2024","2023","2022"].map(year=>{
          const seasons=ARCHIVE.filter(a=>a.year===year);
          return(
            <div key={year} style={{marginBottom:72}}>
              <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:32}}>
                <span style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(40px,6vw,72px)",fontWeight:300,color:D?"rgba(240,236,228,0.12)":"rgba(26,20,16,0.1)",letterSpacing:"-0.02em",lineHeight:1}}>{year}</span>
                <div style={{flex:1,height:1,background:border}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(300px,100%),1fr))",gap:20}}>
                {seasons.map((a,i)=>{
                  const idx=ARCHIVE.indexOf(a);
                  return(
                    <div key={i} ref={el=>{refs.current[idx]=el}} data-i={idx} onMouseEnter={()=>setHovered(idx)} onMouseLeave={()=>setHovered(null)}
                      style={{opacity:visible.has(idx)?1:0,transform:visible.has(idx)?"none":"translateY(24px)",transition:`opacity 0.7s ${i*.12}s,transform 0.7s ${i*.12}s`}}>
                      <div style={{border:`1px solid ${hovered===idx?"rgba(200,169,110,0.3)":border}`,borderRadius:2,overflow:"hidden",transition:"border-color 0.4s"}}>
                        <div style={{height:"clamp(280px,35vw,440px)",position:"relative",overflow:"hidden"}}>
                          <Image src={a.image} alt={a.title} fill quality={85} style={{objectFit:"cover",objectPosition:"center",transform:hovered===idx?"scale(1.06)":"scale(1)",transition:"transform 0.8s cubic-bezier(0.16,1,0.3,1)"}}/>
                          <div style={{position:"absolute",inset:0,background:`linear-gradient(to bottom,transparent 40%,${D?"rgba(8,8,6,0.88)":"rgba(248,245,240,0.92)"} 100%)`}}/>
                          <div style={{position:"absolute",top:14,left:14,background:"rgba(8,8,6,0.7)",backdropFilter:"blur(8px)",padding:"4px 10px",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:"#c8a96e"}}>{a.season} {a.year}</div>
                        </div>
                        <div style={{padding:"20px 22px 24px"}}>
                          <h3 style={{fontFamily:"var(--font-cormorant),serif",fontSize:24,fontWeight:300,color:fg,marginBottom:8}}>{a.title}</h3>
                          <p style={{fontSize:12,color:sub,lineHeight:1.7,marginBottom:14}}>{a.desc}</p>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <span style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:sub}}>{a.pieces} Pieces</span>
                            <a href="/products" style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:"#c8a96e",textDecoration:"none",transition:"opacity 0.3s"}} onMouseEnter={e=>{(e.target as HTMLElement).style.opacity="0.7"}} onMouseLeave={e=>{(e.target as HTMLElement).style.opacity="1"}}>View Pieces →</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Footer dark={dark}/>
    </div>
  );
}
