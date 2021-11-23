import React, { useState } from 'react';
import { Space, Select, Button, Popconfirm, Input, Form, FormInstance, message, InputNumber, Upload, Modal, TablePaginationConfig } from 'antd';
import { Page } from '../../../common';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import styles from './Pick.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
// import { Console } from 'node:console';
import AuthUtil from '../../../../utils/AuthUtil';
import { downloadTemplate } from '../../setOut/downloadTemplate';
interface Column extends ColumnType<object> {
    editable?: boolean;
}
export default function Lofting(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, productSegmentId: string, status: string}>();
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ visible, setVisible ] = useState<boolean>(false);
    const [ url, setUrl ] = useState<string>('');
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
                <span>{record.segmentName}</span>
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
            title: '单段件数', 
            dataIndex: 'basicsPartNum',
             key: 'basicsPartNum',
             width: 120,
            editable: true,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "basicsPartNum"]} initialValue={_===-1?0:_}>
                    <InputNumber size="small" precision={0}  min={0} onChange={ () => rowChange(index) }/>
                </Form.Item>
            ) 
        },
        { 
            title: '长度（mm）', 
            dataIndex: 'length', 
            key: 'length',
            width: 120,
            editable: true,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "length"]} initialValue={ _===-1?0:_}>
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
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "width"]} initialValue={ _===-1?0:_}>
                    <InputNumber size="small" precision={2} min={0} onChange={ () => rowChange(index) }/>
                </Form.Item>
            )
        },
        { 
            title: '厚度（mm）', 
            dataIndex: 'thickness', 
            key: 'thickness', 
            editable: true,
            width: 120,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "thickness"]} initialValue={ _===-1?0:_}>
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
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <span>锁定后，系统自动计算</span>
            ) 
        },
        { 
            title: '单件重量（kg）', 
            dataIndex: 'basicsWeight', 
            key: 'basicsWeight' ,
            width: 120,
            editable: true,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "basicsWeight"]} initialValue={ _===-1?0:_}>
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
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <span>锁定后，系统自动计算</span>
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
        }
        
    ];
    const checkColor = (record: Record<string, any>, dataIndex: string) => {
        const red: number = record.redColumn.indexOf(dataIndex);
        if(red !== -1) {
            return 'red';
        } else {
            return 'normal'
        }
    }

    const columnsSetting: Column[] = columns.map((col: any) => {
        if (!col.editable) {
            return col;
        }
        if(col.dataIndex === 'operation') {
            return {
                ...col,
                // render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                //     <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                //         <Popconfirm
                //             title="确认删除?"
                //             onConfirm={ async () => await RequestUtil.delete(`/tower-science/drawProductStructure/${record.id}`).then(()=>{
                //                 message.success('删除成功！');
                //                 setColumns(columnsSetting);
                //                 setRefresh(!refresh);
                //             })}
                //             okText="提交"
                //             cancelText="取消"
                //         >
                //             <Button type="link">删除</Button>
                //         </Popconfirm>
                //     </Space>
                // )
            }
        } else {
            if(['basicsPartNum','length','width','basicsTheoryWeight','basicsWeight','totalWeight'].includes(col.dataIndex as string)){
                if(col.dataIndex==='totalWeight'){
                    return {
                        ...col,
                        render:(_: number, record: Record<string, any>, index: number): React.ReactNode => (
                            <p className={ checkColor(record, col.dataIndex) === 'red' ? styles.red :  ''}>{(record.basicsWeight&&record.basicsWeight!==-1?record.basicsWeight:0)*(record.basicsPartNum&&record.basicsPartNum!==-1?record.basicsPartNum:0)}</p>
                        )
                    }
                }else{
                    return {
                        ...col,
                        render:(_: number, record: Record<string, any>, index: number): React.ReactNode => (
                            <p  className={ checkColor(record, col.dataIndex) === 'red' ? styles.red :  ''}>{_===-1?0:_}</p>
                        )
                    }
                }
            }
            else return {
                ...col,
                render:(_: any, record: Record<string, any>, index: number): React.ReactNode => (
                    <p className={ checkColor(record, col.dataIndex) === 'red' ? styles.red :  '' }>{ _ }</p>
                )
            }
        }
    })
    const [ tableColumns, setColumns ] = useState(columnsSetting);
    const onFilterSubmit = (value: any) => {
        console.log(value)
        setFilterValue(value)
        // return value
        setRefresh(!refresh);
    }
    const rowChange = (index: number) => {
        rowChangeList.push(index);
        setRowChangeList([...rowChangeList]);    
    }
    const [ rowChangeList, setRowChangeList ] = useState<number[]>([]);
    return <>
        <Form layout="inline" style={{margin:'20px'}} onFinish={onFilterSubmit}>
            <Form.Item label='材料名称' name='materialName'>
                <Input/>
            </Form.Item>
            <Form.Item label='材质' name='structureTexture'>
                <Input/>
            </Form.Item>
            <Form.Item label='段号' name='partName'>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">查询</Button>
            </Form.Item>
            <Form.Item>
                <Button htmlType="reset">重置</Button>
            </Form.Item>
        </Form>
        <Form ref={ formRef } className={ styles.descripForm }>
            <Modal 
                visible={visible} 
                onOk={()=>{
                    window.open(url);
                    setVisible(false);
                }} 
                onCancel={()=>{setVisible(false);setUrl('')}} 
                title='提示' 
                okText='下载'
            >
                当前存在错误数据，请重新下载上传！
            </Modal>
        
            <Page
                path="/tower-science/drawProductStructure"
                columns={ [...tableColumns,{
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: 'right' as FixedType,
                    width: 100,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                            <Popconfirm
                                title="确认删除?"
                                onConfirm={ async () => await RequestUtil.delete(`/tower-science/drawProductStructure/${record.id}`).then(()=>{
                                    message.success('删除成功！');
                                    setRefresh(!refresh);
                                })}
                                okText="提交"
                                cancelText="取消"
                                disabled={editorLock==='锁定'}
                            >
                                <Button type="link" disabled={editorLock==='锁定'}>删除</Button>
                            </Popconfirm>
                        </Space>
                    )
                }] }
                requestData={{productSegmentId:params.productSegmentId,...filterValue}}
                headTabs={ [] }
                // onFilterSubmit={onFilterSubmit}
                filterValue={ filterValue }
                refresh={ refresh }
                tableProps={{ pagination: false, rowKey:'id'}}
                extraOperation={ 
                    <Space direction="horizontal" size="small">
                        {/* <Button type="primary" ghost>导出</Button> */}
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
                                    if(Object.keys(info.file.response?.data).length > 0){
                                        setUrl(info.file.response?.data);
                                        setVisible(true);
                                    }else{
                                        message.success('导入成功！');
                                        setRefresh(!refresh);
                                    }
                                    
                                }
                                
                            } }
                        >
                            <Button type="primary" ghost>导入</Button>
                        </Upload>
                        <Button type="primary" ghost  onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/pick/${params.productSegmentId}/add`)}}>添加</Button>
                        <Button type="primary" ghost  onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/pick/${params.productSegmentId}/drawApply`)}}>图纸塔型套用</Button>
                        <Button type="primary" ghost onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/pick/${params.productSegmentId}/setOutApply`)}}>放样塔型套用</Button>
                        <Popconfirm
                            title="确认完成提料?"
                            onConfirm={ async () => {
                                await RequestUtil.post(`/tower-science/drawProductSegment/completedLofting?productSegmentId=${params.productSegmentId}`).then(()=>{
                                    message.success('提料成功！')
                                }).then(()=>{
                                    history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}`)
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
                                let values = getForm()?.getFieldsValue(true).data;
                                if(values) {
                                    let changeValues = values.filter((item: any, index: number) => {
                                        return newRowChangeList.indexOf(index) !== -1;
                                    }).map((item:any)=>{
                                        return {
                                            ...item,
                                            productCategory: params.id
                                        }
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
                        <Button type="primary" ghost onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/pick/${params.productSegmentId}/recognize`)}}>识别</Button>
                        <Button type="primary" ghost onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}`)}}>返回上一级</Button>
                    </Space>
                }
                searchFormItems={[
                    // {
                    //     name: 'materialName',
                    //     label: '材料名称',
                    //     children: <Input />
                    //     // <Select>
                    //     //                 { materialStandardOptions && materialStandardOptions.map(({ id, name }, index) => {
                    //     //                     return <Select.Option key={ index } value={ id }>
                    //     //                         { name }
                    //     //                     </Select.Option>
                    //     //                 }) }
                    //     //             </Select>
                    // },
                    // {
                    //     name: 'structureTexture',
                    //     label: '材质',
                    //     children: <Input />
                    // }
                ]}
            />
    </Form></>
}