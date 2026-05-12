import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "LinkedIn Audit";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "#0E0B08",
          color: "#F5EFE6",
          fontFamily: "ui-sans-serif, system-ui",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1, maxWidth: 980, lineHeight: 1.05 }}>
          {`Твой LinkedIn кричит 'иммигрант'.`}
        </div>
        <div style={{ marginTop: 18, fontSize: 28, color: "#A39588", maxWidth: 980, lineHeight: 1.2 }}>
          Западные рекрутеры это видят за 3 секунды и скроллят дальше.
        </div>
        <div style={{ marginTop: 36, fontSize: 22, color: "#E8B14B" }}>Бесплатный AI-аудит · US/EU</div>
      </div>
    ),
    { ...size },
  );
}
