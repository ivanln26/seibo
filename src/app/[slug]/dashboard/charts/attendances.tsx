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
      const chart = new Chart(
        ref.current,
        {
          type: "bar",
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend:{
                position: "bottom",
                labels: {
                  generateLabels: (chart) => {
                    const datasets = chart.data.datasets;
                    console.log(chart.data.datasets)
                    return datasets[0].data.map((data, i) => ({
                      text: `${chart.data.labels !== undefined ? chart.data.labels[i] : ""}: ${data} asistencias`,
                      fillStyle: Array.isArray(datasets[0].backgroundColor) ? datasets[0].backgroundColor[i] : "white",
                      datasetIndex: i,
                      lineWidth: 0,
                    }))
              }
            }
          }
        }
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
