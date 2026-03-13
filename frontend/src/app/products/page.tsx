"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import { PRODUCTS } from "@/lib/data";

const CATS = ["All","Outerwear","Dresses","Trousers","Tops"];

export default function ProductsPage() {
  const [dark, setDark] = useState(true);
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [hovered, setHovered] = useState<number|null>(null);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLDivElement|null)[]>([]);
  useEffect(()=>{setTimeout(()=>setLoaded(true),80)},[]);

  const filtered = PRODUCTS
    .filter(p => cat==="All"||p.category===cat)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sort==="price-asc"?a.price-b.price:sort==="price-desc"?b.price-a.price:a.id-b.id);

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){const id=Number((e.target as HTMLElement).dataset.id);setVisible(v=>new Set([...v,id]));obs.unobserve(e.target);}})},{threshold:0.08});
    refs.current.forEach(r=>{if(r)obs.observe(r)});
    return()=>obs.disconnect();
  },[filtered.length]);

  const D=dark;
  const bg=D?"#080806":"#f8f5f0";
  const fg=D?"#f0ece4":"#1a1410";
  const sub=D?"rgba(240,236,228,0.42)":"rgba(26,20,16,0.38)";
  const border=D?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";
  const card=D?"rgba(16,12,8,0.92)":"rgba(255,255,255,0.96)";

  return (
    <div style={{minHeight:"100vh",background:bg,color:fg,fontFamily:"'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",transition:"background 0.6s,color 0.6s"}}>
      <style>{`*{cursor:none!important}@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Cursor/><Navbar dark={dark} toggleDark={()=>setDark(d=>!d)}/>

      {/* HERO BANNER */}
      <div style={{paddingTop:100,paddingBottom:60,paddingLeft:48,paddingRight:48,borderBottom:`1px solid ${border}`,opacity:loaded?1:0,animation:loaded?"fadeUp 0.8s both":"none"}}>
        <p style={{fontSize:10,letterSpacing:"0.26em",textTransform:"uppercase",color:"#c8a96e",marginBottom:12}}>AW 2025</p>
        <h1 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(44px,7vw,100px)",fontWeight:300,color:fg,lineHeight:0.9,marginBottom:18}}>The Collection</h1>
        <p style={{fontSize:13,color:sub,maxWidth:420,lineHeight:1.7}}>Timeless pieces crafted for the modern wardrobe. Every garment a meditation on form, quality, and restraint.</p>
      </div>

      {/* FILTERS */}
      <div style={{position:"sticky",top:62,zIndex:50,background:D?"rgba(8,8,6,0.96)":"rgba(248,245,240,0.96)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${border}`,padding:"16px 48px",display:"flex",alignItems:"center",gap:32,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{padding:"7px 18px",background:cat===c?"#c8a96e":"none",border:`1px solid ${cat===c?"#c8a96e":border}`,color:cat===c?"#1a1410":sub,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",transition:"all 0.3s",fontFamily:"inherit"}}>{c}</button>
          ))}
        </div>
        <div style={{flex:1,minWidth:180}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search pieces…" style={{width:"100%",background:"none",border:`1px solid ${border}`,padding:"7px 14px",color:fg,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{background:D?"#0e0c09":"#f0ece4",border:`1px solid ${border}`,color:sub,padding:"7px 14px",fontSize:11,outline:"none",fontFamily:"inherit"}}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      {/* GRID */}
      <div style={{padding:"48px 48px 80px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(260px,100%),1fr))",gap:20}}>
        {filtered.map((p,i)=>(
          <div key={p.id} ref={el=>{refs.current[i]=el}} data-id={p.id} onMouseEnter={()=>setHovered(p.id)} onMouseLeave={()=>setHovered(null)}
            style={{opacity:visible.has(p.id)?1:0,transform:visible.has(p.id)?"none":"translateY(24px)",transition:`opacity 0.7s ${(i%4)*0.08}s,transform 0.7s ${(i%4)*0.08}s`}}>
            <div style={{background:card,border:`1px solid ${border}`,borderRadius:2,overflow:"hidden",boxShadow:hovered===p.id?"0 32px 64px rgba(0,0,0,0.22)":"0 4px 20px rgba(0,0,0,0.07)",transform:hovered===p.id?"translateY(-6px)":"none",transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)"}}>
              <div style={{height:360,position:"relative",overflow:"hidden",background:p.bgColor}}>
                <div style={{position:"absolute",inset:0,opacity:hovered===p.id?0:1,transition:"opacity 0.6s"}}>
                  <Image src={p.image} alt={p.name} fill quality={85} style={{objectFit:"cover",objectPosition:"center top",transform:hovered===p.id?"scale(1.05)":"scale(1)",transition:"transform 0.8s cubic-bezier(0.16,1,0.3,1)"}}/>
                </div>
                <div style={{position:"absolute",inset:0,opacity:hovered===p.id?1:0,transition:"opacity 0.6s"}}>
                  <Image src={p.hoverImage} alt={p.name} fill quality={85} style={{objectFit:"cover",objectPosition:"center top"}}/>
                </div>
                <div style={{position:"absolute",top:12,left:12,background:"rgba(8,8,6,0.72)",backdropFilter:"blur(8px)",border:"1px solid rgba(200,169,110,0.3)",padding:"4px 10px",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:"#c8a96e"}}>{p.tag}</div>
                {!p.inStock&&<div style={{position:"absolute",top:12,right:12,background:"rgba(8,8,6,0.72)",padding:"4px 10px",fontSize:9,letterSpacing:"0.14em",color:"rgba(240,236,228,0.5)"}}>Sold Out</div>}
                {p.inStock&&(
                  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"20px 14px 14px",background:"linear-gradient(to top,rgba(8,8,6,0.9) 0%,transparent 100%)",opacity:hovered===p.id?1:0,transform:hovered===p.id?"translateY(0)":"translateY(8px)",transition:"all 0.36s"}}>
                    <a href="/cart" style={{display:"block",padding:11,background:"#c8a96e",color:"#1a1410",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:700,textDecoration:"none",textAlign:"center"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#d4b980"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#c8a96e"}}>Quick Add</a>
                  </div>
                )}
              </div>
              <div style={{padding:"16px 18px 20px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                <div>
                  <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:19,fontWeight:400,color:fg,lineHeight:1.2,marginBottom:3}}>{p.name}</p>
                  <p style={{fontSize:11,letterSpacing:"0.08em",color:sub,marginBottom:2}}>{p.category}</p>
                  <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:15,fontWeight:300,color:sub}}>€{p.price.toLocaleString()}</p>
                </div>
                {p.inStock
                  ?<a href="/cart" style={{flexShrink:0,background:"none",border:`1px solid ${border}`,padding:"6px 13px",fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:sub,textDecoration:"none",marginTop:3,transition:"all 0.3s"}} onMouseEnter={e=>{const el=e.currentTarget;el.style.background="#c8a96e";el.style.borderColor="#c8a96e";el.style.color="#1a1410"}} onMouseLeave={e=>{const el=e.currentTarget;el.style.background="none";el.style.borderColor=border;el.style.color=sub}}>Add</a>
                  :<span style={{fontSize:9,letterSpacing:"0.12em",color:sub,marginTop:6,display:"block"}}>Notify Me</span>
                }
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0&&(
          <div style={{gridColumn:"1/-1",textAlign:"center",padding:"80px 0",color:sub}}>
            <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:28,fontWeight:300,marginBottom:12}}>No pieces found</p>
            <p style={{fontSize:13}}>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
      <Footer dark={dark}/>
    </div>
  );
}
