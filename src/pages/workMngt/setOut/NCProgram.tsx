/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-NC程序
*/


import React from 'react';
import { Space, Input, DatePicker, Button, Popconfirm, Upload, message, Spin } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import AuthUtil from '../../../utils/AuthUtil';

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
        key: 'partName',
        title: '段名',
        width: 150,
        dataIndex: 'partName'
    },
    {
        key: 'componentCode',
        title: '构件编号',
        dataIndex: 'componentCode',
        width: 120
    },
    {
        key: 'ncName',
        title: 'NC程序名称',
        width: 200,
        dataIndex: 'ncName'
    },
    {
        key: 'createTime',
        title: '上传时间',
        width: 150,
        dataIndex: 'createTime',
    },
    {
        key: 'createUserName',
        title: '上传人',
        dataIndex: 'createUserName',
        width: 200,
    },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right' as FixedType,
        width: 100,
        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
            <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                <Button type="link" onClick={ () => RequestUtil.post(`/tower-science/productNc/exportProductNc`, {
                    ncId: record.id
                }) }>下载</Button>
                <Popconfirm
                    title="确认删除?"
                    onConfirm={ () => RequestUtil.delete(`/tower-science/productNc`, {
                        productNcId: record.id
                    }).then(res => {
                        message.success('删除成功');
                    }) }
                    okText="提交"
                    cancelText="取消"
                >
                    <Button type="link">删除</Button>
                </Popconfirm>
            </Space>
        )
    }
]

export default function NCProgram(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, productSegmentId: string }>();
    const { loading, data }: Record<string, any> = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/productNc/count?productSegmentId=${ params.productSegmentId }`);
        resole(data)
    }), {})

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }
    
    return <Page
        path="/tower-science/productNc"
        requestData={{ productSegmentId: params.productSegmentId }}
        columns={ columns }
        headTabs={ [] }
        extraOperation={ <Space direction="horizontal" size="small">
            <Button type="primary" ghost onClick={ () => RequestUtil.post(`/tower-science/productNc/exportProductNc`, {
                    ncId: ""
                }) }>下载</Button>
            <p>NC程序数 { data }/256</p>
            <Upload 
                action={ () => {
                    const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                    return baseUrl+'/tower-science/productNc/importProductNc'
                } } 
                headers={
                    {
                        'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                        'Tenant-Id': AuthUtil.getTenantId(),
                        'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                    }
                }
                data={ { productSegmentId: params.productSegmentId } }
                showUploadList={ false }
                onChange={ (info) => {
                    if(info.file.response && !info.file.response?.success) {
                        message.warning(info.file.response?.msg)
                    } 
                    if(info.file.response && info.file.response?.success){
                        history.go(0);
                    }
                } }
            >
                <Button type="primary" ghost>上传</Button>
            </Upload>
            <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
        </Space>}
        searchFormItems={ [
            {
                name: 'createTime',
                label: '上传时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="段号/构件编号"/>
            }
        ] }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.createTime) {
                const formatDate = values.createTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.createTimeStart = formatDate[0];
                values.createTimeEnd = formatDate[1];
            }
            return values;
        } }
    />
}