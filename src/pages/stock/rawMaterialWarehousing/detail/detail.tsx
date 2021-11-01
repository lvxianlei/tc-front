import React, { useState, useEffect } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import ConfirmableButton from '../../../../components/ConfirmableButton';
import { Page } from '../../../common';
import { IClient } from '../../../IClient';
import RequestUtil from '../../../../utils/RequestUtil';
import '../../StockPublicStyle.less';
import './detail.less';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
export default function RawMaterialStock(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const history = useHistory(),
        [current, setCurrent] = useState(1),
        [total, setTotal] = useState(100),
        [pageSize, setPageSize] = useState<number>(10),
        [isRejectionModal, setRejectionModal] = useState<boolean>(false),//拒收弹框
        [isReceivingModal, setisReceivingModal] = useState<boolean>(false),//拒收弹框
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
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            width: 50,
        },
        {
            title: '材质名称',
            dataIndex: 'productName',
            width: 120,
        }, {
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
                    <Button type='link' onClick={() => { ReceivingBtn(record) }}>收货</Button>
                    <Button type='link' onClick={() => { OutReceivingBtn(record) }}>拒收</Button>
                </Space>
            )
        }
    ]
    //获取列表数据
    const loadData = async () => {
        console.log('请求数据')
        const data: any = await RequestUtil.get(`/tower-storage/receiveStock/detail`, {
            current: current,
            size: pageSize,
            fuzzyQuery: keyword,
            startStatusUpdateTime: dateString[0],
            endStatusUpdateTime: dateString[1],
            receiveStockId: params.id,
            receiveStatus: status,
        });
        setListdata(data.ReceiveStockDetailPage.records)
        setReceiveWeight(data.receiveStockMessage.receiveWeight)
        setReceivePrice(data.receiveStockMessage.receivePrice)
        setWaitWeight(data.receiveStockMessage.waitWeight)
        setwaitPrice(data.receiveStockMessage.waitPrice)
        setTotal(data.ReceiveStockDetailPage.total)
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
        const data: any = await RequestUtil.post(`/tower-storage/receiveStock`, {
            id: ListID,
            furnaceBatchNumber: furnaceBatchNo,
            receiveStatus: 1,
            locatorId: locatorId,
            reservoirId: reservoirId,
            warehouseId: warehouseId
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
    //进入页面刷新
    useEffect(() => {
        loadData()
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
                            value={status ? status : '请选择'}
                            onChange={(val) => { setStatus(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                待收货
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                已收货
                            </Select.Option>
                            <Select.Option
                                value="3"
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
                            placeholder="材料名称/标准/规格/材质"
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
                <Button
                    type="primary"
                    ghost
                    className='func_btn'
                >申请质检</Button>
                <Button
                    className='func_btn'
                    type="primary"
                    ghost
                    onClick={() => {
                        history.go(-1)
                    }}
                >返回上一级</Button>
            </div>
            <div className="tip_public_Stock">
                <div>已收货：重量(支)合计：{receiveWeight}, 已收货：价税合计(元)合计：{receivePrice} ,  待收货：重量(支)合计：{waitWeight}待收货：价税合计(元)合计：{waitPrice}</div>
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
            {/* 拒收弹框 */}
            <Modal
                visible={isRejectionModal}
                title="拒收原因*"
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
                        console.log(e.target.value)
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
                                <Input
                                    placeholder='请输入'
                                    value={furnaceBatchNo}
                                    maxLength={200}
                                    onChange={(e) => {
                                        setFurnaceBatchNo(e.target.value)
                                    }}
                                ></Input>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}