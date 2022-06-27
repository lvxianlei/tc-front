/**
 * @author zyc
 * @copyright © 2022
 * @description 驾驶舱-报表
 */

import useRequest from '@ahooksjs/use-request';
import { Select, Spin, Table } from 'antd';
import * as echarts from 'echarts';
import React, { useEffect } from 'react'
import RequestUtil from '../../utils/RequestUtil';
import styles from './Statements.module.less';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export default function Statements(): React.ReactNode {
    const halfYear = (new Date().getMonth() > 6) ? `${new Date().getFullYear()}07-${new Date().getFullYear()}12` : `${new Date().getFullYear()}01-${new Date().getFullYear()}06`;
    const issuedHalfYear = (new Date().getMonth() > 6) ?
        `${new Date().getFullYear()}-07,${new Date().getFullYear()}-08,${new Date().getFullYear()}-09,${new Date().getFullYear()}-10,${new Date().getFullYear()}-11,${new Date().getFullYear()}-12` :
        `${new Date().getFullYear()}-01,${new Date().getFullYear()}-02,${new Date().getFullYear()}-03,${new Date().getFullYear()}-04,${new Date().getFullYear()}-05,${new Date().getFullYear()}-06`;

    useEffect(() => {
        initCharts();
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
            render: (_: string): React.ReactNode => (
                <span>{Number(_) === 0 ? Number(_) : Number(_) > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'steelTubePole',
            title: '钢管杆',
            width: 50,
            dataIndex: 'steelTubePole',
            render: (_: string): React.ReactNode => (
                <span>{Number(_) === 0 ? Number(_) : Number(_) > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'fourPipe',
            title: '四管塔',
            width: 50,
            dataIndex: 'fourPipe',
            render: (_: string): React.ReactNode => (
                <span>{Number(_) === 0 ? Number(_) : Number(_) > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'architecture',
            title: '架构',
            width: 50,
            dataIndex: 'architecture',
            render: (_: string): React.ReactNode => (
                <span>{Number(_) === 0 ? Number(_) : Number(_) > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'steelStructure',
            title: '钢结构',
            width: 50,
            dataIndex: 'steelStructure',
            render: (_: string): React.ReactNode => (
                <span>{Number(_) === 0 ? Number(_) : Number(_) > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
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

    const { data: issuedYearLists } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const now = new Date().getFullYear();
        var startYear = now - 3;//起始年份
        var arr = new Array();
        for (var i = startYear; i <= now; i++) {
            var obj = [
                { "id": i + '-01,' + i + '-02,' + i + '-03,' + i + '-04,' + i + '-05,' + i + '-06', "label": i + "上半年" },
                { "id": i + '-07,' + i + '-08,' + i + '-09,' + i + '-10,' + i + '-11,' + i + '-12', "label": i + "下半年" }
            ];
            arr.push(...obj);
        }
        resole(arr)
    }), {})

    const { loading, data, run } = useRequest<any>((date: string) => new Promise(async (resole, reject) => {
        // data数组位表示：
        // 0放样件号数（万）
        // 1环比
        // 2同比
        // 3定基比
        // 4放样正确率（万分比）
        // 5环比（万分比）
        // 6同比（万分比）
        // 7定基比（万分比）
        const value: any = await RequestUtil.get<any>(`/tower-statistics/lofting`, { date: date || halfYear });
        const tableData = value[value.length - 1]?.val;
        tableData && getTableData(tableData);
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
            items?.map((item: any[]) => item[3])
        ])
        const thirdData = secondData?.map((res: any) => [
            (res[0].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            (res[1].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            (res[2].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            (res[3].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2)
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

    
    const { data: accuracyData, run: getAccuracy } = useRequest<any>((date: string) => new Promise(async (resole, reject) => {
        const value: any = await RequestUtil.get<any>(`/tower-statistics/lofting/accuracy`, { date: date || halfYear });
        const tableData = value[value.length - 1]?.val;
        tableData && getCorrectData(tableData);
        const angleSteelData = value.map((res: any) => res.val).map((res: any) => res[0]?.data);
        const steelTubePoleData = value.map((res: any) => res.val).map((res: any) => res[1]?.data);
        const fourPipeData = value.map((res: any) => res.val).map((res: any) => res[2]?.data);
        const architectureData = value.map((res: any) => res.val).map((res: any) => res[3]?.data);
        const steelStructureData = value.map((res: any) => res.val).map((res: any) => res[4]?.data);
        const pureData = value?.map((res: any) => res.val)?.map((item: any) => item?.map((res: any) => res.data));
        const secondData = pureData?.map((items: any) => [
            items?.map((item: any[]) => item[4]),
            items?.map((item: any[]) => item[5]),
            items?.map((item: any[]) => item[6]),
            items?.map((item: any[]) => item[7])
        ])
        const thirdData = secondData?.map((res: any) => [
            (res[0].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            (res[1].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            (res[2].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            (res[3].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2)
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

    const { data: issuedPie } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const value: any = await RequestUtil.get<any>(``);
        const processedData = value.map((res: any) => {
            return {
                value: res.no_iss_weight,
                name: res.product_type_name
            }
        })
        resole(processedData)
    }), {})

    const { data: issuedData, run: getIssuedData } = useRequest<any>((productType: string) => new Promise(async (resole, reject) => {
        const value: any = await RequestUtil.get<any>(``, { productType: productType || '' });
        resole(value)
    }), {})

    const { data: issuedBarData, run: getIssuedBarData } = useRequest<any>((date: string) => new Promise(async (resole, reject) => {
        // const value: any = await RequestUtil.get<any>(``, { date: date || issuedHalfYear });
        const value = [
            {
                "date": "2022-01",
                "totalWeight": "750.56",
                "hb": "-0.36",
                "tb": "-0.6",
                "djb": "-0.36"
            },
            {
                "date": "2022-02",
                "totalWeight": "100.56",
                "hb": "-6",
                "tb": "-0.36",
                "djb": "-0.36"
            },
            {
                "date": "2022-03",
                "totalWeight": "950.56",
                "hb": "-0.36",
                "tb": "-0.36",
                "djb": "-0.36"
            },
            {
                "date": "2022-04",
                "totalWeight": "100.56",
                "hb": "-0.36",
                "tb": "-0.36",
                "djb": "-0.36"
            },
            {
                "date": "2022-05",
                "totalWeight": "10.56",
                "hb": "-0.36",
                "tb": "-0.36",
                "djb": "-0.36"
            },
            {
                "date": "2022-06",
                "totalWeight": "13.56",
                "hb": "-0.36",
                "tb": "-0.36",
                "djb": "-0.36"
            }
        ]
        resole(value)
    }), {})

    const { data: loftingStatisticalAnalysisData, run: getTableData } = useRequest<any>((initialData: any) => new Promise(async (resole, reject) => {
        const subtotal = [
            initialData.map((res: any) => Number(res?.data[0])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            initialData.map((res: any) => Number(res?.data[1])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            initialData.map((res: any) => Number(res?.data[2])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            initialData.map((res: any) => Number(res?.data[3])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0)
        ]
        const newData = [
            {
                productType: '放样件号数（万）',
                angleSteel: initialData[0]?.data[0],
                steelTubePole: initialData[1]?.data[0],
                fourPipe: initialData[2]?.data[0],
                architecture: initialData[3]?.data[0],
                steelStructure: initialData[4]?.data[0],
                subtotal: subtotal[0].toFixed(2)
            },
            {
                productType: '环比%',
                angleSteel: initialData[0]?.data[1],
                steelTubePole: initialData[1]?.data[1],
                fourPipe: initialData[2]?.data[1],
                architecture: initialData[3]?.data[1],
                steelStructure: initialData[4]?.data[1],
                subtotal: subtotal[1].toFixed(2)
            },
            {
                productType: '同比%',
                angleSteel: initialData[0]?.data[2],
                steelTubePole: initialData[1]?.data[2],
                fourPipe: initialData[2]?.data[2],
                architecture: initialData[3]?.data[2],
                steelStructure: initialData[4]?.data[2],
                subtotal: subtotal[2].toFixed(2)
            },
            {
                productType: '定基比%',
                angleSteel: initialData[0]?.data[3],
                steelTubePole: initialData[1]?.data[3],
                fourPipe: initialData[2]?.data[3],
                architecture: initialData[3]?.data[3],
                steelStructure: initialData[4]?.data[3],
                subtotal: subtotal[3].toFixed(2)
            }
        ]
        resole(newData)
    }), { manual: true })


    const { data: loftingAccuracyStatisticsData, run: getCorrectData } = useRequest<any>((initialData: any) => new Promise(async (resole, reject) => {
        const subtotal = [
            initialData.map((res: any) => Number(res?.data[4])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            initialData.map((res: any) => Number(res?.data[5])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            initialData.map((res: any) => Number(res?.data[6])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            initialData.map((res: any) => Number(res?.data[7])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0)
        ]
        const newData = [
            {
                productType: '放样正确率（万分比）',
                angleSteel: initialData[0]?.data[4],
                steelTubePole: initialData[1]?.data[4],
                fourPipe: initialData[2]?.data[4],
                architecture: initialData[3]?.data[4],
                steelStructure: initialData[4]?.data[4],
                subtotal: subtotal[0].toFixed(2)
            },
            {
                productType: '环比（万分比）',
                angleSteel: initialData[0]?.data[5],
                steelTubePole: initialData[1]?.data[5],
                fourPipe: initialData[2]?.data[5],
                architecture: initialData[3]?.data[5],
                steelStructure: initialData[4]?.data[5],
                subtotal: subtotal[1].toFixed(2)
            },
            {
                productType: '同比（万分比）',
                angleSteel: initialData[0]?.data[6],
                steelTubePole: initialData[1]?.data[6],
                fourPipe: initialData[2]?.data[6],
                architecture: initialData[3]?.data[6],
                steelStructure: initialData[4]?.data[6],
                subtotal: subtotal[2].toFixed(2)
            },
            {
                productType: '定基比（万分比）',
                angleSteel: initialData[0]?.data[7],
                steelTubePole: initialData[1]?.data[7],
                fourPipe: initialData[2]?.data[7],
                architecture: initialData[3]?.data[7],
                steelStructure: initialData[4]?.data[7],
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
                        ((Number(data?.subtotal[params[5].dataIndex][1]) === 0) ? '环比' + data?.subtotal[params[5].dataIndex][1] : (Number(data?.subtotal[params[5].dataIndex][1]) > 0) ? '<span style="color: red">环比增长' + data?.subtotal[params[5].dataIndex][1] + '%</span>' : '<span style="color: green">环比下降' + data?.subtotal[params[5].dataIndex][1] + '%</span>') +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(data?.subtotal[params[5].dataIndex][2]) === 0) ? '同比' + data?.subtotal[params[5].dataIndex][2] : (Number(data?.subtotal[params[5].dataIndex][2]) > 0) ? '<span style="color: red">同比增长' + data?.subtotal[params[5].dataIndex][2] + '%</span>' : '<span style="color: green">同比下降' + data?.subtotal[params[5].dataIndex][2] + '%</span>') +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(data?.subtotal[params[5].dataIndex][3]) === 0) ? '定基比' + data?.subtotal[params[5].dataIndex][3] : (Number(data?.subtotal[params[5].dataIndex][3]) > 0) ? '<span style="color: red">定基比增长' + data?.subtotal[params[5].dataIndex][3] + '%</span>' : '<span style="color: green">定基比下降' + data?.subtotal[params[5].dataIndex][3] + '%</span>') +
                        '</span></div>'
                    for (var i = 0; i < params.length; i++) {
                        const paramsData = i === 0 ? data?.angleSteel : i === 1 ? data?.steelTubePole : i === 2 ? data?.fourPipe : i === 3 ? data?.architecture : data?.steelStructure
                        res += '<div style="padding-bottom: 5px; display: flex; width: 600px;"><span style="display: inline-block; padding: 0 5px;">' +
                            '<i style="display: inline-block; width: 10px; height: 10px; background: ' + params[i].color +
                            ';}"></i></span><span style="padding-right: 6px; width: 20%;">' + params[i].seriesName +
                            '</span><span style="padding-right: 6px; width: 18%;">' + params[i].data +
                            '</span><span style="padding-right: 6px; width: 25%;">' +
                            ((Number(paramsData[params[i].dataIndex][1]) === 0) ? '环比' + paramsData[params[i].dataIndex][1] : (Number(paramsData[params[i].dataIndex][1]) > 0) ? '<span style="color: red">环比增长' + paramsData[params[i].dataIndex][1] + '%</span>' : '<span style="color: green">环比下降' + paramsData[params[i].dataIndex][1] + '%</span>') +
                            '</span><span style="padding-right: 6px; width: 25%;">' +
                            ((Number(paramsData[params[i].dataIndex][2]) === 0) ? '同比' + paramsData[params[i].dataIndex][2] : (Number(paramsData[params[i].dataIndex][2]) > 0) ? '<span style="color: red">同比增长' + paramsData[params[i].dataIndex][2] + '%</span>' : '<span style="color: green">同比下降' + paramsData[params[i].dataIndex][2] + '%</span>') +
                            '</span><span style="padding-right: 6px; width: 25%;">' +
                            ((Number(paramsData[params[i].dataIndex][3]) === 0) ? '定基比' + paramsData[params[i].dataIndex][3] : (Number(paramsData[params[i].dataIndex][3]) > 0) ? '<span style="color: red">定基比增长' + paramsData[params[i].dataIndex][3] + '%</span>' : '<span style="color: green">定基比下降' + paramsData[params[i].dataIndex][3] + '%</span>') +
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
                        ((Number(accuracyData?.subtotal[params[5].dataIndex][0]) === 0) ? '环比' + accuracyData?.subtotal[params[5].dataIndex][0] : (Number(accuracyData?.subtotal[params[5].dataIndex][0]) > 0) ? '<span style="color: red">环比增长' + accuracyData?.subtotal[params[5].dataIndex][0] + '%</span>' : '<span style="color: green">环比下降' + accuracyData?.subtotal[params[5].dataIndex][0] + '%</span>') +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(accuracyData?.subtotal[params[5].dataIndex][1]) === 0) ? '同比' + accuracyData?.subtotal[params[5].dataIndex][1] : (Number(accuracyData?.subtotal[params[5].dataIndex][1]) > 0) ? '<span style="color: red">同比增长' + accuracyData?.subtotal[params[5].dataIndex][1] + '%</span>' : '<span style="color: green">同比下降' + accuracyData?.subtotal[params[5].dataIndex][1] + '%</span>') +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(accuracyData?.subtotal[params[5].dataIndex][2]) === 0) ? '定基比' + accuracyData?.subtotal[params[5].dataIndex][2] : (Number(accuracyData?.subtotal[params[5].dataIndex][2]) > 0) ? '<span style="color: red">定基比增长' + accuracyData?.subtotal[params[5].dataIndex][2] + '%</span>' : '<span style="color: green">定基比下降' + accuracyData?.subtotal[params[5].dataIndex][2] + '%</span>') +
                        '</span></div>'
                    for (var i = 0; i < params.length; i++) {
                        const paramsData = i === 0 ? accuracyData?.angleSteel : i === 1 ? accuracyData?.steelTubePole : i === 2 ? accuracyData?.fourPipe : i === 3 ? accuracyData?.architecture : accuracyData?.steelStructure
                        res += '<div style="padding-bottom: 5px; display: flex; width: 600px;"><span style="display: inline-block; padding: 0 5px;">' +
                            '<i style="display: inline-block; width: 10px; height: 10px; background: ' + params[i].color +
                            ';}"></i></span><span style="padding-right: 6px; width: 20%;">' + params[i].seriesName +
                            '</span><span style="padding-right: 6px; width: 18%;">' + params[i].data +
                            '</span><span style="padding-right: 6px; width: 25%;">' +
                            ((Number(paramsData[params[i].dataIndex][5]) === 0) ? '环比' + paramsData[params[i].dataIndex][5] : (Number(paramsData[params[i].dataIndex][5]) > 0) ? '<span style="color: red">环比增长' + paramsData[params[i].dataIndex][5] + '%</span>' : '<span style="color: green">环比下降' + paramsData[params[i].dataIndex][5] + '%</span>') +
                            '</span><span style="padding-right: 6px; width: 25%;">' +
                            ((Number(paramsData[params[i].dataIndex][6]) === 0) ? '同比' + paramsData[params[i].dataIndex][6] : (Number(paramsData[params[i].dataIndex][6]) > 0) ? '<span style="color: red">同比增长' + paramsData[params[i].dataIndex][6] + '%</span>' : '<span style="color: green">同比下降' + paramsData[params[i].dataIndex][6] + '%</span>') +
                            '</span><span style="padding-right: 6px; width: 25%;">' +
                            ((Number(paramsData[params[i].dataIndex][7]) === 0) ? '定基比' + paramsData[params[i].dataIndex][7] : (Number(paramsData[params[i].dataIndex][7]) > 0) ? '<span style="color: red">定基比增长' + paramsData[params[i].dataIndex][7] + '%</span>' : '<span style="color: green">定基比下降' + paramsData[params[i].dataIndex][7] + '%</span>') +
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
                    data: accuracyData?.dateList || [],
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
                    data: accuracyData?.angleSteel?.map((res: any) => res[4])
                },
                {
                    name: '钢管塔',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: accuracyData?.steelTubePole?.map((res: any) => res[4])
                },
                {
                    name: '四管塔',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: accuracyData?.fourPipe?.map((res: any) => res[4])
                },
                {
                    name: '架构',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: accuracyData?.architecture?.map((res: any) => res[4])
                },
                {
                    name: '钢结构',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: accuracyData?.steelStructure?.map((res: any) => res[4])
                },
                {
                    name: '总量',
                    type: 'line',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: accuracyData?.subtotal?.map((res: any) => res[0])
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
                        '</p><p><span style="padding-right: 6px">总量</span>' + params[0].value +
                        '</p><p style="padding-right: 6px; width: 25%;">' +
                        ((Number(issuedBarData[params[0].dataIndex].hb) === 0) ? '环比' + issuedBarData[params[0].dataIndex].hb
                            : (Number(issuedBarData[params[0].dataIndex].hb) > 0) ? '<span style="color: red">环比增长' + issuedBarData[params[0].dataIndex].hb + '%</span>'
                                : '<span style="color: green">环比下降' + issuedBarData[params[0].dataIndex].hb + '%</span>') +
                        '</p><p style="padding-right: 6px; width: 25%;">' +
                        ((Number(issuedBarData[params[0].dataIndex].tb) === 0) ? '同比' + issuedBarData[params[0].dataIndex].tb
                            : (Number(issuedBarData[params[0].dataIndex].tb) > 0) ? '<span style="color: red">同比增长' + issuedBarData[params[0].dataIndex].tb + '%</span>'
                                : '<span style="color: green">同比下降' + issuedBarData[params[0].dataIndex].tb + '%</span>') +
                        '</p><p style="padding-right: 6px; width: 25%;">' +
                        ((Number(issuedBarData[params[0].dataIndex].djb) === 0) ? '定基比' + issuedBarData[params[0].dataIndex].djb
                            : (Number(issuedBarData[params[0].dataIndex].djb) > 0) ? '<span style="color: red">定基比增长' + issuedBarData[params[0].dataIndex].djb + '%</span>'
                                : '<span style="color: green">定基比下降' + issuedBarData[params[0].dataIndex].djb + '%</span>') +
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
                    data: issuedBarData?.map((res: any) => res.date),
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
                    data: issuedBarData?.map((res: any) => res.totalWeight)
                },
                {
                    name: '总量',
                    type: 'line',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: issuedBarData?.map((res: any) => res.totalWeight)
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
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '24',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: true
                    },
                    data: issuedPie || []
                }
            ]
        });
    }


    return <Spin spinning={loading}>
        <div className={styles.statement}>
            <div className={styles.header}>
                <div className={styles.headerbg}>
                    <span className={styles.headerTitle}>汇金通技术部放样统计数据分析</span>
                </div>
            </div>
            <div className={styles.top}>
                <div className={styles.left}>
                    <div>
                        <span className={styles.title}>放样统计分析</span>
                        <Select key={'LoftingStatisticalAnalysis'} className={styles.select} size="small" defaultValue={halfYear} onChange={(e) => {
                            run(e)
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
                        <Select key={'LoftingAccuracyStatistics'} className={styles.select} size="small" defaultValue={halfYear} onChange={(e) => {
                            getAccuracy(e);
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
                        <Select key={'productionDistributionStatistics'} className={styles.select} size="small" defaultValue={issuedHalfYear} onChange={(e) => {
                            getIssuedBarData(e);
                        }}>
                            {
                                issuedYearLists && issuedYearLists.map((res: any, index: number) => (
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
                            <Select key={'productionDistribution'} className={styles.select} defaultValue={''} size="small" onChange={(e) => {
                                getIssuedData(e);
                            }}>
                                <Select.Option key={0} value={''}>全部</Select.Option>
                                <Select.Option key={1} value={'角钢塔'}>角钢塔</Select.Option>
                                <Select.Option key={2} value={'钢管塔'}>钢管塔</Select.Option>
                                <Select.Option key={3} value={'四管塔'}>四管塔</Select.Option>
                                <Select.Option key={4} value={'架构'}>架构</Select.Option>
                                <Select.Option key={5} value={'钢结构'}>钢结构</Select.Option>
                            </Select>
                            <Table bordered pagination={false} dataSource={issuedData || []} columns={[
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
    </Spin>
}