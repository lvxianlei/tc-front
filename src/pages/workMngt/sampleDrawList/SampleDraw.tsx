import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Modal, Form, Image } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common';
import { useHistory } from 'react-router-dom';

export default function Information(): React.ReactNode {
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            console.log(submitData)
            setVisible(false)
        } catch (error) {
            console.log(error)
        }
    }
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'projectName',
            title: '段名',
            width: 50,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '构建编号',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '材料名称',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '小样图名称',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'bidBuyEndTime',
            title: '上传时间',
            width: 200,
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 230,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link'>删除</Button>
                    <Button type='link' onClick={() => setVisible(true)}>查看</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => setVisible(false)
    return (
        <>
            <Modal visible={visible} title="图片" footer={false}  onOk={handleModalOk} onCancel={handleModalCancel} width={800}>
                <Image 
                    src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
                    preview={false}
                />
            </Modal>
            <Page
                path="/tower-market/bidInfo"
                columns={columns}
                extraOperation={
                    <Space>
                    <Button type="primary">导出</Button>
                    <Button type="primary">导入</Button>
                    <Button type="primary">下载小样图</Button>
                    <Button type="primary">完成小样图</Button>
                    <Button type="primary" onClick={() => history.goBack()}>返回上一级</Button>
                    <span>小样图数：23/100</span>
                    </Space>
                }
                searchFormItems={[
                    {
                        name: 'startBidBuyEndTime',
                        label: '上传时间',
                        children: <DatePicker />
                    },
                    {
                        name: 'biddingStatus',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入段号/构件编号进行查询" maxLength={200} />
                    },
                ]}
            />
        </>
    )
}