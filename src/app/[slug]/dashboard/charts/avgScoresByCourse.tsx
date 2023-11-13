"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";


type Data = {
  subject: string;
  average: number;
};

type CanvasProps = {
  data: Data[];
};

export default function AvgScoresByCourse({ data }: CanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      new Chart(
        ref.current,
        {
          type: "bar",
          options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: "y"
          },
          data: {
            labels: data.map((row) => row.subject),
            datasets: [
              {
                label: "Promedio",
                data: data.map((row) => row.average),
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
