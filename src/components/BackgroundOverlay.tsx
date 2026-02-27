"use client";
// src/components/BackgroundOverlay.tsx
import { useEffect, useState } from "react";

interface BackgroundOverlayProps {
  videoId: string | null;
  color: string;
}

export default function BackgroundOverlay({ videoId, color }: BackgroundOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (videoId) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [videoId]);

  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1)",
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Blurred background thumbnail */}
      {thumbnailUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${thumbnailUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(60px) saturate(0.3)",
            transform: "scale(1.2)",
            opacity: 0.25,
          }}
        />
      )}
      {/* Dark vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(8,8,8,0.85) 70%),
            linear-gradient(to bottom, rgba(8,8,8,0.6) 0%, transparent 30%, transparent 70%, rgba(8,8,8,0.9) 100%)
          `,
        }}
      />
      {/* Color accent tint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 100%, ${color}15 0%, transparent 60%)`,
          transition: "background 0.6s ease",
        }}
      />
    </div>
  );
}
