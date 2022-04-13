import React, { useState } from 'react';
import { Space, Select, Button, Popconfirm, Input, Form, FormInstance, message, InputNumber, Upload, Modal, TablePaginationConfig, Table } from 'antd';
import { Page } from '../../../common';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import styles from './Pick.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import AuthUtil from '../../../../utils/AuthUtil';
import { downloadTemplate } from '../../setOut/downloadTemplate';
import { patternTypeOptions } from '../../../../configuration/DictionaryOptions';
import useRequest from '@ahooksjs/use-request';
interface Column extends ColumnType<object> {
    editable?: boolean;
}
export default function Lofting(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ 
        id: string, 
        productSegmentId: string, 
        status: string, 
        materialLeader: string
    }>();
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ visible, setVisible ] = useState<boolean>(false);
    const [ tipVisible, setTipVisible ] = useState<boolean>(false);
    const [ addVisible, setAddVisible ] = useState<boolean>(false);
    const [ url, setUrl ] = useState<string>('');
    const [ filterValue, setFilterValue ] = useState({});
    const [ editorLock, setEditorLock ] = useState('编辑');
    const [ form ] = Form.useForm();
    const [ formRef ] = Form.useForm();
    const [ tableDataSource, setTableDataSource ] = useState<any[]>([])
    // const formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    // const getForm = (): FormInstance | null => {
    //     return formRef?.current;
    // }
    // const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => { 
    //     const data: [] = await RequestUtil.get(`/tower-science/drawProductSegment/getSegmentBySegmentGroupId`,{segmentGroupId:params.productSegmentId});
    //     resole(data);
    // }), {})
    // const paragraphList: [] = data || [];
    const columns = [
        {
            key: 'id',
            title: '序号',
            dataIndex: 'id',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <>
                    <span>{ index + 1 }</span>
                    <Form.Item 
                        name={['data',index, "id"]} 
                        initialValue={ _ } 
                        style={{ display: "none" }}
                    >
                        <Input 
                            size="small" 
                            onChange={ () => rowChange(index) }
                        />
                    </Form.Item>
                </>
            )
        },
        {
            key: 'segmentName',
            title: '段号',
            width: 150,
            editable: true,
            dataIndex: 'segmentName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item 
                    name={['data',index, "segmentName"]} 
                    initialValue={ record.segmentName }
                    rules={[{
                        required: true,
                        message:'请输入段号'
                    },{
                        pattern: /^[0-9a-zA-Z-]*$/,
                        message: '仅可输入数字/字母/-',
                    }]}
                >
                    {/* <Select onChange={ () => rowChange(index) }>
                        { paragraphList.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.id }>{ item.segmentName }</Select.Option>
                        }) }
                    </Select> */}
                    <Input size="small" onChange={ () => rowChange(index) } maxLength={10}/>
                </Form.Item>
            )
        },
        // {
        //     key: 'patternName',
        //     title: '模式',
        //     width: 150,
        //     editable: true,
        //     dataIndex: 'patternName',
        //     render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
        //         <Form.Item 
        //             name={['data',index, "pattern"]} 
        //             initialValue={ record.pattern }
        //         >
        //            <Select onChange={ () => rowChange(index) }>
        //                 { patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
        //                     return <Select.Option key={ index } value={ id  }>
        //                         { name }
        //                     </Select.Option>
        //                 }) }
        //             </Select>
        //         </Form.Item>
        //     )
        // },
        {
            key: 'code',
            title: '构件编号',
            dataIndex: 'code',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item 
                    name={['data',index, "code"]} 
                    initialValue={ _ }
                    rules={[{
                        required: true,
                        message:'请输入构件编号'
                    },{
                        pattern: /^[0-9a-zA-Z-]*$/,
                        message: '仅可输入数字/字母/-',
                    }]}
                >
                    <Input size="small" onChange={ () => rowChange(index) } maxLength={10}/>
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
                <Form.Item 
                    name={['data',index, "materialName"]} 
                    initialValue={ _ }
                    rules={[{
                        required: true,
                        message:'请输入材料名称'
                    },{
                        pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]*$/,
                        message: '仅可输入汉字/数字/字母',
                    }]}
                >
                    <Input size="small" onChange={ () => rowChange(index) } maxLength={10}/>
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
                <Form.Item 
                    name={['data',index, "structureTexture"]} 
                    initialValue={ _ }
                    rules={[{
                        required: true,
                        message:'请输入材质'
                    },{
                        pattern: /^[0-9a-zA-Z-]*$/,
                        message: '仅可输入数字/字母/-',
                    }]}
                >
                    <Input size="small" onChange={ () => rowChange(index) } maxLength={10}/>
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
                <Form.Item 
                    name={['data',index, "structureSpec"]} 
                    initialValue={ _ }
                    rules={[{
                        required: true,
                        message:'请输入规格'
                    },{
                        pattern: /^[0-9-*L∠]*$/,
                        message: '仅可输入数字/-/*/L/∠',
                    }]}
                >
                    <Input size="small" onChange={ () => rowChange(index) } maxLength={10}/>
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
                <Form.Item 
                    name={['data',index, "length"]} 
                    initialValue={ _ }
                    rules={[{
                        required: true,
                        message:'请输入长度'
                    }]}
                >
                    <InputNumber 
                        size="small" 
                        min={1} precision={0} max={999999}
                        onChange={ () => rowChange(index) }
                    />
                </Form.Item>
            ) 
        },
        { 
            title: '宽度（mm）', 
            dataIndex: 'width', 
            key: 'width',
            width: 120,
            editable: true,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item 
                    name={['data',index, "width"]} 
                    initialValue={ _ }
                >
                    <InputNumber 
                        size="small" 
                        min={1} precision={0} max={999999}
                        onChange={ () => rowChange(index) }
                    />
                </Form.Item>
            ) 
        },
        { 
            title: '厚度（mm）', 
            dataIndex: 'thickness', 
            key: 'thickness',
            width: 120,
            editable: true,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item 
                    name={['data',index, "thickness"]} 
                    initialValue={ _ }
                >
                    <InputNumber 
                        size="small" 
                        min={1} precision={0} max={999999}
                        onChange={ () => rowChange(index) }
                    />
                </Form.Item>
            ) 
        },
        { 
            title: '大头', 
            dataIndex: 'big', 
            key: 'big',
            width: 120,
            editable: true,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item 
                    name={['data',index, "big"]} 
                    initialValue={ _ }
                >
                    <InputNumber 
                        size="small" 
                        precision={0} max={999999}
                        onChange={ () => rowChange(index) }
                    />
                </Form.Item>
            ) 
        },
        { 
            title: '小头', 
            dataIndex: 'small', 
            key: 'small',
            width: 120,
            editable: true,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item 
                    name={['data',index, "small"]} 
                    initialValue={ _ }
                >
                    <InputNumber 
                        size="small" 
                        precision={0} max={999999}
                        onChange={ () => rowChange(index) }
                    />
                </Form.Item>
            ) 
        },
        { 
            title: '单件重量（kg）', 
            dataIndex: 'basicsWeight', 
            key: 'basicsWeight' ,
            width: 120,
            editable: true,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item 
                    name={['data',index, "basicsWeight"]} 
                    initialValue={ _===-1?0:_}
                    rules={[{
                        required: true,
                        message:'请输入单件重量'
                    }]}
                >
                    <InputNumber 
                        size="small" 
                        min={0} precision={2} max={9999.99}
                        onChange={ () => rowChange(index) }
                    />
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
                <Form.Item 
                    name={['data',index, "basicsPartNum"]} 
                    initialValue={_===-1?0:_}
                    rules={[{
                        required: true,
                        message:'请输入单段件数'
                    }]}
                >
                    <InputNumber 
                        size="small" 
                        precision={0}  
                        min={1}
                        max={99} 
                        onChange={ () => rowChange(index) }
                    />
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
                <Form.Item 
                    name={['data',index, "description"]} 
                    initialValue={ _ }
                >
                    <TextArea 
                        size="small" 
                        rows={1} 
                        showCount 
                        maxLength={300} 
                        onChange={ () => rowChange(index) }
                    />
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
            }
        } else {
            if(['basicsPartNum','length','width','basicsTheoryWeight','basicsWeight','totalWeight'].includes(col.dataIndex as string)){
                if(col.dataIndex==='totalWeight'){
                    return {
                        ...col,
                        render:(_: number, record: Record<string, any>, index: number): React.ReactNode => (
                            <p className={ checkColor(record, col.dataIndex) === 'red' ? styles.red :  ''}>{parseFloat(`${(record.basicsWeight&&record.basicsWeight!==-1?record.basicsWeight:0)*(record.basicsPartNum&&record.basicsPartNum!==-1?record.basicsPartNum:0)}`).toFixed(2)}</p>
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
                            <p className={ checkColor(record, col.dataIndex) === 'red' ? styles.red :  ''}>{_===-1?0:_}</p>
                        )
                    }
                }
            }
            else return {
                ...col,
                render:(_: number, record: Record<string, any>, index: number): React.ReactNode => (
                    <p className={ checkColor(record, col.dataIndex) === 'red' ? styles.red :  ''}>{_===-1?0:_}</p>
                )
            }
        }
    })
    const [ tableColumns, setColumns ] = useState(columnsSetting);
    const onFilterSubmit = (value: any) => {
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
        <Form 
            layout="inline" 
            style={{margin:'20px'}} 
            onFinish={ onFilterSubmit }
        >
            <Form.Item label='材料名称' name='materialName'>
                <Input/>
            </Form.Item>
            <Form.Item label='材质' name='structureTexture'>
                <Input/>
            </Form.Item>
            <Form.Item label='段号' name='segmentName'>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">查询</Button>
            </Form.Item>
            <Form.Item>
                <Button htmlType="reset">重置</Button>
            </Form.Item>
        </Form>
        <Form 
            form={ formRef } 
            className={ styles.descripForm }
        >
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
                exportPath="/tower-science/drawProductStructure"
                columns={ [...tableColumns,{
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: 'right' as FixedType,
                    width: 100,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <div className={ styles.operationBtn }>
                            <Popconfirm
                                title="确认删除?"
                                onConfirm={ async () => await RequestUtil.delete(`/tower-science/drawProductStructure?ids=${ record.id }`).then(()=>{
                                    message.success('删除成功！');
                                    setRefresh(!refresh);
                                })}
                                okText="提交"
                                cancelText="取消"
                                disabled={editorLock==='锁定'}
                            >
                                <Button type="link" disabled={editorLock==='锁定'}>删除</Button>
                            </Popconfirm>
                        </div>
                    )
                }] }
                requestData={{
                    segmentGroupId: params.productSegmentId,
                    ...filterValue
                }}
                headTabs={ [] }
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
                                    if(info.file.response?.data){
                                        setUrl(info.file.response?.data);
                                        setVisible(true);
                                    }else{
                                        message.success('导入成功！');
                                        setRefresh(!refresh);
                                    }
                                }
                            } }
                        >
                            <Button type="primary" ghost disabled={ editorLock==='锁定' }>导入</Button>
                        </Upload>
                        <Button type="primary" ghost  onClick={()=>{
                            setAddVisible(true)
                        }} disabled={ editorLock==='锁定' }>添加</Button>
                        <Button type="primary" ghost  onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${params.productSegmentId}/drawApply`)}}>图纸塔型套用</Button>
                        <Button type="primary" ghost onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${params.productSegmentId}/setOutApply`)}}>放样塔型套用</Button>
                        <Popconfirm
                            title="确认完成提料?"
                            onConfirm={ async () => {
                                await RequestUtil.post(`/tower-science/drawProductSegment/completedLofting?segmentGroupId=${params.productSegmentId}`).then(()=>{
                                    message.success('提料成功！')
                                }).then(()=>{
                                    history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}`)
                                })
                            } }
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="primary" ghost>完成提料</Button>
                        </Popconfirm>
                        <Button type="primary" ghost onClick={ async () => { 
                            if(editorLock === '编辑') {
                                setColumns(columns);
                                setEditorLock('锁定');
                            } else {
                                const newRowChangeList: number[] = Array.from(new Set(rowChangeList));
                                let value = await formRef.validateFields();
                                let values = formRef.getFieldsValue(true).data;
                                console.log(values)
                                
                                if(values && values.length>0 && newRowChangeList.length>0) {
                                    let changeValues = values.filter((item: any, index: number) => {
                                        return newRowChangeList.indexOf(index) !== -1;
                                    }).map((item:any)=>{
                                        return {
                                            ...item,
                                            productCategory: params.id,
                                            segmentGroupId: params.productSegmentId
                                        }
                                    })
                                    RequestUtil.post(`/tower-science/drawProductStructure/submit?productCategoryId=${params.id}`, [ ...changeValues ]).then(res => {
                                       
                                        setColumns(columnsSetting);
                                        setEditorLock('编辑');
                                        formRef.resetFields()
                                        setRowChangeList([]);
                                        setRefresh(!refresh); 
                                        history.go(0)   
                                    });
                                }else{
                                    setColumns(columnsSetting);
                                    setEditorLock('编辑');
                                    formRef.resetFields()
                                    setRowChangeList([]);
                                    setRefresh(!refresh); 
                                }
                                
                            }
                            console.log(formRef.getFieldsValue(true)) 
                        } } disabled={formRef.getFieldsValue(true).data&&formRef.getFieldsValue(true).data?.length===0}>{ editorLock }</Button>
                        <Button type="primary" ghost onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${params.productSegmentId}/recognize`)}}>识别</Button>
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={ async () => {
                                if(selectedKeys.length >0 )
                                    if(!(selectedKeys.length > 100)){
                                        await RequestUtil.delete(`/tower-science/drawProductStructure?ids=${ selectedKeys.join(',') }`).then(()=>{
                                            message.success('删除成功！');
                                            setRefresh(!refresh);
                                            history.go(0)   
                                        })
                                    }else{
                                        message.error('当前选择数量过多，请重新选择！')
                                    }
                                else {
                                    message.warning('请选择要删除的数据')
                                }
                            }}
                            okText="提交"
                            cancelText="取消"
                            disabled={ editorLock==='锁定'?true: !(selectedKeys.length>0)}
                        >
                            <Button type="primary" ghost  disabled={ editorLock==='锁定'?true: !(selectedKeys.length>0) }>删除</Button>
                        </Popconfirm>
                        <Button type="ghost" onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}`)}}>返回</Button>
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
        form.setFieldsValue({ dataV: [] })
    }} width={'90%'} onOk={
        ()=>{
            form.validateFields().then(()=>{
                const values = form.getFieldsValue(true).dataV.map((item:any)=>{
                    return {
                        ...item,
                        productCategory: params.id,
                        segmentGroupId: params.productSegmentId
                    }
                })
                RequestUtil.post(`/tower-science/drawProductStructure/submit?productCategoryId=${params.id}`, [ ...values ]).then(res => {
                    setAddVisible(false);
                    setTableDataSource([]);
                    form.setFieldsValue({ dataV: [] })
                    message.success('添加成功！')
                    setRefresh(!refresh);    
                });
            })
        }
    }>
        <Form form={form}>
            <Button onClick={()=>{
                const value = form.getFieldsValue(true).dataV||[];
                value.push({})
                setTableDataSource([...value])
                console.log(value)
                form.setFieldsValue({ dataV: [...value]})
            }} type='primary' ghost>添加一行</Button>
            <Table
                columns={[
                    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                    { title: '段号', dataIndex: 'segmentName', key: 'segmentName', render:(_a: any, _b: any, index: number): React.ReactNode =>(
                        <Form.Item name={['dataV',index, "segmentName"]} initialValue={ _a } rules={[{required:true, message:'请填写段号'}
                        // , {
                        //     pattern: /^[0-9a-zA-Z-]*$/,
                        //     message: '仅可输入数字/字母/-',
                        // }
                        ]}>
                            {/* <Select>
                                { paragraphList.map((item: any) => {
                                    return <Select.Option key={ item.id } value={ item.id }>{ item.segmentName }</Select.Option>
                                }) }
                            </Select> */}
                             <Input size="small" maxLength={10}/>
                        </Form.Item>
                    )},
                    { title: '构件编号', dataIndex: 'code', key: 'code',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "code"]} initialValue={ _ } rules={[{required:true, message:'请填写构件编号'}, {
                            pattern: /^[0-9a-zA-Z-]*$/,
                            message: '仅可输入数字/字母/-',
                        }]}>
                            <Input size="small" maxLength={10}/>
                        </Form.Item>
                    ) },
                    { title: '材料名称', dataIndex: 'materialName', key: 'materialName',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "materialName"]} initialValue={ _ } rules={[{required:true, message:'请输入材料名称'}, {
                            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]*$/,
                            message: '仅可输入汉字/数字/字母',
                        }]}>
                            <Input size="small" maxLength={10}/>
                        </Form.Item>
                    ) },
                    { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "structureTexture"]} initialValue={ _ } rules={[{required:true, message:'请输入材质'}, {
                            pattern: /^[0-9a-zA-Z-]*$/,
                            message: '仅可输入数字/字母/-',
                        }]}>
                            <Input size="small" maxLength={10}/>
                        </Form.Item>
                    ) },
                    { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec', render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "structureSpec"]} initialValue={ _ } rules={[{required:true, message:'请输入规格'},{
                            
                            pattern: /^[0-9-∠L*]*$/,
                            message: '仅可输入数字/-/*/L/∠',
                            
                        }]}>
                            <Input size="small" maxLength={10}/>
                        </Form.Item>
                    ) },
                    { title: '长度（mm）', dataIndex: 'length', key: 'length',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "length"]} rules={[{required:true, message:'请输入长度'}]}>
                            <InputNumber size="small" min={1} precision={0} max={999999}/>
                        </Form.Item>
                    ) },
                    { title: '宽度（mm）', dataIndex: 'width', key: 'width',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "width"]}>
                            <InputNumber size="small" min={1} precision={0} max={999999}/>
                        </Form.Item>
                    ) },
                    { title: '厚度（mm）', dataIndex: 'thickness', key: 'thickness',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "thickness"]}>
                            <InputNumber size="small" min={1} precision={0} max={999999}/>
                        </Form.Item>
                    ) },
                    { title: '大头', dataIndex: 'big', key: 'big',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "big"]}>
                            <InputNumber size="small" precision={0} max={999999}/>
                        </Form.Item>
                    ) },
                    { title: '小头', dataIndex: 'small', key: 'small',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "small"]}>
                            <InputNumber size="small" precision={0} max={999999}/>
                        </Form.Item>
                    ) },
                    { title: '单段件数', dataIndex: 'basicsPartNum', key: 'basicsPartNum',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "basicsPartNum"]} initialValue={ _ } rules={[{required:true, message:'请输入单段件数'}]}>
                            <InputNumber size="small" min={1} precision={0} max={99} onChange={(e:any)=>{
                                const data = form.getFieldsValue(true).dataV;
                                if (data[index].basicsWeight) {
                                    data[index] = {
                                        ...data[index],
                                        totalWeight:  e* data[index].basicsWeight
                                    }
                                    form?.setFieldsValue({ dataV: data })
                                    setTableDataSource(data)
                                }
                            }}/>
                        </Form.Item>
                    ) },
                    { title: '单件重量（kg）', dataIndex: 'basicsWeight', key: 'basicsWeight',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "basicsWeight"]} initialValue={ _ } rules={[{required:true, message:'请输入单件重量'}]}>
                            <InputNumber size="small" min={0} precision={2} max={9999.99} onChange={(e:any)=>{
                                const data = form.getFieldsValue(true).dataV;
                                if (data[index].basicsPartNum) {
                                    data[index] = {
                                        ...data[index],
                                        totalWeight: e* data[index].basicsPartNum
                                    }
                                    form?.setFieldsValue({ dataV: data })
                                    setTableDataSource(data)
                                }
                            }}/>
                        </Form.Item>
                    ) },
                    { title: '小计重量（kg）', dataIndex: 'totalWeight', key: 'totalWeight',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "totalWeight"]}>
                            <InputNumber size="small" min={0} precision={2} max={9999.99} disabled/>
                        </Form.Item>
                    ) },
                    { title: '备注', dataIndex: 'description', key: 'description',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                        <Form.Item name={['dataV',index, "description"]} initialValue={ _ }>
                            <TextArea showCount rows={1} maxLength={50}/>
                        </Form.Item>
                    ) },
                    { title: '操作', key:'operation', render:(_a: any, _b: any, index: number): React.ReactNode =>(
                        <Button type='link' onClick={()=>{
                            tableDataSource&&tableDataSource.splice(index,1);
                            tableDataSource&&setTableDataSource([...tableDataSource])
                            form.setFieldsValue({
                                dataV: [...tableDataSource]
                            })
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