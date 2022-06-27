/**
 * @author zyc
 * @copyright © 2022
 * @description 驾驶舱-报表
 */

import useRequest from '@ahooksjs/use-request';
import { Select, Table } from 'antd';
import * as echarts from 'echarts';
import React, { createRef, useEffect, useState } from 'react'
import RequestUtil from '../../utils/RequestUtil';
import styles from './Statements.module.less';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export default function Statements(): React.ReactNode {
    const halfYear = (new Date().getMonth() > 6) ? `${new Date().getFullYear()}07-${new Date().getFullYear()}12` : `${new Date().getFullYear()}01-${new Date().getFullYear()}06`;
    const [nowDate, setNowDate] = useState(halfYear);

    useEffect(() => {
        initCharts();
        setNowDate(nowDate);
    })

    const columns = [
        {
            key: 'productType',
            title: '产品类型',
            width: 80,
            dataIndex: 'productType'
        },
        {
            key: 'angleSteel',
            title: '角钢塔',
            width: 50,
            dataIndex: 'angleSteel',
            render: (_: number): React.ReactNode => (
                <span>{_ === 0 ? _ : _ > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'steelTubePole',
            title: '钢管杆',
            width: 50,
            dataIndex: 'steelTubePole',
            render: (_: number): React.ReactNode => (
                <span>{_ === 0 ? _ : _ > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'fourPipe',
            title: '四管塔',
            width: 50,
            dataIndex: 'fourPipe',
            render: (_: number): React.ReactNode => (
                <span>{_ === 0 ? _ : _ > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'architecture',
            title: '架构',
            width: 50,
            dataIndex: 'architecture',
            render: (_: number): React.ReactNode => (
                <span>{_ === 0 ? _ : _ > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'steelStructure',
            title: '钢结构',
            width: 50,
            dataIndex: 'steelStructure',
            render: (_: number): React.ReactNode => (
                <span>{_ === 0 ? _ : _ > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'subtotal',
            title: '小计',
            width: 50,
            dataIndex: 'subtotal'
        }
    ]

    const { data: yearLists } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const now = new Date().getFullYear();
        var startYear = now - 3;//起始年份
        var arr = new Array();
        for (var i = startYear; i <= now; i++) {
            var obj = [
                { "id": i + '01-' + i + '06', "label": i + "上半年" },
                { "id": i + '07-' + i + '12', "label": i + "下半年" }
            ];
            arr.push(...obj);
        }
        resole(arr)
    }), {})

    const { loading, data } = useRequest<any>((date: string) => new Promise(async (resole, reject) => {
        // const value: any = await RequestUtil.get<any>(`/tower-statistics/lofting`, {date: date || nowDate});
        let value = [{
            "date": "202201",
            "val": [{
                "data": ["11.25", "15", "0", "1.10", "11.29"],
                "type": "角钢塔"
            }, {
                "data": ["15.22", "19.6", "0", "0", "11.29"],
                "type": "钢管杆"
            }, {
                "data": ["18.44", "23.85", "0", "0", "11.29"],
                "type": "四管塔"
            }, {
                "data": ["10.22", "0", "0", "0", "11.29"],
                "type": "架构"
            }, {
                "data": ["45.99", "0", "0", "0", "11.29"],
                "type": "钢结构"
            }]
        }, {
            "date": "202202",
            "val": [{
                "data": ["0", "0", "0", "20.98", "8.645"],
                "type": "角钢塔"
            }, {
                "data": ["0", "34.5", "0", "0", "8.645"],
                "type": "钢管杆"
            }, {
                "data": ["0", "89.21", "0", "0", "8.645"],
                "type": "四管塔"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "架构"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "钢结构"
            }]
        }, {
            "date": "202203",
            "val": [{
                "data": ["4", "0", "70", "0", "8.645"],
                "type": "角钢塔"
            }, {
                "data": ["0", "78.1", "0", "0", "8.645"],
                "type": "钢管杆"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "四管塔"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "架构"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "钢结构"
            }]
        }, {
            "date": "202204",
            "val": [{
                "data": ["21", "0", "50", "70", "8.645"],
                "type": "角钢塔"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "钢管杆"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "四管塔"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "架构"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "钢结构"
            }]
        }, {
            "date": "202205",
            "val": [{
                "data": ["1", "0", "32.11", "0", "8.645"],
                "type": "角钢塔"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "钢管杆"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "四管塔"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "架构"
            }, {
                "data": ["0", "0", "0", "0", "8.645"],
                "type": "钢结构"
            }]
        }, {
            "date": "202206",
            "val": [{
                "data": ["123.122", "13.12", "-12.22", "14.89", "1.36"],
                "type": "角钢塔"
            }, {
                "data": ["159.66", "12.98", "-18.98", "11.21", "1.36"],
                "type": "钢管杆"
            }, {
                "data": ["234.24", "12.2", "-13.1", "55.3", "1.36"],
                "type": "四管塔"
            }, {
                "data": ["96.21", "23.44", "-10.66", "11.00", "1.36"],
                "type": "架构"
            }, {
                "data": ["23.99", "8.33", "-10", "0", "1.36"],
                "type": "钢结构"
            }]
        }]
        const tableData = value[value.length - 1]?.val;
        tableData && getTableData(tableData);
        tableData && getCorrectData(tableData);
        const angleSteelData = value.map((res: any) => res.val).map((res: any) => res[0]?.data);
        const steelTubePoleData = value.map((res: any) => res.val).map((res: any) => res[1]?.data);
        const fourPipeData = value.map((res: any) => res.val).map((res: any) => res[2]?.data);
        const architectureData = value.map((res: any) => res.val).map((res: any) => res[3]?.data);
        const steelStructureData = value.map((res: any) => res.val).map((res: any) => res[4]?.data);
        const pureData = value?.map((res: any) => res.val)?.map((item: any) => item?.map((res: any) => res.data));
        const secondData = pureData?.map((items: any) => [
            items?.map((item: any[]) => item[0]),
            items?.map((item: any[]) => item[1]),
            items?.map((item: any[]) => item[2]),
            items?.map((item: any[]) => item[3]),
            items?.map((item: any[]) => item[4])
        ])
        const thirdData = secondData?.map((res: any) => [
            (res[0].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            (res[1].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            (res[2].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            (res[3].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            (res[4].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2)
        ])
        let processedData = {
            dateList: value.map((res: any) => res?.date),
            angleSteel: angleSteelData,
            steelTubePole: steelTubePoleData,
            fourPipe: fourPipeData,
            architecture: architectureData,
            steelStructure: steelStructureData,
            subtotal: thirdData
        };
        resole(processedData)
    }), {})

    const { data: loftingStatisticalAnalysisData, run: getTableData } = useRequest<any>((initialData: any) => new Promise(async (resole, reject) => {
        const subtotal = [
            initialData.map((res: any) => Number(res?.data[1])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            initialData.map((res: any) => Number(res?.data[2])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            initialData.map((res: any) => Number(res?.data[3])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            initialData.map((res: any) => Number(res?.data[4])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0)
        ]
        const newData = [
            {
                productType: '放样件号数（万）',
                angleSteel: initialData[0]?.data[1],
                steelTubePole: initialData[1]?.data[1],
                fourPipe: initialData[2]?.data[1],
                architecture: initialData[3]?.data[1],
                steelStructure: initialData[4]?.data[1],
                subtotal: subtotal[0].toFixed(2)
            },
            {
                productType: '环比%',
                angleSteel: initialData[0]?.data[2],
                steelTubePole: initialData[1]?.data[2],
                fourPipe: initialData[2]?.data[2],
                architecture: initialData[3]?.data[2],
                steelStructure: initialData[4]?.data[2],
                subtotal: subtotal[1].toFixed(2)
            },
            {
                productType: '同比%',
                angleSteel: initialData[0]?.data[3],
                steelTubePole: initialData[1]?.data[3],
                fourPipe: initialData[2]?.data[3],
                architecture: initialData[3]?.data[3],
                steelStructure: initialData[4]?.data[3],
                subtotal: subtotal[2].toFixed(2)
            },
            {
                productType: '定基比%',
                angleSteel: initialData[0]?.data[4],
                steelTubePole: initialData[1]?.data[4],
                fourPipe: initialData[2]?.data[4],
                architecture: initialData[3]?.data[4],
                steelStructure: initialData[4]?.data[4],
                subtotal: subtotal[3].toFixed(2)
            }
        ]
        resole(newData)
    }), { manual: true })

    
    const { data: loftingAccuracyStatisticsData, run: getCorrectData } = useRequest<any>((initialData: any) => new Promise(async (resole, reject) => {
        const subtotal = [
            initialData.map((res: any) => Number(res?.data[0])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            initialData.map((res: any) => Number(res?.data[2])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            initialData.map((res: any) => Number(res?.data[3])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            initialData.map((res: any) => Number(res?.data[4])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0)
        ]
        const newData = [
            {
                productType: '放样正确率（万分比）',
                angleSteel: initialData[0]?.data[0],
                steelTubePole: initialData[1]?.data[0],
                fourPipe: initialData[2]?.data[0],
                architecture: initialData[3]?.data[0],
                steelStructure: initialData[4]?.data[0],
                subtotal: subtotal[0].toFixed(2)
            },
            {
                productType: '环比（万分比）',
                angleSteel: initialData[0]?.data[2],
                steelTubePole: initialData[1]?.data[2],
                fourPipe: initialData[2]?.data[2],
                architecture: initialData[3]?.data[2],
                steelStructure: initialData[4]?.data[2],
                subtotal: subtotal[1].toFixed(2)
            },
            {
                productType: '同比（万分比）',
                angleSteel: initialData[0]?.data[3],
                steelTubePole: initialData[1]?.data[3],
                fourPipe: initialData[2]?.data[3],
                architecture: initialData[3]?.data[3],
                steelStructure: initialData[4]?.data[3],
                subtotal: subtotal[2].toFixed(2)
            },
            {
                productType: '定基比（万分比）',
                angleSteel: initialData[0]?.data[4],
                steelTubePole: initialData[1]?.data[4],
                fourPipe: initialData[2]?.data[4],
                architecture: initialData[3]?.data[4],
                steelStructure: initialData[4]?.data[4],
                subtotal: subtotal[3].toFixed(2)
            }
        ]
        resole(newData)
    }), { manual: true })

    const initCharts = () => {
        (document as HTMLElement | any).getElementById('LoftingStatisticalAnalysis').removeAttribute("_echarts_instance_");
        const myChart = echarts.init((document as HTMLElement | any).getElementById('LoftingStatisticalAnalysis'), 'dark');
        // 绘制图表
        myChart.setOption({
            backgroundColor: '#0B1C3D',
            color: [
                '#2778FF',
                '#80C269',
                '#FFD200',
                '#F45E23',
                '#E5004F'
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    crossStyle: {
                        color: '#999'
                    }
                },
                formatter: (params: any) => {
                    var res = '<div style="padding-bottom: 5px; display: flex; width: 600px"><span style="padding-right: 6px; width: 20%;"><span style="padding-right: 5px">月份</span>' + params[5].axisValue +
                        '</span><span style="padding-right: 6px; width: 20%;">总量' + params[5].data +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(data?.subtotal[params[5].dataIndex][2]) === 0) ? '环比' + data?.subtotal[params[5].dataIndex][2] : (Number(data?.subtotal[params[5].dataIndex][2]) > 0) ? '<span style="color: red">环比增长' + data?.subtotal[params[5].dataIndex][2] + '%</span>' : '<span style="color: green">环比下降' + data?.subtotal[params[5].dataIndex][2] + '%</span>') +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(data?.subtotal[params[5].dataIndex][3]) === 0) ? '同比' + data?.subtotal[params[5].dataIndex][3] : (Number(data?.subtotal[params[5].dataIndex][3]) > 0) ? '<span style="color: red">同比增长' + data?.subtotal[params[5].dataIndex][3] + '%</span>' : '<span style="color: green">同比下降' + data?.subtotal[params[5].dataIndex][3] + '%</span>') +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(data?.subtotal[params[5].dataIndex][4]) === 0) ? '定基比' + data?.subtotal[params[5].dataIndex][4] : (Number(data?.subtotal[params[5].dataIndex][4]) > 0) ? '<span style="color: red">定基比增长' + data?.subtotal[params[5].dataIndex][4] + '%</span>' : '<span style="color: green">定基比下降' + data?.subtotal[params[5].dataIndex][4] + '%</span>') +
                        '</span></div>'
                    for (var i = 0; i < params.length; i++) {
                        const paramsData = i === 0 ? data?.angleSteel : i === 1 ? data?.steelTubePole : i === 2 ? data?.fourPipe : i === 3 ? data?.architecture : data?.steelStructure
                        res += '<div style="padding-bottom: 5px; display: flex; width: 600px;"><span style="display: inline-block; padding: 0 5px;">' +
                            '<i style="display: inline-block; width: 10px; height: 10px; background: ' + params[i].color +
                            ';}"></i></span><span style="padding-right: 6px; width: 20%;">' + params[i].seriesName +
                            '</span><span style="padding-right: 6px; width: 18%;">' + params[i].data +
                            '</span><span style="padding-right: 6px; width: 25%;">' +
                            ((Number(paramsData[params[i].dataIndex][2]) === 0) ? '环比' + paramsData[params[i].dataIndex][2] : (Number(paramsData[params[i].dataIndex][2]) > 0) ? '<span style="color: red">环比增长' + paramsData[params[i].dataIndex][2] + '%</span>' : '<span style="color: green">环比下降' + paramsData[params[i].dataIndex][2] + '%</span>') +
                            '</span><span style="padding-right: 6px; width: 25%;">' +
                            ((Number(paramsData[params[i].dataIndex][3]) === 0) ? '同比' + paramsData[params[i].dataIndex][3] : (Number(paramsData[params[i].dataIndex][3]) > 0) ? '<span style="color: red">同比增长' + paramsData[params[i].dataIndex][3] + '%</span>' : '<span style="color: green">同比下降' + paramsData[params[i].dataIndex][3] + '%</span>') +
                            '</span><span style="padding-right: 6px; width: 25%;">' +
                            ((Number(paramsData[params[i].dataIndex][4]) === 0) ? '定基比' + paramsData[params[i].dataIndex][4] : (Number(paramsData[params[i].dataIndex][4]) > 0) ? '<span style="color: red">定基比增长' + paramsData[params[i].dataIndex][4] + '%</span>' : '<span style="color: green">定基比下降' + paramsData[params[i].dataIndex][4] + '%</span>') +
                            '</span></div>'
                    }
                    return res;
                },
            },
            toolbox: {
                feature: {
                    saveAsImage: { show: true }
                }
            },
            legend: {
                icon: 'rect',
                right: '9%',
                data: ['角钢塔', '钢管塔', '四管塔', '架构', '钢结构'],
                itemWidth: 14
            },
            xAxis: [
                {
                    type: 'category',
                    data: data?.dateList || [],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '角钢塔',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: data?.angleSteel?.map((res: any) => res[1])
                },
                {
                    name: '钢管塔',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: data?.steelTubePole?.map((res: any) => res[1])
                },
                {
                    name: '四管塔',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: data?.fourPipe?.map((res: any) => res[1])
                },
                {
                    name: '架构',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: data?.architecture?.map((res: any) => res[1])
                },
                {
                    name: '钢结构',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: data?.steelStructure?.map((res: any) => res[1])
                },
                {
                    name: '总量',
                    type: 'line',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: data?.subtotal?.map((res: any) => res[1])
                }
            ]
        });
        (document as HTMLElement | any).getElementById('LoftingAccuracyStatistics').removeAttribute("_echarts_instance_");
        const accuracyChart = echarts.init((document as HTMLElement | any).getElementById('LoftingAccuracyStatistics'), 'dark');
        // 绘制图表
        accuracyChart.setOption({
            backgroundColor: '#0B1C3D',
            color: [
                '#2778FF',
                '#80C269',
                '#FFD200',
                '#F45E23',
                '#E5004F'
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    crossStyle: {
                        color: '#999'
                    }
                },
                formatter: (params: any) => {
                    var res = '<div style="padding-bottom: 5px; display: flex; width: 600px"><span style="padding-right: 6px; width: 20%;"><span style="padding-right: 5px">月份</span>' + params[5].axisValue +
                        '</span><span style="padding-right: 6px; width: 20%;">总量' + params[5].data +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(data?.subtotal[params[5].dataIndex][2]) === 0) ? '环比' + data?.subtotal[params[5].dataIndex][2] : (Number(data?.subtotal[params[5].dataIndex][2]) > 0) ? '<span style="color: red">环比增长' + data?.subtotal[params[5].dataIndex][2] + '%</span>' : '<span style="color: green">环比下降' + data?.subtotal[params[5].dataIndex][2] + '%</span>') +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(data?.subtotal[params[5].dataIndex][3]) === 0) ? '同比' + data?.subtotal[params[5].dataIndex][3] : (Number(data?.subtotal[params[5].dataIndex][3]) > 0) ? '<span style="color: red">同比增长' + data?.subtotal[params[5].dataIndex][3] + '%</span>' : '<span style="color: green">同比下降' + data?.subtotal[params[5].dataIndex][3] + '%</span>') +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(data?.subtotal[params[5].dataIndex][4]) === 0) ? '定基比' + data?.subtotal[params[5].dataIndex][4] : (Number(data?.subtotal[params[5].dataIndex][4]) > 0) ? '<span style="color: red">定基比增长' + data?.subtotal[params[5].dataIndex][4] + '%</span>' : '<span style="color: green">定基比下降' + data?.subtotal[params[5].dataIndex][4] + '%</span>') +
                        '</span></div>'
                    for (var i = 0; i < params.length; i++) {
                        const paramsData = i === 0 ? data?.angleSteel : i === 1 ? data?.steelTubePole : i === 2 ? data?.fourPipe : i === 3 ? data?.architecture : data?.steelStructure
                        res += '<div style="padding-bottom: 5px; display: flex; width: 600px;"><span style="display: inline-block; padding: 0 5px;">' +
                            '<i style="display: inline-block; width: 10px; height: 10px; background: ' + params[i].color +
                            ';}"></i></span><span style="padding-right: 6px; width: 20%;">' + params[i].seriesName +
                            '</span><span style="padding-right: 6px; width: 18%;">' + params[i].data +
                            '</span><span style="padding-right: 6px; width: 25%;">' +
                            ((Number(paramsData[params[i].dataIndex][2]) === 0) ? '环比' + paramsData[params[i].dataIndex][2] : (Number(paramsData[params[i].dataIndex][2]) > 0) ? '<span style="color: red">环比增长' + paramsData[params[i].dataIndex][2] + '%</span>' : '<span style="color: green">环比下降' + paramsData[params[i].dataIndex][2] + '%</span>') +
                            '</span><span style="padding-right: 6px; width: 25%;">' +
                            ((Number(paramsData[params[i].dataIndex][3]) === 0) ? '同比' + paramsData[params[i].dataIndex][3] : (Number(paramsData[params[i].dataIndex][3]) > 0) ? '<span style="color: red">同比增长' + paramsData[params[i].dataIndex][3] + '%</span>' : '<span style="color: green">同比下降' + paramsData[params[i].dataIndex][3] + '%</span>') +
                            '</span><span style="padding-right: 6px; width: 25%;">' +
                            ((Number(paramsData[params[i].dataIndex][4]) === 0) ? '定基比' + paramsData[params[i].dataIndex][4] : (Number(paramsData[params[i].dataIndex][4]) > 0) ? '<span style="color: red">定基比增长' + paramsData[params[i].dataIndex][4] + '%</span>' : '<span style="color: green">定基比下降' + paramsData[params[i].dataIndex][4] + '%</span>') +
                            '</span></div>'
                    }
                    return res;
                }
            },
            legend: {
                icon: 'rect',
                right: '9%',
                itemWidth: 14,
                data: ['角钢塔', '钢管塔', '四管塔', '架构', '钢结构']
            },
            toolbox: {
                feature: {
                    saveAsImage: { show: true }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: data?.dateList || [],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '角钢塔',
                    type: 'bar',

                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: data?.angleSteel?.map((res: any) => res[0])
                },
                {
                    name: '钢管塔',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: data?.steelTubePole?.map((res: any) => res[0])
                },
                {
                    name: '四管塔',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: data?.fourPipe?.map((res: any) => res[0])
                },
                {
                    name: '架构',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: data?.architecture?.map((res: any) => res[0])
                },
                {
                    name: '钢结构',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: data?.steelStructure?.map((res: any) => res[0])
                },
                {
                    name: '总量',
                    type: 'line',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: data?.subtotal?.map((res: any) => res[0])
                }
            ]
        });

        (document as HTMLElement | any).getElementById('productionDistributionStatistics').removeAttribute("_echarts_instance_");
        const productionDistributionChart = echarts.init((document as HTMLElement | any).getElementById('productionDistributionStatistics'), 'dark');
        // 绘制图表
        productionDistributionChart.setOption({
            backgroundColor: '#0B1C3D',
            color: [
                '#1C86F1'
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    crossStyle: {
                        color: '#999'
                    }
                },
                formatter: (params: any) => {
                    var res = '<div><p><span style="padding-right: 6px">月份</span>' + params[0].name +
                        '</p><p><span style="padding-right: 6px">总量</span>' + params[0].name +
                        '</p><p><span style="padding-right: 6px">环比增长</span>' + params[0].name +
                        '</p><p><span style="padding-right: 6px">同比下降</span>' + params[0].name +
                        '</p><p><span style="padding-right: 6px">定基比增长</span>' + params[0].name +
                        '</p></div>'
                    return res;
                },
            },
            toolbox: {
                feature: {
                    saveAsImage: { show: true }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['202201', '202202', '202203', '202204', '202205', '202206'],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    type: 'bar',
                    data: [
                        2.0, 4.9, 7.0, 23.2, 25.6, 76.7
                    ]
                },
                {
                    name: '总量',
                    type: 'line',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: [8.0, 12.2, 13.3, 94.5, 56.3, 80.2]
                }
            ]
        });

        (document as HTMLElement | any).getElementById('productionDistribution').removeAttribute("_echarts_instance_");
        const productionDistributionPieChart = echarts.init((document as HTMLElement | any).getElementById('productionDistribution'), 'dark');
        // 绘制图表
        productionDistributionPieChart.setOption({
            backgroundColor: '#0B1C3D',
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                icon: 'rect',
                top: '5%',
                left: 'center',
                itemWidth: 14
            },
            toolbox: {
                feature: {
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '未下达量',
                    type: 'pie',
                    width: "70%",
                    right: 'center',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '24',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 1048, name: '角钢塔' },
                        { value: 735, name: '钢管塔' },
                        { value: 580, name: '四管塔' },
                        { value: 484, name: '架构' },
                        { value: 300, name: '钢结构' }
                    ]
                }
            ]
        });
    }


    return <div className={styles.statement}>
        <div className={styles.header}>
            <div className={styles.headerbg}>
                <span className={styles.headerTitle}>汇金通技术部放样统计数据分析</span>
            </div>
        </div>
        <div className={styles.top}>
            <div className={styles.left}>
                <div>
                    <span className={styles.title}>放样统计分析</span>
                    <Select key={'LoftingStatisticalAnalysis'} className={styles.select} size="small" defaultValue={nowDate} onChange={(e) => {
                        console.log(e)
                    }}>
                        {
                            yearLists && yearLists.map((res: any, index: number) => (
                                <Select.Option key={index} value={res.id}>{res.label}</Select.Option>
                            ))
                        }
                    </Select>
                </div>
                <div id={'LoftingStatisticalAnalysis'} style={{ width: '100%', height: '300px' }} key={'LoftingStatisticalAnalysis'} />
                <Table
                    bordered
                    scroll={{ x: true }}
                    pagination={false}
                    dataSource={loftingStatisticalAnalysisData || []}
                    columns={columns}
                    onRow={() => ({ className: styles.tableRow })} />
            </div>
            <div className={styles.right}>
                <div>
                    <span className={styles.title}>放样正确率统计分析</span>
                    <Select key={'LoftingAccuracyStatistics'} className={styles.select} size="small" defaultValue={nowDate} onChange={(e) => {

                    }}>
                        {
                            yearLists && yearLists.map((res: any, index: number) => (
                                <Select.Option key={index} value={res.id}>{res.label}</Select.Option>
                            ))
                        }
                    </Select>
                </div>
                <div id={'LoftingAccuracyStatistics'} style={{ width: '100%', height: '300px' }} key={'LoftingAccuracyStatistics'} />
                <Table
                    bordered
                    pagination={false}
                    dataSource={loftingAccuracyStatisticsData || []}
                    columns={columns} />
            </div>
        </div>
        <div className={styles.bottom}>

            <div className={styles.left}>
                <div>
                    <span className={styles.title}>生产下达统计分析</span>
                    <Select key={'productionDistributionStatistics'} className={styles.select} size="small" defaultValue={nowDate} onChange={(e) => {

                    }}>
                        {
                            yearLists && yearLists.map((res: any, index: number) => (
                                <Select.Option key={index} value={res.id}>{res.label}</Select.Option>
                            ))
                        }
                    </Select>
                </div>
                <div id={'productionDistributionStatistics'} style={{ width: '100%', height: '400px' }} key={'productionDistributionStatistics'} />
            </div>
            <div className={styles.right}>
                <p className={styles.title}>生产下达统计分析</p>
                <div className={styles.rightContent}>
                    <div style={{ width: "40%" }}>


                        <div id={'productionDistribution'} style={{ width: '100%', height: '400px' }} key={'productionDistribution'} />
                    </div>
                    <div style={{ width: "100%", marginLeft: "2%" }}>
                        <Select key={'productionDistribution'} className={styles.select} size="small" onChange={(e) => {

                        }}>
                            <Select.Option key={0} value={''}>全部</Select.Option>
                            <Select.Option key={1} value={'角钢塔'}>角钢塔</Select.Option>
                            <Select.Option key={2} value={'钢管塔'}>钢管塔</Select.Option>
                            <Select.Option key={3} value={'四管塔'}>四管塔</Select.Option>
                            <Select.Option key={4} value={'架构'}>架构</Select.Option>
                            <Select.Option key={5} value={'钢结构'}>钢结构</Select.Option>
                        </Select>
                        <Table bordered pagination={false} dataSource={[{ index: '111', a: '111' }]} columns={[
                            {
                                key: 'index',
                                title: '序号',
                                width: 50,
                                dataIndex: 'index',
                                render: (_a: any, _b: any, index: number) => { return index + 1 }
                            },
                            {
                                key: 'a',
                                title: '计划号',
                                width: 50,
                                dataIndex: 'a',
                                render: (_a: any, _b: any, index: number) => { return index + 1 }
                            },
                            {
                                key: 'c',
                                title: '项目名称',
                                width: 50,
                                dataIndex: 'c',
                                render: (_a: any, _b: any, index: number) => { return index + 1 }
                            },
                            {
                                key: 'd',
                                title: '下技术总量',
                                width: 50,
                                dataIndex: 'd',
                                render: (_a: any, _b: any, index: number) => { return index + 1 }
                            },
                            {
                                key: 'e',
                                title: '已下达量',
                                width: 50,
                                dataIndex: 'e',
                                render: (_a: any, _b: any, index: number) => { return index + 1 }
                            },
                            {
                                key: 'f',
                                title: '未下达量',
                                width: 50,
                                dataIndex: 'f',
                                render: (_a: any, _b: any, index: number) => { return index + 1 }
                            }
                        ]} />

                    </div>
                </div>
            </div>
        </div>
    </div>
}