import React, { useState, useRef, forwardRef, useImperativeHandle } from "react"
import {Button, Form, message, Spin, Modal,Input, Space, InputNumber} from 'antd'
import {DetailTitle, BaseInfo, formatData, EditableTable, CommonTable, PopTableContent} from '../common'

import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { materialDetails } from "./buyAuxiliaryMaterialList.json"
import Dept from "../asm/calendar/Dept";
import {useHistory, useLocation, useParams, useRouteMatch} from "react-router-dom";
import ExportList from "../../components/export/list";
import {addMaterial} from "../buyAuxiliaryMaterial/addAuxiliaryMaterial.json";

interface EditProps {
    id: string,
    type: "new" | "edit"
}
interface ModalRef {
    dataSource: any[]
    resetFields: () => void
}

export default forwardRef(function Edit({ id, type }: EditProps, ref): JSX.Element {
    const modalRef = useRef<ModalRef>({ dataSource: [], resetFields: () => { } })
    const history = useHistory();
    const location = useLocation<{ state: {} }>();
    const [visible, setVisible] = useState<boolean>(false)
    const params = useParams<{ id: string, purchaseType: string }>()
    const [cargoData, setCargoData] = useState<any[]>([])
    let [number, setNumber] = useState<number>(0);
    const match = useRouteMatch()
    const [popDataList, setPopDataList] = useState<any[]>([])
    const [form] = Form.useForm()
    const [editForm] = Form.useForm()
    const [isEdit, setIsEdit] = useState(false)
    // 导出模态框
    const [isExport, setIsExportStoreList] = useState(false)
    // 获取辅料明细清单
    const { loading, data,refresh } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            console.log(params)
            let search = location.search.substr(1).split(',')
            console.log(search)
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/auxiliaryMaterialPurchasePlan/list/${params.id}`, {
                current: 1,
                size: 1000
            })
            setCargoData(result.records.map(((item: any, index: number) => ({
                ...item,
                source: 1,
                rowKey: `${item.materialName}-${index}`
            }))))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))


    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](
                `/tower-storage/receiveStock`,
                type === "new" ? data : ({ ...data, id })
            )
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleModalOk = () => {
        // 保留输入的数量以及选择的部门信息
        // console.log(cargoData) // old
        // console.log(popDataList) // new choose
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
        let choose = [...cargoData,...popDataList]
        let arr:any[] = []
        choose.forEach(el=>{
            let flag = arr.every(item=>item.id != el.id)
            if(flag){
                arr.push({
                    ...el,
                    planPurchaseNum:el.planPurchaseNum || 1
                })
            }
        })
        // console.log(arr)
        setCargoData(arr)
        setVisible(false);
    }
    const  saveMaterialList = () => {
        // 所有新添加的辅材，部门、数量 字段都要全部填充完毕后才能保存
        // 默认数量添加为一
        setCargoData(cargoData.map((item:any)=>({...item,
            planPurchaseNum:item.planPurchaseNum || 1,
            purchasePlanId:item.purchasePlanId || params.id
        })))
        console.log(cargoData)
        let flag:boolean = cargoData.every(item=>{
            console.log(item.deptName,item.deptId)
            return item.deptName && item.deptId
        })
        if(!flag){
            return message.warn('请将数据补充完整')
        }
        // todo 相同物料编码和使用部门的辅材 合并一条数据

        return new Promise(async (resove, reject) => {
            try {
                await saveRequset()
                message.success("保存成功...")
                history.go(0)
                resove(true)
            }
            catch{
                reject(false)
            }
        })

    }
    const { run: saveRequset} = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            let search = location.search.substr(1).split(',')
            const result = await RequestUtil.put(`/tower-supply/auxiliaryMaterialPurchasePlan`,{
                auxiliaryPurchasePlanId:params.id,
                auxiliaryPurchasePlanListDTOS:cargoData,
                purchasePlanNumber:search[0],
                repurchaseTime:search[1],
            });
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true})

    const { run: cancelPlan} = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.post(`/tower-supply/auxiliaryMaterialPurchasePlan/cancel/${params.id}`,{
                auxiliaryPurchasePlanId:params.id
            });
            resole(result)

        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resole, reject) => {
        if (!cargoData.length) {
            message.warning("请先选择辅材...")
            return
        }
        try {
            const baseFormData = await form.validateFields()
            await editForm.validateFields()
            const result = {
                ...baseFormData,
                lists: cargoData.map((item: any) => {
                    return {
                        ...item,
                        planPurchaseNum:item.planPurchaseNum || 1,
                        purchasePlanId:item.purchasePlanId || params.id
                    }
                })
            }
            console.log(result)
            // request
            await saveRun(result)
            resole(true)
        } catch (error) {
            console.log(error)
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


    const handleEditableChange = (data: any) => {
        // const changeIndex = data.submit.length - 1
        // const changeFiled = data.submit[changeIndex]
        // console.log(changeFiled)
    }


    return <Spin spinning={loading}>
        <Modal
            width={1011}
            visible={visible}
            title="选择辅材明细"
            onCancel={() => {
                modalRef.current?.resetFields()
                setVisible(false)
                setNumber(++number)
            }}
            onOk={handleModalOk}>
        </Modal>
        <DetailTitle
            title="辅材明细"
            operation={[
                <span  key="export"><Button type="primary" style={{ margin: "0px 8px" }}  onClick={() => setIsExportStoreList(true)}>导出</Button>{isExport?<ExportList
                        key="exportModal"
                        history={history}
                        location={location}
                        match={match}
                        columnsKey={() => {
                            let keys = [...materialDetails]
                            keys.pop()
                            return keys
                        }}
                        current={1}
                        size={cargoData.length}
                        total={cargoData.length}
                        url={`/tower-supply/auxiliaryMaterialPurchasePlan/list/${params.id}`}
                        serchObj={{}}
                        closeExportList={() => { setIsExportStoreList(false) }}
                    />:null}</span>,
                // !isEdit && <Button key="edit" type="primary" style={{ margin: "0px 8px" }}  onClick={() => setIsEdit(true)} disabled={
                //     location.search.substr(1).split(',')[3]=="0"?false:true
                // }>编辑</Button>,
                isEdit && <Button key="add" type="primary" style={{ margin: "0px 8px" }} onClick={() => setVisible(true)}
                    disabled={location.search.substr(1).split(',')[3]=="0"?false:true}
                >添加</Button>,
                // isEdit && <Button key="save" type="primary" style={{ margin: "0px 8px" }} disabled={!cargoData.length} onClick={() =>  saveMaterialList()}>保存</Button>,
                <Button
                    type="primary"
                    key="clear"
                    ghost
                    style={{ margin: "0px 8px" }}
                    onClick={() => {
                        Modal.confirm({
                            title: "取消",
                            content: "确定取消采购计划吗？",
                            onOk: () => {
                                return new Promise(async (resove, reject) => {
                                    try {
                                        await cancelPlan()
                                        setIsEdit(false)
                                        message.success("操作成功...")
                                        history.go(-1)
                                        resove(true)
                                    }
                                    catch{
                                        reject(false)
                                    }
                                })

                            }
                        })
                    }}
                >取消计划</Button>,
                <Button
                    type="primary"
                    key="choose"
                    ghost
                    onClick={() => {
                        history.go(-1)
                    }}
                >返回</Button>,

            ]}
        />

        <CommonTable
            haveIndex={false}
            form={editForm}
            rowKey="key"
            haveOpration={false}
            onChange={handleEditableChange}
            haveNewButton={false}
            columns={
            isEdit?[
                {
                    title: "序号",
                    dataIndex: "index",
                    width: 50,
                    fixed: "left",
                    edit: false,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...materialDetails.map((item: any) => {
                    // 数量
                    if (item.dataIndex === "planPurchaseNum") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => !isEdit? records.planPurchaseNum:<InputNumber min={1} value={value || 1} onChange={(value: number) => amountChange(value, records.id, "planPurchaseNum")} key={key} />
                        })
                    }

                    if (item.dataIndex === "remark") {
                        return({
                            ...item,
                            render: (value: number, records: any, key: number) => !isEdit? records.remark:<Input defaultValue={records.remark || ''}  onChange={(e) => amountChange(e.target.value, records.id, "remark")} key={key} />
                        })
                    }
                    // 部门
                    if (item.dataIndex === "deptName") {
                        return ({
                            ...item,
                            render: (value: number, records: any, key: number) => !isEdit? records.deptName:<><Input value={records.deptName} style={{ width: 160 }} disabled addonAfter={ <Dept onSelect={(selectRows: any[]) => {
                                console.log(selectRows)
                                amountChange(selectRows[0]?.name, records.id, "deptName")
                                amountChange(selectRows[0]?.id, records.id, "deptId")
                            }} selectedKey={[records?.deptId]||[]} />}/></>
                        })
                    }
                    return item;

                }),
                {
                    "title": "已采购量",
                    "dataIndex": "alreadyPurchaseNum",
                    "type": "number",
                },
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
            ]:[
                {
                    title: "序号",
                    dataIndex: "index",
                    width: 50,
                    fixed: "left",
                    edit: false,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...materialDetails.map((item: any) => {
                    return item;
                }),
            ]}
            dataSource={cargoData.map((item: any, index: number) => ({
                ...item,
                key: item.id || `item-${index}`
            })) || []}
        />
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
                    search:[{
                        title: "查询",
                        dataIndex: "fuzzyQuery",
                        width: 200,
                        placeholder: "物料编码/品名"
                    }]
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
    </Spin>
})