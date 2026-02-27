"use client";
// src/app/page.tsx

import { useState, useEffect, useRef } from "react";
import { cars, Car } from "@/data/cars";
import ParticleBackground from "@/components/ParticleBackground";
import BackgroundOverlay from "@/components/BackgroundOverlay";
import VideoPreview from "@/components/VideoPreview";
import Timeline from "@/components/Timeline";
import styles from "./page.module.css";

export default function Home() {
  const [hoveredCar, setHoveredCar] = useState<Car | null>(null);
  const [mounted, setMounted] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sortedCars = [...cars].sort((a, b) => a.year - b.year);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [mounted]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 380 : -380, behavior: "smooth" });
  };

  return (
    <main className={styles.main}>
      {mounted && <ParticleBackground accentColor={hoveredCar?.accentColor} />}
      <BackgroundOverlay
        videoId={hoveredCar?.videoId ?? null}
        color={hoveredCar?.accentColor ?? "#ff4400"}
      />
      <div className={styles.scanLines} />

      {/* STICKY TIMELINE — siempre visible al hacer scroll */}
      <div className={styles.stickyTimeline}>
        <Timeline cars={sortedCars} hoveredCar={hoveredCar} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.headerTag}>ARCHIVO AUTOMOTOR</span>
            <span className={styles.headerTag}>ARGENTINA</span>
          </div>
          <h1 className={styles.title}>
            <span className={styles.titleLine1}>HISTORIA DEL</span>
            <span className={styles.titleLine2}>AUTOMOTOR</span>
          </h1>
          <p className={styles.subtitle}>
            Los autos que marcaron una era — sus historias en video
          </p>
        </header>

        {/* Spacer para que el header no quede tapado por el sticky */}
        <div style={{ height: "100px" }} />

        {/* Horizontal scroll carousel */}
        <div className={styles.carouselWrap}>
          {/* Flecha izquierda */}
          <button
            className={`${styles.arrow} ${styles.arrowLeft} ${canScrollLeft ? styles.arrowVisible : ""}`}
            onClick={() => scroll("left")}
            aria-label="Anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Cards en fila horizontal */}
          <div
            ref={scrollRef}
            className={styles.carousel}
            onMouseLeave={() => setHoveredCar(null)}
          >
            {sortedCars.map((car, i) => (
              <VideoPreview
                key={car.id}
                car={car}
                index={i}
                isHovered={hoveredCar?.id === car.id}
                onHover={setHoveredCar}
              />
            ))}
          </div>

          {/* Flecha derecha */}
          <button
            className={`${styles.arrow} ${styles.arrowRight} ${canScrollRight ? styles.arrowVisible : ""}`}
            onClick={() => scroll("right")}
            aria-label="Siguiente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Fade gradients en los bordes */}
          {canScrollLeft && <div className={`${styles.fadeEdge} ${styles.fadeLeft}`} />}
          {canScrollRight && <div className={`${styles.fadeEdge} ${styles.fadeRight}`} />}
        </div>

        {/* Hover state car name big overlay */}
        {hoveredCar && (
          <div className={styles.bigName} key={hoveredCar.id}>
            <span>{hoveredCar.name.toUpperCase()}</span>
          </div>
        )}

        <footer className={styles.footer}>
          <span>HACÉ HOVER PARA EXPLORAR — CLICK PARA VER EN YOUTUBE</span>
        </footer>
      </div>
    </main>
  );
}