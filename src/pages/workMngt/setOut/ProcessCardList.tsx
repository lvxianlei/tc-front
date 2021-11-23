/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-模型
*/

import React, { useState } from 'react';
import { Space, Button } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';

export default function ProcessCardList(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [ refresh, setRefresh ] = useState(false);

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
            key: 'productCategoryName',
            title: '大样图工艺卡名称',
            width: 150,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'priority',
            title: '段包信息',
            dataIndex: 'priority',
            width: 120
        },
        {
            key: 'plannedDeliveryTime',
            title: '上传时间',
            dataIndex: 'plannedDeliveryTime',
            width: 200,
        },
        {
            key: 'loftingUserName',
            title: '上传人',
            width: 200,
            dataIndex: 'loftingUserName'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 250,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Button type="link">下载</Button>
                    <Button type="link">编辑</Button>
                </Space>
            )
        }
    ]

    const onRefresh = () => {
        setRefresh(!refresh);
    }

    return <Page
        path={ `/tower-science/productSegment` }
        columns={ columns }
        headTabs={ [] }
        refresh={ refresh }
        requestData={{ productCategoryId: params.id }}
        extraOperation={ <Space direction="horizontal" size="small">
            <Button type="primary" ghost>导出</Button>
            <Button>上传</Button>
            <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
        </Space> }
        searchFormItems={ [] }
    />
}