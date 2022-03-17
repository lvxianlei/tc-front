/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表
 */

import React, { useRef, useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, Spin, Modal, message } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useLocation } from 'react-router-dom';
import Deliverables from './Deliverables';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TryAssemble from './TryAssemble';
import { TryAssembleProps } from './ISetOut';

export default function SetOutList(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskNum',
            title: '放样任务编号',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 150,
            dataIndex: 'planNumber'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            dataIndex: 'internalNumber',
            width: 120
        },
        {
            key: 'name',
            title: '塔型',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'num',
            title: '杆塔（基）',
            width: 150,
            dataIndex: 'num',
        },
        {
            key: 'voltageGradeName',
            title: '电压等级',
            width: 150,
            dataIndex: 'voltageGradeName',
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            dataIndex: 'plannedDeliveryTime',
            width: 200,
        },
        {
            key: 'patternName',
            title: '模式',
            width: 200,
            dataIndex: 'patternName'
        },
        {
            key: 'loftingLeaderName',
            title: '放样负责人',
            width: 200,
            dataIndex: 'loftingLeaderName'
        },
        {
            key: 'statusName',
            title: '塔型放样状态',
            width: 200,
            dataIndex: 'statusName'
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
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Link to={`/workMngt/setOutList/setOutInformation/${record.id}`}>放样信息</Link>
                    <Link to={{
                        pathname: `/workMngt/setOutList/towerInformation/${record.id}`,
                        state: { loftingLeader: record.loftingLeader, status: record.status }
                    }}>塔型信息</Link>
                    <Link to={{
                        pathname: `/workMngt/setOutList/poleInformation/${record.id}`,
                        state: { loftingLeader: record.loftingLeader, status: record.status }
                    }}>杆塔配段</Link>
                    {
                        record.status === 5 ? <Deliverables id={record.id} name={record.name} /> : <Button type="link" disabled>交付物</Button>
                    }
                    {/* <Button type="link" onClick={async () => {
                        const result: [] = await RequestUtil.get(`/tower-science/productSegmentAssemble/${record.id}`);
                        if (result.length > 0) {
                            setTryAssembleVisiblee(true);
                            setTryAssemble(result)
                            setProductCategoryId(record.id);
                        } else {
                            message.warning('不存在试组装段信息')
                        }

                    }}>试装信息</Button> */}
                </Space>
            )
        }
    ]

    // const handleModalOk = () => new Promise(async (resove, reject) => {
    //     try {
    //         await editRef.current?.onSubmit();
    //         message.success('提交成功');
    //         setTryAssembleVisiblee(false);
    //         setRefresh(!refresh);
    //         resove(true);
    //     } catch (error) {
    //         reject(false)
    //     }
    // })

    const [refresh, setRefresh] = useState(false);
    const location = useLocation<{ state?: number, userId?: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/employee?size=1000`);
        resole(data?.records);
    }), {})
    const checkUser: any = data || [];
    // const [tryAssembleVisible, setTryAssembleVisiblee] = useState(false);
    // const editRef = useRef<TryAssembleProps>();
    // const [productCategoryId, setProductCategoryId] = useState<string>('');
    // const [tryAssemble, setTryAssemble] = useState<[]>([]);

    return <Spin spinning={loading}>
        {/* <Modal
            destroyOnClose
            visible={tryAssembleVisible}
            width="40%"
            title="试组装信息"
            footer={<Space>
                <Button key="back" onClick={() => {
                    editRef.current?.resetFields()
                    setTryAssembleVisiblee(false);
                    setRefresh(!refresh);
                }}>
                    取消
                </Button>
            </Space>}
            className={styles.tryAssemble}
            onCancel={() => {
                editRef.current?.resetFields()
                setTryAssembleVisiblee(false);
                setRefresh(!refresh);
            }}>
            <TryAssemble id={productCategoryId} type="detail" deatil={tryAssemble} ref={editRef} />
        </Modal> */}
        <Page
            path="/tower-science/loftingList"
            exportPath={`/tower-science/loftingList`}
            columns={columns}
            headTabs={[]}
            requestData={{ status: location.state?.state, loftingLeader: location.state?.userId, whether: 0 }}
            refresh={refresh}
            searchFormItems={[
                {
                    name: 'updateStatusTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'status',
                    label: '塔型状态',
                    children: <Form.Item name="status" initialValue={location.state?.state}>
                        <Select style={{ width: '120px' }} placeholder="请选择">
                            <Select.Option value="" key="6">全部</Select.Option>
                            <Select.Option value={1} key="1">待指派</Select.Option>
                            <Select.Option value={2} key="2">放样中</Select.Option>
                            <Select.Option value={3} key="3">组焊中</Select.Option>
                            <Select.Option value={4} key="4">配段中</Select.Option>
                            <Select.Option value={5} key="5">已完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'pattern',
                    label: '模式',
                    children: <Select placeholder="请选择" style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                        {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'loftingLeader',
                    label: '放样负责人',
                    children: <Form.Item name="loftingLeader" initialValue={location.state?.userId || ""}>
                        <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value="" key="6">全部</Select.Option>
                            {checkUser && checkUser.map((item: any) => {
                                return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="放样任务编号/计划号/订单编号/内部合同编号/塔型/塔型钢印号" />
                }
            ]}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.updateStatusTime) {
                    const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                    values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                    values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
                }
                return values;
            }}
        />
    </Spin>
}