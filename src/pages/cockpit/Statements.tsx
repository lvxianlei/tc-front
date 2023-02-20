/**
 * @author zyc
 * @copyright © 2022
 * @description 驾驶舱-报表
 */

import useRequest from '@ahooksjs/use-request';
import { Button, Modal, Select, Spin, Table } from 'antd';
import * as echarts from 'echarts';
import React, { useEffect, useState } from 'react'
import RequestUtil from '../../utils/RequestUtil';
import styles from './Statements.module.less';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export default function Statements(): React.ReactNode {
    const [isFull, setIsFull] = useState<boolean>(false)
    const [firstData, setFirstData] = useState<any>();
    const [secondData, setSecondData] = useState<any>();
    const [pagenation, setPagenation] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    })
    const [productType, setProductType] = useState('');
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
            width: 100,
            dataIndex: 'productType'
        },
        {
            key: 'angleSteel',
            title: '角钢塔',
            width: 50,
            dataIndex: 'angleSteel',
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                index === 0 ? <span>{_}</span> : <span>{Number(_) === 0 ? Number(_) : Number(_) > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'steelTubePole',
            title: '钢管杆',
            width: 50,
            dataIndex: 'steelTubePole',
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                index === 0 ? <span>{_}</span> : <span>{Number(_) === 0 ? Number(_) : Number(_) > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'fourPipe',
            title: '四管塔',
            width: 50,
            dataIndex: 'fourPipe',
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                index === 0 ? <span>{_}</span> : <span>{Number(_) === 0 ? Number(_) : Number(_) > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'architecture',
            title: '架构',
            width: 50,
            dataIndex: 'architecture',
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                index === 0 ? <span>{_}</span> : <span>{Number(_) === 0 ? Number(_) : Number(_) > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'steelStructure',
            title: '钢结构',
            width: 50,
            dataIndex: 'steelStructure',
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                index === 0 ? <span>{_}</span> : <span>{Number(_) === 0 ? Number(_) : Number(_) > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        },
        {
            key: 'subtotal',
            title: '小计',
            width: 50,
            dataIndex: 'subtotal',
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                index === 0 ? <span>{_}</span> : <span>{Number(_) === 0 ? Number(_) : Number(_) > 0 ? <span><ArrowUpOutlined style={{ color: 'red' }} />{_}</span> : <span><ArrowDownOutlined style={{ color: 'green' }} />{_}</span>}</span>
            )
        }
    ]

    const issuedColumns = [
        {
            key: 'index',
            title: '序号',
            width: 50,
            dataIndex: 'index',
            render: (_a: any, _b: any, index: number) => { return index + 1 }
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 50,
            dataIndex: 'planNumber'
        },
        {
            key: 'projectName',
            title: '项目名称',
            width: 120,
            dataIndex: 'projectName'
        },
        {
            key: 'totalWeight',
            title: '下技术总量',
            width: 50,
            dataIndex: 'totalWeight'
        },
        {
            key: 'issWeight',
            title: '已下达量',
            width: 50,
            dataIndex: 'issWeight'
        },
        {
            key: 'noIssWeight',
            title: '未下达量',
            width: 50,
            dataIndex: 'noIssWeight'
        }
    ]

    const { data: yearLists } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
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
        } catch (error) {
            reject(error)
        }
    }), {})

    const { data: issuedYearLists } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
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
        } catch (error) {
            reject(error)
        }
    }), {})

    const { loading, data, run } = useRequest<any>((date: string) => new Promise(async (resole, reject) => {
        try {
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
            setFirstData(value);
            const tableData = value[value.length - 1]?.val;
            tableData && getTableData(tableData);
            const angleSteelData = value.map((res: any) => res.val).map((res: any) => res[0]?.data);
            const steelTubePoleData = value.map((res: any) => res.val).map((res: any) => res[1]?.data);
            const fourPipeData = value.map((res: any) => res.val).map((res: any) => res[2]?.data);
            const architectureData = value.map((res: any) => res.val).map((res: any) => res[3]?.data);
            const steelStructureData = value.map((res: any) => res.val).map((res: any) => res[4]?.data);
            const subtotalData = value.map((res: any) => res.val).map((res: any) => res[5]?.data);
            // const pureData = value?.map((res: any) => res.val)?.map((item: any) => item?.map((res: any) => res.data));
            // const secondData = pureData?.map((items: any) => [
            //     items?.map((item: any[]) => item[0]),
            //     items?.map((item: any[]) => item[1]),
            //     items?.map((item: any[]) => item[2]),
            //     items?.map((item: any[]) => item[3])
            // ])
            // const thirdData = secondData?.map((res: any) => [
            //     (res[0].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            //     (res[1].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            //     (res[2].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            //     (res[3].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2)
            // ])
            let processedData = {
                dateList: value.map((res: any) => res?.date),
                angleSteel: angleSteelData,
                steelTubePole: steelTubePoleData,
                fourPipe: fourPipeData,
                architecture: architectureData,
                steelStructure: steelStructureData,
                subtotal: subtotalData
            };
            resole(processedData)
        } catch (error) {
            reject(error)
        }
    }), {})


    const { data: accuracyData, run: getAccuracy } = useRequest<any>((date: string) => new Promise(async (resole, reject) => {
        try {
            const value: any = await RequestUtil.get<any>(`/tower-statistics/lofting/accuracy`, { date: date || halfYear });
            setSecondData(value);
            const tableData = value[value.length - 1]?.val;
            tableData && getCorrectData(tableData);
            const angleSteelData = value.map((res: any) => res.val).map((res: any) => res[0]?.data);
            const steelTubePoleData = value.map((res: any) => res.val).map((res: any) => res[1]?.data);
            const fourPipeData = value.map((res: any) => res.val).map((res: any) => res[2]?.data);
            const architectureData = value.map((res: any) => res.val).map((res: any) => res[3]?.data);
            const steelStructureData = value.map((res: any) => res.val).map((res: any) => res[4]?.data);
            const subtotalData = value.map((res: any) => res.val).map((res: any) => res[5]?.data);
            // const pureData = value?.map((res: any) => res.val)?.map((item: any) => item?.map((res: any) => res.data));
            // const secondData = pureData?.map((items: any) => [
            //     items?.map((item: any[]) => item[4]),
            //     items?.map((item: any[]) => item[5]),
            //     items?.map((item: any[]) => item[6]),
            //     items?.map((item: any[]) => item[7])
            // ])
            // const thirdData = secondData?.map((res: any) => [
            //     (res[0].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            //     (res[1].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            //     (res[2].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2),
            //     (res[3].reduce((total: number, currentValue: number) => total + Number(currentValue), 0)).toFixed(2)
            // ])
            let processedData = {
                dateList: value.map((res: any) => res?.date),
                angleSteel: angleSteelData,
                steelTubePole: steelTubePoleData,
                fourPipe: fourPipeData,
                architecture: architectureData,
                steelStructure: steelStructureData,
                subtotal: subtotalData
            };
            resole(processedData)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { data: issuedPie } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const value: any = await RequestUtil.get<any>(`/tower-statistics/lofting/getProductTypeStatistics`);
            const processedData = value.map((res: any) => {
                return {
                    value: res.no_iss_weight,
                    name: res.product_type_name
                }
            })
            resole(processedData)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { data: issuedData, run: getIssuedData } = useRequest<any>((productType: string, page: Record<string, any>) => new Promise(async (resole, reject) => {
        try {
            const value: any = await RequestUtil.get<any>(`/tower-statistics/lofting/getLoftingPlanStatistics`, { productType: productType || '', current: 1, size: 10, ...page });
            setPagenation(value);
            resole(value?.records || []);
        } catch (error) {
            reject(error)
        }
    }), {})

    const { data: issuedBarData, run: getIssuedBarData } = useRequest<any>((date: string) => new Promise(async (resole, reject) => {
        try {
            const value: any = await RequestUtil.get<any>(`/tower-statistics/lofting/getIssStatistics?date=${date || issuedHalfYear}`);
            resole(value)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { data: loftingStatisticalAnalysisData, run: getTableData } = useRequest<any>((initialData: any) => new Promise(async (resole, reject) => {
        try {
            // const subtotal = [
            //     initialData.map((res: any) => Number(res?.data[0])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            //     initialData.map((res: any) => Number(res?.data[1])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            //     initialData.map((res: any) => Number(res?.data[2])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            //     initialData.map((res: any) => Number(res?.data[3])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0)
            // ]
            const newData = [
                {
                    productType: '放样件号数（万）',
                    angleSteel: initialData[0]?.data[0],
                    steelTubePole: initialData[1]?.data[0],
                    fourPipe: initialData[2]?.data[0],
                    architecture: initialData[3]?.data[0],
                    steelStructure: initialData[4]?.data[0],
                    subtotal: initialData[5]?.data[0]
                },
                {
                    productType: '环比%',
                    angleSteel: initialData[0]?.data[1],
                    steelTubePole: initialData[1]?.data[1],
                    fourPipe: initialData[2]?.data[1],
                    architecture: initialData[3]?.data[1],
                    steelStructure: initialData[4]?.data[1],
                    subtotal: initialData[5]?.data[1]
                },
                {
                    productType: '同比%',
                    angleSteel: initialData[0]?.data[2],
                    steelTubePole: initialData[1]?.data[2],
                    fourPipe: initialData[2]?.data[2],
                    architecture: initialData[3]?.data[2],
                    steelStructure: initialData[4]?.data[2],
                    subtotal: initialData[5]?.data[2]
                },
                {
                    productType: '定基比%',
                    angleSteel: initialData[0]?.data[3],
                    steelTubePole: initialData[1]?.data[3],
                    fourPipe: initialData[2]?.data[3],
                    architecture: initialData[3]?.data[3],
                    steelStructure: initialData[4]?.data[3],
                    subtotal: initialData[5]?.data[3]
                }
            ]
            resole(newData)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })


    const { data: loftingAccuracyStatisticsData, run: getCorrectData } = useRequest<any>((initialData: any) => new Promise(async (resole, reject) => {
        try {
            // const subtotal = [
            //     initialData.map((res: any) => Number(res?.data[4])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            //     initialData.map((res: any) => Number(res?.data[5])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            //     initialData.map((res: any) => Number(res?.data[6])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0),
            //     initialData.map((res: any) => Number(res?.data[7])).reduce((total: number, currentValue: number) => total + Number(currentValue), 0)
            // ]
            const newData = [
                {
                    productType: '放样正确率（万分比）',
                    angleSteel: initialData[0]?.data[4],
                    steelTubePole: initialData[1]?.data[4],
                    fourPipe: initialData[2]?.data[4],
                    architecture: initialData[3]?.data[4],
                    steelStructure: initialData[4]?.data[4],
                    subtotal: initialData[5]?.data[4]
                },
                {
                    productType: '环比（万分比）',
                    angleSteel: initialData[0]?.data[5],
                    steelTubePole: initialData[1]?.data[5],
                    fourPipe: initialData[2]?.data[5],
                    architecture: initialData[3]?.data[5],
                    steelStructure: initialData[4]?.data[5],
                    subtotal: initialData[5]?.data[5]
                },
                {
                    productType: '同比（万分比）',
                    angleSteel: initialData[0]?.data[6],
                    steelTubePole: initialData[1]?.data[6],
                    fourPipe: initialData[2]?.data[6],
                    architecture: initialData[3]?.data[6],
                    steelStructure: initialData[4]?.data[6],
                    subtotal: initialData[5]?.data[6]
                },
                {
                    productType: '定基比（万分比）',
                    angleSteel: initialData[0]?.data[7],
                    steelTubePole: initialData[1]?.data[7],
                    fourPipe: initialData[2]?.data[7],
                    architecture: initialData[3]?.data[7],
                    steelStructure: initialData[4]?.data[7],
                    subtotal: initialData[5]?.data[7]
                }
            ]
            resole(newData)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const initCharts = () => {
        (document as HTMLElement | any).getElementById('LoftingStatisticalAnalysis').removeAttribute("_echarts_instance_");
        const myChart = echarts.init((document as HTMLElement | any).getElementById('LoftingStatisticalAnalysis'), 'dark');
        myChart.getZr().on('click', params => {
            let pointInPixel = [params.offsetX, params.offsetY]
            if (myChart.containPixel('grid', pointInPixel)) {
                let xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
                getTableData(firstData[xIndex].val)
            }
        })
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
                confine: true,
                position: [0, 0],
                axisPointer: {
                    type: 'shadow',
                    crossStyle: {
                        color: '#999'
                    }
                },
                formatter: (params: any) => {
                    var res = '<div style="padding-bottom: 5px; display: flex; width: 600px"><span style="padding-right: 6px; width: 20%;"><span style="padding-right: 5px">月份</span>' + params[params.length - 1].axisValue +
                        '</span><span style="padding-right: 6px; width: 20%;">总量' + params[params.length - 1].data +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(data?.subtotal[params[params.length - 1].dataIndex][1]) === 0) ? '环比' + data?.subtotal[params[params.length - 1].dataIndex][1] : (Number(data?.subtotal[params[params.length - 1].dataIndex][1]) > 0) ? '<span style="color: red">环比增长' + data?.subtotal[params[params.length - 1].dataIndex][1] + '%</span>' : '<span style="color: green">环比下降' + data?.subtotal[params[params.length - 1].dataIndex][1] + '%</span>') +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(data?.subtotal[params[params.length - 1].dataIndex][2]) === 0) ? '同比' + data?.subtotal[params[params.length - 1].dataIndex][2] : (Number(data?.subtotal[params[params.length - 1].dataIndex][2]) > 0) ? '<span style="color: red">同比增长' + data?.subtotal[params[params.length - 1].dataIndex][2] + '%</span>' : '<span style="color: green">同比下降' + data?.subtotal[params[params.length - 1].dataIndex][2] + '%</span>') +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(data?.subtotal[params[params.length - 1].dataIndex][3]) === 0) ? '定基比' + data?.subtotal[params[params.length - 1].dataIndex][3] : (Number(data?.subtotal[params[params.length - 1].dataIndex][3]) > 0) ? '<span style="color: red">定基比增长' + data?.subtotal[params[params.length - 1].dataIndex][3] + '%</span>' : '<span style="color: green">定基比下降' + data?.subtotal[params[params.length - 1].dataIndex][3] + '%</span>') +
                        '</span></div>'
                    for (var i = 0; i < params.length - 1; i++) {
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
        (document as HTMLElement | any).getElementById('LoftingAccuracyStatistics').removeAttribute("_echarts_instance_");
        const accuracyChart = echarts.init((document as HTMLElement | any).getElementById('LoftingAccuracyStatistics'), 'dark');
        accuracyChart.getZr().on('click', params => {
            let pointInPixel = [params.offsetX, params.offsetY]
            if (accuracyChart.containPixel('grid', pointInPixel)) {
                let xIndex = accuracyChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
                getCorrectData(secondData[xIndex].val)
            }
        })
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
                    var res = '<div style="padding-bottom: 5px; display: flex; width: 600px"><span style="padding-right: 6px; width: 20%;"><span style="padding-right: 5px">月份</span>' + params[params.length - 1].axisValue +
                        '</span><span style="padding-right: 6px; width: 20%;">总量' + params[params.length - 1].data +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(accuracyData?.subtotal[params[params.length - 1].dataIndex][5]) === 0) ? '环比' + accuracyData?.subtotal[params[params.length - 1].dataIndex][5] : (Number(accuracyData?.subtotal[params[params.length - 1].dataIndex][5]) > 0) ? '<span style="color: red">环比增长' + accuracyData?.subtotal[params[params.length - 1].dataIndex][5] + '%</span>' : '<span style="color: green">环比下降' + accuracyData?.subtotal[params[params.length - 1].dataIndex][5] + '%</span>') +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(accuracyData?.subtotal[params[params.length - 1].dataIndex][6]) === 0) ? '同比' + accuracyData?.subtotal[params[params.length - 1].dataIndex][6] : (Number(accuracyData?.subtotal[params[params.length - 1].dataIndex][6]) > 0) ? '<span style="color: red">同比增长' + accuracyData?.subtotal[params[params.length - 1].dataIndex][6] + '%</span>' : '<span style="color: green">同比下降' + accuracyData?.subtotal[params[params.length - 1].dataIndex][6] + '%</span>') +
                        '</span><span style="padding-right: 6px; width: 25%;">' +
                        ((Number(accuracyData?.subtotal[params[params.length - 1].dataIndex][7]) === 0) ? '定基比' + accuracyData?.subtotal[params[params.length - 1].dataIndex][7] : (Number(accuracyData?.subtotal[params[params.length - 1].dataIndex][7]) > 0) ? '<span style="color: red">定基比增长' + accuracyData?.subtotal[params[params.length - 1].dataIndex][7] + '%</span>' : '<span style="color: green">定基比下降' + accuracyData?.subtotal[params[params.length - 1].dataIndex][7] + '%</span>') +
                        '</span></div>'
                    for (var i = 0; i < params.length - 1; i++) {
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
                    data: accuracyData?.subtotal?.map((res: any) => res[4])
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
                        // formatter: '{value}',
                        interval: 0,//标签设置为全部显示
                        formatter: function (params: number) {
                            var newParamsName = "";// 最终拼接成的字符串
                            var paramsNameNumber = params.toString().length;// 实际标签的字数
                            var provideNumber = 4;// 每行能显示的字的个数
                            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                            /**
                             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                             */
                            // 条件等同于rowNumber>1
                            if (paramsNameNumber > provideNumber) {
                                /** 循环每一行,p表示行 */
                                for (var p = 0; p < rowNumber; p++) {
                                    var tempStr = "";// 表示每一次截取的字符串
                                    var start = p * provideNumber;// 开始截取的位置
                                    var end = start + provideNumber;// 结束截取的位置
                                    // 此处特殊处理最后一行的索引值
                                    if (p == rowNumber - 1) {
                                        // 最后一次不换行
                                        tempStr = params.toString().substring(start, paramsNameNumber);
                                    } else {
                                        // 每一次拼接字符串并换行
                                        tempStr = params.toString().substring(start, end) + "\n";
                                    }
                                    newParamsName += tempStr;// 最终拼成的字符串
                                }

                            } else {
                                // 将旧标签的值赋给新标签
                                newParamsName = params.toString();
                            }
                            //将最终的字符串返回
                            return newParamsName

                        }

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
            color: [
                '#2778FF',
                '#80C269',
                '#FFD200',
                '#F45E23',
                '#E5004F'
            ],
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
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: true,
                        length: 10,
                        length2: 10
                    },
                    data: issuedPie || []
                }
            ]
        });
    }

    const paginationChange = (page: number, pageSize?: number | undefined) => {
        setPagenation({ ...pagenation, current: page, pageSize: pageSize || 15 });
        getIssuedData(productType, { current: page, size: pageSize })
    }

    const chartsContent = (): React.ReactNode => {
        return <div className={styles.statement} id={'statement'}>
            <div className={styles.header}>
                <div className={styles.headerbg}>
                    <span className={styles.headerTitle}>技术部放样统计数据分析</span>
                </div>
                <Button type="primary" onClick={() => setIsFull(!isFull)} className={styles.fullBtn} size='small' ghost>{isFull ? '退出全屏' : '全屏'}</Button>
            </div>
            <div className={styles.top}>
                <div className={styles.left}>
                    <div>
                        <span className={styles.title}>放样统计分析</span>
                        <Select key={'LoftingStatisticalAnalysis'} className={styles.select} dropdownClassName={styles.dropdownStyle} size="small" defaultValue={halfYear} onChange={(e) => {
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
                        pagination={false}
                        dataSource={[...loftingStatisticalAnalysisData || []]}
                        columns={columns}
                        onRow={() => ({ className: styles.tableRow })} />
                </div>
                <div className={styles.right}>
                    <div>
                        <span className={styles.title}>放样正确率统计分析</span>
                        <Select key={'LoftingAccuracyStatistics'} className={styles.select} dropdownClassName={styles.dropdownStyle} size="small" defaultValue={halfYear} onChange={(e) => {
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
                        <Select key={'productionDistributionStatistics'} className={styles.select} size="small" dropdownClassName={styles.dropdownStyle} defaultValue={issuedHalfYear} onChange={(e) => {
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
                    <div className={styles.rightContent}>
                        <div style={{ width: "40%" }}>
                            <span className={styles.title}>未生产下达统计分析</span>
                            <div id={'productionDistribution'} style={{ width: '100%', height: '400px' }} key={'productionDistribution'} />
                        </div>

                        <div style={{ width: "100%", marginLeft: "2%", marginTop: '10px' }}>
                            <Select key={'productionDistribution'} dropdownClassName={styles.dropdownStyle} className={styles.select} defaultValue={''} size="small" onChange={(e) => {
                                getIssuedData(e);
                                setProductType(e);
                            }}>
                                <Select.Option key={0} value={''}>全部</Select.Option>
                                <Select.Option key={1} value={'角钢塔'}>角钢塔</Select.Option>
                                <Select.Option key={2} value={'钢管杆'}>钢管杆</Select.Option>
                                <Select.Option key={3} value={'四管塔'}>四管塔</Select.Option>
                                <Select.Option key={4} value={'架构'}>架构</Select.Option>
                                <Select.Option key={5} value={'钢结构'}>钢结构</Select.Option>
                            </Select>
                            <Table
                                bordered
                                pagination={{
                                    size: "small",
                                    pageSize: pagenation.pageSize,
                                    onChange: paginationChange,
                                    current: pagenation.current,
                                    total: pagenation?.total
                                }}
                                dataSource={issuedData || []}
                                columns={issuedColumns}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    return <Spin spinning={loading}>
        {
            isFull ?
                <Modal width='100%' className={styles.statementsModal} visible={isFull} closable={false} footer={false} onCancel={() => setIsFull(false)}>
                    {chartsContent()}
                </Modal>
                :
                <>{chartsContent()}</>
        }

    </Spin>
}