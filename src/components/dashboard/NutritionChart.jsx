import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const NutritionChart = ({ data, height = 200 }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (!chartRef.current || !data) return;

        const ctx = chartRef.current.getContext('2d');
        
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.days,
                datasets: [
                    {
                        label: 'Calories',
                        data: data.calories,
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        borderColor: 'rgba(34, 197, 94, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Protein (g)',
                        data: data.protein,
                        backgroundColor: 'rgba(59, 130, 246, 0.0)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        tension: 0.3
                    },
                    {
                        label: 'Carbs (g)',
                        data: data.carbs,
                        backgroundColor: 'rgba(249, 115, 22, 0.0)',
                        borderColor: 'rgba(249, 115, 22, 1)',
                        borderWidth: 2,
                        tension: 0.3
                    },
                    {
                        label: 'Fats (g)',
                        data: data.fats,
                        backgroundColor: 'rgba(236, 72, 153, 0.0)',
                        borderColor: 'rgba(236, 72, 153, 1)',
                        borderWidth: 2,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Weekly Nutrition Summary',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return (
        <div style={{ height: `${height}px` }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default NutritionChart; 