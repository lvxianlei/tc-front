/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-放样信息
*/

import React from 'react';
import { Spin, Button, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './SetOut.module.less';
import { specialColums, productColumns } from './SetOutInformation.json';

interface ISetOut {
    readonly attachVos?: IAttachVos[];
    readonly stateRecordVOS?: ITaskDataVOList[];
}

interface IAttachVos {
    readonly description?: string;
    readonly filePath?: string;
    readonly fileSize?: string;
    readonly fileSuffix?: string;
    readonly fileUploadTime?: string;
    readonly id?: string;
    readonly name?: string;
    readonly userName?: string;
}

interface ITaskDataVOList {
    readonly createTime?: string;
    readonly status?: string;
    readonly createUser?: string;
    readonly createDepartment?: string;
    readonly description?: string;
}

const tableColumns = [
    { 
        key: 'index', 
        title: '序号', 
        dataIndex: 'index', 
        width: 100, 
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>) },
    {
        key: 'createDeptName',
        title: '操作部门',
        dataIndex: 'createDeptName', 
    },
    {  
        key: 'createUserName', 
        title: '操作人', 
        dataIndex: 'createUserName' 
    },
    { 
        key: 'createTime', 
        title: '操作时间', 
        dataIndex: 'createTime' 
    },
    {
        key: 'currentStatus', 
        title: '任务状态', 
        dataIndex: 'currentStatus',
        render: (currentStatus: number): React.ReactNode => {
            switch (currentStatus) {
                case 1:
                    return '待指派';
                case 2:
                    return '放样中';
                case 3:
                    return '组焊中';
                case 4:
                    return '配段中';
                case 5:
                    return '已完成';
                case 6:
                    return '已提交';
            }
        }
    },
    {
        key: 'description', 
        title: '备注', 
        dataIndex: 'description' 
    }
]

export default function SetOutInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading, data }: Record<string, any> = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/loftingList/detail?productCategoryId=${ params.id }`);
        resole(data)
    }), {})
    const detailData: ISetOut = data;

    if (loading) {
        return <Spin spinning={ loading }>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <DetailContent operation={ [
        <Space direction="horizontal" size="small" className={ styles.bottomBtn }>
            <Button type="ghost" onClick={ () => history.goBack() }>关闭</Button>
        </Space>
    ] }>
        <DetailTitle title="特殊要求" />
        <BaseInfo columns={ specialColums } dataSource={ detailData } col={ 2 } />
        <DetailTitle title="产品信息" />
        <BaseInfo columns={ productColumns } dataSource={ detailData } col={ 2 } />
        <DetailTitle title="相关附件" />
        <CommonTable columns={[
            { 
                key: 'name', 
                title: '附件名称', 
                dataIndex: 'name',
                width: 350
            },
            { 
                key: 'operation', 
                title: '操作', 
                dataIndex: 'operation', 
                render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    <Space direction="horizontal" size="small">
                        <Button type="link" onClick={ () => window.open(record.filePath) }>下载</Button>
                        {
                            record.fileSuffix === 'pdf' ? <Button type="link" onClick={ () => window.open(record.filePath) }>预览</Button> : null
                        }
                    </Space>
            ) }
        ]}
            dataSource={ detailData.attachVos }
            pagination={ false }
        />
        <DetailTitle title="操作信息"/>
        <CommonTable columns={ tableColumns } dataSource={ detailData.stateRecordVOS } pagination={ false }/>
    </DetailContent>
}