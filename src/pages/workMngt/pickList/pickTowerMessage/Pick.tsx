import React, { useRef, useState } from 'react';
import { Space, Button, Popconfirm, Input, Form, message, InputNumber, Upload, Modal, Table, Checkbox, Select } from 'antd';
import { SearchTable as Page } from '../../../common';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import styles from './Pick.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import AuthUtil from '../../../../utils/AuthUtil';
import { downloadTemplate } from '../../setOut/downloadTemplate';
import StructureTextureEdit from './StructureTextureEdit';
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
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState<any>({ productCategoryId: params.id, segmentId:params?.productSegmentId==='all'?'':params?.productSegmentId});
    const [visible, setVisible] = useState<boolean>(false);
    const [tipVisible, setTipVisible] = useState<boolean>(false);
    const [addVisible, setAddVisible] = useState<boolean>(false);
    const [isBig, setIsBig] = useState<boolean>(true);
    const [isAuto, setIsAuto] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [editorLock, setEditorLock] = useState('添加');
    const [form] = Form.useForm();
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [tableDataSource, setTableDataSource] = useState<any[]>([])
    const editModalRef = useRef<any>();
    const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => { 
        const data: [] = await RequestUtil.get<[]>(`/tower-science/drawProductSegment`,{                                
            // segmentId:params.productSegmentId ==='all'?'':params.productSegmentId,
            productCategory:params?.id
        });
        resole(data);
    }), {})
    const paragraphList: [] = data || [];
    const handleEditModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editModalRef.current?.onSubmit();
            message.success('修改材质成功');
            setEditVisible(false);
            history.go(0)
            setRefresh(!refresh);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })
    const columns = [
        {
            key: 'id',
            title: '序号',
            dataIndex: 'id',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <>
                    <span>{index + 1}</span>
                    <Form.Item
                        name={['data', index, "id"]}
                        initialValue={_}
                        style={{ display: "none" }}
                    >
                        <Input
                            size="small"
                            onChange={() => rowChange(index)}
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
                    name={['data', index, "segmentName"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请输入段号'
                    }, {
                        pattern: /^[0-9a-zA-Z-]*$/,
                        message: '仅可输入数字/字母/-',
                    }]}
                >
                    {/* <Select onChange={ () => rowChange(index) }>
                        { paragraphList.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.id }>{ item.segmentName }</Select.Option>
                        }) }
                    </Select> */}
                    <Input size="small" onChange={() => rowChange(index)} maxLength={10} />
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
                    name={['data', index, "code"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请输入构件编号'
                    }, {
                        pattern: /^[0-9a-zA-Z-]*$/,
                        message: '仅可输入数字/字母/-',
                    }]}
                >
                    <Input size="small" onChange={() => rowChange(index)} maxLength={50} />
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
                    name={['data', index, "materialName"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请输入材料名称'
                    }, {
                        pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]*$/,
                        message: '仅可输入汉字/数字/字母',
                    }]}
                >
                    <Input size="small" onChange={() => rowChange(index)} maxLength={10} />
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
                    name={['data', index, "structureTexture"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请输入材质'
                    }, {
                        pattern: /^[0-9a-zA-Z-]*$/,
                        message: '仅可输入数字/字母/-',
                    }]}
                >
                    <Input size="small" onChange={() => rowChange(index)} maxLength={10} />
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
                    name={['data', index, "structureSpec"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请输入规格'
                    }, {
                        pattern: /^[0-9-*L∠φ]*$/,
                        message: '仅可输入数字/-/*/L/∠/φ',
                    }]}
                >
                    <Input size="small" onChange={() => rowChange(index)} maxLength={10} />
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
                    name={['data', index, "length"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请输入长度'
                    }]}
                >
                    <InputNumber
                        size="small"
                        min={1} precision={0} max={999999}
                        onChange={() => rowChange(index)}
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
                    name={['data', index, "width"]}
                    initialValue={_}
                >
                    <InputNumber
                        size="small"
                        min={1} precision={0} max={999999}
                        onChange={() => rowChange(index)}
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
                    name={['data', index, "thickness"]}
                    initialValue={_}
                >
                    <InputNumber
                        size="small"
                        min={1} precision={0} max={999999}
                        onChange={() => rowChange(index)}
                    />
                </Form.Item>
            )
        },
        {
            title: '大头',
            dataIndex: 'bigHead',
            key: 'bigHead',
            width: 120,
        },
        {
            title: '小头',
            dataIndex: 'smallHead',
            key: 'smallHead',
            width: 120,
        },
        {
            title: '单件重量（kg）',
            dataIndex: 'basicsWeight',
            key: 'basicsWeight',
            width: 120,
            editable: true,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['data', index, "basicsWeight"]}
                    initialValue={_ === -1 ? 0 : _}
                    rules={[{
                        required: true,
                        message: '请输入单件重量'
                    }]}
                >
                    <InputNumber
                        size="small"
                        min={0} precision={2} max={9999.99}
                        onChange={() => rowChange(index)}
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
                    name={['data', index, "basicsPartNum"]}
                    initialValue={_ === -1 ? 0 : _}
                    rules={[{
                        required: true,
                        message: '请输入单段件数'
                    }]}
                >
                    <InputNumber
                        size="small"
                        precision={0}
                        min={1}
                        max={9999}
                        onChange={() => rowChange(index)}
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
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_!==null?_:'-'}</span>
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
                    name={['data', index, "description"]}
                    initialValue={_}
                >
                    <TextArea
                        size="small"
                        rows={1}
                        showCount
                        maxLength={300}
                        onChange={() => rowChange(index)}
                    />
                </Form.Item>
            )
        }

    ];
    const checkColor = (record: Record<string, any>, dataIndex: string) => {
        const red: number = record.redColumn.indexOf(dataIndex);
        if (red !== -1) {
            return 'red';
        } else {
            return 'normal'
        }
    }

    const columnsSetting: Column[] = columns.map((col: any) => {
        if (!col.editable) {
            return col;
        }
        if (col.dataIndex === 'operation') {
            return {
                ...col,
            }
        } else {
            if (['basicsPartNum', 'length', 'width', 'basicsTheoryWeight', 'basicsWeight', 'totalWeight'].includes(col.dataIndex as string)) {
                if (col.dataIndex === 'totalWeight') {
                    return {
                        ...col,
                        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                            <p className={checkColor(record, col.dataIndex) === 'red' ? styles.red : ''}>{parseFloat(`${(record.basicsWeight && record.basicsWeight !== -1 ? record.basicsWeight : 0) * (record.basicsPartNum && record.basicsPartNum !== -1 ? record.basicsPartNum : 0)}`).toFixed(2)}</p>
                        )
                    }
                } else if (col.dataIndex === 'length') {
                    return {
                        ...col,
                        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                            <p className={checkColor(record, col.dataIndex) === 'red' ? styles.red : ''}>{_ === -1 ? 0 : _}</p>
                        )
                    }
                } else if (col.dataIndex === 'basicsTheoryWeight') {
                    return {
                        ...col,
                        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                            <p className={checkColor(record, col.dataIndex) === 'red' ? styles.red : ''}>{_ === -1 ? 0 : (parseFloat(record?.basicsTheoryWeight)*parseFloat(record?.basicsPartNum)).toFixed(2)}</p>
                        )
                    }
                } else {
                    return {
                        ...col,
                        render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                            <p className={checkColor(record, col.dataIndex) === 'red' ? styles.red : ''}>{_ === -1 ? 0 : _}</p>
                        )
                    }
                }
            }
            else return {
                ...col,
                render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                    <p className={checkColor(record, col.dataIndex) === 'red' ? styles.red : ''}>{_ === -1 ? 0 : _}</p>
                )
            }
        }
    })
    const [tableColumns, setColumns] = useState(columnsSetting);
    const onFilterSubmit = (value: any) => {
        value.productCategoryId = params.id
        console.log(value)
        // value.segmentId =  value.segmentId?value.segmentId:params?.productSegmentId==='all'?'':params?.productSegmentId
        setFilterValue(value)
        return value
    }
    const rowChange = (index: number) => {
        rowChangeList.push(index);
        setRowChangeList([...rowChangeList]);
    }
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<object[]>([]);
    const [rowChangeList, setRowChangeList] = useState<number[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: object[]): void => {
        console.log(selectedRowKeys,selectedRows)
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
    return <>
        <Modal
            visible={visible}
            onOk={() => {
                window.open(url);
                setVisible(false);
            }}
            onCancel={() => { setVisible(false); setUrl('') }}
            title='提示'
            okText='下载'
        >
            当前存在错误数据，请重新下载上传！
        </Modal>
        <Page
            path="/tower-science/drawProductStructure"
            exportPath="/tower-science/drawProductStructure"
            columns={[...tableColumns as any, {
                key: 'operation',
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right' as FixedType,
                width: 100,
                render: (_: number, record: any, index: number): React.ReactNode => (
                    <Space className={styles.operationBtn}>
                        <Button type="link"
                            onClick={()=>{
                                console.log([record])
                                const value = [record]
                                setEditorLock('编辑');
                                // console.log(selectedRows)
                                form.setFieldsValue({ dataV: [...value] })
                                setTableDataSource([...value])
                                setAddVisible(true);
                            }}
                        >编辑</Button>
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={async () => await RequestUtil.post(`/tower-science/drawProductStructure/remove`, {
                                productStructureIdList: [record.id]
                            }).then(() => {
                                message.success('删除成功！');
                                history.go(0)
                                setRefresh(!refresh);
                            })}
                            okText="提交"
                            cancelText="取消"
                        >
                            <Button type="link" >删除</Button>
                        </Popconfirm>
                    </Space>
                )
            }]}
            filterValue={filterValue}
            pagination={false}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            extraOperation={
                <Space direction="horizontal" size="small">
                    <Button type="primary" ghost onClick={() => downloadTemplate('/tower-science/drawProductStructure/exportTemplate', '构建明细')}>模板下载</Button>
                    <Button type="primary" ghost onClick={() => { setTipVisible(true) }}>提示说明</Button>
                    <Upload
                        accept=".xls,.xlsx"
                        action={() => {
                            const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                            return baseUrl + '/tower-science/drawProductStructure/import'
                        }}
                        headers={
                            {
                                'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                                'Tenant-Id': AuthUtil.getTenantId(),
                                'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                            }
                        }
                        data={{ 
                            // segmentId:params.productSegmentId==='all'?'':params.productSegmentId,
                            productCategoryId: params.id, 
                        }}
                        showUploadList={false}
                        onChange={(info) => {
                            if (info.file.response && !info.file.response?.success) {
                                message.warning(info.file.response?.msg)
                            } else if (info.file.response && info.file.response?.success) {
                                if (info.file.response?.data) {
                                    setUrl(info.file.response?.data);
                                    setVisible(true);
                                } else {
                                    message.success('导入成功！');
                                    history.go(0)
                                    // setRefresh(!refresh);
                                    setFilterValue({ productCategoryId: params.id })
                                }
                            }
                        }}
                    >
                        <Button type="primary" ghost >导入</Button>
                    </Upload>
                    <Button type="primary" ghost onClick={() => {
                        setAddVisible(true)
                    }}>添加</Button>
                    <Button type="primary" ghost onClick={() => { history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${params.productSegmentId}/drawApply`) }}>图纸塔型套用</Button>
                    <Button type="primary" ghost onClick={() => { history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${params.productSegmentId}/setOutApply`) }}>放样塔型套用</Button>
                    
                    <Button type="primary" ghost
                    onClick={()=>{
                        setEditVisible(true)
                    }}
                    >修改材质</Button>
                    {/* <Button type="primary" ghost onClick={async () => {
                        
           
                        // if (editorLock === '编辑') {
                        //     setColumns(columns);
                        //     setEditorLock('锁定');
                        // } else {
                        //     const newRowChangeList: number[] = Array.from(new Set(rowChangeList));
                        //     let value = await formRef.validateFields();
                        //     let values = formRef.getFieldsValue(true).data;
                        //     console.log(values)

                        //     if (values && values.length > 0 && newRowChangeList.length > 0) {
                        //         let changeValues = values.filter((item: any, index: number) => {
                        //             return newRowChangeList.indexOf(index) !== -1;
                        //         }).map((item: any) => {
                        //             return {
                        //                 ...item,
                        //                 productCategory: params.id,
                        //                 segmentGroupId: params.productSegmentId
                        //             }
                        //         })
                        //         RequestUtil.post(`/tower-science/drawProductStructure/submit?productCategoryId=${params.id}`, [...changeValues]).then(res => {

                        //             setColumns(columnsSetting);
                        //             setEditorLock('编辑');
                        //             formRef.resetFields()
                        //             setRowChangeList([]);
                        //             setRefresh(!refresh);
                        //             history.go(0)
                        //         });
                        //     } else {
                        //         setColumns(columnsSetting);
                        //         setEditorLock('编辑');
                        //         formRef.resetFields()
                        //         setRowChangeList([]);
                        //         setRefresh(!refresh);
                        //     }

                        // }
                        // console.log(formRef.getFieldsValue(true))
                    }} disabled={!(selectedKeys.length === 1)}>编辑</Button> */}
                    <Button type="primary" ghost onClick={() => { history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${params.productSegmentId}/recognize`) }}>识别</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={async () => {
                            if (selectedKeys.length > 0)
                                // if (!(selectedKeys.length > 100)) {
                                    await RequestUtil.post(`/tower-science/drawProductStructure/remove`,{
                                        productStructureIdList: selectedKeys
                                    }).then(() => {
                                        message.success('删除成功！');
                                        setRefresh(!refresh);
                                        history.go(0)
                                    })
                                // } else {
                                //     message.error('当前选择数量过多，请重新选择！')
                                // }
                            else {
                                message.warning('请选择要删除的数据')
                            }
                        }}
                        okText="提交"
                        cancelText="取消"
                        disabled={ !(selectedKeys.length > 0)}
                    >
                        <Button type="primary" ghost disabled={!(selectedKeys.length > 0)}>删除</Button>
                    </Popconfirm>
                    <Button type="ghost" onClick={() => { history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}`) }}>返回</Button>
                </Space>
            }
            searchFormItems={[
                {
                    name: 'materialName',
                    label: '材料名称',
                    children: <Input maxLength={50} />
                },
                {
                    name: 'structureTexture',
                    label: '材质',
                    children: <Input maxLength={50} />
                },
                {
                    name: 'segmentId',
                    label: '段号',
                    children: <Form.Item name='segmentId' initialValue={params?.productSegmentId==='all'?'':params?.productSegmentId}>
                        <Select  style={{width:'100px'}}>
                            <Select.Option key={ 0 } value={''}>全部</Select.Option>
                            { paragraphList.map((item: any) => {
                                return <Select.Option key={ item.id } value={ item.id }>{ item.segmentName }</Select.Option>
                            }) }
                        </Select>
                    </Form.Item>
                }
            ]}
            onFilterSubmit={onFilterSubmit}
        />
        <Modal
            destroyOnClose
            key='StructureTextureEdit'
            visible={editVisible}
            width="30%"
            title="修改材质"
            onOk={handleEditModalOk}
            onCancel={() => {
                setEditVisible(false);
            }}>
            <StructureTextureEdit id={params.productSegmentId} ref={editModalRef} />
        </Modal>
        <Modal title='提示' visible={tipVisible} footer={false} onCancel={() => {
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
                    code: "件号不连续时",
                    structureTexture: "原材料管理中没有时",
                    structureSpec: "原材料管理中没有时",
                    length: "为0时",
                    basicsWeight: "单重与理算重差距≥1时",
                    totalWeight: "单重*数量≠小计"
                }]}
            />
        </Modal>
        <Modal title={editorLock} visible={addVisible} onCancel={() => {
            setAddVisible(false);
            setTableDataSource([]);
            form.setFieldsValue({ dataV: [] })
            setEditorLock('添加')
            setIsAuto(false)
            setIsBig(true)
        }} 
        okText={editorLock==='编辑'?'锁定':'确定'}
        width={'90%'} onOk={
            () => {
                editorLock==='添加'?form.validateFields().then(() => {
                    const values = form.getFieldsValue(true).dataV.map((item: any) => {
                        return {
                            ...item,
                            productCategory: params.id,
                            // segmentId: params.productSegmentId==='all'?'':params.productSegmentId,
                        }
                    })
                    const submitData ={
                        // segmentId:params.productSegmentId==='all'?'':params.productSegmentId,
                        productCategoryId: params.id,
                        drawProductStructureSaveDTOS:[...values]
                    }
                    RequestUtil.post(`/tower-science/drawProductStructure/submit`, submitData).then(res => {
                        setAddVisible(false);
                        setTableDataSource([]);
                        form.setFieldsValue({ dataV: [] })
                        message.success('添加成功！')
                        setRefresh(!refresh);
                        history.go(0)
                    });
                }):form.validateFields().then(() => {
                    const values = form.getFieldsValue(true).dataV.map((item: any) => {
                        return {
                            ...item,
                            productCategory: params.id,
                            // segmentId: params.productSegmentId==='all'?'':params.productSegmentId,
                        }
                    })
                    const submitData ={
                        // segmentId:params.productSegmentId==='all'?'':params.productSegmentId,
                        productCategoryId: params.id,
                        drawProductStructureSaveDTOS:[...values]
                    }
                    RequestUtil.post(`/tower-science/drawProductStructure/submit`, submitData).then(res => {
                        setAddVisible(false);
                        setTableDataSource([]);
                        form.setFieldsValue({ dataV: [] })
                        message.success('锁定成功！')
                        setRefresh(!refresh);
                        history.go(0)
                    });
                })
                ;
            }
        }>
            <Form form={form} className={styles.descripForm}>
                {editorLock==='添加'&&<Button onClick={() => {
                    const value = form.getFieldsValue(true).dataV || [];
                    value.push({})
                    setTableDataSource([...value])
                    console.log(value)
                    form.setFieldsValue({ dataV: [...value] })
                }} type='primary' ghost>添加一行</Button>}
                <Checkbox onChange={(e)=>{
                    setIsBig(e.target.checked)
                    if(e.target.checked){
                        const value = form.getFieldsValue(true).dataV.map((item:any)=>{
                            return {
                                ...item,
                                structureTexture:item?.structureTexture.toUpperCase(),
                                segmentName:item?.segmentName.toUpperCase(),
                                code:item?.code.toUpperCase(),
                            }
                        })
                        setTableDataSource([...value])
                        form.setFieldsValue({dataV: value})
                    }
                    // setTableDataSource(tableDataSource)
                }} checked={isBig}>件号字母自动转换成大写</Checkbox>
                <Checkbox onChange={(e)=>{
                    setIsAuto(e.target.checked)
                    const value = form.getFieldsValue(true).dataV.map((item:any)=>{
                        return {
                            ...item,
                            basicsWeight:'',
                            totalWeight:''
                        }
                    })
                    setTableDataSource([...value])
                    form.setFieldsValue({dataV: value})
                    // setTableDataSource(tableDataSource)
                }} checked={isAuto}>保存时自动计算重量</Checkbox>
                <Table
                    scroll={{x:1200}}
                    columns={editorLock==='添加'?[
                        { 
                            title: '序号',
                            dataIndex: 'index', 
                            key: 'index', 
                            width: 80,
                            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) 
                        },
                        {
                            title: '段号', 
                            dataIndex: 'segmentName', 
                            key: 'segmentName', 
                            width: 120,
                            render: (_a: any, _b: any, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "segmentName"]} initialValue={_a} rules={[{ required: true, message: '请填写段号' }, {
                                    pattern: /^[0-9a-zA-Z-]*$/,
                                    message: '仅可输入数字/字母/-',
                                }]}>
                                    {/* <Select>
                                { paragraphList.map((item: any) => {
                                    return <Select.Option key={ item.id } value={ item.id }>{ item.segmentName }</Select.Option>
                                }) }
                            </Select> */}
                                    <Input size="small" maxLength={10} onBlur={()=>{
                                        if(isBig){
                                            const value = form.getFieldsValue(true).dataV.map((item:any)=>{
                                                return {
                                                    ...item,
                                                    segmentName:item?.segmentName.toUpperCase()
                                                }
                                            })
                                            console.log(value)
                                            setTableDataSource([...value])
                                            form.setFieldsValue({dataV: value})
                                        }
                                    }}/>
                                </Form.Item>
                            )
                        },
                        {
                            title: '构件编号', 
                            dataIndex: 'code', 
                            width: 120,
                            key: 'code', 
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "code"]} initialValue={_} rules={[{ required: true, message: '请填写构件编号' }, {
                                    pattern: /^[0-9a-zA-Z-]*$/,
                                    message: '仅可输入数字/字母/-',
                                }]}>
                                    <Input size="small" maxLength={50} onBlur={()=>{
                                        if(isBig){
                                            const value = form.getFieldsValue(true).dataV.map((item:any)=>{
                                                return {
                                                    ...item,
                                                    code:item?.code.toUpperCase()
                                                }
                                            })
                                            console.log(value)
                                            setTableDataSource([...value])
                                            form.setFieldsValue({dataV: value})
                                        }
                                    }}/>
                                </Form.Item>
                            )
                        },
                        {
                            title: '材料名称', 
                            dataIndex: 'materialName', 
                            width: 120,
                            key: 'materialName', 
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "materialName"]} initialValue={_} rules={[{ required: true, message: '请输入材料名称' }, {
                                    pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]*$/,
                                    message: '仅可输入汉字/数字/字母',
                                }]}>
                                    <Input size="small" maxLength={10} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '材质', 
                            dataIndex: 'structureTexture', 
                            key: 'structureTexture', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "structureTexture"]} initialValue={_} rules={[{ required: true, message: '请输入材质' }, {
                                    pattern: /^[0-9a-zA-Z-]*$/,
                                    message: '仅可输入数字/字母/-',
                                }]}>
                                    <Input size="small" maxLength={10} onBlur={()=>{
                                        if(isBig){
                                            const value = form.getFieldsValue(true).dataV.map((item:any)=>{
                                                return {
                                                    ...item,
                                                    structureTexture:item?.structureTexture.toUpperCase()
                                                }
                                            })
                                            console.log(value)
                                            setTableDataSource([...value])
                                            form.setFieldsValue({dataV: value})
                                        }
                                    }}/>
                                </Form.Item>
                            )
                        },
                        {
                            title: '规格', 
                            dataIndex: 'structureSpec', 
                            key: 'structureSpec', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "structureSpec"]} initialValue={_} rules={[{ required: true, message: '请输入规格' }, {

                                    pattern: /^[0-9-∠L*φ]*$/,
                                    message: '仅可输入数字/-/*/L/∠/φ',

                                }]}>
                                    <Input size="small" maxLength={10} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '长度（mm）', 
                            dataIndex: 'length', 
                            key: 'length', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "length"]} rules={[{ required: true, message: '请输入长度' }]}>
                                    <InputNumber size="small" min={1} precision={0} max={999999} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '宽度（mm）', 
                            dataIndex: 'width',
                            key: 'width', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "width"]}>
                                    <InputNumber size="small" min={1} precision={0} max={999999} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '厚度（mm）', 
                            dataIndex: 'thickness', 
                            key: 'thickness', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "thickness"]}>
                                    <InputNumber size="small" min={1} precision={0} max={999999} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '大头', 
                            dataIndex: 'bigHead', 
                            key: 'bigHead', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "bigHead"]}>
                                    <InputNumber size="small" min={1} precision={0} max={999999} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '小头', 
                            dataIndex: 'smallHead', 
                            key: 'smallHead', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "smallHead"]}>
                                    <InputNumber size="small" min={1} precision={0} max={999999} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '单段件数', 
                            dataIndex: 'basicsPartNum', 
                            key: 'basicsPartNum', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "basicsPartNum"]} initialValue={_} rules={[{ required: true, message: '请输入单段件数' }]}>
                                    <InputNumber size="small" min={1} precision={0} max={9999} onChange={(e: any) => {
                                        const data = form.getFieldsValue(true).dataV;
                                        if (data[index].basicsWeight) {
                                            data[index] = {
                                                ...data[index],
                                                totalWeight: e * data[index].basicsWeight
                                            }
                                            form?.setFieldsValue({ dataV: data })
                                            setTableDataSource(data)
                                        }
                                    }} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '单件重量（kg）', 
                            dataIndex: 'basicsWeight', 
                            key: 'basicsWeight', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "basicsWeight"]} initialValue={_} rules={[{ required: !isAuto, message: '请输入单件重量' }]}>
                                    <InputNumber size="small" min={0} precision={2} max={9999.99} onChange={(e: any) => {
                                        const data = form.getFieldsValue(true).dataV;
                                        if (data[index].basicsPartNum) {
                                            data[index] = {
                                                ...data[index],
                                                totalWeight: e * data[index].basicsPartNum
                                            }
                                            form?.setFieldsValue({ dataV: data })
                                            setTableDataSource(data)
                                        }
                                    }} disabled={isAuto}/>
                                </Form.Item>
                            )
                        },
                        {
                            title: '小计重量（kg）', 
                            dataIndex: 'totalWeight', 
                            key: 'totalWeight', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "totalWeight"]}>
                                    <InputNumber size="small" min={0} precision={2} max={9999.99} disabled />
                                </Form.Item>
                            )
                        },
                        {
                            title: '备注', 
                            dataIndex: 'description', 
                            width: 200,
                            key: 'description', 
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "description"]} initialValue={_}>
                                    <TextArea showCount rows={1} maxLength={50} />
                                </Form.Item>
                            )
                        },
                        {
                            key: 'operation',
                            title: '操作',
                            dataIndex: 'operation',
                            fixed: 'right' as FixedType,
                            width: 80,
                            render: (_a: any, _b: any, index: number): React.ReactNode => (
                                <Button type='link' onClick={() => {
                                    tableDataSource && tableDataSource.splice(index, 1);
                                    tableDataSource && setTableDataSource([...tableDataSource])
                                    form.setFieldsValue({
                                        dataV: [...tableDataSource]
                                    })
                                }}>删除</Button>
                            )
                        }
                    ]:[
                        { 
                            title: '序号', 
                            dataIndex: 'index', 
                            key: 'index', 
                            width: 80,
                            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                        {
                            title: '段号', 
                            dataIndex: 'segmentName', 
                            key: 'segmentName', 
                            width: 120,
                            render: (_a: any, _b: any, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "segmentName"]} initialValue={_a} rules={[{ required: true, message: '请填写段号' }, {
                                    pattern: /^[0-9a-zA-Z-]*$/,
                                    message: '仅可输入数字/字母/-',
                                }]}>
                                    {/* <Select>
                                { paragraphList.map((item: any) => {
                                    return <Select.Option key={ item.id } value={ item.id }>{ item.segmentName }</Select.Option>
                                }) }
                            </Select> */}
                                    <Input size="small" maxLength={10} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '构件编号', 
                            dataIndex: 'code', 
                            width: 120,
                            key: 'code', 
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "code"]} initialValue={_} rules={[{ required: true, message: '请填写构件编号' }, {
                                    pattern: /^[0-9a-zA-Z-]*$/,
                                    message: '仅可输入数字/字母/-',
                                }]}>
                                    <Input size="small" maxLength={50} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '材料名称', 
                            dataIndex: 'materialName', 
                            width: 120,
                            key: 'materialName', 
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "materialName"]} initialValue={_} rules={[{ required: true, message: '请输入材料名称' }, {
                                    pattern: /^[a-zA-Z0-9\u4e00-\u9fa5]*$/,
                                    message: '仅可输入汉字/数字/字母',
                                }]}>
                                    <Input size="small" maxLength={10} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '材质', 
                            dataIndex: 'structureTexture', 
                            key: 'structureTexture', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "structureTexture"]} initialValue={_} rules={[{ required: true, message: '请输入材质' }, {
                                    pattern: /^[0-9a-zA-Z-]*$/,
                                    message: '仅可输入数字/字母/-',
                                }]}>
                                    <Input size="small" maxLength={10} onBlur={()=>{
                                        if(isBig){
                                            const value = form.getFieldsValue(true).dataV.map((item:any)=>{
                                                return {
                                                    ...item,
                                                    structureTexture:item?.structureTexture.toUpperCase()
                                                }
                                            })
                                            console.log(value)
                                            setTableDataSource([...value])
                                            form.setFieldsValue({dataV: value})
                                        }
                                    }}/>
                                </Form.Item>
                            )
                        },
                        {
                            title: '规格', 
                            dataIndex: 'structureSpec', 
                            key: 'structureSpec', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "structureSpec"]} initialValue={_} rules={[{ required: true, message: '请输入规格' }, {

                                    pattern: /^[0-9-∠L*φ]*$/,
                                    message: '仅可输入数字/-/*/L/∠/φ',

                                }]}>
                                    <Input size="small" maxLength={10} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '长度（mm）', 
                            dataIndex: 'length', 
                            key: 'length', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "length"]} rules={[{ required: true, message: '请输入长度' }]}>
                                    <InputNumber size="small" min={1} precision={0} max={999999} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '宽度（mm）', 
                            dataIndex: 'width', 
                            key: 'width', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "width"]}>
                                    <InputNumber size="small" min={1} precision={0} max={999999} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '厚度（mm）', 
                            dataIndex: 'thickness', 
                            key: 'thickness', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "thickness"]}>
                                    <InputNumber size="small" min={1} precision={0} max={999999} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '大头', 
                            dataIndex: 'bigHead', 
                            key: 'bigHead', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "bigHead"]}>
                                    <InputNumber size="small" min={1} precision={0} max={999999} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '小头', 
                            dataIndex: 'smallHead', 
                            key: 'smallHead', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "smallHead"]}>
                                    <InputNumber size="small" min={1} precision={0} max={999999} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '单段件数', 
                            dataIndex: 'basicsPartNum', 
                            key: 'basicsPartNum', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "basicsPartNum"]} initialValue={_} rules={[{ required: true, message: '请输入单段件数' }]}>
                                    <InputNumber size="small" min={1} precision={0} max={9999} onChange={(e: any) => {
                                        const data = form.getFieldsValue(true).dataV;
                                        if (data[index].basicsWeight) {
                                            data[index] = {
                                                ...data[index],
                                                totalWeight: e * data[index].basicsWeight
                                            }
                                            form?.setFieldsValue({ dataV: data })
                                            setTableDataSource(data)
                                        }
                                    }} />
                                </Form.Item>
                            )
                        },
                        {
                            title: '单件重量（kg）', 
                            dataIndex: 'basicsWeight', 
                            key: 'basicsWeight', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "basicsWeight"]} initialValue={_} rules={[{ required: !isAuto, message: '请输入单件重量' }]}>
                                    <InputNumber size="small" min={0} precision={2} max={9999.99} onChange={(e: any) => {
                                        const data = form.getFieldsValue(true).dataV;
                                        if (data[index].basicsPartNum) {
                                            data[index] = {
                                                ...data[index],
                                                totalWeight: e * data[index].basicsPartNum
                                            }
                                            form?.setFieldsValue({ dataV: data })
                                            setTableDataSource(data)
                                        }
                                    }} disabled={isAuto}/>
                                </Form.Item>
                            )
                        },
                        {
                            title: '小计重量（kg）', 
                            dataIndex: 'totalWeight', 
                            key: 'totalWeight', 
                            width: 120,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "totalWeight"]}>
                                    <InputNumber size="small" min={0} precision={2} max={9999.99} disabled />
                                </Form.Item>
                            )
                        },
                        {
                            title: '备注', 
                            dataIndex: 'description', 
                            key: 'description', 
                            width: 200,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['dataV', index, "description"]} initialValue={_}>
                                    <TextArea showCount rows={1} maxLength={50} />
                                </Form.Item>
                            )
                        }
                    ]}
                    pagination={false}
                    dataSource={[...tableDataSource]}
                />
            </Form>
        </Modal>
    </>
}