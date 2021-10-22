import React, { useState, useRef, useImperativeHandle, forwardRef } from "react"
import { Button, Form, message, Spin, Modal, Select, Input } from "antd"
import { useHistory, useParams } from "react-router-dom"
import { BaseInfo, DetailContent, DetailTitle } from '../../common'
import { costBase } from '../managementDetailData.json'
import type { TabTypes } from "../ManagementDetail"
import { EditableProTable, } from '@ant-design/pro-table'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import ApplicationContext from "../../../configuration/ApplicationContext"

export type SelectType = "selectA" | "selectB" | "selectC"

const EditableProTableListItem: React.FC<any> = forwardRef(({ data, index }, ref) => {
    const [formRef] = Form.useForm()
    useImperativeHandle(ref, () => ({ formRef, index }), [])
    return <EditableProTable
        rowKey="id"
        maxLength={5}
        recordCreatorProps={false}
        form={{
            wrapperCol: { span: 24 },
            labelCol: { span: 24 }
        }}
        editable={{
            form: formRef,
            editableKeys: [0]
        }}
        scroll={{ x: 'max-content' }}
        size="small"
        columns={data.head.map((cItem: any) => {
            return ({
                ...cItem,
                valueType: cItem.type,
                formItemProps: {
                    rules: cItem.rules
                },
                editable: !cItem.disabled,
                valueEnum: cItem.enum && new Map(cItem.enum.map((enumItem: any) => [enumItem.value, { text: enumItem.label }]))
            })
        })}
        value={data.data}
    />
})

const EditableProTableList: React.FC<any> = forwardRef(({ data, deleteProduct }, ref) => {
    const currentRef = useRef(data || [])
    useImperativeHandle(ref, () => ({
        data: currentRef.current
    }), [data.length])

    return <>
        {data.map((item: any, index: number) => <div key={index}>
            <DetailTitle title={`产品类型:${item.voltage}${item.productName}`} operation={[<Button type="primary" key="delete" onClick={() => deleteProduct && deleteProduct(item)}>删除产品</Button>]} />
            <EditableProTableListItem data={item} index={index} key={index} ref={(itemRef: any) => { currentRef.current[index] = itemRef }} />
        </div>)}
    </>
})

export default function CostEdit() {
    const productTypeEnum: any = (ApplicationContext.get().dictionaryOption as any)["101"].map((dic: any) => ({ label: dic.name, value: dic.name }))
    const history = useHistory()
    const [baseInfo] = Form.useForm()
    const formRef = useRef([])
    const params = useParams<{ type: "new" | "edit", projectId: string, tab?: TabTypes }>()
    const [visible, setVisible] = useState<boolean>(false)
    const [askProductDtos, setAskProductDtos] = useState<any[]>([])
    const [form] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const askInfo: any = await RequestUtil.get(`/tower-market/askInfo?projectId=${params.projectId}`)
            setAskProductDtos(askInfo.productArr.map((item: any, index: number) => ({
                ...item,
                data: [({ ...item.data, id: index })]
            })))
            baseInfo.setFieldsValue(askInfo.askInfoVo)
            resole(askInfo)
        } catch (error) {
            reject(error)
        }
    }), { manual: params.type === "new" })

    const { run } = useRequest<{ [key: string]: any }>((productName: string, voltage: string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-market/askInfo/getAskProductParam?productName=${productName}&voltage=${voltage}`)
            const initValues: any = {}
            result.head.forEach((item: any) => item.type !== "select" && (initValues[item.dataIndex] = (result.data[item.dataIndex] && result.data[item.dataIndex] !== -1) ? result.data[item.dataIndex] : 0))
            setAskProductDtos([...askProductDtos, {
                ...result,
                data: [{
                    ...initValues,
                    id: result.length,
                    voltage,
                    productName
                }]
            }])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((saveData: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-market/askInfo`, { ...saveData, projectId: params.projectId })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleNewProduct = () => setVisible(true)

    const handleNewProductTypeOk = async () => {
        const data = await form.validateFields()
        setVisible(false)
        form.resetFields()
        await run(data.productName, data.voltage)
    }

    const handleSave = async () => {
        try {
            const baseInfoData = await baseInfo.validateFields();
            if ((formRef.current as any).data.length <= 0) {
                message.error("至少新增一个产品类型")
                return
            }
            const askProductDtoDatas = await Promise.all((formRef.current as any).data.map((item: any) => item.formRef.validateFields()))
            await saveRun({
                ...baseInfoData,
                id: data?.askInfoVo.id,
                askProductDtos: askProductDtoDatas.map((item: any, index: number) => ({
                    params: Object.keys(item).map((itemKey: any) => `${itemKey}-${item[itemKey]}`).join(","),
                    productName: askProductDtos[index].productName,
                    voltage: askProductDtos[index].voltage
                }))
            })
            message.success("保存成功...")
            history.go(-1)
        } catch (error: any) {
            if (error.errorFields) {
                message.warning("请检查是否有必填项未填写...")
            }
            console.log(error)
        }
    }

    const deleteProduct = (item: any) => {
        setAskProductDtos(askProductDtos.filter((askItem: any) => !(askItem.productName === item.productName && askItem.voltage === item.voltage)))
    }

    return <>
        <ManagementDetailTabsTitle />
        <Modal visible={visible} title="新增产品类型" okText="创建" onOk={handleNewProductTypeOk} onCancel={() => {
            setVisible(false)
            form.resetFields()
        }} destroyOnClose>
            <Form form={form}>
                <Form.Item label="产品类型" name="productName" rules={[
                    {
                        "required": true,
                        "message": "请选择产品类型..."
                    }
                ]}>
                    <Select style={{ width: "100%" }}>
                        {productTypeEnum.map((item: any) => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="电压等级(kv)" name="voltage" rules={[
                    {
                        "required": true,
                        "message": "请输入电压等级(kv)..."
                    }
                ]}>
                    <Input style={{ width: "100%" }} />
                </Form.Item>
            </Form>
        </Modal>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="save" style={{ marginRight: '16px' }} type="primary" loading={saveLoading} onClick={handleSave}>保存</Button>,
                <Button key="goback" onClick={() => history.go(-1)}>取消</Button>
            ]}>
                <DetailTitle title="基本信息" />
                <BaseInfo form={baseInfo} columns={costBase} dataSource={{}} edit col={3} />
                <DetailTitle title="产品类型成本评估" operation={[<Button key="newType" type="primary" onClick={handleNewProduct} >新增产品类型</Button>]} />
                <EditableProTableList data={askProductDtos} ref={formRef} deleteProduct={deleteProduct} />
            </DetailContent>
        </Spin>
    </>
}