import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { cical } from "./chart.json"
const DemoColumn = () => {
    const config = {
        data: cical,
        isStack: true,
        xField: 'name',
        yField: 'value',
        seriesField: 'type',
        label: {
            // 可手动配置 label 数据标签位置
            position: 'middle',
            // 'top', 'bottom', 'middle'
            // 可配置附加的布局方法
            layout: [
                // 柱形图数据标签位置自动调整
                {
                    type: 'interval-adjust-position',
                }, // 数据标签防遮挡
                {
                    type: 'interval-hide-overlap',
                }, // 数据标签文颜色自动调整
                {
                    type: 'adjust-color',
                },
            ],
        },
    };

    return <Column {...config as any} />;
};

export default DemoColumn
