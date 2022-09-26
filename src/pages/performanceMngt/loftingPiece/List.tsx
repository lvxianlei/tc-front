/**
 * @author zyc
 * @copyright © 2022
 * @description 绩效管理-放样计件
 */

import React, { useRef, useState } from 'react';
import { Space, Input, DatePicker, Form, Spin, Button, TablePaginationConfig, Modal, message, Select, InputNumber } from 'antd';
import { AuthButton, CommonTable } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './LoftingPiece.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { Link, useHistory } from 'react-router-dom';
import CoefficientPerformance from './CoefficientPerformance';
import { productTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import { downloadTemplate } from '../../workMngt/setOut/downloadTemplate';
import { columns, performanceColumns, checkColumns } from "./loftingPiece.json";

export interface ILofting {
    readonly id?: string;
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export interface IResponseData {
    readonly records: any[];
    readonly total: number;
    readonly size: number;
    readonly current: number;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: any;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input size="small" />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `请输入 ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default function List(): React.ReactNode {

    const problemColumns = [
        {
            key: 'segmentName',
            title: '段号',
            width: 50,
            dataIndex: 'segmentName'
        },
        {
            key: 'partNum',
            title: '放样件号数',
            width: 80,
            dataIndex: 'partNum',
            type: 'number'
        },
        {
            key: 'mistakenPartNum',
            title: '错误件号数',
            width: 80,
            dataIndex: 'mistakenPartNum',
            type: 'number'
        },
        {
            key: 'loftingUserName',
            title: '放样人',
            width: 80,
            dataIndex: 'loftingUserName'
        },
        {
            key: 'loftingPrice',
            title: '放样单价',
            width: 80,
            dataIndex: 'loftingPrice',
            editable: true
        },
        {
            key: 'loftingPunishmentAmount',
            title: '放样人扣惩',
            width: 80,
            dataIndex: 'loftingPunishmentAmount'
        },
        {
            key: 'leaderPunishmentAmount',
            title: '负责人扣惩',
            width: 80,
            dataIndex: 'leaderPunishmentAmount'
        },
        {
            key: 'loftingPerformanceAmount',
            title: '放样绩效',
            width: 80,
            dataIndex: 'loftingPerformanceAmount'
        },
        {
            key: 'checkUserName',
            title: '校核人',
            width: 80,
            dataIndex: 'checkUserName'
        },
        {
            key: 'checkPrice',
            title: '审核单价',
            width: 80,
            dataIndex: 'checkPrice',
            editable: true
        },
        {
            key: 'checkRewardAmount',
            title: '校核人奖励',
            width: 80,
            dataIndex: 'checkRewardAmount'
        },
        {
            key: 'checkPerformanceAmount',
            title: '校核绩效',
            width: 80,
            dataIndex: 'checkPerformanceAmount'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    {isEditing(record) ? (
                        <Space direction="horizontal" size="small" className={styles.operationBtn}>
                            <Button type="link" onClick={() => save(record.id)}>保存</Button>
                            <Button type="link" onClick={cancel}>取消</Button>
                        </Space>
                    ) : (
                        <Button type="link" onClick={() => editRow(record)} disabled={!(editingKey === '')}>编辑</Button>
                    )}
                </Space>
            )
        }
    ]

    const [form] = Form.useForm();
    const [problemForm] = Form.useForm();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [detailData, setDetailData] = useState<any>();
    const [editingKey, setEditingKey] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const ref = useRef<EditRefProps>();
    const history = useHistory();
    const [loftStatistical, setLoftStatistical] = useState<any>([]);
    const [checkStatistical, setCheckStatistical] = useState<any>([]);

    const { loading, data, run } = useRequest<ILofting[]>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: any[] = await RequestUtil.get<any[]>(`/tower-science/performance/product/category`, { ...filterValue });
        if (data?.length > 0 && data[0].id) {
            detailRun(data[0]?.id)
            checkStatisticalRun(data[0]?.id)
            loftStatisticallRun(data[0]?.id)
        } else {
            setDetailData([]);
            setLoftStatistical([]);
            setCheckStatistical([]);
        }
        resole(data);
    }), {})

    const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get(`/tower-science/performance/product/segment/${id}`);
            setDetailData(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })


    const { run: loftStatisticallRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get(`/tower-science/performance/lofting/user/${id}`);
            setLoftStatistical(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: checkStatisticalRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get(`/tower-science/performance/check/user/${id}`);
            setCheckStatistical(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSearch = (values: Record<string, any>) => {
        if (values.time) {
            const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
            values.startTime = formatDate[0] + ' 00:00:00';
            values.endTime = formatDate[1] + ' 23:59:59';
        }
        setFilterValues(values);
        run({ ...values });
    }

    const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.id)
    }

    const isEditing = (record: Record<string, any>) => record.id === editingKey;

    const editRow = (record: Record<string, any>) => {
        problemForm.setFieldsValue({ ...record });
        setEditingKey(record.id);
    }

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = problemForm.getFieldsValue(true);
            const newData = [...detailData];
            const index = newData.findIndex(item => key === item.id);
            if (index > -1) {
                RequestUtil.post(`/tower-science/performance/product/segment`, row).then(res => {
                    setEditingKey('');
                    message.success('编辑成功');
                    run({ ...filterValues })
                });

            } else {
                newData.push(row);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const mergedColumns = problemColumns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Record<string, any>) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await ref.current?.onSubmit()
            message.success("上传成功！")
            setVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    return <Spin spinning={loading}>
        <Modal
            destroyOnClose
            key='CoefficientPerformance'
            visible={visible}
            title="绩效系数配置"
            onOk={handleOk}
            onCancel={() => { setVisible(false); ref.current?.resetFields(); }}>
            <CoefficientPerformance ref={ref} />
        </Modal>
        <div className={styles.search}>
            <Form form={form} layout="inline" onFinish={onSearch}>
                <Form.Item name="time" label="日期">
                    <DatePicker.RangePicker />
                </Form.Item>
                <Form.Item name="voltageGrade" label="电压等级" initialValue={""}>
                    <Select style={{ width: '150px' }}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                            (option?.props?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                        }>
                        {
                            voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="productType" label="产品类型" initialValue={""}>
                    <Select style={{ width: '150px' }} >
                        <Select.Option key={0} value={""}>全部</Select.Option>
                        {
                            productTypeOptions?.map((item: any, index: number) =>
                                <Select.Option value={item.id} key={index}>
                                    {item.name}
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
                <Form.Item name="fuzzyMsg">
                    <Input style={{ width: '260px' }} placeholder="任务编号/计划号/工程名称/塔型名称" />
                </Form.Item>
                <Form.Item>
                    <Space direction="horizontal">
                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button htmlType="reset">重置</Button>
                    </Space>
                </Form.Item>
            </Form>
            <Space className={styles.topBtn}>
                <Button type="primary" onClick={async () => {
                    setVisible(true);
                }} ghost>奖惩配置</Button>
                <Button type="primary" onClick={() => {
                    downloadTemplate(``, '放样计件', { ...filterValues }, false, 'array')
                }} ghost>导出</Button>
            </Space>
        </div>
        <div className={styles.content}>
            <div className={styles.left}>
                <CommonTable
                    haveIndex
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    onRow={(record: Record<string, any>) => ({
                        onClick: () => onRowChange(record),
                        className: styles.tableRow
                    })}
                />
            </div>
            <div className={styles.right}>
                <div className={styles.right_top}>
                    <Form form={problemForm}>
                        <CommonTable
                            columns={mergedColumns}
                            dataSource={detailData}
                            pagination={false}
                            changeHeight={false}
                            scroll={{ y: 200 }}
                            components={{
                                body: {
                                    cell: EditableCell,
                                }
                            }}
                        />
                    </Form>
                </div>
                <div className={styles.right_middle}>
                    <CommonTable
                        columns={performanceColumns}
                        dataSource={loftStatistical}
                        pagination={false}
                        changeHeight={false}
                        scroll={{ y: 200 }}
                    />
                </div>
                <div className={styles.right_bottom}>
                    <CommonTable
                        columns={checkColumns}
                        dataSource={checkStatistical}
                        pagination={false}
                        changeHeight={false}
                        scroll={{ y: 200 }}
                    />
                </div>
            </div>
        </div>
    </Spin>
}

