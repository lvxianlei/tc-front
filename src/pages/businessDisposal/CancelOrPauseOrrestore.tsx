/**
 * @author zyc
 * @copyright © 2022
 * @description 业务处置管理-取消暂停恢复
 */

import React, { useRef, useState } from 'react';
import { Space, Input, DatePicker, Form, Spin, Button, TablePaginationConfig, Radio, RadioChangeEvent, Row, Col, Modal, message, Select } from 'antd';
import { CommonTable } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './CancelOrPauseOrrestore.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import { Link, useHistory } from 'react-router-dom';
import { voltageGradeOptions } from '../../configuration/DictionaryOptions';
import AuthUtil from '../../utils/AuthUtil';

export interface ILofting {
    readonly id?: string;
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export interface IResponseData {
    readonly current: number;
    readonly size: number;
    readonly total: number;
    readonly records: any[];
}

export default function CancelOrPauseOrrestore(): React.ReactNode {
    const columns = [
        {
            key: 'taskNumber',
            title: '计划变更编号',
            width: 100,
            dataIndex: 'taskNumber'
        },
        {
            key: 'name',
            title: '计划号',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'towerPlaceNum',
            title: '客户名称',
            dataIndex: 'towerPlaceNum',
            width: 80
        },
        {
            key: 'voltageGrade',
            title: '工程名称',
            width: 80,
            dataIndex: 'voltageGrade'
        },
        {
            key: 'loftDeliverTime',
            title: '变更类型',
            width: 80,
            dataIndex: 'loftDeliverTime',
        },
        {
            key: 'pattern',
            title: '修改内容',
            dataIndex: 'pattern',
            width: 150,
        },
        {
            key: 'loftLeaderName',
            title: '接收时间',
            width: 100,
            dataIndex: 'loftLeaderName'
        },
        {
            key: 'updateStatusTime',
            title: '基数',
            width: 50,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '总重量',
            width: 80,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '业务员',
            width: 80,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '已加工总重量',
            width: 80,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '备注',
            width: 100 ,
            dataIndex: 'updateStatusTime'
        }
    ]

    const tableColumns = [
        {
            key: 'segmentGroupName',
            title: '塔型',
            width: 50,
            dataIndex: 'segmentGroupName'
        },
        {
            key: 'loftPersonName',
            title: '呼高',
            width: 50,
            dataIndex: 'loftPersonName'
        },
        {
            key: 'checkPersonName',
            title: '基数',
            width: 50,
            dataIndex: 'checkPersonName'
        },
        {
            key: 'planCompletionDate',
            title: '单重吨',
            width: 80,
            dataIndex: 'planCompletionDate'
        },
        {
            key: 'actualCompletionDate',
            title: '总重吨',
            width: 80,
            dataIndex: 'actualCompletionDate'
        },
        {
            key: 'actualCompletionDate',
            title: '杆塔号',
            width: 80,
            dataIndex: 'actualCompletionDate'
        },
        {
            key: 'actualCompletionDate',
            title: '备注',
            width: 80,
            dataIndex: 'actualCompletionDate'
        },
        {
            key: 'actualCompletionDate',
            title: '是否生产下达',
            width: 80,
            dataIndex: 'actualCompletionDate'
        },
        {
            key: 'actualCompletionDate',
            title: '是否下发车间',
            width: 80,
            dataIndex: 'actualCompletionDate'
        },
        {
            key: 'actualCompletionDate',
            title: '已加工重量吨',
            width: 80,
            dataIndex: 'actualCompletionDate'
        },
        {
            key: 'operation',
            title: '已加工明细',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 50,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Link to={`/businessDisposal/cancelOrPauseOrrestore/processedDetails/${record.id}`}>查看</Link>
                </Space>
            )
        }
    ]

    const [page, setPage] = useState({
        current: 1,
        size: 10,
        total: 0
    })

    const [form] = Form.useForm();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [rowId, setRowId] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const history = useHistory();
    const [sectionVisible, setSectionVisible] = useState<boolean>(false);
    const sectionRef = useRef<EditRefProps>();
    const [recordData, setRecordData] = useState<any>({});
    const [detailData, setDetailData] = useState<any>();

    const { loading, data, run } = useRequest<ILofting[]>((pagenation: TablePaginationConfig, filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: IResponseData = await RequestUtil.get<IResponseData>(`/tower-tdm/loftProcess/projectTowerTypePage`, { current: pagenation?.current || 1, size: pagenation?.size || 10, status: status, ...filterValue });
        setPage({ ...data });
        if (data.records.length > 0 && data.records[0]?.id) {
            detailRun(data.records[0]?.id)
            setRowId(data.records[0]?.id)
            setRecordData(data.records[0])
        } else {
            setDetailData([]);
            setRecordData({})
        }
        resole(data?.records);
    }), {})

    const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-tdm/loftProcess/getSegAssignList/${id}`);
            setDetailData(result)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSearch = (values: Record<string, any>) => {
        if (values.time) {
            const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
            values.submitStartTime = formatDate[0] + ' 00:00:00';
            values.submitEndTime = formatDate[1] + ' 23:59:59';
        }
        setFilterValues(values);
        run({}, { ...values });
    }

    const handleChangePage = (current: number, pageSize: number) => {
        setPage({ ...page, current: current, size: pageSize });
        run({ current: current, size: pageSize }, { ...filterValues })
    }

    const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.id)
        setRowId(record.id)
        setRecordData(record);
    }

    return <Spin spinning={loading}>
        <Form form={form} layout="inline" className={styles.search} onFinish={onSearch}>
            <Form.Item name="voltageGradeId" label="电压等级" initialValue={""}>
                <Select style={{ width: '150px' }}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                        (option?.props?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }>
                    {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={id}>
                            {name}
                        </Select.Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item label='模糊查询项' name="fuzzyMsg">
                <Input style={{ width: '200px' }} placeholder="" />
            </Form.Item>
            <Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button htmlType="reset">重置</Button>
                </Space>
            </Form.Item>
        </Form>
        <CommonTable
            haveIndex
            columns={columns}
            dataSource={data}
            pagination={{
                current: page.current,
                pageSize: page.size,
                total: page?.total,
                showSizeChanger: true,
                onChange: handleChangePage
            }}
            onRow={(record: Record<string, any>) => ({
                onClick: () => onRowChange(record),
                className: styles.tableRow
            })}
        />
        <div className={styles.bottomTable}>
            <CommonTable
                columns={tableColumns}
                dataSource={[...detailData || []]}
                pagination={false}
            />
        </div>
    </Spin>
}