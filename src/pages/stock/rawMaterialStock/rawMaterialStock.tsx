import React, { useState, useEffect } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { Page } from '../../common';
import { IClient } from '../../IClient';
import RequestUtil from '../../../utils/RequestUtil';
import ApplicationContext from "../../../configuration/ApplicationContext"
import ExportList from '../../../components/export/list';
import '../StockPublicStyle.less';
import { materialStandardTypeOptions, materialTextureOptions } from '../../../configuration/DictionaryOptions';

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
        [warehouseList, setWarehouseList] = useState<any>([]),//筛选仓库数据
        [weight, setWeight] = useState<number | string>(0),//合计重量
        [quantity, setQuantity] = useState<number | string>(0);//合计数量
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [isExport, setIsExportStoreList] = useState(false)
    // console.log((ApplicationContext.get().dictionaryOption as any)["111"],'ssss')
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '所在仓库',
            dataIndex: 'warehouseName',
            width: 120,
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
        }, 
        {
            title: '供应商',
            dataIndex: 'supplierName',
            width: 120,
        },
        {
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
            title: '长度(mm)',
            dataIndex: 'length',
            width: 120,
        }, {
            title: '宽度(mm)',
            dataIndex: 'width',
            width: 120,
        }, {
            title: '数量',
            dataIndex: 'quantity',
            width: 120,
        }, {
            title: '重量',
            dataIndex: 'weight',
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


    //获取列表数据
    const loadData = async () => {
        const data: any = await RequestUtil.get(`/tower-storage/materialStock`, {
            current,
            size: pageSize,
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
        setListdata(data.materialStockPage.records);
        setWeight(data.weight)
        setQuantity(data.quantity);
        console.log(data.total)
        setTotal(data.materialStockPage.total);
    }
    // 获取仓库/库区/库位
    const getWarehousing = async (id?: any, type?: any) => {
        const data: any = await RequestUtil.get(`/tower-storage/warehouse/tree`, {
            type: 0,
        });
        if (data) {
            setWarehouseList(data)
        }
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
    useEffect(() => {
        getWarehousing()
    }, [])
    //进入页面刷新
    useEffect(() => {
        loadData()
    }, [current, pageSize, spec, warehouseId, materialTexture, productName, standard, classify, lengthMax])
    return (
        <div id="RawMaterialStock">
            <div className="Search_public_Stock">
                <div className="search_item">
                    <span className="tip">仓库：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={warehouseId ? warehouseId : ''}
                            onChange={(val) => { setWarehouseId(val) }}
                        >
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                warehouseList.map((item: { id: string, name: string }) => ({
                                    value: item.id,
                                    label: item.name
                                })).map((item: any, index: number) => {
                                    return (
                                        <Select.Option value={item.value} key={index}>{item.label}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">材质：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={materialTexture ? materialTexture : ''}
                            onChange={(val) => { setMaterialTexture(val) }}
                        >
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                materialTextureOptions?.map((item: { id: string, name: string }) => ({
                                    value: item.id,
                                    label: item.name
                                })).map((item: any, index: number) => {
                                    return (
                                        <Select.Option key={index} value={item.label}>{item.label}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">品名：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={productName ? productName : ''}
                            onChange={(val) => { setProductName(val) }}
                        >
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                (ApplicationContext.get().dictionaryOption as any)["140"].map((item: { id: string, name: string }) => ({
                                    value: item.id,
                                    label: item.name
                                })).map((item: any, index: number) => {
                                    return (
                                        <Select.Option key={index} value={item.label}>{item.label}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">标准：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={standard ? standard : ''}
                            onChange={(val) => { setStandard(val) }}
                        >
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                materialStandardTypeOptions?.map((item: { id: string, name: string }) => ({
                                    value: item.id,
                                    label: item.name
                                })).map((item: any, index: number) => {
                                    return (
                                        <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">分类：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={classify ? classify : ''}
                            onChange={(val) => { setClassify(val) }}
                        >
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                (ApplicationContext.get().dictionaryOption as any)["141"].map((item: { id: string, name: string }) => ({
                                    value: item.id,
                                    label: item.name
                                })).map((item: any, index: number) => {
                                    return (
                                        <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">长度：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={lengthMin ? lengthMin : ''}
                            onChange={(val) => { setLengthMin(val) }}
                        >
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                (ApplicationContext.get().dictionaryOption as any)["142"].map((item: { id: string, name: string }) => ({
                                    value: item.id,
                                    label: item.name
                                })).map((item: any, index: number) => {
                                    return (
                                        <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                                    )
                                })
                            }
                        </Select>-
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={lengthMax ? lengthMax : ''}
                            onChange={(val) => { setLengthMax(val) }}
                        >
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                (ApplicationContext.get().dictionaryOption as any)["142"].map((item: { id: string, name: string }) => ({
                                    value: item.id,
                                    label: item.name
                                })).map((item: any, index: number) => {
                                    return (
                                        <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">规格：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={spec ? spec : ''}
                            onChange={(val) => { setSpec(val) }}
                        >
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                (ApplicationContext.get().dictionaryOption as any)["143"].map((item: { id: string, name: string }) => ({
                                    value: item.id,
                                    label: item.name
                                })).map((item: any, index: number) => {
                                    return (
                                        <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                                    )
                                })
                            }
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
                    onClick={()=>{setIsExportStoreList(true)}}
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
                    rowKey="id"
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
            {isExport?<ExportList
                history={history}
                location={location}
                match={match}
                columnsKey={() => {
                    let keys = [...columns]
                    keys.pop()
                    return keys
                }}
                current={0}
                size={0}
                total={0}
                url={`/tower-storage/materialStock`}
                serchObj={{}}
                closeExportList={() => { setIsExportStoreList(false) }}
            />:null}
        </div>
    )
}