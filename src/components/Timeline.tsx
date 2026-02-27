"use client";
// src/components/Timeline.tsx

import { Car } from "@/data/cars";
import styles from "./Timeline.module.css";

interface TimelineProps {
  cars: Car[];
  hoveredCar: Car | null;
}

export default function Timeline({ cars, hoveredCar }: TimelineProps) {
  const sorted = [...cars].sort((a, b) => a.year - b.year);
  const minYear = Math.min(...cars.map((c) => c.year)) - 3;
  const maxYear = Math.max(...cars.map((c) => c.year)) + 8;

  const getPosition = (year: number) =>
    ((year - minYear) / (maxYear - minYear)) * 100;

  // Assign a level (0, 1, 2, 3...) above or below the line.
  // We track the rightmost x used at each level to avoid overlap.
  // Even levels go above, odd levels go below.
  const LABEL_WIDTH_PERCENT = 7; // approximate label width in % of timeline
  const levelRightEdge: number[] = [];
  const assignments: Record<string, { level: number; side: "above" | "below" }> = {};

  sorted.forEach((car) => {
    const pos = getPosition(car.year);
    // Try levels 0, 1, 2, 3... find first one where this label fits
    let chosenLevel = -1;
    for (let lvl = 0; lvl < 8; lvl++) {
      const right = levelRightEdge[lvl] ?? -99;
      if (pos - right >= LABEL_WIDTH_PERCENT) {
        chosenLevel = lvl;
        break;
      }
    }
    if (chosenLevel === -1) chosenLevel = 0; // fallback
    levelRightEdge[chosenLevel] = pos;
    assignments[car.id] = {
      level: Math.floor(chosenLevel / 2),
      side: chosenLevel % 2 === 0 ? "above" : "below",
    };
  });

  // How tall each level step is in px
  const LEVEL_HEIGHT = 22;
  const LINE_Y = 110; // px from top where the line sits
  const TOTAL_HEIGHT = LINE_Y + 4 * LEVEL_HEIGHT + 20;

  return (
    <div className={styles.timelineWrap} style={{ height: TOTAL_HEIGHT }}>
      <div className={styles.line} style={{ top: LINE_Y }} />

      {sorted.map((car) => {
        const isHovered = hoveredCar?.id === car.id;
        const pos = getPosition(car.year);
        const { level, side } = assignments[car.id];
        const offset = (level + 1) * LEVEL_HEIGHT; // distance from line to label

        // Tick height = offset
        const tickHeight = offset;

        return (
          <div
            key={car.id}
            className={`${styles.marker} ${isHovered ? styles.active : ""}`}
            style={{
              left: `${pos}%`,
              top: side === "above" ? LINE_Y - offset - 14 : LINE_Y + 3,
              "--accent": car.accentColor,
            } as React.CSSProperties}
          >
            {side === "above" ? (
              <>
                <div className={styles.label}>
                  <span className={styles.year}>{car.year}</span>
                  <span className={styles.name}>{car.name}</span>
                </div>
                <div className={styles.tick} style={{ height: tickHeight }} />
                <div className={styles.dot} />
              </>
            ) : (
              <>
                <div className={styles.dot} />
                <div className={styles.tick} style={{ height: tickHeight }} />
                <div className={styles.label}>
                  <span className={styles.year}>{car.year}</span>
                  <span className={styles.name}>{car.name}</span>
                </div>
              </>
            )}
          </div>
        );
      })}

      <div className={styles.startEnd} style={{ top: LINE_Y + 8, left: 0 }}>{minYear}</div>
      <div className={styles.startEnd} style={{ top: LINE_Y + 8, right: 0 }}>{maxYear}</div>
    </div>
  );
}