import React, { useState } from 'react'
import { Spin, Form, Button, Modal, Select, Input, Upload } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
// import { PlusOutlined } from "@ant-design/icons"
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../common'
import { PopTable } from "../common/FormItemType"
import { baseInfoData } from './biddingHeadData.json'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import AuthUtil from '../../utils/AuthUtil'
const tableColumns = [
    { title: '序号', dataIndex: 'index', width: 50, key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    {
        title: '分标编号',
        dataIndex: 'partBidNumber',
        key: 'partBidNumber',
    },
    { title: '货物类别', dataIndex: 'goodsType' },
    { title: '包号', dataIndex: 'packageNumber' },
    { title: '数量', dataIndex: 'amount' },
    { title: '单位', dataIndex: 'unit' },
    { title: '交货日期', dataIndex: 'deliveryDate' },
    { title: '交货地点', dataIndex: 'deliveryPlace' }
]
export default function InformationDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [form] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [popTablevisible, setPopTableVisible] = useState<boolean>(false)
    const [isBid, setIsBid] = useState("0")
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const { loading: bidResStatus, data: bidResResult, run } = useRequest((postData: {}) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.post(`/tower-market/bidInfo/bidResponse`, { id: params.id, ...postData })
        form.setFieldsValue({ biddingStatus: 1 })
        resole(data)
    }), { manual: true })
    const detailData: any = data
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            await run({ ...submitData })
            setVisible(false)
            history.go(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => setVisible(false)
    const handleChange = (fields: any, allFields: any) => {
        if (Object.keys(fields)[0] === "biddingStatus") {
            setIsBid(fields.biddingStatus)
        }
    }
    return <>
        <Modal zIndex={15} visible={visible} title="是否应标" okText="确定并自动生成项目" onOk={handleModalOk} onCancel={handleModalCancel} >
            <Form form={form} onValuesChange={handleChange}>
                <Form.Item name="biddingStatus" label="是否应标">
                    <Select>
                        <Select.Option value="1">是</Select.Option>
                        <Select.Option value="2">否</Select.Option>
                    </Select>
                </Form.Item>
                {isBid === "2" && <Form.Item name="reason" label="原因">
                    <Input.TextArea />
                </Form.Item>}
                {isBid === "1" && <Form.Item name="projectLeaderId" label="设置项目负责人">
                    <PopTable onChange={(event: any) => form.setFieldsValue({ projectLeaderId: event.id })} data={{
                        type: "PopTable",
                        title: "选择项目负责人",
                        dataIndex: "projectLeader",
                        path: "/sinzetech-user/user",
                        dependencies: true,
                        columns: [
                            {
                                title: '登录账号',
                                dataIndex: 'account'
                            },
                            {
                                title: '用户姓名',
                                dataIndex: 'name',
                                search: true
                            },
                            {
                                title: '所属角色',
                                dataIndex: 'userRoleNames'
                            },
                            {
                                title: '所属机构',
                                dataIndex: 'departmentName'
                            }
                        ] as any[]
                    }} /> </Form.Item>}
            </Form>
        </Modal>
        <DetailContent
            title={[
                <Button key="setting" type="primary" style={{ marginRight: "16px" }} onClick={() => history.push(`/bidding/information/edit/${params.id}`)}>编辑</Button>,
                <Button key="delete" type="default" style={{ marginRight: "16px" }} onClick={() => Modal.confirm({ title: "确定删除本条消息吗" })}>删除</Button>,
                detailData.biddingStatus === 0 && <Button key="bidding" style={{ marginRight: "16px" }} onClick={() => setVisible(true)}>是否应标</Button>,
                <Button key="new" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={baseInfoData} dataSource={detailData} col={4} />
            <DetailTitle title="货物清单" />
            <CommonTable columns={tableColumns} dataSource={detailData.bidPackageInfoVOS} />
            <DetailTitle title="附件" />
            <CommonTable columns={[
                { title: '序号', dataIndex: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                { title: '文件名', dataIndex: 'name' },
                { title: '大小', dataIndex: 'fileSize' },
                { title: '上传人', dataIndex: 'userName' },
                { title: '上传时间', dataIndex: 'fileUploadTime' }
            ]}
                dataSource={detailData.attachVos}
            />
        </DetailContent>
    </>
}