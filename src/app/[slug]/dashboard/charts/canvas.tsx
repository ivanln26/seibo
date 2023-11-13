"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

type Data = {
  grade: string;
  count: number;
};

type CanvasProps = {
  data: Data[];
};

export default function Canvas({ data }: CanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      new Chart(
        ref.current,
        {
          type: "pie",
          options: {
            responsive: true,
            maintainAspectRatio: true,
            layout: {
              padding: 50
            }
          },
          data: {
            labels: data.map((row) => row.grade),
            datasets: [
              {
                label: "Alumnos por curso",
                data: data.map((row) => row.count),
              },
            ],
          },
        },
      );
    }
  }, [ref]);

  return (
      <canvas ref={ref} />
  );
}
