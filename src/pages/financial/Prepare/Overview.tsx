import React, { useState } from "react"
import { Button, Modal, Spin, Image } from 'antd'
import { DetailTitle, BaseInfo, CommonTable, Attachment } from '../../common'
import { ApplicationOverview, operationInfo, approvalInfo, paymentInfo } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { payTypeOptions, pleasePayTypeOptions } from "../../../configuration/DictionaryOptions"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false);
    const [picUrl, setPicUrl] = useState<string>();

    const pleasePayTypeEnum = pleasePayTypeOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const paymentMethodEnum = payTypeOptions?.map((item: { id: string, name: string }) => ({
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
        setPicUrl('');
    }

    return <>
        <Spin spinning={loading}>
            <DetailTitle title="申请信息" />
            <BaseInfo columns={ApplicationOverview.map((item: any) => {
                if (item.dataIndex === "pleasePayType") {
                    return ({ ...item, type: "select", enum: pleasePayTypeEnum })
                }
                if (item.dataIndex === "paymentMethod") {
                    return ({ ...item, type: "select", enum: paymentMethodEnum })
                }
                return item
            })} dataSource={data || {}} col={2}/>
            <DetailTitle title="审批信息" />
            <CommonTable columns={[{ title: "序号", dataIndex: "index", width: 50, render: (_: any, _a: any, index) => <>{index + 1}</> }, ...approvalInfo]} dataSource={data?.approveRecordVos || []} />
            <DetailTitle title="付款信息" />
            <CommonTable columns={[
                { title: "序号", dataIndex: "index", width: 50, render: (_: any, _a: any, index) => <>{index + 1}</> }, 
                ...paymentInfo, 
                { 
                    title: "备注", 
                    dataIndex: "index", 
                    width: 50, 
                    render: (_: any, record: Record<string, any>, index: number) => (<>{
                        record.attachInfoVos ? 
                        <Button type="link" onClick={ () => {
                            setVisible(true);
                            setPicUrl(record.attachInfoVos[0].downloadUrl);
                        } }>回执单</Button>
                        : <Button type="link" disabled>回执单</Button>
                    }</>)
                }]} dataSource={data?.applyPaymentRecordVos || []} />
            {/* <Attachment title="回执单" dataSource={data?.applyPaymentAttachInfoVos || []} /> */}
            <DetailTitle title="操作信息" />
            <CommonTable columns={operationInfo} dataSource={ data?.operationRecordInfoVos || []} />
        </Spin>
        <Modal width={1011} visible={visible} onCancel={handleCancel} footer={false}>
            <Image src={picUrl} preview={false} />
        </Modal>
    </>
}