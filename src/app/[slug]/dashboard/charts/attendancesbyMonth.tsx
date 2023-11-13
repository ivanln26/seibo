"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";


type Data = {
  month: number;
  count: number;
};

type CanvasProps = {
  data: Data[];
};

export default function AttendancesByMonth({ data }: CanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      new Chart(
        ref.current,
        {
          type: "line",
          options: {
            responsive: true,
            maintainAspectRatio: true
          },
          data: {
            labels: data.map((row) => {
                const date = new Date(2009, row.month-1, 1);
                return date.toLocaleString('es-ES', { month: 'long' });
            }),
            datasets: [
              {
                label: "Asistencias",
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
