import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Row, Button, Form } from "antd"
import { DetailContent, BaseInfo, DetailTitle, EditTable } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { frameAgreementColumns, cargoVOListColumns } from '../managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { TabTypes } from "../ManagementDetail"
const tableColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '分标编号', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '货物类别', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '包号', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '数量', dataIndex: 'amount', key: 'amount' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '交货日期', dataIndex: 'deliveryDate', key: 'deliveryDate' },
    { title: '交货地点', dataIndex: 'deliveryPlace', key: 'deliveryPlace' }
]
export default function FrameAgreementEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ tab: TabTypes, id: string }>()
    const [baseInfoForm] = Form.useForm()
    const { loading, error, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/frameAgreement/${params.id}`)
        baseInfoForm.setFieldsValue(result)
        resole(result)
    }))

    const handleSubmit = async () => {
        const baseInfoData = await baseInfoForm.getFieldsValue()
        console.log({ ...data, ...baseInfoData })
    }

    return <DetailContent operation={[
        <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={handleSubmit}>保存</Button>,
        <Button key="goback">返回</Button>
    ]}>
        <ManagementDetailTabsTitle />
        <DetailTitle title="基本信息" />
        <BaseInfo form={baseInfoForm} columns={frameAgreementColumns} dataSource={data || {}} edit />
        <DetailTitle title="合同物资清单" />
        <EditTable columns={[
            { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
            ...cargoVOListColumns
        ]} dataSource={data?.contractCargoVos} />
        <DetailTitle title="系统信息" />
        <BaseInfo columns={[
            { title: "最后编辑人", dataIndex: 'updateUserLast' },
            { title: "最后编辑时间", dataIndex: 'updateTimeLast', type: "date" },
            { title: "创建人", dataIndex: 'createUserName' },
            { title: "创建时间", dataIndex: 'createTime', type: "date" }
        ]} dataSource={data || {}} />
    </DetailContent>
}