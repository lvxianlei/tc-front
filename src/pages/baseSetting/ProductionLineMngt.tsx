/**
 * @author zyc
 * @copyright © 2021 
 * @description 产线管理
 */

import React, { useEffect, useState } from 'react';
import { Space, Input, Button, Modal, Select, Form, Popconfirm, message, TreeSelect } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import styles from './ProcessMngt.module.less';
import { wrapRole2DataNode } from './deptUtil';
import useRequest from '@ahooksjs/use-request';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';

export interface IDetailData {
    readonly createTime?: string;
    readonly createUserName?: string;
    readonly deptProcessesId?: string;
    readonly deptProcessesName	?: string;
    readonly description?: string;
    readonly id?: string;
    readonly name?: string;
    readonly workshopDeptId?: string;
    readonly workshopDeptName?: string;
}

export interface IProcess {
    readonly deptProcessesDetailList?: IDeptProcessesDetailList[];
    readonly deptId?: string;
    readonly deptName?: string;
    readonly id?: string;
}

export interface IDeptProcessesDetailList {
    readonly id?: string;
    readonly name?: string;
    readonly sort?: string;
}
export default function ProductionLineMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ title, setTitle ] = useState('新增');
    const [ form ] = Form.useForm();
    const [ processDisabled, setProcessDisabled ] = useState(true);
    const [ detailData, setDetailData ] = useState<IDetailData>({});
    const [ process, setProcess ] = useState<IDeptProcessesDetailList[]>([]);

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'name',
            title: '产线名称',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'workshopDeptName',
            title: '所属车间',
            dataIndex: 'workshopDeptName',
            width: 120
        },
        {
            key: 'deptProcessesName',
            title: '所属工序',
            width: 200,
            dataIndex: 'deptProcessesName'
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'createUserName',
            title: '制单人',
            width: 200,
            dataIndex: 'createUserName'
        },
        {
            key: 'createTime',
            title: '制单时间',
            width: 200,
            dataIndex: 'createTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 300,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={ () => {
                        setVisible(true);
                        setTitle("编辑");
                        getList(record.id);
                        setProcessDisabled(false);
                        getProcess(record.workshopDeptId);
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-production/productionLines/remove?id=${ record.id }`).then(res => {
                                message.success('删除成功');
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

    const save = () => {
        form.validateFields().then(res => {
            let value = form.getFieldsValue(true);
            value = {
                ...value,
                id: detailData.id,
                workshopDeptId: value.workshopDeptId.split(',')[0],
                workshopDeptName: value.workshopDeptId.split(',')[1],
                deptProcessesId: value.deptProcessesId.split(',')[0],
                deptProcessesName: value.deptProcessesId.split(',')[1],
            }
            RequestUtil.post<IDetailData>(`/tower-production/productionLines/submit`, { ...value }).then(res => {
                message.success('保存成功！');
                setVisible(false);
                setRefresh(!refresh);
                setProcessDisabled(true);
                setProcess([]);
                setDetailData({});
                form.setFieldsValue({ name: '', deptProcessesId: '', workshopDeptId: '', description: '', createTime: '', creatUser: '', deptProcessesName: '', id: '', workshopDeptName: '' });
            });
        })
    }

    const cancel = () => {
        setProcessDisabled(true);
        setProcess([]);
        setDetailData({});
        form.setFieldsValue({ name: '', deptProcessesId: '', workshopDeptId: '', description: '', createTime: '', creatUser: '', deptProcessesName: '', id: '', workshopDeptName: '' });
        setVisible(false);
    }

    const getList = async (id: string) => {
        const data = await RequestUtil.get<IDetailData>(`/tower-production/productionLines/detail?id=${ id }`);
        const newData = {
            ...data,
            deptProcessesId: data.deptProcessesId + ',' + data.deptProcessesName,
            workshopDeptId: data.workshopDeptId + ',' + data.workshopDeptName,
        }
        setDetailData(newData);
        form.setFieldsValue({...newData})
    }

    const getProcess = async (id: string) => {
        const data = await RequestUtil.get<IProcess>(`/tower-production/workshopDept/detail?deptId=${ id }`);
        setProcess(data?.deptProcessesDetailList || []);
    }

    const renderTreeNodes = (data:any) => data.map((item:any) => {
        if (item.children) {
            item.disabled = true;
            return (<TreeNode key={ item.id + ',' + item.title } title={ item.title } value={ item.id + ',' + item.title } disabled={ item.disabled } className={ styles.node } >
                { renderTreeNodes(item.children) }
            </TreeNode>);
        }
        return <TreeNode { ...item } key={ item.id + ',' + item.title } title={ item.title } value={ item.id + ',' + item.title } />;
    });

    const { data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<SelectDataNode[]>(`/sinzetech-user/department/tree`);
        resole(data);
    }), {})
    const departmentData: any = data || [];
    return (
        <>
            <Page
                path="/tower-production/productionLines/page"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => {setVisible(true); setTitle("新增");} } ghost>新增产线</Button> }
                refresh={ refresh }
                searchFormItems={ [
                    {
                        name: 'productionLinesName',
                        label: '',
                        children: <Input placeholder="请输入产线名称进行查询"/>
                    }
                ] }
                onFilterSubmit = { (values: Record<string, any>) => {
                    return values;
                } }
            />
            <Modal visible={ visible } width="40%" title={ title + "产线" } okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Form form={ form } labelCol={{ span: 4 }}>
                    <Form.Item name="name" label="产线名称" initialValue={ detailData.name } rules={[{
                            "required": true,
                            "message": "请输入产线名称"
                        }]}>
                        <Input placeholder="请输入" maxLength={ 50 } />
                    </Form.Item>
                    <Form.Item name="workshopDeptId" label="所属车间" initialValue={ detailData.workshopDeptId } rules={[{
                            "required": true,
                            "message": "请选择所属车间"
                        }]}>
                        <TreeSelect placeholder="请选择" style={{ width: "100%" }} onChange={(e) => {
                            setProcessDisabled(false);
                            form.setFieldsValue({ deptProcessesId: '' });
                            getProcess(e.toString().split(',')[0]);
                        }}>
                            { renderTreeNodes(wrapRole2DataNode(departmentData)) }
                        </TreeSelect>
                    </Form.Item>
                    <Form.Item name="deptProcessesId" label="所属工序" initialValue={ detailData.deptProcessesId } rules={[{
                            "required": true,
                            "message": "请选择所属工序"
                        }]}>
                        <Select placeholder="请选择" disabled={ processDisabled }>
                            { process.map((item: any) => {
                                return <Select.Option key={ item.id + ',' + item.name } value={ item.id + ',' + item.name }>{ item.name }</Select.Option>
                            }) }
                        </Select>
                    </Form.Item>
                    <Form.Item name="description" label="备注" initialValue={ detailData.description }>
                        <Input placeholder="请输入" maxLength={ 300 } />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}