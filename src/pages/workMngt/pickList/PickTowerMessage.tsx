import React, { useState } from 'react';
import { Space, Button, Popconfirm, Input, Form, message, Modal, Select, DatePicker, Row, Col } from 'antd';
// import { SearchTable as Page } from '../../common';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import styles from './pickTowerMessage/Pick.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import { IntgSelect, Page } from '../../common'
import TowerPickAssign from './TowerPickAssign';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
// import styles from './pick.module.less';
import useRequest from '@ahooksjs/use-request';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';
import moment from 'moment';
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
    const [filterValue, setFilterValue] = useState({});
    const [editorLock, setEditorLock] = useState('编辑');
    const onRefresh = () => {
        history.go(0)
    }
    const pathLink = () => {
        history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/2/${params.materialLeader}`)
    }
    const [formRef] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [user, setUser] = useState<any | undefined>([]);
    const [materialCheckLeaders, setMaterialCheckLeaders] = useState<any | undefined>([]);
    const [list, setList] = useState<any | undefined>([]);
    const [detail, setDetail] = useState<any>([]);
    const [detailTop, setDetailTop] = useState<any>({});
    const [form] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [rowChangeList, setRowChangeList] = useState<number[]>([]);

    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const detailTop: any = await RequestUtil.get(`/tower-science/materialProductCategory/${params.id}`);
        setDetailTop(detailTop);
        const list: any = await RequestUtil.get(`/tower-science/projectPrice/list?current=1&size=1000&category=2&productType=${detailTop?.productType}`);
        setList(list?.records);
        getUserList();
        resole(data)
    }), {})

    const { run: getUserList } = useRequest(() => new Promise(async (resole, reject) => {
        const users: any = await RequestUtil.get(`/tower-science/drawProductSegment/leader/${params.id}`)
        setUser(users?.materialLeaders && Array.isArray(users?.materialLeaders) && users?.materialLeaders.length > 0 ? users?.materialLeaders : [])
        setMaterialCheckLeaders(users?.materialCheckLeaders && Array.isArray(users?.materialCheckLeaders) && users?.materialCheckLeaders.length > 0 ? users?.materialCheckLeaders : [])
        resole(data)
    }), {})


    const handleModalSave = async () => {
        try {
            const data = await form.validateFields();
            const saveTableData = data.detailData.map((item: any, index: number) => {
                return {
                    segmentId: item.id,
                    ...item,
                    id: item.id === -1 ? '' : item.id,
                }
            });
            // const saveData={
            //     productCategoryId: params.id,
            //     // productId: productId,
            //     productSegmentListDTOList: saveTableData
            // }
            RequestUtil.post(`/tower-science/drawProductSegment/pattern/submit`, saveTableData).then(() => {
                message.success('保存成功！');
                setVisible(false);
                // setProductId('');
                form.resetFields();
            }).then(() => {
                setRefresh(!refresh);
            })
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalCancel = () => {
        setVisible(false);; setDetail([]); form.setFieldsValue({
            detailData: {}
        })
    };
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
            title: '段信息',
            width: 100,
            dataIndex: 'segmentName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <>
                    <span>{_}</span>
                    <Form.Item
                        name={['data', index, "segmentName"]}
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
            key: 'projectEntries',
            title: '定额条目',
            width: 150,
            editable: true,
            dataIndex: 'projectEntries',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['data', index, "projectEntries"]}
                    initialValue={record.projectEntries}
                >
                    <Select onChange={() => rowChange(index)} allowClear>
                        {list && list.map((item: any, index: number) => {
                            return <Select.Option key={index} value={item?.projectEntries}>
                                {item?.projectEntries}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'completeStatusTime',
            title: '提料完成时间',
            dataIndex: 'completeStatusTime',
            width: 100,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['data', index, "completeStatusTime"]}
                    initialValue={_ ? moment(_) : ''}
                    rules={[{
                        required: true,
                        message: '请选择提料完成时间'
                    }]}
                >
                    <DatePicker format={'YYYY-MM-DD HH:mm:ss'} showTime onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            title: '提料人',
            dataIndex: 'materialLeaderName',
            key: 'materialLeaderName',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['data', index, "materialLeader"]}
                    initialValue={record?.materialLeader}
                    rules={[{
                        required: true,
                        message: '请选择提料人'
                    }]}
                >
                    <Select style={{ width: '100%' }} onChange={() => rowChange(index)}>
                        {user && user.map((item: any) => {
                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            title: '校核人',
            dataIndex: 'materialCheckLeaderName',
            key: 'materialCheckLeaderName',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['data', index, "materialCheckLeader"]}
                    initialValue={record?.materialCheckLeader}
                    rules={[{
                        required: true,
                        message: '请选择校核人'
                    }]}
                >
                    <Select style={{ width: '100%' }} onChange={() => rowChange(index)}>
                        {materialCheckLeaders && materialCheckLeaders.map((item: any) => {
                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'statusName',
            title: '提料状态',
            width: 200,
            dataIndex: 'statusName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <>
                    <span>{_}</span>
                    <Form.Item
                        name={['data', index, "status"]}
                        initialValue={record?.status}
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
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
    ];

    const columnsSetting: Column[] = columns.map((col: any) => {
        if (!col.editable) {
            return col;
        }
        if (col.dataIndex === 'operation') {
            return {
                ...col,
            }
        } else {
            return {
                ...col,
                render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                    <p className={styles.normal}>{_ === -1 ? 0 : _}</p>
                )
            }
        }
    })

    const [tableColumns, setColumns] = useState(columnsSetting);
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        if (value.materialLeader) {
            value.materialLeader = value.materialLeader?.value;
        }
        if (value.materialCheckLeader) {
            value.materialCheckLeader = value.materialCheckLeader?.value;
        }
        setFilterValue(value)

        setRefresh(!refresh);
        return value
    }

    const rowChange = (index: number) => {
        rowChangeList.push(index);
        setRowChangeList([...rowChangeList]);
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const batchPick = async () => {
        if (selectedKeys.length > 0) {
            const tip: boolean[] = []
            selectedRows.forEach((res: any) => {
                if (res.status !== 1) {
                    tip.push(false)
                } else {
                    tip.push(true)
                }
            })
            if (tip.findIndex(value => value === false) !== -1) {
                message.warning('仅提料中状态可进行完成提料！')
            } else {
                await RequestUtil.post(`/tower-science/drawProductSegment/completedLofting`, selectedKeys).then(() => {
                    message.success('完成提料成功！')
                }).then(() => {
                    history.go(0);
                    setSelectedKeys([]);
                    setSelectedRows([]);
                })
            }
        } else {
            message.warning('请选择需要完成提料的数据！')
        }
    }

    const batchCheck = async () => {
        if (selectedKeys.length > 0) {
            const tip: boolean[] = []
            selectedRows.forEach((res: any) => {
                if (res.status !== 2) {
                    tip.push(false)
                } else {
                    tip.push(true)
                }
            })
            if (tip.findIndex(value => value === false) !== -1) {
                message.warning('仅校核中状态可进行完成校核！')
            } else {
                await RequestUtil.post(`/tower-science/drawProductSegment/completed/check`, selectedKeys).then(() => {
                    message.success('完成校核成功！')
                }).then(() => {
                    history.go(0);
                    setSelectedKeys([]);
                    setSelectedRows([]);
                })
            }
        } else {
            message.warning('请选择需要完成校核的数据！')
        }

    }

    return <>
        <Modal title='段模式' width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
            {detail ? <Form initialValues={{ detailData: detail }} autoComplete="off" form={form}>
                <Row>
                    <Form.List name="detailData">
                        {
                            (fields, { add, remove }) => fields.map(
                                field => (
                                    <>
                                        <Col span={1}></Col>
                                        <Col span={11}>
                                            <Form.Item name={[field.name, 'segmentName']} label='段名' initialValue={[field.name, 'segmentName']}>
                                                <Input disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col span={1}></Col>
                                        <Col span={11}>
                                            <Form.Item name={[field.name, 'pattern']} label='模式' initialValue={[field.name, 'pattern']}>
                                                <Select style={{ width: '150px' }} disabled={edit}>
                                                    {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                                        return <Select.Option key={index} value={id}>
                                                            {name}
                                                        </Select.Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </>
                                )
                            )
                        }
                    </Form.List>
                </Row>
            </Form> : null}
            {edit ? null : <Space style={{ position: 'relative', left: '80%' }}>
                <Button type="primary" ghost onClick={() => handleModalCancel()}>关闭</Button>
                <Button type="primary" onClick={() => handleModalSave()}>保存</Button>
            </Space>}
        </Modal>
        <Form
            layout="inline"
            style={{ margin: '20px' }}
            onFinish={onFilterSubmit}
        >
            <Form.Item label='最新状态变更时间' name='statusUpdateTime'>
                <DatePicker.RangePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label='提料状态' name='status'>
                <Select style={{ width: '100px' }}>
                    <Select.Option value={''} key={''}>全部</Select.Option>
                    <Select.Option value={1} key={1}>提料中</Select.Option>
                    <Select.Option value={2} key={2}>校核中</Select.Option>
                    <Select.Option value={3} key={3}>已完成</Select.Option>
                    {/* <Select.Option value={4} key={4}>已提交</Select.Option> */}
                </Select>
            </Form.Item>
            <Form.Item label='提料人' name='materialLeader'>
                <IntgSelect width={200} />
            </Form.Item>
            <Form.Item label='校核人' name='materialCheckLeader'>
                <IntgSelect width={200} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">查询</Button>
            </Form.Item>
            <Form.Item>
                <Button htmlType="reset">重置</Button>
            </Form.Item>
        </Form>
        <Form
            form={formRef}
            className={styles.descripForm}
        >
            <Page
                path={`/tower-science/drawProductSegment`}
                tableProps={{
                    pagination: false,
                    rowSelection: {
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }
                }}
                columns={[...tableColumns as any, {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: 'right' as FixedType,
                    width: 100,
                    render: (_: undefined, record: any): React.ReactNode => (
                        <Space direction="horizontal" size="small" className={styles.operationBtn}>
                            <Button onClick={() => { history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${record.id}`) }} type='link' disabled={!(user && user.length > 0 && user.map((item: any) => { return item.userId }).concat([record?.materialLeader]).indexOf(AuthUtil.getUserInfo().user_id) > -1) || params.status === '1'}>提料</Button>
                            <Button onClick={() => { history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/check/${record.id}/${record.materialLeader}`) }} type='link' disabled={record.status !== 2 || !(materialCheckLeaders.length > 0 && materialCheckLeaders.map((item: any) => { return item.userId }).concat([record?.materialCheckLeader]).indexOf(AuthUtil.getUserInfo().user_id) > -1)}>校核</Button>
                            <Button onClick={() => { history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/detail/${record.id}`) }} type='link' disabled={record.status < 3}>明细</Button>
                            {/* <TowerPickAssign type={ record.status < 2 ? 'message' : "detail" } title="指派信息" detailData={ record } id={ record.id } update={ onRefresh } /> */}
                            <Popconfirm
                                title="确认删除?"
                                onConfirm={async () => {
                                    RequestUtil.delete(`/tower-science/drawProductSegment/${record.id}`).then(() => {
                                        message.success('删除成功！')
                                    }).then(() => {
                                        setRefresh(!refresh)
                                    })
                                }}
                                okText="提交"
                                cancelText="取消"
                            // disabled={record.status!== 1}
                            >
                                <Button type='link' >删除</Button>
                            </Popconfirm>
                            {/* <Button onClick={async ()=>{
                                            const data = await RequestUtil.get(`/tower-science/drawProductSegment/pattern/${record.id}`)
                                            setDetail(data);
                                            form.setFieldsValue({
                                                detailData: data
                                            })
                                            if(record.status > 2){
                                                setEdit(true);
                                            }else{
                                                setEdit(false);
                                            }
                                            setVisible(true);
                                        }} type='link'>段模式</Button> */}
                            <Popconfirm
                                title="确认完成提料?"
                                onConfirm={async () => {
                                    await RequestUtil.post(`/tower-science/drawProductSegment/completedLofting`, [record?.id]).then(() => {
                                        message.success('提料成功！')
                                    }).then(() => {
                                        history.go(0)
                                    })
                                }}
                                okText="确认"
                                cancelText="取消"
                                disabled={record.status !== 1}
                            >
                                <Button type="link" ghost disabled={record.status !== 1}>完成提料</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="确认完成校核?"
                                onConfirm={async () => {
                                    await RequestUtil.post(`/tower-science/drawProductSegment/completed/check`, [record?.id]).then(() => {
                                        message.success('校核成功！')
                                    }).then(() => {
                                        history.go(0)
                                    })
                                }}
                                okText="确认"
                                cancelText="取消"
                                disabled={record.status !== 2}
                            >
                                <Button type="link" ghost disabled={record.status !== 2}>完成校核</Button>
                            </Popconfirm>
                        </Space>
                    )
                }]}
                refresh={refresh}
                filterValue={filterValue}
                requestData={{ productCategory: params.id }}
                exportPath="/tower-science/drawProductSegment"
                extraOperation={
                    <Space>
                        <Popconfirm
                            title="确认批量完成提料?"
                            onConfirm={batchPick}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type='primary' ghost>完成提料</Button>
                        </Popconfirm>
                        <Popconfirm
                            title="确认批量完成校核?"
                            onConfirm={batchCheck}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type='primary' ghost>完成校核</Button>
                        </Popconfirm>
                        <Button type="primary" ghost onClick={async () => {
                            if (editorLock === '编辑') {
                                setColumns(columns);
                                setEditorLock('锁定');
                            } else {
                                const newRowChangeList: number[] = Array.from(new Set(rowChangeList));
                                await formRef.validateFields();
                                let values = formRef.getFieldsValue(true).data;
                                if (values && values.length > 0 && newRowChangeList.length > 0) {
                                    let changeValues = values.filter((item: any, index: number) => {
                                        return newRowChangeList.indexOf(index) !== -1;
                                    }).map((item: any) => {
                                        return {
                                            ...item,
                                            completeStatusTime: item?.completeStatusTime ? moment(item?.completeStatusTime).format('YYYY-MM-DD HH:mm:ss') : '',
                                            productCategory: params.id,
                                            productCategoryName: detailTop?.productCategoryName,
                                            // segmentGroupId: params.productSegmentId
                                        }
                                    })
                                    RequestUtil.post(`/tower-science/drawProductSegment/update/segment`, [...changeValues]).then(res => {
                                        setColumns(columnsSetting);
                                        setEditorLock('编辑');
                                        formRef.resetFields()
                                        setRowChangeList([]);
                                        setRefresh(!refresh);
                                        history.go(0)
                                    });
                                } else {
                                    setColumns(columnsSetting);
                                    setEditorLock('编辑');
                                    formRef.resetFields()
                                    setRowChangeList([]);
                                    setRefresh(!refresh);
                                }

                            }
                        }} disabled={formRef.getFieldsValue(true).data && formRef.getFieldsValue(true).data?.length === 0}>{editorLock}</Button>
                        {
                            (user && user.length > 0 && user.map((item: any) => { return item.userId }).concat([params?.materialLeader]).indexOf(AuthUtil.getUserInfo().user_id) > -1) ?
                                <Button type="primary" ghost onClick={
                                    () => history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/all`)
                                } disabled={params.status === '1'}>提料</Button>
                                : null
                        }
                        {
                            (materialCheckLeaders.length > 0 && materialCheckLeaders.map((item: any) => { return item.userId }).concat([params.materialLeader]).indexOf(AuthUtil.getUserInfo().user_id) > -1)
                                ?
                                <Popconfirm
                                    title="确认提交?"
                                    onConfirm={async () => {
                                        await RequestUtil.post(`/tower-science/drawProductSegment/submit/${params.id}`).then(() => {
                                            message.success('提交成功！')
                                        }).then(() => {
                                            history.push('/workMngt/pickList');
                                        })
                                    }}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button type="primary" ghost>提交</Button>
                                </Popconfirm>
                                : null
                        }
                        {(params.status === '1' || params.status === '2') && params.materialLeader === AuthUtil.getUserInfo().user_id ? <TowerPickAssign title="塔型提料指派" id={params.id} update={onRefresh} path={pathLink} /> : null}
                        <Button type="ghost" onClick={() => history.push('/workMngt/pickList')}>返回</Button>
                        <span>塔型：{detailTop?.productCategoryName}</span>
                        <span>计划号：{detailTop?.planNumber}</span>
                        <span>模式：{detailTop?.patternName}</span>
                    </Space>
                }
                searchFormItems={[]}
            />
        </Form>

    </>
}

