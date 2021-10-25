/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-螺栓列表
 */

import React, { useState } from 'react';
import { Space, Button, Popconfirm, Spin, Tabs, message, Form, Input, Modal, Row, Col, Select, Upload } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './BoltList.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { ColumnType } from 'antd/lib/table';
import BoltNewModal from './BoltNewModal';
import { downloadTemplate } from '../setOut/downloadTemplate';
import AuthUtil from '../../../utils/AuthUtil';

interface ITab {
    readonly basicHeight?: string;
    readonly id?: string;
    readonly productCategoryId?: string;
}

interface Column extends ColumnType<object> {
    editable?: boolean;
}

export default function BoltList(): React.ReactNode {   
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [ dataSource, setDataSource ] = useState<[]>([]);
    const [ editorLock, setEditorLock ] = useState('编辑');
    const [ rowChangeList, setRowChangeList ] = useState<number[]>([]);
    const [ activeKey, setActiveKey ] = useState<string>('');
    const [ visible, setVisible ] = useState<boolean>(false);
    const [ basicHeight, setBasicHeight ] = useState<string>('');
    const [ form ] = Form.useForm();

    const columns = [
        {
            key: 'id',
            title: '序号',
            dataIndex: 'id',
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<><span>{ index + 1 }</span><Form.Item name={['data',index, "id"]} initialValue={ _ } style={{ display: "none" }}>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item></>)
        },
        {
            key: 'type',
            title: '类型',
            width: 150,
            dataIndex: 'type',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "type"]} initialValue={ _ } rules={[{
                    required: true,
                    message: '请选择类型'
                }]}>
                    <Select style={{ width: '100%' }} placeholder="请选择" onChange={ () => rowChange(index) }>
                        <Select.Option value={ 1 } key="1">普通</Select.Option>
                        <Select.Option value={ 2 } key="2">防盗</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'name',
            title: '名称',
            width: 150,
            dataIndex: 'name',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "name"]} initialValue={ _ } rules={[{
                    required: true,
                    message: '请输入名称'
                }]}>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item>
            )
        },
        {
            key: 'level',
            title: '等级',
            width: 150,
            dataIndex: 'level',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "level"]} initialValue={ _ } rules={[{
                    required: true,
                    message: '请输入等级'
                }]}>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item>
            )
        },
        {
            key: 'specs',
            title: '规格',
            width: 150,
            dataIndex: 'specs',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "specs"]} initialValue={ _ } rules={[{
                    required: true,
                    message: '请输入规格'
                }]}>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item>
            )
        },
        {
            key: 'unbuckleLength',
            title: '无扣长（mm）',
            dataIndex: 'unbuckleLength',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "unbuckleLength"]} initialValue={ _ === -1 ? "" :  _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item>
            )
        },
        {
            key: 'subtotal',
            title: '小计',
            width: 120,
            dataIndex: 'subtotal',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "subtotal"]} initialValue={ _ } rules={[{
                    required: true,
                    message: '请输入名称'
                }]}>
                    <Input size="small" onChange={ () => rowChange(index) }/>
                </Form.Item>
            )
        },
        {
            key: 'total',
            title: '合计',
            width: 120,
            dataIndex: 'total',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "total"]} initialValue={ _ } rules={[{
                    required: true,
                    message: '请输入合计'
                }]}>
                    <Input size="small" onChange={ (e) => { 
                        rowChange(index); 
                        const data = form.getFieldsValue(true).data;
                        if(data[index].singleWeight) {
                            data[index] = {
                                ...data[index],
                                totalWeight: Number(e.target.value) * data[index].singleWeight
                            }
                            form?.setFieldsValue({ data: data })
                        }
                    }  }/>
                </Form.Item>
            )
        },
        {
            key: 'singleWeight',
            title: '单重（kg）',
            dataIndex: 'singleWeight',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "singleWeight"]} initialValue={ _ } rules={[{
                    required: true,
                    message: '请输入单重'
                }]}>
                    <Input size="small" onChange={ (e) => {
                        rowChange(index);
                        const data = form.getFieldsValue(true).data;
                        if(data[index].total) {
                            data[index] = {
                                ...data[index],
                                totalWeight: Number(e.target.value) * data[index].total
                            }
                            form?.setFieldsValue({ data: data })
                        }
                    } }/>
                </Form.Item>
            )
        },
        {
            key: 'totalWeight',
            title: '合计重（kg）',
            width: 120,
            dataIndex: 'totalWeight',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data',index, "totalWeight"]} initialValue={ _ } rules={[{
                    required: true,
                    message: '请输入合计重'
                }]}>
                    <Input size="small" onChange={ () => rowChange(index) } disabled/>
                </Form.Item>
            )
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
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
                            onConfirm={ () => RequestUtil.delete(`/tower-science/boltRecord/delete/${ record.id }`).then(res => {
                                message.success('删除成功');
                                getDataSource(record.basicHeightId);

                            }) }
                            okText="确认"
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
                render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    <span>{ _ === -1 ? "" :  _  }</span>
                ),
            }
        }
    })

    const rowChange = (index: number) => {
        rowChangeList.push(index);
        setRowChangeList([...rowChangeList]);    
    }
    
    const [ tableColumns, setColumns ] = useState(columnsSetting);

    const getDataSource = async (basicHeightId?: string) => {
        const data: [] = await RequestUtil.get(`/tower-science/boltRecord/boltList`, {
            basicHeightId: basicHeightId,
            productCategoryId: params.id
        })
        setDataSource(data);
    }

    const { loading, data } = useRequest<ITab[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<ITab[]>(`/tower-science/boltRecord/basicHeight/${ params.id }`);
        if(data && data[0]) {
            getDataSource(data[0].id);
            setActiveKey(data[0].id || '');
        }
        resole(data)
    }), {})
    const detailData: ITab[] = data || [];

    if (loading) {
        return <Spin spinning={ loading }>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const tabChange = (activeKey: string) => {
        getDataSource(activeKey);
        setActiveKey(activeKey);
    }

    const onSubmit = () => {
        if(basicHeight && /^[^(\s)]*$/.test(basicHeight)) {
            RequestUtil.post(`/tower-science/boltRecord/saveBasicHeight`, { basicHeight: basicHeight, productCategoryId: params.id }).then(res => {
                history.go(0);
            }) 
        } else {
            message.warning('请输入呼高');
        }
    }
    
    return <>
        <DetailContent>
            <Space direction="horizontal" size="small" className={ styles.topbtn }>
                {/* <Button type="primary" ghost>导出</Button> */}
                <Button type="primary" onClick={ () => downloadTemplate('/tower-science/boltRecord/exportTemplate', '螺栓导入模板') } ghost>模板下载</Button>
            </Space>
            <Space direction="horizontal" size="small" className={ `${ styles.topbtn } ${ styles.btnRight }` }>
                <Popconfirm
                    title="确认完成?"
                    onConfirm={ () => RequestUtil.get(`/tower-science/boltRecord/complete?id=${ params.id }&basicHeightId=${ activeKey }`).then(res => {
                        history.goBack();
                        setBasicHeight(activeKey);
                    }) }
                    okText="确认"
                    cancelText="取消" 
                    disabled={ editorLock === '锁定' }
                >
                    <Button type="primary" disabled={ editorLock === '锁定' }>完成螺栓清单</Button>
                </Popconfirm>
                <Button type="primary" ghost onClick={ () => { 
                    if(editorLock === '编辑') {
                        setColumns(columns);
                        setEditorLock('锁定'); 
                        form.setFieldsValue({ data: [...dataSource] })  
                    } else {
                        const newRowChangeList: number[] = Array.from(new Set(rowChangeList));
                        let values = form.getFieldsValue(true).data;
                        if(values) {
                            let changeValues = values.filter((item: any, index: number) => {
                                return newRowChangeList.indexOf(index) !== -1;
                            })
                            changeValues = changeValues.map((res: []) => {
                                return {
                                    ...res,
                                    basicHeightId: activeKey,
                                    productCategoryId: params.id
                                }
                            })
                            RequestUtil.put(`/tower-science/boltRecord`, [ ...changeValues ]).then(res => {
                                setColumns(columnsSetting);
                                setEditorLock('编辑');
                                setRowChangeList([]);   
                                form.resetFields(); 
                                getDataSource(activeKey);
                            });
                        } else {
                            setColumns(columnsSetting);
                            setEditorLock('编辑');
                            form.resetFields();
                            getDataSource(activeKey);
                        }
                    }
                } }>{ editorLock }</Button>
                <Upload 
                    action={ () => {
                        const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                        return baseUrl+'/tower-science/boltRecord/import'
                    } } 
                    headers={
                        {
                            'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    data={ { basicHeightId: activeKey, productCategoryId: params.id } }
                    showUploadList={ false }
                    onChange={ (info) => {
                        if(info.file.response && !info.file.response?.success) {
                            message.warning(info.file.response?.msg)
                        } 
                        if(info.file.response && info.file.response?.success){
                            getDataSource(activeKey);
                        }
                    } }
                >
                    <Button type="primary" ghost>导入</Button>
                </Upload>
                { editorLock === '锁定' ? <Button type="primary" disabled ghost>添加</Button> : <BoltNewModal id={ params.id } basicHeightId={ activeKey } updataList={ () => getDataSource(activeKey) }/>}
                <Button type="primary" onClick={ () => setVisible(true) } disabled={ editorLock === '锁定' } ghost>添加呼高</Button>
                <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
            </Space>
            {
                detailData.length > 0 ? <Tabs onChange={ tabChange } type="card">
                    {
                        detailData.map((item: ITab) => {
                            return <Tabs.TabPane tab={ item.basicHeight + 'm呼高' } key={ item.id } disabled={ editorLock === '锁定' }>
                                <Form form={ form } className={ styles.descripForm } key={ item.id }>
                                    <CommonTable columns={ tableColumns } dataSource={ dataSource } pagination={ false } />
                                </Form>
                            </Tabs.TabPane>
                        })
                    }
                </Tabs>
                :  <div>暂无呼高，请添加</div>
            } 
        </DetailContent>
        <Modal
            visible={ visible } 
            width="40%" 
            title="添加" 
            onCancel={ () => { setVisible(false); setBasicHeight(''); } }
            onOk={ () => onSubmit() }
            okText="确定"
            cancelText="关闭">
            <Row className={ styles.content }><Col offset={ 2 } span={ 4 }>呼高 <span style={{ color: 'red' }}>*</span></Col><Col span={ 16 }><Input type="number" min={ 0 } value={ basicHeight } onChange={ (e) => setBasicHeight(e.target.value) } placeholder="请输入"/></Col></Row>
        </Modal>
    </>
}