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
                      fillStyle: Array.isArray(datasets[0].backgroundColor) ? datasets[0].backgroundColor[i] :  datasets[0].backgroundColor,
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
                backgroundColor: [
                  "rgba(54,162,235,255)",
                  "rgba(255,99,132,255)",
                  "rgba(75,192,192,255)",
                  "rgba(255,159,64,255)",
                  "rgba(153,102,255,255)",
                  "rgba(255,205,86,255)",
                  "rgba(201,203,207,255)"
                ]
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
