import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// The picture shown when a squaredrum.com link is shared: the home hero in miniature.
export const alt = "SQUAREDRUM — Music Without Borders";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [anton, portrait, logo] = await Promise.all([
    readFile(join(process.cwd(), "assets/Anton-Regular.ttf")),
    // Baseline JPEG: the renderer rejects progressive ones like the roster photos.
    readFile(join(process.cwd(), "assets/og-portrait.jpg"), "base64"),
    readFile(join(process.cwd(), "assets/og-logo.png"), "base64"),
  ]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#FFFFFF", overflow: "hidden", fontFamily: "Anton" }}>
        {/* the dark side, cut on the drumstick's diagonal */}
        <div style={{ position: "absolute", top: -60, bottom: -60, left: 640, width: 800, background: "#0B0B0C", transform: "skewX(-11deg)", display: "flex" }} />
        <div style={{ position: "absolute", top: -60, bottom: -60, left: 638, width: 4, background: "#D4A24C", transform: "skewX(-11deg)", display: "flex" }} />
        <img src={`data:image/jpeg;base64,${portrait}`} width={392} height={490} style={{ position: "absolute", left: 404, bottom: 0, objectFit: "cover" }} alt="" />
        <img src={`data:image/png;base64,${logo}`} height={56} width={273} style={{ position: "absolute", left: 56, top: 50 }} alt="" />
        <div style={{ position: "absolute", left: 56, top: 190, fontSize: 150, lineHeight: 0.9, color: "#0B0B0C", display: "flex" }}>MUSIC</div>
        <div style={{ position: "absolute", right: 56, top: 300, fontSize: 112, lineHeight: 0.92, color: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <span>WITHOUT</span>
          <span>BORDERS</span>
        </div>
        <div style={{ position: "absolute", left: 56, bottom: 52, fontSize: 30, color: "#886221", display: "flex", letterSpacing: 2 }}>18 IMPRINTS · LIVE 24/7</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Anton", data: anton, style: "normal", weight: 400 }] },
  );
}
