import React, { useState } from 'react'
import { Button, Col, Pagination, Row, Select, TableColumnProps,Table } from 'antd'
const { Option } = Select;
const AngleSteel = (): React.ReactNode => {
    // const history = useHistory()
    const [columnsData, setColumnsData] = useState([]);
    const [total, setTotal] = useState(0);
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
        },
        {
            key: 'projectName',
            title: '品名',
            dataIndex: 'projectName',
        },
        {
            key: 'projectNumber',
            title: '标准',
            dataIndex: 'projectNumber'
        },
        {
            key: 'projectType',
            title: '规格',
            dataIndex: 'projectType',
        },
        {
            key: 'bidBuyEndTime',
            title: '材质',
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '安全库存（吨）',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '告警库存（吨）',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_text: any, item: any, index: number): React.ReactNode => {
                return (
                    <div>
                        <span>编辑</span>
                    </div>
                )
            }
        }]


    return (
        <div className='public_page'>
            <Row className='search_content'>
                <Col
                    xxl={6}
                    xl={6}
                    md={12}
                    className='search_item'
                >
                    <span className='tip'>结算状态：</span>
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
                    <span className='tip'>结算状态：</span>
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
                    <span className='tip'>结算状态：</span>
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
                    <span className='tip'>结算状态：</span>
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
                    <span className='tip'>结算状态：</span>
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
                    <span className='tip'>结算状态：</span>
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
                <div className='func'>
                    <Button
                        className='func_item'
                        type='primary'
                    >导出</Button>
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
                    />
                </div>
            </div>
        </div>
    )
}

export default AngleSteel;