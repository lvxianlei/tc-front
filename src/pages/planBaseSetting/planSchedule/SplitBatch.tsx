import React, { useState } from 'react';
import { Space, Button, Modal, Form, message, Popconfirm, Select } from 'antd';
import { Page } from '../../common';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

export default function SampleDraw(): React.ReactNode {
    const params = useParams<{ id: string }>()
    const history = useHistory();
    const [filterValue, setFilterValue] = useState({});
    const [visible, setVisible] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    // const [selectedRows, setSelectedRows] = useState<IAnnouncement[]>([]);
    const [form] = Form.useForm();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-science/smallSample/sampleStat/${params.id}`);
        resole(data)
    }), {})
    const handleModalOk = async () => {
        try {
            const splitData = await form.validateFields()
            const submitData = selectedKeys.map((item: any)=>{
                return {
                    id: item,
                    productionBatch: splitData
                }
            })
            await RequestUtil.post(`/tower-aps/productionPlan/batchNo`,submitData).then(()=>{
                message.success('提交成功！')
                setVisible(false)
                setRefresh(!refresh)
            }).then(()=>{
                history.goBack()
            })
            setVisible(false)
        } catch (error) {
            console.log(error)
        }
    }
    const columns = [
        // {
        //     key: 'index',
        //     title: '序号',
        //     dataIndex: 'index',
        //     width: 50,
        //     render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        // },
        {
            key: 'productionBatch',
            title: '批次',
            width: 200,
            dataIndex: 'productionBatch'
        },
        {
            key: 'productionBatchNo',
            title: '批次号',
            width: 200,
            dataIndex: 'productionBatchNo'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 400,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productNumber',
            title: '杆塔号',
            width: 200,
            dataIndex: 'productNumber'
        },
        {
            key: 'planDeliveryTime',
            title: '客户交货期',
            width: 200,
            dataIndex: 'planDeliveryTime'
        },
    ]

    const handleModalCancel = () => { setVisible(false);  };
    const onFilterSubmit = (value: any) => {
        if (value.upLoadTime) {
            const formatDate = value.upLoadTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.uploadTimeStart = formatDate[0] + ' 00:00:00';
            value.uploadTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.upLoadTime
        }
        setFilterValue(value)
        return value
    }
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        // setSelectedRows(selectedRows)
    }
    return (
        <>
            <Modal visible={visible} title="设置批次" footer={false} onOk={handleModalOk} onCancel={handleModalCancel} width={800}>
                <Form>
                    <Form.Item name='A' rules={[{required:true, message:'请选择批次'}]}>
                        <Select placeholder="请选择批次">
                            <Select.Option key={1} value={'1'}>{'第一批'}</Select.Option>
                            <Select.Option key={2} value={'2'}>{'第二批'}</Select.Option>
                            <Select.Option key={3} value={'3'}>{'第三批'}</Select.Option>
                            <Select.Option key={4} value={'4'}>{'第四批'}</Select.Option>
                            <Select.Option key={5} value={'5'}>{'第五批'}</Select.Option>
                            <Select.Option key={6} value={'6'}>{'第六批'}</Select.Option>
                            <Select.Option key={7} value={'7'}>{'第七批'}</Select.Option>
                            <Select.Option key={8} value={'8'}>{'第八批'}</Select.Option>
                            <Select.Option key={9} value={'9'}>{'第九批'}</Select.Option>
                            <Select.Option key={10} value={'10'}>{'第十批'}</Select.Option>
                            <Select.Option key={11} value={'11'}>{'第十一批'}</Select.Option>
                            <Select.Option key={12} value={'12'}>{'第十二批'}</Select.Option>
                            <Select.Option key={13} value={'13'}>{'第十三批'}</Select.Option>
                            <Select.Option key={14} value={'14'}>{'第十四批'}</Select.Option>
                            <Select.Option key={15} value={'15'}>{'第十五批'}</Select.Option>
                            <Select.Option key={16} value={'16'}>{'第十六批'}</Select.Option>
                            <Select.Option key={17} value={'17'}>{'第十七批'}</Select.Option>
                            <Select.Option key={18} value={'18'}>{'第十八批'}</Select.Option>
                            <Select.Option key={19} value={'19'}>{'第十九批'}</Select.Option>
                            <Select.Option key={20} value={'20'}>{'第二十批'}</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
               
            </Modal>
            <Page
                path={`tower-aps/productionPlan/batchNo/${params.id}`}
                columns={columns}
                refresh={refresh}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                requestData={{ productCategoryId: params.id }}
                tableProps={{
                    rowSelection: {
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }
                }}
                extraOperation={
                    <Space>
                        <Button type="primary" onClick={() => {
                            setVisible(true)
                        }} disabled={!(selectedKeys.length!==0)}>设置批次</Button>
                        <Popconfirm
                            title="是否取消批次?"
                            onConfirm={async () => await RequestUtil.put(`/productionPlan/batchNo`,selectedKeys).then(() => {
                                message.success('取消成功！');
                            })}
                            okText="确认"
                            cancelText="取消"
                            disabled={!(selectedKeys.length!==0)}
                        >
                            <Button type="primary" disabled={!(selectedKeys.length!==0)}>取消批次</Button>
                        </Popconfirm>
                        <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                    </Space>
                }
                searchFormItems={[]}
            />
        </>
    )
}