import React, { useState, useEffect } from 'react';
import { Space, Button, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface'
import RequestUtil from '../../../../utils/RequestUtil';
import ExportList from '../../../../components/export/list';
import '../../StockPublicStyle.less';
import './detail.less';
import useRequest from '@ahooksjs/use-request';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
export default function RawMaterialStock(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const history = useHistory(),
        [current, setCurrent] = useState(1),
        [total, setTotal] = useState(100),
        [pageSize, setPageSize] = useState<number>(10),
        [isRejectionModal, setRejectionModal] = useState<boolean>(false),//拒收弹框
        [isReceivingModal, setisReceivingModal] = useState<boolean>(false),//收货弹框
        [status, setStatus] = useState(''),//采购状态
        [dateValue, setDateValue] = useState<any>([]),//时间
        [dateString, setDateString] = useState<any>([]),//时间字符串格式
        [keyword, setKeyword] = useState<any>('');//关键字搜索
    const [Listdata, setListdata] = useState<any>([]);//数据
    const [rejectionText, setRejectionText] = useState<any>('');//拒收原因
    const [warehouseId, setWarehouseId] = useState('');//收货弹框选择仓库
    const [locatorId, setLocatorId] = useState('');//收货弹框选择库位
    const [reservoirId, setReservoirId] = useState('');//收货弹框选择库位
    const [furnaceBatchNo, setFurnaceBatchNo] = useState('');//收货弹框输入炉批号
    const [Warehouse, setWarehouse] = useState<any[]>([]);//入库仓库数据
    const [ReservoirArea, setReservoirArea] = useState<any[]>([]);//入库库区数据
    const [Location, setLocation] = useState<any[]>([]);//入库库位数据
    const [receiveBatchNumber, setReceiveBatchNumber] = useState<any>('');//收货批次
    const [ListID, setListID] = useState('');//入库弹框展试 使用id
    const [receiveWeight, setReceiveWeight] = useState('');//展示条 已收货合计重量
    const [receivePrice, setReceivePrice] = useState('');//展示条 已收货合计价格
    const [waitWeight, setWaitWeight] = useState('');//展示条 待收货：重量
    const [waitPrice, setwaitPrice] = useState('');//展示条 待收货：价格
    const [batchNumber, setBatchNumber] = useState(""); // 批号
    const [warrantyNumber, setWarrantyNumber] = useState(""); // 质保书号
    const [rollingNumber, setRollingNumber] = useState(""); // 轧制批号	
    const [isExport, setIsExportStoreList] = useState(false)
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            width: 50,
            render: (text: any, item: any, index: any) => <span>{index + 1}</span>
        },
        {
            title: '材质名称',
            dataIndex: 'productName',
            width: 120,
        }, {
            title: '标准',
            dataIndex: 'standardName',
            width: 120,
        }, {
            title: '规格',
            dataIndex: 'spec',
            width: 120,
        }, {
            title: '材质',
            dataIndex: 'materialTexture',
            width: 120,
        }, {
            title: '长度',
            dataIndex: 'length',
            width: 120,
        }, {
            title: '宽度',
            dataIndex: 'width',
            width: 120,
        }, {
            title: '数量',
            dataIndex: 'quantity',
            width: 120,
        }, {
            title: '合同单价(元/吨)',
            dataIndex: 'contractUnitPrice',
            width: 120,
        }, {
            title: '价税合计(元)',
            dataIndex: 'price',
            width: 120,
        }, {
            title: '重量(吨)',
            dataIndex: 'weight',
            width: 120,
        }, {
            title: '采购状态',
            dataIndex: 'receiveStatus',
            width: 120,
            render: (text: any, item: any, index: any) => {
                // 0待收货1 已收货2已拒绝
                return <span>{item.receiveStatus == 0 ? '待收货' : item.receiveStatus == 1 ? '已收货' : '已拒绝'}</span>
            },
        }, {
            title: '最新状态变更时间',
            dataIndex: 'updateTime',
            width: 120,
        }, {
            title: '操作人',
            dataIndex: 'operatorMan',
            width: 120,
        }, {
            title: '炉批号',
            dataIndex: 'furnaceBatchNumber',
            width: 120,
        },
        {
            title: '批号',
            dataIndex: 'batchNumber',
            width: 120,
        },
        {
            title: '质保书号',
            dataIndex: 'warrantyNumber',
            width: 120,
        },
        {
            title: '轧制批号',
            dataIndex: 'rollingNumber',
            width: 120,
        },
        {
            title: '仓库',
            dataIndex: 'warehouse',
            width: 120,
        }, {
            title: '库区',
            dataIndex: 'reservoirArea',
            width: 120,
        }, {
            title: '库位',
            dataIndex: 'location',
            width: 120,
        }, {
            title: '收货批次',
            dataIndex: 'receiveBatchNumber',
            width: 120,
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: 120,
        },
        {
            title: '拒收原因',
            dataIndex: 'refuseDes',
            width: 120,
        },
        {
            title: '操作',
            dataIndex: 'key',
            width: 240,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <span>质检单</span>
                    <span>质保单</span>
                    {record.receiveStatus == 0 ? <Button type='link' onClick={() => { ReceivingBtn(record) }}>收货</Button> : null}
                    {record.receiveStatus == 0 ? <Button type='link' onClick={() => { OutReceivingBtn(record) }}>拒收</Button> : null}
                </Space>
            )
        }
    ]
    const { data: statisticsData, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/detailStatistics`, {
                current: current,
                size: pageSize,
                fuzzyQuery: keyword,
                startStatusUpdateTime: dateString[0] ? dateString[0] + " 00:00:00" : '',
                endStatusUpdateTime: dateString[1] ? dateString[1] + " 23:59:59" : '',
                receiveStockId: params.id,
                receiveStatus: status,
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    //获取列表数据
    const loadData = async () => {
        const data: any = await RequestUtil.get(`/tower-storage/receiveStock/detail`, {
            current: current,
            size: pageSize,
            fuzzyQuery: keyword,
            startStatusUpdateTime: dateString[0] ? dateString[0] + " 00:00:00" : '',
            endStatusUpdateTime: dateString[1] ? dateString[1] + " 23:59:59" : '',
            receiveStockId: params.id,
            receiveStatus: status,
        });
        setListdata(data.records)
        setTotal(data.total)
    }
    // 重置
    const reset = () => {
        setCurrent(1);
        setPageSize(10);
        setStatus('');
        setDateValue([]);
        setDateString([]);
        setKeyword('')
    }
    // submit拒收弹框提交
    const rejectionSubmit = async () => {
        if (!rejectionText) {
            message.error('请填写拒收原因！')
            return
        }
        // 拒收
        const data: any = await RequestUtil.post(`/tower-storage/receiveStock`, {
            id: ListID,
            receiveStatus: 2,
            remark: rejectionText
        });
        if (data) {
            message.success('拒收成功')
            setRejectionModal(false)
            loadData()
        }
    }
    // 拒收弹框取消
    const onRejectionCancel = () => {
        setRejectionModal(false);
        setRejectionText('');
    }
    // 拒收点击
    const OutReceivingBtn = async (record: any) => {
        await setListID(record.id)
        setRejectionModal(true)
    }
    // 收货点击
    const ReceivingBtn = async (record: any) => {
        setReceiveBatchNumber(record.receiveBatchNumber)
        setListID(record.id)
        await getWarehousing('', 0);
        setisReceivingModal(true)
    }
    // 收货弹框取消
    const onReceivingCancel = () => {
        setisReceivingModal(false);
        setWarehouseId('');
        setLocatorId('');
        setReservoirId('');
        setFurnaceBatchNo('');
        setBatchNumber('');
        setWarrantyNumber('');
        setRollingNumber('');
    }
    // submit收货弹框提交
    const receivingSubmit = async () => {
        //收货
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
        if (!furnaceBatchNo) {
            message.error('请输入炉批号')
            return
        }
        if (!batchNumber) {
            message.error('请输入批号')
            return
        }
        if (!warrantyNumber) {
            message.error('请输入质保书号')
            return
        }
        if (!rollingNumber) {
            message.error('轧制批号')
            return
        }
        const data: any = await RequestUtil.post(`/tower-storage/receiveStock/batchSaveReceiveStock`, [{
            id: ListID,
            furnaceBatchNumber: furnaceBatchNo,
            receiveStatus: 1,
            locatorId: locatorId,
            reservoirId: reservoirId,
            warehouseId: warehouseId,
            batchNumber,
            warrantyNumber,
            rollingNumber
        }]);
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
    //进入页面刷新
    useEffect(() => {
        loadData()
        run()
    }, [current, pageSize, status, dateString])

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
                    <span className="tip">采购状态： </span>
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
                                待收货
                            </Select.Option>
                            <Select.Option
                                value="1"
                            >
                                已收货
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                已拒绝
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">关键字：</span>
                    <div className='selectOrInput'>
                        <Input
                            placeholder="炉批号/收货批次/批号/质保书号/轧制批号"
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
                    className='func_btn' onClick={() => {
                        setIsExportStoreList(true)
                    }}
                >导出</Button>
                <Button
                    type="primary"
                    ghost
                    className='func_btn'
                >申请质检</Button>
                <Button
                    className='func_btn'
                    type="ghost"
                    onClick={() => {
                        history.go(-1)
                    }}
                >返回</Button>
            </div>
            <div className="tip_public_Stock">
                <div>已收货：重量(吨)合计：{statisticsData?.receiveWeight}, 已收货：价税合计(元)合计：{statisticsData?.receivePrice} ,  待收货：重量(吨)合计：{statisticsData?.waitWeight}待收货：价税合计(元)合计：{statisticsData?.waitPrice}</div>
            </div>
            <div className="page_public_Stock">
                <Table
                    columns={columns}
                    dataSource={Listdata}
                    rowKey="id"
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
                            setCurrent(page);
                            setPageSize(Number(pageSize));
                        }
                    }}
                />
            </div>
            {/* 拒收弹框 */}
            <Modal
                visible={isRejectionModal}
                // title="拒收原因*"
                title={
                    <>
                        <span>拒收原因</span>
                        <span style={{ color: 'red' }}>*</span>
                    </>
                }
                onCancel={onRejectionCancel}
                maskClosable={false}
                footer={
                    <>
                        <Button onClick={onRejectionCancel}>取消</Button>
                        <Button type='primary' onClick={rejectionSubmit}>提交</Button>
                    </>
                }
            >
                {/* <div>拒收原因<span>*</span>：</div> */}
                <TextArea
                    placeholder="请输入拒收原因"
                    value={rejectionText}
                    rows={4}
                    maxLength={200}
                    onChange={(e) => {
                        setRejectionText(e.target.value)
                    }}
                    onPressEnter={() => {
                        // 回车键回调
                    }}
                ></TextArea>
            </Modal>

            {/* 收货弹框 */}
            <Modal
                className="receiving_modal"
                visible={isReceivingModal}
                // visible={true}
                title="收货"
                maskClosable={false}
                onCancel={onReceivingCancel}
                footer={
                    <>
                        <Button onClick={onReceivingCancel}>关闭</Button>
                        <Button type='primary' onClick={receivingSubmit}>保存并提交</Button>
                    </>
                }
            >
                <div className="receiving_info">
                    <div className="part">
                        <div className="item">
                            <div className='tip'>收货批次</div>
                            <div className='info'>
                                {receiveBatchNumber}
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>仓库<span>*</span></div>
                            <div className='info'>
                                <Select
                                    className="select"
                                    style={{ width: "100%" }}
                                    value={warehouseId ? warehouseId : '请选择'}
                                    onChange={(val) => { setWarehouseId(val); setReservoirId(''); setReservoirArea([]); setLocatorId(''); setLocation([]); getWarehousing(val, 1) }}
                                >
                                    {
                                        Warehouse.map((item, index) => {
                                            return (
                                                <Select.Option
                                                    key={index}
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
                                    onChange={(val) => { setLocatorId(val); }}
                                >
                                    {
                                        Location.map((item, index) => {
                                            return (
                                                <Select.Option
                                                    key={index}
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
                            <div className='tip'>质保书号<span>*</span></div>
                            <div className='info'>
                                <Input
                                    placeholder='请输入'
                                    value={warrantyNumber}
                                    maxLength={30}
                                    onChange={(e) => {
                                        setWarrantyNumber(e.target.value.replace(/[\u4E00-\u9FA5]/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>轧制批号<span>*</span></div>
                            <div className='info'>
                                <Input
                                    placeholder='请输入'
                                    value={rollingNumber}
                                    maxLength={30}
                                    onChange={(e) => {
                                        setRollingNumber(e.target.value.replace(/[\u4E00-\u9FA5]/g, ''))
                                    }}
                                ></Input>
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
                                    onChange={(val) => { setReservoirId(val); getWarehousing(val, 2); setLocatorId(''); setLocation([]); }}
                                >
                                    {
                                        ReservoirArea.map((item, index) => {
                                            return (
                                                <Select.Option
                                                    key={index}
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
                                <Input
                                    placeholder='请输入'
                                    value={furnaceBatchNo}
                                    maxLength={30}
                                    onChange={(e) => {
                                        setFurnaceBatchNo(e.target.value.replace(/[\u4E00-\u9FA5]/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>批号<span>*</span></div>
                            <div className='info'>
                                <Input
                                    placeholder='请输入'
                                    value={batchNumber}
                                    maxLength={30}
                                    onChange={(e) => {
                                        setBatchNumber(e.target.value.replace(/[\u4E00-\u9FA5]/g, ''))
                                    }}
                                ></Input>
                            </div>
                        </div>
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
                current={current || 1}
                size={pageSize || 10}
                total={total || 0}
                url={`/tower-storage/receiveStock/detail`}
                serchObj={{
                    fuzzyQuery: keyword,
                    startStatusUpdateTime: dateString[0] ? dateString[0] + " 00:00:00" : '',
                    endStatusUpdateTime: dateString[1] ? dateString[1] + " 23:59:59" : '',
                    receiveStockId: params.id,
                    receiveStatus: status,
                }}
                closeExportList={() => { setIsExportStoreList(false) }}
            /> : null}
        </div>
    )
}