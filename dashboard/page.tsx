"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";

// ── Config ────────────────────────────────────────────────────────────────────
// When running locally with docker-compose, ARES API is at localhost:8000
// When deployed, change this to your server IP
const ARES_API = process.env.NEXT_PUBLIC_ARES_API_URL || "http://localhost:8000";
const POLL_MS = 5000;

// ── Types ─────────────────────────────────────────────────────────────────────
type ServiceStatus = "healthy" | "degraded" | "down" | "healing";

interface Service {
  status: ServiceStatus;
  cpu: number;
  memory: number;
  latency: number;
  ml_score: number;
  last_seen: string | null;
}

interface MLFeedEntry {
  timestamp: string;
  service: string;
  metric: string;
  value: number;
  score: number;
  anomaly: boolean;
}

interface Incident {
  id: number;
  timestamp: string;
  service: string;
  trigger: string;
  ml_score: number;
  action: string;
  status: "detected" | "healing" | "healed" | "failed";
  recovery_time_ms: number | null;
}

interface Stats {
  total_incidents: number;
  healed: number;
  avg_mttr_seconds: number;
  baseline_mttr_minutes: number;
  uptime_seconds: number;
}

interface StatusResponse {
  services: Record<string, Service>;
  ml_feed: MLFeedEntry[];
  incidents: Incident[];
  stats: Stats;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusColor = (s: ServiceStatus) => ({
  healthy: "#1a7a4a",
  degraded: "#b85c00",
  down: "#b00020",
  healing: "#1B6CA8",
}[s] || "#555");

const statusBg = (s: ServiceStatus) => ({
  healthy: "rgba(26,122,74,0.1)",
  degraded: "rgba(184,92,0,0.1)",
  down: "rgba(176,0,32,0.1)",
  healing: "rgba(27,108,168,0.1)",
}[s] || "rgba(0,0,0,0.05)");

const statusDot = (s: ServiceStatus) => ({
  healthy: "●",
  degraded: "▲",
  down: "✕",
  healing: "↻",
}[s] || "?");

function fmtUptime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

function Bar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ height: 6, background: "rgba(0,0,0,0.1)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.5s" }} />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ARESDashboard() {
  const [dark, setDark] = useState(true);
  const [data, setData] = useState<StatusResponse | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastPoll, setLastPoll] = useState<string>("");
  const [simulating, setSimulating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const D = dark;
  const bg = D ? "#080806" : "#f8f5f0";
  const fg = D ? "#f0ece4" : "#1a1410";
  const sub = D ? "rgba(240,236,228,0.42)" : "rgba(26,20,16,0.38)";
  const border = D ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const card = D ? "rgba(18,14,10,0.85)" : "rgba(255,255,255,0.9)";

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${ARES_API}/api/status`, { cache: "no-store" });
      if (!res.ok) throw new Error("Non-200");
      const json: StatusResponse = await res.json();
      setData(json);
      setConnected(true);
      setLastPoll(new Date().toLocaleTimeString());
    } catch {
      setConnected(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, POLL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const simulateCrash = async (service: string) => {
    setSimulating(true);
    try {
      await fetch(`${ARES_API}/api/simulate/crash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service }),
      });
      setTimeout(fetchStatus, 1000);
    } catch (e) {
      alert("Could not reach ARES API. Is docker-compose running?");
    }
    setTimeout(() => setSimulating(false), 3000);
  };

  const services = data?.services || {};
  const stats = data?.stats;
  const mlFeed = data?.ml_feed || [];
  const incidents = data?.incidents || [];

  return (
    <div style={{ minHeight: "100vh", background: bg, color: fg, fontFamily: "'Neue Haas Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif", transition: "background 0.6s, color 0.6s" }}>
      <style>{`*{cursor:none!important} @keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <Cursor />
      <Navbar dark={dark} toggleDark={() => setDark(d => !d)} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "90px 32px 60px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 8 }}>
              ARES Control Plane · Powered by Helios ML
            </p>
            <h1 style={{ fontFamily: "var(--font-cormorant),serif", fontSize: "clamp(32px,4vw,56px)", fontWeight: 300, color: fg, lineHeight: 1 }}>
              System Intelligence Dashboard
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: connected ? "#1a7a4a" : "#b00020", animation: connected ? "pulse 2s infinite" : "none" }} />
              <span style={{ fontSize: 11, color: connected ? "#1a7a4a" : "#b00020" }}>
                {connected ? "ARES ONLINE" : "DISCONNECTED"}
              </span>
            </div>
            <p style={{ fontSize: 10, color: sub }}>Last poll: {lastPoll || "—"}</p>
            {stats && <p style={{ fontSize: 10, color: sub, marginTop: 2 }}>Uptime: {fmtUptime(stats.uptime_seconds)}</p>}
          </div>
        </div>

        {/* ── Stat Strip ── */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Total Incidents", value: stats.total_incidents, color: "#1B6CA8" },
              { label: "Auto-Healed", value: stats.healed, color: "#1a7a4a" },
              { label: "Avg MTTR", value: `${stats.avg_mttr_seconds}s`, color: "#c8a96e", sub: "Baseline: 120 min" },
              { label: "MTTR Reduction", value: stats.avg_mttr_seconds > 0 ? `${Math.round((1 - stats.avg_mttr_seconds / 7200) * 100)}%` : "—", color: "#1a7a4a" },
            ].map(s => (
              <div key={s.label} style={{ background: card, border: `1px solid ${border}`, borderRadius: 4, padding: "16px 20px" }}>
                <p style={{ fontSize: 28, fontFamily: "var(--font-cormorant),serif", fontWeight: 300, color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: sub, marginTop: 6 }}>{s.label}</p>
                {s.sub && <p style={{ fontSize: 9, color: sub, marginTop: 3 }}>{s.sub}</p>}
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
          <div>

            {/* ── Service Health Grid ── */}
            <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 14 }}>
              Service Health — Live
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {Object.entries(services).map(([name, svc]) => (
                <div key={name} style={{ background: card, border: `1px solid ${statusColor(svc.status as ServiceStatus)}40`, borderRadius: 4, padding: 20, transition: "all 0.4s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 18, color: fg }}>{name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: statusBg(svc.status as ServiceStatus), padding: "4px 10px", borderRadius: 12 }}>
                      <span style={{ color: statusColor(svc.status as ServiceStatus), fontSize: svc.status === "healing" ? 14 : 10, animation: svc.status === "healing" ? "spin 1s linear infinite" : "none" }}>
                        {statusDot(svc.status as ServiceStatus)}
                      </span>
                      <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: statusColor(svc.status as ServiceStatus) }}>
                        {svc.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: sub }}>CPU</span>
                        <span style={{ fontSize: 10, color: svc.cpu > 80 ? "#b00020" : fg }}>{svc.cpu}%</span>
                      </div>
                      <Bar value={svc.cpu} color={svc.cpu > 80 ? "#b00020" : svc.cpu > 60 ? "#b85c00" : "#1a7a4a"} />
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: sub }}>Memory</span>
                        <span style={{ fontSize: 10, color: fg }}>{svc.memory} MB</span>
                      </div>
                      <Bar value={svc.memory} max={512} color="#1B6CA8" />
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: sub }}>Latency</span>
                        <span style={{ fontSize: 10, color: svc.latency > 1000 ? "#b00020" : fg }}>{svc.latency} ms</span>
                      </div>
                      <Bar value={svc.latency} max={2000} color={svc.latency > 1000 ? "#b00020" : "#c8a96e"} />
                    </div>
                    <div style={{ paddingTop: 8, borderTop: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: sub }}>Helios Score</span>
                      <span style={{ fontSize: 13, fontFamily: "var(--font-cormorant),serif", color: svc.ml_score > 0.7 ? "#b00020" : svc.ml_score > 0.5 ? "#b85c00" : "#1a7a4a" }}>
                        {svc.ml_score.toFixed(3)}
                        {svc.ml_score > 0.7 ? " ⚠" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Simulate crash button */}
                  <button
                    onClick={() => simulateCrash(name)}
                    disabled={simulating || svc.status !== "healthy"}
                    style={{
                      width: "100%", marginTop: 14, padding: "7px 0",
                      background: "none", border: `1px solid ${border}`,
                      color: sub, fontSize: 9, letterSpacing: "0.14em",
                      textTransform: "uppercase", fontFamily: "inherit",
                      opacity: svc.status !== "healthy" ? 0.4 : 1,
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={e => { if (svc.status === "healthy") { (e.currentTarget as HTMLElement).style.borderColor = "#b00020"; (e.currentTarget as HTMLElement).style.color = "#b00020"; } }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; (e.currentTarget as HTMLElement).style.color = sub; }}
                  >
                    {simulating ? "Simulating…" : "Simulate Failure"}
                  </button>
                </div>
              ))}

              {/* Placeholder when not connected */}
              {Object.keys(services).length === 0 && [
                "user-service", "product-service", "cart-service", "order-service"
              ].map(name => (
                <div key={name} style={{ background: card, border: `1px solid ${border}`, borderRadius: 4, padding: 20, opacity: 0.5 }}>
                  <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 18, color: fg, marginBottom: 8 }}>{name}</p>
                  <p style={{ fontSize: 11, color: sub }}>Waiting for ARES API…</p>
                </div>
              ))}
            </div>

            {/* ── Incident Timeline ── */}
            <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 14 }}>
              Incident Timeline
            </p>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 4, overflow: "hidden" }}>
              {incidents.length === 0 ? (
                <div style={{ padding: "32px 24px", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-cormorant),serif", fontSize: 22, color: sub, marginBottom: 8 }}>No incidents</p>
                  <p style={{ fontSize: 12, color: sub }}>All services operating normally. Use "Simulate Failure" to trigger ARES.</p>
                </div>
              ) : incidents.slice().reverse().map((inc, i) => (
                <div key={inc.id} style={{ padding: "14px 20px", borderBottom: i < incidents.length - 1 ? `1px solid ${border}` : "none", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: inc.status === "healed" ? "#1a7a4a" : inc.status === "healing" ? "#1B6CA8" : "#b00020", marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: fg, fontFamily: "var(--font-cormorant),serif" }}>{inc.service}</span>
                      <span style={{ fontSize: 10, color: sub }}>{inc.timestamp}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, color: sub }}>Trigger: <span style={{ color: fg }}>{inc.trigger}</span></span>
                      <span style={{ fontSize: 10, color: sub }}>Score: <span style={{ color: inc.ml_score > 0.7 ? "#b00020" : fg }}>{inc.ml_score.toFixed(3)}</span></span>
                      <span style={{ fontSize: 10, color: sub }}>Action: <span style={{ color: "#1B6CA8" }}>{inc.action}</span></span>
                      {inc.recovery_time_ms && (
                        <span style={{ fontSize: 10, color: "#1a7a4a" }}>Recovered in {(inc.recovery_time_ms / 1000).toFixed(1)}s</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: inc.status === "healed" ? "#1a7a4a" : inc.status === "healing" ? "#1B6CA8" : "#b00020", flexShrink: 0 }}>
                    {inc.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Column: ML Feed ── */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 14 }}>
              Helios ML Score Feed — Live
            </p>
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 4, height: 520, overflowY: "auto" }}>
              {mlFeed.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: sub }}>Waiting for Helios ML Engine…</p>
                  <p style={{ fontSize: 11, color: sub, marginTop: 8 }}>Scores appear every 15 seconds</p>
                </div>
              ) : mlFeed.slice().reverse().map((entry, i) => (
                <div key={i} style={{ padding: "10px 16px", borderBottom: `1px solid ${border}`, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: sub, fontFamily: "monospace" }}>{entry.timestamp}</span>
                  <div>
                    <span style={{ fontSize: 11, color: fg }}>{entry.service}</span>
                    <span style={{ fontSize: 9, color: sub, marginLeft: 6 }}>{entry.metric}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 12, fontFamily: "var(--font-cormorant),serif", color: entry.anomaly ? "#b00020" : entry.score > 0.5 ? "#b85c00" : "#1a7a4a" }}>
                      {entry.score.toFixed(3)}
                    </span>
                    {entry.anomaly && <span style={{ fontSize: 9, color: "#b00020", display: "block" }}>ANOMALY</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* ── MAPE-K Status ── */}
            <div style={{ marginTop: 16, background: card, border: `1px solid ${border}`, borderRadius: 4, padding: 20 }}>
              <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 14 }}>MAPE-K Loop Status</p>
              {[
                { label: "MONITOR", desc: "Prometheus + Agents", active: connected },
                { label: "ANALYZE", desc: "Helios Isolation Forest", active: connected },
                { label: "PLAN", desc: "Decision Engine", active: connected },
                { label: "EXECUTE", desc: "Docker Healing Agent", active: connected },
                { label: "KNOWLEDGE", desc: "This Dashboard", active: true },
              ].map((step, i) => (
                <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 4 ? 12 : 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: step.active ? "#1a7a4a" : "#555", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: step.active ? fg : sub }}>{step.label}</span>
                    <span style={{ fontSize: 9, color: sub, marginLeft: 8 }}>{step.desc}</span>
                  </div>
                  <span style={{ fontSize: 9, color: step.active ? "#1a7a4a" : sub }}>{step.active ? "ACTIVE" : "OFFLINE"}</span>
                </div>
              ))}
            </div>

            {/* ── Helios Paper credit ── */}
            <div style={{ marginTop: 12, padding: "12px 16px", border: `1px solid ${border}`, borderRadius: 4, background: "rgba(200,169,110,0.05)" }}>
              <p style={{ fontSize: 10, color: "#c8a96e", marginBottom: 4 }}>ML Engine</p>
              <p style={{ fontSize: 11, color: fg, lineHeight: 1.5 }}>Helios — AI-Enabled Secure Cloud Infrastructures and DevSecOps Threat Detection</p>
              <p style={{ fontSize: 9, color: sub, marginTop: 4 }}>Nitanshu Tak et al. · Accepted Conference Paper · 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
