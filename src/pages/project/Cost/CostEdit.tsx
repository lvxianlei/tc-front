import React, { useState, useRef, useImperativeHandle, useEffect, forwardRef } from "react"
import { Button, Form, message } from "antd"
import { useHistory, useParams } from "react-router-dom"
import { BaseInfo, DetailContent, DetailTitle } from '../../common'
import { costBase } from '../managementDetailData.json'
import NewProductType from "./NewProductType"
import type { TabTypes } from "../ManagementDetail"
import { EditableProTable, } from '@ant-design/pro-table'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
export type SelectType = "selectA" | "selectB" | "selectC"



const EditableProTableListItem: React.FC<any> = forwardRef(({ data, index }, ref) => {
    const [formRef] = Form.useForm()

    useImperativeHandle(ref, () => ({ formRef, index }), [])

    return <>
        <DetailTitle title="产品类型：" />
        <EditableProTable
            rowKey="id"
            maxLength={5}
            recordCreatorProps={false}
            editable={{
                form: formRef,
                editableKeys: [0]
            }}
            scroll={{ x: true }}
            columns={data.head.map((cItem: any) => {
                return ({
                    ...cItem,
                    width: "200px",
                    valueType: data.type,
                    formItemProps: {
                        rules: cItem.rules
                    },
                    valueEnum: cItem.enum
                })
            })}
            value={data.data}
        />
    </>
})

const EditableProTableList: React.FC<any> = forwardRef(({ data }, ref) => {
    const currentRef = useRef(data || [])
    useImperativeHandle(ref, () => ({
        data: currentRef.current
    }), [data.length])

    return <>
        {data.map((item: any, index: number) => <EditableProTableListItem data={item} index={index} key={index} ref={(itemRef: any) => { currentRef.current[index] = itemRef }} />)}
    </>
})

export default function CostEdit() {
    const history = useHistory()
    const [baseInfo] = Form.useForm()
    const formRef = useRef([])
    const params = useParams<{ id: string, projectId: string, tab?: TabTypes }>()
    const [visible, setVisible] = useState<boolean>(false)
    const [productName, setProductName] = useState("")
    const [askProductDtos, setAskProductDtos] = useState<any[]>([])
    const { run } = useRequest<{ [key: string]: any }>((productName: string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-market/askInfo/getAskProductParam?productName=${productName}&voltage=`)
            setAskProductDtos([...askProductDtos, { ...result, data: [{ id: 0 }] }])
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

    const handleNewProductTypeOk = async (value: SelectType | "") => {
        setVisible(false)
        setProductName(value)
        await run(value)
    }

    const handleSave = async () => {
        try {
            const baseInfoData = await baseInfo.validateFields();
            const askProductDtoDatas = await Promise.all((formRef.current as any).data.map((item: any) => item.formRef.validateFields()))
            await saveRun({
                ...baseInfoData, askProductDtos: askProductDtoDatas.map((item: any) => ({
                    params: Object.keys(item).map((itemKey: any) => `${itemKey}-${item[itemKey]}`).join(","),
                    productName,
                    voltage: item.vd
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

    return <>
        <ManagementDetailTabsTitle />
        <NewProductType visible={visible} title="新增产品类型" okText="创建" onOk={handleNewProductTypeOk} onCancel={() => setVisible(false)} />
        <DetailContent operation={[
            <Button key="save" style={{ marginRight: '16px' }} type="primary" loading={saveLoading} onClick={handleSave}>保存</Button>,
            <Button key="goback" onClick={() => history.go(-1)}>取消</Button>
        ]}>
            <DetailTitle title="基本信息" />
            <BaseInfo form={baseInfo} columns={costBase} dataSource={{}} edit col={3} />
            <DetailTitle title="产品类型成本评估" operation={[<Button key="newType" type="primary" onClick={handleNewProduct} >新增产品类型</Button>]} />
            <EditableProTableList data={askProductDtos} ref={formRef} />
        </DetailContent>
    </>
}