import React, { useState } from "react"
import { Button, Modal, Spin } from 'antd'
import { DetailTitle, BaseInfo, CommonTable, Attachment, OperationRecord } from '../../common'
import { ApplicationOverview, approvalInfo, paymentInfo } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { costTypeOptions, paymentMethodOptions } from "../../../configuration/DictionaryOptions"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false);
    const [attach, setAttach] = useState([]);

    const pleasePayTypeEnum = costTypeOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const paymentMethodEnum = paymentMethodOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/applyPayment/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const handleCancel = () => {
        setVisible(false);
        setAttach([]);
    }

    return <>
        <Spin spinning={loading}>
            <DetailTitle title="申请信息" />
            <BaseInfo columns={ApplicationOverview.map((item: any) => {
                // if (item.dataIndex === "pleasePayType") {
                //     return ({ ...item, type: "select", enum: pleasePayTypeEnum })
                // }
                if (item.dataIndex === "paymentMethod") {
                    return ({ ...item, type: "select", enum: paymentMethodEnum })
                }
                return item
            })} dataSource={data || {}} col={2} />
            <OperationRecord title="审批信息" operateTypeEnum="APPROVAL" serviceId={id} serviceName="tower-supply" />
            <DetailTitle title="付款信息" />
            <CommonTable columns={[
                { title: "序号", dataIndex: "index", width: 50, render: (_: any, _a: any, index) => <>{index + 1}</> },
                ...paymentInfo,
                {
                    title: "备注",
                    dataIndex: "index",
                    width: 50,
                    render: (_: any, record: Record<string, any>, index: number) => <Button type="link" onClick={() => {
                        setVisible(true);
                        setAttach(record.attachInfoVos);
                    }}>回执单</Button>
                }]} dataSource={data?.applyPaymentRecordVos || []} />
            <OperationRecord title="操作信息" serviceId={id} serviceName="tower-supply" />
            <Attachment
                dataSource={ data?.attachInfoVos }
            />
        </Spin>
        <Modal width={1011} visible={visible} onCancel={handleCancel} footer={false}>
            <Attachment title="回执单" dataSource={attach || []} />
        </Modal>
    </>
}