/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-螺栓列表-螺栓清单-螺栓明细
 */

import React, { useEffect, useState } from 'react';
import { Space, Button, Popconfirm, message, Form, Input, Modal, Select, Upload } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './BoltList.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import Table, { ColumnType } from 'antd/lib/table';
import BoltNewModal from './BoltNewModal';
import { downloadTemplate } from '../setOut/downloadTemplate';
import AuthUtil from '../../../utils/AuthUtil';
import { boltTypeOptions } from '../../../configuration/DictionaryOptions';
import AbstractMngtComponentStyles from '../../../components/AbstractMngtComponent.module.less';
import useRequest from '@ahooksjs/use-request';

interface IData {
    readonly unbuckleLength?: number
}

interface Column extends ColumnType<object> {
    editable?: boolean;
}

export default function BoltList(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, boltId: string, status: string, boltLeader: string }>();
    const [dataSource, setDataSource] = useState<[]>([]);
    const [editorLock, setEditorLock] = useState('编辑');
    const [rowChangeList, setRowChangeList] = useState<number[]>([]);
    const [urlVisible, setUrlVisible] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [form] = Form.useForm();
    const userId = AuthUtil.getUserInfo().user_id;

    const { data: isShow } = useRequest<boolean>(() => new Promise(async (resole, reject) => {
        try {
            let result = await RequestUtil.get<any>(`/tower-science/productCategory/assign/user/list/${params.boltId}`);
            result.indexOf(userId) === -1 ? resole(false) : resole(true)
        } catch (error) {
            reject(error)
        }
    }), {})

    const columns = [
        {
            key: 'id',
            title: '序号',
            dataIndex: 'id',
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<><span>{index + 1}</span><Form.Item name={['data', index, "id"]} initialValue={_} style={{ display: "none" }}>
                <Input size="small" onChange={() => rowChange(index)} />
            </Form.Item></>)
        },
        {
            key: 'typeName',
            title: '螺栓类型',
            width: 150,
            dataIndex: 'typeName',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "type"]} initialValue={record.type} rules={[{
                    required: true,
                    message: '请选择螺栓类型'
                }]}>
                    <Select onChange={() => rowChange(index)} getPopupContainer={triggerNode => triggerNode.parentNode}>
                        {boltTypeOptions && boltTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
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
                <Form.Item name={['data', index, "name"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入名称'
                }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={10} />
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
                <Form.Item name={['data', index, "level"]} initialValue={_}>
                    <Input size="small" maxLength={20} onChange={() => rowChange(index)} />
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
                <Form.Item name={['data', index, "specs"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入规格'
                }]}>
                    <Input size="small" onChange={() => rowChange(index)} maxLength={20} />
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
                <Form.Item name={['data', index, "unbuckleLength"]} initialValue={_}>
                    <Input max={999} type="number" size="small" onChange={() => rowChange(index)} />
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
                <Form.Item name={['data', index, "subtotal"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入小计'
                }]}>
                    <Input type="number" max={9999} size="small" onChange={(e) => {
                        rowChange(index);
                        const data = form.getFieldsValue(true).data;
                        const total = Number(e.target.value) + Number(data[index].wealth)
                        data[index] = {
                            ...data[index],
                            total: total
                        }
                        if (data[index].singleWeight) {
                            data[index] = {
                                ...data[index],
                                totalWeight: total * data[index].singleWeight
                            }
                        }
                        form?.setFieldsValue({ data: data })
                    }} />
                </Form.Item>
            )
        },
        {
            key: 'wealth',
            title: '裕度',
            width: 120,
            dataIndex: 'wealth',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "wealth"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入裕度'
                }]}>
                    <Input type="number" max={9999} size="small" onChange={(e) => {
                        rowChange(index);
                        const data = form.getFieldsValue(true).data;
                        const total = Number(e.target.value) + Number(data[index].subtotal)
                        data[index] = {
                            ...data[index],
                            total: total
                        }
                        if (data[index].singleWeight) {
                            data[index] = {
                                ...data[index],
                                totalWeight: total * data[index].singleWeight
                            }
                        }
                        form?.setFieldsValue({ data: data })
                    }} />
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
                <Form.Item name={['data', index, "total"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入合计'
                }]}>
                    <Input type="number" size="small" onChange={() => rowChange(index)} disabled />
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
                <Form.Item name={['data', index, "singleWeight"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入单重'
                }]}>
                    <Input type="number" size="small" onChange={(e) => {
                        rowChange(index);
                        const data = form.getFieldsValue(true).data;
                        if (data[index].total) {
                            data[index] = {
                                ...data[index],
                                totalWeight: Number(e.target.value) * data[index].total
                            }
                            form?.setFieldsValue({ data: data })
                        }
                    }} />
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
                <Form.Item name={['data', index, "totalWeight"]} initialValue={_} rules={[{
                    required: true,
                    message: '请输入合计重'
                }]}>
                    <Input size="small" onChange={() => rowChange(index)} disabled />
                </Form.Item>
            )
        },
        {
            key: 'description',
            title: '备注',
            width: 120,
            dataIndex: 'description',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "description"]} initialValue={_}>
                    <Input maxLength={100} size="small" onChange={() => rowChange(index)} />
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
        if (col.dataIndex === 'operation') {
            return {
                ...col,
                render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    <Space direction="horizontal" size="small" className={styles.operationBtn}>
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={() => RequestUtil.delete(`/tower-science/boltRecord/delete/${record.id}`).then(res => {
                                message.success('删除成功');
                                getDataSource();

                            })}
                            okText="确认"
                            cancelText="取消"
                            disabled={params.status !== '2' || !isShow}
                        >
                            <Button type="link" disabled={params.status !== '2' || !isShow}>删除</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        } else {
            return {
                ...col,
                render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    <span>{_ === -1 ? "" : _}</span>
                ),
            }
        }
    })

    const rowChange = (index: number) => {
        rowChangeList.push(index);
        setRowChangeList([...rowChangeList]);
    }

    const [tableColumns, setColumns] = useState(columnsSetting);

    const getDataSource = async () => {
        let data: [] = await RequestUtil.get(`/tower-science/boltRecord/boltList`, {
            basicHeightId: params.id,
            productCategoryId: params.boltId
        })
        setDataSource(data);
    }

    useEffect(() => {
        getDataSource();
    }, [])

    return <>
        <DetailContent>
            <Space direction="horizontal" size="small" className={styles.topbtn}>
                {/* <Button type="primary" ghost>导出</Button> */}
                <Button type="primary" onClick={() => downloadTemplate('/tower-science/boltRecord/exportTemplate', '螺栓导入模板')} ghost>模板下载</Button>
            </Space>
            <Space direction="horizontal" size="small" className={`${styles.topbtn} ${styles.btnRight}`}>
                <Button type="primary" disabled={params.status !== '2' || !isShow} ghost onClick={() => {
                    if (editorLock === '编辑') {
                        setColumns(columns);
                        setEditorLock('锁定');
                        const newData = dataSource.map((res: IData) => {
                            return {
                                ...res,
                                unbuckleLength: res.unbuckleLength === -1 ? 0 : res.unbuckleLength
                            }
                        })
                        form.setFieldsValue({ data: [...newData] })
                    } else {
                        const newRowChangeList: number[] = Array.from(new Set(rowChangeList));
                        if (form) {
                            form.validateFields().then(res => {
                                let values = form.getFieldsValue(true).data;
                                if (values) {
                                    let changeValues = values.filter((item: any, index: number) => {
                                        return newRowChangeList.indexOf(index) !== -1;
                                    })
                                    changeValues = changeValues.map((res: []) => {
                                        return {
                                            ...res,
                                            basicHeightId: params.id,
                                            productCategoryId: params.boltId,
                                        }
                                    })
                                    RequestUtil.put(`/tower-science/boltRecord`, [...changeValues]).then(res => {
                                        setColumns(columnsSetting);
                                        setEditorLock('编辑');
                                        setRowChangeList([]);
                                        form.resetFields();
                                        getDataSource();
                                    });
                                } else {
                                    setColumns(columnsSetting);
                                    setEditorLock('编辑');
                                    form.resetFields();
                                    getDataSource();
                                }
                            })
                        }
                    }
                }}>{editorLock}</Button>
                <Upload
                    action={() => {
                        const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                        return baseUrl + '/tower-science/boltRecord/import'
                    }}
                    headers={
                        {
                            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    data={{ basicHeightId: params.id, productCategoryId: params.boltId }}
                    showUploadList={false}
                    onChange={(info) => {
                        if (info.file.response && !info.file.response?.success) {
                            message.warning(info.file.response?.msg)
                        }
                        if (info.file.response && info.file.response?.success) {
                            if (Object.keys(info.file.response?.data).length > 0) {
                                setUrl(info.file.response?.data);
                                setUrlVisible(true);
                            } else {
                                message.success('导入成功！');
                                getDataSource();
                            }
                        }
                    }}
                    disabled={params.status !== '2' || !isShow}
                >
                    <Button type="primary" disabled={params.status !== '2' || !isShow} ghost>导入</Button>
                </Upload>
                {params.status === '2' || isShow ? editorLock === '锁定' ? <Button type="primary" disabled ghost>添加</Button> : <BoltNewModal id={params.boltId} basicHeightId={params.id} updataList={() => { getDataSource() }} /> : null}
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </Space>
            <Form form={form}>
                <CommonTable columns={tableColumns} dataSource={dataSource} pagination={false} onRow={() => ({ className: AbstractMngtComponentStyles.tableRow })} />
            </Form>
        </DetailContent>
        <Modal
            visible={urlVisible}
            onOk={() => {
                window.open(url);
                setUrlVisible(false);
            }}
            onCancel={() => { setUrlVisible(false); setUrl('') }}
            title='提示'
            okText='下载'
        >
            当前存在错误数据，请重新下载上传！
        </Modal>
    </>
}