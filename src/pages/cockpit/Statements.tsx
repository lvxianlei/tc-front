/**
 * @author zyc
 * @copyright © 2022
 * @description 驾驶舱-报表
 */

import { Select, Table } from 'antd';
import * as echarts from 'echarts';
import React, { createRef, useEffect, useState } from 'react'
import styles from './Statements.module.less'

export default function Statements(): React.ReactNode {
    const ref = createRef<HTMLDivElement>() // 初始值
    useEffect(() => {
        initCharts();
    })


    const initCharts = () => {
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
                    var res = '<div><span style="padding-right: 6px">月份' + params[0].name +
                        '</span><span style="padding-right: 6px">总量' + params[0].name +
                        '</span><span style="padding-right: 6px">环比增长' + params[0].name +
                        '</span><span style="padding-right: 6px">同比下降' + params[0].name +
                        '</span><span style="padding-right: 6px">定基比增长' + params[0].name +
                        '</span></div>'
                    for (var i = 0; i < params.length; i++) {
                        res += '<p><span style="display: inline-block;padding: 5px 0;">' +
                            '<i style="display: inline-block;width: 10px;height: 10px;background: ' + params[i].color +
                            ';border-radius: 50%;}"></i></span><span style="padding-right: 6px; width: 20px">' + params[i].seriesName +
                            '</span><span style="padding-right: 6px">' + params[i].data +
                            '</span><span style="padding-right: 6px">环比增长' + params[i].name +
                            '</span><span style="padding-right: 6px">同比下降' + params[i].name +
                            '</span><span style="padding-right: 6px">定基比增长' + params[i].name +
                            '</span></p>'
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
                    data: ['01', '02', '03', '04', '05', '06'],
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
                    data: [
                        2.0, 4.9, 7.0, 23.2, 25.6, 76.7
                    ]
                },
                {
                    name: '钢管塔',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: [
                        2.6, 5.3, 9.0, 26.4, 28.7, 70.7
                    ]
                },
                {
                    name: '四管塔',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: [
                        2.6, 5.9, 9.0, 26.4, 89, 70.7
                    ]
                },
                {
                    name: '架构',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: [
                        2.6, 5.9, 9.0, 26.4, 28.7, 100.12
                    ]
                },
                {
                    name: '钢结构',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: [
                        2.6, 5.9, 9.0, 26.4, 28.7, 70.7
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
                    var res = '<div><span style="padding-right: 6px">月份' + params[0].name +
                        '</span><span style="padding-right: 6px">总量' + params[0].name +
                        '</span><span style="padding-right: 6px">环比增长' + params[0].name +
                        '</span><span style="padding-right: 6px">同比下降' + params[0].name +
                        '</span><span style="padding-right: 6px">定基比增长' + params[0].name +
                        '</span></div>'
                    for (var i = 0; i < params.length; i++) {
                        res += '<p><span style="display: inline-block;padding: 5px 0;">' +
                            '<i style="display: inline-block;width: 10px;height: 10px;background: ' + params[i].color +
                            ';border-radius: 50%;}"></i></span><span style="padding-right: 6px; width: 20px">' + params[i].seriesName +
                            '</span><span style="padding-right: 6px">' + params[i].data +
                            '</span><span style="padding-right: 6px">环比增长' + params[i].name +
                            '</span><span style="padding-right: 6px">同比下降' + params[i].name +
                            '</span><span style="padding-right: 6px">定基比增长' + params[i].name +
                            '</span></p>'
                    }
                    return res;
                },
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
                    name: '角钢塔',
                    type: 'bar',

                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: [
                        2.0, 4.9, 7.0, 23.2, 25.6, 76.7
                    ]
                },
                {
                    name: '钢管塔',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: [
                        2.6, 5.3, 9.0, 26.4, 28.7, 70.7
                    ]
                },
                {
                    name: '四管塔',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: [
                        2.6, 5.9, 9.0, 26.4, 89, 70.7
                    ]
                },
                {
                    name: '架构',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: [
                        2.6, 5.9, 9.0, 26.4, 28.7, 100.12
                    ]
                },
                {
                    name: '钢结构',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value: string) {
                            return value;
                        }
                    },
                    data: [
                        2.6, 5.9, 9.0, 26.4, 28.7, 70.7
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
        <div className={styles.top}>
            
        <div className={styles.left}>
            <div>
                <span className={styles.title}>放样统计分析</span>
                <Select className={styles.select} size="small" onChange={(e) => {

                }}>
                    <Select.Option key={0} value={'2020'}>2020</Select.Option>
                    <Select.Option key={1} value={'2021'}>2021</Select.Option>
                    <Select.Option key={2} value={'2022'}>2022</Select.Option>
                </Select>
            </div>
            <div id={'LoftingStatisticalAnalysis'} style={{ width: '100%', height: '400px' }} key={'LoftingStatisticalAnalysis'}/>
            <Table bordered pagination={false} dataSource={[{index: '111',a: '111'}]} columns={[
                {
                    key: 'index',
                    title: '产品类型',
                    width: 50,
                    dataIndex: 'index',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                },
                {
                    key: 'a',
                    title: '角钢塔',
                    width: 50,
                    dataIndex: 'a',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                },
                {
                    key: 'c',
                    title: '钢管杆',
                    width: 50,
                    dataIndex: 'c',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                },
                {
                    key: 'd',
                    title: '四管塔',
                    width: 50,
                    dataIndex: 'd',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                },
                {
                    key: 'e',
                    title: '架构',
                    width: 50,
                    dataIndex: 'e',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                },
                {
                    key: 'f',
                    title: '钢结构',
                    width: 50,
                    dataIndex: 'f',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                },
                {
                    key: 'q',
                    title: '小计',
                    width: 50,
                    dataIndex: 'q',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                }
            ]}/>
        </div>
        <div className={styles.right}>
            <div>
                <span className={styles.title}>放样正确率统计分析</span>
                <Select className={styles.select} size="small" onChange={(e) => {

                }}>
                    <Select.Option key={0} value={'2020'}>2020</Select.Option>
                    <Select.Option key={1} value={'2021'}>2021</Select.Option>
                    <Select.Option key={2} value={'2022'}>2022</Select.Option>
                </Select>
            </div>
            <div id={'LoftingAccuracyStatistics'} style={{ width: '100%', height: '400px' }} key={'LoftingAccuracyStatistics'}/>
        <Table bordered pagination={false} dataSource={[{index: '111',a: '111'}]} columns={[
                {
                    key: 'index',
                    title: '产品类型',
                    width: 50,
                    dataIndex: 'index',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                },
                {
                    key: 'a',
                    title: '角钢塔',
                    width: 50,
                    dataIndex: 'a',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                },
                {
                    key: 'c',
                    title: '钢管杆',
                    width: 50,
                    dataIndex: 'c',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                },
                {
                    key: 'd',
                    title: '四管塔',
                    width: 50,
                    dataIndex: 'd',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                },
                {
                    key: 'e',
                    title: '架构',
                    width: 50,
                    dataIndex: 'e',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                },
                {
                    key: 'f',
                    title: '钢结构',
                    width: 50,
                    dataIndex: 'f',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                },
                {
                    key: 'q',
                    title: '小计',
                    width: 50,
                    dataIndex: 'q',
                    render: (_a: any, _b: any, index: number) => { return index + 1 }
                }
            ]}/>
        </div>
        </div>
        <div className={styles.bottom}>
            
        <div className={styles.left}>
            <div>
                <span className={styles.title}>生产下达统计分析</span>
                <Select className={styles.select} size="small" onChange={(e) => {

                }}>
                    <Select.Option key={0} value={'2020'}>2020</Select.Option>
                    <Select.Option key={1} value={'2021'}>2021</Select.Option>
                    <Select.Option key={2} value={'2022'}>2022</Select.Option>
                </Select>
            </div>
            <div id={'productionDistributionStatistics'} style={{ width: '100%', height: '400px' }} key={'productionDistributionStatistics'}/>
        </div>
        <div className={styles.right}>
                <p className={styles.title}>生产下达统计分析</p>
            <div className={styles.rightContent}>
                <div style={{width: "40%"}}>

               
            <div id={'productionDistribution'} style={{ width: '100%', height: '400px' }} key={'productionDistribution'}/>
             </div>
<div style={{width: "100%",marginLeft: "2%"}}>
            <Select className={styles.select} size="small" onChange={(e) => {

}}>
    <Select.Option key={0} value={''}>全部</Select.Option>
    <Select.Option key={1} value={'角钢塔'}>角钢塔</Select.Option>
    <Select.Option key={2} value={'钢管塔'}>钢管塔</Select.Option>
    <Select.Option key={3} value={'四管塔'}>四管塔</Select.Option>
    <Select.Option key={4} value={'架构'}>架构</Select.Option>
    <Select.Option key={5} value={'钢结构'}>钢结构</Select.Option>
</Select>
            <Table bordered pagination={false} dataSource={[{index: '111',a: '111'}]} columns={[
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
            ]}/>        
                    
</div>
            </div>
            </div>
        </div>
    </div>
}