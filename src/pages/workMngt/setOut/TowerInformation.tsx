/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-工作目录
*/

import React, { useState } from 'react';
import { Space, DatePicker, Select, Button, Popconfirm, message, Row, Col, Form, TreeSelect, Modal, Input, InputNumber } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import TowerLoftingAssign from './TowerLoftingAssign';
import RequestUtil from '../../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import useRequest from '@ahooksjs/use-request';
import AuthUtil from '../../../utils/AuthUtil';
import { towerStructureOptions } from '../../../configuration/DictionaryOptions';
import { useForm } from 'antd/es/form/Form';
import { ColumnType } from 'antd/lib/table';
import ChooseMaterials from './ChooseMaterials';

interface Column extends ColumnType<object> {
    editable?: boolean;
}

export default function TowerInformation(): React.ReactNode {
    const [optionalList, setOptionalList] = useState<any>()

    const { data: loftingQuota } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const result = await RequestUtil.get<any>(`/tower-science/projectPrice/list?current=1&size=1000&category=1`);
        resole(result?.records || [])
    }), {})

    const { data: userList } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-system/employee?deptName=技术部&size=1000`);
            const user = await RequestUtil.get<any>(`/tower-science/productCategory/${params.id}`);
            let loftingUserList: any[] = [];
            let loftingMutualReviewList: any[] = [];
            let programmingLeaderList: any[] = [];
            result?.records?.forEach((res: any) => {
                if (user?.loftingUser.split(',').indexOf(res.userId) > -1) {
                    loftingUserList.push(res)
                }
                if (user?.loftingMutualReview.split(',').indexOf(res.userId) > -1) {
                    loftingMutualReviewList.push(res)
                }
                if (user?.programmingLeader.split(',').indexOf(res.userId) > -1) {
                    programmingLeaderList.push(res)
                }
            })
            setOptionalList({
                loftingUserList: loftingUserList,
                loftingMutualReviewList: loftingMutualReviewList,
                programmingLeaderList: programmingLeaderList
            })
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }), {})

    const rowChange = (index: number) => {
        rowChangeList.push(index);
        setRowChangeList([...rowChangeList]);
    }

    const columns = [
        {
            key: 'id',
            title: '序号',
            dataIndex: 'id',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<><span>{index + 1}</span><Form.Item name={['data', index, "id"]} initialValue={_} style={{ display: "none" }}>
                <Input size="small" onChange={() => rowChange(index)} />
            </Form.Item></>)
        },
        {
            key: 'segmentName',
            title: '段信息',
            width: 80,
            dataIndex: 'segmentName'
        },
        {
            key: 'isExternalModel',
            title: '外来模型',
            width: 80,
            dataIndex: 'isExternalModel',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "isExternalModel"]} initialValue={_} rules={[{
                    required: true,
                    message: '请选择外来模型'
                }]} >
                    <Select style={{ width: '120px' }} placeholder="请选择外来模型" onChange={() => rowChange(index)}>
                        <Select.Option value={'是'} key="1">是</Select.Option>
                        <Select.Option value={'否'} key="0">否</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'structure',
            title: '结构',
            width: 50,
            dataIndex: 'structure',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "structureId"]} initialValue={record?.structureId}>
                    <Select style={{ width: '120px' }} placeholder="请选择结构" onChange={() => rowChange(index)} allowClear>
                        {
                            towerStructureOptions?.map((item: any, index: number) =>
                                <Select.Option value={item.id} key={index}>
                                    {item.name}
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'completeTime',
            title: '完成放样时间',
            width: 120,
            dataIndex: 'completeTime'
        },
        {
            key: 'loftingUserName',
            title: '放样人',
            width: 80,
            dataIndex: 'loftingUserName',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "loftingUser"]} initialValue={record?.loftingUser?.split(',')} rules={[{
                    required: true,
                    message: '请选择放样人'
                }]} >
                    <Select style={{ width: '120px' }} placeholder="请选择放样人" mode='multiple' onChange={() => rowChange(index)}>
                        {
                            optionalList.loftingUserList?.map((item: any, index: number) =>
                                <Select.Option value={item.userId} key={index}>
                                    {item.name}
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'loftingMutualReviewName',
            title: '放样互审',
            width: 80,
            dataIndex: 'loftingMutualReviewName',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "loftingMutualReview"]} initialValue={record?.loftingMutualReview?.split(',')} rules={[{
                    required: true,
                    message: '请选择放样互审'
                }]} >
                    <Select style={{ width: '120px' }} placeholder="请选择放样互审" mode='multiple' onChange={() => rowChange(index)}>
                        {
                            optionalList.loftingMutualReviewList?.map((item: any, index: number) =>
                                <Select.Option value={item.userId} key={index}>
                                    {item.name}
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'checkUserName',
            title: '校核人',
            width: 80,
            dataIndex: 'checkUserName',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "checkUser"]} initialValue={record?.checkUser?.split(',')} rules={[{
                    required: true,
                    message: '请选择校核人'
                }]} >
                    <Select style={{ width: '120px' }} placeholder="请选择校核人" mode='multiple' onChange={() => rowChange(index)}>
                        {
                            optionalList.programmingLeaderList?.map((item: any, index: number) =>
                                <Select.Option value={item.userId} key={index}>
                                    {item.name}
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'statusName',
            title: '放样状态',
            width: 80,
            dataIndex: 'statusName'
        },
        {
            key: 'codeCount',
            title: '件号总数',
            width: 80,
            dataIndex: 'codeCount'
        },
        {
            key: 'totalNum',
            title: '总件数',
            width: 80,
            dataIndex: 'totalNum'
        },
        {
            key: 'totalWeight',
            title: '总重kg',
            width: 80,
            dataIndex: 'totalWeight'
        },
        {
            key: 'projectEntriesName',
            title: '定额条目',
            width: 80,
            dataIndex: 'projectEntriesName',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "projectEntries"]} initialValue={record.projectEntries}>
                    <Select style={{ width: '120px' }} placeholder="请选择定额条目" onChange={() => rowChange(index)}>
                        {loftingQuota && loftingQuota?.map((item: any) => {
                            return <Select.Option key={item.id} value={item.id}>{item.projectEntries}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'price',
            title: '放样单价',
            width: 80,
            dataIndex: 'price'
        },
        {
            key: 'cadDrawingType',
            title: '辅助设计出图类型',
            width: 120,
            dataIndex: 'cadDrawingType',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "cadDrawingType"]} initialValue={_}>
                    <Select style={{ width: '120px' }} placeholder="请选择辅助设计出图类型" allowClear onChange={() => rowChange(index)}>
                        <Select.Option value="普通图纸" key="1">普通图纸</Select.Option>
                        <Select.Option value="核算重量图纸" key="0">核算重量图纸</Select.Option>
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'drawPageNum',
            title: '图纸页数',
            width: 80,
            dataIndex: 'drawPageNum',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "drawPageNum"]} initialValue={_}>
                    <InputNumber min={1} max={9999} onChange={() => rowChange(index)} />
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
                    <Input.TextArea maxLength={400} onChange={() => rowChange(index)} />
                </Form.Item>
            )
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 150,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 250,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Link to={`/workMngt/setOutList/towerInformation/${params.id}/lofting/${record.id}`}>放样</Link>
                    {
                        record.status > 1 ?
                            <Link to={`/workMngt/setOutList/towerInformation/${params.id}/towerCheck/${record.id}`}>校核</Link>
                            : <Button type="link" disabled>校核</Button>
                    }
                    <Link to={`/workMngt/setOutList/towerInformation/${params.id}/towerLoftingDetails/${record.id}`}>明细</Link>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => RequestUtil.delete(`/tower-science/productSegment?segmentId=${record.id}`).then(res => {
                            onRefresh();
                        })}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                    <Popconfirm
                        title="确认完成放样?"
                        disabled={record.status !== 1}
                        onConfirm={() => {
                            RequestUtil.get(`/tower-science/productSegment/submit/check?productSegmentId=${record.id}`).then(res => {
                                console.log(res)
                                if (res) {
                                    RequestUtil.post(`/tower-science/productSegment/complete?productSegmentId=${record.id}`).then(res => {
                                        onRefresh();
                                        message.success('放样完成！')
                                    })
                                } else {
                                    Modal.confirm({
                                        title: "当前存在未上传的大样图或工艺卡，是否完成放样？",
                                        onOk: async () => new Promise(async (resove, reject) => {
                                            try {
                                                RequestUtil.post(`/tower-science/productSegment/complete?productSegmentId=${record.id}`).then(res => {
                                                    message.success('放样完成！');
                                                    onRefresh();
                                                })
                                                resove(true)
                                            } catch (error) {
                                                reject(error)
                                            }
                                        })
                                    })
                                }
                            })
                        }
                        }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" disabled={record.status !== 1}>完成放样</Button>
                    </Popconfirm>
                    <Popconfirm
                        title="确认完成校核?"
                        disabled={record.status !== 2}
                        onConfirm={() => RequestUtil.post(`/tower-science/productSegment/completed/check?productSegmentId=${record.id}`).then(res => {
                            onRefresh();
                            message.success('校核成功！')
                        })}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" disabled={record.status !== 2}>完成校核</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const onRefresh = () => {
        history.go(0)
    }

    const closeOrEdit = () => {
        if (editorLock === '编辑') {
            setTableColumns(columns);
            setEditorLock('保存');
        } else {
            const newRowChangeList: number[] = Array.from(new Set(rowChangeList));
            editForm.validateFields().then(res => {
                let values = editForm.getFieldsValue(true).data;
                if (values) {
                    let changeValues = values.filter((item: any, index: number) => {
                        return newRowChangeList.indexOf(index) !== -1;
                    })
                    if (changeValues && changeValues.length > 0) {
                        const tip: boolean[] = []
                        changeValues.forEach((res: any) => {
                            if (!!(res.cadDrawingType)) {
                                console.log('kkk')
                                if (!!(res.drawPageNum)) {
                                    tip.push(true)
                                } else {
                                    tip.push(false)
                                }
                            } else {
                                tip.push(true)
                            }
                        });
                        if (tip.indexOf(false) !== -1) {
                            message.warning('存在辅助设计出图类型，请填写图纸页数')
                        } else {
                            RequestUtil.post(`/tower-science/productSegment`, [
                                ...changeValues.map((res: any) => {
                                    return {
                                        ...res,
                                        loftingUser: res?.loftingUser?.join(','),
                                        loftingMutualReview: res?.loftingMutualReview?.join(','),
                                        checkUser: res?.checkUser?.join(','),
                                    }
                                })
                            ]).then(res => {
                                setTableColumns(columnsSetting);
                                setEditorLock('编辑');
                                setRowChangeList([]);
                                editForm.resetFields();
                                setRefresh(!refresh);
                            });

                        }
                    } else {
                        setTableColumns(columnsSetting);
                        setEditorLock('编辑');
                        setRowChangeList([]);
                        editForm.resetFields();
                    }
                } else {
                    setTableColumns(columnsSetting);
                    setEditorLock('编辑');
                    setRowChangeList([]);
                    editForm.resetFields();
                }
            })
        }
    }

    const columnsSetting: Column[] = columns.map((col: Column) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_ === -1 ? undefined : _}</span>
            )
        }
    })

    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [refresh, setRefresh] = useState(false);
    const location = useLocation<{ loftingLeader: string, status: number, name: string, planNumber: string }>();
    const userId = AuthUtil.getUserId();
    const [visible, setVisible] = useState(false);
    const [editForm] = useForm();
    const [loading1, setLoading1] = useState(false);
    const [rowChangeList, setRowChangeList] = useState<number[]>([]);
    const [editorLock, setEditorLock] = useState('编辑');
    const [tableColumns, setTableColumns] = useState(columnsSetting);
    const [filterValue, setFilterValue] = useState({});

    const { data: isShow } = useRequest<boolean>(() => new Promise(async (resole, reject) => {
        try {
            let result = await RequestUtil.get<any>(`/tower-science/productCategory/assign/user/list/${params.id}`);
            result.indexOf(userId) === -1 ? resole(false) : resole(true)
        } catch (error) {
            reject(error)
        }
    }), {})

    return <>
        <Modal
            destroyOnClose
            key='DetailsQuestionnaire'
            visible={visible}
            width="80%"
            title="挑料清单"
            footer={<Button onClick={() => setVisible(false)}>关闭</Button>}
            onCancel={() => {
                setVisible(false);
            }}>
            <ChooseMaterials id={params.id} name={location.state?.name || ''} planNumber={location.state?.planNumber || ''} />
        </Modal>
        <Form layout="inline" onFinish={(value: Record<string, any>) => {
            if (value.updateStatusTime) {
                const formatDate = value.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(value)
            setRefresh(!refresh);
        }}>
            <Form.Item label='最新状态变更时间' name='updateStatusTime'>
                <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item label='放样状态' name='status'>
                <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="" key="4">全部</Select.Option>
                    <Select.Option value={1} key="1">放样中</Select.Option>
                    <Select.Option value={2} key="2">校核中</Select.Option>
                    <Select.Option value={3} key="3">已完成</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label='人员' name='personnel'>
                <Select placeholder="请选择" style={{ width: "150px" }}>
                    {userList && userList.map((item: any) => {
                        return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">查询</Button>
            </Form.Item>
            <Form.Item>
                <Button htmlType="reset">重置</Button>
            </Form.Item>
        </Form>
        <Form form={editForm} className={styles.descripForm}>
            <Page
                path={`/tower-science/productSegment`}
                columns={tableColumns}
                headTabs={[]}
                refresh={refresh}
                exportPath={`/tower-science/productSegment`}
                requestData={{ productCategoryId: params.id, ...filterValue }}
                extraOperation={<>
                    <span>塔型：<span>{location.state?.name}</span></span>
                    <span>计划号：<span>{location.state?.planNumber}</span></span>
                    <Space direction="horizontal" size="small" style={{ position: 'absolute', right: 0, top: 0 }}>
                        <Button type='primary' onClick={() => setVisible(true)} ghost>挑料清单</Button>
                        <Button type="primary" onClick={closeOrEdit} ghost>{editorLock}</Button>
                        <Link to={`/workMngt/setOutList/towerInformation/${params.id}/lofting/all`}><Button type='primary' ghost>放样</Button> </Link>
                        <Link to={{ pathname: `/workMngt/setOutList/towerInformation/${params.id}/modalList` }}><Button type="primary" ghost>模型</Button></Link>
                        <Link to={{ pathname: `/workMngt/setOutList/towerInformation/${params.id}/processCardList` }}><Button type="primary" ghost>大样图工艺卡</Button></Link>
                        <Link to={{ pathname: `/workMngt/setOutList/towerInformation/${params.id}/NCProgram` }}><Button type="primary" ghost>NC程序</Button></Link>
                        {
                            isShow ?
                                <>
                                    <Popconfirm
                                        title="确认提交?"
                                        onConfirm={() => {
                                            setLoading1(true);
                                            RequestUtil.post(`/tower-science/productCategory/submit`, { productCategoryId: params.id }).then(res => {
                                                message.success('提交成功');
                                                history.goBack();
                                            }).catch(error => {
                                                setLoading1(false);
                                            });
                                        }}
                                        okText="提交"
                                        cancelText="取消"
                                        disabled={!(location.state?.status < 3)}
                                    >
                                        <Button type="primary" loading={loading1} disabled={!(location.state?.status < 3)} ghost>提交</Button>
                                    </Popconfirm>
                                    <TowerLoftingAssign id={params.id} update={onRefresh} type="edit" />
                                </>
                                : null
                        }
                        <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                    </Space>
                </>}
                searchFormItems={[]}
                tableProps={{
                    pagination: false
                }}
            />
        </Form>
    </>
}