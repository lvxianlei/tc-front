/**
 * @author zyc
 * @copyright © 2022
 * @description 工作管理-放样列表-工作目录-放样提料比对
*/

import React, { useState } from 'react';
import { Space, Button, Form, Input, InputNumber } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

export default function Comparison(): React.ReactNode {

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
                <p className={record?.drawMaterialError === 1 ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        },
        {
            key: 'materialName',
            title: '放样材料',
            width: 80,
            dataIndex: 'materialName'
        },
        {
            key: 'materialStructureTexture',
            title: '提料材质',
            width: 80,
            dataIndex: 'materialStructureTexture'
        },
        {
            key: 'structureTexture',
            title: '放样材质',
            width: 80,
            dataIndex: 'structureTexture'
        },
        {
            key: 'materialStructureSpec',
            title: '提料规格',
            width: 80,
            dataIndex: 'materialStructureSpec'
        },
        {
            key: 'structureSpec',
            title: '放样规格',
            width: 80,
            dataIndex: 'structureSpec'
        },
        {
            key: 'materialLength',
            title: '提料长度',
            width: 150,
            dataIndex: 'materialLength'
        },
        {
            key: 'length',
            title: '放样长度',
            width: 150,
            dataIndex: 'length'
        },
        {
            key: 'materialWidth',
            title: '提料宽度',
            width: 150,
            dataIndex: 'materialWidth'
        },
        {
            key: 'width',
            title: '放样宽度',
            width: 150,
            dataIndex: 'width'
        },
        {
            key: 'materialBasicsPartNum',
            title: '提料单数',
            width: 150,
            dataIndex: 'materialBasicsPartNum'
        },
        {
            key: 'basicsPartNum',
            title: '放样单数',
            width: 150,
            dataIndex: 'basicsPartNum'
        },
        {
            key: 'materialBasicsWeight',
            title: '提料单重',
            width: 150,
            dataIndex: 'materialBasicsWeight'
        },
        {
            key: 'basicsWeight',
            title: '放样单重',
            width: 150,
            dataIndex: 'basicsWeight'
        }
    ]

    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [refresh, setRefresh] = useState(false);
    const [filterValue, setFilterValue] = useState({});

    return <>
        <Page
            path={`/tower-science/productStructure/contrast/structure`}
            columns={columns}
            headTabs={[]}
            refresh={refresh}
            requestData={{ productCategoryId: params.id }}
            filterValue={filterValue}
            extraOperation={<>
                <span>塔型：<span>{detail?.productCategoryName}</span></span>
                <span>计划号：<span>{detail?.planNumber}</span></span>
                <Space direction="horizontal" size="small" style={{ position: 'absolute', right: 0, top: 0 }}>
                    <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                </Space>
                <Form layout="inline" onFinish={(value: Record<string, any>) => {
                    setFilterValue(value)
                    setRefresh(!refresh);
                }}>
                    <Form.Item label='长度误差mm' name='length' initialValue={0} rules={[
                        {
                            "required": true,
                            "message": "请输入长度误差"
                        }
                    ]}>
                        <InputNumber min={0} max={9999} />
                    </Form.Item>
                    <Form.Item label='宽度误差mm' name='width' initialValue={0} rules={[
                        {
                            "required": true,
                            "message": "请输入宽度误差"
                        }
                    ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='单重误差kg' name='basicsWeight' initialValue={0} rules={[
                        {
                            "required": true,
                            "message": "请输入单重误差"
                        }
                    ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </Form.Item>
                </Form>
            </>}
            searchFormItems={[]}
            tableProps={{
                pagination: {
                    pageSize: 100
                }
            }}
        />
    </>
}