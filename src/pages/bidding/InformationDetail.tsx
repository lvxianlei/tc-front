import React, { useState } from 'react'
import { Spin, Form, Button, Modal, Select, Input } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../common'
import { baseInfoData } from './biddingHeadData.json'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
const tableColumns = [
    { title: '序号', dataIndex: 'index', width: 50, key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    {
        title: '分标编号',
        dataIndex: 'partBidNumber',
        key: 'partBidNumber',
    },
    { title: '货物类别', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '包号', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '数量', dataIndex: 'amount', key: 'amount' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '交货日期', dataIndex: 'deliveryDate', key: 'deliveryDate' },
    { title: '交货地点', dataIndex: 'deliveryPlace', key: 'deliveryPlace' }
]
export default function InformationDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [form] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const { loading, error, data, run } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            console.log(submitData)
            setVisible(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => setVisible(false)
    return <>
        <Modal visible={visible} title="是否应标" okText="确定并自动生成项目" onOk={handleModalOk} onCancel={handleModalCancel} >
            <Form form={form}>
                <Form.Item name="aaaa" label="是否应标">
                    <Select>
                        <Select.Option value="1">是</Select.Option>
                        <Select.Option value="0">否</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="bbbb" label="设置项目负责人">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
        <DetailContent
            title={[
                <Button key="setting" type="primary" onClick={() => history.push(`/bidding/information/edit/${params.id}`)}>编辑</Button>,
                <Button key="delete" type="default">删除</Button>,
                <Button key="bidding" onClick={() => setVisible(true)}>是否应标</Button>,
                <Button key="new" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={baseInfoData} dataSource={detailData} />
            <DetailTitle title="货物清单" />
            <CommonTable columns={tableColumns} dataSource={detailData.bidPackageInfoDTOList} />
            <DetailTitle title="附件" operation={[<Button key="bid" type="primary">上传附件</Button>]} />
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