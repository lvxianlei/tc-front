/**
 * @author zyc
 * @copyright © 2021 
 * @description 员工管理-新增
*/

import React, { useState } from 'react';
import { Spin, Button, Space, message, Form, Input, Popconfirm, TreeSelect, Checkbox, Select } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { DetailTitle, DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './StaffMngt.module.less';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { FixedType } from 'rc-table/lib/interface';
import { IStaff } from './StaffMngt';
import { staffTypeOptions } from '../../../configuration/DictionaryOptions';
import layoutStyles from '../../../layout/Layout.module.less';
import { IRole } from '../../auth/role/IRole';
import { IJobs } from '../jobs/JobsMngt';
import { checkcustomerPhone } from './RulesUtils';
import { RuleObject } from 'antd/lib/form';
import { StoreValue } from 'antd/lib/form/interface';

interface IResponseData {
    readonly records?: IJobs[];
}

export default function StaffNew(): React.ReactNode {
    const [form] = Form.useForm();
    const history = useHistory();
    const location = useLocation<{ type: string, data: IStaff[] }>();
    const [dataList, setDataList] = useState<IStaff[]>([]);
    const [oldDataList, setOldDataList] = useState<IStaff[]>([]);
    const [departData, setDepartData] = useState<any[]>([]);
    const [roleList, setRoleList] = useState<IRole[]>([]);
    const [jobsList, setJobsList] = useState<IJobs[]>([]);

    const { loading } = useRequest(() => new Promise(async (resole, reject) => {
        const deptData: any[] = await RequestUtil.get(`/tower-system/department`);
        setDepartData(deptData);
        const roles: IRole[] = await RequestUtil.get<IRole[]>('/sinzetech-system/role/tree');
        setRoleList(roles);
        const stations: IResponseData = await RequestUtil.get<IResponseData>('/tower-system/station?size=100');
        setJobsList(stations.records || []);
        if (location.state.type === 'edit') {
            let data: IStaff[] = location.state.data;
            data = data.map((items: IStaff) => {
                return {
                    ...items,
                    stationList: items.station?.split(','),
                    roleIdList: items.roleId?.split(','),
                }
            })
            setDataList(data);
            setOldDataList(data);
        } else {
            setDataList([]);
        }
        resole(true)
    }), {})

    const tableColumns = [
        {
            title: <span><span style={{ color: 'red' }}>*</span>手机号</span>,
            dataIndex: 'phone',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "phone"]} key={index} initialValue={_} rules={[{
                    "required": true,
                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                        if (value) {
                            checkcustomerPhone(value).then(res => {
                                if (res) {
                                    const values: IStaff[] = JSON.parse(JSON.stringify(form.getFieldsValue(true).list));
                                    values.splice(index, 1);
                                    var same = values.some((item: IStaff) => item.phone === value);
                                    if (same) {
                                        callback('手机号重复')
                                    } else {
                                        callback()
                                    }
                                } else {
                                    callback('手机号格式有误')
                                }
                            })
                        } else {
                            callback('请输入手机号')
                        }
                    }
                }]}>
                    <Input maxLength={50} onBlur={(e) => {
                        let data = form.getFieldsValue(true).list;
                        data = data.map((item: IStaff, ind: number) => {
                            return {
                                ...item,
                                id: dataList[ind].id,
                                userId: dataList[ind].userId
                            }
                        })
                        if (!data[index].account) {
                            data[index] = {
                                ...data[index],
                                account: e.target.value
                            }
                            setDataList([...data]);
                            form.setFieldsValue({ list: [...data] })
                        }
                    }} />
                </Form.Item>
            )
        },
        {
            title: <span><span style={{ color: 'red' }}>*</span>账号</span>,
            dataIndex: 'account',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "account"]} key={index} initialValue={_} rules={[{
                    "required": true,
                    "message": "请输入账号"
                }]}>
                    <Input maxLength={20} disabled={location.state.type === 'edit'} />
                </Form.Item>
            )
        },
        {
            title: '启用账号',
            dataIndex: 'status',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "status"]} key={index} initialValue={_}>
                    <Checkbox key={record.id} checked={_ === 1} disabled={location.state.type === 'edit' && oldDataList[index].autoAccount === 1} onChange={(e) => {
                        let data = form.getFieldsValue(true).list;
                        data = data.map((item: IStaff, ind: number) => {
                            return {
                                ...item,
                                id: dataList[ind].id,
                                userId: dataList[ind].userId
                            }
                        })
                        data[index] = {
                            ...data[index],
                            status: e.target.checked ? 1 : 0
                        }
                        setDataList([...data]);
                        form.setFieldsValue({ list: [...data] })
                    }} />
                </Form.Item>
            )
        },
        {
            title: <span><span style={{ color: 'red' }}>*</span>角色</span>,
            dataIndex: 'roleIdList',
            width: 250,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "roleIdList"]} key={index} initialValue={_} rules={[{
                    "required": true,
                    "message": "请选择角色"
                }]}>
                    <TreeSelect showSearch={true} placeholder="请选择所属角色" multiple={true}
                        className={layoutStyles.width100} treeData={wrapRole1DataNode(roleList)} />
                </Form.Item>
            )
        },
        {
            title: <span><span style={{ color: 'red' }}>*</span>姓名</span>,
            dataIndex: 'name',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "name"]} key={index} initialValue={_} rules={[{
                    "required": true,
                    "message": "请输入姓名"
                },
                {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                }]}>
                    <Input maxLength={50} />
                </Form.Item>
            )
        },
        {
            title: <span><span style={{ color: 'red' }}>*</span>部门</span>,
            dataIndex: 'dept',
            width: 250,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "dept"]} key={index} initialValue={_} rules={[{
                    "required": true,
                    "message": "请选择部门"
                }]}>
                    <TreeSelect
                        style={{ width: '100%' }}
                        treeData={wrapRole2DataNode(departData)}
                        placeholder="请选择部门"
                    />
                </Form.Item>
            )
        },
        {
            title: <span><span style={{ color: 'red' }}>*</span>班组</span>,
            dataIndex: 'teamGroupId',
            width: 250,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "teamGroupId"]} key={index} initialValue={_} rules={[{
                    "required": true,
                    "message": "请选择部门"
                }]}>
                    <TreeSelect
                        style={{ width: '100%' }}
                        treeData={wrapRole2DataNode(departData)}
                        placeholder="请选择部门"
                    />
                </Form.Item>
            )
        },
        {
            title: '工号',
            dataIndex: 'number',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "number"]} key={index} initialValue={_} rules={[
                    {
                        pattern: /^[0-9]*$/,
                        message: '仅可输入数字',
                    }
                ]}>
                    <Input maxLength={50} />
                </Form.Item>
            )
        },
        {

            title: "企业微信用户",
            dataIndex: 'businessWxUserId',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "businessWxUserId"]} key={index} initialValue={_}>
                    <Input maxLength={50} />
                </Form.Item>
            )
        },
        {
            title: <span><span style={{ color: 'red' }}>*</span>员工类型</span>,
            dataIndex: 'category',
            width: 180,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "category"]} key={index} initialValue={_} rules={[{
                    "required": true,
                    "message": "请选择员工类型"
                }]}>
                    <Select>
                        {staffTypeOptions && staffTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            title: <span><span style={{ color: 'red' }}>*</span>岗位</span>,
            dataIndex: 'stationList',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "stationList"]} key={index} initialValue={_} rules={[{
                    "required": true,
                    "message": "请选择岗位"
                }]}>
                    <Select placeholder="选择岗位" mode="multiple">
                        {jobsList && jobsList.map(({ id, stationName }, index) => {
                            return <Select.Option key={index} value={id || ''}>
                                {stationName}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "email"]} key={index} initialValue={_}>
                    <Input maxLength={200} key={index} />
                </Form.Item>
            )
        },
        {
            title: '备注',
            dataIndex: 'description',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["list", index, "description"]} key={index} initialValue={_}>
                    <Input maxLength={50} />
                </Form.Item>
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 150,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => delRow(index)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const wrapRole1DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles && roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }
    const wrapRole2DataNode: (data: any) => any[] = (data: any[]) => {
        return data.map((item: any) => ({
            title: item.name,
            value: item.id,
            disabled: item.type === 2 || item.parentId === '0',
            children: item.children ? wrapRole2DataNode(item.children) : []
        }))
    }
    // const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
    //     roles && roles.forEach((role: any & SelectDataNode): void => {
    //         role.value = role.id;
    //         role.title = role.name;
    //         role.type === 2 || role.parentId === '0' ? role.disabled = true : role.disabled = false;
    //         role.isLeaf = false;
    //         if (role.children && role.children.length > 0) {
    //             wrapRole2DataNode(role.children);
    //         }
    //     });
    //     return roles;
    // }

    const addRow = () => {
        const dataListValues = form.getFieldsValue(true).list || [];
        const newRow = {
            autoAccount: 1,
            account: '',
            category: undefined,
            dept: undefined,
            teamGroupId: undefined,
            description: '',
            email: '',
            name: '',
            number: '',
            phone: '',
            roleId: undefined,
            station: undefined,
            status: 1
        }
        setDataList([
            ...dataListValues,
            newRow
        ])
        form.setFieldsValue({ list: [...dataListValues, newRow] })
    }

    const delRow = (index: number) => {
        const dataListValues = form.getFieldsValue(true).list;
        dataListValues.splice(index, 1);
        setDataList([...dataListValues]);
    }

    const save = () => {
        if (form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true).list;
                if (value.length > 0) {
                    value = value.map((items: IStaff, index: number) => {
                        return {
                            ...items,
                            id: dataList[index].id,
                            userId: dataList[index].userId,
                            roleId: items.roleIdList && items.roleIdList.join(','),
                            station: items.stationList && items.stationList.join(',')
                        }
                    })
                    if (location.state.type === 'new') {
                        RequestUtil.post(`/tower-system/employee`, { employeeList: value }).then(res => {
                            history.goBack();
                        })
                    } else {
                        RequestUtil.put(`/tower-system/employee`, { employeeList: value }).then(res => {
                            history.goBack();
                        })
                    }
                } else {
                    message.warning('请先新增数据');
                }
            })
        }
    }


    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return (<DetailContent operation={[
        <Space direction="horizontal" size="small" className={styles.bottomBtn}>
            <Popconfirm
                title="员工关联用户账号后，将不可解绑，是否确认继续操作？?"
                onConfirm={save}
                okText="确认"
                cancelText="取消"
            >
                <Button type="primary">保存</Button>
            </Popconfirm>
            <Button type="ghost" onClick={() => history.goBack()}>取消</Button>
        </Space>
    ]}>
        <DetailTitle title="员工信息" operation={location.state.type === 'new' ? [<Button type="primary" key="addRow" onClick={addRow}>添加行</Button>] : []} />
        <Form form={form}>
            <CommonTable
                rowKey="id"
                dataSource={[...dataList]}
                pagination={false}
                columns={location.state.type === 'edit' ? tableColumns.splice(0, 11) : tableColumns}
            />
        </Form>
    </DetailContent>
    )
}