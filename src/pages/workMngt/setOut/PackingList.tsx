/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔配段-包装清单
*/

import React, { useState } from 'react';
import { Space, Button, Popconfirm, Spin } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useHistory, useParams } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

export default function PackingList(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'balesCode',
            title: '捆号',
            width: 150,
            dataIndex: 'balesCode'
        },
        {
            key: 'structureCodes',
            title: '捆件数',
            dataIndex: 'structureCodes',
            width: 120
        },
        {
            key: 'structureCodes',
            title: '包重量（吨）',
            dataIndex: 'structureCodes',
            width: 120
        },
        {
            key: 'description',
            title: '创建人',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '创建时间',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Link to={ `/workMngt/setOutList/poleInformation/${ params.id }/packingList/${ params.productId }/packingListSetting/${ record.id }` }><Button type="link">编辑</Button></Link>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => { RequestUtil.delete(`/tower-science/packageStructure?id=${ record.id }`).then(res => history.go(0)) } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const bundleColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'balesCode',
            title: '件号',
            width: 150,
            dataIndex: 'balesCode'
        },
        {
            key: 'structureCodes',
            title: '材料规格',
            dataIndex: 'structureCodes',
            width: 120
        },
        {
            key: 'structureCodes',
            title: '长度',
            dataIndex: 'structureCodes',
            width: 120
        },
        {
            key: 'description',
            title: '数量',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        }
    ]

    const history = useHistory();
    const params = useParams<{ id: string, productId: string }>();
    const [ bundleData, setBundleData ] = useState([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/packageStructure/list`, { productId: params.productId })
        resole(data)
    }), {})
    const detailData: any = data;

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const getBundleData = async (id: string) => {
        const resData: [] = await RequestUtil.get(`/tower-science/welding/getStructureById`, { segmentId: id });
        setBundleData([...resData]);
    }
    
    return <>
        <Space direction="horizontal" size="small" className={ styles.topcontent }><span>塔型：{ detailData.productCategoryName }</span> <span>杆号：{ detailData.productNumber }</span><span>
            捆数: { detailData.packageStructureCount }</span></Space>
        <Space direction="horizontal" size="small" className={ `${ styles.padding16 } ${ styles.btnRight }` }>
            <Button type="primary" ghost>导出</Button>
            <Link to={{ pathname: `/workMngt/setOutList/poleInformation/${ params.id }/packingList/${ params.productId }/packingListNew`, state: { productCategoryName: detailData.productCategoryName, productNumber: detailData.productNumber } }}><Button type="primary" ghost>添加</Button></Link>
            <Popconfirm
                title="确认完成?"
                onConfirm={ () => RequestUtil.post(`/tower-science/packageStructure/submit?productId=${ params.productId }`).then(res => history.goBack()) }
                okText="确认"
                cancelText="取消"
            >
                <Button type="primary">完成</Button>
            </Popconfirm>
            <Button type="primary" onClick={ () => history.goBack() } ghost>返回上一级</Button>
        </Space>
        <DetailContent>
            <CommonTable columns={ columns } style={{ marginBottom: '50px' }} dataSource={ detailData.packageStructureVOList } pagination={ false } onRow={ (record: Record<string, any>, index: number) => ({
                onClick: async () => { getBundleData(record.id); }
            })}/>
            <CommonTable dataSource={ [...bundleData] } columns={ bundleColumns } pagination={ false }/>
        </DetailContent>
    </>
}