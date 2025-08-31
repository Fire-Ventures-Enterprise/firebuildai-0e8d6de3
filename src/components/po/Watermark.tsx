import React from "react";

export function Watermark({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      style={{ zIndex: 0 }}
    >
      <div
        className="font-black tracking-widest"
        style={{
          transform: "rotate(-24deg)",
          fontSize: "120px",
          opacity: 0.08,
          lineHeight: 1,
          whiteSpace: "pre-wrap",
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </div>
  );
}