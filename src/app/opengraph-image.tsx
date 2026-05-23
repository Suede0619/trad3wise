import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Trad3wise — Filings in. Signals out.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #07090d 0%, #0d1b14 100%)",
          color: "#eef2f6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#2bd486" }}>
          <div style={{ fontSize: 40, fontWeight: 700 }}>◈ Trad3wise</div>
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 24, lineHeight: 1.05 }}>
          Filings in. Signals out.
        </div>
        <div style={{ fontSize: 30, color: "#8a94a6", marginTop: 24, maxWidth: 900 }}>
          The next-generation financial screener built on SEC filings.
        </div>
      </div>
    ),
    { ...size },
  );
}
