import React, { useState, useRef, useImperativeHandle, forwardRef } from "react"
import { Button, Form, message, Spin, Modal, Select } from "antd"
import { useHistory, useRouteMatch } from "react-router-dom"
import { BaseInfo, DetailContent, DetailTitle, EditTable } from '../../common'
import { costBase } from '../managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { voltageGradeOptions } from "../../../configuration/DictionaryOptions"
export type SelectType = "selectA" | "selectB" | "selectC"

// 保留两位小数
export function processingNumber(arg: any) {
    arg = typeof arg === "number" ? arg + "" : arg
    arg = arg.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
    arg = arg.replace(/^\./g, ""); // 验证第一个字符是数字而不是
    arg = arg.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
    arg = arg.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    arg = arg.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
    return arg
}

const EditableProTableListItem: React.FC<any> = forwardRef(({ data, index }, ref) => {
    const [formRef] = Form.useForm()
    const yclHead: any[] = data.head.filter((headItem: any) => {
        if (headItem.title.includes("单价(元/吨)")) {
            const cl = headItem.title.replace("单价(元/吨)", "")
            const bl = data.head.find((hI: any) => hI.title === `${cl}比例(%)`)
            return !!bl
        }
        if (headItem.title.includes("比例(%)")) {
            const cl = headItem.title.replace("比例(%)", "")
            const bl = data.head.find((hI: any) => hI.title === `${cl}单价(元/吨)`)
            return !!bl
        }
        return false
    })
    const ycl: { dj: string, bl: string }[] = []
    yclHead.forEach((headItem: any) => {
        if (headItem.title.includes("单价(元/吨)")) {
            const cl = headItem.title.replace("单价(元/吨)", "")
            const bl = data.head.find((hI: any) => hI.title === `${cl}比例(%)`)
            !!bl && ycl.push({ dj: headItem.dataIndex, bl: bl.dataIndex })
        }
    })
    useImperativeHandle(ref, () => ({ formRef, index }), [])

    // 公式：
    // 原材料均价=相同材料规格*对应的比例之合
    // 废料损耗=钢材消耗定额 * （原材料均价 - 废料均价）
    // 不含螺栓价格=原材料均价+废料损耗+镀锌成本+加工费+公司税费
    // 螺栓成本均价 = （螺栓单价 - 不含螺栓价格） *  螺栓占比
    // 核算价格 = 螺栓成本均价+ 不含螺栓价格 + 利润 + 地面交货 + 物流费用

    const handleChange = (fields: any, allfields: any) => {
        const allValue = allfields.submit[0]
        let fljj: number = processingNumber(allValue.fljj || "0")
        let gcxh: number = processingNumber(allValue.gcxh || "0")
        let dxcb: number = processingNumber(allValue.dxcb || "0")
        let jgf: number = processingNumber(allValue.jgf || "0")
        let gsfs: number = processingNumber(allValue.gsfs || "0")
        let lszb: number = parseFloat(allValue.lszb || "0")
        let lsdj: number = processingNumber(allValue.lsdj || "0")
        let logistics_price: number = processingNumber(allValue.logistics_price || "0")
        let lr: number = processingNumber(allValue.lr || "0")
        const ground_receiving_price: number = processingNumber(allValue.ground_receiving_price || "0");
        const yc: number = ycl.reduce((result: number, item: any) => {
            const aa: string = (parseFloat(allValue[item.dj]) * parseFloat(allValue[item.bl]) * 0.01).toFixed(2)
            return result + parseFloat(aa)
        }, 0)
        const flsh: number = parseFloat((gcxh * ((yc * 1) - (fljj * 1)) * 0.01).toFixed(2))
        const bhls: number = parseFloat(((yc * 1) + (flsh * 1) + (dxcb * 1) + (jgf * 1) + (gsfs * 1)).toFixed(2))
        const lscb: number = parseFloat((parseFloat(((lsdj * 1) - (bhls * 1)).toFixed(2)) * lszb * 0.01).toFixed(2))
        const cc: number = parseFloat(((lscb * 1) + (bhls * 1) + (lr * 1) + (ground_receiving_price * 1) + (logistics_price * 1)).toFixed(2))
        const gbq_dfj: number = processingNumber(allValue.gbq_dfj || "0");
        const gbq_dfj_bl: number = processingNumber(allValue.gbq_dfj_bl || "0");
        const gbq_dbj: number = processingNumber(allValue.gbq_dbj || "0");
        const gbq_dbj_bl: number = processingNumber(allValue.gbq_dbj_bl || "0");
        const gbq_cee: number = processingNumber(allValue.gbq_cee || "0");
        const gbq_cee_bl: number = processingNumber(allValue.gbq_cee_bl || "0");
        const gbq_bce_bl: number = processingNumber(allValue.gbq_bce_bl || "0");
        const jgq_dfj: number = processingNumber(allValue.jgq_dfj || "0");
        const jgq_dfj_bl: number = processingNumber(allValue.jgq_dfj_bl || "0");
        const jgq_dbj: number = processingNumber(allValue.jgq_dbj || "0");
        const jgq_dbj_bl: number = processingNumber(allValue.jgq_dbj_bl || "0");
        const jgq_cee: number = processingNumber(allValue.jgq_cee || "0");
        const jgq_cee_bl: number = processingNumber(allValue.jgq_cee_bl || "0");
        const jgq_bce: number = processingNumber(allValue.jgq_bce || "0");
        const jgq_bce_bl: number = processingNumber(allValue.jgq_bce_bl || "0");
        const gbq_bce: number = processingNumber(allValue.gbq_bce || "0");
        formRef.setFieldsValue({
            submit: [{
                ...allValue,
                cc,
                yc,
                flsh,
                bhls,
                lscb,
                gbq_dfj,
                gbq_dfj_bl,
                gbq_dbj,
                gbq_dbj_bl,
                gbq_cee,
                gbq_cee_bl,
                gbq_bce_bl,
                jgq_dfj,
                jgq_dfj_bl,
                jgq_dbj,
                jgq_dbj_bl,
                jgq_cee,
                jgq_cee_bl,
                jgq_bce,
                jgq_bce_bl,
                lr,
                ground_receiving_price,
                gbq_bce,
                logistics_price,
                fljj,
                gcxh,
                dxcb,
                jgf,
                gsfs,
                lszb,
                lsdj,
            }]
        })
    }
    return <EditTable
        form={formRef}
        onChange={handleChange}
        haveNewButton={false}
        haveOpration={false}
        columns={data.head || []}
        dataSource={data.data || []}
    />
})

const EditableProTableList: React.FC<any> = forwardRef(({ data, deleteProduct }, ref) => {
    const currentRef = useRef(data || [])
    useImperativeHandle(ref, () => ({
        data: currentRef.current
    }), [data.length])

    return <>
        {data.map((item: any, index: number) => <div key={index}>
            <DetailTitle title={`产品类型:${item.voltage}kv${item.productName}`} operation={[<Button type="primary" key="delete" onClick={() => deleteProduct && deleteProduct(item)}>删除产品</Button>]} />
            <EditableProTableListItem data={item} index={index} key={index} ref={(itemRef: any) => { currentRef.current[index] = itemRef }} />
        </div>)}
    </>
})

export default function CostEdit() {
    const voltageEnum: any = voltageGradeOptions?.map((dic: any) => ({ label: dic.name, value: dic.name }))
    const history = useHistory()
    const [baseInfo] = Form.useForm()
    const formRef = useRef([])
    const params = useRouteMatch("/project/management/:type/:tab/:projectId")?.params as any
    const [visible, setVisible] = useState<boolean>(false)
    const [askProductDtos, setAskProductDtos] = useState<any[]>([])
    const [form] = Form.useForm()
    const { data: productTypeEnum } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const productType: any = await RequestUtil.get(`/tower-market/ProductType/getProduct`)
            resole(productType.map((item: any) => ({ value: item.productName, label: item.productName })))
        } catch (error) {
            reject(error)
        }
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const askInfo: any = await RequestUtil.get(`/tower-market/askInfo?projectId=${params.projectId}`)
            setAskProductDtos(askInfo?.productArr?.map((item: any, index: number) => ({
                ...item,
                id: index,
                data: [({ ...item.data })]
            })) || [])
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
                id: askProductDtos.length,
                data: [{
                    ...initValues,
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
            if ((formRef.current as any).data.length <= 0 || !(formRef.current as any).data[0]) {
                message.error("至少新增一个产品类型")
                return
            } else {
                (formRef.current as any).data = (formRef.current as any).data.filter((item: any) => item != null);
            }
            const askProductDtoDatas = await Promise.all((formRef.current as any).data.map((item: any) => item.formRef.validateFields()))
            const submitData = params.type === "new" ? {
                ...baseInfoData,
                askProductDtos: askProductDtoDatas.map((item: any, index: number) => ({
                    params: Object.keys(item.submit[0]).map((itemKey: any) => `${itemKey}-${item.submit[0][itemKey]}`).join(","),
                    productName: askProductDtos[index].productName,
                    voltage: askProductDtos[index].voltage
                }))
            } : {
                ...baseInfoData,
                id: data?.askInfoVo.id,
                askProductDtos: askProductDtoDatas.map((item: any, index: number) => ({
                    params: Object.keys(item.submit[0]).map((itemKey: any) => `${itemKey}-${item.submit[0][itemKey]}`).join(","),
                    productName: askProductDtos[index].productName,
                    voltage: askProductDtos[index].voltage
                }))
            }
            await saveRun(submitData)
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
        Modal.confirm({
            title: "删除",
            content: "是否确认删除该产品？",
            onOk: () => setAskProductDtos(askProductDtos.filter((askItem: any) => !(askItem.productName === item.productName && askItem.voltage === item.voltage && askItem.id === item.id)))
        })
    }

    return <>
        <ManagementDetailTabsTitle />
        <Modal
            visible={visible}
            title="新增产品类型"
            okText="创建"
            onOk={handleNewProductTypeOk}
            onCancel={() => {
                setVisible(false)
                form.resetFields()
            }} destroyOnClose>
            <Form form={form} labelAlign="right">
                <Form.Item label="产品类型" name="productName" rules={[
                    {
                        "required": true,
                        "message": "请选择产品类型..."
                    }
                ]}>
                    <Select style={{ width: "95%", marginLeft: "19px" }}>
                        {productTypeEnum?.map((item: any) => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="电压等级(kv)" name="voltage" rules={[
                    {
                        "required": true,
                        "message": "请输入电压等级(kv)..."
                    }
                ]}>
                    <Select style={{ width: "100%" }}>
                        {voltageEnum.map((item: any) => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                    </Select>
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
                <EditableProTableList data={askProductDtos || []} ref={formRef} deleteProduct={deleteProduct} />
            </DetailContent>
        </Spin>
    </>
}