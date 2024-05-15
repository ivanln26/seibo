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
      const chart = new Chart(
        ref.current,
        {
          type: "bar",
          options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: "y",
            plugins: {
              legend:{
                position: "bottom",
                labels: {
                  generateLabels: (chart) => {
                    const datasets = chart.data.datasets;
                    console.log(chart.data.datasets)
                    return datasets[0].data.map((data, i) => ({
                      text: `${chart.data.labels !== undefined ? chart.data.labels[i] : ""}: ${data} asistencias`,
                      fillStyle: datasets[0].backgroundColor?.toString(),
                      datasetIndex: i,
                      lineWidth: 0,
                    }))
              }
            }
          }
        }
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
      return () => {
        chart.destroy();
      };
    }
  }, [ref]);

  return <canvas ref={ref} />;
}
