import React, { useState } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { Link, useHistory } from 'react-router-dom';
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
        },
        {
            title: '所在仓库',
            dataIndex: 'name',
            key: 'name',
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '收货批次',
            dataIndex: 'receivingBatch',
        }, {
            title: '库位',
            dataIndex: 'key',
        }, {
            title: '区位',
            dataIndex: 'key',
        }, {
            title: '物料编码',
            dataIndex: 'key',
        }, {
            title: '分类',
            dataIndex: 'key',
        }, {
            title: '标准',
            dataIndex: 'key',
        }, {
            title: '品名',
            dataIndex: 'key',
        }, {
            title: '材质',
            dataIndex: 'key',
        }, {
            title: '规格',
            dataIndex: 'key',
        }, {
            title: '长度',
            dataIndex: 'key',
        }, {
            title: '宽度',
            dataIndex: 'key',
        },
        {
            title: '操作',
            dataIndex: 'key',
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={``}>质保单</Link>
                    <Link to={``}>质检单</Link>
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