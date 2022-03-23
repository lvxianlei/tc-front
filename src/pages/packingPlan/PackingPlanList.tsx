/**
 * @author zyc
 * @copyright © 2022 
 * @description 包装计划-包装计划列表
 */

import React, { useRef, useState } from 'react';
import { Input, DatePicker, Button, Modal, Radio, message, Space, Select } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './DailySchedule.module.less';
import RequestUtil from '../../utils/RequestUtil';
import { EditRefProps } from './Edit';
import Edit from "./Edit";
import useRequest from '@ahooksjs/use-request';
export interface IPackingPlan {
    readonly id?: string;
    readonly angleTeamId?: string;
    readonly boardTeamId?: string;
    readonly pipeTeamId?: string;
}

export interface IResponseData {
    readonly total: number | undefined;
    readonly size: number | undefined;
    readonly current: number | undefined;
    readonly records: any[];
}

export default function DailySchedule(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [confirmStatus, setConfirmStatus] = useState<number>(1);
    const [visible, setVisible] = useState(false);
    const editRef = useRef<EditRefProps>();
    const [title, setTitle] = useState<string>('');
    const [detailData, setDetailData] = useState<IPackingPlan>();
    const [teamId, setTeamId] = useState<string>('');

    const { data: galvanizedTeamList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-production/workshopTeam?size=1000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))

    const { data: packagingTeamList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-production/team/page?size=1000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))

    const columns = [
        {
            "key": "planNumber",
            "title": "计划号",
            "width": 150,
            "dataIndex": "planNumber"
        },
        {
            "key": "orderProjectName",
            "title": "工程名称",
            "width": 150,
            "dataIndex": "orderProjectName"
        },
        {
            "key": "voltageGradeName",
            "title": "电压等级",
            "width": 150,
            "dataIndex": "voltageGradeName"
        },
        {
            "key": "productCategoryName",
            "title": "塔型",
            "width": 150,
            "dataIndex": "productCategoryName"
        },
        {
            "key": "number",
            "title": "基数",
            "width": 150,
            "dataIndex": "number"
        },
        {
            "key": "angleWeight",
            "title": "角钢重量（KG）",
            "width": 150,
            "dataIndex": "angleWeight"
        },
        {
            "key": "boardWeight",
            "title": "连板重量（KG）",
            "width": 150,
            "dataIndex": "boardWeight"
        },
        {
            "key": "pipeWeight",
            "title": "钢管重量（KG）",
            "width": 150,
            "dataIndex": "pipeWeight"
        },
        {
            "key": "weight",
            "title": "总重量（KG）",
            "width": 150,
            "dataIndex": "weight"
        },
        {
            "key": "galvanizedTeamName",
            "title": "镀锌班组",
            "width": 150,
            "dataIndex": "galvanizedTeamName"
        },
        {
            "key": "angleTeamName",
            "title": "角钢包装班组",
            "width": 150,
            "dataIndex": "angleTeamName",
            render: (_: string, record: Record<string, any>) => (
                record.status === 1
                    ? '派工'
                    : record.status === 4
                        ? { _ }
                        : <Button type="link" onClick={() => {
                            setTitle('角钢包装班组');
                            setVisible(true);
                            setDetailData(record);
                            setTeamId(record.angleTeamId);
                        }}>{_ || '派工'}</Button>
            )
        },
        {
            "key": "boardTeamName",
            "title": "连板包装班组",
            "width": 150,
            "dataIndex": "boardTeamName",
            render: (_: string, record: Record<string, any>) => (
                record.status === 1
                    ? '派工'
                    : record.status === 4
                        ? { _ }
                        : <Button type="link" onClick={() => {
                            setTitle('连板包装班组');
                            setVisible(true);
                            setDetailData(record);
                            setTeamId(record.boardTeamId);
                        }}>{_ || '派工'}</Button>
            )
        },
        {
            "key": "pipeTeamName",
            "title": "钢管包装班组",
            "width": 150,
            "dataIndex": "pipeTeamName",
            render: (_: string, record: Record<string, any>) => (
                record.status === 1
                    ? '派工'
                    : record.status === 4
                        ? { _ }
                        : <Button type="link" onClick={() => {
                            setTitle('钢管包装班组');
                            setVisible(true);
                            setDetailData(record);
                            setTeamId(record.pipeTeamId);
                        }}>{_ || '派工'}</Button>
            )
        },
        {
            "key": "statusName",
            "title": "状态",
            "width": 150,
            "dataIndex": "statusName"
        },
        {
            "key": "startTime",
            "title": "开始包装日期",
            "width": 150,
            "dataIndex": "startTime",
            "type": "date",
            "format": 'YYYY-MM-DD'
        },
        {
            "key": "endTime",
            "title": "要求完成日期",
            "width": 150,
            "dataIndex": "endTime",
            "type": "date",
            "format": 'YYYY-MM-DD'
        },
        {
            "key": "description",
            "title": "备注",
            "width": 150,
            "dataIndex": "description"
        }
    ]

    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit()
            message.success(`派工成功`)
            setVisible(false);
            resove(true);
            setDetailData({});
            setRefresh(!refresh);
        } catch (error) {
            reject(false)
        }
    })

    const onConfirm = (id: string) => {
        RequestUtil.post(`/tower-production/packageWorkshop/accept/${id}`).then(res => {
            message.success('确认成功');
            setRefresh(!refresh);
        })
    }

    return <>
        <Modal
            destroyOnClose
            visible={visible}
            title={`派工给${title}`}
            width="60%"
            onOk={handleModalOk}
            onCancel={() => {
                setDetailData({});
                setVisible(false);
            }}>
            <Edit ref={editRef} title={title} detailData={detailData || {}} teamId={teamId} />
        </Modal>
        <Page
            path={`/tower-production/packageWorkshop/page`}
            columns={
                [...columns, {
                    "key": "operation",
                    "title": "操作",
                    "dataIndex": "operation",
                    fixed: "right" as FixedType,
                    "width": 150,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Space>
                            <Button type='link'>详情</Button>
                            {record.status === 1 ? <Button type='link' onClick={() => onConfirm(record.id)}>确认</Button> : null}
                        </Space>
                    )
                }]}
            headTabs={[]}
            requestData={{ status: confirmStatus }}
            extraOperation={
                <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                    <Radio.Button value={1}>未确认</Radio.Button>
                    <Radio.Button value={2}>未派工</Radio.Button>
                    <Radio.Button value={3}>打包中</Radio.Button>
                    <Radio.Button value={4}>已完成</Radio.Button>
                </Radio.Group>
            }
            refresh={refresh}
            searchFormItems={[
                {
                    name: 'galvanizedTeamId',
                    label: '镀锌班组',
                    children: <Select placeholder="请选择" style={{ width: '120px' }}>
                        <Select.Option key={0} value={''}>全部</Select.Option>
                        {packagingTeamList?.map((item: any) => {
                            return <Select.Option key={item.name} value={item.id}>{item.name}</Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'tipackageTeamIdme',
                    label: '包装班组',
                    children: <Select placeholder="请选择" style={{ width: '120px' }}>
                        <Select.Option key={0} value={''}>全部</Select.Option>
                        {galvanizedTeamList?.map((item: any) => {
                            return <Select.Option key={item.teamName} value={item.id}>{item.teamName}</Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'time',
                    label: '开始包装日期',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'finishiTtime',
                    label: '要求完成日期',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'fuzzyMsg',
                    label: "模糊查询项",
                    children: <Input style={{ width: '200px' }} placeholder="工程名称/计划号/塔型" />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values?.time) {
                    const formatDate = values?.time?.map((item: any) => item.format("YYYY-MM-DD"));
                    values.packageStartTime = formatDate[0] + ' 00:00:00';
                    values.packageEndTime = formatDate[1] + ' 23:59:59';
                }
                if (values?.finishiTtime) {
                    const formatDate = values?.time?.map((item: any) => item.format("YYYY-MM-DD"));
                    values.completedStartTime = formatDate[0] + ' 00:00:00';
                    values.completedEndTime = formatDate[1] + ' 23:59:59';
                }
                setFilterValue(values);
                return values;
            }}
        />
    </>
}