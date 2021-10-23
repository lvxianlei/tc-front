import React, { useState } from 'react';
import { Space, Select, Button, Popconfirm, Input, Form, FormInstance, message, InputNumber, Upload } from 'antd';
import { Page } from '../../../common';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import styles from './Pick.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { Console } from 'node:console';
import AuthUtil from '../../../../utils/AuthUtil';
import { downloadTemplate } from '../../setOut/downloadTemplate';

interface Column extends ColumnType<object> {
    editable?: boolean;
}
export default function Lofting(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, productSegmentId: string}>();
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});
    const [ editorLock, setEditorLock ] = useState('编辑');
    const formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    const getForm = (): FormInstance | null => {
        return formRef?.current;
    }

    const columns = [
        {
            key: 'id',
            title: '序号',
            dataIndex: 'id',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<><span>{ index + 1 }</span><Form.Item name={['data',index, "id"]} initialValue={ _ } style={{ display: "none" }}>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item></>)
        },
        {
            key: 'segmentName',
            title: '段名',
            width: 150,
            editable: true,
            dataIndex: 'segmentName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "segmentName"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item>
            )
        },
        { 
            title: '材料名称', 
            dataIndex: 'materialName', 
            key: 'materialName',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "materialName"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item>
            ) 
        },
        { 
            title: '材质', 
            dataIndex: 'structureTexture', 
            key: 'structureTexture',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "structureTexture"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item>
            ) 
        },
        { 
            title: '规格', 
            dataIndex: 'structureSpec', 
            key: 'structureSpec',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "structureSpec"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item>
            ) 
        },
        { 
            title: '单基件数', 
            dataIndex: 'basicsPartNum',
             key: 'basicsPartNum',
             width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "code"]} initialValue={ _ }>
                    <InputNumber size="small" precision={0} onChange={ () => rowChange(index) }/>
                </Form.Item>
            ) 
        },
        { 
            title: '长度（mm）', 
            dataIndex: 'length', 
            key: 'length',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "length"]} initialValue={ _ }>
                    <InputNumber size="small" precision={2} min={0} onChange={ () => rowChange(index) }/>
                </Form.Item>
            ) 
        },
        { 
            title: '宽度（mm）', 
            dataIndex: 'width', 
            key: 'width' ,
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "width"]} initialValue={ _ }>
                    <InputNumber size="small" precision={2} min={0} onChange={ () => rowChange(index) }/>
                </Form.Item>
            )
        },
        { 
            title: '理算重量（kg）', 
            dataIndex: 'basicsTheoryWeight', 
            key: 'basicsTheoryWeight',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "basicsTheoryWeight"]} initialValue={ _ }>
                    <InputNumber size="small" precision={2} min={0} onChange={ () => rowChange(index) }/>
                </Form.Item>
            ) 
        },
        { 
            title: '单件重量（kg）', 
            dataIndex: 'basicsWeight', 
            key: 'basicsWeight' ,
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "basicsWeight"]} initialValue={ _ }>
                    <InputNumber size="small" precision={2} min={0} onChange={ () => rowChange(index) }/>
                </Form.Item>
            ) 
        },
        { 
            title: '小计重量（kg）', 
            dataIndex: 'totalWeight', 
            key: 'totalWeight',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "totalWeight"]} initialValue={ _ }>
                    <InputNumber size="small" precision={2} min={0} onChange={ () => rowChange(index) }/>
                </Form.Item>
            ) 
        },
        {
            title: '备注', 
            dataIndex: 'description', 
            key: 'description',
            width: 230,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "description"]} initialValue={ _ }>
                    <TextArea size="small" rows={1} showCount maxLength={300} onChange={ () => rowChange(index) }/>
                </Form.Item>
            ) 
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            editable: true,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Button type="link" disabled>删除</Button>
            )
        }
    ]

    const columnsSetting: Column[] = columns.map((col: Column) => {
        if (!col.editable) {
            return col;
        }
        if(col.dataIndex === 'operation') {
            return {
                ...col,
                render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={ async () => await RequestUtil.delete(`/tower-science/drawProductStructure/${record.id}`).then(()=>{
                                message.success('删除成功！')
                            }).then(()=>{
                                setRefresh(!refresh)
                            }) }
                            okText="提交"
                            cancelText="取消"
                        >
                            <Button type="link">删除</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        } else {
            return {
                ...col,
                render: undefined,
            }
        }
    })
    const [ tableColumns, setColumns ] = useState(columnsSetting);
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    const rowChange = (index: number) => {
        rowChangeList.push(index);
        setRowChangeList([...rowChangeList]);    
    }
    const [ rowChangeList, setRowChangeList ] = useState<number[]>([]);
    return <Form ref={ formRef } className={ styles.descripForm }>
        <Page
            path="/tower-science/drawProductStructure"
            columns={ tableColumns }
            requestData={{productSegmentId:params.productSegmentId}}
            headTabs={ [] }
            onFilterSubmit={onFilterSubmit}
            filterValue={ filterValue }
            refresh={ refresh }
            tableProps={{ pagination: false }}
            extraOperation={ 
                <Space direction="horizontal" size="small">
                    <Button type="primary" ghost>导出</Button>
                    <Button type="primary" ghost onClick={ () => downloadTemplate('/tower-science/drawProductStructure/exportTemplate', '构建明细') }>模板下载</Button>
                    <Upload 
                        accept=".xls,.xlsx"
                        action={ () => {
                            const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                            return baseUrl+'/tower-science/drawProductStructure/import'
                        } } 
                        headers={
                            {
                                'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                                'Tenant-Id': AuthUtil.getTenantId(),
                                'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                            }
                        }
                        data={ { productSegmentId: params.productSegmentId } }
                        showUploadList={ false }
                        onChange={ (info) => {
                            if(info.file.response && !info.file.response?.success) {
                                message.warning(info.file.response?.msg)
                            }else if(info.file.response && info.file.response?.success){
                                message.success('导入成功！');
                                setRefresh(!refresh);
                            }
                            
                        } }
                    >
                        <Button type="primary" ghost>导入</Button>
                    </Upload>
                    <Button type="primary" ghost  onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/pick/${params.productSegmentId}/drawApply`)}}>图纸塔型套用</Button>
                    <Button type="primary" ghost onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/pick/${params.productSegmentId}/setOutApply`)}}>放样塔型套用</Button>
                    <Popconfirm
                        title="确认完成提料?"
                        onConfirm={ async () => {
                            await RequestUtil.post(`/tower-science/drawProductSegment/completedLofting?productSegmentId=${params.productSegmentId}`).then(()=>{
                                message.success('提料成功！')
                            }).then(()=>{
                                history.push(`/workMngt/pickList/pickTowerMessage/${params.id}`)
                            })
                        } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="primary" ghost>完成提料</Button>
                    </Popconfirm>
                    <Button type="primary" ghost onClick={ () => { 
                        if(editorLock === '编辑') {
                            setColumns(columns);
                            setEditorLock('锁定');
                        } else {
                            const newRowChangeList: number[] = Array.from(new Set(rowChangeList));
                            console.log(rowChangeList)
                            console.log(newRowChangeList)
                            let values = getForm()?.getFieldsValue(true).data;
                            if(values) {
                                let changeValues = values.filter((item: any, index: number) => {
                                    return newRowChangeList.indexOf(index) !== -1;
                                })
                                RequestUtil.post(`/tower-science/drawProductStructure/submit?productCategoryId=${params.id}`, [ ...changeValues ]).then(res => {
                                    setColumns(columnsSetting);
                                    setEditorLock('编辑');
                                    setRowChangeList([]);
                                    setRefresh(!refresh);    
                                });
                            }
                            
                        }
                        console.log(getForm()?.getFieldsValue(true)) 
                    } }>{ editorLock }</Button>
                    <Button type="primary" ghost onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/pick/${params.productSegmentId}/recognize`)}}>识别</Button>
                    <Button type="primary" ghost onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}`)}}>返回上一级</Button>
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