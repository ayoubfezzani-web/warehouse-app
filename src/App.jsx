import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const ADMIN_PASSWORD = "warehouse2024";
const USER_PASSWORD = "team2024";

const supabaseUrl = 'https://gwwvfbzwqnjnwxtfxurg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3d3ZmYnp3cW5qbnd4dGZ4dXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MjQ5MTUsImV4cCI6MjA4NzAwMDkxNX0.EsqDSlmrprjSpEDy2JsK2RnEBj7W2aKpRmYSCmNWZ6Y';
const supabase = createClient(supabaseUrl, supabaseKey);

const initialForm = {
  name: "",
  partNumber: "",
  description: "",
  quantity: "",
  purpose: "",
  warehouse: "adgets"
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
      
      <div style={{ marginBottom: 20 }}>
        <label style={{
          display: "block", fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
          color: "#888", marginBottom: 6
        }}>Warehouse</label>
        <select
          value={form.warehouse}
          onChange={e => handleChange("warehouse", e.target.value)}
          style={{
            width: "100%", background: "#111", border: "1.5px solid #2a2a2a",
            borderRadius: 5, color: "#f0f0f0", fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13, padding: "10px 12px", outline: "none",
            boxSizing: "border-box", cursor: "pointer"
          }}
        >
          <option value="adgets">Adgets Warehouse</option>
          <option value="xero">XERO Warehouse</option>
        </select>
      </div>
      
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

function BookingForm({ editForm, setEditForm, onCancel, onSubmit, isEditing }) {
  return (
    <>
      <Field
        label="Your Name"
        field="booked_by"
        value={editForm.booked_by}
        onChange={(f, v) => setEditForm(prev => ({ ...prev, [f]: v }))}
        placeholder="e.g. John Doe"
      />
      <Field
        label="Purpose"
        field="purpose"
        value={editForm.purpose}
        onChange={(f, v) => setEditForm(prev => ({ ...prev, [f]: v }))}
        placeholder="e.g. PCB assembly work"
        multiline
      />
      <Field
        label="Items Stored (Optional)"
        field="items_stored"
        value={editForm.items_stored}
        onChange={(f, v) => setEditForm(prev => ({ ...prev, [f]: v }))}
        placeholder="e.g. 3x boards, soldering station"
        multiline
      />
      <Field
        label="Booked Until"
        field="booked_until"
        type="date"
        value={editForm.booked_until}
        onChange={(f, v) => setEditForm(prev => ({ ...prev, [f]: v }))}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onCancel(); }}
          style={{
            flex: 1, background: "#1a1a1a", border: "1px solid #333",
            color: "#888", borderRadius: 4, padding: "10px",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
            cursor: "pointer", textTransform: "uppercase"
          }}
        >
          Cancel
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onSubmit(); }}
          style={{
            flex: 1, background: "#1db954", border: "none",
            color: "#000", borderRadius: 4, padding: "10px",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
            fontWeight: 700, cursor: "pointer", textTransform: "uppercase"
          }}
        >
          {isEditing ? "Update Booking" : "Book Zone"}
        </button>
      </div>
    </>
  );
}

function DGSScheduleForm({ dgsForm, setDgsForm, onCancel, onSubmit, isEditing }) {
  return (
    <>
      <Field
        label="Technician Name"
        field="technician_name"
        value={dgsForm.technician_name}
        onChange={(f, v) => setDgsForm(prev => ({ ...prev, [f]: v }))}
        placeholder="e.g. John Smith"
      />
      <Field
        label="Company"
        field="company"
        value={dgsForm.company}
        onChange={(f, v) => setDgsForm(prev => ({ ...prev, [f]: v }))}
        placeholder="e.g. Tech Services Ltd"
      />
      <Field
        label="Purpose"
        field="purpose"
        value={dgsForm.purpose}
        onChange={(f, v) => setDgsForm(prev => ({ ...prev, [f]: v }))}
        placeholder="e.g. Equipment calibration"
        multiline
      />
      <Field
        label="Start Date"
        field="start_date"
        type="date"
        value={dgsForm.start_date}
        onChange={(f, v) => setDgsForm(prev => ({ ...prev, [f]: v }))}
      />
      <Field
        label="End Date"
        field="end_date"
        type="date"
        value={dgsForm.end_date}
        onChange={(f, v) => setDgsForm(prev => ({ ...prev, [f]: v }))}
      />
      <Field
        label="Booked By"
        field="booked_by"
        value={dgsForm.booked_by}
        onChange={(f, v) => setDgsForm(prev => ({ ...prev, [f]: v }))}
        placeholder="Your name"
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onCancel(); }}
          style={{
            flex: 1, background: "#1a1a1a", border: "1px solid #333",
            color: "#888", borderRadius: 4, padding: "10px",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
            cursor: "pointer", textTransform: "uppercase"
          }}
        >
          Cancel
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onSubmit(); }}
          style={{
            flex: 1, background: "#1db954", border: "none",
            color: "#000", borderRadius: 4, padding: "10px",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
            fontWeight: 700, cursor: "pointer", textTransform: "uppercase"
          }}
        >
          {isEditing ? "Update Booking" : "Add Technician"}
        </button>
      </div>
    </>
  );
}

function ZoneCard({ num, isBooked, data, isExpanded, onToggle, onRelease, onEditStart, editMode, editForm, setEditForm, onBookZone }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: "#1a2a1a",
        border: `2px solid ${isBooked ? "#e87b7b" : "#1db954"}`,
        borderRadius: 8, padding: isExpanded ? 24 : 32,
        cursor: "pointer", transition: "all 0.3s",
        position: "relative"
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: isExpanded ? 20 : 0
      }}>
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24,
            fontWeight: 700, color: "#f0f0f0", textTransform: "uppercase"
          }}>
            Zone {num}
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
            color: isBooked ? "#e87b7b" : "#1db954", marginTop: 4,
            textTransform: "uppercase", letterSpacing: "0.1em"
          }}>
            {isBooked ? "● Booked" : "● Vacant"}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div 
          style={{ marginTop: 20, borderTop: "1px solid #2a2a2a", paddingTop: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {isBooked && data && !editMode ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                  color: "#666", textTransform: "uppercase", marginBottom: 4
                }}>Booked By</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#f0f0f0" }}>
                  {data.booked_by}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                  color: "#666", textTransform: "uppercase", marginBottom: 4
                }}>Purpose</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#f0f0f0" }}>
                  {data.purpose}
                </div>
              </div>
              {data.items_stored && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                    color: "#666", textTransform: "uppercase", marginBottom: 4
                  }}>Items Stored</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#f0f0f0" }}>
                    {data.items_stored}
                  </div>
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                  color: "#666", textTransform: "uppercase", marginBottom: 4
                }}>Booked Until</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#f0f0f0" }}>
                  {new Date(data.booked_until).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); onRelease(data.id); }}
                  style={{
                    flex: 1, background: "#3a1a1a", border: "1px solid #e87b7b",
                    color: "#e87b7b", borderRadius: 4, padding: "8px",
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
                    cursor: "pointer", textTransform: "uppercase"
                  }}
                >
                  Release Zone
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onEditStart(data); }}
                  style={{
                    flex: 1, background: "#1a2a1a", border: "1px solid #1db954",
                    color: "#1db954", borderRadius: 4, padding: "8px",
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
                    cursor: "pointer", textTransform: "uppercase"
                  }}
                >
                  Edit Booking
                </button>
              </div>
            </>
          ) : (
            <BookingForm
              editForm={editForm}
              setEditForm={setEditForm}
              onCancel={(e) => {
                if(e) e.stopPropagation();
                onEditStart(null);
              }}
              onSubmit={() => onBookZone(num)}
              isEditing={editMode && isBooked}
            />
          )}
        </div>
      )}
    </div>
  );
}

function DGSScheduleCard({ schedule, isExpanded, onToggle, onDelete, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [dgsForm, setDgsForm] = useState({
    technician_name: "",
    company: "",
    purpose: "",
    start_date: "",
    end_date: "",
    booked_by: ""
  });

  const handleAddTechnician = () => {
    const errors = [];
    if (!dgsForm.technician_name.trim()) errors.push("Technician name is required");
    if (!dgsForm.company.trim()) errors.push("Company is required");
    if (!dgsForm.purpose.trim()) errors.push("Purpose is required");
    if (!dgsForm.start_date) errors.push("Start date is required");
    if (!dgsForm.end_date) errors.push("End date is required");
    if (!dgsForm.booked_by.trim()) errors.push("Booked by is required");
    
    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }

    onAdd(dgsForm);
    setDgsForm({
      technician_name: "",
      company: "",
      purpose: "",
      start_date: "",
      end_date: "",
      booked_by: ""
    });
    setShowForm(false);
  };

  // Get upcoming and current bookings
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const activeBookings = schedule
    .filter(s => new Date(s.end_date) >= now)
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  return (
    <div
      onClick={onToggle}
      style={{
        background: "#1a2a1a",
        border: "2px solid #4a9eff",
        borderRadius: 8,
        padding: isExpanded ? 24 : 32,
        cursor: "pointer",
        transition: "all 0.3s",
        gridColumn: isExpanded ? "1 / -1" : "auto"
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: isExpanded ? 20 : 0
      }}>
        <div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24,
            fontWeight: 700, color: "#f0f0f0", textTransform: "uppercase"
          }}>
            DGS Schedule
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
            color: "#4a9eff", marginTop: 4,
            textTransform: "uppercase", letterSpacing: "0.1em"
          }}>
            ● {activeBookings.length} Upcoming Booking{activeBookings.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div 
          style={{ marginTop: 20, borderTop: "1px solid #2a2a2a", paddingTop: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {!showForm ? (
            <>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  width: "100%", background: "#1db954", border: "none",
                  color: "#000", borderRadius: 4, padding: "10px", marginBottom: 20,
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
                  fontWeight: 700, cursor: "pointer", textTransform: "uppercase"
                }}
              >
                + Add Technician Booking
              </button>

              {activeBookings.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "40px 0",
                  fontFamily: "'IBM Plex Mono', monospace", color: "#444", fontSize: 13
                }}>
                  No upcoming technician bookings
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {activeBookings.map(booking => (
                    <div
                      key={booking.id}
                      style={{
                        background: "#111", border: "1px solid #2a2a2a",
                        borderRadius: 6, padding: 16
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
                        <div style={{
                          fontFamily: "'IBM Plex Mono', monospace", fontSize: 14,
                          color: "#4a9eff", fontWeight: 600
                        }}>
                          {booking.technician_name}
                        </div>
                        <button
                          onClick={() => onDelete(booking.id)}
                          style={{
                            background: "transparent", border: "1px solid #e87b7b",
                            color: "#e87b7b", borderRadius: 3, padding: "4px 8px",
                            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                            cursor: "pointer", textTransform: "uppercase"
                          }}
                        >
                          Delete
                        </button>
                      </div>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
                        color: "#888", marginBottom: 8
                      }}>
                        {booking.company}
                      </div>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
                        color: "#ccc", marginBottom: 8
                      }}>
                        {booking.purpose}
                      </div>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
                        color: "#666"
                      }}>
                        {new Date(booking.start_date).toLocaleDateString()} → {new Date(booking.end_date).toLocaleDateString()}
                      </div>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                        color: "#555", marginTop: 6
                      }}>
                        Booked by: {booking.booked_by}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <DGSScheduleForm
              dgsForm={dgsForm}
              setDgsForm={setDgsForm}
              onCancel={() => setShowForm(false)}
              onSubmit={handleAddTechnician}
              isEditing={false}
            />
          )}
        </div>
      )}
    </div>
  );
}

function CommissioningZones({ zones, dgsSchedule, onRefresh, onBook, onRelease, onAddDGS, onDeleteDGS }) {
  const [selectedZone, setSelectedZone] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    booked_by: "",
    purpose: "",
    items_stored: "",
    booked_until: ""
  });

  const isBooked = (zoneNum) => {
    const bookings = zones.filter(z => z.zone_number === zoneNum);
    if (bookings.length === 0) return false;
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return bookings.some(booking => {
      const until = new Date(booking.booked_until);
      until.setHours(0, 0, 0, 0);
      return until >= now;
    });
  };

  const getZoneData = (zoneNum) => {
    const bookings = zones.filter(z => z.zone_number === zoneNum);
    if (bookings.length === 0) return null;
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const activeBookings = bookings.filter(booking => {
      const until = new Date(booking.booked_until);
      until.setHours(0, 0, 0, 0);
      return until >= now;
    });
    
    if (activeBookings.length === 0) return null;
    
    return activeBookings.sort((a, b) => 
      new Date(b.booked_at) - new Date(a.booked_at)
    )[0];
  };

  const handleBookZone = async (zoneNum) => {
    const errors = [];
    if (!editForm.booked_by.trim()) errors.push("Name is required");
    if (!editForm.purpose.trim()) errors.push("Purpose is required");
    if (!editForm.booked_until) errors.push("End date is required");
    
    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }

    await onBook(zoneNum, editForm);
    setEditMode(false);
    setSelectedZone(null);
    setEditForm({ booked_by: "", purpose: "", items_stored: "", booked_until: "" });
  };

  const handleEditStart = (data) => {
    if (!data) {
      setEditMode(false);
      setEditForm({ booked_by: "", purpose: "", items_stored: "", booked_until: "" });
    } else {
      setEditForm({
        booked_by: data.booked_by,
        purpose: data.purpose,
        items_stored: data.items_stored || "",
        booked_until: data.booked_until
      });
      setEditMode(true);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 36, borderBottom: "1px solid #222", paddingBottom: 24 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 8
        }}>
          ▸ Lab Management
        </div>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontSize: 42,
          fontWeight: 700, color: "#f0f0f0", margin: 0, textTransform: "uppercase"
        }}>
          Commissioning Zones
        </h1>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
          color: "#555", marginTop: 8
        }}>
          Book zones for assembly work and schedule external technicians
        </p>
      </div>

      <button
        onClick={onRefresh}
        style={{
          background: "#111", border: "1.5px solid #2a2a2a", borderRadius: 5,
          color: "#aaa", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          padding: "9px 16px", cursor: "pointer", letterSpacing: "0.08em",
          textTransform: "uppercase", marginBottom: 20
        }}
      >
        ↻ Refresh Zones
      </button>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20
      }}>
        {[1, 2, 3, 4].map(num => (
          <ZoneCard
            key={num}
            num={num}
            isBooked={isBooked(num)}
            data={getZoneData(num)}
            isExpanded={selectedZone === num}
            onToggle={() => {
              setSelectedZone(selectedZone === num ? null : num);
              if (selectedZone !== num) {
                setEditMode(false);
                setEditForm({ booked_by: "", purpose: "", items_stored: "", booked_until: "" });
              }
            }}
            onRelease={onRelease}
            onEditStart={handleEditStart}
            editMode={editMode}
            editForm={editForm}
            setEditForm={setEditForm}
            onBookZone={handleBookZone}
          />
        ))}
        
        <DGSScheduleCard
          schedule={dgsSchedule}
          isExpanded={selectedZone === 'dgs'}
          onToggle={() => setSelectedZone(selectedZone === 'dgs' ? null : 'dgs')}
          onDelete={onDeleteDGS}
          onAdd={onAddDGS}
        />
      </div>
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
    const header = ["ID", "Name", "Warehouse", "Part Number", "Description", "Quantity", "Purpose"];
    const rows = filtered.map(l => [
      l.id, l.name, l.warehouse === 'adgets' ? 'Adgets' : 'XERO', l.part_number, l.description, l.quantity, l.purpose
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
                <ColHeader label="Warehouse" field="warehouse" />
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
                  <td style={{ ...cell, color: "#4a9eff", fontWeight: 600, textTransform: "uppercase" }}>
                    {log.warehouse === 'adgets' ? 'Adgets' : 'XERO'}
                  </td>
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
  const [zones, setZones] = useState([]);
  const [dgsSchedule, setDgsSchedule] = useState([]);
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
    }
  };

  const fetchZones = async () => {
    try {
      const { data, error } = await supabase
        .from('commissioning_zones')
        .select('*')
        .order('booked_at', { ascending: false });
      
      if (error) throw error;
      setZones(data || []);
    } catch (err) {
      console.error('Error fetching zones:', err);
    }
  };

  const fetchDGSSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('dgs_schedule')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      setDgsSchedule(data || []);
    } catch (err) {
      console.error('Error fetching DGS schedule:', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchLogs(), fetchZones(), fetchDGSSchedule()]).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (entry) => {
    try {
      const { error } = await supabase
        .from('withdrawals')
        .insert([{
          name: entry.name,
          part_number: entry.partNumber,
          description: entry.description,
          quantity: entry.quantity,
          purpose: entry.purpose,
          warehouse: entry.warehouse
        }]);

      if (error) throw error;
      
      await fetchLogs();
      setToast({ message: "✓ Withdrawal logged successfully!", type: "success" });
    } catch (err) {
      console.error('Error submitting:', err);
      setToast({ message: "Error saving withdrawal", type: "error" });
    }
  };

  const handleBookZone = async (zoneNum, formData) => {
    try {
      const { error } = await supabase
        .from('commissioning_zones')
        .insert([{
          zone_number: zoneNum,
          booked_by: formData.booked_by,
          purpose: formData.purpose,
          items_stored: formData.items_stored,
          booked_until: formData.booked_until
        }]);

      if (error) throw error;
      
      await fetchZones();
      setToast({ message: "✓ Zone booked successfully!", type: "success" });
    } catch (err) {
      console.error('Error booking zone:', err);
      setToast({ message: "Error booking zone", type: "error" });
    }
  };

  const handleReleaseZone = async (bookingId) => {
    if (!window.confirm("Release this zone booking?")) return;
    try {
      const { error } = await supabase
        .from('commissioning_zones')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;
      
      await fetchZones();
      setToast({ message: "✓ Zone released!", type: "success" });
    } catch (err) {
      console.error('Error releasing zone:', err);
      setToast({ message: "Error releasing zone", type: "error" });
    }
  };

  const handleAddDGS = async (formData) => {
    try {
      const { error } = await supabase
        .from('dgs_schedule')
        .insert([formData]);

      if (error) throw error;
      
      await fetchDGSSchedule();
      setToast({ message: "✓ Technician booking added!", type: "success" });
    } catch (err) {
      console.error('Error adding DGS booking:', err);
      setToast({ message: "Error adding booking", type: "error" });
    }
  };

  const handleDeleteDGS = async (bookingId) => {
    if (!window.confirm("Delete this technician booking?")) return;
    try {
      const { error } = await supabase
        .from('dgs_schedule')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;
      
      await fetchDGSSchedule();
      setToast({ message: "✓ Booking deleted!", type: "success" });
    } catch (err) {
      console.error('Error deleting booking:', err);
      setToast({ message: "Error deleting booking", type: "error" });
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear all log entries? This cannot be undone.")) return;
    try {
      const { error } = await supabase
        .from('withdrawals')
        .delete()
        .neq('id', 0);

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
      fetchLogs();
    } else {
      setAdminError("Incorrect password.");
    }
  };

  const handleRefreshZones = () => {
    fetchZones();
    fetchDGSSchedule();
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
            <NavBtn label="Zones" active={view === "zones"} onClick={() => { setView("zones"); handleRefreshZones(); }} />
            <NavBtn label="Admin" active={view === "admin" || view === "adminLogin"} onClick={() => setView("adminLogin")} />
          </div>
        </nav>

        <main style={{ padding: "48px 24px", maxWidth: 900, margin: "0 auto" }}>
          {view === "form" && <WithdrawalForm onSubmit={handleSubmit} />}
          {view === "zones" && (
            <CommissioningZones 
              zones={zones}
              dgsSchedule={dgsSchedule}
              onRefresh={handleRefreshZones}
              onBook={handleBookZone}
              onRelease={handleReleaseZone}
              onAddDGS={handleAddDGS}
              onDeleteDGS={handleDeleteDGS}
            />
          )}
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
