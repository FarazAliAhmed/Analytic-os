'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface TokenChartProps {
    data: {
        timestamp: number;
        price: number;
    }[];
    timeRange: '24h' | '7d' | '30d' | '1y';
}

const TokenChart: React.FC<TokenChartProps> = ({ data, timeRange }) => {
    const formatXAxis = (timestamp: number) => {
        const date = new Date(timestamp);
        switch (timeRange) {
            case '24h':
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            case '7d':
                return date.toLocaleDateString([], { weekday: 'short' });
            case '30d':
                return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
            case '1y':
                return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
            default:
                return date.toLocaleDateString();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatXAxis}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                            labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                        />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TokenChart; 