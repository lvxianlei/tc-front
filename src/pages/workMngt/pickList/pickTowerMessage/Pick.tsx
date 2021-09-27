import React, { useState } from 'react';
import { Space, Select, Button, Popconfirm, Input, Form, FormInstance } from 'antd';
import { Page } from '../../../common';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import styles from './Pick.module.less';
import { useHistory, useParams } from 'react-router-dom';

interface Column extends ColumnType<object> {
    editable?: boolean;
}

const formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();

const getForm = (): FormInstance | null => {
    return formRef?.current;
}

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
        key: 'projectName',
        title: '段名',
        width: 150,
        editable: true,
        dataIndex: 'projectName',
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "projectName"]} initialValue={ _ }>
                <Input size="small"/>
            </Form.Item>
        )
    },
    {
        key: 'projectNumber',
        title: '构件编号',
        dataIndex: 'projectNumber',
        width: 120,
        editable: true,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "projectNumber"]} initialValue={ _ }>
                <Input size="small"/>
            </Form.Item>
        )
    },
    { title: '材料名称', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '材质', dataIndex: 'amount', key: 'amount' },
    { title: '规格', dataIndex: 'unit', key: 'unit' },
    { title: '单基件数', dataIndex: 'unit', key: 'unit' },
    { title: '长度（mm）', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '宽度（mm）', dataIndex: 'amount', key: 'amount' },
    { title: '理算重量（kg）', dataIndex: 'unit', key: 'unit' },
    { title: '单件重量（kg）', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '小计重量（kg）', dataIndex: 'amount', key: 'amount' },
    { title: '备注', dataIndex: 'unit', key: 'unit' },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right' as FixedType,
        width: 100,
        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
            <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                <Popconfirm
                    title="确认删除?"
                    onConfirm={ () => {} }
                    okText="提交"
                    cancelText="取消"
                >
                    <Button type="link">删除</Button>
                </Popconfirm>
            </Space>
        )
    }
]

const columnsSetting: Column[] = columns.map((col: Column) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      render: undefined,
    }
})
export default function Lofting(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [ editorLock, setEditorLock ] = useState('编辑');
    const [ tableColumns, setColumns ] = useState(columnsSetting);
    return <Form ref={ formRef } className={ styles.descripForm }>
        <Page
            path="/tower-market/bidInfo"
            columns={ tableColumns }
            headTabs={ [] }
            tableProps={{ pagination: false }}
            extraOperation={ 
                <Space direction="horizontal" size="small">
                    <Button type="primary">导出</Button>
                    <Button type="primary">导入</Button>
                    <Button type="primary" onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/pick/${params.id}/drawApply`)}}>图纸塔型套用</Button>
                    <Button type="primary" onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/pick/${params.id}/setOutApply`)}}>放样塔型套用</Button>
                    <Popconfirm
                        title="确认完成提料?"
                        onConfirm={ () => {} }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="primary">完成提料</Button>
                    </Popconfirm>
                    <Button type="primary" ghost onClick={ () => { 
                        if(editorLock === '编辑') {
                            setColumns(columns);
                            setEditorLock('锁定');
                        } else {
                            setColumns(columnsSetting);
                            setEditorLock('编辑');
                        }
                        console.log(getForm()?.getFieldsValue(true)) 
                    } }>{ editorLock }</Button>
                    <Button type="primary" onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/pick/${params.id}/recognize`)}}>识别</Button>
                    <Button type="primary">返回上一级</Button>
                </Space>
            }
            searchFormItems={[
                {
                    name: 'startBidBuyEndTime',
                    label: '材料名称',
                    children: <Input />
                },
                {
                    name: 'startBidBuyEndTime',
                    label: '材质',
                    children: <Input />
                }
            ]}
        />
    </Form>
}