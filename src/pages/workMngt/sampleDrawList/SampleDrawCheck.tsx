import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Modal, Form, Image, Popconfirm, Descriptions, Upload } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import { CommonTable, DetailTitle, Page } from '../../common';
import { useHistory } from 'react-router-dom';
import { CloudUploadOutlined } from '@ant-design/icons';

export default function SampleDrawCheck(): React.ReactNode {
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [errorVisible, setErrorVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const handleErrorModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            console.log(submitData)
            setErrorVisible(false)
        } catch (error) {
            console.log(error)
        }
    }

    const tableColumns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '操作部门', dataIndex: 'partBidNumber', key: 'partBidNumber', },
        { title: '操作人', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '操作时间', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '问题单状态', dataIndex: 'amount', key: 'amount' },
        { title: '备注', dataIndex: 'unit', key: 'unit' }
    ]
    
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
                    <Button type='link' onClick={() => setErrorVisible(true)}>报错</Button>
                    <Button type='link' onClick={() => setVisible(true)}>查看</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => setVisible(false);
    const handleErrorModalCancel = () => setErrorVisible(false);
    return (
        <>
            <Modal visible={visible} title="图片" footer={false}  onCancel={handleModalCancel} width={800}>
                <Image 
                    src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
                    preview={false}
                />
            </Modal>
            <Modal visible={errorVisible} title="问题单" footer={false}  onCancel={handleErrorModalCancel} width={1200} onOk={handleErrorModalOk}>
                <DetailTitle title="问题信息" />
                <Descriptions
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="小样图名称">Cloud Database</Descriptions.Item>
                    <Descriptions.Item label="备注">Prepaid</Descriptions.Item>
                    <Descriptions.Item label="校核前图片">
                        <Image src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" height={100}/>
                    </Descriptions.Item>
                    <Descriptions.Item label={<Upload >校核后图片 <CloudUploadOutlined /></Upload>}>
                        <div style={{display:'flex',alignItems:'center'}}> 
                        <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" height={100}/>
                        <Button type='link' onClick={()=>{window.open()}}>下载</Button>
                        <Button type='link' onClick={()=>{}}>删除</Button>
                        </div>
                    </Descriptions.Item>
                </Descriptions>
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={[]} />
            </Modal>
            <Page
                path="/tower-market/bidInfo"
                columns={columns}
                extraOperation={
                    <Space>
                    <Button type="primary">导出</Button>
                    <Popconfirm
                        title="确认完成校核?"
                        onConfirm={ () => {} }
                        okText="确认"
                        cancelText="取消"
                    >   
                        <Button type="primary">完成校核</Button>
                    </Popconfirm>
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