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
                    console.log(datasets[0].backgroundColor)
                    return datasets[0].data.map((data, i) => ({
                      // Label that will be displayed
                      text: `${chart.data.labels !== undefined ? chart.data.labels[i] : ""}: ${data} asistencias`,
                      // Fill style of the legend box
                      fillStyle: Array.isArray(datasets[0].backgroundColor) ? datasets[0].backgroundColor[i] : datasets[0].backgroundColor,
                      // Index of the associated dataset
                      datasetIndex: i,     
                      // Width of box border
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
