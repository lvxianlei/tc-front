import React, { useState, useEffect } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { Page } from '../../common';
import { IClient } from '../../IClient';
import RequestUtil from '../../../utils/RequestUtil';
import '../StockPublicStyle.less';

export default function RawMaterialStock(): React.ReactNode {
    const history = useHistory(),
        [current, setCurrent] = useState(1),
        [total, setTotal] = useState(100),
        [pageSize, setPageSize] = useState<number>(10),
        [warehouseId, setWarehouseId] = useState(''),//仓库
        [textureId, setTextureId] = useState(''),//材质
        [productId, setProductId] = useState(''),//品名
        [standardId, setStandardId] = useState(''),//标准
        [classificationId, setClassificationId] = useState(''),//分类
        [lengthId, setLengthId] = useState(''),//长度
        [lengthTowId, setLengthTowId] = useState(''),//长度2
        [specificationsId, setSpecificationsId] = useState('')//规格
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
        },
        {
            title: '所在仓库',
            dataIndex: 'name',
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
            width: 120,
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
            key: '2',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '3',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '4',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '5',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '6',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '7',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '8',
            receivingBatch: '2021-1223-TT'
        }, {
            name: '仓库1',
            key: '9',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '10',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '11',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '12',
            receivingBatch: '2021-1223-TT'
        }, {
            name: '仓库1',
            key: '13',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '14',
            receivingBatch: '2021-1223-TT'
        },
    ]
    //获取列表数据
    const loadData = async () => {
        console.log('请求数据')
        const data: any[] = await RequestUtil.get(`/tower-system/dictionary/allDictionary`, {
            current,
            pageSize,
        });
    }
    // 重置
    const reset = () => {
        setCurrent(1);
        setPageSize(10);
        setWarehouseId('');
        setTextureId('');
        setProductId('');
        setStandardId('');
        setClassificationId('');
        setLengthId('');
        setLengthTowId('');
        setSpecificationsId('');
    }
    //进入页面刷新
    useEffect(() => {
        loadData()
    }, [current, pageSize])
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
                            value={textureId ? textureId : '请选择'}
                            onChange={(val) => { setTextureId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                材质1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                材质2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                材质3
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
                            value={productId ? productId : '请选择'}
                            onChange={(val) => { setProductId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                品名1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                品名2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                品名3
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
                            value={standardId ? standardId : '请选择'}
                            onChange={(val) => { setStandardId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                标准1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                标准2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                标准3
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
                            value={classificationId ? classificationId : '请选择'}
                            onChange={(val) => { setClassificationId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                分类1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                分类2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                分类3
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
                            value={lengthId ? lengthId : '请选择'}
                            onChange={(val) => { setLengthId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                长度1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                长度2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                长度3
                            </Select.Option>
                        </Select>-
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={lengthTowId ? lengthTowId : '请选择'}
                            onChange={(val) => { setLengthTowId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                长度1-1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                长度1-2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                长度1-3
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
                            value={specificationsId ? specificationsId : '请选择'}
                            onChange={(val) => { setSpecificationsId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                规格1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                规格2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                规格3
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
                            onClick={reset}
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