"use client";

import { useState } from "react";
import SpawnpointGenerator from "@/components/tools/SpawnpointGenerator";

export function ToolClient({ tool }: { tool: any }) {
  const [values, setValues] = useState<Record<string, string>>({});

  const update = (key: string, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  // 🔥 SPAWNPOINT GENERATOR EINBINDUNG
  if (tool.slug === "spawnpoint-generator") {
    return <SpawnpointGenerator />;
  }

  // 👉 Standard Tools (dein bestehendes System)
  return (
    <div className="stack">
      <section className="card hero-card">
        <h2 className="h2">{tool.name}</h2>
        <p className="muted">{tool.description}</p>
      </section>

      <section className="grid grid-2">
        <div className="card">
          <h3 className="h3">Konfiguration</h3>
          <div className="space" />

          <div className="stack">
            {tool.fields?.map((field: any) => (
              <div key={field.key}>
                <label className="label">{field.label}</label>

                {field.type === "select" ? (
                  <select
                    className="select"
                    value={values[field.key] || ""}
                    onChange={(e) => update(field.key, e.target.value)}
                  >
                    {(field.options || []).map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="input"
                    type={field.type}
                    value={values[field.key] || ""}
                    onChange={(e) => update(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="h3">Output</h3>
          <div className="space" />

          <div className="output">
            {JSON.stringify(values, null, 2)}
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <button
              className="btn btn-primary"
              onClick={() =>
                navigator.clipboard.writeText(
                  JSON.stringify(values, null, 2)
                )
              }
            >
              Kopieren
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setValues({})}
            >
              Zurücksetzen
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}