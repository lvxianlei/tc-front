import React, { useState } from 'react';
import { Space, Select, Button, Popconfirm, Input, Form, FormInstance, message, InputNumber, Upload, Modal, TablePaginationConfig, Table } from 'antd';
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
    const [ tipVisible, setTipVisible ] = useState<boolean>(false);
    const [ addVisible, setAddVisible ] = useState<boolean>(false);
    const [ url, setUrl ] = useState<string>('');
    const [ filterValue, setFilterValue ] = useState({});
    const [ editorLock, setEditorLock ] = useState('编辑');
    const [ form ] = Form.useForm();
    const [ tableDataSource, setTableDataSource ] = useState<any[]>([])
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
            title: '段号',
            width: 150,
            editable: true,
            dataIndex: 'segmentName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{record.segmentName}</span>
            )
        },
        {
            key: 'patternName',
            title: '模式',
            width: 150,
            editable: true,
            dataIndex: 'patternName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{record.patternName}</span>
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
        // { 
        //     title: '宽度（mm）', 
        //     dataIndex: 'width', 
        //     key: 'width' ,
        //     width: 120,
        //     editable: true,
        //     render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
        //         <Form.Item name={['data',index, "width"]} initialValue={ _===-1?0:_}>
        //             <InputNumber size="small" precision={2} min={0} onChange={ () => rowChange(index) }/>
        //         </Form.Item>
        //     )
        // },
        // { 
        //     title: '厚度（mm）', 
        //     dataIndex: 'thickness', 
        //     key: 'thickness', 
        //     editable: true,
        //     width: 120,
        //     render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
        //         <Form.Item name={['data',index, "thickness"]} initialValue={ _===-1?0:_}>
        //             <InputNumber size="small" precision={2} min={0} onChange={ () => rowChange(index) }/>
        //         </Form.Item>
        //     ) 
        // },
      
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
        // const red: number = record.redColumn.indexOf(dataIndex);
        // if(red !== -1) {
        //     return 'red';
        // } else {
        //     return 'normal'
        // }
        if( ([-1,0,'-1','0'].indexOf(record.length))!== -1){
            return 'red'
        }else{
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
                            <p>{(record.basicsWeight&&record.basicsWeight!==-1?record.basicsWeight:0)*(record.basicsPartNum&&record.basicsPartNum!==-1?record.basicsPartNum:0)}</p>
                        )
                    }
                }else if(col.dataIndex==='length'){
                    return {
                        ...col,
                        render:(_: number, record: Record<string, any>, index: number): React.ReactNode => (
                            <p className={ checkColor(record, col.dataIndex) === 'red' ? styles.red :  ''}>{_===-1?0:_}</p>
                        )
                    }
                }else {
                    return {
                        ...col,
                        render:(_: number, record: Record<string, any>, index: number): React.ReactNode => (
                            <p >{_===-1?0:_}</p>
                        )
                    }
                }
            }
            else return {
                ...col,
                render:(_: any, record: Record<string, any>, index: number): React.ReactNode => (
                    <p>{ _ }</p>
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
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<any[]>([]);
    const [ rowChangeList, setRowChangeList ] = useState<number[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
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
                tableProps={{
                    pagination: false,
                    rowSelection: {
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }
                }}
                extraOperation={ 
                    <Space direction="horizontal" size="small">
                        {/* <Button type="primary" ghost>导出</Button> */}
                        <Button type="primary" ghost onClick={ () => downloadTemplate('/tower-science/drawProductStructure/exportTemplate', '构建明细') }>模板下载</Button>
                        <Button type="primary" ghost  onClick={()=>{ setTipVisible(true) }}>提示说明</Button>
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
                        <Button type="primary" ghost  onClick={()=>{
                            setAddVisible(true)
                        }}>添加</Button>
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
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={ () => { 
                                if(selectedKeys.length > 0) {
                                    // RequestUtil.delete(`/tower-science/productStructure?productStructureId=${ record.id }`).then(res => {
                                    //     message.success('删除成功');
                                    //     history.go(0);
                                    // }) 
                                } else {
                                    message.warning('请选择要删除的数据')
                                }
                                    
                            }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="primary" ghost>删除</Button>
                        </Popconfirm>
                        <Button type="primary" ghost onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}`)}}>返回上一级</Button>
                    </Space>
                }
                searchFormItems={[]}
            />
    </Form>
    <Modal title='提示' visible={tipVisible} footer={false} onCancel={()=>{
        setTipVisible(false)
    }}>
        <Table
            columns={[
                { title: '构件编号', dataIndex: 'code', key: 'code' },
                { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture' },
                { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec' },
                { title: '长度（mm）', dataIndex: 'length', key: 'length' },
                { title: '单件重量（kg）', dataIndex: 'basicsWeight', key: 'basicsWeight' },
                { title: '小计重量（kg）', dataIndex: 'totalWeight', key: 'totalWeight' },
            ]}
            pagination={false}
            dataSource={[{
                code:"件号不连续时",
                structureTexture:"原材料管理中没有时",
                structureSpec:"原材料管理中没有时",
                length:"为0时",
                basicsWeight:"单重与理算重差距≥1时",
                totalWeight:"单重*数量≠小计"
            }]}
        />
    </Modal>
    <Modal title='添加' visible={addVisible} onCancel={()=>{
        setAddVisible(false);
        setTableDataSource([]);
    }} width={1200} onOk={
        ()=>{
            const values = form.getFieldsValue(true).data.map((item:any)=>{
                return {
                    ...item,
                    productCategory: params.id
                }
            })
            RequestUtil.post(`/tower-science/drawProductStructure/submit?productCategoryId=${params.id}`, [ ...values ]).then(res => {
                setAddVisible(false);
                setTableDataSource([]);
                message.success('添加成功！')
                setRefresh(!refresh);    
            });
        }
    }>
        <Form form={form}>
            <Button onClick={()=>{
                tableDataSource.push([{}])
                setTableDataSource([...tableDataSource])
            }} type='primary' ghost>添加一行</Button>
            <Table
                columns={[
                    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                    { title: '段号', dataIndex: 'segmentName', key: 'segmentName', render:(_a: any, _b: any, index: number): React.ReactNode =>(
                        <Form.Item>
                            <Input size="small"/>
                        </Form.Item>
                    )},
                    { title: '构件编号', dataIndex: 'code', key: 'code',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['data',index, "code"]} initialValue={ _ }>
                            <Input size="small"/>
                        </Form.Item>
                    ) },
                    { title: '材料名称', dataIndex: 'materialName', key: 'materialName',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['data',index, "materialName"]} initialValue={ _ }>
                            <Input size="small" />
                        </Form.Item>
                    ) },
                    { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['data',index, "structureTexture"]} initialValue={ _ }>
                            <Input size="small" />
                        </Form.Item>
                    ) },
                    { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec', render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['data',index, "structureSpec"]} initialValue={ _ }>
                            <Input size="small" />
                        </Form.Item>
                    ) },
                    { title: '长度（mm）', dataIndex: 'length', key: 'length',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['data',index, "length"]} initialValue={ _ }>
                            <Input size="small" />
                        </Form.Item>
                    ) },
                    { title: '单段件数', dataIndex: 'basicsPartNum', key: 'basicsPartNum',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['data',index, "basicsPartNum"]} initialValue={ _ }>
                            <Input size="small"/>
                        </Form.Item>
                    ) },
                    { title: '单件重量（kg）', dataIndex: 'basicsWeight', key: 'basicsWeight',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['data',index, "basicsWeight"]} initialValue={ _ }>
                            <Input size="small" />
                        </Form.Item>
                    ) },
                    { title: '小计重量（kg）', dataIndex: 'totalWeight', key: 'totalWeight',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['data',index, "totalWeight"]} initialValue={ _ }>
                            <Input size="small" />
                        </Form.Item>
                    ) },
                    { title: '备注', dataIndex: 'description', key: 'description',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['data',index, "description"]} initialValue={ _ }>
                            <TextArea showCount rows={1} />
                        </Form.Item>
                    ) },
                    { title: '操作', key:'operation', render:(_a: any, _b: any, index: number): React.ReactNode =>(
                        <Button type='link' onClick={()=>{
                            tableDataSource&&tableDataSource.splice(index,1);
                            tableDataSource&&setTableDataSource([...tableDataSource])
                        }}>删除</Button>
                    )}
                ]}
                pagination={false}
                dataSource={[...tableDataSource]}
            />
        </Form>
    </Modal>
    </>
}