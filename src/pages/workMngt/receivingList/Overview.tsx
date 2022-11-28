import React, { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button, message, Modal, Spin, Form } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, BaseInfo, Attachment, AttachmentRef } from '../../common'
import { CargoDetails } from "./receivingListData.json"
import useRequest from '@ahooksjs/use-request'
import { SearchTable as Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil'
import CreatePlan from "./CreatePlan"

interface ReceiveStrokAttachProps {
    type: 1 | 2
    ids: string[]
    receiveStockId: string
}

interface ReceiveStrokAttachUploadProps {
    id: string
}
const ReceiveStrokAttach = forwardRef(({ type, ids, receiveStockId }: ReceiveStrokAttachProps, ref): JSX.Element => {
    const [form] = Form.useForm()
    const [reservoirId, setReservoirId] = useState<string>()
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/${receiveStockId}`)
            const warehouseData: any[] = type === 1 ? await RequestUtil.get(`/tower-storage/warehouse/tree`, { id: result.warehouseId, type: 1 }) : []
            resole({
                warehouseName: result.warehouseName,
                warehouseId: result.warehouseId,
                warehouseData: warehouseData.map((item: any) => ({ label: item.name, value: item.id }))
            })
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [receiveStockId] })

    //库位
    const { data: locatorData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const warehouseId = await form.getFieldValue("reservoirId")
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/tree`, { id: warehouseId, type: 2 })
            resole(result.map((item: any) => ({ label: item.name, value: item.id })))
        } catch (error) {
            reject(error)
        }
    }), { ready: !!reservoirId, refreshDeps: [reservoirId] })
    //质保单-质检单
    /** 
    * const { run: saveRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
    *    try {
    *        // 对上传数据进行处理
    *       const fieldIds: any = [],
    *        source = attachRef.current.getDataSource();
    *       if (source.length < 1) {
                 message.error("请您先上传附件！");
                 return false;
             }
             source.map((item: any) => fieldIds.push(item.id));
             const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/attach`, {
                 attachType: type,
                 id,
                 fieldIds
             })
             resole(result?.attachInfoDtos || [])
         } catch (error) {
             reject(error)
         }
     }), { manual: true })
      */

    // 批量收货 / 收货
    const { run } = useRequest<boolean>(() => new Promise(async (resole, reject) => {
        try {
            const params = await form.validateFields()
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/batchSaveReceiveStock`, ids.map((item: string) => ({
                id: item,
                warehouseId: data.warehouseId,
                ...params
            })))
            resole(true)
        } catch (error) {
            reject(false)
            // reject(error)
        }
    }), { manual: true })

    // 拒绝收货
    const { run: refuseRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const params = await form.validateFields()
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/refuse`, {
                id: ids[0],
                receiveStatus: 2,
                ...params
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit: type === 1 ? run : refuseRun }), [run, refuseRun, type])

    const handleBaseInfoChange = (values: any) => {
        if (values.reservoirId) {
            setReservoirId(values.reservoirId)
        }
    }

    return <Spin spinning={loading}>
        <BaseInfo
            edit col={1}
            form={form}
            onChange={handleBaseInfoChange}
            columns={type === 1 ? [
                {
                    title: "仓库",
                    dataIndex: "warehouseName",
                    disabled: true
                },
                {
                    title: "库区",
                    dataIndex: "reservoirId",
                    type: "select",
                    enum: data?.warehouseData || []
                },
                {
                    title: "库位",
                    dataIndex: "locatorId",
                    type: "select",
                    enum: locatorData || []
                }
            ] : [{
                title: "拒收原因",
                dataIndex: "remark",
                type: "textarea"
            }]}
            dataSource={{ warehouseName: data?.warehouseName }} />
    </Spin>

})
const ReceiveStrokAttachUpload = forwardRef(({ id }: ReceiveStrokAttachUploadProps, ref): JSX.Element => {
    const attachRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/attach?attachType=2&id=${id}`)
            resole(result?.attachInfoDtos || [])
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const { run: saveRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            // 对上传数据进行处理
            const fieldIds: any = [],
                source = attachRef.current.getDataSource();
            if (source.length < 1) {
                message.error("请您先上传质保单！");
                resole(false as any)
                return false;
            }
            source.map((item: any) => fieldIds.push(item.id));
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/attach`, {
                id,
                fieldIds,
                attachType: 2
            })
            resole(true as any)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit: saveRun }), [saveRun, attachRef.current.getDataSource])

    return <Spin spinning={loading}>
        <Attachment dataSource={data} edit title="质保单" ref={attachRef} style={{ margin: "0px" }} marginTop={false} />
    </Spin>
})
export default function Overview() {
    const receiveRef = useRef<{ onSubmit: () => Promise<boolean> }>()
    const receiveAttachRef = useRef<{ onSubmit: () => Promise<boolean> }>()
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [visible, setVisible] = useState<boolean>(false)
    const [selectedRows, setSelectedRows] = useState<any[]>([])
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({ receiveStockId: params.id })
    const [attchType, setAttachType] = useState<1 | 2>(1)
    const [detailId, setDetailId] = useState<string[]>([])
    const [receiveStockId, setReceiveStockId] = useState<string>("")
    const [saveLoding, setSaveLoading] = useState<boolean>(false)
    const [saveAttachLoding, setSaveAttachLoading] = useState<boolean>(false)
    const [isOpenId, setIsOpenId] = useState<boolean>(false);
    const [editId, setEditId] = useState<string>('');
    const [detailAttachId, setDetailAttachId] = useState<string>("")
    const [attachVisible, setAttachVisible] = useState<boolean>(false)
    const [userData, setUserData] = useState<any>({})
    const handleCreate = (options: any) => {
        if (options?.code === 1) {
            history.go(0);
        }
        setIsOpenId(false);
    }
    // 统计数量
    const { data: numData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/detailStatistics`, {
                receiveStockId: params.id,
                startStatusUpdateTime: filterValue["startStatusUpdateTime"] || "",
                endStatusUpdateTime: filterValue["endStatusUpdateTime"] || "",
                receiveDetailStatus: filterValue["receiveDetailStatus"] || ""
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [params.id] })

    const handleAttachOk = async () => {
        setSaveLoading(true)
        try {
            const result = await receiveRef.current?.onSubmit()
            setSaveLoading(false)
            message.success(`${attchType === 1 ? "收货" : "拒收"}成功...`)
            setVisible(false)
            history.go(0)
        } catch (error) {
            setSaveLoading(false)
        }
    }
    const handleAttachOkK = async () => {
        setSaveLoading(true)
        try {
            const result = await receiveAttachRef.current?.onSubmit()
            setSaveAttachLoading(false)
            setAttachVisible(false)
            history.go(0)
        } catch (error) {
            setSaveLoading(false)
        }
    }

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.startStatusUpdateTime) {
            const formatDate = value.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = `${formatDate[0]} 00:00:00`
            value.endStatusUpdateTime = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        value["receiveStockId"] = params.id;
        setFilterValue({ ...value, receiveStockId: params.id })
        return value
    }

    const handleSelectChange = (ids: any, selectRows: any[]) => {
        setSelectedRows(ids)
        const rWeight = selectRows.filter((item:any)=>{return item?.receiveDetailStatus!==0}).reduce((pre: any,cur: { totalWeight: any; })=>{
            return parseFloat(pre!==null?pre:0) + parseFloat(cur.totalWeight!==null?cur.totalWeight:0) 
        },0)
        const receiveWeight = selectRows.filter((item:any)=>{return item?.receiveDetailStatus!==0}).reduce((pre: any,cur: { balanceTotalWeight: any; })=>{
            return parseFloat(pre!==null?pre:0) + parseFloat(cur.balanceTotalWeight!==null?cur.balanceTotalWeight:0) 
        },0)
        const receivePrice = selectRows.filter((item:any)=>{return item?.receiveDetailStatus!==0}).reduce((pre: any,cur: { totalTaxPrice: any; })=>{
            console.log(cur.totalTaxPrice)
            return parseFloat(pre!==null?pre:0 )+ parseFloat(cur.totalTaxPrice!==null?cur.totalTaxPrice:0 )
        },0)
        const wWeight = selectRows.filter((item:any)=>{return item?.receiveDetailStatus===0}).reduce((pre: any,cur: { totalWeight: any; })=>{
            return parseFloat(pre!==null?pre:0) + parseFloat(cur.totalWeight!==null?cur.totalWeight:0)
        },0)      
        const waitWeight = selectRows.filter((item:any)=>{return item?.receiveDetailStatus===0}).reduce((pre: any,cur: { balanceTotalWeight: any; })=>{
            return parseFloat(pre!==null?pre:0) + parseFloat(cur.balanceTotalWeight!==null?cur.balanceTotalWeight:0)
        },0)
        const waitPrice = selectRows.filter((item:any)=>{return item?.receiveDetailStatus===0}).reduce((pre: any,cur: { totalTaxPrice: any; })=>{
            return parseFloat(pre!==null?pre:0) + parseFloat(cur.totalTaxPrice!==null?cur.totalTaxPrice:0)
        },0)
        setUserData({
            rWeight,
            wWeight,
            receiveWeight,
            receivePrice,
            waitWeight,
            waitPrice
        })
        setReceiveStockId(selectRows[0]?.receiveStockId)
    }

    return <DetailContent>
        <Modal
            destroyOnClose
            visible={visible}
            width={attchType === 1 ? "30%" : '60%'}
            // title={attchType === 1 ? "质保单" : "质检单"}
            title={attchType === 1 ? "收货" : "拒绝收货"}
            confirmLoading={saveLoding}
            onOk={handleAttachOk}
            okText="保存"
            onCancel={() => {
                setAttachType(1)
                setDetailId([])
                setReceiveStockId("")
                setVisible(false)
            }}>
            <ReceiveStrokAttach type={attchType} ids={detailId} receiveStockId={receiveStockId} ref={receiveRef} />
        </Modal>
        <Modal
            destroyOnClose
            visible={attachVisible}
            title={'质保单'}
            confirmLoading={saveAttachLoding}
            onOk={handleAttachOkK}
            okText="保存"
            onCancel={() => {
                setDetailAttachId("")
                setAttachVisible(false)
            }}>
            <ReceiveStrokAttachUpload id={detailAttachId} ref={receiveAttachRef}  />
            </Modal>
        <CreatePlan
            visible={isOpenId}
            id={editId}
            type={'edit'}
            handleCreate={handleCreate}
        />
        <Page
            path="/tower-storage/receiveStock/detail"
            exportPath={"/tower-storage/receiveStock/detail"}
            exportObject={{ receiveStockId: params.id }}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            searchFormItems={[
                // {
                //     name: 'startStatusUpdateTime',
                //     label: "最新状态变更时间",
                //     children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                // },
                // {
                //     name: 'receiveDetailStatus',
                //     label: '采购状态',
                //     children: <Form.Item name="receiveDetailStatus">
                //         <Select defaultValue="全部" style={{ width: 150 }}>
                //             <Select.Option value="">全部</Select.Option>
                //             <Select.Option value={0}>待收货</Select.Option>
                //             <Select.Option value={1}>已收货</Select.Option>
                //             <Select.Option value={2}>已拒绝</Select.Option>
                //         </Select>
                //     </Form.Item>
                // }
            ]}
            extraOperation={<>
                <Button type="primary"
                    ghost
                    disabled={!(selectedRows.length > 0)}
                    onClick={() => {
                        setAttachType(1)
                        setDetailId(selectedRows)
                        setVisible(true)
                    }}
                >批量收货</Button>
                <Button type="primary" ghost onClick={async () => {
                    setEditId(params.id)
                    const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/quality/${params.id}`)
                    setIsOpenId(true)
                    
                }} >申请送检</Button>
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                <span style={{ marginLeft: "20px" }}>
                    已收货：理算重量(吨)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{numData?.receiveWeight||0}</span>
                    结算重量(吨)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{numData?.receiveBalanceWeight||0}</span>
                    含税金额(元)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{numData?.receivePrice||0}</span>
                    待收货：理算重量(吨)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{ userData?.wWeight ||0}</span>
                    结算重量(吨)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}> {userData?.waitWeight||0}</span>
                    含税金额(元)合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{userData?.waitPrice||0}</span>
                </span>
            </>}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedRows,
                    onChange: handleSelectChange,
                    getCheckboxProps: (records: any) => [1, 2].includes(records.receiveDetailStatus)
                }
            }}
            columns={[
                ...CargoDetails as any,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    render: (_: any, records: any) => <>
                        <Button
                            type="link"
                            disabled={records.receiveDetailStatus !== 0}
                            onClick={() => {
                                setAttachType(1)
                                setDetailId([records.id])
                                setReceiveStockId(records.receiveStockId)
                                setVisible(true)
                            }}>收货</Button>
                        <Button
                            type="link"
                            disabled={records.receiveDetailStatus !== 0}
                            onClick={() => {
                                setAttachType(2)
                                setDetailId([records.id])
                                setReceiveStockId(records.receiveStockId)
                                setVisible(true)
                            }}
                        >拒收</Button>
                        <a style={{ marginRight: 12 }} onClick={() => {
                            setDetailAttachId(records.id)
                            setAttachVisible(true)
                        }}>质保单</a>
                    </>
                }
            ]}
        />
    </DetailContent>
}