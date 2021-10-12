import React, { useState } from 'react';
import { Space, Select, Button, Popconfirm, Input, Form, FormInstance, message } from 'antd';
import { Page } from '../../../common';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import styles from './Pick.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../../utils/RequestUtil';

interface Column extends ColumnType<object> {
    editable?: boolean;
}
export default function Lofting(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, productSegmentId: string}>();
    const [ editorLock, setEditorLock ] = useState('编辑');
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
            key: 'segmentName',
            title: '段名',
            width: 150,
            editable: true,
            dataIndex: 'segmentName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "segmentName"]} initialValue={ _ }>
                    <Input size="small"/>
                </Form.Item>
            )
        },
        {
            key: 'code',
            title: '构件编号',
            dataIndex: 'code',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "code"]} initialValue={ _ }>
                    <Input size="small"/>
                </Form.Item>
            )
        },
        { title: '材料名称', dataIndex: 'materialName', key: 'materialName' },
        { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture' },
        { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec' },
        { title: '单基件数', dataIndex: 'basicsPartNum', key: 'basicsPartNum' },
        { title: '长度（mm）', dataIndex: 'length', key: 'length' },
        { title: '宽度（mm）', dataIndex: 'width', key: 'width' },
        { title: '理算重量（kg）', dataIndex: 'basicsTheoryWeight', key: 'basicsTheoryWeight' },
        { title: '单件重量（kg）', dataIndex: 'basicsWeight', key: 'basicsWeight' },
        { title: '小计重量（kg）', dataIndex: 'totalWeight', key: 'totalWeight' },
        { title: '备注', dataIndex: 'description', key: 'description' },
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
                        onConfirm={ async () => {
                            // await RequestUtil.get(`/tower-science/drawProductStructure?productSegmentId=${params.id}`)
                        } }
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
    const [ tableColumns, setColumns ] = useState(columnsSetting);

    return <Form ref={ formRef } className={ styles.descripForm }>
        <Page
            path="/tower-science/drawProductStructure"
            columns={ tableColumns }
            requestData={{productSegmentId:params.id}}
            headTabs={ [] }
            tableProps={{ pagination: false }}
            extraOperation={ 
                <Space direction="horizontal" size="small">
                    <Button type="primary">导出</Button>
                    <Button type="primary">导入</Button>
                    <Button type="primary" onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/pick/${params.productSegmentId}/drawApply`)}}>图纸塔型套用</Button>
                    <Button type="primary" onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/pick/${params.productSegmentId}/setOutApply`)}}>放样塔型套用</Button>
                    <Popconfirm
                        title="确认完成提料?"
                        onConfirm={ async () => {
                            await RequestUtil.post(`/tower-science/drawProductSegment/completedLofting`,{productSegmentId:params.productSegmentId}).then(()=>{
                                message.success('提料成功！')
                            })
                        } }
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
                    <Button type="primary" onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/pick/${params.productSegmentId}/recognize`)}}>识别</Button>
                    <Button type="primary" onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}`)}}>返回上一级</Button>
                </Space>
            }
            searchFormItems={[
                {
                    name: 'materialName',
                    label: '材料名称',
                    children: <Input />
                    // <Select>
                    //                 { materialStandardOptions && materialStandardOptions.map(({ id, name }, index) => {
                    //                     return <Select.Option key={ index } value={ id }>
                    //                         { name }
                    //                     </Select.Option>
                    //                 }) }
                    //             </Select>
                },
                {
                    name: 'structureTexture',
                    label: '材质',
                    children: <Input />
                }
            ]}
        />
    </Form>
}