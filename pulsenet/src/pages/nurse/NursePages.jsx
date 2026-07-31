import React, { useState, useEffect } from 'react';
import { StatCard, Card, Table, Badge, FormField, Input, Select, SectionHeader } from '../../components/ui';
import { Users, Activity, Pill, ClipboardList, User } from 'lucide-react';
import BASE from '../../config';

export function NurseDashboard() {
  const [patients, setPatients] = useState([]);
  const [meds, setMeds] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch(`${BASE}/api/admission-form`)
      .then(res => res.json())
      .then(setPatients);
    
    fetch(`${BASE}/api/medication/all`)
      .then(res => res.json())
      .then(setMeds);
  }, []);

  const pendingMeds = meds.filter(m => m.status === 'pending');

  return (
    <div>
      <SectionHeader title="Nurse Dashboard" subtitle={`Welcome back, ${user.fullname}`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Patients" value={patients.length} icon={Users} color="blue" />
        <StatCard title="Meds Pending" value={pendingMeds.length} icon={Pill} color="rose" />
        <StatCard title="Completed" value="0" subtitle="Tasks today" icon={ClipboardList} color="teal" />
        <StatCard title="Alerts" value="0" icon={Activity} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Patient Overview">
          <Table headers={['Patient ID', 'Room', 'Diagnosis']}>
            {patients?.slice(0, 5).map(p => (
              <tr key={p._id}>
                <td className="table-cell font-mono text-xs">{p.patientId}</td>
                <td className="table-cell">{p.selectedRoom || "TBD"}</td>
                <td className="table-cell text-sm">{p.chiefComplaint}</td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card title="Pending Medications">
          <div className="p-4 space-y-3">
            {pendingMeds?.slice(0, 4).map(m => (
              <div key={m._id} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                <Pill size={16} className="text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{m.patientId}</p>
                  <p className="text-xs text-slate-500">{m.medicineName} · {m.dosage}</p>
                </div>
                <Badge variant="yellow">Pending</Badge>
              </div>
            ))}
            {pendingMeds.length === 0 && <p className="text-center text-slate-400 text-sm">No pending meds.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function NursePatients() {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/api/admission-form`)
      .then(res => res.json())
      .then(setPatients);
  }, []);

  if (selected) {
    const p = patients.find(p => p._id === selected);
    return (
      <div>
        <SectionHeader
          title={p?.fullname ?? "N/A"}
          subtitle={`Patient ID: ${p?.patientId ?? "N/A"}`}
          action={<button onClick={() => setSelected(null)} className="btn-secondary">← Back</button>}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card title="Personal Info">
            <div className="p-5 space-y-3">
              {[
                ['ID', p?.patientId], 
                ['Name', p?.fullname], 
                ['Age', p?.age + ' yrs'], 
                ['Gender', p?.gender], 
                ['Blood Group', p?.bloodGroup], 
                ['Contact', p?.phone]
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-50 dark:border-slate-700/30 pb-2 last:border-0">
                  <span className="text-sm text-slate-400">{k}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Admission Info">
            <div className="p-5 space-y-3">
              {[
                ['Room', p?.selectedRoom || "N/A"], 
                ['Doctor', p?.selectedDoctor || "N/A"], 
                ['Diagnosis', p?.chiefComplaint], 
                ['Status', p?.status]
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-50 dark:border-slate-700/30 pb-2 last:border-0">
                  <span className="text-sm text-slate-400">{k}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Patients" subtitle="All registered patients" />
      <Card>
        <Table headers={['Patient ID', 'Name', 'Room', 'Doctor', 'Status', '']}>
          {patients?.map(p => (
            <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer" onClick={() => setSelected(p._id)}>
              <td className="table-cell font-mono text-xs text-slate-500">{p.patientId}</td>
              <td className="table-cell font-semibold">{p.fullname}</td>
              <td className="table-cell">{p.selectedRoom || "TBD"}</td>
              <td className="table-cell text-slate-500">{p.selectedDoctor || "TBD"}</td>
              <td className="table-cell">
                <Badge variant={p.status === 'approved' ? 'green' : 'yellow'}>{p.status}</Badge>
              </td>
              <td className="table-cell"><button className="text-blue-500 text-sm font-semibold">View →</button></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function VitalsEntry() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [hr, setHr] = useState("");
  const [bp, setBp] = useState("");
  const [temp, setTemp] = useState("");
  const [spo2, setSpo2] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [needsMore, setNeedsMore] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    // Fetch active patients from admission form
    fetch(`${BASE}/api/admission-form`)
      .then((res) => res.json())
      .then((data) => {
        setPatients(data || []);
        if (data && data.length > 0) {
          setSelectedPatientId(data[0].patientId);
          setSelectedPatientName(data[0].fullname);
        }
      })
      .catch((err) => console.error("Error fetching patients list:", err));

    // Fetch vital entry logs
    loadRecords();

    // Set defaults
    const now = new Date();
    setTime(now.toTimeString().slice(0, 5));
    setDate(now.toISOString().split("T")[0]);
  }, []);

  const loadRecords = () => {
    fetch(`${BASE}/api/ai/records`)
      .then((res) => res.json())
      .then((data) => {
        setRecords(data || []);
      })
      .catch((err) => console.error("Error loading records:", err));
  };

  const handlePatientChange = (e) => {
    const pId = e.target.value;
    setSelectedPatientId(pId);
    const p = patients.find((pat) => pat.patientId === pId);
    if (p) {
      setSelectedPatientName(p.fullname);
    }
  };

  const checkStatus = (val, min, max) => {
    const num = parseFloat(val);
    if (isNaN(num)) return null;
    if (num >= min && num <= max) {
      return { text: "Normal", color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30" };
    } else if (num < min * 0.9 || num > max * 1.1) {
      return { text: "Critical", color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30" };
    } else {
      return { text: "Warning", color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30" };
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!hr || !bp || !temp || !spo2 || !selectedPatientId) {
      alert("Please fill in all vital fields and select a patient.");
      return;
    }

    setLoading(true);
    setNeedsMore("");

    try {
      const res = await fetch(`${BASE}/api/ai/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          HR: parseFloat(hr),
          BP: bp,
          Temp: parseFloat(temp),
          SpO2: parseFloat(spo2),
          patientName: selectedPatientName,
          patientId: selectedPatientId,
          time,
          date,
        }),
      });

      const data = await res.json();

      if (data.message) {
        setNeedsMore(data.message);
        setPrediction(null);
      } else if (data.result) {
        setPrediction(data.result);
        setNeedsMore("");
      }

      // Reset vital inputs
      setHr("");
      setBp("");
      setTemp("");
      setSpo2("");

      // Trigger Toast
      setToast(true);
      setTimeout(() => setToast(false), 3000);

      // Refresh records log
      loadRecords();
    } catch (err) {
      console.error(err);
      setNeedsMore("Could not connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Vitals Entry & AI Sepsis Prediction" subtitle="Enter patient vitals to calculate sepsis risk score using LSTM ML model" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <Card title="Record Patient Vitals">
            <form onSubmit={handlePredict} className="p-5 space-y-5">
              
              {/* Patient Info selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Patient Name</label>
                  <Select value={selectedPatientId} onChange={handlePatientChange} required>
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p.patientId} value={p.patientId}>
                        {p.fullname}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="form-label">Patient ID</label>
                  <div className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-mono select-none">
                    {selectedPatientId || "Select a patient"}
                  </div>
                </div>
              </div>

              {/* Vitals grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Heart Rate */}
                <div>
                  <label className="form-label">Heart Rate (bpm)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="e.g. 72"
                      value={hr}
                      onChange={(e) => setHr(e.target.value)}
                      required
                    />
                    {hr && (() => {
                      const badge = checkStatus(hr, 60, 100);
                      return badge ? (
                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded-lg border ${badge.color}`}>
                          {badge.text}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* Blood Pressure */}
                <div>
                  <label className="form-label">Blood Pressure (Systolic/Diastolic)</label>
                  <Input
                    type="text"
                    placeholder="e.g. 120/80"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    required
                  />
                </div>

                {/* Temperature */}
                <div>
                  <label className="form-label">Temperature (°F)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 98.6"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      required
                    />
                    {temp && (() => {
                      const badge = checkStatus(temp, 97, 99.5);
                      return badge ? (
                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded-lg border ${badge.color}`}>
                          {badge.text}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* SpO2 */}
                <div>
                  <label className="form-label">SpO2 (%)</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="e.g. 98"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      required
                    />
                    {spo2 && (() => {
                      const badge = checkStatus(spo2, 95, 100);
                      return badge ? (
                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded-lg border ${badge.color}`}>
                          {badge.text}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="form-label">Time</label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="form-label">Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                <Activity size={16} />
                {loading ? "Calculating..." : "Predict & Save Vitals"}
              </button>

            </form>
          </Card>
        </div>

        {/* Right Output Panels (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Prediction Result Card */}
          {prediction && (
            <Card title="AI Sepsis Risk Assessment">
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-5">
                  {/* Risk percentage circle */}
                  <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 shrink-0 font-display ${
                    prediction.status === "Normal" ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" :
                    prediction.status === "Warning" ? "border-amber-500 text-amber-600 dark:text-amber-400" :
                    "border-rose-500 text-rose-600 dark:text-rose-400"
                  }`}>
                    <span className="text-xl font-bold">{prediction.risk}%</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Risk</span>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${
                      prediction.status === "Normal" ? "text-emerald-500" :
                      prediction.status === "Warning" ? "text-amber-500" :
                      "text-rose-500"
                    }`}>{prediction.status}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Calculated from sequence history</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full">
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-750 ${
                        prediction.status === "Normal" ? "bg-emerald-500" :
                        prediction.status === "Warning" ? "bg-amber-500" :
                        "bg-rose-500"
                      }`}
                      style={{ width: `${prediction.risk}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>0%</span><span>50%</span><span>100%</span>
                  </div>
                </div>

                {/* Doctor alert message */}
                {prediction.risk >= 80 && (
                  <div className="p-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    Critical: Doctor alerted via Twilio SMS!
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Sequence padding warnings */}
          {needsMore && (
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-sm text-center font-medium flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              {needsMore} before first ML prediction
            </div>
          )}

          {/* Prompt/Info when no entry */}
          {!prediction && !needsMore && (
            <Card title="Prediction Status">
              <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Submit patient vitals to generate a real-time risk classification.
              </div>
            </Card>
          )}

        </div>

      </div>

      {/* Vitals Log list (below the grids) */}
      <div className="mt-8">
        <Card title="Recent Vitals Log Entries">
          <Table headers={["Patient Name", "Heart Rate", "Blood Pressure", "Temp", "SpO2", "Time", "Date", "Sepsis Risk"]}>
            {records.map((r) => {
              const spo2Color = r.SpO2 >= 95 ? "text-emerald-500" : r.SpO2 >= 90 ? "text-amber-500" : "text-rose-500";
              const riskColor = r.status === "Normal" ? "badge-green" : r.status === "Warning" ? "badge-yellow" : "badge-red";
              return (
                <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="table-cell font-semibold text-slate-800 dark:text-slate-200">{r.patientName}</td>
                  <td className="table-cell font-mono text-xs text-slate-600 dark:text-slate-300">{r.HR} bpm</td>
                  <td className="table-cell font-mono text-xs text-slate-600 dark:text-slate-300">{r.BP}</td>
                  <td className="table-cell font-mono text-xs text-slate-600 dark:text-slate-300">{r.Temp} °F</td>
                  <td className={`table-cell font-mono text-xs font-semibold ${spo2Color}`}>{r.SpO2}%</td>
                  <td className="table-cell font-mono text-xs text-slate-500">{r.time}</td>
                  <td className="table-cell font-mono text-xs text-slate-500">{r.date}</td>
                  <td className="table-cell">
                    {r.risk !== undefined ? (
                      <span className={`badge ${riskColor} text-xs font-bold font-mono`}>
                        {r.risk}% ({r.status})
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">Accumulating</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {records.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-400 text-sm">
                  No vitals entries recorded yet.
                </td>
              </tr>
            )}
          </Table>
        </Card>
      </div>

      {/* Floating success Toast */}
      <div
        className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500 text-white text-sm font-semibold shadow-xl transition-all duration-300 pointer-events-none ${
          toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
        Vitals recorded successfully!
      </div>
    </div>
  );
}

export function MedicationEntry() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/medication/all`)
      .then(res => res.json())
      .then(setMeds);
  }, []);

  return (
    <div>
      <SectionHeader title="Medication Log" />
      <Card>
        <Table headers={['Patient ID', 'Medicine', 'Dosage', 'Status']}>
          {meds?.map(m => (
            <tr key={m._id}>
              <td className="table-cell font-mono text-xs">{m.patientId}</td>
              <td className="table-cell text-sm">{m.medicineName}</td>
              <td className="table-cell font-mono text-xs">{m.dosage}</td>
              <td className="table-cell"><Badge variant={m.status === 'Given' ? 'green' : 'yellow'}>{m.status}</Badge></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function NurseTasks() {
  return (
    <div>
      <SectionHeader title="My Tasks" />
      <Card>
        <div className="p-8 text-center text-slate-500">
          Task scheduler is synced with Dr. rounds. Check back at 12:00 PM.
        </div>
      </Card>
    </div>
  );
}

