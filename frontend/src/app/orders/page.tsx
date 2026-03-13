"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import { ORDERS } from "@/lib/data";

const STEPS = ["Placed","Processing","Shipped","Delivered"];

export default function OrdersPage() {
  const [dark, setDark] = useState(true);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState<string|null>("LUM-2025-1023");
  const [loaded, setLoaded] = useState(false);
  useEffect(()=>{setTimeout(()=>setLoaded(true),80)},[]);

  const D=dark;
  const bg=D?"#080806":"#f8f5f0";
  const fg=D?"#f0ece4":"#1a1410";
  const sub=D?"rgba(240,236,228,0.42)":"rgba(26,20,16,0.38)";
  const border=D?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";
  const card=D?"rgba(18,14,10,0.7)":"rgba(255,255,255,0.85)";

  const filters=["All","Shipped","Delivered"];
  const filtered=ORDERS.filter(o=>filter==="All"||o.status===filter);
  const statusColor=(s:string)=>s==="Delivered"?"#7ab87a":s==="Shipped"?"#c8a96e":"rgba(240,236,228,0.5)";
  const stepIdx=(s:string)=>s==="Shipped"?2:s==="Delivered"?3:1;

  return (
    <div style={{minHeight:"100vh",background:bg,color:fg,fontFamily:"'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",transition:"background 0.6s,color 0.6s"}}>
      <style>{`*{cursor:none!important}@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Cursor/><Navbar dark={dark} toggleDark={()=>setDark(d=>!d)}/>

      <div style={{maxWidth:900,margin:"0 auto",padding:"110px 48px 80px",opacity:loaded?1:0,animation:loaded?"fadeUp 0.8s both":"none"}}>
        {/* HEADER */}
        <div style={{marginBottom:40}}>
          <p style={{fontSize:10,letterSpacing:"0.26em",textTransform:"uppercase",color:"#c8a96e",marginBottom:10}}>Your Account</p>
          <h1 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(38px,5.5vw,72px)",fontWeight:300,color:fg,lineHeight:0.95,marginBottom:24}}>My Orders</h1>
          {/* Stats */}
          <div style={{display:"flex",gap:32,flexWrap:"wrap",marginTop:24,paddingTop:24,borderTop:`1px solid ${border}`}}>
            {[{l:"Total Orders",v:ORDERS.length},{l:"Items Purchased",v:ORDERS.reduce((s,o)=>s+o.items.length,0)},{l:"Total Spent",v:`€${ORDERS.reduce((s,o)=>s+o.total,0).toLocaleString()}`}].map(s=>(
              <div key={s.l}>
                <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:28,fontWeight:300,color:fg,lineHeight:1}}>{s.v}</p>
                <p style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:sub,marginTop:4}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FILTERS */}
        <div style={{display:"flex",gap:4,marginBottom:28}}>
          {filters.map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 18px",background:filter===f?"#c8a96e":"none",border:`1px solid ${filter===f?"#c8a96e":border}`,color:filter===f?"#1a1410":sub,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"inherit",transition:"all 0.3s"}}>{f}</button>
          ))}
        </div>

        {/* ORDERS */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {filtered.map(order=>(
            <div key={order.id} style={{background:card,backdropFilter:"blur(16px)",border:`1px solid ${expanded===order.id?"rgba(200,169,110,0.3)":border}`,borderRadius:4,overflow:"hidden",transition:"border-color 0.3s"}}>
              {/* ORDER HEADER */}
              <button onClick={()=>setExpanded(expanded===order.id?null:order.id)} style={{width:"100%",padding:"20px 24px",background:"none",border:"none",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,fontFamily:"inherit",textAlign:"left"}}>
                <div style={{display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
                  <div>
                    <p style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:sub,marginBottom:3}}>Order</p>
                    <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:18,color:fg,fontWeight:400}}>{order.id}</p>
                  </div>
                  <div>
                    <p style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:sub,marginBottom:3}}>Date</p>
                    <p style={{fontSize:13,color:fg}}>{order.date}</p>
                  </div>
                  <div>
                    <p style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:sub,marginBottom:3}}>Total</p>
                    <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:16,color:fg}}>€{order.total.toLocaleString()}</p>
                  </div>
                  <div style={{padding:"4px 12px",border:`1px solid ${statusColor(order.status)}40`,borderRadius:20,background:`${statusColor(order.status)}12`}}>
                    <span style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:statusColor(order.status)}}>{order.status}</span>
                  </div>
                </div>
                <span style={{color:sub,fontSize:18,transform:expanded===order.id?"rotate(180deg)":"none",transition:"transform 0.3s"}}>↓</span>
              </button>

              {/* EXPANDED */}
              {expanded===order.id&&(
                <div style={{padding:"0 24px 24px",borderTop:`1px solid ${border}`}}>
                  {/* Progress */}
                  <div style={{padding:"24px 0",marginBottom:20}}>
                    <div style={{display:"flex",alignItems:"center",gap:0,position:"relative"}}>
                      {STEPS.map((step,i)=>{
                        const done=i<=stepIdx(order.status);
                        return(
                          <div key={step} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
                            {i<STEPS.length-1&&<div style={{position:"absolute",left:"50%",top:12,width:"100%",height:1,background:i<stepIdx(order.status)?"#c8a96e":border,transition:"background 0.4s",zIndex:0}}/>}
                            <div style={{width:24,height:24,borderRadius:"50%",background:done?"#c8a96e":D?"rgba(240,236,228,0.08)":"rgba(26,20,16,0.06)",border:`1px solid ${done?"#c8a96e":border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:done?"#1a1410":sub,zIndex:1,position:"relative",transition:"all 0.4s"}}>{done?"✓":i+1}</div>
                            <p style={{fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:done?"#c8a96e":sub,marginTop:8,textAlign:"center"}}>{step}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items */}
                  {order.items.map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:14,padding:"14px 0",borderTop:`1px solid ${border}`}}>
                      <div style={{width:64,height:80,position:"relative",flexShrink:0,background:item.bgColor,borderRadius:2,overflow:"hidden"}}>
                        <Image src={item.image} alt={item.name} fill style={{objectFit:"cover",objectPosition:"center top"}} quality={75}/>
                      </div>
                      <div style={{flex:1}}>
                        <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:17,color:fg,marginBottom:3}}>{item.name}</p>
                        <p style={{fontSize:11,color:sub}}>Size: {item.size} · Qty: {item.qty}</p>
                        <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:14,color:sub,marginTop:4}}>€{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}

                  {/* Tracking + actions */}
                  <div style={{marginTop:16,padding:"14px 0",borderTop:`1px solid ${border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                    <div>
                      <p style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:sub,marginBottom:3}}>Tracking</p>
                      <p style={{fontSize:12,color:"#c8a96e",fontFamily:"monospace"}}>{order.tracking}</p>
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      {order.status==="Delivered"&&<button style={{padding:"8px 16px",background:"none",border:`1px solid ${border}`,color:sub,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"inherit",transition:"all 0.3s"}} onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor="#c8a96e";el.style.color="#c8a96e"}} onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor=border;el.style.color=sub}}>Return</button>}
                      <a href="/products" style={{padding:"8px 16px",background:"#c8a96e",color:"#1a1410",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",textDecoration:"none",fontWeight:600}}>Buy Again</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer dark={dark}/>
    </div>
  );
}
