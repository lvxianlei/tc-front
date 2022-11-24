/**
 * @author zyc
 * @copyright © 2022
 * @description 工作管理-放样列表-工作目录-放样提料比对
*/

import React, { useState } from 'react';
import { Space, Button, Form, Input, InputNumber, Spin, TablePaginationConfig } from 'antd';
import { CommonTable, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { useForm } from 'antd/es/form/Form';

export default function Comparison(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [form] = useForm();
    const page = {
        current: 1,
        pageSize: 100,
        total: 0
    };

    const { loading, data: param } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            let result = await RequestUtil.get<any>(`/tower-science/productStructure/comparison/param/${params.id}`);
            run({}, {
                length: result?.length || 0,
                width: result?.width || 0,
                basicsWeight: result?.basicsWeight || 0
            })
            form.setFieldsValue({
                length: result?.length || 0,
                width: result?.width || 0,
                basicsWeight: result?.basicsWeight || 0
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { data, run } = useRequest<any>((pagination: TablePaginationConfig, errors: any) => new Promise(async (resole, reject) => {
        try {
            let result = await RequestUtil.get<any>(`/tower-science/productStructure/contrast/structure`, {
                current: pagination?.current || 1,
                pageSize: pagination?.pageSize || 100,
                productCategoryId: params.id,
                length: errors?.length || 0,
                width: errors?.width || 0,
                basicsWeight: errors?.basicsWeight || 0
            });
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })


    const { data: detail } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            let result = await RequestUtil.get<any>(`/tower-science/productCategory/detail/${params.id}`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})

    const columns = [
        {
            key: 'id',
            title: '序号',
            dataIndex: 'id',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'segmentName',
            title: '段号',
            width: 80,
            dataIndex: 'segmentName'
        },
        {
            key: 'code',
            title: '件号',
            width: 80,
            dataIndex: 'code',
            editable: false
        },
        {
            key: 'drawMaterialName',
            title: '提料材料',
            width: 120,
            dataIndex: 'drawMaterialName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.materialError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'materialName',
            title: '放样材料',
            width: 80,
            dataIndex: 'materialName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.materialError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'materialStructureTexture',
            title: '提料材质',
            width: 80,
            dataIndex: 'materialStructureTexture',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.structureTextureError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'structureTexture',
            title: '放样材质',
            width: 80,
            dataIndex: 'structureTexture',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.structureTextureError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'materialStructureSpec',
            title: '提料规格',
            width: 80,
            dataIndex: 'materialStructureSpec',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.specError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'structureSpec',
            title: '放样规格',
            width: 80,
            dataIndex: 'structureSpec',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.specError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'materialLength',
            title: '提料长度',
            width: 150,
            dataIndex: 'materialLength',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.lengthError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'length',
            title: '放样长度',
            width: 150,
            dataIndex: 'length',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.lengthError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'materialWidth',
            title: '提料宽度',
            width: 150,
            dataIndex: 'materialWidth',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.widthError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'width',
            title: '放样宽度',
            width: 150,
            dataIndex: 'width',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.widthError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'materialBasicsPartNum',
            title: '提料单数',
            width: 150,
            dataIndex: 'materialBasicsPartNum',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.numError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'basicsPartNum',
            title: '放样单数',
            width: 150,
            dataIndex: 'basicsPartNum',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.numError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'materialBasicsWeight',
            title: '提料单重',
            width: 150,
            dataIndex: 'materialBasicsWeight',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.weightError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'basicsWeight',
            title: '放样单重',
            width: 150,
            dataIndex: 'basicsWeight',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={record?.weightError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        }
    ]

    return <Spin spinning={loading}>
        <Space style={{marginBottom: '16px'}}>
            <span>塔型：<span>{detail?.productCategoryName}</span></span>
            <span>计划号：<span>{detail?.planNumber}</span></span>
            <Space direction="horizontal" size="small" style={{ position: 'absolute', right: 0, top: 0 }}>
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </Space>
            <Form form={form} layout="inline" onFinish={(value: Record<string, any>) => {
                RequestUtil.post<any>(`/tower-science/productStructure/comparison/param`, {
                    ...value,
                    productCategoryId: params?.id
                }).then(res => {
                    history.go(0)
                })
            }}>
                <Form.Item label='长度误差mm' name='length' initialValue={param?.length || 0} rules={[
                    {
                        "required": true,
                        "message": "请输入长度误差"
                    }
                ]}>
                    <InputNumber min={0} max={9999} />
                </Form.Item>
                <Form.Item label='宽度误差mm' name='width' initialValue={param?.width || 0} rules={[
                    {
                        "required": true,
                        "message": "请输入宽度误差"
                    }
                ]}>
                    <InputNumber min={0} max={9999} />
                </Form.Item>
                <Form.Item label='单重误差kg' name='basicsWeight' initialValue={param?.basicsWeight || 0} rules={[
                    {
                        "required": true,
                        "message": "请输入单重误差"
                    }
                ]}>
                    <InputNumber min={0} max={9999.99} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">保存</Button>
                </Form.Item>
            </Form>
        </Space>
        <CommonTable
            columns={columns}
            dataSource={data}
            onChange={(pagination: TablePaginationConfig) => {
                run(pagination, param);
            }}
            pagination={{
                current: page?.current || 1,
                pageSize: page?.pageSize || 100,
                total: page?.total || 0,
                showSizeChanger: false
            }}
        />
    </Spin>
}