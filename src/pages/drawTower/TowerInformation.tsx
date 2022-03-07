import React from 'react';
import { Spin, Button, Space } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './DrawTower.module.less';


export default function TowerInformation(): React.ReactNode {
    const baseColumns= [
        {
            "dataIndex": "name",
            "title": "塔型"
        },
        {
            "dataIndex": "steelProductShape",
            "title": "塔型钢印号"
        },
        {
            "dataIndex": "pattern",
            "title": "类型",
            render: (pattern: number): React.ReactNode => {
                switch (pattern) {
                    case 1:
                        return '新放';
                    case 2:
                        return '重新出卡';
                    case 3:
                        return '套用';
                }
            } 
        },
        {
            "dataIndex": "taskCode",
            "title": "任务单编号"
        },
        {
            "dataIndex": "saleOrderNumber",
            "title": "订单编号"
        },
        {
            "dataIndex": "internalNumber",
            "title": "内部合同编号"
        },
        {
            "dataIndex": "structureCount",
            "title": "件号数"
        },
        {
            "dataIndex": "steelAngleCount",
            "title": "角钢件号数"
        },
        {
            "dataIndex": "steelPlateCount",
            "title": "钢板件号数"
        },
        {
            "dataIndex": "updateUserName",
            "title": "最后更新人"
        },
        {
            "dataIndex": "updateTime",
            "title": "最后更新时间",
            "type": "date"
        },
        {
            "dataIndex": "description",
            "title": "备注",
            "type": "textarea"
        }
    ]

    const tableColumns = [
        { 
            key: 'index', 
            title: '序号', 
            dataIndex: 'index', 
            width: 50, 
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>) },
        {
            key: 'name',
            title: '段号',
            dataIndex: 'name', 
        },
        {  
            key: 'singleNumberCount', 
            title: '单段件号数', 
            dataIndex: 'singleNumberCount',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? undefined : _ }</span>
            ) 
        },
        { 
            key: 'singleCount', 
            title: '单段件数', 
            dataIndex: 'singleCount',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? undefined : _ }</span>
            )
        },
        { 
            key: 'singleWeight', 
            title: '单段重量（kg）', 
            dataIndex: 'singleWeight',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? undefined : _ }</span>
            )  
        },
        { 
            key: 'description', 
            title: '备注', 
            dataIndex: 'description' 
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Link to={ `/drawTower/drawTowerMngt/towerInformation/${ params.id }/componentDetail/${ record.id }/${ record.singleNumberCount + ',' + record.singleCount + ',' + record.singleWeight }` }>构件详情</Link>
                </Space>
            )
        }
    ]

    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/productCategory/draw/${ params.id }`)
        resole(data)
    }), {})
    const detailData: any = data;

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <DetailContent operation={ [
        <Space direction="horizontal" size="small" >
            <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
        </Space>
    ] }>
        <DetailTitle title="塔型信息" />
        <BaseInfo columns={ baseColumns } dataSource={ detailData } col={ 2 } />
        <DetailTitle title="段落信息"/>
        <CommonTable columns={ tableColumns } dataSource={ detailData.drawProductSegmentMergeList } pagination={ false }/>
    </DetailContent>
}