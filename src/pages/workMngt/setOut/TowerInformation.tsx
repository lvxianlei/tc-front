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
import { productTypeOptions, towerStructureOptions } from '../../../configuration/DictionaryOptions';
import { useForm } from 'antd/es/form/Form';
import { ColumnType } from 'antd/lib/table';
import ChooseMaterials from './ChooseMaterials';

interface Column extends ColumnType<object> {
    editable?: boolean;
}

export default function TowerInformation(): React.ReactNode {

    const { loading, data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<SelectDataNode[]>(`/tower-system/department`);
        resole(data);
    }), {})
    const departmentData: any = data || [];

    // const { data: otherQuota } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
    //     const result = await RequestUtil.get<any>(`/tower-science/projectPrice/list?current=1&size=1000&category=4`);
    //     resole(result?.records || [])
    // }), {})


    const { data: loftingQuota } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const result = await RequestUtil.get<any>(`/tower-science/projectPrice/list?current=1&size=1000&category=1`);
        resole(result?.records || [])
    }), {})

    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles && roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            } else {
                role.children = []
            }
        });
        return roles;
    }

    const renderTreeNodes = (data: any) => data.map((item: any) => {
        if (item.children) {
            return (<TreeNode key={item.id} title={item.name} value={item.id} className={styles.node} >
                {renderTreeNodes(item.children)}
            </TreeNode>);
        }
        return <TreeNode {...item} key={item.id} title={item.name} value={item.id} />;
    });

    const onDepartmentChange = async (value: Record<string, any>, title?: string) => {
        const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
        switch (title) {
            case "loftingUserDept":
                return setLoftingUser(userData.records);
        };
    }

    const rowChange = (index: number) => {
        rowChangeList.push(index);
        setRowChangeList([...rowChangeList]);
    }

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
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
            type: 'select',
            enum: [
                { "value": "1", "label": "是" },
                { "value": "0", "label": "否" }
            ],
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "isExternalModel"]} initialValue={_} rules={[{
                    required: true,
                    message: '请选择外来模型'
                }]} >
                    <Select style={{ width: '120px' }} placeholder="请选择外来模型">
                        <Select.Option value="1" key="1">是</Select.Option>
                        <Select.Option value="0" key="0">否</Select.Option>
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
                <Form.Item name={['data', index, "structure"]} initialValue={_}>
                    {
                        towerStructureOptions?.map((item: any, index: number) =>
                            <Select.Option value={item.id} key={index}>
                                {item.name}
                            </Select.Option>
                        )
                    }
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
            key: 'loftingUser',
            title: '放样人',
            width: 80,
            dataIndex: 'loftingUser',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "loftingUser"]} initialValue={_}>
                    {
                        productTypeOptions?.map((item: any, index: number) =>
                            <Select.Option value={item.id} key={index}>
                                {item.name}
                            </Select.Option>
                        )
                    }
                </Form.Item>
            )
        },
        {
            key: 'loftingMutualReview',
            title: '放样互审',
            width: 80,
            dataIndex: 'loftingMutualReview',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "loftingMutualReview"]} initialValue={_}>
                    {
                        productTypeOptions?.map((item: any, index: number) =>
                            <Select.Option value={item.id} key={index}>
                                {item.name}
                            </Select.Option>
                        )
                    }
                </Form.Item>
            )
        },
        {
            key: 'checkUser',
            title: '校核人',
            width: 80,
            dataIndex: 'checkUser',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "checkUser"]} initialValue={_}>
                    {
                        productTypeOptions?.map((item: any, index: number) =>
                            <Select.Option value={item.id} key={index}>
                                {item.name}
                            </Select.Option>
                        )
                    }
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
            key: 'projectEntries',
            title: '定额条目',
            width: 80,
            dataIndex: 'projectEntries',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, "grooveMeters"]} initialValue={_}>
                    <Select style={{ width: '120px' }} placeholder="请选择定额条目">
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
                    <Select style={{ width: '120px' }} placeholder="请选择辅助设计出图类型">
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
                <Form.Item name={['data', index, "drawPageNum"]} rules={editForm.getFieldsValue(true).cadDrawingType ? [{
                    required: true,
                    message: '请输入图纸页数'
                }] : []} initialValue={_}>
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
                    {userId === record.loftingUser ?
                        <>{
                            record.status === 1 ?
                                <Link to={`/workMngt/setOutList/towerInformation/${params.id}/lofting/${record.id}`}>放样</Link>
                                : <Button type="link" disabled>放样</Button>
                        }</>
                        : null
                    }
                    {userId === record.checkUser ?
                        <>{
                            record.status === 2 ?
                                <Link to={`/workMngt/setOutList/towerInformation/${params.id}/towerCheck/${record.id}`}>校核</Link>
                                : <Button type="link" disabled>校核</Button>
                        }</>
                        : null
                    }
                    <Link to={`/workMngt/setOutList/towerInformation/${params.id}/towerLoftingDetails/${record.id}`}>明细</Link>
                    {
                        record.status === 1 ?
                            <Popconfirm
                                title="确认删除?"
                                onConfirm={() => RequestUtil.delete(`/tower-science/productSegment?productSegmentGroupId=${record.id}`).then(res => {
                                    onRefresh();
                                })}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type="link">删除</Button>
                            </Popconfirm>
                            : <Button type="link" disabled>删除</Button>
                    }
                    <Popconfirm
                        title="确认完成放样?"
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
                                                RequestUtil.put(`/tower-science/productSegment/complete?productSegmentId=${record.id}`).then(res => {
                                                    message.success('放样完成！');
                                                    setRefresh(!refresh);
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
                        <Button type="link">完成放样</Button>
                    </Popconfirm>
                    <Popconfirm
                        title="确认完成校核?"
                        onConfirm={() => RequestUtil.post(`/tower-science/productSegment/completed/check`).then(res => {
                            onRefresh();
                            message.success('校核成功！')
                        })}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">完成校核</Button>
                    </Popconfirm>
                    {/* <TowerLoftingAssign
                        type={record.status === 1 ? 'edit' : 'detail'}
                        title="分派信息"
                        detailData={{ ...record, loftingUser: record.loftingUser + '-' + record.loftingUserName, checkUser: record.checkUser + '-' + record.checkUserName }}
                        id={params.id}
                        patternName={record.pattern}
                        update={onRefresh}
                        rowId={record.id}
                    />
                    <Button type="link" onClick={async () => {
                        const data: ISectionData[] = await RequestUtil.get(`/tower-science/productSegment/segmentList`, { productSegmentGroupId: record.id });
                        setSectionData(data);
                        setVisible(true);
                        form.setFieldsValue({ data: [...data] });
                        setRecordStatus(record.status)
                    }}>段模式</Button> */}
                </Space>
            )
        }
    ]

    // const sectionColumns = [
    //     {
    //         title: '段号',
    //         dataIndex: 'segmentName',
    //         key: 'segmentName',
    //         width: '50%'
    //     },
    //     {
    //         title: '模式',
    //         dataIndex: 'pattern',
    //         key: 'pattern',
    //         width: '50%',
    //         render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
    //             <Form.Item name={['data', index, 'pattern']} rules={[{
    //                 required: true,
    //                 message: '请选择模式'
    //             }]}>
    //                 <Select style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode} disabled={recordStatus === 3}>
    //                     {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
    //                         return <Select.Option key={index} value={id}>
    //                             {name}
    //                         </Select.Option>
    //                     })}
    //                 </Select>
    //             </Form.Item>
    //         )
    //     }
    // ]

    const onRefresh = () => {
        setRefresh(!refresh);
    }

    // const saveSection = () => {
    //     const value = form.getFieldsValue(true).data;
    //     RequestUtil.post(`/tower-science/productSegment/updateSegmentPattern`, [...value]).then(res => {
    //         setVisible(false);
    //         setRefresh(!refresh);
    //     })
    // }

    const closeOrEdit = () => {
        if (editorLock === '编辑') {
            setTableColumns(columns);
            setEditorLock('保存');
        } else {
            const newRowChangeList: number[] = Array.from(new Set(rowChangeList));
            let values = editForm.getFieldsValue(true).data;
            if (values) {
                let changeValues = values.filter((item: any, index: number) => {
                    return newRowChangeList.indexOf(index) !== -1;
                })
                if (changeValues && changeValues.length > 0) {
                    console.log(changeValues)
                    // RequestUtil.post(`/tower-science/productStructure/save`, changeValues.map((res: any) => {
                    //     return {
                    //         ...res, productCategoryId: params.id
                    //     }
                    // })).then(res => {
                    //     setTableColumns(columnsSetting);
                    //     setEditorLock('编辑');
                    //     setRowChangeList([]);
                    //     editForm.resetFields();
                    //     setRefresh(!refresh);
                    // });
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
    const [loftingUser, setLoftingUser] = useState([]);
    const location = useLocation<{ loftingLeader: string, status: number, name: string, planNumber: string }>();
    const userId = AuthUtil.getUserId();
    const [visible, setVisible] = useState(false);
    const [rowId, setRowId] = useState<string>('');
    const [editForm] = useForm();
    const [loading1, setLoading1] = useState(false);
    const [rowChangeList, setRowChangeList] = useState<number[]>([]);
    const [editorLock, setEditorLock] = useState('编辑');
    const [tableColumns, setTableColumns] = useState(columnsSetting);
    const [filterValue, setFilterValue] = useState({});

    return <>
        {/* <Modal title="段模式" visible={visible} onCancel={() => setVisible(false)} footer={<Space direction="horizontal" size="small" >
            <Button onClick={() => setVisible(false)}>关闭</Button>
            {
                recordStatus === 3 ?
                    null : <Button type="primary" onClick={saveSection} ghost>保存</Button>
            }
        </Space>}>
            <Form form={form} className={styles.sectionModal}>
                <Table columns={sectionColumns} pagination={false} dataSource={sectionData} />
            </Form>
        </Modal> */}
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
                    <Select.Option value="1" key="1">放样中</Select.Option>
                    <Select.Option value="2" key="2">校核中</Select.Option>
                    <Select.Option value="3" key="3">已完成</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label='人员' name='personnel'>
                <Row>
                    <Col>
                        <Form.Item name="personnelDept">
                            <TreeSelect placeholder="请选择" onChange={(value: any) => { onDepartmentChange(value, 'loftingUserDept') }} style={{ width: "150px" }}>
                                {renderTreeNodes(wrapRole2DataNode(departmentData))}
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="personnel">
                            <Select placeholder="请选择" style={{ width: "150px" }}>
                                {loftingUser && loftingUser.map((item: any) => {
                                    return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
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
                        <Link to={`/workMngt/setOutList/towerInformation/${params.id}/lofting/null`}><Button type='primary' ghost>放样</Button> </Link>
                        <Link to={{ pathname: `/workMngt/setOutList/towerInformation/${params.id}/modalList`, state: { status: location.state?.status } }}><Button type="primary" ghost>模型</Button></Link>
                        <Link to={{ pathname: `/workMngt/setOutList/towerInformation/${params.id}/processCardList`, state: { status: location.state?.status } }}><Button type="primary" ghost>大样图工艺卡</Button></Link>
                        <Link to={{ pathname: `/workMngt/setOutList/towerInformation/${params.id}/NCProgram`, state: { status: location.state?.status } }}><Button type="primary" ghost>NC程序</Button></Link>
                        {
                            userId === location.state?.loftingLeader ?
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
                                    <TowerLoftingAssign title="塔型放样分派" id={params.id} update={onRefresh} type="edit" />
                                </>
                                : null
                        }
                        <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                    </Space>
                </>}
                searchFormItems={[]}
                // searchFormItems={[
                //     {
                //         name: 'updateStatusTime',
                //         label: '最新状态变更时间',
                //         children: <DatePicker.RangePicker />
                //     },
                //     {
                //         name: 'status',
                //         label: '放样状态',
                //         children: <Select style={{ width: '120px' }} placeholder="请选择">
                //             <Select.Option value="" key="4">全部</Select.Option>
                //             <Select.Option value="1" key="1">放样中</Select.Option>
                //             <Select.Option value="2" key="2">校核中</Select.Option>
                //             <Select.Option value="3" key="3">已完成</Select.Option>
                //         </Select>
                //     },
                //     {
                //         name: 'personnel',
                //         label: '人员',
                //         children: <Row>
                //             <Col>
                //                 <Form.Item name="personnelDept">
                //                     <TreeSelect placeholder="请选择" onChange={(value: any) => { onDepartmentChange(value, 'loftingUserDept') }} style={{ width: "150px" }}>
                //                         {renderTreeNodes(wrapRole2DataNode(departmentData))}
                //                     </TreeSelect>
                //                 </Form.Item>
                //             </Col>
                //             <Col>
                //                 <Form.Item name="personnel">
                //                     <Select placeholder="请选择" style={{ width: "150px" }}>
                //                         {loftingUser && loftingUser.map((item: any) => {
                //                             return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                //                         })}
                //                     </Select>
                //                 </Form.Item>
                //             </Col>
                //         </Row>
                //     }
                // ]}
                // onFilterSubmit={(values: Record<string, any>) => {
                //     if (values.updateStatusTime) {
                //         const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                //         values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                //         values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
                //     }
                //     return values;
                // }}
                tableProps={{
                    pagination: false
                }}
            />

        </Form>
    </>
}