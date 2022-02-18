import React, { useState } from 'react'
import { Spin, Form, Button, Modal, message, Row, Radio } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailTitle, BaseInfo, DetailContent, CommonTable, Attachment } from '../common'
import { baseInfoData, detaiBidStatus, isBidding, noBidding, bidPageInfo, bidPageInfoCount } from './bidding.json'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'

export default function InformationDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [form] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [isBid, setIsBid] = useState("0")
    const [viewBidList, setViewBidList] = useState<"detail" | "count">("detail")
    const [bidStatusColumns, setBidStatusColumns] = useState<any[]>(isBidding)
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
            resole(data)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { run: deleteRun } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const data: any = await RequestUtil.delete(`/tower-market/bidInfo?id=${params.id}`)
            resole(data)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: bidResStatus, run } = useRequest((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const data: any = await RequestUtil.post(`/tower-market/bidInfo/bidResponse`, { id: params.id, ...postData })
            form.setFieldsValue({ biddingStatus: 1 })
            resole(data)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            await run({
                ...submitData,
                projectLeaderId: submitData.projectLeaderId?.id,
                bigPackageIds: submitData.bigPackageIds?.records.map((item: any) => item.id)
            })
            setVisible(false)
            history.go(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => setVisible(false)
    const handleChange = (fields: any) => {
        if (Object.keys(fields)[0] === "biddingStatus") {
            setIsBid(fields.biddingStatus)
            if (fields.biddingStatus === 2) {
                form.setFieldsValue({
                    biddingStatus: fields.biddingStatus,
                    reason: ""
                })
                setBidStatusColumns([...isBidding, ...noBidding])
            } else {
                form.resetFields()
                form.setFieldsValue({
                    biddingStatus: fields.biddingStatus
                })
                setBidStatusColumns([...isBidding,
                ...detaiBidStatus.map((item: any) => {
                    if (item.dataIndex === "bigPackageIds") {
                        return ({ ...item, path: `${item.path}?bidInfoId=${params.id}` })
                    }
                    return item
                })])
            }
        }
    }
    const handleDelete = () => {
        Modal.confirm({
            title: "确定删除本条消息吗",
            onOk: async () => new Promise(async (resove, reject) => {
                try {
                    const result = await deleteRun()
                    message.success("删除成功...")
                    resove(result)
                    history.goBack()
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
    return <>
        <Modal
            zIndex={15}
            visible={visible}
            title="是否应标"
            okText="确定"
            onOk={handleModalOk}
            confirmLoading={bidResStatus}
            onCancel={handleModalCancel} >
            <BaseInfo form={form} edit columns={bidStatusColumns} dataSource={{}} col={1} onChange={handleChange} />
        </Modal>
        <DetailContent
            operation={[
                <Button key="setting" type="primary" style={{ marginRight: "16px" }} onClick={() => history.push(`/bidding/information/edit/${params.id}`)}>编辑</Button>,
                <Button key="delete" type="default" style={{ marginRight: "16px" }} onClick={handleDelete}>删除</Button>,
                data.biddingStatus === 0 && <Button key="bidding" style={{ marginRight: "16px" }} onClick={() => setVisible(true)}>是否应标</Button>,
                <Button key="new" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <DetailTitle title="基本信息" />
            <BaseInfo
                columns={isBid === "2" ? baseInfoData : baseInfoData.filter((item: any) => item.dataIndex !== "reason")}
                dataSource={data || {}}
                col={4} />
            <DetailTitle title="物资清单" />
            <Row>
                <Radio.Group defaultValue={viewBidList} onChange={(event: any) => setViewBidList(event.target.value)}>
                    <Radio.Button value="detail" key="detail">明细</Radio.Button>
                    <Radio.Button value="count" key="count">统计</Radio.Button>
                </Radio.Group>
            </Row>
            {viewBidList === "detail" && <CommonTable haveIndex columns={bidPageInfo} dataSource={data?.bidPackageInfoVOS} />}
            {viewBidList === "count" && <CommonTable haveIndex rowKey="partBidNumber" columns={bidPageInfoCount} dataSource={data?.bidPackageInfoCensusVOS} />}
            <Attachment title="附件" dataSource={data?.attachVos} />
        </DetailContent>
    </>
}