"use client"

import { useEffect, useState } from "react"

export default function DebugBlobsPage() {
  const [data, setData] = useState<{ count: number; blobs: { url: string; pathname: string }[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/list-blobs")
      .then((res) => res.json())
      .then((d) => {
        console.log("[v0] Blob listing result:", JSON.stringify(d, null, 2))
        setData(d)
      })
      .catch((e) => setError(String(e)))
  }, [])

  if (error) return <pre style={{ color: "red" }}>{error}</pre>
  if (!data) return <p>Loading blobs...</p>

  return (
    <div style={{ padding: 20, fontFamily: "monospace", fontSize: 12, background: "#000", color: "#0f0" }}>
      <h1>Audio Blobs: {data.count}</h1>
      {data.blobs.map((b, i) => (
        <div key={i} style={{ marginBottom: 8, borderBottom: "1px solid #333", paddingBottom: 4 }}>
          <div><strong>{b.pathname}</strong></div>
          <div style={{ color: "#0ff", wordBreak: "break-all" }}>{b.url}</div>
        </div>
      ))}
    </div>
  )
}
