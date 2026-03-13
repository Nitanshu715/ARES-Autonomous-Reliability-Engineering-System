"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

export default function LoginPage() {
  const [dark, setDark] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  useEffect(()=>{setTimeout(()=>setLoaded(true),80)},[]);

  const D=dark;
  const bg=D?"#080806":"#f8f5f0";
  const fg=D?"#f0ece4":"#1a1410";
  const sub=D?"rgba(240,236,228,0.4)":"rgba(26,20,16,0.35)";
  const border=D?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";

  const inputStyle=(n:string):React.CSSProperties=>({width:"100%",padding:"13px 0",background:"transparent",border:"none",borderBottom:`1px solid ${focused===n?"#c8a96e":D?"rgba(240,236,228,0.18)":"rgba(26,20,16,0.15)"}`,color:fg,fontSize:14,outline:"none",letterSpacing:"0.02em",transition:"border-color 0.3s",fontFamily:"inherit"});
  const labelStyle=(n:string):React.CSSProperties=>({fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase" as const,color:focused===n?"#c8a96e":sub,transition:"color 0.3s",display:"block",marginBottom:8});

  const submit=async()=>{
    if(!email||!password){setError("Please fill in all fields.");return;}
    setError("");setLoading(true);
    await new Promise(r=>setTimeout(r,1400));
    setLoading(false);setError("Invalid credentials. Please try again.");
  };

  return (
    <div style={{minHeight:"100vh",background:bg,color:fg,fontFamily:"'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",display:"flex",flexDirection:"column",transition:"background 0.6s,color 0.6s"}}>
      <style>{`*{cursor:none!important}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px ${bg} inset!important;-webkit-text-fill-color:${fg}!important}`}</style>
      <Cursor/>
      <Navbar dark={dark} toggleDark={()=>setDark(d=>!d)}/>

      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"100vh"}}>
        {/* LEFT IMAGE */}
        <div style={{position:"relative",overflow:"hidden"}}>
          <Image src="https://i.pinimg.com/1200x/8e/dc/93/8edc93d66edcfe3811858b384355393d.jpg" alt="LUMIÈRE" fill style={{objectFit:"cover",objectPosition:"center"}} priority/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(8,8,6,0.7) 0%,rgba(8,8,6,0.15) 60%,transparent 100%)"}}/>
          <div style={{position:"absolute",bottom:60,left:48,right:48,opacity:loaded?1:0,transition:"all 1s 0.5s"}}>
            <p style={{fontFamily:"var(--font-cormorant),serif",fontSize:26,fontWeight:300,fontStyle:"italic",color:"rgba(240,236,228,0.88)",lineHeight:1.6}}>&ldquo;Where simplicity becomes<br/>the ultimate sophistication.&rdquo;</p>
            <div style={{width:30,height:1,background:"#c8a96e",marginTop:18}}/>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 64px 60px"}}>
          <div style={{width:"100%",maxWidth:400}}>
            <div style={{opacity:loaded?1:0,animation:loaded?"fadeUp 0.7s 0.1s both":"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
                <div style={{width:28,height:1,background:"#c8a96e"}}/><span style={{fontSize:9,letterSpacing:"0.28em",textTransform:"uppercase",color:"#a17a32"}}>Welcome back</span><div style={{width:28,height:1,background:"#c8a96e"}}/>
              </div>
              <h1 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(34px,4.5vw,50px)",fontWeight:300,color:fg,lineHeight:1.05,marginBottom:44}}>Sign in to<br/>your account</h1>
            </div>

            {error&&<div style={{padding:"11px 16px",background:"rgba(200,80,80,0.1)",border:"1px solid rgba(200,80,80,0.25)",fontSize:12,color:"#e06060",marginBottom:22}}>{error}</div>}

            <div style={{display:"flex",flexDirection:"column",gap:26,opacity:loaded?1:0,animation:loaded?"fadeUp 0.7s 0.2s both":"none"}}>
              <div>
                <label style={labelStyle("email")}>Email Address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)} style={inputStyle("email")} placeholder="you@email.com"/>
              </div>
              <div>
                <label style={labelStyle("pw")}>Password</label>
                <div style={{position:"relative"}}>
                  <input type={showPw?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} onFocus={()=>setFocused("pw")} onBlur={()=>setFocused(null)} style={{...inputStyle("pw"),paddingRight:44}} placeholder="••••••••"/>
                  <button onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:sub,fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"inherit"}}>{showPw?"Hide":"Show"}</button>
                </div>
                <div style={{marginTop:10,textAlign:"right"}}><a href="#" style={{fontSize:11,color:"#c8a96e",textDecoration:"none"}}>Forgot password?</a></div>
              </div>
            </div>

            <div style={{marginTop:34,opacity:loaded?1:0,animation:loaded?"fadeUp 0.7s 0.32s both":"none"}}>
              <button onClick={submit} disabled={loading} style={{width:"100%",padding:14,background:loading?"#8b7355":"#c8a96e",color:"#1a1410",border:"none",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:700,transition:"all 0.3s",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:10}} onMouseEnter={e=>{if(!loading)(e.currentTarget as HTMLElement).style.background="#d4b980"}} onMouseLeave={e=>{if(!loading)(e.currentTarget as HTMLElement).style.background="#c8a96e"}}>
                {loading&&<span style={{width:12,height:12,border:"1.5px solid rgba(26,20,16,0.3)",borderTopColor:"#1a1410",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/>}
                {loading?"Signing in…":"Sign In"}
              </button>
              <div style={{display:"flex",alignItems:"center",gap:12,margin:"22px 0"}}>
                <div style={{flex:1,height:1,background:border}}/><span style={{fontSize:11,color:sub}}>or</span><div style={{flex:1,height:1,background:border}}/>
              </div>
              <p style={{textAlign:"center",fontSize:13,color:sub}}>New to LUMIÈRE? <a href="/register" style={{color:"#c8a96e",textDecoration:"none"}}>Create an account →</a></p>
              <div style={{marginTop:16,textAlign:"center"}}><a href="/orders" style={{fontSize:12,color:sub,textDecoration:"none"}}>View my orders</a></div>
            </div>
          </div>
        </div>
      </div>
      <Footer dark={dark}/>
    </div>
  );
}
