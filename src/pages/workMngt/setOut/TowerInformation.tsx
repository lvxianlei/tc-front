/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息
*/

import React, { useRef, useState } from 'react';
import { Space, DatePicker, Select, Button, Popconfirm, message, Row, Col, Form, TreeSelect, Modal, Table } from 'antd';
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
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';
import { useForm } from 'antd/es/form/Form';
import TryAssemble from './TryAssemble';
import { TryAssembleProps } from './ISetOut';

interface ISectionData {

}

export default function TowerInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [refresh, setRefresh] = useState(false);
    const [loftingUser, setLoftingUser] = useState([]);
    const [checkUser, setcheckUser] = useState([]);
    const location = useLocation<{ loftingLeader: string, status: number }>();
    const userId = AuthUtil.getUserId();
    const [visible, setVisible] = useState(false);
    const [sectionData, setSectionData] = useState<ISectionData[]>([]);
    const [form] = useForm();
    const [recordStatus, setRecordStatus] = useState();
    const [loading1, setLoading1] = useState(false);
    const editRef = useRef<TryAssembleProps>();
    const [tryAssembleVisible, setTryAssembleVisiblee] = useState(false);
    const [tryAssemble, setTryAssemble] = useState<[]>([]);

    const { loading, data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<SelectDataNode[]>(`/tower-system/department`);
        resole(data);
    }), {})
    const departmentData: any = data || [];

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
            case "checkUserDept":
                return setcheckUser(userData.records);
        };
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
            key: 'productCategoryName',
            title: '塔型',
            width: 150,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'priorityName',
            title: '优先级',
            dataIndex: 'priorityName',
            width: 120
        },
        {
            key: 'name',
            title: '段包信息',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'pattern',
            title: '段模式',
            width: 150,
            dataIndex: 'pattern'
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            dataIndex: 'plannedDeliveryTime',
            width: 200,

        },
        {
            key: 'trialAssembleName',
            title: '试组装',
            dataIndex: 'trialAssembleName',
            width: 80,
            // render: (pattern: number): React.ReactNode => {
            //     switch (pattern) {
            //         case 1:
            //             return '是';
            //         case 0:
            //             return '否';
            //     }
            // }
        },
        {
            key: 'loftingUserName',
            title: '放样人',
            width: 200,
            dataIndex: 'loftingUserName'
        },
        {
            key: 'checkUserName',
            title: '校核人',
            width: 200,
            dataIndex: 'checkUserName'
        },
        {
            key: 'statusName',
            title: '放样状态',
            width: 200,
            dataIndex: 'statusName',
            // render: (pattern: number): React.ReactNode => {
            //     switch (pattern) {
            //         case 1:
            //             return '放样中';
            //         case 2:
            //             return '校核中';
            //         case 3:
            //             return '已完成';
            //     }
            // }
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 200,
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
                    {
                        record.status === 3 ?
                            <Link to={`/workMngt/setOutList/towerInformation/${params.id}/towerLoftingDetails/${record.id}`}>明细</Link>
                            : <Button type="link" disabled>明细</Button>
                    }
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
                    <TowerLoftingAssign
                        type={record.status === 1 ? 'edit' : 'detail'}
                        title="指派信息"
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
                    }}>段模式</Button>
                </Space>
            )
        }
    ]

    const sectionColumns = [
        {
            title: '段号',
            dataIndex: 'segmentName',
            key: 'segmentName',
            width: '50%'
        },
        {
            title: '模式',
            dataIndex: 'pattern',
            key: 'pattern',
            width: '50%',
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={['data', index, 'pattern']} rules={[{
                    required: true,
                    message: '请选择模式'
                }]}>
                    <Select style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode} disabled={recordStatus === 3}>
                        {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
            )
        }
    ]

    const onRefresh = () => {
        setRefresh(!refresh);
    }

    const saveSection = () => {
        const value = form.getFieldsValue(true).data;
        RequestUtil.post(`/tower-science/productSegment/updateSegmentPattern`, [...value]).then(res => {
            setVisible(false);
            setRefresh(!refresh);
        })
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit();
            message.success('提交成功');
            setTryAssembleVisiblee(false);
            setRefresh(!refresh);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    return <>
        <Modal
            destroyOnClose
            visible={tryAssembleVisible}
            width="40%"
            title="试组装信息"
            onOk={handleModalOk}
            className={styles.tryAssemble}
            onCancel={() => {
                editRef.current?.resetFields()
                setTryAssembleVisiblee(false);
                setRefresh(!refresh);
            }}>
            <TryAssemble id={params.id} type="edit" deatil={tryAssemble} ref={editRef} />
        </Modal>
        <Modal title="段模式" visible={visible} onCancel={() => setVisible(false)} footer={<Space direction="horizontal" size="small" >
            <Button onClick={() => setVisible(false)}>关闭</Button>
            {
                recordStatus === 3 ?
                    null : <Button type="primary" onClick={saveSection} ghost>保存</Button>
            }
        </Space>}>
            <Form form={form}>
                <Table columns={sectionColumns} pagination={false} dataSource={sectionData} />
            </Form>
        </Modal>
        <Page
            path={`/tower-science/productSegment`}
            columns={columns}
            headTabs={[]}
            refresh={refresh}
            exportPath={`/tower-science/productSegment`}
            requestData={{ productCategoryId: params.id }}
            extraOperation={<Space direction="horizontal" size="small">
                <Button type="primary" onClick={async () => {
                    const result: [] = await RequestUtil.get(`/tower-science/productSegmentAssemble/${params.id}`);
                    if (result.length > 0) {
                        setTryAssemble(result)
                        setTryAssembleVisiblee(true);
                    } else {
                        message.warning('不存在试组装段信息')
                    }
                }} disabled={!(location.state?.status < 3)} ghost>试组装信息</Button>
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
                            {
                                location.state?.status < 3 ?
                                    <TowerLoftingAssign title="塔型放样指派" id={params.id} update={onRefresh} type="edit" />
                                    : <Button type="primary" disabled ghost>塔型放样指派</Button>
                            }
                        </>
                        : null
                }
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </Space>}
            searchFormItems={[
                {
                    name: 'updateStatusTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'status',
                    label: '放样状态',
                    children: <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value="" key="4">全部</Select.Option>
                        <Select.Option value="1" key="1">放样中</Select.Option>
                        <Select.Option value="2" key="2">校核中</Select.Option>
                        <Select.Option value="3" key="3">已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'personnel',
                    label: '人员',
                    children: <Row>
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
                },
                // {
                //     name: 'checkUser',
                //     label: '校核人',
                //     children: <Row>
                //         <Col>
                //             <Form.Item name="checkUserDept">
                //                 <TreeSelect placeholder="请选择" onChange={ (value: any) => { onDepartmentChange(value, 'checkUserDept') } } style={{ width: "150px" }}>
                //                     { renderTreeNodes(wrapRole2DataNode(departmentData)) }
                //                 </TreeSelect>
                //             </Form.Item>
                //         </Col>
                //         <Col>
                //             <Form.Item name="checkUser">
                //                 <Select placeholder="请选择" style={{ width: "150px" }}>
                //                     { checkUser && checkUser.map((item: any) => {
                //                         return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                //                     }) }
                //                 </Select>
                //             </Form.Item>
                //         </Col>
                //     </Row>
                // }
            ]}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.updateStatusTime) {
                    const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                    values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                    values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
                }
                return values;
            }}
            tableProps={{
                pagination: false
            }}
        />
    </>
}