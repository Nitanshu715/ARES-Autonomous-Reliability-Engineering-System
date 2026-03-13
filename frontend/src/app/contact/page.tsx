"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

export default function ContactPage() {
  const [dark, setDark] = useState(true);
  const [focused, setFocused] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", subject:"General Enquiry", message:"" });
  useEffect(()=>{setTimeout(()=>setLoaded(true),80)},[]);

  const D=dark;
  const bg=D?"#080806":"#f8f5f0";
  const fg=D?"#f0ece4":"#1a1410";
  const sub=D?"rgba(240,236,228,0.42)":"rgba(26,20,16,0.38)";
  const border=D?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";

  const inp=(n:string,ta=false):React.CSSProperties=>({width:"100%",padding:ta?"12px 14px":"12px 0",background:ta?(D?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)"):"transparent",border:ta?`1px solid ${focused===n?"#c8a96e":border}`:"none",borderBottom:`1px solid ${focused===n?"#c8a96e":D?"rgba(240,236,228,0.18)":"rgba(26,20,16,0.15)"}`,color:fg,fontSize:14,outline:"none",transition:"border-color 0.3s",fontFamily:"inherit",resize:ta?"vertical" as const:"none"});
  const lbl=(n:string):React.CSSProperties=>({fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase" as const,color:focused===n?"#c8a96e":sub,transition:"color 0.3s",display:"block",marginBottom:8});
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));

  const submit=async()=>{
    if(!form.name||!form.email||!form.message)return;
    setLoading(true);await new Promise(r=>setTimeout(r,1500));setLoading(false);setSent(true);
  };

  const LOCATIONS=[
    {city:"Paris",address:"12 Rue du Faubourg Saint-Honoré, 75008",hours:"Mon–Sat 10:00–19:00"},
    {city:"New York",address:"840 Madison Avenue, New York, NY 10065",hours:"Mon–Sat 10:00–18:00"},
    {city:"Milan",address:"Via della Spiga 22, 20121 Milano",hours:"Mon–Sat 10:00–19:00"},
  ];

  return (
    <div style={{minHeight:"100vh",background:bg,color:fg,fontFamily:"'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",transition:"background 0.6s,color 0.6s"}}>
      <style>{`*{cursor:none!important}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}input:-webkit-autofill,textarea:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px ${bg} inset!important;-webkit-text-fill-color:${fg}!important}`}</style>
      <Cursor/><Navbar dark={dark} toggleDark={()=>setDark(d=>!d)}/>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"110px 48px 80px",opacity:loaded?1:0,animation:loaded?"fadeUp 0.8s both":"none"}}>
        {/* HEADER */}
        <div style={{marginBottom:72}}>
          <p style={{fontSize:10,letterSpacing:"0.28em",textTransform:"uppercase",color:"#c8a96e",marginBottom:12}}>We'd Love to Hear From You</p>
          <h1 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(44px,7vw,100px)",fontWeight:300,color:fg,lineHeight:0.88}}>Contact Us</h1>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"start"}}>
          {/* FORM */}
          <div>
            {sent?(
              <div style={{textAlign:"center",padding:"60px 0"}}>
                <div style={{width:56,height:56,borderRadius:"50%",border:"1.5px solid #c8a96e",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:20,color:"#c8a96e"}}>✓</div>
                <h2 style={{fontFamily:"var(--font-cormorant),serif",fontSize:32,fontWeight:300,color:fg,marginBottom:12}}>Message Received</h2>
                <p style={{fontSize:13,color:sub,lineHeight:1.7,marginBottom:28}}>Thank you for reaching out. A member of our team will be in touch within 24 hours.</p>
                <button onClick={()=>{setSent(false);setForm({name:"",email:"",subject:"General Enquiry",message:""})}} style={{padding:"10px 24px",background:"none",border:`1px solid ${border}`,color:sub,fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",fontFamily:"inherit",transition:"all 0.3s"}} onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor="#c8a96e";el.style.color="#c8a96e"}} onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor=border;el.style.color=sub}}>Send Another</button>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:28}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                  <div><label style={lbl("name")}>Full Name</label><input value={form.name} onChange={e=>set("name",e.target.value)} onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)} style={inp("name")} placeholder="Your name"/></div>
                  <div><label style={lbl("email")}>Email</label><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)} style={inp("email")} placeholder="you@email.com"/></div>
                </div>
                <div>
                  <label style={lbl("subject")}>Subject</label>
                  <select value={form.subject} onChange={e=>set("subject",e.target.value)} onFocus={()=>setFocused("subject")} onBlur={()=>setFocused(null)} style={{...inp("subject"),cursor:"pointer"}}>
                    {["General Enquiry","Order Support","Sizing & Fit","Press & Partnerships","Atelier Visit","Returns & Exchanges"].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl("message")}>Message</label>
                  <textarea value={form.message} onChange={e=>set("message",e.target.value)} onFocus={()=>setFocused("message")} onBlur={()=>setFocused(null)} style={{...inp("message",true),minHeight:140}} placeholder="How can we help you?"/>
                </div>
                <button onClick={submit} disabled={loading} style={{padding:14,background:"#c8a96e",color:"#1a1410",border:"none",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:700,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:10,transition:"background 0.3s"}} onMouseEnter={e=>{if(!loading)(e.currentTarget as HTMLElement).style.background="#d4b980"}} onMouseLeave={e=>{if(!loading)(e.currentTarget as HTMLElement).style.background="#c8a96e"}}>
                  {loading&&<span style={{width:12,height:12,border:"1.5px solid rgba(26,20,16,0.3)",borderTopColor:"#1a1410",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/>}
                  {loading?"Sending…":"Send Message"}
                </button>
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <div style={{marginBottom:40}}>
              <p style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"#c8a96e",marginBottom:16}}>Direct Contact</p>
              {[{l:"Email",v:"hello@lumiere.com"},{l:"Phone",v:"+33 1 42 68 53 00"},{l:"WhatsApp",v:"+33 6 12 34 56 78"}].map(c=>(
                <div key={c.l} style={{marginBottom:14}}>
                  <p style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:sub,marginBottom:3}}>{c.l}</p>
                  <p style={{fontSize:14,color:fg}}>{c.v}</p>
                </div>
              ))}
            </div>

            <div style={{height:1,background:border,marginBottom:36}}/>

            <p style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"#c8a96e",marginBottom:20}}>Our Ateliers</p>
            {LOCATIONS.map((loc,i)=>(
              <div key={i} style={{marginBottom:24,paddingBottom:24,borderBottom:i<LOCATIONS.length-1?`1px solid ${border}`:"none"}}>
                <h3 style={{fontFamily:"var(--font-cormorant),serif",fontSize:20,color:fg,marginBottom:4}}>{loc.city}</h3>
                <p style={{fontSize:12,color:sub,lineHeight:1.7,marginBottom:2}}>{loc.address}</p>
                <p style={{fontSize:11,color:sub,letterSpacing:"0.04em"}}>{loc.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer dark={dark}/>
    </div>
  );
}
