/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-组焊列表-组焊清单
*/

import React from 'react'
import { Button, message, Popconfirm, Space, Spin, TablePaginationConfig } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { useState } from 'react';
import styles from './AssemblyWelding.module.less';
import { downloadTemplate } from '../setOut/downloadTemplate';
import AssemblyWeldingNew from './AssemblyWeldingNew';

interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: [];
}

export default function AssemblyWeldingListing(): React.ReactNode {
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
            key:'operation', 
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => RequestUtil.get(`/tower-science/welding/deleteWelding`, { segmentId: record.id }).then(res => {
                            message.success('删除成功');
                            history.go(0);
                        }) }
                        okText="删除"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                    
                    <AssemblyWeldingNew id={ params.id } segmentId={ record.id } productCategoryId={ params.productCategoryId } record={ record } name="编辑" />
                </Space>
            )
        }
    ]

    const paragraphColumns = [
        { 
            title: '序号', 
            dataIndex: 'index', 
            key: 'index', 
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{ index + 1 }</span>) 
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
            title: '电焊长度（mm）',
            dataIndex: 'weldingLength', 
            key: 'weldingLength' 
        }
    ]

    const history = useHistory();
    const page = {
        current: 1,
        pageSize: 10
    };
    const [ detailData, setDetailData ] = useState<IResponseData | undefined>(undefined);
    const params = useParams<{ id: string, productCategoryId: string }>();
    const [ paragraphData, setParagraphData ] = useState([] as undefined | any);

    const getTableDataSource = (pagination: TablePaginationConfig) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<IResponseData>(`/tower-science/welding/getDetailedById`, { weldingGroupId: params.id, ...pagination });
        setDetailData(data);
        resole(data);
    });
    const { loading, data } = useRequest<IResponseData>(() => getTableDataSource(page), {});

    return <>
        <Spin spinning={ loading }>
            <DetailContent>
                <Space direction="horizontal" size="small" className={ styles.bottomBtn }>
                    {/* <Button type="primary" ghost>导出</Button> */}
                    <Button type="primary" onClick={ () => downloadTemplate('/tower-science/welding/exportTemplate', '模板') } ghost>模板下载</Button>
                    <Button type="primary"  onClick={ () => RequestUtil.post<IResponseData>(`/tower-science/welding/submitWelding`, { weldingGroupId: params.id }).then(res => {
                        history.goBack();
                    }) } >完成组焊清单</Button>
                    <AssemblyWeldingNew id={ params.id } productCategoryId={ params.productCategoryId }  name="添加组焊" />
                    <Button type="primary" ghost>导入</Button>
                    <Button type="primary" onClick={ () => history.goBack() } ghost>返回上一级</Button>
                </Space>
                <CommonTable 
                    dataSource={ detailData?.records } 
                    columns={ towerColumns }
                    onRow={ (record: Record<string, any>, index: number) => ({
                        onClick: async () => { 
                            const resData: [] = await RequestUtil.get(`/tower-science/welding/getStructureById`, { segmentId: record.id });
                            setParagraphData([...resData]);
                        },
                        className: styles.tableRow
                    })
                }
                    onChange={ (pagination: TablePaginationConfig) => { 
                        getTableDataSource(pagination);
                    } }
                    pagination={{
                        current: detailData?.current || 0,
                        pageSize: detailData?.size || 0,
                        total: detailData?.total || 0,
                        showSizeChanger: false
                    }}
                />
                <CommonTable dataSource={ paragraphData } columns={ paragraphColumns } pagination={ false }/>
            </DetailContent>
        </Spin>
    </>
}