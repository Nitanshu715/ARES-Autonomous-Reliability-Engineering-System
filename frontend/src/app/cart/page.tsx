"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

const INITIAL = [
  { id:1, name:"Ironline Denim Jacket", price:480, size:"M", qty:1, image:"https://i.pinimg.com/736x/84/16/cc/8416cc945dc76b6cd604d82cab41177f.jpg", bgColor:"#1c1812" },
  { id:2, name:"Red Silk Midi Dress", price:620, size:"XS", qty:1, image:"https://i.pinimg.com/1200x/72/b0/7e/72b07e19b5bd95bb1a2a102bc70d55a6.jpg", bgColor:"#f0ece4" },
];

export default function CartPage() {
  const [dark, setDark] = useState(true);
  const [items, setItems] = useState(INITIAL);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoFocused, setPromoFocused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(()=>{setTimeout(()=>setLoaded(true),80)},[]);

  const D=dark;
  const bg=D?"#080806":"#f8f5f0";
  const fg=D?"#f0ece4":"#1a1410";
  const sub=D?"rgba(240,236,228,0.42)":"rgba(26,20,16,0.38)";
  const border=D?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";
  const card=D?"rgba(18,14,10,0.7)":"rgba(255,255,255,0.85)";

  const subtotal=items.reduce((s,i)=>s+i.price*i.qty,0);
  const discount=promoApplied?Math.round(subtotal*.1):0;
  const shipping=subtotal>=500?0:25;
  const total=subtotal-discount+shipping;

  const applyPromo=()=>{if(promo.toUpperCase()==="LUMIERE10"){setPromoApplied(true);}};
  const remove=(id:number)=>setItems(it=>it.filter(i=>i.id!==id));
  const qty=(id:number,d:number)=>setItems(it=>it.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+d)}:i));

  return (
    <div style={{minHeight:"100vh",background:bg,color:fg,fontFamily:"'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",transition:"background 0.6s,color 0.6s"}}>
      <style>{`*{cursor:none!important}@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Cursor/><Navbar dark={dark} toggleDark={()=>setDark(d=>!d)}/>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"110px 48px 80px",opacity:loaded?1:0,animation:loaded?"fadeUp 0.8s both":"none"}}>
        <div style={{marginBottom:44}}>
          <p style={{fontSize:10,letterSpacing:"0.26em",textTransform:"uppercase",color:"#c8a96e",marginBottom:10}}>Your Selection</p>
          <h1 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(38px,5.5vw,72px)",fontWeight:300,color:fg,lineHeight:0.95}}>Shopping Bag</h1>
        </div>

        {items.length===0?(
          <div style={{textAlign:"center",padding:"80px 0"}}>
            <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:28,fontWeight:300,color:sub,marginBottom:16}}>Your bag is empty</p>
            <a href="/products" style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:"#c8a96e",textDecoration:"none"}}>Continue Shopping →</a>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:48,alignItems:"start"}}>
            {/* ITEMS */}
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {items.map((item,i)=>(
                <div key={item.id} style={{display:"flex",gap:20,padding:"24px 0",borderBottom:`1px solid ${border}`,alignItems:"flex-start"}}>
                  <div style={{width:100,height:130,position:"relative",flexShrink:0,background:item.bgColor,borderRadius:2,overflow:"hidden"}}>
                    <Image src={item.image} alt={item.name} fill style={{objectFit:"cover",objectPosition:"center top"}} quality={80}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:19,fontWeight:400,color:fg,lineHeight:1.2}}>{item.name}</p>
                      <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:17,fontWeight:300,color:fg}}>€{(item.price*item.qty).toLocaleString()}</p>
                    </div>
                    <p style={{fontSize:11,color:sub,marginBottom:16,letterSpacing:"0.06em"}}>Size: {item.size} · €{item.price.toLocaleString()} each</p>
                    <div style={{display:"flex",alignItems:"center",gap:16}}>
                      <div style={{display:"flex",alignItems:"center",border:`1px solid ${border}`,borderRadius:2}}>
                        <button onClick={()=>qty(item.id,-1)} style={{width:32,height:32,background:"none",border:"none",color:sub,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                        <span style={{width:28,textAlign:"center",fontSize:13,color:fg}}>{item.qty}</span>
                        <button onClick={()=>qty(item.id,1)} style={{width:32,height:32,background:"none",border:"none",color:sub,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                      </div>
                      <button onClick={()=>remove(item.id)} style={{background:"none",border:"none",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:sub,padding:0,transition:"color 0.3s"}} onMouseEnter={e=>{(e.target as HTMLElement).style.color="#e06060"}} onMouseLeave={e=>{(e.target as HTMLElement).style.color=sub}}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{paddingTop:20}}>
                <a href="/products" style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:sub,textDecoration:"none",transition:"color 0.3s"}} onMouseEnter={e=>{(e.target as HTMLElement).style.color="#c8a96e"}} onMouseLeave={e=>{(e.target as HTMLElement).style.color=sub}}>← Continue Shopping</a>
              </div>
            </div>

            {/* SUMMARY */}
            <div style={{background:card,backdropFilter:"blur(20px)",border:`1px solid ${border}`,borderRadius:4,padding:32,position:"sticky",top:90}}>
              <h2 style={{fontFamily:"var(--font-cormorant),serif",fontSize:26,fontWeight:300,color:fg,marginBottom:28}}>Order Summary</h2>
              <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:24}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:sub}}>Subtotal</span><span style={{fontSize:13,color:fg}}>€{subtotal.toLocaleString()}</span></div>
                {promoApplied&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:"#7ab87a"}}>Discount (10%)</span><span style={{fontSize:13,color:"#7ab87a"}}>−€{discount}</span></div>}
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:sub}}>Shipping</span><span style={{fontSize:13,color:shipping===0?"#7ab87a":fg}}>{shipping===0?"Free":`€${shipping}`}</span></div>
                {shipping>0&&<p style={{fontSize:11,color:sub}}>Free shipping on orders over €500</p>}
                <div style={{height:1,background:border}}/>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:15,color:fg,fontWeight:500}}>Total</span><span style={{fontFamily:"var(--font-cormorant),serif",fontSize:20,color:fg}}>€{total.toLocaleString()}</span></div>
              </div>

              {/* PROMO */}
              <div style={{marginBottom:24}}>
                <div style={{display:"flex",gap:8}}>
                  <input value={promo} onChange={e=>setPromo(e.target.value)} onFocus={()=>setPromoFocused(true)} onBlur={()=>setPromoFocused(false)} placeholder="Promo code" style={{flex:1,background:"none",border:`1px solid ${promoFocused?"#c8a96e":border}`,padding:"9px 12px",color:fg,fontSize:12,outline:"none",fontFamily:"inherit",transition:"border-color 0.3s"}}/>
                  <button onClick={applyPromo} style={{padding:"9px 16px",background:"none",border:`1px solid ${border}`,color:sub,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"inherit",transition:"all 0.3s"}} onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor="#c8a96e";el.style.color="#c8a96e"}} onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor=border;el.style.color=sub}}>Apply</button>
                </div>
                {promoApplied&&<p style={{fontSize:11,color:"#7ab87a",marginTop:8}}>✓ Code LUMIERE10 applied — 10% off</p>}
                {!promoApplied&&<p style={{fontSize:11,color:sub,marginTop:8}}>Try: LUMIERE10</p>}
              </div>

              <a href="/login" style={{display:"block",width:"100%",padding:14,background:"#c8a96e",color:"#1a1410",fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:700,textDecoration:"none",textAlign:"center",transition:"background 0.3s"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#d4b980"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#c8a96e"}}>Checkout</a>
              <p style={{fontSize:11,color:sub,textAlign:"center",marginTop:14}}>Secure checkout · Free returns</p>
            </div>
          </div>
        )}
      </div>
      <Footer dark={dark}/>
    </div>
  );
}
