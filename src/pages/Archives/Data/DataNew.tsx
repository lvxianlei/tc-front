import React, { useState } from 'react';
import { Spin, Button, Space, message, Form, Input, Table, Popconfirm, Select, TreeSelect } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { DetailTitle, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './DataMngt.module.less';
import { IData } from './DataMngt';
import { TreeNode } from 'antd/lib/tree-select';
import { IDatabaseTree } from '../../basicData/database/DatabaseMngt';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { dataTypeOptions } from '../../../configuration/DictionaryOptions';

export default function DataNew(): React.ReactNode {
    const [ form ] = Form.useForm();
    const history = useHistory();
    const location = useLocation<{ type: string, data: IData[] }>();
    const [ dataList, setDataList ] = useState<IData[]>([]);

    const tableColumns = [
        {
            key: 'dataNumber',
            title: <span><span style={{ color: 'red' }}>*</span>资料编号</span>,
            dataIndex: 'dataNumber',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "dataNumber"] } key={ index } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入资料编号" },
                    {
                      pattern: /^[^\s]*$/,
                      message: '禁止输入空格',
                    }]}>
                    <Input maxLength={ 50 }/>
                </Form.Item>
            )  
        },
        {
            key: 'dataName',
            title: <span><span style={{ color: 'red' }}>*</span>资料名称</span>,
            dataIndex: 'dataName',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "dataName"] } key={ index } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入资料名称" },
                    {
                      pattern: /^[^\s]*$/,
                      message: '禁止输入空格',
                    }]}>
                    <Input maxLength={ 50 }/>
                </Form.Item>
            )  
        },
        {
            key: 'dataType',
            title: <span><span style={{ color: 'red' }}>*</span>资料类型</span>,
            dataIndex: 'dataType',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "dataType"] } key={ index } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请选择资料类型" }]}>
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                        { dataTypeOptions && dataTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )  
        },
        {
            key: 'dataPlaceId',
            title: <span><span style={{ color: 'red' }}>*</span>资料库</span>,
            dataIndex: 'dataPlaceId',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "dataPlaceId"] } key={ index } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请选择资料库" }]}>
                    <TreeSelect placeholder="请选择" style={{ width: "150px" }}>
                        { renderTreeNodes(wrapRole2DataNode(databaseData)) }
                    </TreeSelect>
                </Form.Item>
            )  
        },
        {
            key: 'designation',
            title: '备注',
            dataIndex: 'designation',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "designation"] } key={ index } initialValue={ _ }>
                    <Input maxLength={ 200 } key={ index }/>
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
                        onConfirm={ () => delRow(index) }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const addRow = () => {
        const dataListValues = form.getFieldsValue(true).list || [];
        const newRow = {
            dataName: '',
            dataNumber: '',
            dataPlaceId: undefined,
            dataType: '',
            designation: ''
        }
        setDataList([
            ...dataListValues,
            newRow
        ])
        form.setFieldsValue({list: [...dataListValues, newRow]})
    }

    const delRow = (index: number) => {
        const dataListValues = form.getFieldsValue(true).list;
        dataListValues.splice(index, 1);
        setDataList([...dataListValues]);
    }

    const renderTreeNodes = (data:any) => data.map((item:any) => {
        if(item.children && item.children.length > 0) {
            item.disabled = true;
            return (<TreeNode key={ item.id } title={ item.title } value={ item.id } disabled={ item.disabled } className={ styles.node } >
                { renderTreeNodes(item.children) }
            </TreeNode>);
        }
        return <TreeNode { ...item } key={ item.id } title={ item.title } value={ item.id } />;
    });

    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles && roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.title = role.dataPlaceName;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }

    const save = (tip: number) => {
        if(form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true).list;
                if(value.length > 0) {
                    if(tip === 0) {
                        value = value.map((items: IData, index: number) => {
                            return {
                                ...items,
                                dataStatus: 0,
                                id: dataList[index].id
                            }
                        })
                    } else {
                        value = value.map((items: IData, index: number) => {
                            return {
                                ...items,
                                dataStatus: 1,
                                id: dataList[index].id
                            }
                        })
                    }
                    if(location.state.type === 'new') {
                        RequestUtil.post(`/tower-system/dataRecord`, value).then(res => {
                            history.goBack();
                        })
                    }else {
                        RequestUtil.put(`/tower-system/dataRecord/update`, value).then(res => {
                            history.goBack();
                        })
                    }
                } else {
                    message.warning('请先新增数据');
                }
            })
        }
    }

    const { loading, data } = useRequest<IDatabaseTree[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<IDatabaseTree[]>(`/tower-system/dataPlace`);
        if(location.state.type === 'edit') {
            setDataList(location.state.data);
        } else {
            setDataList([]);
        }
        resole(data)
    }), {});
    const databaseData: IDatabaseTree[] = data || [];
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return ( <DetailContent operation={ [
            <Space direction="horizontal" size="small" className={ styles.bottomBtn }>
                <Button type="primary" onClick={ () => save(0) }>保存</Button>
                <Button type="primary" onClick={ () => save(1) }>保存并入库</Button>
                <Button type="ghost" onClick={() => history.goBack()}>取消</Button>
            </Space>
        ] }>
            <DetailTitle title="证书信息" operation={[location.state.type === 'new' ? <Button type="primary" onClick={ addRow }>新增一行</Button> : <></>]}/>
            <Form form={ form }>
                <Table rowKey="id" dataSource={[...dataList]} pagination={false} columns={location.state.type === 'edit' ? tableColumns.splice(0, 5) : tableColumns} className={styles.addModal}/>
            </Form>
        </DetailContent>
    )
}