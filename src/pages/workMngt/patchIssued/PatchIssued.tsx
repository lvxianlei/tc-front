/**
 * @author zyc
 * @copyright © 2022 
 * @description 放样过程管理-补件下达列表-补件下达
 */

import React, { useRef, useState } from 'react';
import { Spin, Button, Space, Form, Input, Descriptions, Row, Col, Modal, message, Select } from 'antd';
import { useHistory } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { BaseInfo, CommonTable, DetailContent, DetailTitle, Page } from '../../common';
import { baseColums, tableColumns } from "./patchIssued.json"
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import { patchEntryColumns} from "./patchIssued.json"
import { FixedType } from 'rc-table/lib/interface';

interface IPatchIssued {

}

export interface modalProps {
    onSubmit: () => void;
    resetFields: () => void
}

export default function PatchIssued(): React.ReactNode {
    const [form] = Form.useForm();
    const [detailData, setDetailData] = useState<IPatchIssued>({});
    const [visible, setVisible] =useState<boolean>(false);
    const editRef = useRef<modalProps>();

    const history = useHistory();
    const { loading } = useRequest<IPatchIssued>(() => new Promise(async (resole, reject) => {
            // let data = await RequestUtil.get<IPatchIssued>(``);
            resole([])
    }), {})

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const save = () => {
        if (form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true);
                    RequestUtil.post<any>(``, {
                        ...value,
                    }).then(res => {
                        history.goBack();
                    });
            })
        }
    }

    const onSubmit = (record: Record<string, any>) => new Promise(async (resolve, reject) => {
        try {
            console.log(record)
            resolve(record);
        } catch (error) {
            reject(false)
        }
    })


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
     path="/tower-science/loftingList"
     columns={[
        ...patchEntryColumns, {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right' as FixedType,
        width: 50,
        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
            <Button type='link' onClick={() => onSubmit(record)}>选择</Button>
        )
    }]}
     headTabs={[]}
     searchFormItems={[
        {
            name: 'updateStatusTime',
            label: '补件类型',
            children: <Select placeholder="请选择补件类型">
            {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                return <Select.Option key={index} value={id}>
                    {name}
                </Select.Option>
            })}
        </Select>
        },
        {
            name: 'updateStatusTime',
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
            name: 'status',
            label: '下达状态',
            children: <Form.Item name="status">
                <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="" key="6">全部</Select.Option>
                    <Select.Option value={1} key="1">待指派</Select.Option>
                    <Select.Option value={2} key="2">放样中</Select.Option>
                    <Select.Option value={3} key="3">组焊中</Select.Option>
                    <Select.Option value={4} key="4">配段中</Select.Option>
                    <Select.Option value={5} key="5">已完成</Select.Option>
                </Select>
            </Form.Item>
        },
         {
             name: 'fuzzyMsg',
             label: '模糊查询项',
             children: <Input style={{ width: '120px' }} placeholder="补件编号/计划号/工程名称/塔型名称/说明" />
         }
     ]}
     tableProps={{
        pagination: false
     }}
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
            <Descriptions bordered size="small" style={{width: '30%'}}>
                <Descriptions.Item label="补件条目" span={4}>
                    <Button type='text' onClick={() => setVisible(true) }>请选择</Button>
                </Descriptions.Item>
            </Descriptions>
            <DetailTitle title="塔型工程信息" key={2} />
            <BaseInfo layout="vertical" columns={baseColums} dataSource={detailData} col={7} />
            <DetailTitle title="下达信息" key={3} />
            <Form form={ form } labelCol={{span:4}}>
                            <Row >
                                <Col span={12}>
                                    <Form.Item name="machiningDemand" label="加工要求">
                                        <Input.TextArea placeholder="请输入" maxLength={ 800 } showCount rows={1}/>
                                    </Form.Item>
                                </Col>
                            
                                <Col span={12}>
                                    <Form.Item name="weldingDemand" label="电焊说明">
                                        <Input.TextArea placeholder="请输入" maxLength={ 800 } showCount rows={1}/>
                                    </Form.Item>
                                </Col>
                            
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name="galvanizeDemand" label="镀锌要求">
                                        <Input.TextArea placeholder="请输入" maxLength={ 800 } showCount rows={1}/>
                                    </Form.Item>
                                </Col>
                            
                                <Col span={12}>
                                    <Form.Item name="packDemand" label="包装说明">
                                        <Input.TextArea placeholder="请输入" maxLength={ 800 } showCount rows={1}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            </Form>
            <DetailTitle title="补件信息" key={4} />
            <CommonTable haveIndex columns={tableColumns} dataSource={[]} pagination={false} />
        </DetailContent>
    </>
}