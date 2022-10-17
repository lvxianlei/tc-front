import React, {useState, useRef, forwardRef, useImperativeHandle, ChangeEvent} from "react"
import {Button, Form, message, Spin, Modal,Input, Space, InputNumber} from 'antd'
import { DetailTitle, BaseInfo, formatData, EditableTable,CommonTable,PopTableContent } from '../common'

import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { BasicInformation, editCargoDetails } from "./edit.json"
// 部门选择组件
import Dept from "../asm/calendar/Dept";
import {addMaterial} from "./addAuxiliaryMaterial.json";
import {useHistory} from "react-router-dom";

interface EditProps {
    id: string,
    type: "new" | "edit",
}
interface ModalRef {
    dataSource: any[]
    resetFields: () => void
}

export default forwardRef(function Edit({ id, type, }: EditProps, ref): JSX.Element {
    //
    const history = useHistory();
    const modalRef = useRef<ModalRef>({ dataSource: [], resetFields: () => { } })
    const [visible, setVisible] = useState<boolean>(false)
    const [cargoData, setCargoData] = useState<any[]>([])

    const [form] = Form.useForm()
    const [editForm] = Form.useForm()
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [select, setSelect] = useState<any[]>([])


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
            const result: any = await RequestUtil.get("/tower-system/materialCategory")
            resole(result?.map((item: any) => ({ value: item.id, label: item.name })))
        } catch (error) {
            reject(error)
        }
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/${id}`)

            setCargoData(result?.lists.map((item: any) => ({
                ...item,
                num: item.num ? item.num : 1
            })) || [])
            resole({
                ...formatData(BasicInformation, result),
                unloadUsersName: {
                    value: result.unloadUsersName,
                    records: result.unloadUsers.split(",").map((userId: any) => ({ userId }))
                }
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new" })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(
                `/tower-supply/auxiliaryMaterialPurchasePlan`,
                data
            )
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleModalOk = () => {
        // 保留输入的数量以及选择的部门信息
        cargoData.map(el=>{
            popDataList.forEach(item=>{
                if(el.id == item.id){
                    item.planPurchaseNum = el.planPurchaseNum || 1
                    item.deptName = el.deptName || null
                    item.deptId = el.deptId || null
                    item.remark = el.remark || ""
                }
            })
        })
        setCargoData(popDataList)
        setVisible(false);
    }

    const onSubmit = () => new Promise(async (resole, reject) => {
        if (!cargoData.length) {
            message.warning("请先选择辅材...")
            return
        }
        try {
            const baseFormData = await form.validateFields()
            console.log(baseFormData)
            await editForm.validateFields()
            const result = {
                ...baseFormData,
                auxiliaryPurchasePlanListDTOS: cargoData.map((item: any) => {
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
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields()
        editForm.resetFields()
        setCargoData([])
    }
    const remove = async (purchaseId: any) => {
        setCargoData(cargoData.filter((item: any) => item.id !== purchaseId))
        console.log(cargoData)
    }
    const amountChange = (value: any, id: string, keys: string) => {
        const list = cargoData.map((item: any) => {
            if (item.id === id) {
                item[keys] = value
                return item;
            }
            return item
        })
        console.log(list, "修改后的数据========>>>")
        setCargoData([...list]);
    }
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, cargoData, onSubmit, resetFields])

    const handleBaseInfoChange = async (fields: any) => {
        console.log(fields)
    }

    const handleEditableChange = (data: any) => {
        const changeIndex = data.submit.length - 1
        const changeFiled = data.submit[changeIndex]
        console.log(changeFiled)
    }


    return <Spin spinning={loading && warehouseLoading}>
        <Modal
            width={1011}
            visible={visible}
            title="选择辅材明细"
            onCancel={() => {
                // 重置表单输入
                modalRef.current?.resetFields()
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
                        if(el.dataIndex == "materialTypeName"){
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
                    setPopDataList(fields.map((item: any) => ({
                        ...item
                    }))|| [])
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
            }} />
        <DetailTitle
            title="辅材明细"
            operation={[
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
                    disabled={!cargoData.length}
                    onClick={() => {
                        Modal.confirm({
                            title: "清空",
                            content: "确定清空辅材明细吗？",
                            onOk: () => {
                               setCargoData([])
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
                            render: (value: number, records: any, key: number) => <InputNumber min={1} value={value || 1} onChange={(value: number) => amountChange(value, records.id, "planPurchaseNum")} key={key} />
                        })
                    }
                    if (item.dataIndex === "deptName") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) =><><Input value={records.deptName} style={{ width: 160 }} key={key} disabled addonAfter={ <Dept onSelect={(selectRows: any[]) => {
                                amountChange(selectRows[0]?.name, records.id, "deptName")
                                amountChange(selectRows[0]?.id, records.id, "deptId")
                            }} selectedKey={[records?.deptId]||[]} />}/></>
                        })
                    }
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
                    render: (_: any, records: any) => <>
                        <Button type="link" className="btn-operation-link" onClick={() => { remove(records.id) }}>移除</Button>
                    </>
                }
            ]}
            dataSource={cargoData.map((item: any, index: number) => ({
                ...item,
                planPurchaseNum:item.planPurchaseNum || 1,
                key: item.id || `item-${index}`
            })) || []}
        />
    </Spin>
})