
/**
 * @author zyc
 * @copyright © 2021 
 * @description 工序管理
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Form, Table, Popconfirm, message, TreeSelect, InputNumber } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import styles from './ProcessMngt.module.less';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import useRequest from '@ahooksjs/use-request';
import { wrapRole2DataNode } from './deptUtil';
import { useHistory } from 'react-router';

interface IProcessList {
    readonly sort?: string;
    readonly name?: string;
    readonly id?: string;
}

interface IDetailData {
    readonly deptId?: string;
    readonly deptName?: string;
    readonly id?: string | number;
    readonly deptProcessesDetailList?: IProcessList[];
}
export default function ProcessMngt(): React.ReactNode {
    const columns = [
        {
            key: 'deptName',
            title: '所属部门',
            width: 150,
            dataIndex: 'deptName'
        },
        {
            key: 'createUserName',
            title: '制单人',
            dataIndex: 'createUserName',
            width: 120
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
                        getList(record.deptId);
                        setVisible(true);
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-production/workshopDept/remove?id=${ record.id }`).then(res => {
                                message.success('删除成功');
                                // setRefresh(!refresh);
                                history.go(0);
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

    const tableColumns = [
        {
            key: 'id',
            title: '序号',
            dataIndex: 'id',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<>
                <span>{ index + 1 }</span>
                <Form.Item name={['deptProcessesDetailList',index, "id"]} style={{ display: "none" }}>
                    <Input size="small"/>
                </Form.Item>
            </>)
        },
        {
            key: 'name',
            title: <span><span style={{ color: 'red' }}>*</span>工序</span>,
            dataIndex: 'name',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["deptProcessesDetailList", index, "name"] } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入工序" },
                    {
                      pattern: /^[^\s]*$/,
                      message: '禁止输入空格',
                    }]}>
                    <Input maxLength={ 50 } key={ index } />
                </Form.Item>
            )  
        },
        {
            key: 'sort',
            title: <span><span style={{ color: 'red' }}>*</span>顺序</span>,
            dataIndex: 'sort',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["deptProcessesDetailList", index, "sort"] } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入顺序" }]}>
                    <InputNumber step={1} min={ 1 } maxLength={ 10 } precision={ 0 } key={ index } />
                </Form.Item>
            )  
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => delRow(index, record) }
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
                id: detailData.id === -1 ? '' : detailData.id,
                deptId: value.deptId.split(',')[0],
                deptName: value.deptId.split(',')[1],
                deptProcessesList: value.deptProcessesDetailList
            }
            RequestUtil.post<IDetailData>(`/tower-production/workshopDept/submit`, { ...value }).then(res => {
                message.success('保存成功！')
                setVisible(false);
                setProcessList([]);
                setDetailData({});
                // setRefresh(!refresh);
                history.go(0);
                form.setFieldsValue({ deptId: '', deptProcessesDetailList: [] });
            });
        })
    }

    const cancel = () => {
        setVisible(false);
        form.setFieldsValue({ deptId: '', deptProcessesDetailList: [] });
        setProcessList([]);
        setDetailData({});
    }

    const addRow = () => {
        let processListValues = form.getFieldsValue(true).deptProcessesDetailList || [];
        let newData = {
            name: '',
            sort: undefined
        }
        setProcessList([...processListValues, newData]);
        form.setFieldsValue({ deptProcessesDetailList: [...processListValues, newData] })
    }

    const delRow = async (index: number, record: Record<string, any>) => {
        let processListValues = form.getFieldsValue(true).deptProcessesDetailList || []; 
        if(record.id) {
            const data = await RequestUtil.get<boolean>(`/tower-production/workshopDept/checkProductionLines?processesId=${ record.id }`)
            if(data) {
                processListValues.splice(index, 1);
                setProcessList([...processListValues]);
                form.setFieldsValue({ deptProcessesDetailList: [...processListValues] })
            } else {
                message.warning('当前工序已被引用，不可移除')
            }
        } else {
            processListValues.splice(index, 1);
            setProcessList([...processListValues]);
            form.setFieldsValue({ deptProcessesDetailList: [...processListValues] })
        }
    }

    const getList = async (id: string) => {
        const data = await RequestUtil.get<IDetailData>(`/tower-production/workshopDept/detail?deptId=${ id }`);
        if(data.id !== -1) {
            const newData = {
                ...data,
                deptId: data.deptId + ',' + data.deptName
            }
            setDetailData(newData);
            setProcessList(newData?.deptProcessesDetailList || []);
            form.setFieldsValue({ deptId: newData.deptId, deptProcessesDetailList: [...newData?.deptProcessesDetailList || []] })
        } else {
            setDetailData({});
            setProcessList([]);
            form.setFieldsValue({ deptProcessesDetailList: [] })
        }
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

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ form ] = Form.useForm();
    const [ detailData, setDetailData ] = useState<IDetailData>({});
    const [ processList, setProcessList ] = useState<IProcessList[]>([]);
    const [ filterValue, setFilterValue ] = useState({});
    const history = useHistory();
    const { data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<SelectDataNode[]>(`/sinzetech-user/department/tree`);
        resole(data);
    }), {})
    const departmentData: any = data || [];
    return (
        <>
            <Page
                path="/tower-production/workshopDept/page"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => setVisible(true) } ghost>新增</Button> }
                refresh={ refresh }
                searchFormItems={ [
                    {
                        name: 'deptName',
                        label: '',
                        children: <Input placeholder="请输入部门名称进行查询"/>
                    }
                ] }
                filterValue={ filterValue }
                onFilterSubmit = { (values: Record<string, any>) => {
                    setFilterValue(values);
                    return values;
                } }
            />
            <Modal visible={ visible } width="40%" title="按车间设置工序顺序" okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Form form={ form }>
                    <Form.Item name="deptId" label="所属车间" initialValue={ detailData.deptId } rules={[{
                            "required": true,
                            "message": "请选择所属车间"
                        }]}>
                        <TreeSelect placeholder="请选择" style={{ width: "150px" }} onChange={ (e) => {
                            getList(e.toString().split(',')[0]);
                        } }>
                            { renderTreeNodes(wrapRole2DataNode(departmentData)) }
                        </TreeSelect>
                    </Form.Item>
                    <Button type="primary" onClick={ addRow }>新增一行</Button>
                    <Table rowKey="id" dataSource={[...processList]} pagination={false} columns={tableColumns} className={styles.addModal}/>
                </Form>
            </Modal>
        </>
    )
}