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
      const chart = new Chart(
        ref.current,
        {
          type: "pie",
          options: {
            responsive: true,
            maintainAspectRatio: true,
            layout: {
              padding: 50,
            },
            plugins: {
              legend:{
                position: "bottom",
                align:"start",
                labels: {
                  generateLabels: (chart) => {
                    const datasets = chart.data.datasets[0];
                    console.log(chart.data.datasets)
                    return datasets.data.map((data, i) => ({
                      text: `${chart.data.labels !== undefined ? chart.data.labels[i] : ""}: ${data} alumnos`,
                      fillStyle: Array.isArray(datasets.backgroundColor) ? datasets.backgroundColor[i] : "white",
                      datasetIndex: i,
                      lineWidth: 0,
                    }))
              }
            }
          }
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
      return () => {
        chart.destroy();
      };
    }
  }, [ref]);

  return <canvas id="xd" ref={ref} />;
}
