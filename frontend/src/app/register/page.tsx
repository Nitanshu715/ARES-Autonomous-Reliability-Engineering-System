"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import { API, saveToken, saveUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string|null>(null);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", password:"", confirm:"" });
  useEffect(()=>{setTimeout(()=>setLoaded(true),80)},[]);

  const D=dark;
  const bg=D?"#080806":"#f8f5f0";
  const fg=D?"#f0ece4":"#1a1410";
  const sub=D?"rgba(240,236,228,0.4)":"rgba(26,20,16,0.35)";
  const border=D?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.07)";

  const inp=(n:string):React.CSSProperties=>({width:"100%",padding:"12px 0",background:"transparent",border:"none",borderBottom:`1px solid ${focused===n?"#c8a96e":D?"rgba(240,236,228,0.18)":"rgba(26,20,16,0.15)"}`,color:fg,fontSize:14,outline:"none",transition:"border-color 0.3s",fontFamily:"inherit"});
  const lbl=(n:string):React.CSSProperties=>({fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase" as const,color:focused===n?"#c8a96e":sub,transition:"color 0.3s",display:"block",marginBottom:7});
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));

  const next = async () => {
    setError("");
    if (step === 1) {
      if (!form.firstName || !form.lastName) { setError("Please fill in all fields."); return; }
      setStep(2);
    } else {
      if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
      if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
      if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API.USER}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            password: form.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Registration failed. Please try again.");
        } else {
          saveToken(data.token);
          saveUser(data.user);
          setDone(true);
        }
      } catch {
        setError("Cannot connect to server. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (done) return (
    <div style={{minHeight:"100vh",background:bg,color:fg,fontFamily:"'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",display:"flex",flexDirection:"column",transition:"background 0.6s,color 0.6s"}}>
      <style>{`*{cursor:none!important}`}</style>
      <Cursor/><Navbar dark={dark} toggleDark={()=>setDark(d=>!d)}/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 32px"}}>
        <div style={{textAlign:"center",maxWidth:500}}>
          <div style={{width:64,height:64,borderRadius:"50%",border:"1.5px solid #c8a96e",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px",fontSize:24,color:"#c8a96e"}}>✓</div>
          <h1 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(32px,4vw,52px)",fontWeight:300,color:fg,lineHeight:1.1,marginBottom:16}}>Welcome to LUMIÈRE</h1>
          <p style={{fontSize:14,color:sub,lineHeight:1.7,marginBottom:36}}>Your account has been created. You may now explore our collections and place your first order.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="/products" style={{padding:"12px 32px",background:"#c8a96e",color:"#1a1410",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:700,textDecoration:"none"}}>Shop Now</a>
            <a href="/login" style={{padding:"12px 32px",background:"none",border:`1px solid ${border}`,color:sub,fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",textDecoration:"none"}}>Sign In</a>
          </div>
        </div>
      </div>
      <Footer dark={dark}/>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:bg,color:fg,fontFamily:"'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif",display:"flex",flexDirection:"column",transition:"background 0.6s,color 0.6s"}}>
      <style>{`*{cursor:none!important}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px ${bg} inset!important;-webkit-text-fill-color:${fg}!important}`}</style>
      <Cursor/><Navbar dark={dark} toggleDark={()=>setDark(d=>!d)}/>

      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"100vh"}}>
        <div style={{position:"relative",overflow:"hidden"}}>
          <Image src="https://i.pinimg.com/1200x/b8/7a/3c/b87a3cc00adb45631dec8fee67a08759.jpg" alt="LUMIÈRE" fill style={{objectFit:"cover",objectPosition:"center"}} priority/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(8,8,6,0.65) 0%,rgba(8,8,6,0.1) 100%)"}}/>
          <div style={{position:"absolute",top:"50%",left:48,right:48,transform:"translateY(-50%)"}}>
            <p style={{fontSize:10,letterSpacing:"0.24em",textTransform:"uppercase",color:"#c8a96e",marginBottom:14}}>Member Benefits</p>
            {["Free shipping on all orders","Early access to new collections","Exclusive member-only pieces","Personalised styling service","Complimentary alterations"].map((b,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:"#c8a96e",flexShrink:0}}/>
                <p style={{fontSize:13,color:"rgba(240,236,228,0.82)",letterSpacing:"0.02em"}}>{b}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 64px 60px"}}>
          <div style={{width:"100%",maxWidth:400}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:36,opacity:loaded?1:0,animation:"fadeUp 0.7s 0.1s both"}}>
              {[1,2].map(s=>(
                <div key={s} style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:step>=s?"#c8a96e":border,border:`1px solid ${step>=s?"#c8a96e":D?"rgba(240,236,228,0.18)":"rgba(26,20,16,0.15)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:step>=s?"#1a1410":sub,transition:"all 0.4s"}}>{s}</div>
                  {s<2&&<div style={{width:40,height:1,background:step>1?"#c8a96e":border,transition:"background 0.4s"}}/>}
                </div>
              ))}
              <span style={{fontSize:10,letterSpacing:"0.14em",color:sub,marginLeft:8}}>{step===1?"Personal Info":"Account Details"}</span>
            </div>

            <h1 style={{fontFamily:"var(--font-cormorant),serif",fontSize:"clamp(32px,4vw,48px)",fontWeight:300,color:fg,lineHeight:1.05,marginBottom:40,opacity:loaded?1:0,animation:"fadeUp 0.7s 0.15s both"}}>Create your<br/>account</h1>

            {error&&<div style={{padding:"11px 16px",background:"rgba(200,80,80,0.1)",border:"1px solid rgba(200,80,80,0.25)",fontSize:12,color:"#e06060",marginBottom:22}}>{error}</div>}

            <div style={{display:"flex",flexDirection:"column",gap:24,opacity:loaded?1:0,animation:"fadeUp 0.7s 0.25s both"}}>
              {step===1?(
                <>
                  <div><label style={lbl("fn")}>First Name</label><input value={form.firstName} onChange={e=>set("firstName",e.target.value)} onFocus={()=>setFocused("fn")} onBlur={()=>setFocused(null)} style={inp("fn")} placeholder="Amélie"/></div>
                  <div><label style={lbl("ln")}>Last Name</label><input value={form.lastName} onChange={e=>set("lastName",e.target.value)} onFocus={()=>setFocused("ln")} onBlur={()=>setFocused(null)} style={inp("ln")} placeholder="Fontaine"/></div>
                </>
              ):(
                <>
                  <div><label style={lbl("em")}>Email Address</label><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} onFocus={()=>setFocused("em")} onBlur={()=>setFocused(null)} style={inp("em")} placeholder="you@email.com"/></div>
                  <div><label style={lbl("pw")}>Password</label><input type="password" value={form.password} onChange={e=>set("password",e.target.value)} onFocus={()=>setFocused("pw")} onBlur={()=>setFocused(null)} style={inp("pw")} placeholder="Min 6 characters"/></div>
                  <div><label style={lbl("c")}>Confirm Password</label><input type="password" value={form.confirm} onChange={e=>set("confirm",e.target.value)} onFocus={()=>setFocused("c")} onBlur={()=>setFocused(null)} style={inp("c")} placeholder="Repeat password"/></div>
                </>
              )}
            </div>

            <div style={{marginTop:32,display:"flex",gap:12,opacity:loaded?1:0,animation:"fadeUp 0.7s 0.35s both"}}>
              {step===2&&<button onClick={()=>{setStep(1);setError("");}} style={{flex:1,padding:13,background:"none",border:`1px solid ${border}`,color:sub,fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",fontFamily:"inherit"}}>Back</button>}
              <button onClick={next} disabled={loading} style={{flex:2,padding:13,background:"#c8a96e",color:"#1a1410",border:"none",fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:700,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                {loading&&<span style={{width:12,height:12,border:"1.5px solid rgba(26,20,16,0.3)",borderTopColor:"#1a1410",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/>}
                {loading?"Creating…":step===1?"Continue →":"Create Account"}
              </button>
            </div>
            <p style={{textAlign:"center",fontSize:13,color:sub,marginTop:20}}>Already a member? <a href="/login" style={{color:"#c8a96e",textDecoration:"none"}}>Sign in →</a></p>
          </div>
        </div>
      </div>
      <Footer dark={dark}/>
    </div>
  );
}
