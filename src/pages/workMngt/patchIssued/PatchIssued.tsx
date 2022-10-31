/**
 * @author zyc
 * @copyright © 2022
 * @description 放样过程管理-补件下达列表-补件下达
 */

import React, { useRef, useState } from 'react';
import {Spin, Button, Space, Form, Input, Descriptions, Row, Col, Modal, message, Select, Radio} from 'antd';
import { useHistory } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { BaseInfo, CommonTable, DetailContent, DetailTitle, Page } from '../../common';
import { baseColums, tableColumns } from "./patchIssued.json"
import { productTypeOptions, supplyTypeOptions } from '../../../configuration/DictionaryOptions';
import { patchEntryColumns } from "./patchIssued.json"
import { FixedType } from 'rc-table/lib/interface';

interface IPatchIssued {
    supplyBatchEntryVO: any;
}

export interface modalProps {
    onSubmit: () => void;
    resetFields: () => void
}

export default function PatchIssued(): React.ReactNode {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false);

    const history = useHistory();

    const { data: selectData, run: selectRun } = useRequest<any>((record: Record<string, any>) => new Promise(async (resole, reject) => {
        let data = await RequestUtil.get<IPatchIssued>(`/tower-science/supplyBatch/getBatchDetail?id=${record?.id}`);
        setVisible(false)
        form.setFieldsValue({
            machiningDemand: data?.supplyBatchEntryVO?.machiningDemand,
            weldingDemand: data?.supplyBatchEntryVO?.weldingDemand,
            galvanizeDemand: data?.supplyBatchEntryVO?.galvanizeDemand,
            packDemand: data?.supplyBatchEntryVO?.packDemand,
            isPerforate: data?.supplyBatchEntryVO.isPerforate,
            supplyNumber: record?.supplyNumber
        })
        resole(data)
    }), { manual: true })

    const save = () => {
        if (form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true);
                RequestUtil.post<any>(`/tower-science/supplyBatch/saveBatchDetail`, {
                    ...value,
                    id: selectData?.supplyBatchEntryVO?.id,
                    supplyNumber: value?.supplyNumber,
                    isPerforate: value?.isPerforate || 0
                }).then(res => {
                    history.goBack();
                });
            })
        }
    }

    return <>
        <Modal
            destroyOnClose
            key='StructureTextureAbbreviations'
            visible={visible}
            width="80%"
            title="补件条目"
            footer={
                <Button type='primary' onClick={() => {
                    setVisible(false);
                }} ghost>关闭</Button>
            }
            onCancel={() => {
                setVisible(false);
            }}>
            <Page
                path="/tower-science/supplyBatch/getEntryPage"
                columns={[
                    ...patchEntryColumns, {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        fixed: 'right' as FixedType,
                        width: 50,
                        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                            <Button type='link' disabled={record?.batchStatus === 1} onClick={() => selectRun(record)}>选择</Button>
                        )
                    }]}
                headTabs={[]}
                searchFormItems={[
                    {
                        name: 'supplyType',
                        label: '补件类型',
                        children: <Select placeholder="请选择补件类型">
                            {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    },
                    {
                        name: 'productType',
                        label: '产品类型',
                        children: <Select placeholder="请选择产品类型">
                            {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    },
                    {
                        name: 'batchStatus',
                        label: '下达状态',
                        children: <Form.Item name="batchStatus">
                            <Select style={{ width: '120px' }} placeholder="请选择">
                                <Select.Option value={1} key="1">已下达</Select.Option>
                                <Select.Option value={2} key="2">未下达</Select.Option>
                            </Select>
                        </Form.Item>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input style={{ width: '120px' }} placeholder="补件编号/计划号/工程名称/塔型名称/说明" />
                    }
                ]}
                onFilterSubmit={(values: Record<string, any>) => {
                    return values;
                }}
            />
        </Modal>
        <DetailContent operation={[
            <Space direction="horizontal" size="small">
                <Button key="save" type="primary" onClick={save}>保存</Button>
                <Button key="cancel" type="ghost" onClick={() => history.goBack()}>取消</Button>
            </Space>
        ]}>
            <DetailTitle title="补件条目" key={1} />
            <Descriptions bordered size="small" style={{ width: '30%' }}>
                <Descriptions.Item label="补件条目" span={4}>
                    <Button type='text' onClick={() => setVisible(true)}>请选择</Button>
                </Descriptions.Item>
            </Descriptions>
            <DetailTitle title="塔型工程信息" key={2} />
            <BaseInfo layout="vertical" columns={baseColums} dataSource={selectData?.supplyBatchEntryVO || {}} col={6} />
            <DetailTitle title="下达信息" key={3} />
            <Form form={form} labelCol={{ span: 4 }}>
                <Row >
                    <Col span={12}>
                        <Form.Item name="machiningDemand" label="加工要求" initialValue={selectData?.supplyBatchEntryVO?.machiningDemand}>
                            <Input.TextArea placeholder="请输入" maxLength={800} showCount rows={1} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="weldingDemand" label="电焊说明" initialValue={selectData?.supplyBatchEntryVO?.weldingDemand}>
                            <Input.TextArea placeholder="请输入" maxLength={800} showCount rows={1} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name="galvanizeDemand" label="镀锌要求" initialValue={selectData?.supplyBatchEntryVO?.galvanizeDemand}>
                            <Input.TextArea placeholder="请输入" maxLength={800} showCount rows={1} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="packDemand" label="包装说明" initialValue={selectData?.supplyBatchEntryVO?.packDemand}>
                            <Input.TextArea placeholder="请输入" maxLength={800} showCount rows={1} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name="isPerforate" label="是否钻孔特殊要求" initialValue={selectData?.supplyBatchEntryVO?.isPerforate}>
                            <Radio.Group  style={{ paddingLeft:"12px", width: "100%" }} defaultValue={0}>
                                <Radio  value={1}>是</Radio>
                                <Radio  value={0}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <DetailTitle title="补件信息" key={4} />
            <CommonTable haveIndex columns={tableColumns} dataSource={selectData?.productStructureVOS} pagination={false} />
        </DetailContent>
    </>
}
