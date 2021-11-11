import React, { useState } from 'react';
import { Space, Input, Select, Button, Popconfirm, Form, message, TreeSelect, Upload } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './DataMngt.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import AuthUtil from '../../../utils/AuthUtil';
import { downloadTemplate } from '../../workMngt/setOut/downloadTemplate';

export interface IData {
    readonly id?: string;
    readonly dataName?: string;
    readonly dataNumber?: string;
    readonly dataStatus?: number;
    readonly dataPlaceId?: string;
    readonly dataType?: string;
    readonly designation?: string;
    readonly updateTime?: string;
}

export interface IFileList {
    readonly id?: string;
    readonly fileName?: string;
    readonly filePath?: string;
    readonly fileSuffix?: string;
    readonly uid?: number;
    readonly name?: string;
    readonly description?: string;
    readonly userName?: string;
    readonly link?: string;
    readonly fileSize?: string;
    readonly fileUploadTime?: string;
}

export default function DataMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});

    const columns = [
        {
            key: 'dataNumber',
            title: '资料编号',
            width: 150,
            dataIndex: 'dataNumber',
            render: (_: string, record: Record<string, any>): React.ReactNode => (
                <Link to={`/announcement/detail/${ record.id }`}>{_}</Link>
            )
        },
        {
            key: 'dataName',
            title: '资料名称',
            width: 150,
            dataIndex: 'dataName'
        },
        {
            key: 'dataType',
            title: '资料类型',
            width: 150,
            dataIndex: 'dataType'
        },
        {
            key: 'dataStatus',
            title: '状态',
            dataIndex: 'dataStatus',
            width: 120,
            render: (dataStatus: number): React.ReactNode => {
                switch (dataStatus) {
                    case 0:
                        return '待入库';
                    case 1:
                        return '在库';
                    case 2:
                        return '借出';
                    case 3:
                        return '遗失';
                }
            }
        },
        {
            key: 'updateTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateTime'
        },
        {
            key: 'designation',
            title: '备注',
            width: 200,
            dataIndex: 'designation'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 130,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Link to={`/announcement/detail/${ record.id }`}>详情</Link>
                    { record.dataStatus === 0 ? <Link to={{pathname: `/archivesMngt/dataMngt/datasetting`, state:{ type: 'edit', data: [record] } }}><Button type="link">编辑</Button></Link> : <Button type="link" disabled>编辑</Button> }
                    <Button type="link">借出</Button>
                    <Button type="link">归还</Button>
                    <Button type="link">遗失</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-system/dataRecord?ids=${ record.id }`).then(res => {
                                setRefresh(!refresh); 
                            });
                        } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const batchDel = () => {
        if(selectedRows.length > 0) {
            RequestUtil.delete(`/tower-system/dataRecord?ids=${ selectedRows.map<string>((item: IData): string => item?.id || '').join(',') }`).then(res => {
                message.success('批量删除成功');
                setSelectedKeys([]);
                setSelectedRows([]);
                setRefresh(!refresh);
            });   
        } else {
            message.warning('请先选择需要删除的数据');
        }
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IData[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<IData[]>([]);

    return <Page
        path="/tower-system/dataRecord"
        columns={ columns }
        headTabs={ [] }
        extraOperation={ <Space direction="horizontal" size="small">
            <Upload 
                action={ () => {
                    const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                    return baseUrl+''
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
                    if(info.file.response && info.file.response?.success){
                            message.success('导入成功！');
                            setRefresh(!refresh);
                    } 
                } }
            >
                <Button type="primary">导入</Button>
            </Upload>
            <Button type="primary" onClick={ () => downloadTemplate('', '资料管理导入模板') } ghost>下载导入模板</Button>
            <Button type="primary" ghost>导出</Button>
            <Link to={{pathname: `/archivesMngt/dataMngt/dataNew`, state:{ type: 'new' } }}><Button type="primary" ghost>录入</Button></Link>
            <Button type="primary" ghost>编辑</Button>
            <Button type="primary" onClick={ batchDel } ghost>删除</Button>
        </Space> }
        refresh={ refresh }
        tableProps={{
            rowSelection: {
                selectedRowKeys: selectedKeys,
                onChange: SelectChange
            }
        }}
        searchFormItems={ [
            {
                name: 'dataPlaceId',
                label: '资料库',
                children: <Form.Item name="dataPlaceId">
                    <TreeSelect
                        style={{ width: '150px' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择"
                        allowClear
                        treeDefaultExpandAll
                        >
                        <TreeNode value="parent 1" title="parent 1">
                            <TreeNode value="parent 1-0" title="parent 1-0">
                            <TreeNode value="leaf1" title="leaf1" />
                            <TreeNode value="leaf2" title="leaf2" />
                            </TreeNode>
                            <TreeNode value="parent 1-1" title="parent 1-1">
                            <TreeNode value="leaf3" title="leaf3" />
                            </TreeNode>
                        </TreeNode>
                        </TreeSelect>
                </Form.Item>
            },
            {
                name: 'dataStatus',
                label: '在库状态',
                children: <Form.Item name="dataStatus">
                    <Select placeholder="请选择" style={{ width: "150px" }}>
                        <Select.Option value={0} key="0">待入库</Select.Option>
                        <Select.Option value={1} key="1">在库</Select.Option>
                        <Select.Option value={2} key="2">借出</Select.Option>
                        <Select.Option value={3} key="3">遗失</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'fuzzyQuery',
                label: '模糊查询项',
                children: <Input maxLength={50}/>
            }
        ] }
        filterValue={ filterValue }
        onFilterSubmit = { (values: Record<string, any>) => {
            setFilterValue(values);
            return values;
        } }
    />
}