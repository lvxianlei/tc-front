import React, { useState, useRef, createRef } from "react"
import { Button, Form } from "antd"
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
export default function CostEdit() {
    const history = useHistory()
    const [baseInfo] = Form.useForm()
    const params = useParams<{ id: string, tab?: TabTypes }>()
    const [visible, setVisible] = useState<boolean>(false)
    const [askProductDtos, setAskProductDtos] = useState<any[]>([])
    const { run } = useRequest<{ [key: string]: any }>((productName: string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-market/ProductType/getProductParamProportion?productName=${productName}`)
            setAskProductDtos([{ ...result, data: [{ id: 0 },], ref: createRef() }])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((saveData: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-market/askInfo`, { ...saveData })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleNewProduct = () => setVisible(true)

    const handleNewProductTypeOk = async (value: SelectType | "") => {
        setVisible(false)
        await run(value)
    }

    const handleSave = async () => {
        try {
            const baseInfoData = await baseInfo.validateFields()
            askProductDtos.forEach((item: any) => {
                console.log(item.ref?.current)
            })
            // const abc = await projectForm.validateFields()
            // await saveRun({ ...baseInfoData, askProductDtos })
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        <ManagementDetailTabsTitle />
        <NewProductType visible={visible} title="新增产品类型" okText="创建" onOk={handleNewProductTypeOk} onCancel={() => setVisible(false)} />
        <DetailContent operation={[
            <Button key="save" style={{ marginRight: '16px' }} type="primary" onClick={handleSave}>保存</Button>,
            <Button key="goback" onClick={() => history.go(-1)}>取消</Button>
        ]}>
            <DetailTitle title="基本信息" />
            <BaseInfo form={baseInfo} columns={costBase} dataSource={{}} edit col={3} />
            <DetailTitle title="产品类型成本评估" operation={[<Button key="newType" type="primary" onClick={handleNewProduct} >新增产品类型</Button>]} />
            {askProductDtos.map((item: any, index: number) => <div key={index}>
                <DetailTitle title="产品类型：" />
                <EditableProTable
                    rowKey="id"
                    maxLength={5}
                    actionRef={item.ref}
                    recordCreatorProps={false}
                    editable={{
                        editableKeys: [0]
                    }}
                    columns={item.head.map((cItem: any) => ({
                        ...cItem,
                        valueType: item.type,
                        formItemProps: {
                            rules: item.rules
                        },
                        valueEnum: item.enum
                    }))}
                    value={item.data}
                />
            </div>)}
        </DetailContent>
    </>
}