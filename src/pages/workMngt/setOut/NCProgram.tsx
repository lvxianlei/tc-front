/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息-NC程序
*/

import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Popconfirm, Upload, message, Spin } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import AuthUtil from '../../../utils/AuthUtil';
import { downloadTemplate } from './downloadTemplate';

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

export default function NCProgram(): React.ReactNode {
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
                    <Button type="link" onClick={ async () => { 
                        const data: IAttachVos[] = await RequestUtil.post<IAttachVos[]>(`/tower-science/productNc/exportProductNc`, { id: record.id }); 
                        if(data && data.length > 0) {
                            window.open(data[0].filePath)
                        }
                    }} disabled={ !record.ncName }>下载</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => RequestUtil.delete(`/tower-science/productNc`, {
                            id: record.id
                        }).then(res => {
                            message.success('删除成功');
                            history.go(0);
                        }) }
                        okText="提交"
                        cancelText="取消"
                        disabled={ !record.ncName }
                    >
                        <Button type="link" disabled={ !record.ncName }>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]
    const history = useHistory();
    const params = useParams<{ id: string, productSegmentId: string }>();
    const [ refresh, setRefresh ] = useState(false);
    const { loading, data }: Record<string, any> = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-science/productNc/count?productCategoryId=${ params.id }`);
        resole(data)
    }), {})

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }
    
    return <Page
        path="/tower-science/productNc"
        requestData={{ productCategoryId: params.id }}
        columns={ columns }
        headTabs={ [] }
        refresh={ refresh }
        extraOperation={ <Space direction="horizontal" size="small">
            <Button type="primary" ghost onClick={ () => downloadTemplate(`/tower-science/productNc/downloadSummary?productCategoryId=${ params.id }`, "NC文件汇总" , {}, true ) }>下载</Button>
            <p>NC程序数 { data.ncCount }/{ data.structureCount }</p>
            <Upload 
                action={ () => {
                    const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                    return baseUrl+'/sinzetech-resource/oss/put-file'
                } } 
                headers={
                    {
                        'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                        'Tenant-Id': AuthUtil.getTenantId(),
                        'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                    }
                }
                data={ { productCategoryId: params.id } }
                multiple={ true }
                showUploadList={ false }
                onChange={ (info) => {
                    if(info.file.response && !info.file.response?.success) {
                        message.warning(info.file.response?.msg)
                    } 
                    if(info.file.response && info.file.response?.success){
                        const dataInfo = info.file.response.data
                        const fileInfo = dataInfo.name.split(".")
                        RequestUtil.post(`/tower-science/productNc/importProductNc`, {
                            attachInfoList: [{
                                filePath: dataInfo.name,
                                fileSize: dataInfo.size,
                                fileUploadTime: dataInfo.fileUploadTime,
                                name: dataInfo.originalName,
                                userName: dataInfo.userName,
                                fileSuffix: fileInfo[fileInfo.length - 1]
                            }],
                            productCategoryId: params.id
                        })
                        message.success('上传成功');
                        setRefresh(!refresh);
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
                values.createTimeStart = formatDate[0] + ' 00:00:00';
                values.createTimeEnd = formatDate[1] + ' 23:59:59';
            }
            return values;
        } }
    />
}