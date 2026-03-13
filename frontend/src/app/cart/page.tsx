"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import { API, getToken } from "@/lib/api";

type CartItem = {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
};

export default function CartPage() {
  const [dark, setDark] = useState(true);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoFocused, setPromoFocused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(()=>{setTimeout(()=>setLoaded(true),80)},[]);

  // Fetch real cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      const token = getToken();
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch(`${API.CART}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setItems(data.items || []);
      } catch {
        console.error("Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const remove = async (product_id: number) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API.CART}/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ product_id }),
      });
      if (res.ok) {
        setItems(it => it.filter(i => i.product_id !== product_id));
        showToast("Item removed from bag");
      }
    } catch {
      showToast("Failed to remove item");
    }
  };

  const placeOrder = async () => {
    const token = getToken();
    if (!token) { window.location.href = "/login"; return; }
    if (items.length === 0) return;
    try {
      const res = await fetch(`${API.ORDER}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map(i => ({
            product_id: i.product_id,
            product_name: i.product_name,
            price: i.price,
            quantity: i.quantity,
          })),
          shipping_address: "To be provided at checkout",
        }),
      });
      if (res.ok) {
        setItems([]);
        showToast("Order placed successfully!");
        setTimeout(() => window.location.href = "/orders", 1500);
      } else {
        showToast("Failed to place order");
      }
    } catch {
      showToast("Cannot connect to server");
    }
  };

  const D=dark;
  const bg=D?"#080806":"#f8f5f0";
  const fg=D?"#f0ece4":"#1a1410";
  const sub=D?"rgba(240,236,228,0.42)":"rgba(26,20,16,0.38)";
  const border=D?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";
  const card=D?"rgba(18,14,10,0.7)":"rgba(255,255,255,0.85)";

  const subtotal=items.reduce((s,i)=>s+Number(i.price)*i.quantity,0);
  const discount=promoApplied?Math.round(subtotal*.1):0;
  const shipping=subtotal>=500?0:25;
  const total=subtotal-discount+shipping;

  const applyPromo=()=>{if(promo.toUpperCase()==="LUMIERE10"){setPromoApplied(true);}};

  return (
    <div style={{minHeight:"100vh",background:bg,color:fg,fontFamily:"'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",transition:"background 0.6s,color 0.6s"}}>
      <style>{`*{cursor:none!important}@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Cursor/><Navbar dark={dark} toggleDark={()=>setDark(d=>!d)}/>

      {toast&&<div style={{position:"fixed",bottom:32,left:"50%",transform:"translateX(-50%)",background:"#c8a96e",color:"#1a1410",padding:"12px 24px",fontSize:12,letterSpacing:"0.1em",zIndex:9999,borderRadius:2}}>{toast}</div>}

      <div style={{maxWidth:1200,margin:"0 auto",padding:"110px 48px 80px",opacity:loaded?1:0,animation:loaded?"fadeUp 0.8s both":"none"}}>
        <div style={{marginBottom:44}}>
          <p style={{fontSize:10,letterSpacing:"0.26em",textTransform:"uppercase",color:"#c8a96e",marginBottom:10}}>Your Selection</p>
          <h1 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(38px,5.5vw,72px)",fontWeight:300,color:fg,lineHeight:0.95}}>Shopping Bag</h1>
        </div>

        {loading ? (
          <div style={{textAlign:"center",padding:"80px 0",color:sub}}>
            <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:22,fontWeight:300}}>Loading your bag…</p>
          </div>
        ) : !getToken() ? (
          <div style={{textAlign:"center",padding:"80px 0"}}>
            <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:28,fontWeight:300,color:sub,marginBottom:16}}>Please login to view your bag</p>
            <a href="/login" style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:"#c8a96e",textDecoration:"none"}}>Sign In →</a>
          </div>
        ) : items.length===0 ? (
          <div style={{textAlign:"center",padding:"80px 0"}}>
            <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:28,fontWeight:300,color:sub,marginBottom:16}}>Your bag is empty</p>
            <a href="/products" style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:"#c8a96e",textDecoration:"none"}}>Continue Shopping →</a>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:48,alignItems:"start"}}>
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {items.map((item)=>(
                <div key={item.id} style={{display:"flex",gap:20,padding:"24px 0",borderBottom:`1px solid ${border}`,alignItems:"flex-start"}}>
                  <div style={{width:100,height:130,position:"relative",flexShrink:0,background:"#1a1410",borderRadius:2,overflow:"hidden"}}>
                    {item.image_url && <Image src={item.image_url} alt={item.product_name} fill style={{objectFit:"cover",objectPosition:"center top"}} quality={80}/>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:19,fontWeight:400,color:fg,lineHeight:1.2}}>{item.product_name}</p>
                      <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:17,fontWeight:300,color:fg}}>€{(Number(item.price)*item.quantity).toLocaleString()}</p>
                    </div>
                    <p style={{fontSize:11,color:sub,marginBottom:16,letterSpacing:"0.06em"}}>Qty: {item.quantity} · €{Number(item.price).toLocaleString()} each</p>
                    <div style={{display:"flex",alignItems:"center",gap:16}}>
                      <button onClick={()=>remove(item.product_id)} style={{background:"none",border:"none",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:sub,padding:0,transition:"color 0.3s",fontFamily:"inherit",cursor:"pointer"}} onMouseEnter={e=>{(e.target as HTMLElement).style.color="#e06060"}} onMouseLeave={e=>{(e.target as HTMLElement).style.color=sub}}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{paddingTop:20}}>
                <a href="/products" style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:sub,textDecoration:"none"}} onMouseEnter={e=>{(e.target as HTMLElement).style.color="#c8a96e"}} onMouseLeave={e=>{(e.target as HTMLElement).style.color=sub}}>← Continue Shopping</a>
              </div>
            </div>

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

              <div style={{marginBottom:24}}>
                <div style={{display:"flex",gap:8}}>
                  <input value={promo} onChange={e=>setPromo(e.target.value)} onFocus={()=>setPromoFocused(true)} onBlur={()=>setPromoFocused(false)} placeholder="Promo code" style={{flex:1,background:"none",border:`1px solid ${promoFocused?"#c8a96e":border}`,padding:"9px 12px",color:fg,fontSize:12,outline:"none",fontFamily:"inherit",transition:"border-color 0.3s"}}/>
                  <button onClick={applyPromo} style={{padding:"9px 16px",background:"none",border:`1px solid ${border}`,color:sub,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"inherit",cursor:"pointer"}} onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor="#c8a96e";el.style.color="#c8a96e"}} onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor=border;el.style.color=sub}}>Apply</button>
                </div>
                {promoApplied&&<p style={{fontSize:11,color:"#7ab87a",marginTop:8}}>✓ Code LUMIERE10 applied — 10% off</p>}
                {!promoApplied&&<p style={{fontSize:11,color:sub,marginTop:8}}>Try: LUMIERE10</p>}
              </div>

              <button onClick={placeOrder} style={{display:"block",width:"100%",padding:14,background:"#c8a96e",color:"#1a1410",fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:700,border:"none",fontFamily:"inherit",cursor:"pointer",transition:"background 0.3s"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#d4b980"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#c8a96e"}}>Place Order</button>
              <p style={{fontSize:11,color:sub,textAlign:"center",marginTop:14}}>Secure checkout · Free returns</p>
            </div>
          </div>
        )}
      </div>
      <Footer dark={dark}/>
    </div>
  );
}
