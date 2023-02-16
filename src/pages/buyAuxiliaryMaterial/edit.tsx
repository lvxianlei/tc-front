import React, {useState, useRef, forwardRef, useImperativeHandle, ChangeEvent, useEffect} from "react"
import {Button, Form, message, Spin, Modal,Input, Space, InputNumber, Upload} from 'antd'
import { DetailTitle, BaseInfo, formatData, EditableTable,CommonTable,PopTableContent } from '../common'

import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { BasicInformation, editCargoDetails } from "./edit.json"
// 部门选择组件
import Dept from "../asm/calendar/Dept";
import {addMaterial} from "./addAuxiliaryMaterial.json";
import {useHistory} from "react-router-dom";
import { downloadTemplate } from "../workMngt/setOut/downloadTemplate"
import AuthUtil from "@utils/AuthUtil"

interface EditProps {
    id: string,
    type: "new" | "edit",
    visibleP: boolean,
}
interface ModalRef {
    dataSource: any[]
    resetFields: () => void
}

export default forwardRef(function Edit({ id, type, visibleP}: EditProps, ref): JSX.Element {
    //
    const history = useHistory();
    const modalRef = useRef<ModalRef>({ dataSource: [], resetFields: () => { } })
    const [visible, setVisible] = useState<boolean>(false)
    const [cargoData, setCargoData] = useState<any[]>([])
    const [detail, setDetail] = useState<any>({})
    const [form] = Form.useForm()
    const [editForm] = Form.useForm()
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [select, setSelect] = useState<any[]>([])
    const [visibleB, setVisibleB] = useState<boolean>(false)
    const [url, setUrl] = useState<string>('')


    const { loading: warehouseLoading, data: warehouseData } = useRequest<any[]>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get("/tower-storage/warehouse/getWarehouses")
            resole(result?.map((item: any) => ({ value: item.id, label: item.name })))
        } catch (error) {
            reject(error)
        }
    }))
    // 获取辅材第一层分类选项
    const { data: materialTypeNameEnum } = useRequest<any[]>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get("/tower-system/materialCategory/category?materialDataType=2")
            // console.log(result)
            console.log(result?.map((item: any) => ({ label: item.materialCategoryName, value: item.materialCategoryId })))
            resole(result?.map((item: any) => ({ label: item.materialCategoryName, value: item.materialCategoryId })))
        } catch (error) {
            reject(error)
        }
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/auxiliaryMaterialPurchasePlan/detail/${id}`)
            setDetail(result)
            form.setFieldsValue({...result,dept:{id:result?.deptId,value:result?.deptName}})
            editForm.setFieldsValue({...result?.auxiliaryPurchasePlanListVOS})
            const data:any[]= await RequestUtil.post(`/tower-storage/materialStock/getAuxiliaryStockNum`,result?.auxiliaryPurchasePlanListVOS)
            setPopDataList(result?.auxiliaryPurchasePlanListVOS.map((item: any) => ({
                ...item,
                num: item.num ? item.num : 1,
                stockNum: data.filter((eve:any)=> item.id===eve.id)[0].stockNum
            })) || [])
            resove({
                ...result,
                // unloadUsersName: {
                //     value: result.unloadUsersName,
                //     records: result.unloadUsers.split(",").map((userId: any) => ({ userId }))
                // }
            })
        } catch (error) {
            reject(error)
        }
    }),{
        manual: type === "new", refreshDeps: [id]
    })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](
                `/tower-supply/auxiliaryMaterialPurchasePlan`,
                type === "new" ? data : ({
                    ...data,
                    id
                })
            )
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleModalOk = async () => {
        // 保留输入的数量以及选择的部门信息
        select.map(el=>{
            select.forEach(item=>{
                if(el.id == item.id){
                    item.planPurchaseNum = el.planPurchaseNum || 1
                    // item.deptName = el.deptName || null
                    // item.deptId = el.deptId || null
                    item.remark = el.remark || ""
                }
            })
        })
        if(select.length>0){
            const data:any[]= await RequestUtil.post(`/tower-storage/materialStock/getAuxiliaryStockNum`,select)
            setPopDataList(select.map((item:any)=>{
                return {
                    ...item,
                    stockNum: data.filter((eve:any)=> item.id===eve.id)[0].stockNum
                }
            }))
        }else{
            setPopDataList(select.map((item:any)=>{
                return {
                    ...item,
                    stockNum: 0
                }
            }))
        }
        setVisible(false);
    }

    const onSubmit = () => new Promise(async (resole, reject) => {
        if (!popDataList.length) {
            message.warning("请先选择辅材...")
            return
        }
        // let flag:boolean = popDataList.every(item=>{
        //     console.log(item.deptName,item.deptId)
        //     return item.deptName && item.deptId
        // })
        // if(!flag){
        //     return message.warn('请将数据补充完整')
        // }
        try {
            if([undefined, 0,'0',2,'2',3,'3',4,'4'].includes(detail?.approval)){
                const baseFormData = await form.validateFields()
                console.log(baseFormData)
                await editForm.validateFields()
                const result = {
                    ...baseFormData,
                    deptName: baseFormData.dept.value,
                    deptId: baseFormData.dept.id,
                    auxiliaryPurchasePlanListDTOS: popDataList.map((item: any) => {
                        return {
                            ...item,
                            planPurchaseNum:item.planPurchaseNum || 1
                        }
                    }),
                }
                // request
                await saveRun(result)
                message.success('操作成功...')
                history.go(0)
                resole(true)
            }else{
                message.error("当前正在审批中，请撤销审批后再进行修改！")
                throw new Error('当前正在审批，不可修改！')
            }
        } catch (error) {
            reject(false)
        }
    })
    const onSubmitApproval = () => new Promise(async (resole, reject) => {
        if (!popDataList.length) {
            message.warning("请先选择辅材...")
            return
        }
        // let flag:boolean = popDataList.every(item=>{
        //     console.log(item.deptName,item.deptId)
        //     return item.deptName && item.deptId
        // })
        // if(!flag){
        //     return message.warn('请将数据补充完整')
        // }
        try {
            if([undefined, 0,'0',2,'2',3,'3',4,'4'].includes(detail?.approval)){
                const baseFormData = await form.validateFields()
                console.log(baseFormData)
                await editForm.validateFields()
                const result = {
                    ...baseFormData,
                    deptName: baseFormData.dept.value,
                    deptId: baseFormData.dept.id,
                    isApproval:1,
                    auxiliaryPurchasePlanListDTOS: popDataList.map((item: any) => {
                        return {
                            ...item,
                            planPurchaseNum:item.planPurchaseNum || 1
                        }
                    }),
                }
                // request
                await saveRun(result)
                message.success('操作成功...')
                history.go(0)
                resole(true)
            }else{
                message.error("当前正在审批中，请撤销审批后再进行修改！")
                throw new Error('当前正在审批，不可修改！')
            }
        } catch (error) {
            reject(false)
        }
    })
    const onSubmitCancel = () => new Promise(async (resove, reject) => {
        try {
            if([1,'1'].includes(detail?.approval)){
                await RequestUtil.get(`/tower-supply/auxiliaryMaterialPurchasePlan/workflow/cancel/${id}`)
                message.success("撤销成功...")
                resove(true)
            }
            else{
                await message.error("不可撤销...")
                throw new Error('不可撤销')
            }
        } catch (error) {
            reject(false)
        }
    })
    const resetFields = () => {
        form.resetFields()
        editForm.resetFields()
        setDetail({})
        setPopDataList([])
        setSelect([])
    }
    const remove = async (purchaseId: any) => {
        setSelect(popDataList.filter((item: any,index:number) => index !== purchaseId))
        setPopDataList(popDataList.filter((item: any,index:number) => index !== purchaseId))
    }
    const amountChange = (value: any, id: string, keys: string) => {
        const list = popDataList.map((item: any) => {
            if (item.id === id) {
                item[keys] = value
                return item;
            }
            return item
        })
        console.log(list, "修改后的数据========>>>")
        setPopDataList([...list]);
    }
    useImperativeHandle(ref, () => ({ onSubmit, resetFields, onSubmitApproval, onSubmitCancel }), [ref, popDataList, onSubmit, resetFields, onSubmitApproval, onSubmitCancel])

    const handleBaseInfoChange = async (fields: any) => {
        console.log(fields)
    }

    const handleEditableChange = (data: any) => {
        const changeIndex = data.submit.length - 1
        const changeFiled = data.submit[changeIndex]
        console.log(changeFiled)
    }

    useEffect(() => {
        if (visibleP) {
            form.setFieldsValue({
                isMeasuringTools:0
            })
        }
    }, [visibleP])
    return <Spin spinning={loading }>
        <Modal
            width={1011}
            visible={visible}
            title="选择辅材明细"
            destroyOnClose
            onCancel={() => {
                // 重置表单输入
                // modalRef.current?.resetFields()
                // 关闭模态框
                setVisible(false)
            }}
            onOk={handleModalOk}>
            <PopTableContent
                data={{
                    ...(addMaterial as any),
                    columns: (addMaterial as any).columns.map((item: any) => {
                        // if (item.dataIndex === "standard") {
                        //     return ({
                        //         ...item,
                        //         type: "select",
                        //         enum: materialStandardEnum
                        //     })
                        // }
                        return item
                    }),
                    search:(addMaterial as any).search.map((el:any)=>{
                        if(el.dataIndex == "materialCategory"){
                            el.enum = [
                                ...(materialTypeNameEnum || [])
                            ]
                        }
                        return el
                    })
                }}
                value={{
                    id: "",
                    records: popDataList,
                    value: ""
                }}
                onChange={(fields: any[]) => {
                    console.log(fields)
                    setSelect(fields.map((item: any) => ({
                        ...item
                    })))
                }}
            />
        </Modal>
        <DetailTitle title="基础信息" />
        <BaseInfo
            col={2}
            form={form}
            edit
            onChange={handleBaseInfoChange}
            columns={BasicInformation.map(item => {
               return item
            })}
            dataSource={{
                ...data
                // ...detail
            }} />
        <DetailTitle
            title="辅材明细"
            operation={[
                <Button type="primary" style={{ marginRight: 8 }} onClick={() => downloadTemplate('/tower-supply/auxiliaryMaterialPurchasePlan/masterplate/export', '采购清单数据模板')} ghost>模板下载</Button>,
                <Upload
                    accept=".xls,.xlsx"
                    action={() => {
                        const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                        return baseUrl + '/tower-supply/auxiliaryMaterialPurchasePlan/masterplate/import'
                    }}
                    headers={
                        {
                            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    // data={{
                    //     // segmentId:params.productSegmentId==='all'?'':params.productSegmentId,
                    //     productCategoryId: params.id,
                    // }}
                    showUploadList={false}
                    onChange={async (info:any) => {
                        console.log(info.file.response)
                        if (info.file.response && !info.file.response?.success) {
                            message.warning(info.file.response?.msg)
                        } else if (info.file.response && info.file.response?.success) {
                            if (info.file.response?.data?.downloadUrl) {
                                setUrl(info.file.response?.data?.downloadUrl);
                                setVisibleB(true);
                            } else {
                                message.success('导入成功！');
                                // setPopDataList(info.file.response?.data?.purchasePlanListDTOS.map((item:any)=>{
                                //     return{
                                //         ...item,
                                //     }
                                // }))
                                const data:any[]= await RequestUtil.post(`/tower-storage/materialStock/getAuxiliaryStockNum`,info.file.response?.data?.purchasePlanListDTOS)
                                setPopDataList(info.file.response?.data?.purchasePlanListDTOS.map((item:any)=>{
                                    return {
                                        ...item,
                                        stockNum: data.filter((eve:any)=> item.id===eve.id)[0].stockNum,
                                        weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3)
                                        : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width||1) / 1000 / 1000 / 1000).toFixed(3)
                                            : (Number(item?.proportion || 1) / 1000).toFixed(3),
                                        totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (item.planPurchaseNum || 1) / 1000 / 1000).toFixed(3)
                                            : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width||1) * (item.planPurchaseNum || 1) / 1000 / 1000 / 1000).toFixed(3)
                                                : (Number(item?.proportion || 1) * (item.planPurchaseNum || 1) / 1000).toFixed(3)
                                    }
                                }))
                                // setMaterialList(info.file.response?.data?.purchasePlanDetailDTOS.map((item:any)=>{
                                //     return{
                                //         ...item,
                                //         weight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) / 1000 / 1000).toFixed(3)
                                //             : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width||1) / 1000 / 1000 / 1000).toFixed(3)
                                //                 : (Number(item?.proportion || 1) / 1000).toFixed(3),
                                //         totalWeight: item?.weightAlgorithm === 1 ? ((Number(item?.proportion || 1) * Number(item.length || 1)) * (item.planPurchaseNum || 1) / 1000 / 1000).toFixed(3)
                                //             : item?.weightAlgorithm === 2 ? (Number(item?.proportion || 1) * Number(item.length || 1) * Number(item.width||1) * (item.planPurchaseNum || 1) / 1000 / 1000 / 1000).toFixed(3)
                                //                 : (Number(item?.proportion || 1) * (item.planPurchaseNum || 1) / 1000).toFixed(3)
                
                                //     }
                                // }))
                            }
                        }
                    }}
                >
                    <Button type="primary" ghost  style={{ marginRight: 8 }}>导入</Button>
                </Upload>,
                <Button
                    type="primary"
                    key="choose"
                    ghost
                    onClick={() => {
                        setVisible(true)
                    }}
                >添加</Button>,'  ',
                <Button
                    type="primary"
                    key="clear"
                    ghost
                    disabled={!popDataList.length}
                    onClick={() => {
                        Modal.confirm({
                            title: "清空",
                            content: "确定清空辅材明细吗？",
                            onOk: () => {
                               setPopDataList([])
                               message.success("清空成功...")
                            }
                        })
                    }}
                >清空</Button>
            ]}
        />
        <CommonTable
            haveIndex={false}
            form={editForm}
            rowKey="key"
            pagination={false}
            haveOpration={false}
            onChange={handleEditableChange}
            haveNewButton={false}
            columns={[
                {
                    title: "序号",
                    dataIndex: "index",
                    width: 50,
                    fixed: "left",
                    edit: false,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...editCargoDetails.map((item: any) => {
                    // 数量
                    if (item.dataIndex === "planPurchaseNum") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => <InputNumber min={0} value={value || 1} onChange={(value: number) => amountChange(value, records.id, "planPurchaseNum")} key={key} />
                        })
                    }
                    // if (item.dataIndex === "deptName") {
                    //     return ({
                    //         ...item,
                    //         render: (value: number, records: any, key: number) =><><Input value={records.deptName} style={{ width: 160 }} key={key} disabled addonAfter={ <Dept onSelect={(selectRows: any[]) => {
                    //             amountChange(selectRows[0]?.name, records.id, "deptName")
                    //             amountChange(selectRows[0]?.id, records.id, "deptId")
                    //         }} selectedKey={[records?.deptId]||[]} />}/></>
                    //     })
                    // }
                    if (item.dataIndex === "remark") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) =><><Input value={records.remark} key={key} onChange={(e) => amountChange(e.target.value, records.id, "remark")} style={{ width: 160 }}/></>
                        })
                    }
                    return item;
                }),
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 80,
                    edit: false,
                    render: (_: any, records: any,index:number) => <>
                        <Button type="link" className="btn-operation-link" onClick={() => { remove(index) }}>移除</Button>
                    </>
                }
            ]}
            dataSource={[...popDataList].map((item: any, index: number) => ({
                ...item,
                planPurchaseNum:item.planPurchaseNum || 1,
                key: item.id || `item-${index}`
            }))}
        />
        <Modal
            visible={visibleB}
            onOk={() => {
                window.open(url);
                setVisible(false);
            }}
            onCancel={() => { setVisibleB(false); setUrl('') }}
            title='提示'
            okText='下载'
        >
            当前存在错误数据，请重新下载上传！
        </Modal>
    </Spin>
})