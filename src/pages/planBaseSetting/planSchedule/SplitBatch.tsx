import React, { useState } from 'react';
import { Space, Button, Modal, Form, message, Select } from 'antd';
import { SearchTable as Page } from '../../common';
import { useHistory, useParams } from 'react-router-dom';
import { factoryTypeOptions } from "../../../configuration/DictionaryOptions"
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

export default function SampleDraw(): React.ReactNode {
    const params = useParams<{ id: string }>()
    const history = useHistory();
    const [filterValue, setFilterValue] = useState({});
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
    const [form] = Form.useForm();
    const [factoryForm] = Form.useForm();
    const { run } = useRequest((option) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-aps/productionPlan/factory`, option);
            resole(result)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { manual: true })

    const { run: completeBatchRun } = useRequest(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/productionPlan/complete/batch/${params.id}`);
            resole(result)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { manual: true })

    const handleModalOk = async () => {
        try {
            const splitData = await form.validateFields()
            const submitData = selectedRows.map((item: any) => {
                return {
                    id: item.id,
                    productionBatch: splitData?.productionBatch
                }
            })
            await RequestUtil.post(`/tower-aps/productionPlan/batchNo/${params.id}`, submitData).then(() => {
                message.success('提交成功！')
                form.resetFields()
                setSelectedKeys([])
                setSelectedRows([])
                history.go(0)
            })
        } catch (error) {
            console.log(error)
        }
    }
    const columns = [
        {
            key: 'productionBatch',
            title: '批次',
            dataIndex: 'productionBatch'
        },
        {
            key: 'productionBatchNo',
            title: '批次号',
            dataIndex: 'productionBatchNo'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productNumber',
            title: '杆塔号',
            dataIndex: 'productNumber'
        },
        {
            key: 'planDeliveryTime',
            title: '计划交货期',
            dataIndex: 'planDeliveryTime'
        },
        {
            title: '厂区名',
            dataIndex: 'factoryName'
        }
    ]

    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    const handleSelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys)
        setSelectedRows(selectedRows)
    };

    const finishBatch = () => {
        Modal.confirm({
            title: "完成批次设置",
            content: "确认后，批次将不可修改",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    await completeBatchRun()
                    await message.success("成功完成批次设置")
                    resove(true)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
    const useFactory = () => {
        Modal.confirm({
            title: "分配厂区",
            icon: null,
            content: <Form form={factoryForm}>
                <Form.Item
                    label="厂区名"
                    name="factoryId"
                    rules={[{ required: true, message: '请选择厂区名' }]}>
                    <Select>
                        {factoryTypeOptions?.map((item: any) => <Select.Option
                            key={item.id}
                            value={item.id}>
                            {item.name}
                        </Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>,
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    const factoryId = await factoryForm.validateFields()
                    await run(selectedRows.map((item: any) => ({
                        id: item.id,
                        productionBatchNo: item.productionBatchNo,
                        factoryId: factoryId.factoryId
                    })))
                    await message.success("已成功分配厂区")
                    setSelectedKeys([])
                    setSelectedRows([])
                    factoryForm.resetFields()
                    history.go(0)
                    resove(true)
                } catch (error) {
                    reject(false)
                }
            }),
            onCancel() {
                factoryForm.resetFields()
            }
        })
    }

    const cancelFactory = () => {
        Modal.confirm({
            title: "取消分配厂区",
            content: "是否取消分配厂区？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    await run(selectedRows.map((item: any) => ({ id: item.id, productionBatchNo: item.productionBatchNo })))
                    setSelectedKeys([])
                    setSelectedRows([])
                    history.go(0)
                    resove(true)
                } catch (error) {
                    reject(false)
                }
            })
        })
    }

    const settingBatch = () => {
        Modal.confirm({
            title: "设置批次",
            icon: null,
            content: <Form form={form}>
                <Form.Item name='productionBatch' rules={[{ required: true, message: '请选择批次' }]} label='批次'>
                    <Select placeholder="请选择批次">
                        <Select.Option
                            key={1}
                            value={'第一批'}
                        >
                            {'第一批'}
                        </Select.Option>
                        <Select.Option
                            key={2}
                            value={'第二批'}
                        >
                            {'第二批'}
                        </Select.Option>
                        <Select.Option
                            key={3}
                            value={'第三批'}
                        >
                            {'第三批'}
                        </Select.Option>
                        <Select.Option
                            key={4}
                            value={'第四批'}
                        >
                            {'第四批'}
                        </Select.Option>
                        <Select.Option
                            key={5}
                            value={'第五批'}
                        >
                            {'第五批'}
                        </Select.Option>
                        <Select.Option
                            key={6}
                            value={'第六批'}
                        >
                            {'第六批'}
                        </Select.Option>
                        <Select.Option
                            key={7}
                            value={'第七批'}
                        >
                            {'第七批'}
                        </Select.Option>
                        <Select.Option
                            key={8}
                            value={'第八批'}
                        >
                            {'第八批'}
                        </Select.Option>
                        <Select.Option
                            key={9}
                            value={'第九批'}
                        >
                            {'第九批'}
                        </Select.Option>
                        <Select.Option
                            key={10}
                            value={'第十批'}
                        >
                            {'第十批'}
                        </Select.Option>
                        <Select.Option
                            key={11}
                            value={'第十一批'}
                        >
                            {'第十一批'}
                        </Select.Option>
                        <Select.Option
                            key={12}
                            value={'第十二批'}
                        >
                            {'第十二批'}
                        </Select.Option>
                        <Select.Option
                            key={13}
                            value={'第十三批'}
                        >
                            {'第十三批'}
                        </Select.Option>
                        <Select.Option
                            key={14}
                            value={'第十四批'}
                        >
                            {'第十四批'}
                        </Select.Option>
                        <Select.Option
                            key={15}
                            value={'第十五批'}
                        >
                            {'第十五批'}
                        </Select.Option>
                        <Select.Option
                            key={16}
                            value={'第十六批'}
                        >
                            {'第十六批'}
                        </Select.Option>
                        <Select.Option
                            key={17}
                            value={'第十七批'}
                        >
                            {'第十七批'}
                        </Select.Option>
                        <Select.Option
                            key={18}
                            value={'第十八批'}
                        >
                            {'第十八批'}
                        </Select.Option>
                        <Select.Option
                            key={19}
                            value={'第十九批'}
                        >
                            {'第十九批'}
                        </Select.Option>
                        <Select.Option
                            key={20}
                            value={'第二十批'}
                        >
                            {'第二十批'}
                        </Select.Option>
                    </Select>
                </Form.Item>
            </Form>,
            onOk: handleModalOk,
            onCancel: () => form.resetFields()
        })
    }
    return <Page
        path={`tower-aps/productionPlan/batchNo/${params.id}`}
        columns={columns}
        onFilterSubmit={onFilterSubmit}
        filterValue={filterValue}
        requestData={{ productCategoryId: params.id }}
        tableProps={{
            rowSelection: {
                type: "checkbox",
                selectedRowKeys: selectedKeys,
                onChange: handleSelectChange
            }
        }}
        extraOperation={
            <Space>
                <Button type="primary" onClick={settingBatch} disabled={!(selectedKeys.length !== 0)}>设置批次</Button>
                <Button type="primary" onClick={finishBatch} disabled={!(selectedKeys.length !== 0)}>完成批次设置</Button>
                <Button type="primary" onClick={useFactory} disabled={!(selectedKeys.length !== 0)}>分配厂区</Button>
                <Button type="primary" onClick={cancelFactory} disabled={!(selectedKeys.length !== 0)}>取消分配厂区</Button>
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </Space>
        }
        searchFormItems={[]}
    />
}