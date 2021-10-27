import React, { useState, useEffect } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
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
        [materialTexture, setMaterialTexture] = useState(''),//材质
        [productName, setProductName] = useState(''),//品名
        [standard, setStandard] = useState(''),//标准
        [classify, setClassify] = useState(''),//分类
        [lengthMin, setLengthMin] = useState(''),//长度
        [lengthMax, setLengthMax] = useState(''),//长度2
        [spec, setSpec] = useState(''),//规格
        [Listdata, setListdata] = useState<any[]>([]),//列表数据
        [weight, setWeight] = useState<number>(0),//合计重量
        [quantity, setQuantity] = useState<number>(0)//合计数量
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                console.log(item, 'item')
                return <span>{index + 1}</span>
            }
        },
        {
            title: '所在仓库',
            dataIndex: 'warehouseName',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '收货批次',
            dataIndex: 'receiveBatchNumber',
            width: 120,
        }, {
            title: '库位',
            dataIndex: 'locatorName',
            width: 120,
        }, {
            title: '区位',
            dataIndex: 'reservoirName',
            width: 120,
        }, {
            title: '物料编码',
            dataIndex: 'materialCode',
            width: 120,
        }, {
            title: '分类',
            dataIndex: 'classify',
            width: 120,
        }, {
            title: '标准',
            dataIndex: 'standard',
            width: 120,
        }, {
            title: '品名',
            dataIndex: 'productName',
            width: 120,
        }, {
            title: '材质',
            dataIndex: 'materialTexture',
            width: 120,
        }, {
            title: '规格',
            dataIndex: 'spec',
            width: 120,
        }, {
            title: '长度',
            dataIndex: 'length',
            width: 120,
        }, {
            title: '宽度',
            dataIndex: 'width',
            width: 120,
        },
        {
            title: '操作',
            dataIndex: 'key',
            width: 120,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    {/* <Link to={``}>质保单</Link>
                    <Link to={``}>质检单</Link> */}
                    <span>质保单</span>
                    <span>质检单</span>
                </Space>
            )
        }
    ]

    // 计算重量
    let calculation = (data: any) => {
        let weight = 0;
        let quantity = 0;
        data.map((item: any, index: any) => {
            weight = weight + Number(item.weight ? item.weight : 0)
            quantity = quantity + Number(item.quantity ? item.quantity : 0)
        })
        console.log(weight)
        console.log(quantity)
        setWeight(weight);
        setQuantity(quantity);
    }
    //获取列表数据
    const loadData = async () => {
        console.log('请求数据')
        const data: any = await RequestUtil.get(`/tower-storage/materialStock`, {
            current,
            pageSize,
            warehouseId,
            materialTexture,
            productName,
            standard,
            classify,
            lengthMin,
            lengthMax,
            spec,
        });
        console.log(data, 'res')
        setListdata(data.records);
        setTotal(data.total);
        calculation(Listdata)
    }
    // 重置
    const reset = () => {
        setCurrent(1);
        setPageSize(10);
        setWarehouseId('');
        setMaterialTexture('');
        setProductName('');
        setStandard('');
        setClassify('');
        setLengthMin('');
        setLengthMax('');
        setSpec('');
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
                            value={materialTexture ? materialTexture : '请选择'}
                            onChange={(val) => { setMaterialTexture(val) }}
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
                            value={productName ? productName : '请选择'}
                            onChange={(val) => { setProductName(val) }}
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
                            value={standard ? standard : '请选择'}
                            onChange={(val) => { setStandard(val) }}
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
                            value={classify ? classify : '请选择'}
                            onChange={(val) => { setClassify(val) }}
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
                            value={lengthMin ? lengthMin : '请选择'}
                            onChange={(val) => { setLengthMin(val) }}
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
                            value={lengthMax ? lengthMax : '请选择'}
                            onChange={(val) => { setLengthMax(val) }}
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
                            value={spec ? spec : '请选择'}
                            onChange={(val) => { setSpec(val) }}
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
                            onClick={() => { loadData() }}
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
                    className='func_btn'
                >导出</Button>
            </div>
            <div className="tip_public_Stock">
                <div>数量合计：{quantity},重量合计：{weight}</div>
            </div>
            <div className="page_public_Stock">
                <Table
                    columns={columns}
                    dataSource={Listdata}
                    size='small'
                    className="table_antd_wrap"
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