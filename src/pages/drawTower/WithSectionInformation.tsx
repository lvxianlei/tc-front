/**
 * @author zyc
 * @copyright © 2022 
 * @description 图纸塔型-配段信息
 */

import React from 'react';
import { Spin, Button, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './DrawTower.module.less';
import { FixedType } from 'rc-table/lib/interface';


export default function WithSectionInformation(): React.ReactNode {

    const tableColumns = [
        {
            key: 'index',
            title: '序号',
            fixed: "left" as FixedType,
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
         },
         {
            key: 'sort',
             title: '杆塔号',
             dataIndex: 'sort',
             width: 150,
         },
         {
             key: 'planNumber',
             title: '呼高',
             dataIndex: 'planNumber',
             width: 150
         },
         {
             key: 'productCategoryName',
             title: '配段信息',
             dataIndex: 'productCategoryName',
             width: 150
         },
         {
             key: 'productNum',
             title: 'A',
             dataIndex: 'productNum',
             width: 80
         },
         {
             key: 'description',
             title: 'B',
             dataIndex: 'description',
             width: 80
         },
         {
             key: 'description',
             title: 'C',
             dataIndex: 'description',
             width: 80
         },
         {
             key: 'description',
             title: 'D',
             dataIndex: 'description',
             width: 80
         }
    ]

    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(``)
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
        <CommonTable columns={ tableColumns } dataSource={ detailData } pagination={ false }/>
    </DetailContent>
}