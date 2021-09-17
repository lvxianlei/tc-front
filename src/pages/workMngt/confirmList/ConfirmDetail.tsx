import React, { useState } from 'react'
import { Button, Row, Col, Tabs, Radio, Spin, Space, Modal, Form } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './confirm.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';

const tableColumns = [
    { 
        title: '序号', 
        dataIndex: 'index', 
        key: 'index', 
        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) 
    },
    { 
        title: '线路名称 *', 
        dataIndex: 'partBidNumber',
        key: 'partBidNumber', 
    },
    { 
        title: '杆塔号 *', 
        dataIndex: 'goodsType', 
        key: 'goodsType' 
    },
    { 
        title: '塔型 *', 
        dataIndex: 'packageNumber', 
        key: 'packgeNumber' 
    },
    { 
        title: '塔型钢印号 *', 
        dataIndex: 'amount', 
        key: 'amount' 
    },
    { 
        title: '产品类型 *', 
        dataIndex: 'unit', 
        key: 'unit' 
    },
    { 
        title: '电压等级（kv） *', 
        dataIndex: 'unit', 
        key: 'unit' 
    },
    { 
        title: '呼高（m） *', 
        dataIndex: 'unit', 
        key: 'unit' 
    },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        render: (_: undefined, record: any): React.ReactNode => (
            <Space direction="horizontal" size="small">
                <Button type='link'>编辑</Button>
                <Button type='link'>删除</Button>
            </Space>
        )
    }
];

export default function ManagementDetail(): React.ReactNode {
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
    const handleModalCancel = () => setVisible(false)
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <Spin spinning={loading}>
            <DetailContent operation={[
                <Space>
                    <Button type='primary' onClick={() => history.goBack()}>保存</Button>
                    <Button type='primary' onClick={() => history.goBack()}>保存并提交</Button>
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <Space>
                        <Button type='primary' ghost onClick={() => history.goBack()}>导出</Button>
                        <Button type='primary' ghost onClick={() => history.goBack()}>模板下载</Button>
                        <span>总基数：23基</span>
                        <span>总重量：24kg</span>
                    </Space>
                    <Space>
                        <Button type='primary' ghost onClick={() => history.goBack()}>导入</Button>
                        <Button type='primary' ghost onClick={() => setVisible(true)}>添加</Button>
                    </Space>
                </div>
                <CommonTable columns={ tableColumns } dataSource={ detailData?.attachVos } />
                <DetailTitle title="备注"/>
                <TextArea maxLength={ 200 }/>
                <DetailTitle title="附件"/>
                <CommonTable columns={[
                    {
                        title: '附件名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        render: (_: undefined, record: any): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Button type='link'>下载</Button>
                                <Button type='link'>预览</Button>
                                <Button type='link'>删除</Button>
                            </Space>
                        )
                    }
                ]} dataSource={detailData?.attachVos} />
            </DetailContent>
            <Modal visible={visible} title="添加" onOk={handleModalOk} onCancel={handleModalCancel}  width={ 1200 }>
                {/* <Form form={form}> */}
                    {/* <Form.Item name="aaaa" label="部门">
                        <Select>
                            <Select.Option value="1">是</Select.Option>
                            <Select.Option value="0">否</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="cccc" label="人员">
                        <Select>
                            <Select.Option value="1">是</Select.Option>
                            <Select.Option value="0">否</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="bbbb" label="计划交付时间">
                        <DatePicker />
                    </Form.Item> */}
                    <BaseInfo columns={baseInfoData} dataSource={detailData || {}} edit/>
                {/* </Form> */}
            </Modal>
        </Spin>
}