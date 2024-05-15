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
      const chart = new Chart(
        ref.current,
        {
          type: "line",
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend:{
                position: "bottom",
                onClick: () => {},
                labels: {
                  generateLabels: (chart) => {
                    const datasets = chart.data.datasets;
                    console.log(chart.data.datasets)
                    return datasets[0].data.map((data, i) => ({
                      text: `${chart.data.labels !== undefined ? chart.data.labels[i] : ""}: ${data} asistencias`,
                      fillStyle: datasets[0].backgroundColor !== undefined ? datasets[0].backgroundColor : "white",
                      datasetIndex: i,
                      lineWidth: 0,
                    }))
              }
            }
          }
        }
          },
          data: {
            labels: data.map((row) => {
              const date = new Date(2009, row.month - 1, 1);
              return date.toLocaleString("es-ES", { month: "long" });
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
      return () => {
        chart.destroy();
      };
    }
  }, [ref]);

  return <canvas ref={ref} />;
}
