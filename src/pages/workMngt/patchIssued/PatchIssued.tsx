/**
 * @author zyc
 * @copyright © 2022
 * @description 放样过程管理-补件下达列表-补件下达
 */

import React, { useState } from 'react';
import { Spin, Button, Space, Form, Input, Row, Col, Radio } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { BaseInfo, CommonTable, DetailContent, DetailTitle } from '../../common';
import { baseColums, tableColumns } from "./patchIssued.json"

interface IPatchIssued {
    supplyBatchEntryVO: any;
}

export interface modalProps {
    onSubmit: () => void;
    resetFields: () => void
}

export default function PatchIssued(): React.ReactNode {
    const [form] = Form.useForm();
    const params = useParams<{ id: string, supplyNumber: string }>()
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const history = useHistory();

    const { loading, data: selectData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        let data = await RequestUtil.get<IPatchIssued>(`/tower-science/supplyBatch/getBatchDetail?id=${params?.id}`);
        form.setFieldsValue({
            machiningDemand: data?.supplyBatchEntryVO?.machiningDemand,
            weldingDemand: data?.supplyBatchEntryVO?.weldingDemand,
            galvanizeDemand: data?.supplyBatchEntryVO?.galvanizeDemand,
            packDemand: data?.supplyBatchEntryVO?.packDemand,
            isPerforate: data?.supplyBatchEntryVO?.isPerforate,
            supplyNumber: params?.supplyNumber
        })
        resole(data)
    }))

    const save = () => {
        if (form) {
            form.validateFields().then(res => {
                setSaveLoading(true);
                let value = form.getFieldsValue(true);
                RequestUtil.post<any>(`/tower-science/supplyBatch/saveBatchDetail`, {
                    ...value,
                    id: selectData?.supplyBatchEntryVO?.id,
                    supplyNumber: value?.supplyNumber,
                    isPerforate: value?.isPerforate || 0
                }).then(res => {
                    setSaveLoading(false);
                    history.goBack();
                }).catch(e => {
                    console.log(e);
                    setSaveLoading(false);
                });
            })
        }
    }

    return <Spin spinning={loading}>
        <DetailContent operation={[
            <Space direction="horizontal" size="small">
                <Button key="save" type="primary" loading={saveLoading} onClick={save}>保存</Button>
                <Button key="cancel" type="ghost" onClick={() => history.goBack()}>取消</Button>
            </Space>
        ]}>
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
                            <Radio.Group style={{ paddingLeft: "12px", width: "100%" }} defaultValue={0}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <DetailTitle title="补件信息" key={4} />
            <CommonTable haveIndex columns={tableColumns} dataSource={selectData?.productStructureVOS} pagination={false} />
        </DetailContent>
    </Spin>
}
