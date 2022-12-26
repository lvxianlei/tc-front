/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-放样塔型绩效汇总
 */

import React, { useEffect, useRef, useState } from 'react';
import { Space, Input, DatePicker, Button, Form, Select, Row, Col, Modal, message, TablePaginationConfig } from 'antd';
import styles from './LoftingpPerformanceSummary.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import { columns, itemColumns } from "./loftingpPerformanceSummary.json"
import { CommonTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import * as echarts from 'echarts';
import ItemSetting from './ItemSetting';
import { useHistory } from 'react-router-dom';

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function List(): React.ReactNode {
    const [detailData, setDetailData] = useState<any>();
    const [form] = Form.useForm();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [visible, setVisible] = useState<boolean>(false);
    const ref = useRef<EditRefProps>();
    const history = useHistory();
    const [page, setPage] = useState({
        current: 1,
        size: 10,
        total: 0
    })

    useEffect(() => {
        initCharts();
    })

    const { loading, data, run } = useRequest<any[]>((pagenation: TablePaginationConfig, filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<any>(`/tower-science/performance/product/category/list`, { current: pagenation?.current || 1, size: pagenation?.size || 10, ...filterValue });
        setDetailData(data?.records[0]?.entryLinkList || [])
        resole(data?.records);
    }), {})

    const onRowChange = async (record: Record<string, any>) => {
        setDetailData(record?.entryLinkList || [])
    }

    const onSearch = (values: Record<string, any>) => {
        if (values.updateStatusTime) {
            const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
            values.startTime = formatDate[0] + ' 00:00:00';
            values.endTime = formatDate[1] + ' 23:59:59';
        }
        setFilterValues(values);
        run({},{ ...values });
    }

    const handleChangePage = (current: number, pageSize: number) => {
        setPage({ ...page, current: current, size: pageSize });
        run({ current: current, size: pageSize }, { ...filterValues })
    }

    const initCharts = () => {
        (document as HTMLElement | any).getElementById('performancePie').removeAttribute("_echarts_instance_");
        const performancePiePieChart = echarts.init((document as HTMLElement | any).getElementById('performancePie'));
        // 绘制图表
        performancePiePieChart.setOption({
            color: [
                '#c1232b',
                '#27727b',
                '#fcce10',
                '#e87c25',
                '#b5c334',
                '#fe8463',
                '#9bca63',
                '#fad860',
                '#f3a43b',
                '#60c0dd',
                '#d7504b',
                '#c6e579',
                '#f4e001',
                '#f0805a',
                '#73a373',
                '#eedd78',
                '#7289ab',
                '#8dc1a9',
                '#ea7e53'
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
                    name: '单个塔型绩效组成',
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
                    data: detailData || []
                }
            ]
        });
    }

    return <>
        <Modal
            destroyOnClose
            key='CoefficientPerformance'
            visible={visible}
            title="绩效条目设置"
            footer={<Button onClick={() => {
                setVisible(false)
            }}>关闭</Button>}
            onCancel={() => { setVisible(false) }}>
            <ItemSetting ref={ref} />
        </Modal>
        <Form form={form} className={styles.bottom} layout="inline" onFinish={onSearch}>
            <Form.Item label='日期' name="updateStatusTime">
                <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item label='产品类型' name="productType" initialValue={''}>
                <Select style={{ width: '200px' }}>
                    <Select.Option value={''} key={0}>全部</Select.Option>
                    {productTypeOptions && productTypeOptions.map((item: any) => {
                        return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item label='模糊查询项' name="fuzzyMsg">
                <Input style={{ width: '400px' }} placeholder="塔型名称/放样任务编号/工程名称/计划号" />
            </Form.Item>
            <Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button htmlType="reset">重置</Button>
                </Space>
            </Form.Item>
        </Form>
        <Button type='primary' onClick={() => {
            setVisible(true);
        }} className={styles.bottom} ghost>绩效条目设置</Button>
        <Row gutter={12} className={styles.bottom}>
            <Col span={18}>
                <CommonTable
                    haveIndex
                    columns={columns}
                    dataSource={data}
                    scroll={{
                        y: 800
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
                />
            </Col>
            <Col span={6}>
                <div id={'performancePie'} style={{ width: '100%', height: '300px' }} key={'performancePie'} />
                <CommonTable
                    columns={itemColumns}
                    dataSource={detailData || []}
                    scroll={{
                        y: 600
                    }}
                    pagination={false} />

            </Col>
        </Row>
    </>
}