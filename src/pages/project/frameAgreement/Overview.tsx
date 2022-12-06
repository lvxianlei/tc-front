import React from "react"
import { Button, Result, Image, Spin } from 'antd'
import { Link, useHistory, useParams, } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { frameAgreementColumns, materialListColumns } from "./frame.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { winBidTypeOptions } from '../../../configuration/DictionaryOptions'
import { changeTwoDecimal_f } from '../../../utils/KeepDecimals';
import quesheng from "../../../../public/quesheng.png"

export default function Overview() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/frameAgreement/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <Spin spinning={loading}>
        <DetailContent operation={[
            <Button key="edit" style={{ marginRight: '16px' }} type="primary" onClick={() => history.push(`/project/management/edit/frameAgreement/${params.id}`)}>编辑</Button>,
            <Button key="goback" onClick={() => history.replace("/project/management")}>返回</Button>
        ]}>
            <DetailTitle title="基本信息" style={{ padding: "0 0 8px 0", }} />
            <BaseInfo columns={frameAgreementColumns.map((item: any) => item.dataIndex === "bidType" ? ({
                ...item,
                enum: winBidTypeOptions?.map((fitem: any) => ({
                    value: fitem.id, label: fitem.name
                }))
            }) : item)}
                dataSource={
                    {
                        ...data,
                        implementWeight: data?.implementWeight ? changeTwoDecimal_f(data?.implementWeight) : "0.00000000",
                        implementMoney: data?.implementMoney ? changeTwoDecimal_f(data?.implementMoney) : "0.00",
                        implementWeightPro: data?.implementWeightPro ? data?.implementWeightPro : "0.00",
                        implementMoneyPro: data?.implementMoneyPro ? data?.implementMoneyPro : "0.00",
                    }
                    || {
                        implementWeight: "0.00000000",
                        implementMoney: "0.00",
                        implementWeightPro: "0.00",
                        implementMoneyPro: "0.00"
                    }
                }
            />
            <DetailTitle title="合同物资清单" />
            <CommonTable columns={[
                { title: '序号', dataIndex: 'index', width: 50, key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                ...materialListColumns
            ]} dataSource={data?.contractCargoVos} />
            <DetailTitle title="系统信息" />
            <BaseInfo columns={[
                { title: "最后编辑人", dataIndex: 'updateUserLast' },
                { title: "最后编辑时间", dataIndex: 'updateTimeLast', type: "date" },
                { title: "创建人", dataIndex: 'createUserName' },
                { title: "创建时间", dataIndex: 'createTime', type: "date" }
            ]} dataSource={data || {}} />
        </DetailContent>
    </Spin>
}