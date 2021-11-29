/**
 * @author zyc
 * @copyright © 2021 
 * @description 员工管理
*/

import React, { useState } from 'react';
import { Space, Input, Button, Popconfirm, message, Upload, Select, Form } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './StaffMngt.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import { downloadTemplate } from '../../workMngt/setOut/downloadTemplate';
import { staffTypeOptions } from '../../../configuration/DictionaryOptions';

export interface IStaff {
    readonly id?: string;
    readonly accountId?: string;
    readonly autoAccount?: number;
    readonly category?: string;
    readonly categoryName?: string;
    readonly dept?: string;
    readonly deptName?: string;
    readonly description?: string;
    readonly email?: string;
    readonly entryDate?: string;
    readonly name?: string;
    readonly number?: string;
    readonly phone?: string;
    readonly roleId?: string;
    readonly station?: string;
    readonly stationName?: string;
    readonly roleIdList?: string[];
    readonly stationList?: string[];
}

export default function StaffMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});

    const columns = [
        {
            key: 'name',
            title: '姓名',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'phone',
            title: '手机号',
            width: 150,
            dataIndex: 'phone'
        },
        {
            key: 'deptName',
            title: '部门',
            width: 150,
            dataIndex: 'deptName'
        },
        {
            key: 'number',
            title: '工号',
            dataIndex: 'number',
            width: 120
        },
        {
            key: 'categoryName',
            title: '员工类型',
            width: 200,
            dataIndex: 'categoryName'
        },
        {
            key: 'stationName',
            title: '岗位',
            width: 200,
            dataIndex: 'stationName'
        },
        {
            key: 'email',
            title: '邮箱',
            width: 200,
            dataIndex: 'email'
        },
        {
            key: 'account',
            title: '关联用户账号',
            width: 200,
            dataIndex: 'account'
        },
        {
            key: 'roleName',
            title: '角色',
            width: 200,
            dataIndex: 'roleName'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 130,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-system/employee`, [record.id]).then(res => {
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
            RequestUtil.delete(`/tower-system/employee`, selectedKeys).then(res => {
                message.success('批量删除成功');
                setSelectedKeys([]);
                setSelectedRows([]);
                setRefresh(!refresh);
            });   
        } else {
            message.warning('请先选择需要删除的数据');
        }
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IStaff[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<IStaff[]>([]);

    return <Page
            path="/tower-system/employee"
            columns={ columns }
            headTabs={ [] }
            extraOperation={ <Space direction="horizontal" size="small">
                {/* <Upload 
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
                <Button type="primary" onClick={ () => downloadTemplate('', '员工管理导入模板') } ghost>下载导入模板</Button>
                <Button type="primary" ghost>导出</Button> */}
                <Link to={{pathname: `/dept/staffMngt/new`, state:{ type: 'new' } }}><Button type="primary" ghost>新增</Button></Link>
                { selectedRows.length > 0 ? <Link to={{pathname: `/dept/staffMngt/setting`, state:{ type: 'edit', data: [...selectedRows] } }}><Button type="primary" ghost>编辑</Button></Link> : <Button type="primary" disabled ghost>编辑</Button> }
                <Popconfirm
                    title="确认删除?"
                    onConfirm={ batchDel }
                    okText="确认"
                    cancelText="取消"
                >
                    <Button type="primary" ghost>删除</Button>
                </Popconfirm>
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
                    name: 'category',
                    label: '员工类型',
                    children: <Form.Item name="category" initialValue="">
                            <Select placeholder="请选择" style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                            <Select.Option value={''} key="0">全部</Select.Option>
                            { staffTypeOptions && staffTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            }) }
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'fuzzyQuery',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入姓名/工号进行查询" maxLength={50}/>
                }
            ] }
            filterValue={ filterValue }
            onFilterSubmit = { (values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            } }
        />
}