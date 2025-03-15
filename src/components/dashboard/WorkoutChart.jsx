import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const WorkoutChart = ({ data, height = 200 }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (!chartRef.current || !data) return;

        const ctx = chartRef.current.getContext('2d');
        
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.days,
                datasets: [
                    {
                        label: 'Workouts (minutes)',
                        data: data.durations,
                        backgroundColor: 'rgba(34, 197, 94, 0.6)',
                        borderColor: 'rgba(34, 197, 94, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Calories Burned',
                        data: data.calories,
                        backgroundColor: 'rgba(99, 102, 241, 0.6)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Weekly Workout Summary',
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

export default WorkoutChart; 