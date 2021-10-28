import React, { useState } from "react"
import { Button, Spin, Form, Modal } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, EditTable, PopTableContent } from '../common'
import { promotionalTourism, contractInformation } from "./CollectionData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
type ReturnType = 0 | 1 | -1 | undefined
const contract = {
    "title": "相关合同",
    "dataIndex": "contractId",
    "type": "popTable",
    "path": "/tower-market/contract",
    "width": 1011,
    "value": "contractName",
    "dependencies": true,
    "readOnly": true,
    "columns": [
        {
            "title": "合同编号",
            "dataIndex": "contractNumber",
            "search": true
        },
        {
            "title": "合同名称",
            "dataIndex": "contractName"
        },
        {
            "title": "销售类型",
            "dataIndex": "saleType"
        },
        {
            "title": "业主单位",
            "dataIndex": "customerCompany",
            "search": true
        },
        {
            "title": "合同签订单位",
            "dataIndex": "signCustomerName"
        },
        {
            "title": "合同签订日期",
            "dataIndex": "signContractTime"
        },
        {
            "title": "要求交货日期",
            "dataIndex": "deliveryTime"
        }
    ],
    "rules": [
        {
            "required": true,
            "message": "请选择相关合同..."
        }
    ]
}
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [returnType, setReturnType] = useState<ReturnType>(-1)
    const [popContent, setPopContent] = useState<{ id: string, value: string, records: any }>({ value: "", id: "", records: {} })
    const [visible, setVisible] = useState<boolean>(false)
    const [baseForm] = Form.useForm()
    const [contractInfosForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/backMoney/${params.id}`)
            baseForm.setFieldsValue(result)
            contractInfosForm.setFieldsValue(result.backMoneyVOList)
            setReturnType(result.returnType)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/backMoney/ConfirmBackMoney`, { ...data, id: params.id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        const baseInfo = await baseForm.validateFields()
        const confirmBackMoneyInfoDTOList = await contractInfosForm.validateFields()
        await saveRun({ ...baseInfo, confirmBackMoneyInfoDTOList: confirmBackMoneyInfoDTOList.submit })
    }

    const handleBaseInfoChange = (fields: any) => {
        if (fields.returnType || fields.returnType === 0) {
            setReturnType(fields.returnType)
        }
    }
    const handleOk = async () => {
        const contractInfos = await contractInfosForm.getFieldsValue()
        contractInfosForm.setFieldsValue({ submit: [...contractInfos.submit, { ...popContent.records, key: popContent.id }] })
        setVisible(false)
    }
    const handleCancel = () => setVisible(false)
    const handleChange = (event: any) => setPopContent({ id: event[0].id, value: event[0][contract.value || "name" || "id"], records: event[0] })
    return <DetailContent operation={[
        <Button key="save" type="primary" style={{ marginRight: 16 }} onClick={handleSubmit}>确认回款信息</Button>,
        <Button key="cancel" onClick={() => history.go(-1)}>返回</Button>
    ]}>
        <Modal width={1011} title="选择合同" destroyOnClose visible={visible} onOk={handleOk} onCancel={handleCancel}>
            <PopTableContent data={contract as any} onChange={handleChange} />
        </Modal>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo
                onChange={handleBaseInfoChange}
                form={baseForm}
                columns={promotionalTourism.filter((item: any) => returnType === 0 ? true : item.dataIndex !== "payNum")} dataSource={data || {}}
                edit
            />
            {returnType === 1 && <>
                <DetailTitle title="合同信息" operation={[<Button type="primary" ghost onClick={() => setVisible(true)}>选择合同</Button>]} />
                <EditTable form={contractInfosForm} haveNewButton={false} columns={contractInformation} dataSource={[]} />
            </>}
        </Spin>
    </DetailContent>
}