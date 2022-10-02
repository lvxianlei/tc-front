import React from 'react';
import { Line } from '@ant-design/plots';
import { line } from "./chart.json"
const DemoLine = () => {
    const config = {
        data: line,
        xField: 'year',
        yField: 'gdp',
        seriesField: 'name',
        yAxis: {
            label: {
                formatter: (v: any) => `${(v / 10e8).toFixed(1)}`,
            },
        },
        legend: {
            position: 'top',
        },
        smooth: true,
        // @TODO 后续会换一种动画方式
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
    };

    return <Line {...config as any} />;
};

export default DemoLine
