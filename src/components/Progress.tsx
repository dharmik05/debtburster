import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import { DashboardOverview, DebtProps } from "@/types/interface";



const Progress: React.FC<DashboardOverview> = ({ debtBalanceHistory }) => {

    console.log("Progress component props:", debtBalanceHistory);

    console.log("Rendering Progress component");

    const progressChartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    const data = debtBalanceHistory;

    const xValues = data.filter((_, index) => index % 2 === 0).map(item => item.date);
    const yValues = data.filter((_, index) => index % 2 === 0).map(item => item.remainingDebt);

    useEffect(() => {
        if (progressChartRef.current) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            chartInstanceRef.current = new Chart(progressChartRef.current, {
                type: "line",
                data: {
                labels: xValues,
                datasets: [{
                fill: false,
                tension: 0,
                backgroundColor: "white",
                borderColor: "rgba(75,192,192,1)",
                data: yValues
                }]
            },
            options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            min: Math.min(...yValues)*0.8,
                            max: Math.max(...yValues)*1.2,
                            ticks: {
                                stepSize: 4
                            }
                        },
                        x: {
                            type: 'time'
                        }
                    }
            }
            });
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [xValues, yValues]);

    return (
        <div className="progress-container w-full h-96 p-4 bg-white rounded-lg shadow-md flex items-center justify-center">
            <canvas id="myChart" ref={progressChartRef} className="line-chart"></canvas>
        </div>
    );
};

export default Progress;
