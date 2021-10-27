/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Table, Pagination, TableColumnProps, Row, Col, Select, } from 'antd'
import RequestUtil from '../../../utils/RequestUtil';
import ApplicationContext from "../../../configuration/ApplicationContext"
const { Option } = Select;
const ViewPanel = (): React.ReactNode => {
    // const history = useHistory()
    const [columnsData, setColumnsData] = useState<any[]>([{}]);
    const [total, setTotal] = useState(0);
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (text, item, index) => {
                return <span>{index + 1}</span>
            }
        },
        {
            key: 'productName',
            title: '品名',
            dataIndex: 'productName',
        },
        {
            key: 'standard',
            title: '标准',
            dataIndex: 'standard'
        },
        {
            key: 'spec',
            title: '规格',
            dataIndex: 'spec',
        },
        {
            key: 'materialTexture',
            title: '材质',
            dataIndex: 'materialTexture'
        },
        {
            key: 'stockWeight',
            title: '库存重量（吨）',
            dataIndex: 'stockWeight'
        },
        {
            key: 'onWayWeight',
            title: '在途重量（吨）',
            dataIndex: 'onWayWeight'
        },
        {
            key: 'canUseWeight',
            title: '可用库存（吨）',
            dataIndex: 'canUseWeight'
        },
        {
            key: 'noPickWeight',
            title: '生产未领料（吨）',
            dataIndex: 'noPickWeight'
        },
        {
            key: 'safeWeight',
            title: '安全库存（吨）',
            dataIndex: 'safeWeight'
        },
        {
            key: 'alarmWeight',
            title: '告警库存（吨）',
            dataIndex: 'alarmWeight'
        },
        {
            key: 'currentProjectStage',
            title: '库存状态',
            dataIndex: 'currentProjectStage',
            render: (text, item: any, index) => {
                return (
                    <div>
                        {
                            item.type === 0 ?
                                <span style={{ padding: '5px 8px', backgroundColor: 'yello', color: '#fff' }}>告警库存</span> :
                                item.type === 1 ?
                                    <span style={{ padding: '5px 8px', backgroundColor: 'red', color: '#fff' }}>可用库存</span> :
                                    <span></span>
                        }
                    </div>
                )
            }
        },
    ]
    useEffect(() => {
        getColumnsData()
    }, [current, size]);
    const getColumnsData = async () => {
        const data: any = await RequestUtil.get('/tower-storage/safetyStock/board', {
            current,
            size,
        })
        setTotal(data.data)
        setColumnsData(data.records)
    }

    return (
        <div className='public_page'>
            <Row className='search_content'>
                <Col
                    xxl={6}
                    xl={6}
                    md={12}
                    className='search_item'
                >
                    <span className='tip'>材质：</span>
                    <Select
                        className='input'
                        // value={this.state.entryStatus}
                        style={{ width: 120 }}
                        onChange={(value) => {
                        }}
                    >
                        {
                            (ApplicationContext.get().dictionaryOption as any)["111"].map((item: { id: string, name: string }) => ({
                                value: item.id,
                                label: item.name
                            })).map(() => {
                                return (
                                    <Option value={''}>全部</Option>
                                )
                            })
                        }
                    </Select>
                </Col>
                <Col
                    xxl={6}
                    xl={6}
                    md={12}
                    className='search_item'
                >
                    <span className='tip'>标准：</span>
                    <Select
                        className='input'
                        // value={this.state.entryStatus}
                        style={{ width: 120 }}
                        onChange={(value) => {
                        }}
                    >
                        <Option value={''}>全部</Option>
                        <Option value={0}>未生成</Option>
                        <Option value={1}>已生成</Option>
                    </Select>
                </Col>
                <Col
                    xxl={6}
                    xl={6}
                    md={12}
                    className='search_item'
                >
                    <span className='tip'>品名：</span>
                    <Select
                        className='input'
                        // value={this.state.entryStatus}
                        style={{ width: 120 }}
                        onChange={(value) => {
                        }}
                    >
                        <Option value={''}>全部</Option>
                        <Option value={0}>未生成</Option>
                        <Option value={1}>已生成</Option>
                    </Select>
                </Col>
                <Col
                    xxl={6}
                    xl={6}
                    md={12}
                    className='search_item'
                >
                    <span className='tip'>规格：</span>
                    <Select
                        className='input'
                        // value={this.state.entryStatus}
                        style={{ width: 120 }}
                        onChange={(value) => {
                        }}
                    >
                        <Option value={''}>全部</Option>
                        <Option value={0}>未生成</Option>
                        <Option value={1}>已生成</Option>
                    </Select>
                </Col>
                <Col
                    xxl={6}
                    xl={6}
                    md={12}
                    className='search_item'
                >
                    <span className='tip'>库存情况：</span>
                    <Select
                        className='input'
                        // value={this.state.entryStatus}
                        style={{ width: 120 }}
                        onChange={(value) => {
                        }}
                    >
                        <Option value={''}>全部</Option>
                        <Option value={0}>未生成</Option>
                        <Option value={1}>已生成</Option>
                    </Select>
                </Col>
                <Col
                    className='search_btn_box'
                >
                    <Button
                        className='btn_item'
                    >重置</Button>
                </Col>
            </Row>
            <div className='public_content'>
                <div className='func_box'>
                    <div className='func'>
                        <Button
                            className='func_item'
                            type='primary'
                        >导出</Button>
                    </div>
                    <div className='func_right'>
                        <Button
                            className='func_right_item'
                        >创建</Button>
                        <Button
                            className='func_right_item'
                        >返回上一级</Button>
                    </div>
                </div>
                <Table
                    className='public_table'
                    scroll={{ x: true }}
                    columns={columns}
                    dataSource={columnsData}
                    pagination={false}
                    size='small'
                />
                <div className='page_content'>
                    <Pagination
                        className='page'
                        showSizeChanger
                        showQuickJumper
                        total={total}
                        pageSize={size}
                        current={current}
                        onChange={(page: number, size: any) => {
                            setCurrent(page)
                            setSize(size)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ViewPanel;