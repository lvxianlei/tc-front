import React, { useState, useEffect } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { Link, useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../../utils/RequestUtil';
import AuthUtil from '../../../../utils/AuthUtil';
import ExportList from '../../../../components/export/list';
import '../../StockPublicStyle.less';
import './detail.less';
import { materialStandardTypeOptions, materialTextureOptions } from '../../../../configuration/DictionaryOptions';

const { RangePicker } = DatePicker;
/**
 * 新增(批号、质保书号、轧制批号)
 */
export default function RawMaterialStock(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const history = useHistory(),
        [current, setCurrent] = useState(1),
        [total, setTotal] = useState(0),
        [pageSize, setPageSize] = useState<number>(10),
        [status, setStatus] = useState(''),//状态
        [dateValue, setDateValue] = useState<any>([]),//时间
        [dateString, setDateString] = useState<any>([]),//时间字符串格式
        [materialTexture, setMaterialTexture] = useState<any>([]), // 材质
        [standard, setStandard] = useState<any>([]), // 标准
        [keyword, setKeyword] = useState<any>('');//关键字搜索
    const [departmentId, setDepartmentId] = useState('');//部门
    const [outStockStaffId, setPersonnelId] = useState('');//人员
    const [Listdata, setListdata] = useState<any[]>([]);//列表数据
    const [supplierListdata, setSupplierListdata] = useState<any[]>([{}]);//详情-供应商信息列表数据
    const [WarehousingListdata, setWarehousingListdata] = useState<any[]>([{}]);//详情-入库信息列表数据
    const [ExWarehousingListdata, setExWarehousingListdata] = useState<any[]>([{}]);//详情-出库信息列表数据
    const [OutLibraryListdata, setOutLibraryListdata] = useState<any[]>([{}]);//出库-原材料信息列表数据
    const [ApplyListdata, setApplyListdata] = useState<any[]>([{}]);//出库-缺料申请-信息列表数据
    const [totalWeight, setTotalWeight] = useState<any>(0);//总重量
    const [MaterialShortageTotalWeight, setMaterialShortageTotalWeight] = useState<number>(0);//缺料总重量
    const [isDetailModal, setIsDetailModal] = useState<boolean>(false);//详情弹框显示
    const [isOutLibraryModal, setIsOutLibraryModal] = useState<boolean>(false);//出库弹框显示
    const [isApplyModal, setIsApplyModal] = useState<boolean>(false);//出库弹框显示
    const [requirement, setRequirement] = useState<number | string>('');//出库-弹框需求量
    const [OutboundId, setOutboundId] = useState<number | string>('');//出库-弹框-需要的列表id
    const [tempApplyData, setTempApplyData] = useState<number | string>('');//出库-弹框-缺料申请需要的列表数据
    const [departmentList, setDepartmentList] = useState<any[]>([]);//部门数据
    const [userList, setuserList] = useState<any[]>([]);//申请人数据数据
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [isExport, setIsExportStoreList] = useState(false)
    // 标准
    const standardEnum = materialStandardTypeOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    // 材质 
    const materialEnum = materialTextureOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
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
            title: '品名',
            dataIndex: 'productName',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '状态',
            dataIndex: 'outStockItemStatus',
            width: 120,
            render: (text: any) => text == 0 ? '待出库' : text == 1 ? '缺料中' : '已出库'
        }, {
            title: '最新状态变更时间',
            dataIndex: 'updateTime',
            width: 160,
        }, {
            title: '规格',
            dataIndex: 'spec',
            width: 120,
        }, {
            title: '标准',
            dataIndex: 'standard',
            width: 120,
        }, {
            title: '材质',
            dataIndex: 'materialTexture',
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
            title: '重量(吨)',
            dataIndex: 'weight',
            width: 120,
        }, {
            title: '炉批号',
            dataIndex: 'furnaceBatch',
            width: 120,
        },
        {
            title: '批号',
            dataIndex: 'batchNumber',
            width: 100,
        },
        {
            title: '质保书号',
            dataIndex: 'warrantyNumber',
            width: 100,
        },
        {
            title: '轧制批号',
            dataIndex: 'rollingNumber',
            width: 100,
        },
        {
            title: '内部合同号',
            dataIndex: 'contractNumber',
            width: 120,
        }, {
            title: '塔型',
            dataIndex: 'productCategoryId',
            width: 120,
        }, {
            title: '塔杆号',
            dataIndex: 'productNumber',
            width: 120,
        }, {
            title: '出库人',
            dataIndex: 'outStockUserName',
            width: 120,
        }, {
            title: '出库时间',
            dataIndex: 'outStockTime',
            width: 140,
        }, {
            title: '仓库',
            dataIndex: 'warehouseName',
            width: 120,
        }, {
            title: '库区',
            dataIndex: 'reservoirName',
            width: 120,
        }, {
            title: '库位',
            dataIndex: 'locatorName',
            width: 120,
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: 120,
        },
        {
            title: '操作',
            width: 80,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                // 0待出库 2 已出库  1缺料中
                <Space direction="horizontal" size="small">
                    {record.outStockItemStatus == 0 ? <Button type='link' onClick={() => { IssueOperation(record) }}>出库</Button> : null}
                    {record.outStockItemStatus == 2 ? <Button type='link' onClick={() => { getDetailData(record.id) }}>详情</Button> : null}
                </Space>
            )
        }
    ];//列表表头
    const supplierColumns = [
        {
            title: '收货单号',
            dataIndex: 'receiveNumber',
            width: 120,
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
            width: 120,
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
            dataIndex: 'receiveStockUser',
            width: 120,
        }, {
            title: '入库时间',
            dataIndex: 'receiveStockTime',
            width: 160,
        }, {
            title: '炉批号',
            dataIndex: 'furnaceBatch',
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
    const ExWarehousingColumns = [
        {
            title: '领料编号',
            dataIndex: 'pickingNumber',
            width: 120,
        },
        {
            title: '任务编号',
            dataIndex: 'taskNumber',
            width: 120,
        }, {
            title: '生产批次',
            dataIndex: 'productionBatchNumber',
            width: 120,
        }, {
            title: '申请人',
            dataIndex: 'applyStaffName',
            width: 160,
        }, {
            title: '出库人',
            dataIndex: 'outStockUserName',
            width: 120,
        }, {
            title: '出库时间',
            dataIndex: 'updateTime',
            width: 120,
        },
    ];//详情-出库表头
    const OutLibraryColumns = [
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
            width: 100,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '收货批次',
            dataIndex: 'receiveBatchNumber',
            width: 100,
        }, {
            title: '库位',
            dataIndex: 'locatorName',
            width: 100,
        }, {
            title: '区位',
            dataIndex: 'reservoirName',
            width: 100,
        }, {
            title: '物料编码',
            dataIndex: 'materialCode',
            width: 100,
        }, {
            title: '分类',
            dataIndex: 'classify',
            width: 100,
        }, {
            title: '标准',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '品名',
            dataIndex: 'productName',
            width: 100,
        }, {
            title: '材质',
            dataIndex: 'materialTexture',
            width: 100,
        }, {
            title: '规格',
            dataIndex: 'spec',
            width: 100,
        }, {
            title: '长度（mm）',
            dataIndex: 'length',
            width: 100,
        }, {
            title: '宽度（mm）',
            dataIndex: 'width',
            width: 100,
        }, {
            title: '数量',
            dataIndex: 'quantity',
            width: 100,
        }, {
            title: '重量（吨）',
            dataIndex: 'weight',
            width: 100,
        }, {
            title: '库存数量',
            dataIndex: 'quantity',
            width: 100,
        }, {
            title: '出库数量',
            dataIndex: 'standard',
            width: 100,
            fixed: 'right' as FixedType,
            render: (text: any, item: any, index: any) => {
                return (
                    <Input
                        placeholder="请输入"
                        value={item.outboundQuantity}
                        onChange={(e) => { inputChange(e, item, index, 'OutLibrary') }}
                    ></Input>
                )
            }
        },
    ];//出库弹框-原材料信息表头
    const ApplyColumns = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '物料编码',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '分类',
            dataIndex: 'classify',
            width: 100,
        }, {
            title: '标准',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '品名',
            dataIndex: 'productName',
            width: 100,
        }, {
            title: '材质',
            dataIndex: 'materialTexture',
            width: 100,
        }, {
            title: '规格',
            dataIndex: 'spec',
            width: 100,
        }, {
            title: '长度（mm）',
            dataIndex: 'length',
            width: 100,
        }, {
            title: '宽度（mm）',
            dataIndex: 'width',
            width: 100,
        }, {
            title: '数量',
            dataIndex: 'quantity',
            width: 100,
        }, {
            title: '重量（吨）',
            dataIndex: 'weight',
            width: 100,
        }, {
            title: '缺料数量',
            dataIndex: 'shortageNum',
            width: 100,
            render: (text: any, item: any, index: any) => {
                return (
                    <Input
                        placeholder="请输入"
                        value={item.shortageNum}
                        onChange={(e) => { inputChange(e, item, index, 'shortage') }}
                    ></Input>
                )
            }
        },
    ];//出库弹框-缺料申请原材料信息表头
    const { search } = history.location
    const paramsString = search.substring(1)
    const searchParams = new URLSearchParams(paramsString)
    const weight: any = searchParams.get('weight')
    //获取列表数据
    const getLoadData = async () => {
        const data: any = await RequestUtil.get(`/tower-storage/outStock/detail`, {
            current,
            size: pageSize,
            id: params.id,
            departmentId,
            outStockStaffId,
            selectName: keyword,
            status: status,
            materialTexture, // 材质
            standard, // 标准
            updateTimeStart: dateString[0] ? dateString[0] + ' 00:00:00' : '',
            updateTimeEnd: dateString[1] ? dateString[1] + ' 23:59:59' : '',
        })
        setListdata(data.outStockDetailPage.records);
        // setTotalWeight(data.weight)
        setMaterialShortageTotalWeight(data.excessWeight)
        setTotal(data.outStockDetailPage.total);
    }
    //获取列表详情数据数据
    const getDetailData = async (id: any) => {
        const data: any = await RequestUtil.get(`/tower-storage/outStock/detail/${id}`);
        let supplierObj = {
            receiveNumber: data.receiveNumber,
            supplierName: data.supplierName,
            contactsUser: data.contactsUser,
            contactsPhone: data.contactsPhone,
            contractNumber: data.contractNumber,
            key: 1,
        }
        let WarehousingObj = {
            materialTexture: data.materialTexture,
            spec: data.spec,
            standard: data.standard,
            receiveNumber: data.receiveNumber,
            length: data.length,
            width: data.width,
            receiveStockUser: data.receiveStockUser,
            receiveStockTime: data.receiveStockTime,
            furnaceBatch: data.furnaceBatch,
            warehouseName: data.warehouseName,
            locatorName: data.locatorName,
            reservoirName: data.reservoirName,
            remark: data.remark,
            key: 2,
        }
        let ExwarehousingObj = {
            pickingNumber: data.pickingNumber,
            taskNumber: data.taskNumber,
            productionBatchNumber: data.productionBatchNumber,
            applyStaffName: data.applyStaffName,
            outStockUserName: data.outStockUserName,
            updateTime: data.updateTime,
            key: 3,
        }
        setSupplierListdata([supplierObj])
        setWarehousingListdata([WarehousingObj])
        setExWarehousingListdata([ExwarehousingObj])
        setIsDetailModal(true)
    }
    // 点击出库显示弹框内容
    const IssueOperation = async (record: any) => {
        setRequirement(record.quantity);
        setOutboundId(record.id);
        setApplyListdata([record]);
        console.log(record)
        const data: any = await RequestUtil.get(`/tower-storage/materialStock`, {
            materialTexture: record.materialTexture,//材质
            productName: record.productName,//品名
            standard: record.standard,//标准
            lengthMin: record.length,//长度最小值
            lengthMax: record.length,//长度最大值
            spec: record.spec,//规格
        });
        setOutLibraryListdata(data.records);
        setIsOutLibraryModal(true)
    }
    // 出库弹框列表输入框
    const inputChange = (e: any, item: any, index: any, type: string) => {
        let ary = []
        if (type == 'OutLibrary') {
            ary = JSON.parse(JSON.stringify(OutLibraryListdata))
            ary[index].outboundQuantity = e.target.value.replace(/[^0-9]/g, '')
            setOutLibraryListdata(ary)
        } else {
            ary = JSON.parse(JSON.stringify(ApplyListdata))
            ary[index].shortageNum = e.target.value.replace(/[^0-9]/g, '')
            setApplyListdata(ary)
        }
    }
    // 出库保存
    const IssueSave = async () => {
        let ary: any = [];
        await OutLibraryListdata.map((item, index) => {
            if (item.outboundQuantity) {
                let obj: any = {};
                obj.quantity = item.outboundQuantity
                obj.id = item.id
                ary.push(obj)
            }
        })
        if (ary.length == 0) return message.error('所有数据无出库数量')
        const data: any = await RequestUtil.post(`/tower-storage/outStock`, {
            id: OutboundId,
            materialStockList: ary
        });
        if (data) {
            message.success('操作成功')
            setIsOutLibraryModal(false)
            getLoadData()
        }

    }
    // 点击出库-缺料申请-按钮
    const MaterialShortageApplication = async () => {
        console.log(ApplyListdata, 'ApplyListdata')
        if (OutLibraryListdata.length != 0) {
            message.error('库存未用完')
            return
        }
        setIsApplyModal(true)
    }
    // 缺料申请
    const shortage = async () => {
        const data: any = await RequestUtil.put(`/tower-storage/outStock/lack?id=${OutboundId}`);
        if (data) {
            message.success('申请成功')
            setIsApplyModal(false)
            setIsOutLibraryModal(false)
        }
    }
    // 重置
    const reset = () => {
        setCurrent(1);
        setPageSize(10);
        setStatus('');
        setDateValue([]);
        setDateString([]);
        setKeyword('')
        setPersonnelId('')
        setDepartmentId('')
        setuserList([]);
    }
    // 详情弹框取消
    const onDetailCancel = () => {
        setIsDetailModal(false)
    }
    // 出库弹框取消
    const onOutLibraryCancel = () => {
        setIsOutLibraryModal(false)
    }
    // 缺料申请弹框取消
    const onApplyModalCancel = () => {
        setIsApplyModal(false)
    }
    // 状态选择
    const statusChange = async (val: string) => {
        await setStatus(val);
        getLoadData()
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
    //进入页面刷新
    useEffect(() => {
        getDepartment()
    }, [])
    //进入页面刷新
    useEffect(() => {
        getLoadData()
    }, [current, pageSize, status, dateString, outStockStaffId])
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
                    <span className="tip">状态： </span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={status ? status : ''}
                            onChange={(val) => { setStatus(val) }}
                        >
                            <Select.Option
                                value=""
                            >
                                全部
                            </Select.Option>
                            <Select.Option
                                value="0"
                            >
                                待出库
                            </Select.Option>
                            <Select.Option
                                value="1"
                            >
                                缺料中
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                已出库
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">出库人：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={departmentId ? departmentId : '请选择'}
                            onChange={(val) => { setDepartmentId(val); setPersonnelId(''); setuserList([]); getUser(departmentId) }}
                        >
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
                            value={outStockStaffId ? outStockStaffId : '请选择'}
                            onChange={(val) => { setPersonnelId(val) }}
                        >
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
                    <span className="tip">材质：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={status ? status : ''}
                            onChange={(val) => { setMaterialTexture(val) }}
                            placeholder="请选择材质"
                        >
                            {
                                materialEnum && materialEnum.length > 0 && materialEnum.map((item: any, index: number) => {
                                    return <Select.Option value={item.label} key={index}>{item.label}</Select.Option>
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
                            value={status ? status : ''}
                            onChange={(val) => { setStandard(val) }}
                            placeholder="请选择标准"
                        >
                            {
                                standardEnum && standardEnum.length > 0 && standardEnum.map((item: any, index: number) => {
                                    return <Select.Option value={item.label} key={index}>{item.label}</Select.Option>
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">关键字：</span>
                    <div className='selectOrInput'>
                        <Input
                            style={{ width: "200px" }}
                            placeholder="品名/炉批号/内部合同号/杆塔号/批号、质保书号、轧制批号"
                            value={keyword}
                            allowClear
                            onChange={(e) => {
                                setKeyword(e.target.value)
                            }}
                            onPressEnter={() => {
                                getLoadData()
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
                            onClick={() => { getLoadData() }}
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
                    onClick={() => { setIsExportStoreList(true) }}
                >导出</Button>
                <Button
                    className='func_btn'
                    type="ghost"
                    onClick={() => {
                        history.go(-1)
                    }}
                >返回</Button>
            </div>
            <div className="tip_public_Stock">
                <div>总重量： {Number(weight) > 0 ? weight : 0} 吨， 缺料总重量：{MaterialShortageTotalWeight} 吨</div>
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

            {/* 详情弹框 */}
            <Modal
                className="Detail_modal"
                visible={isDetailModal}
                title="详细"
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
                            scroll={{x: 1200}}
                            size='small'
                            rowClassName={(item, index) => {
                                return index % 2 ? 'aaa' : ''
                            }}
                            pagination={false}
                        />
                    </div>
                </div>
                <div className="ExWarehouse_info">
                    <div className="title">出库信息</div>
                    <div className="table_wrap">
                        <Table
                            columns={ExWarehousingColumns}
                            dataSource={ExWarehousingListdata}
                            size='small'
                            rowClassName={(item, index) => {
                                return index % 2 ? 'aaa' : ''
                            }}
                            pagination={false}
                        />
                    </div>
                </div>
            </Modal>
            {/* 出库弹框 */}
            <Modal
                className="out_library_modal"
                visible={isOutLibraryModal}
                title="出库"
                width={1000}
                maskClosable={false}
                onCancel={onOutLibraryCancel}
                footer={
                    <>
                        <Button onClick={onOutLibraryCancel}>关闭</Button>
                        <Button type='primary' onClick={() => { MaterialShortageApplication() }}>缺料申请</Button>
                        <Button type='primary' onClick={IssueSave}>保存</Button>
                    </>
                }
            >
                <div className="out_library_info">
                    <div className="title">
                        出库原材料信息
                        <span className='cont'>需求量：{requirement}</span>
                    </div>
                    <div className="table_wrap">
                        <Table
                            columns={OutLibraryColumns}
                            dataSource={OutLibraryListdata}
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
            {/* 缺料申请弹框 */}
            <Modal
                className="apply_modal"
                visible={isApplyModal}
                title="缺料申请"
                width={1000}
                maskClosable={false}
                onCancel={onApplyModalCancel}
                footer={
                    <>
                        <Button onClick={onApplyModalCancel}>关闭</Button>
                        <Button type='primary' onClick={() => { shortage() }}>保存并提交</Button>
                    </>
                }
            >
                <div className="out_library_info">
                    <div className="table_wrap">
                        <Table
                            columns={ApplyColumns}
                            dataSource={ApplyListdata}
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
            {isExport ? <ExportList
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
                url={`/tower-storage/outStock/detail`}
                serchObj={{
                    id: params.id,
                    departmentId,
                    outStockStaffId,
                    selectName: keyword,
                    status: status,
                    materialTexture, // 材质
                    standard, // 标准
                    updateTimeStart: dateString[0] ? dateString[0] + ' 00:00:00' : '',
                    updateTimeEnd: dateString[1] ? dateString[1] + ' 23:59:59' : '',
                }}
                closeExportList={() => { setIsExportStoreList(false) }}
            /> : null}
        </div>
    )
}