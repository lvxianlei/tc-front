/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Upload, message } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useLocation } from 'react-router-dom';
import Deliverables from './Deliverables';
import AuthUtil from '../../../utils/AuthUtil';
import RequestUtil from '../../../utils/RequestUtil';


export default function SetOutList(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'taskNum',
            title: '放样任务编号',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            dataIndex: 'internalNumber',
            width: 120
        },
        {
            key: 'name',
            title: '塔型',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'num',
            title: '杆塔（基）',
            width: 150,
            dataIndex: 'num',
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            dataIndex: 'plannedDeliveryTime',
            width: 200,
        },
        {
            key: 'pattern',
            title: '模式',
            width: 200,
            dataIndex: 'pattern',
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
            key: 'loftingLeaderName',
            title: '放样负责人',
            width: 200,
            dataIndex: 'loftingLeaderName'
        },
        {
            key: 'status',
            title: '塔型放样状态',
            width: 200,
            dataIndex: 'status',
            render: (pattern: number): React.ReactNode => {
                switch (pattern) {
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
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 300,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Link to={ `/workMngt/setOutList/setOutInformation/${ record.loftingTask }` }>放样信息</Link>
                    {
                        record.status === 1 || record.status === 5 ? <Link to={ `/workMngt/setOutList/towerInformation/${ record.id }` }>塔型信息</Link> : <Button type="link" disabled>塔型信息</Button>
                    }
                    {
                        record.status === 4 ? <Link to={ `/workMngt/setOutList/poleInformation/${ record.id }` }>杆塔配段</Link> : <Button type="link" disabled>杆塔配段</Button>
                    }
                    <Deliverables id={ record.id } name={ record.name }/>
                    {
                        record.status === 2 || record.status === 3 || record.status === 4 ?
                        <Upload 
                            action={ () => {
                                const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                                return baseUrl + '/sinzetech-resource/oss/put-file'
                            } } 
                            headers={
                                {
                                    'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                                    'Tenant-Id': AuthUtil.getTenantId(),
                                    'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                                }
                            }
                            showUploadList={ false }
                            onChange={ (info) => {
                                if(info.file.response && !info.file.response?.success) {
                                    message.warning(info.file.response?.msg)
                                } 
                                if(info.file.response && info.file.response?.success) {
                                    const dataInfo = info.file.response.data
                                    const fileInfo = dataInfo.name.split(".")
                                    RequestUtil.post(`/tower-science/productCategory/lofting/draw/upload`, {
                                        attachInfoDTOList: [{
                                            filePath: dataInfo.name,
                                            fileSize: dataInfo.size,
                                            fileUploadTime: dataInfo.fileUploadTime,
                                            name: dataInfo.originalName,
                                            userName: dataInfo.userName,
                                            fileSuffix: fileInfo[fileInfo.length - 1]
                                        }],
                                        productCategoryId: record.id
                                    }).then(res => {
                                        setRefresh(true);
                                    })
                                }
                            }}> <Button type='link'>图纸上传</Button>
                        </Upload>
                        : 
                        <Button type='link' disabled>图纸上传</Button>
                    }
                </Space>
            )
        }
    ]

    const [ refresh, setRefresh ] = useState(false);
    const location = useLocation<{ state: number }>();
    return <Page
        path="/tower-science/loftingList/loftingPage"
        columns={ columns }
        headTabs={ [] }
        // extraOperation={ <Button type="primary" ghost>导出</Button> }
        requestData={ { status: location.state } }
        refresh={ refresh }
        searchFormItems={ [
            {
                name: 'updateStatusTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'status',
                label: '塔型状态',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="" key="6">全部</Select.Option>
                    <Select.Option value="1" key="1">待指派</Select.Option>
                    <Select.Option value="2" key="2">放样中</Select.Option>
                    <Select.Option value="3" key="3">组焊中</Select.Option>
                    <Select.Option value="4" key="4">配段中</Select.Option>
                    <Select.Option value="5" key="5">已完成</Select.Option>
                    <Select.Option value="6" key="6">已提交</Select.Option>
                </Select>
            },
            {
                name: 'plannedDeliveryTime',
                label: '计划交付时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'pattern',
                label: '模式',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value={ "" } key="4">全部</Select.Option>
                    <Select.Option value={ 1 } key="1">新放</Select.Option>
                    <Select.Option value={ 2 } key="2">重新出卡</Select.Option>
                    <Select.Option value={ 3 } key="3">套用</Select.Option>
                </Select>
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="放样任务编号/任务单编号/订单编号/内部合同编号/塔型/塔型钢印号"/>
            }
        ] }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.updateStatusTime) {
                const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            if(values.plannedDeliveryTime) {
                const formatDate = values.plannedDeliveryTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.plannedDeliveryTimeStart = formatDate[0] + ' 00:00:00';
                values.plannedDeliveryTimeEnd = formatDate[1] + ' 23:59:59';
            }
            return values;
        } }
    />
}