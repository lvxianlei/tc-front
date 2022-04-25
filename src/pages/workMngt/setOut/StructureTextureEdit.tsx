/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-塔型信息-放样-批量修改材质
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin, Form, Select, Input, Descriptions } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './TowerLoftingAssign.module.less';
import CommonTable from "../../common/CommonTable";
import { materialTextureOptions } from "../../../configuration/DictionaryOptions";

interface modalProps {
    id: string;
}

export default forwardRef(function StructureTextureEdit({ id }: modalProps, ref) {
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const list = [
        {
            index: 0,
            structureTexture: 'Q235',
            suffix: 'B'
        },
        {
            index: 1,
            structureTexture: 'Q345',
            suffix: 'B'
        },
        {
            index: 2,
            structureTexture: 'Q420',
            suffix: 'B'
        },
        {
            index: 3,
            structureTexture: 'Q460',
            suffix: 'B'
        },
        {
            index: 4,
            structureTexture: 'Q355',
            suffix: 'B'
        }
    ]

    const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => {
        try {
            const data: [] = await RequestUtil.get<[]>(`/tower-science/productSegment/segmentList`, {
                productSegmentGroupId: id
            });
            form.setFieldsValue({ data: [...list] })
            resole(data)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })


    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.put(`/tower-science/productStructure/structureTexture`, postData);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            let values = form.getFieldsValue(true);
            let newSelected = selectedRows.map((res) => {
                return {
                    structureTexture: res.structureTexture,
                    updateTexture: values?.data?.filter((item: { structureTexture: any; }) => item.structureTexture === res.structureTexture)[0].suffix
                }
            })
            await saveRun({
                textureUpdateList: newSelected,
                segmentGroupId: id,
                segmentIdList: values.segmentIdList,
                structureTextureId: values.fuzzyReplaceBefore?.split(',')[0],
                structureTexture: values.fuzzyReplaceBefore?.split(',')[1],
                newStructureTextureId: values.fuzzyReplaceAfter?.split(',')[0],
                newStructureTexture: values.fuzzyReplaceAfter?.split(',')[1],
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields();
    }

    const onSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectRows);
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent>
            <Form form={form} className={styles.descripForm}>
                <Form.Item name="segmentIdList" label="范围选择" style={{ paddingBottom: '16px' }}>
                    <Select mode="multiple" allowClear style={{ width: '120px' }} placeholder="不选默认全部">
                        {data?.map((item: any) => {
                            return <Select.Option key={item.id} value={item.id}>{item.segmentName}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <CommonTable
                    haveIndex
                    pagination={false}
                    dataSource={list}
                    rowKey="index"
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: onSelectChange,
                        type: "checkbox",
                    }}
                    columns={[
                        {
                            key: 'structureTexture',
                            title: '修改项',
                            dataIndex: 'structureTexture',
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <span>材质{_}后加</span>
                            )
                        },
                        {
                            key: 'suffix',
                            title: '修改项',
                            dataIndex: 'suffix',
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['data', index, 'suffix']} rules={
                                    [{
                                        pattern: new RegExp(/[BC]{1}$/),
                                        message: '请输入B/C'
                                    }]}
                                >
                                    <Input placeholder="请输入" maxLength={50} size="small" />
                                </Form.Item>
                            )
                        },
                    ]}
                />
                <Descriptions bordered column={2} className={styles.descripForm}>
                    <Descriptions.Item label="修改前材质">
                        <Form.Item name="fuzzyReplaceBefore">
                            <Select placeholder="请选择" size="small">
                                {materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' +item.name} key={index}>{item.name}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="修改后材质">
                        <Form.Item name="fuzzyReplaceAfter">
                            <Select placeholder="请选择" size="small">
                                {materialTextureOptions?.map((item: any, index: number) => <Select.Option value={item.id + ',' +item.name} key={index}>{item.name}</Select.Option>)}
                            </Select>
                        </Form.Item>
                    </Descriptions.Item>
                </Descriptions>
            </Form>
        </DetailContent>
    </Spin>
})

