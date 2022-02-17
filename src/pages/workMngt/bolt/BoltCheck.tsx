/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-螺栓列表-校核
 */

import React, { useState } from 'react';
import { Space, Button, Spin, } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import styles from './BoltList.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import BoltQuestionnaireModal, { IRecord } from './BoltQuestionnaireModal';

interface ITab {
    readonly basicHeight?: string;
    readonly id?: string;
    readonly productCategoryId?: string;
}

export default function BoltCheck(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 100,
            editable: false,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => {
                return <span>{index + 1}</span>
            }
        },
        {
            key: 'typeName',
            title: '类型',
            width: 150,
            dataIndex: 'typeName',
            editable: true,
        },
        {
            key: 'name',
            title: '名称',
            width: 150,
            dataIndex: 'name',
            editable: true
        },
        {
            key: 'level',
            title: '等级',
            width: 150,
            dataIndex: 'level',
            editable: true
        },
        {
            key: 'specs',
            title: '规格',
            width: 150,
            dataIndex: 'specs',
            editable: true
        },
        {
            key: 'unbuckleLength',
            title: '无扣长（mm）',
            dataIndex: 'unbuckleLength',
            width: 120,
            editable: true
        },
        {
            key: 'subtotal',
            title: '小计',
            width: 120,
            dataIndex: 'subtotal',
            editable: true
        },
        {
            key: 'wealth',
            title: '小计',
            width: 120,
            dataIndex: 'wealth',
            editable: true
        },
        {
            key: 'total',
            title: '合计',
            width: 120,
            dataIndex: 'total',
            editable: true
        },
        {
            key: 'singleWeight',
            title: '单重（kg）',
            dataIndex: 'singleWeight',
            width: 120,
            editable: true
        },
        {
            key: 'totalWeight',
            title: '合计重（kg）',
            width: 120,
            dataIndex: 'totalWeight',
            editable: false
        },
        {
            key: 'description',
            title: '备注',
            width: 120,
            dataIndex: 'description',
            editable: false
        }
    ]
    const questionnaire = async (_: undefined, record: Record<string, any>, col: Record<string, any>, tip: string) => {
        setVisible(true);
        if (tip !== 'normal') {
            const data: IRecord = await RequestUtil.get<{}>(`/tower-science/boltRecord/issueDetail`, { keyId: record.id, problemField: col.dataIndex });
            if (tip === 'red') {
                setRecord({ dataSource: [{ ...record, type: record.typeName}], problemFieldName: col.title, currentValue: _, problemField: col.dataIndex, rowId: record.id, ...data });
                setTitle('查看问题单');
            } else {
                setRecord({ issueRecordList: data.issueRecordList, problemFieldName: col.title, currentValue: _, problemField: col.dataIndex, rowId: record.id });
                setTitle('提交问题单');
            }
        } else {
            setRecord({ problemFieldName: col.title, currentValue: _, problemField: col.dataIndex, rowId: record.id });
            setTitle('提交问题单');
        }
    }

    const checkColor = (record: Record<string, any>, dataIndex: string) => {
        const red: number = record.redColumn.indexOf(dataIndex);
        const green: number = record.greenColumn.indexOf(dataIndex);
        const yellow: number = record.yellowColumn.indexOf(dataIndex);
        if (red !== -1) {
            return 'red';
        } else if (green !== -1) {
            return 'green';
        } else if (yellow !== -1) {
            return 'yellow';
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
                        : <p onDoubleClick={(e) => { questionnaire(_, record, col, checkColor(record, col.dataIndex)) }} className={checkColor(record, col.dataIndex) === 'red' ? styles.red : checkColor(record, col.dataIndex) === 'green' ? styles.green : checkColor(record, col.dataIndex) === 'yellow' ? styles.yellow : ''}>{_ === -1 ? "-" : _}</p>
            )
        }
    })

    const history = useHistory();
    const params = useParams<{ id: string, boltId: string }>();
    const [dataSource, setDataSource] = useState<[]>([]);
    const [record, setRecord] = useState({});
    const [title, setTitle] = useState('提交问题');
    const [visible, setVisible] = useState(false);


    const getDataSource = async (basicHeightId?: string) => {
        const data: [] = await RequestUtil.get(`/tower-science/boltRecord/checkList`, {
            basicHeightId: basicHeightId,
            productCategoryId: params.boltId
        })
        setDataSource(data);
    }

    const { loading } = useRequest(() => new Promise(async (resole, reject) => {
        getDataSource(params.id)
        resole(true)
    }), {})

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }


    return <div className={ styles.boltModal }>
        <DetailContent>
            <Space direction="horizontal" size="small" className={styles.topbtn}>
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </Space>
            <CommonTable columns={columnsSetting} dataSource={dataSource} pagination={false} />
        </DetailContent>
        <BoltQuestionnaireModal title={title} visible={visible} modalCancel={() => setVisible(false)} record={record} update={() => getDataSource(params.id)} productCategory={params.boltId} />
    </div>
}