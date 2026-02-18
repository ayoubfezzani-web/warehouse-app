import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const ADMIN_PASSWORD = "warehouse2024";
const USER_PASSWORD = "team2024";

// Supabase configuration
const supabaseUrl = 'https://gwwvfbzwqnjnwxtfxurg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3d3ZmYnp3cW5qbnd4dGZ4dXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MjQ5MTUsImV4cCI6MjA4NzAwMDkxNX0.EsqDSlmrprjSpEDy2JsK2RnEBj7W2aKpRmYSCmNWZ6Y';
const supabase = createClient(supabaseUrl, supabaseKey);

const initialForm = {
  name: "",
  partNumber: "",
  description: "",
  quantity: "",
  purpose: "",
};

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 1000,
      background: type === "success" ? "#d4f5e2" : "#fde8e8",
      color: type === "success" ? "#1a6b3c" : "#8b1a1a",
      border: `1.5px solid ${type === "success" ? "#5ec98a" : "#e87b7b"}`,
      borderRadius: 6, padding: "14px 22px", fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 13, boxShadow: "0 4px 24px rgba(0,0,0,0.13)", maxWidth: 320,
      animation: "slideUp 0.25s ease"
    }}>
      {message}
    </div>
  );
}

function LoginScreen({ onLogin, error, setError, title, hint }) {
  const [input, setInput] = useState("");
  return (
    <div style={{ maxWidth: 340, margin: "80px auto", textAlign: "center" }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
        letterSpacing: "0.2em", color: "#444", textTransform: "uppercase", marginBottom: 10
      }}>
        ⬡ WMS v1.0
      </div>
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif", fontSize: 38,
        fontWeight: 700, color: "#f0f0f0", textTransform: "uppercase", marginBottom: 8
      }}>
        {title}
      </div>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
        color: "#444", marginBottom: 28
      }}>
        {hint}
      </p>
      <input
        type="password"
        value={input}
        onChange={e => { setInput(e.target.value); setError(""); }}
        onKeyDown={e => e.key === "Enter" && onLogin(input)}
        placeholder="Enter password"
        style={{
          width: "100%", background: "#111", border: `1.5px solid ${error ? "#e87b7b" : "#2a2a2a"}`,
          borderRadius: 5, color: "#f0f0f0", fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 13, padding: "11px 14px", outline: "none", marginBottom: 10,
          boxSizing: "border-box"
        }}
      />
      {error && (
        <div style={{ color: "#e87b7b", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, marginBottom: 10 }}>
          ⚠ {error}
        </div>
      )}
      <button
        onClick={() => onLogin(input)}
        style={{
          width: "100%", background: "#1db954", color: "#000", border: "none",
          borderRadius: 5, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
          fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "12px 0", cursor: "pointer"
        }}
      >
        ▸ Enter
      </button>
    </div>
  );
}

function Field({ label, field, type, placeholder, multiline, value, error, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block", fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
        color: "#888", marginBottom: 6
      }}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(field, e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{
            width: "100%", background: "#111", border: `1.5px solid ${error ? "#e87b7b" : "#2a2a2a"}`,
            borderRadius: 5, color: "#f0f0f0", fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13, padding: "10px 12px", resize: "vertical", outline: "none",
            boxSizing: "border-box", transition: "border 0.2s"
          }}
        />
      ) : (
        <input
          type={type || "text"}
          value={value}
          onChange={e => onChange(field, e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", background: "#111", border: `1.5px solid ${error ? "#e87b7b" : "#2a2a2a"}`,
            borderRadius: 5, color: "#f0f0f0", fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13, padding: "10px 12px", outline: "none",
            boxSizing: "border-box", transition: "border 0.2s"
          }}
        />
      )}
      {error && (
        <span style={{ color: "#e87b7b", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", marginTop: 4, display: "block" }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
}

function WithdrawalForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.partNumber.trim()) e.partNumber = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 1) e.quantity = "Enter a valid quantity";
    if (!form.purpose.trim()) e.purpose = "Required";
    return e;
  };

  const handleChange = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await onSubmit({ ...form, quantity: Number(form.quantity) });
    setForm(initialForm);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ marginBottom: 36, borderBottom: "1px solid #222", paddingBottom: 24 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 8
        }}>
          ▸ Warehouse Management System
        </div>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontSize: 42,
          fontWeight: 700, color: "#f0f0f0", margin: 0, letterSpacing: "-0.01em",
          textTransform: "uppercase"
        }}>
          Part Withdrawal
        </h1>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
          color: "#555", marginTop: 8
        }}>
          Log every item you take from the warehouse.
        </p>
      </div>

      <Field label="Your Name" field="name" placeholder="e.g. John Doe"
        value={form.name} error={errors.name} onChange={handleChange} />
      <Field label="Part Number" field="partNumber" placeholder="e.g. CAP-100UF-25V"
        value={form.partNumber} error={errors.partNumber} onChange={handleChange} />
      <Field label="Item Description" field="description" placeholder="e.g. Electrolytic Capacitor 100µF 25V"
        value={form.description} error={errors.description} onChange={handleChange} />
      <Field label="Quantity Taken" field="quantity" type="number" placeholder="e.g. 5"
        value={form.quantity} error={errors.quantity} onChange={handleChange} />
      <Field label="Purpose / Project" field="purpose" placeholder="e.g. PCB repair on unit #42"
        multiline value={form.purpose} error={errors.purpose} onChange={handleChange} />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%", background: loading ? "#1a3a2a" : "#1db954",
          color: loading ? "#555" : "#000", border: "none", borderRadius: 5,
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase", padding: "14px 0",
          cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
          marginTop: 4
        }}
      >
        {loading ? "Submitting..." : "▸ Submit Withdrawal"}
      </button>
    </div>
  );
}

function AdminView({ logs, onClear, onRefresh }) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = logs
    .filter(l =>
      Object.values(l).some(v =>
        String(v).toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      const av = a[sortField], bv = b[sortField];
      if (sortField === "quantity" || sortField === "id") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });

  const toggleSort = field => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const exportCSV = () => {
    const header = ["ID", "Name", "Part Number", "Description", "Quantity", "Purpose"];
    const rows = filtered.map(l => [
      l.id, l.name, l.part_number, l.description, l.quantity, l.purpose
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `warehouse-log-${new Date().toISOString().slice(0,10)}.csv`; a.click();
  };

  const ColHeader = ({ label, field }) => (
    <th
      onClick={() => toggleSort(field)}
      style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
        letterSpacing: "0.12em", textTransform: "uppercase", color: "#666",
        padding: "10px 14px", textAlign: "left", cursor: "pointer",
        whiteSpace: "nowrap", userSelect: "none",
        borderBottom: "1px solid #1e1e1e"
      }}
    >
      {label} {sortField === field ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div>
      <div style={{ marginBottom: 28, borderBottom: "1px solid #222", paddingBottom: 24 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 8
        }}>
          ▸ Admin Panel
        </div>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontSize: 42,
          fontWeight: 700, color: "#f0f0f0", margin: 0, textTransform: "uppercase"
        }}>
          Withdrawal Log
        </h1>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#555", marginTop: 8 }}>
          {logs.length} total entr{logs.length === 1 ? "y" : "ies"} recorded · Synced across all devices
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search logs..."
          style={{
            flex: 1, minWidth: 200, background: "#111", border: "1.5px solid #2a2a2a",
            borderRadius: 5, color: "#f0f0f0", fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12, padding: "9px 12px", outline: "none"
          }}
        />
        <button onClick={onRefresh} style={{
          background: "#111", border: "1.5px solid #2a2a2a", borderRadius: 5,
          color: "#aaa", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          padding: "9px 16px", cursor: "pointer", letterSpacing: "0.08em",
          textTransform: "uppercase", transition: "all 0.2s"
        }}>
          ↻ Refresh
        </button>
        <button onClick={exportCSV} style={{
          background: "#111", border: "1.5px solid #2a2a2a", borderRadius: 5,
          color: "#aaa", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          padding: "9px 16px", cursor: "pointer", letterSpacing: "0.08em",
          textTransform: "uppercase", transition: "all 0.2s"
        }}>
          ↓ Export CSV
        </button>
        <button onClick={onClear} style={{
          background: "#111", border: "1.5px solid #3a1a1a", borderRadius: 5,
          color: "#e87b7b", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          padding: "9px 16px", cursor: "pointer", letterSpacing: "0.08em",
          textTransform: "uppercase"
        }}>
          ✕ Clear All
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 0",
          fontFamily: "'IBM Plex Mono', monospace", color: "#444", fontSize: 13
        }}>
          {logs.length === 0 ? "No withdrawals logged yet." : "No results match your search."}
        </div>
      ) : (
        <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #1e1e1e" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#0d0d0d" }}>
              <tr>
                <ColHeader label="ID" field="id" />
                <ColHeader label="Name" field="name" />
                <ColHeader label="Part #" field="part_number" />
                <ColHeader label="Description" field="description" />
                <ColHeader label="Qty" field="quantity" />
                <ColHeader label="Purpose" field="purpose" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => (
                <tr key={log.id} style={{
                  background: i % 2 === 0 ? "#0a0a0a" : "#080808",
                  transition: "background 0.15s"
                }}>
                  <td style={{ ...cell, color: "#666" }}>#{log.id}</td>
                  <td style={cell}>{log.name}</td>
                  <td style={{ ...cell, color: "#1db954", fontWeight: 600 }}>{log.part_number}</td>
                  <td style={cell}>{log.description}</td>
                  <td style={{ ...cell, color: "#f0c040", fontWeight: 700 }}>{log.quantity}</td>
                  <td style={{ ...cell, color: "#888" }}>{log.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const cell = {
  fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
  color: "#ccc", padding: "11px 14px", borderBottom: "1px solid #141414",
  verticalAlign: "top", maxWidth: 220, wordBreak: "break-word"
};

export default function App() {
  const [view, setView] = useState("form");
  const [logs, setLogs] = useState([]);
  const [toast, setToast] = useState(null);
  const [adminError, setAdminError] = useState("");
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userError, setUserError] = useState("");

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setToast({ message: "Error loading logs", type: "error" });
    }
  };

  useEffect(() => {
    fetchLogs().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (entry) => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .insert([{
          name: entry.name,
          part_number: entry.partNumber,
          description: entry.description,
          quantity: entry.quantity,
          purpose: entry.purpose
        }])
        .select();

      if (error) throw error;
      
      await fetchLogs();
      setToast({ message: "✓ Withdrawal logged successfully!", type: "success" });
    } catch (err) {
      console.error('Error submitting:', err);
      setToast({ message: "Error saving withdrawal", type: "error" });
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear all log entries? This cannot be undone.")) return;
    try {
      const { error } = await supabase
        .from('withdrawals')
        .delete()
        .neq('id', 0); // Delete all rows

      if (error) throw error;
      
      await fetchLogs();
      setToast({ message: "Log cleared.", type: "success" });
    } catch (err) {
      console.error('Error clearing logs:', err);
      setToast({ message: "Error clearing logs", type: "error" });
    }
  };

  const handleUserLogin = (input) => {
    if (input === USER_PASSWORD) {
      setAuthenticated(true);
      setUserError("");
    } else {
      setUserError("Incorrect password.");
    }
  };

  const handleAdminLogin = (input) => {
    if (input === ADMIN_PASSWORD) {
      setView("admin");
      setAdminError("");
      fetchLogs(); // Refresh logs when entering admin
    } else {
      setAdminError("Incorrect password.");
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#444", fontSize: 13 }}>Loading...</div>
    </div>
  );

  if (!authenticated) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Barlow+Condensed:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; }
        input::placeholder { color: #333; }
        input:focus { border-color: #1db954 !important; }
        button:hover { opacity: 0.85; }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#080808" }}>
        <LoginScreen
          onLogin={handleUserLogin}
          error={userError}
          setError={setUserError}
          title="Warehouse Access"
          hint="Enter the team password to log a withdrawal."
        />
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Barlow+Condensed:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; }
        input::placeholder, textarea::placeholder { color: #333; }
        input:focus, textarea:focus { border-color: #1db954 !important; }
        button:hover:not(:disabled) { opacity: 0.85; }
        tr:hover td { background: #111 !important; }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080808", color: "#f0f0f0" }}>
        <nav style={{
          borderBottom: "1px solid #141414", padding: "14px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: "#080808", zIndex: 100
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
            letterSpacing: "0.2em", color: "#333", textTransform: "uppercase"
          }}>
            ⬡ WMS v1.0
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <NavBtn label="Log Withdrawal" active={view === "form"} onClick={() => setView("form")} />
            <NavBtn label="Admin" active={view === "admin" || view === "adminLogin"} onClick={() => setView("adminLogin")} />
          </div>
        </nav>

        <main style={{ padding: "48px 24px", maxWidth: 900, margin: "0 auto" }}>
          {view === "form" && <WithdrawalForm onSubmit={handleSubmit} />}
          {view === "adminLogin" && (
            <LoginScreen
              onLogin={handleAdminLogin}
              error={adminError}
              setError={setAdminError}
              title="Admin Access"
              hint="Enter your admin password to view and export logs."
            />
          )}
          {view === "admin" && <AdminView logs={logs} onClear={handleClear} onRefresh={fetchLogs} />}
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

function NavBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? "#1a2a1a" : "transparent",
      border: `1px solid ${active ? "#1db954" : "#1e1e1e"}`,
      color: active ? "#1db954" : "#555",
      fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
      letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "7px 16px", borderRadius: 4, cursor: "pointer",
      transition: "all 0.2s"
    }}>
      {label}
    </button>
  );
}
