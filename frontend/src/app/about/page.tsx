"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

function useInView(t=0.1):[React.RefObject<HTMLElement|null>,boolean]{const ref=useRef<HTMLElement>(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:t});if(ref.current)o.observe(ref.current);return()=>o.disconnect()},[t]);return[ref,v];}

export default function AboutPage() {
  const [dark, setDark] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [r1,v1]=useInView();const [r2,v2]=useInView();const [r3,v3]=useInView();const [r4,v4]=useInView();
  useEffect(()=>{setTimeout(()=>setLoaded(true),80)},[]);

  const D=dark;
  const bg=D?"#080806":"#f8f5f0";
  const fg=D?"#f0ece4":"#1a1410";
  const sub=D?"rgba(240,236,228,0.42)":"rgba(26,20,16,0.38)";
  const border=D?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";

  const values=[
    {title:"Craftsmanship",desc:"Every garment is cut and sewn by hand in our Parisian atelier. We work with master tailors who have dedicated decades to their craft."},
    {title:"Sustainability",desc:"We source only the finest natural fibers — cashmere from Mongolia, silk from Como, wool from the Scottish Borders. No synthetic shortcuts."},
    {title:"Timelessness",desc:"We do not follow trends. We create pieces designed to outlast seasons, to grow more beautiful with time, and to be inherited."},
    {title:"Restraint",desc:"Luxury is the absence of excess. Each collection is edited to fewer than 30 pieces, each chosen with absolute intention."},
  ];

  return (
    <div style={{minHeight:"100vh",background:bg,color:fg,fontFamily:"'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",transition:"background 0.6s,color 0.6s"}}>
      <style>{`*{cursor:none!important}@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Cursor/><Navbar dark={dark} toggleDark={()=>setDark(d=>!d)}/>

      {/* HERO */}
      <div style={{height:"80vh",position:"relative",overflow:"hidden"}}>
        <Image src="https://i.pinimg.com/736x/a6/04/dd/a604dd6226dd7ea8a09e528c09173cf5.jpg" alt="LUMIÈRE Atelier" fill priority style={{objectFit:"cover",objectPosition:"center 40%"}}/>
        <div style={{position:"absolute",inset:0,background:D?"linear-gradient(to bottom,rgba(8,8,6,0.3) 0%,rgba(8,8,6,0.7) 100%)":"linear-gradient(to bottom,rgba(248,245,240,0.3) 0%,rgba(248,245,240,0.75) 100%)"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 48px 56px",opacity:loaded?1:0,animation:loaded?"fadeUp 0.9s 0.2s both":"none"}}>
          <p style={{fontSize:10,letterSpacing:"0.28em",textTransform:"uppercase",color:"#c8a96e",marginBottom:12}}>Est. 1998 · Paris</p>
          <h1 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(48px,8vw,110px)",fontWeight:300,color:"#f0ece4",lineHeight:0.88}}>Our Story</h1>
        </div>
      </div>

      {/* MANIFESTO */}
      <section ref={r1 as React.RefObject<HTMLElement>} style={{padding:"100px 48px",maxWidth:900,opacity:v1?1:0,transform:v1?"none":"translateY(28px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)"}}>
        <p style={{fontSize:10,letterSpacing:"0.24em",textTransform:"uppercase",color:"#c8a96e",marginBottom:20}}>The Manifesto</p>
        <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(22px,3vw,36px)",fontWeight:300,color:fg,lineHeight:1.55,marginBottom:24}}>LUMIÈRE was founded on a single conviction: that true luxury is not about price, nor logo, nor spectacle. It is about the quiet confidence of a garment that fits perfectly, lasts forever, and never shouts.</p>
        <p style={{fontSize:13,color:sub,lineHeight:1.85}}>We opened our first atelier on the Rue du Faubourg Saint-Honoré in 1998. Since then, we have resisted expansion, resisted trends, and resisted the temptation to compromise. Everything we make is made by hand, in small quantities, by people who care deeply about their work. That will never change.</p>
      </section>

      {/* SPLIT IMAGE */}
      <section ref={r2 as React.RefObject<HTMLElement>} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,opacity:v2?1:0,transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)"}}>
        <div style={{height:"clamp(340px,45vw,560px)",position:"relative",overflow:"hidden"}}>
          <Image src="https://i.pinimg.com/1200x/44/a9/10/44a910397a8ba1d2ce1ecc304f1c4e05.jpg" alt="Atelier" fill style={{objectFit:"cover"}}/>
        </div>
        <div style={{height:"clamp(340px,45vw,560px)",position:"relative",overflow:"hidden"}}>
          <Image src="https://i.pinimg.com/1200x/72/b0/7e/72b07e19b5bd95bb1a2a102bc70d55a6.jpg" alt="Collection" fill style={{objectFit:"cover"}}/>
        </div>
      </section>

      {/* VALUES */}
      <section ref={r3 as React.RefObject<HTMLElement>} style={{padding:"100px 48px"}}>
        <div style={{marginBottom:60,opacity:v3?1:0,transform:v3?"none":"translateY(22px)",transition:"all 0.8s"}}>
          <p style={{fontSize:10,letterSpacing:"0.24em",textTransform:"uppercase",color:"#c8a96e",marginBottom:12}}>What We Stand For</p>
          <h2 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(34px,4.5vw,64px)",fontWeight:300,color:fg,lineHeight:1.1}}>Our Values</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:2}}>
          {values.map((v,i)=>(
            <div key={i} style={{padding:"36px 32px",border:`1px solid ${border}`,opacity:v3?1:0,transform:v3?"none":"translateY(22px)",transition:`all 0.8s ${i*.1}s`}}>
              <div style={{width:28,height:1,background:"#c8a96e",marginBottom:20}}/>
              <h3 style={{fontFamily:"var(--font-cormorant),serif",fontSize:24,fontWeight:300,color:fg,marginBottom:14}}>{v.title}</h3>
              <p style={{fontSize:13,color:sub,lineHeight:1.75}}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section ref={r4 as React.RefObject<HTMLElement>} style={{padding:"60px 48px 100px",borderTop:`1px solid ${border}`,opacity:v4?1:0,transform:v4?"none":"translateY(22px)",transition:"all 0.8s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20,marginBottom:48}}>
          <div>
            <p style={{fontSize:10,letterSpacing:"0.24em",textTransform:"uppercase",color:"#c8a96e",marginBottom:10}}>The People</p>
            <h2 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(30px,4vw,56px)",fontWeight:300,color:fg}}>Atelier Team</h2>
          </div>
          <a href="/contact" style={{fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:"#c8a96e",textDecoration:"none",border:"1px solid rgba(200,169,110,0.35)",padding:"10px 24px",transition:"all 0.3s"}} onMouseEnter={e=>{const el=e.currentTarget;el.style.background="#c8a96e";el.style.color="#1a1410"}} onMouseLeave={e=>{const el=e.currentTarget;el.style.background="none";el.style.color="#c8a96e"}}>Get in Touch</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:20}}>
          {[{name:"Éloise Marchand",role:"Creative Director",img:"https://i.pinimg.com/736x/4c/b6/75/4cb6759f5ce0d6288ca7f6a936ffa2ef.jpg"},{name:"Jean-Pierre Vidal",role:"Head of Atelier",img:"https://i.pinimg.com/1200x/8e/dc/93/8edc93d66edcfe3811858b384355393d.jpg"},{name:"Camille Roux",role:"Lead Designer",img:"https://i.pinimg.com/736x/0b/4e/60/0b4e602e962d60dd6a3e9b6e81e7447c.jpg"}].map((m,i)=>(
            <div key={i}>
              <div style={{aspectRatio:"3/4",position:"relative",overflow:"hidden",marginBottom:16,background:"#1a1410"}}>
                <Image src={m.img} alt={m.name} fill style={{objectFit:"cover",objectPosition:"center"}} quality={80}/>
                <div style={{position:"absolute",inset:0,background:"rgba(8,8,6,0.15)"}}/>
              </div>
              <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:18,color:fg,marginBottom:3}}>{m.name}</p>
              <p style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:"#c8a96e"}}>{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer dark={dark}/>
    </div>
  );
}
