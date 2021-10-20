/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-螺栓列表
 */

import React, { useState } from 'react';
import { Space, Button, Popconfirm, Spin, Tabs, message, Form, Input, Modal, Row, Col } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './BoltList.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { ColumnType } from 'antd/lib/table';
import BoltNewModal from './BoltNewModal';

interface ITab {
    readonly basicHeight?: string;
    readonly id?: string;
    readonly productCategoryId?: string;
}

interface Column extends ColumnType<object> {
    editable?: boolean;
}

export default function BoltList(): React.ReactNode {
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
                <Form.Item name={['data',index, "type"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "name"]} initialValue={ _ }>
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
                <Form.Item name={['data',index, "level"]} initialValue={ _ }>
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
                <Form.Item name={['data',index, "specs"]} initialValue={ _ }>
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
                <Form.Item name={['data',index, "unbuckleLength"]} initialValue={ _ }>
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
                <Form.Item name={['data',index, "subtotal"]} initialValue={ _ }>
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
                <Form.Item name={['data',index, "total"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "singleWeight"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                <Form.Item name={['data',index, "totalWeight"]} initialValue={ _ }>
                    <Input size="small" onChange={ () => rowChange(index) }/>
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
                            onConfirm={ () => RequestUtil.delete(`/tower-science/boltRecord/${ record.id }`).then(res => {
                                message.success('删除成功');
                                getDataSource(activeKey);
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
                render: undefined,
            }
        }
    })

    const rowChange = (index: number) => {
        rowChangeList.push(index);
        setRowChangeList([...rowChangeList]);    
    }

    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [ dataSource, setDataSource ] = useState<[]>([]);
    const [ editorLock, setEditorLock ] = useState('编辑');
    const [ tableColumns, setColumns ] = useState(columnsSetting);
    const [ rowChangeList, setRowChangeList ] = useState<number[]>([]);
    const [ activeKey, setActiveKey ] = useState<string>('');
    const [ visible, setVisible ] = useState<boolean>(false);
    const [ basicHeight, setBasicHeight ] = useState<string>('');
    const [ form ] = Form.useForm();

    
    const getDataSource = async (basicHeightId?: string) => {
        const data: [] = await RequestUtil.get(`/tower-science/boltRecord/boltList`, {
            basicHeightId: basicHeightId,
            productCategoryId: params.id
        })
        setDataSource(data);
    }

    const { loading, data } = useRequest<ITab[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<ITab[]>(`/tower-science/boltRecord/basicHeight/${ params.id }`);
        if(data[0]) {
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
                <Button type="primary" ghost>模板下载</Button>
                <Button type="primary" ghost>导出</Button>
                <Popconfirm
                    title="确认完成?"
                    onConfirm={ () => RequestUtil.put(`/tower-science/boltRecord/complete`, { id: params.id }).then(res => {
                        history.goBack();
                    }) }
                    okText="确认"
                    cancelText="取消"
                >
                    <Button type="primary">完成螺栓清单</Button>
                </Popconfirm>
                <Button type="primary" ghost onClick={ () => { 
                    if(editorLock === '编辑') {
                        setColumns(columns);
                        setEditorLock('锁定');   
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
                        }
                    }
                } }>{ editorLock }</Button>
                <Button type="primary" ghost>导入</Button>
                <BoltNewModal id={ params.id } basicHeightId={ activeKey } updataList={ () => getDataSource(activeKey) }/>
                <Button type="primary" onClick={ () => setVisible(true) } ghost>添加呼高</Button>
                <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
            </Space>
            <Tabs onChange={ tabChange } type="card">
                {
                    detailData.map((item: ITab) => {
                        return <Tabs.TabPane tab={ item.basicHeight } key={ item.id } disabled={ editorLock === '锁定' }>
                            <Form form={ form } className={ styles.descripForm }>
                                <CommonTable columns={ tableColumns } dataSource={ dataSource } pagination={ false } />
                            </Form>
                        </Tabs.TabPane>
                    })
                }
            </Tabs>
        </DetailContent>
        <Modal
            visible={ visible } 
            width="40%" 
            title="添加" 
            onCancel={ () => { setVisible(false); setBasicHeight(''); } }
            onOk={ () => onSubmit() }
            okText="确定"
            cancelText="关闭">
            <Row className={ styles.content }><Col offset={ 2 } span={ 4 }>呼高 <span style={{ color: 'red' }}>*</span></Col><Col span={ 16 }><Input value={ basicHeight } onChange={ (e) => setBasicHeight(e.target.value) } placeholder="请输入"/></Col></Row>
        </Modal>
    </>
}