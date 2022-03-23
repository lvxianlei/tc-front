/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-组焊列表-校核
*/

import React from 'react'
import { Button, Space, Spin, TablePaginationConfig } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { useState } from 'react';
import styles from './AssemblyWelding.module.less';
import { FixedType } from 'rc-table/lib/interface';
import { IResponseData } from './IAssemblyWelding';

export default function AssemblyWeldingCheck(): React.ReactNode {
    const towerColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            title: '段号',
            dataIndex: 'segmentName',
            key: 'segmentName'
        },
        {
            title: '组件号',
            dataIndex: 'componentId',
            key: 'componentId'
        },
        {
            title: '主件号',
            dataIndex: 'mainPartId',
            key: 'mainPartId'
        },
        {
            title: '单组重量（kg）',
            dataIndex: 'singleGroupWeight',
            key: 'singleGroupWeight'
        },
        {
            title: '电焊米数（mm）',
            dataIndex: 'electricWeldingMeters',
            key: 'electricWeldingMeters'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type="link" onClick={() => {
                        if (record.verificationStatus === 1) {
                            history.push(`/workMngt/assemblyWeldingList/assemblyWeldingCheck/${params.id}/${params.productCategoryId}/questionnairedetail/${record.id}`)
                        } else {
                            history.push(`/workMngt/assemblyWeldingList/assemblyWeldingCheck/${params.id}/${params.productCategoryId}/questionnaire/${record.id}`)
                        }
                    }}>{record.verificationStatus === 1 ? '查看问题单' : '提交问题单'}</Button>
                </Space>
            )
        }
    ]

    const paragraphColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            title: '零件号',
            dataIndex: 'code',
            key: 'code'
        },
        {
            title: '材料',
            dataIndex: 'materialName',
            key: 'materialName'
        },
        {
            title: '材质',
            dataIndex: 'structureTexture',
            key: 'structureTexture'
        },
        {
            title: '规格',
            dataIndex: 'structureSpec',
            key: 'structureSpec'
        },
        {
            title: '长',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: '宽',
            dataIndex: 'width',
            key: 'width'
        },
        {
            title: '单组件数',
            dataIndex: 'singleNum',
            key: 'singleNum'
        },
        {
            title: '备注',
            dataIndex: 'description',
            key: 'description'
        }
    ]

    const history = useHistory();
    const page = {
        current: 1,
        pageSize: 10
    };
    const [detailData, setDetailData] = useState<IResponseData | undefined>(undefined);
    const params = useParams<{ id: string, productCategoryId: string }>();
    const [paragraphData, setParagraphData] = useState([] as undefined | any);

    const getTableDataSource = (pagination: TablePaginationConfig) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<IResponseData>(`/tower-science/welding/getVerificationById`, { weldingId: params.id, ...pagination });
        setDetailData(data);
        if (data?.records && data?.records[0]) {
            getParagraphData(data?.records && data?.records[0].id || '')
        }
        resole(data);
    });

    const getParagraphData = async (id: string) => {
        const resData: [] = await RequestUtil.get(`/tower-science/welding/getStructureById`, { segmentId: id });
        setParagraphData([...resData]);
    }

    const { loading, data } = useRequest<IResponseData>(() => getTableDataSource(page), {});

    return <>
        <Spin spinning={loading}>
            <DetailContent className={styles.check}>
                <Space direction="horizontal" size="small" className={styles.bottomBtn}>
                    <Button type="primary" onClick={() => RequestUtil.post<IResponseData>(`/tower-science/welding/completeWelding`, { weldingId: params.id }).then(res => {
                        history.goBack();
                    })} >完成校核</Button>
                    <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                </Space>
                <CommonTable
                    dataSource={detailData?.records}
                    columns={towerColumns}
                    onRow={(record: Record<string, any>, index: number) => ({
                        onClick: async () => { getParagraphData(record.id); },
                        className: [record.verificationStatus === 1 ? styles.red : record.verificationStatus === 2 ? styles.green : record.verificationStatus === 0 ? styles.yellow : null, styles.tableRow]
                    })
                    }
                    onChange={(pagination: TablePaginationConfig) => {
                        getTableDataSource(pagination);
                    }}
                    pagination={{
                        current: detailData?.current || 0,
                        pageSize: detailData?.size || 0,
                        total: detailData?.total || 0,
                        showSizeChanger: false
                    }}
                />
                <CommonTable dataSource={paragraphData} columns={paragraphColumns} pagination={false} />
            </DetailContent>
        </Spin>
    </>
}