import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} - ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "linear-gradient(135deg, #fff4e3 0%, #f9e7ef 45%, #e6dcf8 100%)",
          color: "#3d2350",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: 90, top: 90, width: 220, height: 220, borderRadius: 999, background: "#ffc9a8" }} />
        <div style={{ position: "absolute", right: 250, top: 300, width: 120, height: 120, borderRadius: 999, background: "#b8ead2" }} />
        <div style={{ position: "absolute", right: 120, top: 380, width: 70, height: 70, borderRadius: 999, background: "#c9b6f0" }} />
        <div style={{ fontSize: 34, color: "#6b4f80", display: "flex" }}>{site.studioName}</div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 12, display: "flex" }}>{site.name}</div>
        <div style={{ fontSize: 40, marginTop: 20, maxWidth: 760, color: "#6b4f80", display: "flex" }}>{site.tagline}</div>
      </div>
    ),
    size,
  );
}
