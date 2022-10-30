/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔信息
*/

import React, { useEffect, useRef, useState } from 'react';
import { Space, DatePicker, Select, Button, Row, Col, Form, TreeSelect, Spin, message } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import WithSectionModal from './WithSectionModal';
import { TreeNode } from 'antd/lib/tree-select';
import RequestUtil from '../../../utils/RequestUtil';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import useRequest from '@ahooksjs/use-request';
import AuthUtil from '../../../utils/AuthUtil';
import Modal from 'antd/lib/modal/Modal';
import { allotModalProps, IAllot } from './ISetOut';
import AllotModal from './AllotModal';
import WeldingVerify from './WeldingVerify';

export default function PoleInformation(): React.ReactNode {
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
            key: 'productNumber',
            title: '杆塔号',
            width: 120,
            dataIndex: 'productNumber'
        },
        {
            key: 'productHeight',
            title: '呼高',
            width: 80,
            dataIndex: 'productHeight'
        },
        {
            key: 'voltageGradeName',
            title: '电压等级',
            width: 100,
            dataIndex: 'voltageGradeName'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            dataIndex: 'productCategoryName',
            width: 120
        },
        {
            key: 'loftingDeliverTime',
            title: '计划交付时间',
            width: 150,
            dataIndex: 'loftingDeliverTime'
        },
        {
            key: 'loftingUserName',
            title: '配段人',
            width: 150,
            dataIndex: 'loftingUserName',
        },
        {
            key: 'loftingStatusName',
            title: '杆塔放样状态',
            dataIndex: 'loftingStatusName',
            width: 150
        },
        {
            key: 'loftingUpdateStatusTime',
            title: '最新状态变更时间',
            width: 150,
            dataIndex: 'loftingUpdateStatusTime'
        },
        {
            key: 'segmentInformation',
            title: '配段信息',
            width: 200,
            dataIndex: 'segmentInformation'
        },
        {
            key: 'legNumberA',
            title: 'A',
            width: 120,
            dataIndex: 'legNumberA'
        },
        {
            key: 'legNumberB',
            title: 'B',
            width: 120,
            dataIndex: 'legNumberB'
        },
        {
            key: 'legNumberC',
            title: 'C',
            width: 120,
            dataIndex: 'legNumberC'
        },
        {
            key: 'legNumberD',
            title: 'D',
            width: 120,
            dataIndex: 'legNumberD'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    {
                        isShow ?
                            <WithSectionModal key={record.id} productCategoryId={params.id} id={record.id} updateList={() => setRefresh(!refresh)} />
                            : <Button type="link" disabled>配段</Button>
                    }
                    <Link to={`/workMngt/setOutList/poleInformation/${params.id}/poleLoftingDetails/${record.id}`}>杆塔放样明细</Link>
                    <Link to={{ pathname: `/workMngt/setOutList/poleInformation/${params.id}/packingList/${record.id}`, state: { status: record?.loftingStatus } }}><Button type="link">包装清单</Button></Link>
                    <Button type="link" onClick={async () => {
                        setLoftingStatus(record.loftingStatus)
                        let result: IAllot = await RequestUtil.get(`/tower-science/productStructure/getAllocation/${record.id}`);
                        setAllotData(result)
                        setProductId(record.id);
                        await editRef.current?.visibleData()
                        setAllotVisible(true);
                    }}>特殊件号</Button>
                </Space>
            )
        }
    ]

    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [refresh, setRefresh] = useState(false);
    const [buttonName, setButtonName] = useState('');
    const [tipVisible, setTipVisible] = useState<boolean>(false)
    const { loading, data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<SelectDataNode[]>(`/tower-system/department`);
        resole(data);
    }), {})
    const departmentData: any = data || [];
    const [materialUser, setMaterialUser] = useState([]);
    const userId = AuthUtil.getUserInfo().user_id;
    const [allotVisible, setAllotVisible] = useState<boolean>(false);
    const editRef = useRef<allotModalProps>();
    const [productId, setProductId] = useState<string>('');
    const [allotData, setAllotData] = useState<IAllot>();
    const [loftingStatus, setLoftingStatus] = useState<number>(0);
    const [visible, setVisible] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    
    useEffect(() => {
        setConfirmLoading(confirmLoading);
    }, [confirmLoading])


    const { data: isShow } = useRequest<boolean>(() => new Promise(async (resole, reject) => {
        try {
            let result = await RequestUtil.get<any>(`/tower-science/productCategory/assign/user/list/${params.id}`);
            result.indexOf(userId) === -1 ? resole(false) : resole(true)
        } catch (error) {
            reject(error)
        }
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
            case "materialUser":
                return setMaterialUser(userData.records);
        };
    }

    const onTip = () => new Promise(async (resolve, reject) => {
        try {
            await editRef.current?.onCheck()
            if (editRef.current?.selectedRowKeys && editRef.current?.selectedRowKeys.length > 0) {
                const result = await RequestUtil.post(`/tower-science/productStructure/judge`, { productIds: editRef.current?.selectedRowKeys });
                if (result) {
                    setTipVisible(true)
                } else {
                    // message.error('杆塔无此特殊件号，无法保存！')
                    setTipVisible(false)
                }
            }
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    // const handleModalOk = () => new Promise(async (resove, reject) => {
    //     try {
    //         setButtonName('保存')
    //         await onTip();
    //         await editRef.current?.onSave();
    //         message.success('保存成功！');
    //         setTipVisible(false);
    //         setAllotVisible(false);
    //         setRefresh(!refresh);
    //         resove(true);
    //     } catch (error) {
    //         reject(false)
    //     }
    // })

    const handleModalsubmit = () => new Promise(async (resove, reject) => {
        try {
            setButtonName('提交')
            console.log('*****')
            await onTip();
            await editRef.current?.onSubmit();
            message.success('提交成功！');
            setTipVisible(false);
            setAllotVisible(false);
            setRefresh(!refresh);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <>
        <Modal
            // destroyOnClose
            visible={visible}
            width="60%"
            title="电焊件验证"
            footer={
                <Button type="ghost" onClick={() => setVisible(false)}>关闭</Button>
            }
            onCancel={() => setVisible(false)}
            className={styles.tryAssemble}
        >
            <WeldingVerify id={params.id} />
        </Modal>
        <Modal title='提示' okText='是' cancelText='否' visible={tipVisible} onCancel={() => {
            setButtonName('')
            setTipVisible(false)
        }} onOk={async () => {
            if (buttonName === '保存') {
                await editRef.current?.onSave();
                message.success('保存成功！');
                setTipVisible(false);
                setAllotVisible(false);
                setRefresh(!refresh);
            } else if (buttonName === '提交') {
                await editRef.current?.onSubmit();
                message.success('提交成功！');
                setTipVisible(false);
                setAllotVisible(false);
                setRefresh(!refresh);
            }
        }}>
            复用杆塔已经存在特殊件号调整后的数据，是否覆盖？
        </Modal>
        <Modal
            // destroyOnClose
            visible={allotVisible}
            width="60%"
            title="特殊件号"
            footer={
                <Space>
                    <Button type="ghost" onClick={async () => {
                        setAllotVisible(false);
                        editRef.current?.resetFields()
                    }}>关闭</Button>
                    {/* <Button type="primary" onClick={handleModalOk} ghost>保存</Button> */}
                    <Button type="primary" loading={confirmLoading} onClick={handleModalsubmit} ghost>保存并提交</Button>
                </Space>
            }
            // onOk={handleModalOk}
            onCancel={() => setAllotVisible(false)}
            className={styles.tryAssemble}
        >
            <AllotModal getLoading={(loading: boolean) => setConfirmLoading(loading)} id={productId} allotData={allotData || {}} ref={editRef} status={loftingStatus} />
        </Modal>
        <Page
            path="/tower-science/product/lofting"
            exportPath={`/tower-science/product/lofting`}
            columns={columns}
            headTabs={[]}
            requestData={{ productCategoryId: params.id }}
            refresh={refresh}
            extraOperation={<Space direction="horizontal" size="small">
                <Button type='primary' onClick={() => setVisible(true)} ghost>电焊件验证</Button>
                <WithSectionModal type="batch" productCategoryId={params.id} updateList={() => setRefresh(!refresh)} />
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            </Space>}
            searchFormItems={[
                {
                    name: 'newStatusTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'loftingStatus',
                    label: '杆塔放样状态',
                    children: <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value={""} key="5">全部</Select.Option>
                        <Select.Option value={1} key="1">待开始</Select.Option>
                        <Select.Option value={2} key="2">待配段</Select.Option>
                        <Select.Option value={3} key="3">待出单</Select.Option>
                        <Select.Option value={4} key="4">已完成 </Select.Option>
                    </Select>
                },
                {
                    name: 'productCategory',
                    label: '配段人',
                    children: <Row>
                        <Col>
                            <Form.Item name="materialUserDepartment">
                                <TreeSelect placeholder="请选择" onChange={(value: any) => { onDepartmentChange(value, 'materialUser') }} style={{ width: "150px" }}>
                                    {renderTreeNodes(wrapRole2DataNode(departmentData))}
                                </TreeSelect>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item name="loftingUser">
                                <Select placeholder="请选择" style={{ width: "150px" }}>
                                    {materialUser && materialUser.map((item: any) => {
                                        return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                }
            ]}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.newStatusTime) {
                    const formatDate = values.newStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                    values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                    values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
                }
                return values;
            }}
        />
    </>
}