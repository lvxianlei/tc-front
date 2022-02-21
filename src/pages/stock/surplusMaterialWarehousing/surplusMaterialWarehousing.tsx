import React, { useState, useEffect } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { Link, useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { Page } from '../../common';
import { IClient } from '../../IClient';
import RequestUtil from '../../../utils/RequestUtil';
import ApplicationContext from "../../../configuration/ApplicationContext";
import AuthUtil from '../../../utils/AuthUtil';
import ExportList from '../../../components/export/list';
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
    const [status, setStatus] = useState(`${(history.location.state as any)?.excessStockStatus || ""}`)//状态
    const [departmentId, setDepartmentId] = useState('');//部门
    const [personnelId, setPersonnelId] = useState('');//人员
    const [Listdata, setListdata] = useState<any[]>([]);//数据列表
    const [supplierListdata, setSupplierListdata] = useState<any[]>([{}]);//详情-供应商信息列表数据
    const [WarehousingListdata, setWarehousingListdata] = useState<any[]>([{}]);//详情-入库信息列表数据
    const [isEnterLibraryModal, setIsEnterLibraryModal] = useState<boolean>(false);//入库弹框显示
    const [warehouseId, setWarehouseId] = useState('');//入库弹框选择仓库
    const [locatorId, setLocatorId] = useState('');//入库弹框选择库位
    const [reservoirId, setReservoirId] = useState('');//入库弹框选择库区
    const [collect, setCollect] = useState('');//入库弹框输入实收余料
    const [ListFurnaceBatchNo, setListFurnaceBatchNo] = useState('');//入库弹框展示炉批号
    const [ListProductionBatchNumber, setListProductionBatchNumber] = useState('');//入库弹框展示收货批次
    const [ListReceivableSurplus, setListReceivableSurplus] = useState('');//入库弹框展示应收余料
    const [ListID, setListID] = useState('');//入库弹框展shiyongid
    const [isDetailModal, setIsDetailModal] = useState<boolean>(false);//详情弹框显示
    const [Warehouse, setWarehouse] = useState<any[]>([]);//入库仓库数据
    const [ReservoirArea, setReservoirArea] = useState<any[]>([]);//入库库区数据
    const [Location, setLocation] = useState<any[]>([]);//入库库位数据
    const [departmentList, setDepartmentList] = useState<any[]>([]);//部门数据
    const [userList, setuserList] = useState<any[]>([]);//申请人数据数据
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [isExport, setIsExportStoreList] = useState(false)
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
            title: '余料入库编号',
            dataIndex: 'excessStockNumber',
            width: 120,
        }, {
            title: '生产批次',
            dataIndex: 'productionBatchNumber',
            width: 120,
        }, {
            title: '状态',
            dataIndex: 'excessStockStatus',
            width: 120,
            render: (text: any, item: any, index: any) => {
                return <span>{item.excessStockStatus == 0 ? '待完成' : '已完成'}</span>
            }
        }, {
            title: '最新状态变更时间',
            dataIndex: 'updateTime',
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
            dataIndex: 'excessLength',
            width: 120,
            render: (text: any, item: any, index: any) => {
                return <span>{item.excessLength == -1 ? '' : item.excessLength}</span>
            }
        }, {
            title: '实收余料长度',
            dataIndex: 'length',
            width: 120,
            render: (text: any, item: any, index: any) => {
                return <span>{item.length == -1 ? '' : item.length}</span>
            }
        }, {
            title: '入库人',
            dataIndex: 'stockUserName',
            width: 120,
        },
        {
            title: '操作',
            width: 110,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    {
                        record.excessStockStatus == 0 ?
                            <Button type='link' onClick={() => { ReceivingBtn(record) }}>入库</Button> :
                            <Button type='link' onClick={() => { getDetail(record.id) }}>详情</Button>
                    }
                </Space>
            )
        }
    ];//列表表头
    const supplierColumns = [
        {
            title: '收货单号',
            dataIndex: 'receiveNumber',
            width: 50,
        },
        {
            title: '供应商',
            dataIndex: 'supplierName',
            width: 120,
        }, {
            title: '联系人',
            dataIndex: 'contactsUser',
            width: 120,
        }, {
            title: '联系电话',
            dataIndex: 'contactsPhone',
            width: 160,
        }, {
            title: '合同编号',
            dataIndex: 'contractNumber',
            width: 120,
        }
    ];//详情-供应商列表表头
    const WarehousingColumns = [
        {
            title: '材质名称',
            dataIndex: 'materialTexture',
            width: 100,
        },
        {
            title: '标准',
            dataIndex: 'standard',
            width: 120,
        }, {
            title: '规格',
            dataIndex: 'spec',
            width: 120,
        }, {
            title: '材质',
            dataIndex: 'materialTexture',
            width: 160,
        }, {
            title: '长度',
            dataIndex: 'length',
            width: 120,
        }, {
            title: '宽度',
            dataIndex: 'width',
            width: 120,
        }, {
            title: '入库人',
            dataIndex: 'stockUserName',
            width: 120,
        }, {
            title: '入库时间',
            dataIndex: 'updateTime',
            width: 120,
        }, {
            title: '炉批号',
            dataIndex: 'furnaceBatchNumber',
            width: 120,
        }, {
            title: '仓库',
            dataIndex: 'warehouseName',
            width: 120,
        }, {
            title: '库位',
            dataIndex: 'locatorName',
            width: 120,
        }, {
            title: '库区',
            dataIndex: 'reservoirName',
            width: 120,
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: 120,
        }
    ];//详情-入库表头
    //获取列表数据
    const loadData = async () => {
        console.log('请求数据')
        const data: any = await RequestUtil.get(`/tower-storage/receiveStock/excess`, {
            current,
            pageSize,
            selectName: keyword,
            updateTimeStart: dateString[0] ? dateString[0] + ' 00:00:00' : '',
            updateTimeEnd: dateString[1] ? dateString[1] + ' 23:59:59' : '',
            departmentId: departmentId,
            stockUser: personnelId,
            excessStockStatus: status
        });
        setListdata(data.records);
        setTotal(data.total);
    }
    // 获取详情数据
    const getDetail = async (id: any) => {
        const data: any = await RequestUtil.get(`/tower-storage/receiveStock/excess/${id}`);
        setSupplierListdata([data]);
        setWarehousingListdata([data]);
        setIsDetailModal(true)
    }
    // 入库按钮
    const ReceivingBtn = async (record: any) => {
        await getWarehousing('', 0)
        setListFurnaceBatchNo(record.furnaceBatchNo)
        setListProductionBatchNumber(record.receiveBatchNumber)
        setListReceivableSurplus(record.excessLength)
        setListID(record.id)
        setIsEnterLibraryModal(true)
    }
    // 收货
    const Receiving = async () => {
        if (!warehouseId) {
            message.error('请选择仓库')
            return
        }
        if (!reservoirId) {
            message.error('请选择库区')
            return
        }
        if (!locatorId) {
            message.error('请选择库位')
            return
        }
        if (!collect) {
            message.error('请输入实收余料')
            return
        }
        if (Number(collect) > Number(ListReceivableSurplus)) {
            message.error('实收余料不得大于应收余料')
            return
        }
        const data: any = await RequestUtil.put(`/tower-storage/receiveStock/excess`, {
            id: ListID,
            length: collect,
            locatorId: locatorId
        });
        if (data) {
            onReceivingCancel()
            loadData()
        }
    }
    // 获取仓库/库区/库位
    const getWarehousing = async (id?: any, type?: any) => {
        const data: any = await RequestUtil.get(`/tower-storage/warehouse/tree`, {
            id,
            type,
        });
        switch (type) {
            case 0:
                setWarehouse(data)
                break;
            case 1:
                setReservoirArea(data)
                break;
            case 2:
                setLocation(data)
                break;
            default:
                break;
        }
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
        setCollect('')
        setLocatorId('')
        setLocatorId('')
        setReservoirId('')
        setWarehouse([])
        setReservoirArea([])
        setLocation([])
        setWarehouseId('')
    }
    // 详情弹框取消
    const onDetailCancel = () => {
        setIsDetailModal(false)
    }
    //获取部门数据
    const getDepartment = async () => {
        const data: any = await RequestUtil.get(`/sinzetech-user/department`, {
            tenantId: AuthUtil.getTenantId(),
        });
        setDepartmentList(data)
    }
    //获取部门部门中的人
    const getUser = async (department: any) => {
        const data: any = await RequestUtil.get(`/sinzetech-user/user`, {
            departmentId: department,
        });
        setuserList(data.records)
    }
    // 入库部门选择
    const departmentChange = async (val: any) => {
        console.log(val, 'valvalvalvalval')
        await setDepartmentId(val);
        await setPersonnelId('');
        await setuserList([]);
        if (val) {
            await getUser(val);
        }
    }

    //进入页面刷新
    useEffect(() => {
        getDepartment()
    }, [])
    //进入页面刷新
    useEffect(() => {
        loadData()
    }, [current, pageSize, dateString, departmentId, personnelId, status])
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
                            value={status ? status : ''}
                            onChange={(val) => { setStatus(val) }}
                        >
                            <Select.Option key={'dd'} value=''>全部</Select.Option>
                            <Select.Option
                                value="0"
                            >
                                待完成
                            </Select.Option>
                            <Select.Option
                                value="1"
                            >
                                已完成
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
                            value={departmentId ? departmentId : ''}
                            onChange={(val) => { departmentChange(val) }}
                        >
                            <Select.Option key={'dd'} value=''>全部</Select.Option>
                            {
                                departmentList.map((item, index) => {
                                    return (
                                        <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                                    )
                                })
                            }
                        </Select>-
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={personnelId ? personnelId : ''}
                            onChange={(val) => { setPersonnelId(val) }}
                        >
                            <Select.Option key={'ds'} value=''>全部</Select.Option>
                            {
                                userList.map((item, index) => {
                                    return (
                                        <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                                    )
                                })
                            }
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
                            onPressEnter={() => {
                                loadData()
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
                    onClick={()=>{setIsExportStoreList(true)}}
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
                        <Button type='primary' onClick={() => { Receiving() }}>保存并提交</Button>
                    </>
                }
            >
                <div className="receiving_info">
                    <div className="part">
                        <div className="item">
                            <div className='tip'>收货批次</div>
                            <div className='info'>
                                {ListProductionBatchNumber}
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>仓库<span>*</span></div>
                            <div className='info'>
                                <Select
                                    className="select"
                                    style={{ width: "100%" }}
                                    value={warehouseId ? warehouseId : '请选择'}
                                    onChange={(val) => { setWarehouseId(val); getWarehousing(val, 1) }}
                                >
                                    {
                                        Warehouse.map((item, index) => {
                                            return (
                                                <Select.Option
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })
                                    }
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
                                    {
                                        Location.map((item, index) => {
                                            return (
                                                <Select.Option
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>应收余料</div>
                            <div className='info'>
                                {ListReceivableSurplus}
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
                                    onChange={(val) => { setReservoirId(val); getWarehousing(val, 2) }}
                                >
                                    {
                                        ReservoirArea.map((item, index) => {
                                            return (
                                                <Select.Option
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>炉批号<span>*</span></div>
                            <div className='info'>
                                {ListFurnaceBatchNo}
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>实收余料</div>
                            <div className='info'>
                                <Input
                                    placeholder='请输入'
                                    value={collect}
                                    onChange={(e) => {
                                        setCollect(e.target.value.replace(/[^0-9]/g, ''))
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
            {isExport?<ExportList
                history={history}
                location={location}
                match={match}
                columnsKey={() => {
                    let keys = [...columns]
                    keys.pop()
                    return keys
                }}
                current={current}
                size={pageSize}
                total={total}
                url={`/tower-storage/receiveStock/excess`}
                serchObj={{
                    selectName: keyword,
                    updateTimeStart: dateString[0] ? dateString[0] + ' 00:00:00' : '',
                    updateTimeEnd: dateString[1] ? dateString[1] + ' 23:59:59' : '',
                    departmentId: departmentId,
                    stockUser: personnelId,
                    excessStockStatus: status
                }}
                closeExportList={() => { setIsExportStoreList(false) }}
            />:null}
        </div>
    )
}