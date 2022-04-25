/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-塔型信息-放样-批量修改零件材质缩写
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin, Form, Select, Input, message } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './TowerLoftingAssign.module.less';
import CommonTable from "../../common/CommonTable";

interface modalProps {
    id: string;
}

export default forwardRef(function StructureTextureAbbreviations({ id }: modalProps, ref) {
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const list = [
        {
            index: 0,
            structureTexture: 'Q235B',
            suffix: ''
        },
        {
            index: 1,
            structureTexture: 'Q345B',
            suffix: 'H'
        },
        {
            index: 2,
            structureTexture: 'Q420B',
            suffix: 'P'
        },
        {
            index: 3,
            structureTexture: 'Q460B',
            suffix: ''
        },
        {
            index: 4,
            structureTexture: 'Q355B',
            suffix: 'H'
        },
        {
            index: 5,
            structureTexture: 'Q235C',
            suffix: 'FC'
        },
        {
            index: 6,
            structureTexture: 'Q345C',
            suffix: 'HC'
        },
        {
            index: 7,
            structureTexture: 'Q420C',
            suffix: 'PC'
        },
        {
            index: 8,
            structureTexture: 'Q460C',
            suffix: 'TC'
        },
        {
            index: 9,
            structureTexture: 'Q355C',
            suffix: 'HC'
        },
        {
            index: 10,
            structureTexture: 'Q235D',
            suffix: 'FD'
        },
        {
            index: 11,
            structureTexture: 'Q345D',
            suffix: 'HD'
        },
        {
            index: 12,
            structureTexture: 'Q420D',
            suffix: 'PD'
        },
        {
            index: 13,
            structureTexture: 'Q460D',
            suffix: 'TD'
        },
        {
            index: 14,
            structureTexture: 'Q355D',
            suffix: 'HD'
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
            const result = await RequestUtil.put(`/tower-science/productStructure/structureCode`, postData);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            if(selectedRows.length > 0) {
                let values = form.getFieldsValue(true);
                let newSelected = selectedRows.map((res) => {
                    return {
                        structureTexture: res.structureTexture,
                        updateTexture: '-' + values?.data?.filter((item: { structureTexture: any; }) => item.structureTexture === res.structureTexture)[0].suffix
                    }
                })
                await saveRun({
                    textureUpdateList: newSelected,
                    segmentGroupId: id,
                    segmentIdList: values.segmentNameList
                })
                resolve(true);
            } else {
                message.warning("请勾选需要修改的数据")
            }
            
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields();
    }

    const onSelectChange = (selectedRowKeys: string[], selectRows: any[]) => {
        setSelectedRowKeys(selectedRowKeys);
        console.log(selectRows)
        setSelectedRows(selectRows);
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent key='StructureTextureAbbreviations'>
            <Form form={form} className={styles.descripForm}>
                <Form.Item name="segmentIdList" label="范围选择" style={{ paddingBottom: '16px' }}>
                    <Select mode="multiple" allowClear style={{ width: '120px' }} placeholder="不选默认全部">
                        {data?.map((item: any) => {
                            return <Select.Option key={item.id} value={item.segmentName}>{item.segmentName}</Select.Option>
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
                            title: '材质',
                            dataIndex: 'structureTexture',
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <span>材质{_}的部件号后加</span>
                            )
                        },
                        {
                            key: 'suffix',
                            title: '前后缀',
                            dataIndex: 'suffix',
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['data', index, 'suffix']} rules={
                                    [{
                                        pattern: new RegExp(/[a-zA-Z]$/),
                                        message: '请输入字母/-'
                                    }]}
                                >
                                    <Input placeholder="请输入" prefix={<span>-</span>} maxLength={50} size="small" />
                                </Form.Item>
                            )
                        },
                    ]} />
            </Form>
        </DetailContent>
    </Spin>
})

