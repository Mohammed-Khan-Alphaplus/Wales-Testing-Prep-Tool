import { useState, useCallback, useMemo } from "react";

const SUBJECTS = [
  "English Reading",
  "Welsh Reading",
  "[Eng] Proc Numeracy",
  "[Wel] Proc Numeracy",
  "[Eng] Num Reasoning",
  "[Wel] Num Reasoning",
];

const TYPES = ["Standard", "Modified", "Braille"];

const BAND_MAP = {
  Y2: "LP", Y3: "LP",
  Y4: "UP", Y5: "UP", Y6: "UP",
  Y7: "SE", Y8: "SE", Y9: "SE",
};
const BANDS = ["LP", "UP", "SE"];

const BAND_LABELS = { LP: "Lower Primary (2–3)", UP: "Upper Primary (4–6)", SE: "Secondary (7–9)" };

const LEARNER_BY_YEAR = {
  "2": "Luke Travers", "3": "Pheobe Miles", "4": "Danesh Ebi", "5": "Kasia Ewas",
  "6": "Susie Ching", "7": "Helena Buckley", "8": "Candice Appleby", "9": "Edward Cash",
};

function classifySubject(subject, yearGroup) {
  const s = (subject || "").trim().toLowerCase();
  const yg = (yearGroup || "").trim().toUpperCase();
  const isWelsh = /welsh|cymraeg/i.test(yg) || /wel/i.test(s) || /cymr/i.test(s);

  if (/reading|darllen/i.test(s)) return isWelsh ? "Welsh Reading" : "English Reading";
  if (/proc|gweithdrefnol/i.test(s)) return isWelsh ? "[Wel] Proc Numeracy" : "[Eng] Proc Numeracy";
  if (/reason|rhesymu/i.test(s)) return isWelsh ? "[Wel] Num Reasoning" : "[Eng] Num Reasoning";
  if (/numer/i.test(s) && /proc/i.test(s)) return isWelsh ? "[Wel] Proc Numeracy" : "[Eng] Proc Numeracy";
  if (/numer/i.test(s) && /reason/i.test(s)) return isWelsh ? "[Wel] Num Reasoning" : "[Eng] Num Reasoning";
  return subject;
}

function classifyType(type) {
  const t = (type || "").trim().toLowerCase();
  if (/braille/i.test(t)) return "Braille";
  if (/modif/i.test(t)) return "Modified";
  return "Standard";
}

function getBand(yearGroup) {
  const yg = (yearGroup || "").trim().toUpperCase().replace(/\s/g, "").replace("YEAR", "Y");
  return BAND_MAP[yg] || null;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function runSelection(forms, totalPicks = 32) {
  const grouped = {};
  for (const subj of SUBJECTS) grouped[subj] = [];
  for (const f of forms) {
    if (grouped[f.subject]) grouped[f.subject].push(f);
  }

  const subjectCounts = {};
  for (const s of SUBJECTS) subjectCounts[s] = grouped[s].length;

  // Determine quotas
  const sorted = SUBJECTS.map(s => ({ s, c: subjectCounts[s] })).sort((a, b) => a.c - b.c);
  const base = Math.floor(totalPicks / 6);
  let remainder = totalPicks - base * 6;
  const quota = {};
  for (const { s } of sorted) quota[s] = base;
  for (let i = sorted.length - 1; i >= 0 && remainder > 0; i--) {
    quota[sorted[i].s]++;
    remainder--;
  }

  const typeCounts = { Standard: 0, Modified: 0, Braille: 0 };
  const bandCounts = { LP: 0, UP: 0, SE: 0 };
  const selected = [];

  for (const subj of shuffle(SUBJECTS)) {
    const pool = [...grouped[subj]];
    const combos = {};
    for (const f of pool) {
      const key = `${f.type}|${f.band}`;
      if (!combos[key]) combos[key] = [];
      combos[key].push(f);
    }

    let picks = quota[subj];
    const usedIds = new Set();

    for (let p = 0; p < picks; p++) {
      const available = Object.entries(combos)
        .filter(([, arr]) => arr.some(f => !usedIds.has(f.id)))
        .map(([key]) => key);

      if (available.length === 0) break;

      const totalSoFar = selected.length + 1;
      const idealType = totalSoFar / 3;
      const idealBand = totalSoFar / 3;

      const scored = shuffle(available).map(key => {
        const [type, band] = key.split("|");
        const typeGap = idealType - typeCounts[type];
        const bandGap = idealBand - bandCounts[band];
        return { key, score: typeGap + bandGap };
      });

      scored.sort((a, b) => b.score - a.score);
      const top = scored.slice(0, Math.min(3, scored.length));
      const chosen = top[Math.floor(Math.random() * top.length)];

      const candidates = combos[chosen.key].filter(f => !usedIds.has(f.id));
      const pick = candidates[Math.floor(Math.random() * candidates.length)];

      usedIds.add(pick.id);
      selected.push(pick);
      typeCounts[pick.type]++;
      bandCounts[pick.band]++;
    }
  }

  return { selected, typeCounts, bandCounts };
}

const SAMPLE_CSV = `Subject,Type,Year Group,Form
English Reading,Standard,Y2,ER-S-Y2-001
English Reading,Modified,Y3,ER-M-Y3-002
English Reading,Braille,Y5,ER-B-Y5-003
Welsh Reading,Standard,Y4,WR-S-Y4-001
[Eng] Num Reasoning,Standard,Y7,ENR-S-Y7-F1
[Eng] Num Reasoning,Standard,Y7,ENR-S-Y7-F2`;

export default function AssessmentSelector() {
  const [rawData, setRawData] = useState("");
  const [forms, setForms] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [colMap, setColMap] = useState({ subject: "", type: "", yearGroup: "", form: "" });
  const [headers, setHeaders] = useState([]);
  const [step, setStep] = useState("input"); // input | map | results
  const [totalPicks, setTotalPicks] = useState(32);

  const parseCSV = useCallback((text) => {
    const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) { setError("Need at least a header row and one data row."); return; }

    const sep = lines[0].includes("\t") ? "\t" : ",";
    const hdrs = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ""));
    setHeaders(hdrs);

    // Auto-map columns
    const auto = { subject: "", type: "", yearGroup: "", form: "" };
    for (const h of hdrs) {
      const hl = h.toLowerCase();
      if (/subject|area|discipline/i.test(hl) && !auto.subject) auto.subject = h;
      else if (/type|format|access/i.test(hl) && !auto.type) auto.type = h;
      else if (/year|yr|group|band/i.test(hl) && !auto.yearGroup) auto.yearGroup = h;
      else if (/form|name|id|title|test/i.test(hl) && !auto.form) auto.form = h;
    }
    setColMap(auto);

    const rows = lines.slice(1).map((line, i) => {
      const vals = line.split(sep).map(v => v.trim().replace(/^"|"$/g, ""));
      const row = {};
      hdrs.forEach((h, j) => row[h] = vals[j] || "");
      row._idx = i;
      return row;
    });

    setForms(rows);
    setError("");
    setStep("map");
  }, []);

  const applyMapping = useCallback(() => {
    if (!colMap.subject || !colMap.type || !colMap.yearGroup) {
      setError("Map at least Subject, Type, and Year Group columns.");
      return;
    }
    const mapped = forms.map((r, i) => ({
      id: i,
      rawSubject: r[colMap.subject],
      subject: classifySubject(r[colMap.subject], r[colMap.yearGroup]),
      type: classifyType(r[colMap.type]),
      band: getBand(r[colMap.yearGroup]),
      yearGroup: r[colMap.yearGroup],
      formName: colMap.form ? r[colMap.form] : `Form-${i + 1}`,
      raw: r,
    })).filter(f => f.band && SUBJECTS.includes(f.subject));

    if (mapped.length === 0) {
      setError("No valid forms found after mapping. Check your column assignments.");
      return;
    }
    setForms(mapped);
    setError("");
    setStep("results");
    const res = runSelection(mapped, totalPicks);
    setResult(res);
  }, [forms, colMap, totalPicks]);

  const rerun = useCallback(() => {
    if (forms.length) {
      const res = runSelection(forms, totalPicks);
      setResult(res);
    }
  }, [forms, totalPicks]);

  const exportCSV = useCallback(() => {
    if (!result) return;
    const hdr = "Form,Subject,Type,Year Group,Band";
    const rows = result.selected.map(f =>
      `"${f.formName}","${f.subject}","${f.type}","${f.yearGroup}","${f.band}"`
    );
    const blob = new Blob([hdr + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "selected_assessments.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const exportAAT = useCallback(() => {
    if (!result) return;
    const rows = result.selected.map(f => {
      const yr = (f.yearGroup || "").replace(/\D/g, "");
      const learner = LEARNER_BY_YEAR[yr] || "Unknown Learner";
      let lang = "";
      let aType = "";
      const isReasoning = f.subject.includes("Reasoning");
      const isProc = f.subject.includes("Proc");
      const isWelsh = f.subject.startsWith("[Wel]") || f.subject === "Welsh Reading";

      if (f.subject === "English Reading" || f.subject === "Welsh Reading") {
        aType = f.subject;
        lang = "";
      } else if (isProc) {
        aType = "Numeracy (Procedural)";
        lang = isWelsh ? "Welsh" : "English";
      } else if (isReasoning) {
        aType = "Numeracy (Reasoning)";
        lang = isWelsh ? "Welsh" : "English";
      }

      // Suffix: Reasoning uses ASCII hyphen -, everything else uses en dash –
      if (f.type === "Modified") {
        aType += isReasoning ? " - MLP user" : " \u2013 MLP user";
      } else if (f.type === "Braille") {
        aType += isReasoning ? " - Braille user" : " \u2013 Braille user";
      }

      return `${aType},${lang},${yr},${learner}`;
    });
    const hdr = "Assessment Type,Language,Year Group,Learner Name";
    const blob = new Blob([hdr + "\n" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "aat_schedule.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const reset = () => { setStep("input"); setForms([]); setResult(null); setError(""); setRawData(""); };

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
      background: "var(--bg, #0a0a0f)",
      color: "var(--text, #d4d4d8)",
      minHeight: "100vh",
      padding: "2rem",
      boxSizing: "border-box",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet" />

      <style>{`
        :root {
          --bg: #0a0a0f;
          --surface: #141419;
          --surface2: #1c1c24;
          --border: #2a2a35;
          --text: #d4d4d8;
          --muted: #71717a;
          --accent: #22d3ee;
          --accent2: #a78bfa;
          --accent3: #34d399;
          --warn: #fbbf24;
        }
        @media (prefers-color-scheme: light) {
          :root {
            --bg: #f4f4f5;
            --surface: #ffffff;
            --surface2: #e4e4e7;
            --border: #d4d4d8;
            --text: #18181b;
            --muted: #71717a;
            --accent: #0891b2;
            --accent2: #7c3aed;
            --accent3: #059669;
          }
        }
        * { box-sizing: border-box; }
        textarea, select, input, button { font-family: inherit; }
        textarea {
          width: 100%; min-height: 180px; padding: 1rem;
          background: var(--surface); color: var(--text);
          border: 1px solid var(--border); border-radius: 8px;
          font-size: 13px; resize: vertical; line-height: 1.6;
        }
        textarea:focus { outline: none; border-color: var(--accent); }
        select {
          padding: 6px 10px; background: var(--surface); color: var(--text);
          border: 1px solid var(--border); border-radius: 6px; font-size: 13px;
        }
        input[type="number"] {
          width: 70px; padding: 6px 10px; background: var(--surface);
          color: var(--text); border: 1px solid var(--border);
          border-radius: 6px; font-size: 13px; text-align: center;
        }
        .btn {
          padding: 10px 20px; border: none; border-radius: 6px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-primary { background: var(--accent); color: #000; }
        .btn-primary:hover { filter: brightness(1.15); }
        .btn-ghost {
          background: transparent; color: var(--accent);
          border: 1px solid var(--accent);
        }
        .btn-ghost:hover { background: var(--accent); color: #000; }
        .pill {
          display: inline-block; padding: 3px 10px; border-radius: 99px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
        }
        .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .stat-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 14px; text-align: center;
        }
        .stat-card .val { font-size: 28px; font-weight: 700; }
        .stat-card .lbl { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { text-align: left; padding: 8px 10px; border-bottom: 2px solid var(--border); color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
        td { padding: 8px 10px; border-bottom: 1px solid var(--border); }
        tr:hover td { background: var(--surface2); }
        .err { color: #ef4444; font-size: 13px; margin-top: 8px; }
        .section { margin-bottom: 2rem; }
        h1 { font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 700; margin: 0 0 0.25rem; }
        h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 600; margin: 0 0 1rem; color: var(--accent); }
        .subtitle { color: var(--muted); font-size: 13px; margin-bottom: 2rem; }
      `}</style>

      <h1>Assessment Selector</h1>
      <p className="subtitle">Balanced greedy selection across Subject × Type × Year Band</p>

      {step === "input" && (
        <div className="section">
          <h2>01 — Paste Data</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
            Paste CSV or tab-separated data with headers. Needs columns for Subject, Type, and Year Group at minimum.
          </p>
          <textarea
            value={rawData}
            onChange={e => setRawData(e.target.value)}
            placeholder={`Subject\tType\tYear Group\tForm Name\nEnglish Reading\tStandard\tY2\tER-S-Y2-001\n...`}
          />
          <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btn-primary" onClick={() => parseCSV(rawData)} disabled={!rawData.trim()}>
              Parse Data →
            </button>
            <span style={{ color: "var(--muted)", fontSize: 12 }}>or</span>
            <button className="btn btn-ghost" onClick={() => { setRawData(SAMPLE_CSV); }}>
              Load Sample
            </button>
          </div>
          {error && <p className="err">{error}</p>}
        </div>
      )}

      {step === "map" && (
        <div className="section">
          <h2>02 — Map Columns</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            Found <strong style={{ color: "var(--accent)" }}>{forms.length}</strong> rows and <strong style={{ color: "var(--accent)" }}>{headers.length}</strong> columns. Assign columns below.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px", maxWidth: 500 }}>
            {[
              ["subject", "Subject *"],
              ["type", "Type *"],
              ["yearGroup", "Year Group *"],
              ["form", "Form Name"],
            ].map(([key, label]) => (
              <div key={key}>
                <label style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>
                <select value={colMap[key]} onChange={e => setColMap(p => ({ ...p, [key]: e.target.value }))} style={{ display: "block", width: "100%", marginTop: 4 }}>
                  <option value="">— select —</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <label style={{ fontSize: 12, color: "var(--muted)" }}>Total picks:</label>
            <input type="number" value={totalPicks} min={1} max={forms.length} onChange={e => setTotalPicks(Math.max(1, parseInt(e.target.value) || 1))} />
            <button className="btn btn-primary" onClick={applyMapping}>Run Selection →</button>
            <button className="btn btn-ghost" onClick={reset}>← Back</button>
          </div>
          {error && <p className="err">{error}</p>}
        </div>
      )}

      {step === "results" && result && (
        <div>
          <h2>03 — Results</h2>

          <div className="section">
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button className="btn btn-primary" onClick={rerun}>↻ Re-roll</button>
              <button className="btn btn-ghost" onClick={exportCSV}>↓ Export CSV</button>
              <button className="btn btn-ghost" onClick={exportAAT}>↓ Export AAT CSV</button>
              <button className="btn btn-ghost" onClick={reset}>← Start Over</button>
            </div>

            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
              Selected <strong style={{ color: "var(--accent)" }}>{result.selected.length}</strong> from {forms.length} eligible forms.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Type Distribution</p>
                <div className="grid3">
                  {TYPES.map(t => (
                    <div key={t} className="stat-card">
                      <div className="val" style={{ color: t === "Standard" ? "var(--accent)" : t === "Modified" ? "var(--accent2)" : "var(--accent3)" }}>{result.typeCounts[t]}</div>
                      <div className="lbl">{t}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Band Distribution</p>
                <div className="grid3">
                  {BANDS.map(b => (
                    <div key={b} className="stat-card">
                      <div className="val" style={{ color: b === "LP" ? "var(--accent)" : b === "UP" ? "var(--accent2)" : "var(--accent3)" }}>{result.bandCounts[b]}</div>
                      <div className="lbl">{BAND_LABELS[b]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 24 }}>
              {SUBJECTS.map(s => {
                const count = result.selected.filter(f => f.subject === s).length;
                return (
                  <div key={s} className="stat-card">
                    <div className="val" style={{ fontSize: 22, color: "var(--text)" }}>{count}</div>
                    <div className="lbl" style={{ fontSize: 10 }}>{s}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="section" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Form</th>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Year</th>
                  <th>Band</th>
                </tr>
              </thead>
              <tbody>
                {result.selected.map((f, i) => (
                  <tr key={f.id}>
                    <td style={{ color: "var(--muted)" }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{f.formName}</td>
                    <td>{f.subject}</td>
                    <td>
                      <span className="pill" style={{
                        background: f.type === "Standard" ? "rgba(34,211,238,0.15)" : f.type === "Modified" ? "rgba(167,139,250,0.15)" : "rgba(52,211,153,0.15)",
                        color: f.type === "Standard" ? "var(--accent)" : f.type === "Modified" ? "var(--accent2)" : "var(--accent3)",
                      }}>{f.type}</span>
                    </td>
                    <td>{f.yearGroup}</td>
                    <td>
                      <span className="pill" style={{
                        background: "var(--surface2)", color: "var(--text)",
                      }}>{f.band}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
