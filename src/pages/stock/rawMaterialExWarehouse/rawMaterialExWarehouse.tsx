import React, { useState } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { Page } from '../../common';
import { IClient } from '../../IClient';
import RequestUtil from '../../../utils/RequestUtil';
import '../StockPublicStyle.less';

export default function RawMaterialStock(): React.ReactNode {
    const history = useHistory()
    const [warehouseId, setWarehouseId] = useState('');
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(100);
    const [pageSize, setPageSize] = useState<number>(10);
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            width: 120,
        },
        {
            title: '领料编号',
            dataIndex: 'name',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '生产批次',
            dataIndex: 'receivingBatch',
            width: 120,
        }, {
            title: '状态',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '最新状态变更时间',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '申请人',
            dataIndex: 'key',
            width: 120,
        },
        {
            title: '操作',
            dataIndex: 'key',
            width: 120,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={``}>明细</Link>
                </Space>
            )
        }
    ]
    const Listdata = [
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        }, {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        }, {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
    ]
    return (
        <div id="RawMaterialStock">
            <div className="Search_public_Stock">
                <div className="search_item">
                    <span className="tip">仓库：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={warehouseId ? warehouseId : '请选择'}
                            onChange={(val) => { setWarehouseId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                仓库1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                仓库2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                仓库3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">材质：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={warehouseId ? warehouseId : '请选择'}
                            onChange={(val) => { setWarehouseId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                仓库1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                仓库2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                仓库3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">品名：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={warehouseId ? warehouseId : '请选择'}
                            onChange={(val) => { setWarehouseId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                仓库1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                仓库2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                仓库3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">标准：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={warehouseId ? warehouseId : '请选择'}
                            onChange={(val) => { setWarehouseId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                仓库1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                仓库2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                仓库3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">分类：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={warehouseId ? warehouseId : '请选择'}
                            onChange={(val) => { setWarehouseId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                仓库1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                仓库2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                仓库3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">长度：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={warehouseId ? warehouseId : '请选择'}
                            onChange={(val) => { setWarehouseId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                仓库1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                仓库2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                仓库3
                            </Select.Option>
                        </Select>-
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={warehouseId ? warehouseId : '请选择'}
                            onChange={(val) => { setWarehouseId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                仓库1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                仓库2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                仓库3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">规格：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={warehouseId ? warehouseId : '请选择'}
                            onChange={(val) => { setWarehouseId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                仓库1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                仓库2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                仓库3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <div className='search_Reset'>
                        <Button
                            className="btn"
                            type="primary"
                        >查询</Button>
                        <Button
                            className="btn"
                        >重置</Button>
                    </div>
                </div>
            </div>
            <div className="func_public_Stock">
                <Button
                    type="primary"
                >导出</Button>
            </div>
            <div className="tip_public_Stock">
                <div>数量合计：335,重量合计：555</div>
            </div>
            <div className="page_public_Stock">
                <Table
                    columns={columns}
                    dataSource={Listdata}
                    size='small'
                    rowClassName={(item, index) => {
                        return index % 2 ? 'aaa' : ''
                    }}
                    scroll={
                        {
                            y: 400
                        }
                    }
                    pagination={{
                        size: 'small',
                        defaultPageSize: 5,
                        showQuickJumper: true,
                        current: current,
                        total: total,
                        pageSize: pageSize,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            console.log(page, pageSize)
                            setCurrent(page);
                            setPageSize(Number(pageSize));
                        }
                    }}
                />
            </div>
        </div>
    )
}