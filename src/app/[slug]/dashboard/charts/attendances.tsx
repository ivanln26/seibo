"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

type Data = {
  grade: string;
  count: number;
  isPresent: boolean;
};

type CanvasProps = {
  data: Data[];
};

export default function Attendances({ data }: CanvasProps) {
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
          },

          data: {
            labels: data.filter((a) => a.isPresent === true).map((row) =>
              row.grade
            ),
            datasets: [
              {
                label: "Asistencias por curso",
                data: data.filter((a) => a.isPresent === true).map((row) =>
                  row.count
                ),
                backgroundColor: "#9BD0F5",
              },
              {
                label: "Inasistencias por curso",
                data: data.filter((a) => a.isPresent === false).map((row) =>
                  row.count
                ),
              },
            ],
          },
        },
      );
    }
  }, [ref]);

  return <canvas ref={ref} />;
}
