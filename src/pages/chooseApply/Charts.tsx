import React from 'react';
import { Radar } from '@ant-design/plots';

const DemoRadar = () => {
    const data = [
        {
            name: '回款金额达标率',
            star: 8371,
            spec: "实际"
        },
        {
            name: '回款金额达标率',
            star: 10371,
            spec: "标准"
        },
        {
            name: '回款客户达标率',
            star: 8371,
            spec: "实际"
        },
        {
            name: '回款客户达标率',
            star: 10371,
            spec: "标准"
        },
        {
            name: '毛利率',
            star: 10371,
            spec: "标准"
        },
        {
            name: '毛利率',
            star: 8371,
            spec: "实际"
        },
        {
            name: '纯利率',
            star: 10371,
            spec: "标准"
        },
        {
            name: '纯利率',
            star: 8371,
            spec: "实际"
        },
        {
            name: '客户投诉率',
            star: 10371,
            spec: "标准"
        },
        {
            name: '客户投诉率',
            star: 8371,
            spec: "实际"
        },
        {
            name: '订单满足率',
            star: 10371,
            spec: "标准"
        },
        {
            name: '订单满足率',
            star: 8371,
            spec: "实际"
        },
        {
            name: '订单执行率',
            star: 10371,
            spec: "标准"
        },
        {
            name: '订单执行率',
            star: 8371,
            spec: "实际"
        },
        {
            name: '准时交货率',
            star: 10371,
            spec: "标准"
        },
        {
            name: '准时交货率',
            star: 8371,
            spec: "实际"
        },
        {
            name: '订单响应周期',
            star: 10371,
            spec: "标准"
        },
        {
            name: '订单响应周期',
            star: 8371,
            spec: "实际"
        },
    ];
    const config = {
        data: data.map((d) => ({ ...d, star: Math.sqrt(d.star) })),
        xField: 'name',
        yField: 'star',
        seriesField: 'spec',
        appendPadding: [0, 10, 0, 10],
        meta: {
            star: {
                alias: 'star 数量',
                min: 0,
                nice: true,
                formatter: (v: any) => Number(v).toFixed(2),
            },
        },
        xAxis: {
            tickLine: null,
        },
        yAxis: {
            label: false,
            grid: {
                alternateColor: 'rgba(0, 0, 0, 0.04)',
            },
        },
        // 开启辅助点
        point: {
            size: 2,
        },
        area: {},
    };
    return <Radar {...config} />;
};

export default DemoRadar
