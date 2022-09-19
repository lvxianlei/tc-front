/**
 * @author zyc
 * @copyright © 2022
 * @description 绩效管理-不合格处置单考核
 */

 import useRequest from '@ahooksjs/use-request';
import { Button, Col, DatePicker, DatePickerProps, Form, Input, Row, Space, TablePaginationConfig } from 'antd';
import React, { useEffect, useState } from 'react';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './UnqualifiedCheck.module.less';
import { columns, statisticalColumns, defectiveItemColumns,personColumns,totalColumns  } from "./unqualifiedCheck.json";
import * as echarts from 'echarts';
import moment from 'moment';
import CommonAliTable from '../../common/CommonAliTable';
import { DetailTitle } from '../../common';

export default function List(): React.ReactNode {
    const [form] = Form.useForm();
    var date = new Date();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [detailData, setDetailData] = useState<any>();
    const [personData, setPersonData] = useState<any>();
    const [totalData, setTotalData] = useState<any>();
    const [month, setMonth] = useState<any>(moment(date.getFullYear()+"-"+(date.getMonth() + 1)));
    const [page, setPage] = useState({
        current: 1,
        size: 20,
        total: 0
    })
    useEffect(() => {
        initCharts();
    })
    
    const { loading, data, run } = useRequest<any[]>((pagenation: TablePaginationConfig, filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        // const data: IResponseData = await RequestUtil.get<IResponseData>(``, { current: pagenation?.current || 1, size: pagenation?.size || 10, status: 3, ...filterValue });
        // setPage({ ...data });
        // if (data.records.length > 0 && data.records[0].id) {
        //     detailRun(data.records[0]?.id)
        // } else {
        //     setDetailData([])
        // }
        // resole(data?.records);
        resole([]);
    }), {})

    const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get(`${id}`);
            setDetailData(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    
    const onSearch = (values: Record<string, any>) => {
        if (values.time) {
            const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
            values.submitStartTime = formatDate[0] + ' 00:00:00';
            values.submitEndTime = formatDate[1] + ' 23:59:59';
        }
        setFilterValues(values);
        run({}, { ...values });
    }

    const handleChangePage = (current: number, pageSize: number) => {
        setPage({ ...page, current: current, size: pageSize });
        run({ current: current, size: pageSize }, { ...filterValues })
    }

    const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.id)
    }

    const { data: partsNumberPie } = useRequest<any>(() => new Promise(async (resole, reject) => {
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
  
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setMonth(date);
        monthTableRun(dateString)
      };

    const { data: monthData,run: monthTableRun } = useRequest<any[]>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        // const data: IResponseData = await RequestUtil.get<IResponseData>(``, { ...filterValue });
        // if (data.records.length > 0 && data.records[0].id) {
        //     detailRun(data.records[0]?.id)
        // } else {
        //     setDetailData([])
        // }
        // resole(data?.records);
        resole([]);
    }), {})

    const { run: personRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get(`${id}`);
            setPersonData(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: totalRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get(`${id}`);
            setTotalData(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onRowChangeMonth  = async (record: Record<string, any>) => {
        personRun(record.id)
        totalRun(record.id)
    }

    const initCharts = () => {
        (document as HTMLElement | any).getElementById('partsNumber').removeAttribute("_echarts_instance_");
        const partsNumberPieChart = echarts.init((document as HTMLElement | any).getElementById('partsNumber'));
        // 绘制图表
        partsNumberPieChart.setOption({
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
                show: false
            },
            toolbox: {
                feature: {
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '不合格件号数占比',
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
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    }, 
                    labelLine: {
                      show: false
                    },
                    data: partsNumberPie || []
                }
            ]
        });

        (document as HTMLElement | any).getElementById('number').removeAttribute("_echarts_instance_");
        const numberPieChart = echarts.init((document as HTMLElement | any).getElementById('number'));
        // 绘制图表
        numberPieChart.setOption({
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
                show: false
            },
            toolbox: {
                feature: {
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '不合格件数占比',
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
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    }, 
                    labelLine: {
                      show: false
                    },
                    data: partsNumberPie || []
                }
            ]
        });
        
        (document as HTMLElement | any).getElementById('wrongPartNumber').removeAttribute("_echarts_instance_");
        const wrongPartNumberPieChart = echarts.init((document as HTMLElement | any).getElementById('wrongPartNumber'));
        // 绘制图表
        wrongPartNumberPieChart.setOption({
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
                show: false
            },
            toolbox: {
                feature: {
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '不同产品类型错误件号数占比',
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
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    }, 
                    labelLine: {
                      show: false
                    },
                    data: partsNumberPie || []
                }
            ]
        });
        (document as HTMLElement | any).getElementById('wrongNumber').removeAttribute("_echarts_instance_");
        const wrongNumberPieChart = echarts.init((document as HTMLElement | any).getElementById('wrongNumber'));
        // 绘制图表
        wrongNumberPieChart.setOption({
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
                show: false
            },
            toolbox: {
                feature: {
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '不同产品类型错误件数占比',
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
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    }, 
                    labelLine: {
                      show: false
                    },
                    data: partsNumberPie || []
                }
            ]
        });
        (document as HTMLElement | any).getElementById('personWrongPartNumber').removeAttribute("_echarts_instance_");
        const personWrongPartNumberPieChart = echarts.init((document as HTMLElement | any).getElementById('personWrongPartNumber'));
        // 绘制图表
        personWrongPartNumberPieChart.setOption({
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
                show: false
            },
            toolbox: {
                feature: {
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '不同人员错误件号数占比',
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
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    }, 
                    labelLine: {
                      show: false
                    },
                    data: partsNumberPie || []
                }
            ]
        });
        (document as HTMLElement | any).getElementById('personWrongNumber').removeAttribute("_echarts_instance_");
        const personWrongNumberPieChart = echarts.init((document as HTMLElement | any).getElementById('personWrongNumber'));
        // 绘制图表
        personWrongNumberPieChart.setOption({
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
                show: false
            },
            toolbox: {
                feature: {
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '不同人员错误件数占比',
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
                            fontSize: '18',
                            fontWeight: 'bold'
                        }
                    }, 
                    labelLine: {
                      show: false
                    },
                    data: partsNumberPie || []
                }
            ]
        });
    }

    return <>
    <Row className={styles.bottom}>
        <Col span={2}>
        <Button>导出</Button>
        </Col>
    <Col>
        <Form form={form} layout="inline" onFinish={onSearch}>
        <Form.Item name="">
        <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item name="">
        <Input style={{ width: '260px' }} placeholder="塔型/计划号" />
        </Form.Item>
        <Form.Item>
                    <Space direction="horizontal">
                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button htmlType="reset">重置</Button>
                    </Space>
                </Form.Item>
    </Form>
    </Col>
    </Row>
    <Row gutter={12}>
        <Col span={10}>
        <CommonAliTable 
        columns={columns}
        dataSource={data}
        scroll ={{
            y: 350
        }}
        pagination={{
            current: page.current,
            pageSize: page.size,
            total: page?.total,
            showSizeChanger: true,
            onChange: handleChangePage
        }}
        onRow={(record: Record<string, any>) => ({
            onClick: () => onRowChange(record),
            className: styles.tableRow
        })}
        code={1}
        />
        </Col>
        <Col span={10}>
        <CommonAliTable
                            columns={statisticalColumns}
                            dataSource={detailData?.performanceDetailVOList}
                            pagination={false}
                            changeHeight={false}
                            code={1}
                            scroll ={{
                                y: 350
                            }}
                        />
        </Col>
        <Col span={4}>
        <div>
                            <DetailTitle title={"不合格项目占比"}/>
                            <div id={'partsNumber'} style={{ width: '100%', height: '200px' }} key={'partsNumber'} />
                            <div id={'number'} style={{ width: '100%', height: '200px' }} key={'number'} />
                        </div>
                        </Col>
    </Row>
    <DatePicker onChange={onChange} picker="month" value={month} className={styles.bottom}/>
    <Row gutter={12} className={styles.bottom}>
        <Col span={16}>
            <CommonAliTable
            columns={defectiveItemColumns}
            dataSource={monthData ||[]}
            scroll ={{
                y: 350
            }}
            isPage={false}
            code={1}
            onRow={(record: Record<string, any>) => ({
                onClick: () => onRowChangeMonth(record),
                className: styles.tableRow
            })}
            />
        </Col>
        <Col span={8}>
        <CommonAliTable
            columns={personColumns}
            dataSource={personData || []}
            scroll ={{
                y: 350
            }}
            isPage={false}
            code={1}
            />
        </Col>
    </Row>
    <Row gutter={12}>
        <Col span={8}>
        <CommonAliTable
            columns={totalColumns}
            dataSource={totalData || []}
            scroll ={{
                y: 350
            }}
            isPage={false}
            code={1}
            />
        </Col>           
                            <Col span={16}>
                                <DetailTitle title={"不合格项目错误占比饼图"}/>
                                <Row gutter={12}>
<Col span={6}>
        <div id={'wrongPartNumber'} style={{ width: '100%', height: '200px' }} key={'wrongPartNumber'} />
        </Col>
        <Col span={6}>
        <div id={'wrongNumber'} style={{ width: '100%', height: '200px' }} key={'wrongNumber'} />
        </Col>
        <Col span={6}>
        <div id={'personWrongPartNumber'} style={{ width: '100%', height: '200px' }} key={'personWrongPartNumber'} />
        </Col>
        <Col span={6}>
        <div id={'personWrongNumber'} style={{ width: '100%', height: '200px' }} key={'personWrongNumber'} />
        </Col>
                                </Row>
                                </Col>
    </Row>
    </>
}