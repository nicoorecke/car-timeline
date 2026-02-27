"use client";
// src/components/VideoPreview.tsx
// Muestra la miniatura con hover card estilo selector de personaje

import { useState, useEffect, useRef } from "react";
import { Car } from "@/data/cars";
import styles from "./VideoPreview.module.css";

interface VideoPreviewProps {
  car: Car;
  isHovered: boolean;
  onHover: (car: Car | null) => void;
  index: number;
}

interface OEmbedData {
  title: string;
  author_name: string;
  thumbnail_url: string;
}

export default function VideoPreview({ car, isHovered, onHover, index }: VideoPreviewProps) {
  const [oEmbed, setOEmbed] = useState<OEmbedData | null>(null);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const thumbnailUrl = imgError
    ? `https://img.youtube.com/vi/${car.videoId}/hqdefault.jpg`
    : `https://img.youtube.com/vi/${car.videoId}/maxresdefault.jpg`;

  const youtubeUrl = `https://www.youtube.com/watch?v=${car.videoId}`;

  // Fetch oEmbed for title/description from YouTube
  useEffect(() => {
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => setOEmbed(data))
      .catch(() => setOEmbed(null));
  }, [youtubeUrl]);

  const handleClick = () => {
    window.open(youtubeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isHovered ? styles.hovered : ""}`}
      onMouseEnter={() => onHover(car)}
      onMouseLeave={() => onHover(null)}
      onClick={handleClick}
      style={{
        "--accent": car.accentColor,
        "--car-color": car.color,
        "--delay": `${index * 0.15}s`,
      } as React.CSSProperties}
    >
      {/* Year badge */}
      <div className={styles.yearBadge}>{car.year}</div>

      {/* Thumbnail */}
      <div className={styles.thumbnailWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt={car.name}
          className={styles.thumbnail}
          onError={() => setImgError(true)}
        />
        <div className={styles.thumbnailOverlay} />

        {/* Play icon */}
        <div className={styles.playIcon}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Info panel - aparece en hover */}
      <div className={styles.infoPanel}>
        <div className={styles.brand}>{car.brand}</div>
        <div className={styles.carName}>{car.name}</div>

        {/* Specs */}
        <div className={styles.specs}>
          {car.specs.map((s) => (
            <span key={s} className={styles.specTag}>
              {s}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className={styles.description}>{car.description}</p>

        {/* YouTube title */}
        {oEmbed && (
          <div className={styles.ytInfo}>
            <span className={styles.ytIcon}>▶</span>
            <span className={styles.ytTitle}>{oEmbed.title}</span>
          </div>
        )}

        <div className={styles.watchCta}>VER EN YOUTUBE →</div>
      </div>

      {/* Corner decorations */}
      <div className={styles.cornerTL} />
      <div className={styles.cornerBR} />
    </div>
  );
}