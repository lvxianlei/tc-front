import React, { useState, useEffect } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { Page } from '../../common';
import { IClient } from '../../IClient';
import RequestUtil from '../../../utils/RequestUtil';
import '../StockPublicStyle.less';
import './modal.less';
const { RangePicker } = DatePicker;

export default function RawMaterialStock(): React.ReactNode {
    const history = useHistory()
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(100);
    const [pageSize, setPageSize] = useState<number>(10);
    const [dateValue, setDateValue] = useState<any>([]);//时间
    const [dateString, setDateString] = useState<any>([]);//时间字符串格式
    const [keyword, setKeyword] = useState<any>('');//关键字搜索
    const [status, setStatus] = useState('');//状态
    const [departmentId, setDepartmentId] = useState('');//部门
    const [personnelId, setPersonnelId] = useState('');//人员
    const [Listdata, setListdata] = useState<any[]>([]);//数据列表
    const [supplierListdata, setSupplierListdata] = useState<any[]>([{}]);//详情-供应商信息列表数据
    const [WarehousingListdata, setWarehousingListdata] = useState<any[]>([{}]);//详情-入库信息列表数据
    const [isEnterLibraryModal, setIsEnterLibraryModal] = useState<boolean>(false);//入库弹框显示
    const [warehouseId, setWarehouseId] = useState('');//入库弹框选择仓库
    const [locatorId, setLocatorId] = useState('');//入库弹框选择库位
    const [reservoirId, setReservoirId] = useState('');//入库弹框选择库位
    const [collect, setCollect] = useState('');//入库弹框输入炉批号
    const [isDetailModal, setIsDetailModal] = useState<boolean>(false);//详情弹框显示
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
            title: '余料出库编号',
            dataIndex: 'excessStockNumber',
            width: 120,
        }, {
            title: '生产批次',
            dataIndex: 'productionBatchNumber',
            width: 120,
        }, {
            title: '状态',
            dataIndex: 'receiveStatus',
            width: 120,
            render: (text: any, item: any, index: any) => {
                return <span>{text == 0 ? '待完成' : '已完成'}</span>
            }
        }, {
            title: '最新状态变更时间',
            dataIndex: 'key',
            width: 130,
        }, {
            title: '材质',
            dataIndex: 'materialTexture',
            width: 120,
        }, {
            title: '规格',
            dataIndex: 'spec',
            width: 120,
        }, {
            title: '应收余料长度',
            dataIndex: 'excessStockNumber',
            width: 120,
        }, {
            title: '实收余料长度',
            dataIndex: 'excessLength',
            width: 120,
        }, {
            title: '入库人',
            dataIndex: 'stockUser',
            width: 120,
        },
        {
            title: '操作',
            width: 120,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={() => { setIsEnterLibraryModal(true) }}>入库</Button>
                    <Button type='link' onClick={() => { setIsDetailModal(true) }}>详情</Button>
                </Space>
            )
        }
    ];//列表表头
    const supplierColumns = [
        {
            title: '收货单号',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                console.log(item, 'item')
                return <span>{index + 1}</span>
            }
        },
        {
            title: '供应商',
            dataIndex: 'productName',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '联系人',
            dataIndex: 'outStockItemStatus',
            width: 120,
        }, {
            title: '联系电话',
            dataIndex: 'createTime',
            width: 160,
        }, {
            title: '合同编号',
            dataIndex: 'spec',
            width: 120,
        }
    ];//详情-供应商列表表头
    const WarehousingColumns = [
        {
            title: '材质名称',
            dataIndex: 'id',
            width: 100,
            render: (text: any, item: any, index: any) => {
                console.log(item, 'item')
                return <span>{index + 1}</span>
            }
        },
        {
            title: '标准',
            dataIndex: 'productName',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '规格',
            dataIndex: 'outStockItemStatus',
            width: 120,
        }, {
            title: '材质',
            dataIndex: 'createTime',
            width: 160,
        }, {
            title: '长度',
            dataIndex: 'spec',
            width: 120,
        }, {
            title: '宽度',
            dataIndex: 'standard',
            width: 120,
        }, {
            title: '入库人',
            dataIndex: 'materialTexture',
            width: 120,
        }, {
            title: '入库时间',
            dataIndex: 'length',
            width: 120,
        }, {
            title: '炉批号',
            dataIndex: 'width',
            width: 120,
        }, {
            title: '仓库',
            dataIndex: 'weight',
            width: 120,
        }, {
            title: '库位',
            dataIndex: 'furnaceBatch',
            width: 120,
        }, {
            title: '库区',
            dataIndex: 'contractNumber',
            width: 120,
        }, {
            title: '备注',
            dataIndex: 'productCategoryId',
            width: 120,
        }
    ];//详情-入库表头
    //获取列表数据
    const loadData = async () => {
        console.log('请求数据')
        const data: any = await RequestUtil.get(`/tower-storage/receiveStock/excess`, {
            current,
            pageSize,
            keyword,
            dateString
        });
        setListdata(data.records);
        setTotal(data.total);
    }
    // 重置
    const reset = () => {
        setCurrent(1);
        setPageSize(10);
        setStatus('');
        setDateValue([]);
        setDateString([]);
        setKeyword('');
        setDepartmentId('');
        setPersonnelId('');
    }
    // 收货弹框取消
    const onReceivingCancel = () => {
        setIsEnterLibraryModal(false);
    }
    // 详情弹框取消
    const onDetailCancel = () => {
        setIsDetailModal(false)
    }
    //进入页面刷新
    useEffect(() => {
        loadData()
    }, [current, pageSize])
    return (
        <div id="RawMaterialStock">
            <div className="Search_public_Stock">
                <div className="search_item">
                    <span className="tip">最新状态变更时间：</span>
                    <div className='selectOrInput'>
                        <RangePicker
                            value={dateValue}
                            onChange={(date, dateString) => {
                                console.log(date, dateString)
                                setDateValue(date)
                                setDateString(dateString)
                            }}
                        ></RangePicker>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">状态：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={status ? status : '请选择'}
                            onChange={(val) => { setStatus(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                状态1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                状态2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                状态3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">入库人：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={departmentId ? departmentId : '请选择'}
                            onChange={(val) => { setDepartmentId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                部门1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                部门2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                部门3
                            </Select.Option>
                        </Select>-
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={personnelId ? personnelId : '请选择'}
                            onChange={(val) => { setPersonnelId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                人员1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                人员2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                人员3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">关键字：</span>
                    <div className='selectOrInput'>
                        <Input
                            placeholder="生产批次/余料入库编号"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value)
                            }}
                        >
                        </Input>
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
                            type="primary"
                            ghost
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
            {/* 入库弹框 */}
            <Modal
                className="enter_library_modal"
                visible={isEnterLibraryModal}
                title="入库"
                maskClosable={false}
                onCancel={onReceivingCancel}
                footer={
                    <>
                        <Button onClick={onReceivingCancel}>关闭</Button>
                        <Button type='primary' onClick={() => { }}>保存并提交</Button>
                    </>
                }
            >
                <div className="receiving_info">
                    <div className="part">
                        <div className="item">
                            <div className='tip'>收货批次</div>
                            <div className='info'>
                                1255666
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>仓库<span>*</span></div>
                            <div className='info'>
                                <Select
                                    className="select"
                                    style={{ width: "100%" }}
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
                                        仓库12
                                    </Select.Option>
                                    <Select.Option
                                        value="3"
                                    >
                                        仓库13
                                    </Select.Option>
                                </Select>
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>库位<span>*</span></div>
                            <div className='info'>
                                <Select
                                    className="select"
                                    style={{ width: "100%" }}
                                    value={locatorId ? locatorId : '请选择'}
                                    onChange={(val) => { setLocatorId(val) }}
                                >
                                    <Select.Option
                                        value="1"
                                    >
                                        库位1
                                    </Select.Option>
                                    <Select.Option
                                        value="2"
                                    >
                                        库位2
                                    </Select.Option>
                                    <Select.Option
                                        value="3"
                                    >
                                        库位3
                                    </Select.Option>
                                </Select>
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>应收余料</div>
                            <div className='info'>
                                自动获取
                            </div>
                        </div>
                    </div>
                    <div className="part">
                        <div className="item">
                            <div className="tip"></div>
                            <div className="info"></div>
                        </div>
                        <div className="item">
                            <div className='tip'>库区<span>*</span></div>
                            <div className='info'>
                                <Select
                                    className="select"
                                    style={{ width: "100%" }}
                                    value={reservoirId ? reservoirId : '请选择'}
                                    onChange={(val) => { setReservoirId(val) }}
                                >
                                    <Select.Option
                                        value="1"
                                    >
                                        库区1
                                    </Select.Option>
                                    <Select.Option
                                        value="2"
                                    >
                                        库区12
                                    </Select.Option>
                                    <Select.Option
                                        value="3"
                                    >
                                        库区13
                                    </Select.Option>
                                </Select>
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>炉批号<span>*</span></div>
                            <div className='info'>
                                自动获取
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>实收余料</div>
                            <div className='info'>
                                <Input
                                    placeholder='请输入'
                                    value={collect}
                                    onChange={(e) => {
                                        setCollect(e.target.value)
                                    }}
                                ></Input>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* 详情弹框 */}
            <Modal
                className="Detail_modal"
                visible={isDetailModal}
                title="详情"
                width={1000}
                maskClosable={false}
                onCancel={onDetailCancel}
                footer={
                    <>
                        <Button onClick={onDetailCancel}>关闭</Button>
                    </>
                }
            >
                <div className="supplier_info">
                    <div className="title">供应商信息</div>
                    <div className="table_wrap">
                        <Table
                            columns={supplierColumns}
                            dataSource={supplierListdata}
                            size='small'
                            rowClassName={(item, index) => {
                                return index % 2 ? 'aaa' : ''
                            }}
                            scroll={
                                {
                                    y: 400
                                }
                            }
                            pagination={false}
                        />
                    </div>
                </div>
                <div className="Warehousing_info">
                    <div className="title">入库信息</div>
                    <div className="table_wrap">
                        <Table
                            columns={WarehousingColumns}
                            dataSource={WarehousingListdata}
                            size='small'
                            rowClassName={(item, index) => {
                                return index % 2 ? 'aaa' : ''
                            }}
                            scroll={
                                {
                                    y: 400
                                }
                            }
                            pagination={false}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}