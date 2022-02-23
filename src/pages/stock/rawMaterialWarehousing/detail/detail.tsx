/***
 * 新修改的原材料入库详情
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/06
 */
 import React, { useState, useEffect, useRef } from 'react';
 import { Input, Select, DatePicker, Button, Modal, message } from 'antd';
 import { FixedType } from 'rc-table/lib/interface'
 import { Page } from '../../../common';
 import RequestUtil from '../../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import { useParams, useHistory } from 'react-router-dom';
 import { baseColumn } from "./detail.json";
 
 import '../../StockPublicStyle.less';
 import './detail.less';

 const { TextArea } = Input;

 export default function RawMaterialWarehousing(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const history = useHistory();
    const [ListID, setListID] = useState('');//入库弹框展试 使用id
    const [isRejectionModal, setRejectionModal] = useState<boolean>(false),//拒收弹框
        [isReceivingModal, setisReceivingModal] = useState<boolean>(false);//收货弹框
    const [receiveBatchNumber, setReceiveBatchNumber] = useState<any>('');//收货批次
    const [Warehouse, setWarehouse] = useState<any[]>([]);//入库仓库数据
    const [ReservoirArea, setReservoirArea] = useState<any[]>([]);//入库库区数据
    const [Location, setLocation] = useState<any[]>([]);//入库库位数据
    const [rejectionText, setRejectionText] = useState<any>('');//拒收原因
    const [warehouseId, setWarehouseId] = useState('');//收货弹框选择仓库
    const [locatorId, setLocatorId] = useState('');//收货弹框选择库位
    const [reservoirId, setReservoirId] = useState('');//收货弹框选择库位
    const [furnaceBatchNo, setFurnaceBatchNo] = useState('');//收货弹框输入炉批号
    const [batchNumber, setBatchNumber] = useState(""); // 批号
    const [warrantyNumber, setWarrantyNumber] = useState(""); // 质保书号
    const [rollingNumber, setRollingNumber] = useState(""); // 轧制批号	
    const [ filterValue, setFilterValue ] = useState<any>({
        fuzzyQuery: "",
        receiveDetailStatus: "",
        startStatusUpdateTime: "",
        endStatusUpdateTime: "",
        receiveStockId: params.id,
    });

    const { data: statisticsData, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/detailStatistics`, {
                fuzzyQuery: filterValue.fuzzyQuery || "",
                startStatusUpdateTime: filterValue.startStatusUpdateTime || '',
                endStatusUpdateTime: filterValue.endStatusUpdateTime || '',
                receiveStockId: params.id,
                receiveDetailStatus: filterValue.receiveDetailStatus || "",
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {  })

     // 查询按钮
     const onFilterSubmit = (value: any) => {
        const result = {
            fuzzyQuery: value.fuzzyQuery || "",
            receiveDetailStatus: value.receiveDetailStatus || "",
            startStatusUpdateTime: "",
            endStatusUpdateTime: "",
            receiveStockId: params.id,
        }
         if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            result.startStatusUpdateTime = `${formatDate[0]} 00:00:00`
            result.endStatusUpdateTime = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        setFilterValue(result)
        return result
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

    // 拒收弹框取消
    const onRejectionCancel = () => {
        setRejectionModal(false);
        setRejectionText('');
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
            receiveDetailStatus: 2,
            remark: rejectionText
        });
        if (data) {
            message.success('拒收成功')
            setRejectionModal(false)
            // 刷新页面
            history.go(0);
        }
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
            receiveDetailStatus: 1,
            locatorId: locatorId,
            reservoirId: reservoirId,
            warehouseId: warehouseId,
            batchNumber,
            warrantyNumber,
            rollingNumber
        }]);
        if (data) {
            onReceivingCancel()
            // 刷新页面
            history.go(0);
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
     return (
         <>
             <Page
                 path="/tower-storage/receiveStock/detail"
                 exportPath={"/tower-storage/receiveStock/detail"}
                 columns={[
                     {
                         key: 'index',
                         title: '序号',
                         dataIndex: 'index',
                         fixed: "left",
                         width: 50,
                         render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                     },
                     ...baseColumn,
                     {
                        title: '操作',
                        dataIndex: 'key',
                        width: 80,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <>
                                {/* <span>质检单</span>
                                <span>质保单</span> */}
                                <Button className='btn-operation-link' type='link' disabled={record.receiveDetailStatus !== 0} onClick={() => { ReceivingBtn(record) }}>收货</Button>
                                <Button className='btn-operation-link' disabled={record.receiveDetailStatus !== 0} type='link' onClick={() => { OutReceivingBtn(record) }}>拒收</Button>
                            </>
                        )
                    }
                ]}
                extraOperation={() =>
                    <>
                        <Button type="primary" ghost onClick={() => message.error("暂未开发此功能")} >申请质检</Button>
                        <Button type="ghost" onClick={() => history.go(-1)}>返回</Button>
                        <div>已收货：重量(吨)合计：<span style={{marginRight: 12, color: "#FF8C00"}}>{statisticsData?.receiveWeight}</span>已收货：价税合计(元)合计：<span style={{marginRight: 12, color: "#FF8C00"}}>{statisticsData?.receivePrice}</span> 待收货：重量(吨)合计：<span style={{marginRight: 12, color: "#FF8C00"}}>{statisticsData?.waitWeight}</span>待收货：价税合计(元)合计：<span style={{marginRight: 12, color: "#FF8C00"}}>{statisticsData?.waitPrice}</span></div>
                    </>
                }
                 onFilterSubmit={onFilterSubmit}
                 filterValue={ filterValue }
                 searchFormItems={[
                    {
                        name: 'startRefundTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'receiveDetailStatus',
                        label: '采购状态',
                        children: (
                            <Select placeholder="请选择采购状态" style={{ width: "140px" }}>
                                    <Select.Option value="0">待收货</Select.Option>
                                    <Select.Option value="1">已收货</Select.Option>
                                    <Select.Option value="2">已拒绝</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input placeholder="请输入炉批号/收货批次/批号/质保书号/轧制批号进行查询" style={{ width: 300 }} />
                    }
                 ]}
             />
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
         </>
     )
 }