import React, { useState } from 'react'
import { Button, Col, Pagination, Row, Select, TableColumnProps, } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table';
const { Option } = Select;
const Warehouse = (): React.ReactNode => {
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
            title: '编号',
            dataIndex: 'projectName',
        },
        {
            key: 'projectNumber',
            title: '仓库名称',
            dataIndex: 'projectNumber'
        },
        {
            key: 'projectType',
            title: '分类',
            dataIndex: 'projectType',
        },
        {
            key: 'bidBuyEndTime',
            title: '负责人',
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '保管员',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'currentProjectStage',
            title: '车间',
            dataIndex: 'currentProjectStage',
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_text: any, item: any, index: number): React.ReactNode => {
                return (
                    <div>
                        <span>编辑</span>
                        <span>删除</span>
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
    )
}

export default Warehouse;