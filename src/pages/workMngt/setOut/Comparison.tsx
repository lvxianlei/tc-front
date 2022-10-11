/**
 * @author zyc
 * @copyright © 2022
 * @description 工作管理-放样列表-工作目录-放样提料比对
*/

import React, { useState } from 'react';
import { Space, DatePicker, Select, Button, Popconfirm, message, Form, Modal, Input, InputNumber } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { ColumnType } from 'antd/lib/table';

interface Column extends ColumnType<object> {
    editable?: boolean;
}

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
            key: 'patternName',
            title: '件号',
            width: 80,
            dataIndex: 'patternName',
            editable: false
        },
        {
            key: 'completeTime',
            title: '提料材料',
            width: 120,
            dataIndex: 'completeTime'
        },
        {
            key: 'statusName',
            title: '放样材料',
            width: 80,
            dataIndex: 'statusName'
        },
        {
            key: 'codeCount',
            title: '提料材质',
            width: 80,
            dataIndex: 'codeCount'
        },
        {
            key: 'totalNum',
            title: '放样材质',
            width: 80,
            dataIndex: 'totalNum'
        },
        {
            key: 'totalWeight',
            title: '提料规格',
            width: 80,
            dataIndex: 'totalWeight'
        },
        {
            key: 'price',
            title: '放样规格',
            width: 80,
            dataIndex: 'price'
        },
        {
            key: 'updateStatusTime',
            title: '提料长度',
            width: 150,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '放样长度',
            width: 150,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '提料宽度',
            width: 150,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '放样宽度',
            width: 150,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '提料单数',
            width: 150,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '放样单数',
            width: 150,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '提料单重',
            width: 150,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '放样单重',
            width: 150,
            dataIndex: 'updateStatusTime'
        }
    ]

    
    const checkColor = (record: Record<string, any>, dataIndex: string) => {
        const red: number = record.redColumn.indexOf(dataIndex);
        const green: number = record.greenColumn.indexOf(dataIndex);
        const yellow: number = record.yellowColumn.indexOf(dataIndex);
        const brown: string = record.specialCode;
        if (red !== -1) {
            return 'red';
        } else if (green !== -1) {
            return 'green';
        } else if (yellow !== -1) {
            return 'yellow';
        } else if (brown === '1' && dataIndex === 'specialCode') {
            return 'brown';
        } else {
            return 'normal'
        }
    }

    const columnsSetting = columns.map(col => {
        return {
            ...col,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                col.dataIndex === 'index' ? index + 1
                    : !col.editable ? _
                        :
                        <p className={checkColor(record, col.dataIndex) === 'red' ? styles.red : checkColor(record, col.dataIndex) === 'green' ? styles.green : checkColor(record, col.dataIndex) === 'yellow' ? styles.yellow : checkColor(record, col.dataIndex) === 'brown' ? styles.brown : styles.normal}>{_ || '-'}</p>
            )
        }
    })

    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [refresh, setRefresh] = useState(false);
    const [filterValue, setFilterValue] = useState({});

    return <>
            <Page
                path={`/tower-science/productSegment`}
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
            console.log(value)
            setFilterValue(value)
            setRefresh(!refresh);
        }}>
        <Form.Item label='长度误差mm' name='updateStatusTime' rules={[
                {
                    "required": true,
                    "message": "请输入长度误差"
                }
            ]}>
            <InputNumber min={0} max={9999}/>
        </Form.Item>
        <Form.Item label='宽度误差mm' name='updateStatusTime' rules={[
                {
                    "required": true,
                    "message": "请输入宽度误差"
                }
            ]}>
            <Input/>
        </Form.Item>
        <Form.Item label='单重误差kg' name='updateStatusTime' rules={[
                {
                    "required": true,
                    "message": "请输入单重误差"
                }
            ]}>
            <Input/>
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