import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory, useParams } from 'react-router-dom'
import { CommonTable, Page } from '../../../common'

export default function PickPickList(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const params = useParams<{ id: string }>();
    const history = useHistory();
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
        { title: '段名', dataIndex: 'partBidNumber', key: 'partBidNumber', },
        { title: '构件编号', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '材料名称', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '材质', dataIndex: 'amount', key: 'amount' },
        { title: '规格', dataIndex: 'unit', key: 'unit' },
        { title: '单基件数', dataIndex: 'unit', key: 'unit' },
        { title: '长度（mm）', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '宽度（mm）', dataIndex: 'amount', key: 'amount' },
        { title: '理算重量（kg）', dataIndex: 'unit', key: 'unit' },
        { title: '单件重量（kg）', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '小计重量（kg）', dataIndex: 'amount', key: 'amount' },
        { title: '备注', dataIndex: 'unit', key: 'unit' },
        { title: '操作', key:'operation', render:(): React.ReactNode =>(
                <Button type='link'>删除</Button>
        )}
    ]

    const handleModalCancel = () => setVisible(false)
    return (
        <>
            <Modal title='交付物清单'  width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
                <CommonTable columns={[
                    { 
                        key: 'index',
                        title: '序号', 
                        dataIndex: 'index',
                        width: 50, 
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                    { 
                        key: 'name', 
                        title: '交付物名称', 
                        dataIndex: 'name',
                        width: 150 
                    },
                    { 
                        key: 'name', 
                        title: '用途', 
                        dataIndex: 'name',
                        width: 230
                    },
                    { 
                        key: 'operation', 
                        title: '操作', 
                        dataIndex: 'operation', 
                        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                            <Button type="link">下载</Button>
                    ) }
                ]} dataSource={[]} />
            </Modal>
            <Page
                path="/tower-market/bidInfo"
                columns={columns}
                extraOperation={
                    <Space>
                        <Button type="primary">导出</Button>
                        {/* <Button type="primary">模板下载</Button> */}
                        <Button type="primary">导入</Button>
                        <Button type="primary" onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/pick/${params.id}/drawApply`)}}>图纸塔型套用</Button>
                        <Button type="primary" onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/pick/${params.id}/setOutApply`)}}>放样塔型套用</Button>
                        <Button type="primary">完成提料</Button>
                        <Button type="primary">编辑/锁定</Button>
                        <Button type="primary" onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/pick/${params.id}/recognize`)}}>识别</Button>
                        <Button type="primary">返回上一级</Button>
                    </Space>
                }
                searchFormItems={[
                    {
                        name: 'startBidBuyEndTime',
                        label: '材料名称',
                        children: <DatePicker />
                    },
                    {
                        name: 'startBidBuyEndTime',
                        label: '材质',
                        children: <DatePicker />
                    }
                ]}
            />
        </>
    )
}