/**
 * @author zyc
 * @copyright © 2022
 * @description 包装计划-包装计划列表-详情
*/

import React, { useState } from 'react';
import { Spin, Button, Space, Modal, Form, InputNumber, Input, Select, TablePaginationConfig, Tooltip, message } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from '../PackingPlan.module.less';
import OriginalList from './OriginalList';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface IBale {
    readonly packageInfoVOList?: IPackageInfo[];
    readonly done?: string;
    readonly count?: string;
    readonly packageStatus?: number;
}

interface IPackageInfo {
    readonly code?: string;
    readonly componentStatus?: string;
    readonly description?: string;
    readonly id?: string;
    readonly length?: string;
    readonly num?: string;
    readonly packageId?: string;
    readonly packageNum?: string;
    readonly structureSpec?: string;
    readonly structureTexture?: string;
    readonly unPackageNum?: string;
    readonly weight?: string;
}

const baseColums = [
    {
        "dataIndex": "planNumber",
        "title": "计划号",
        "type": "string"
    },
    {
        "dataIndex": "packageCode",
        "title": "包号",
        "type": "string"
    },
    {
        "dataIndex": "orderProjectName",
        "title": "工程名称",
        "type": "string"
    },
    {
        "dataIndex": "packageComponentCount",
        "title": "包件数",
        "type": "string"
    },
    {
        "dataIndex": "teamName",
        "title": "包装班组",
        "type": "string"
    },
    {
        "dataIndex": "productCategoryName",
        "title": "塔型",
        "type": "string"
    },
    {
        "dataIndex": "packageWeight",
        "title": "包重量（KG）",
        "type": "string"
    },

    {
        "dataIndex": "startTime",
        "title": "开始包装日期",
        "type": "string"
    },
    {
        "dataIndex": "voltageGradeName",
        "title": "电压等级",
        "type": "string"
    },
    {
        "dataIndex": "packageTypeName",
        "title": "包类型",
        "type": "string"
    },
    {
        "dataIndex": "endTime",
        "title": "要求完成日期",
        "type": "string"
    },
    {
        "dataIndex": "productNumber",
        "title": "杆塔号",
        "type": "string"
    },
    {
        "dataIndex": "packageAttribute",
        "title": "包属性",
        "type": "select",
        "enum": [
            { "value": 0, "label": "专用包" },
            { "value": 1, "label": "公用包" }
        ]
    },
    {
        "dataIndex": "packageStatus",
        "title": "包状态",
        "type": "select",
        "enum": [
            { "value": 1, "label": "打包中" },
            { "value": 2, "label": "已完成" }
        ]
    }
]

const tableColumns = [
    {
        key: 'packageCode',
        title: '包号',
        dataIndex: 'packageCode',
    },
    {
        key: 'code',
        title: '件号',
        dataIndex: 'code'
    },
    {
        key: 'structureSpec',
        title: '材料规格',
        dataIndex: 'structureSpec'
    },
    {
        key: 'length',
        title: '长度（mm）',
        dataIndex: 'length'
    },
    {
        key: 'num',
        title: '数量',
        dataIndex: 'num'
    },
    {
        key: 'weight',
        title: '重量（KG）',
        dataIndex: 'weight'
    },
    {
        key: 'description',
        title: '备注',
        dataIndex: 'description'
    }
]

export default function SetOutInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [visible, setVisible] = useState<boolean>(false);
    const [searchForm] = Form.useForm();
    const [tableData, setTableData] = useState<IPackageInfo[]>();
    const [filterValue, setFilterValue] = useState({});

    const { loading, data, run: getTableDataSource }: Record<string, any> = useRequest((filterValues: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: IBale = await RequestUtil.get<IBale>(`/tower-production/package/detail`, { ...filterValues, id: params.id });
        setTableData(data?.packageInfoVOList || []);
        resole(data)
    }), {})

    const detailData: IBale = data;

    const beforeFinishPacked = () => {
        if (detailData?.count === detailData?.done) {
            Modal.confirm({
                title: "所有件均已打进包捆，是否确定完成打包",
                onOk: async () => new Promise(async (resove, reject) => {
                    try {
                        RequestUtil.put<IBale>(`/tower-production/package/updatePackageInfo/${params.id}`).then(res => {
                            message.success("打包完成")
                            history.go(0);
                        })

                        resove(true)
                    } catch (error) {
                        reject(error)
                    }
                })
            })
        } else {
            Modal.confirm({
                title: "部分件未打进包捆，是否确定完成打包",
                onOk: async () => new Promise(async (resove, reject) => {
                    try {
                        RequestUtil.put<IBale>(`/tower-production/package/updatePackageInfo/${params.id}`).then(res => {
                            message.success("打包完成")
                            history.go(0);
                        })
                        resove(true)
                    } catch (error) {
                        reject(error)
                    }
                })
            })
        }
    }

    const onFinish = (value: Record<string, any>) => {
        setFilterValue(value);
        getTableDataSource(value);
    }

    const updatePackage = (id: string, packageNum?: string, unPackageNum?: string) => {
        RequestUtil.put<IBale>(`/tower-production/package/updatePackageInfoById`, { id: id, packageNum: packageNum, unPackageNum: unPackageNum }).then(res => {
            getTableDataSource(filterValue);
        })
    }

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <>
        <Modal
            destroyOnClose
            visible={visible}
            title={`原始包装清单`}
            width="60%"
            footer={
                <Button type='ghost' onClick={() => setVisible(false)}>关闭</Button>
            }
            onCancel={() => {
                setVisible(false);
            }}>
            <OriginalList id={params.id} />
        </Modal>
        <DetailContent key={'edtail'} operation={[
            <Space direction="horizontal" size="small" >
                <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
                {detailData?.packageStatus === 1 ? <Button type='primary' onClick={beforeFinishPacked} disabled={(tableData || [])?.length <=
                    0}>完成打包</Button> : null}
            </Space>
        ]}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={baseColums} dataSource={detailData || {}} col={3} />
            <p className={styles.detailtitle}>
                <span>杆塔明细</span>
                <span className={styles.content}>
                    <Tooltip title={'包捆进度：已打进包件数/包捆全部件数。'}><QuestionCircleOutlined /> </Tooltip>
                    包捆进度：<span className={styles.num}>{detailData?.done || 0} / {detailData?.count || 0}</span>
                </span>
                <Button type='primary' className={styles.operationBtn} onClick={() => setVisible(true)} ghost>原始包装清单</Button>
            </p>
            <Form form={searchForm} onFinish={onFinish} layout="inline" className={styles.topForm}>
                <Form.Item name="code">
                    <Input placeholder="件号" />
                </Form.Item>
                <Form.Item name="componentStatus" label="件状态">
                    <Select placeholder="请选择" style={{ width: '120px' }} defaultValue={''}>
                        <Select.Option key={4} value={''}>全部</Select.Option>
                        <Select.Option key={0} value={0}>未打</Select.Option>
                        <Select.Option key={1} value={1}>已打</Select.Option>
                    </Select>
                </Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button type="ghost" htmlType="reset">重置</Button>
                </Space>
            </Form>
            <CommonTable
                haveIndex
                dataSource={tableData}
                columns={[
                    ...tableColumns,
                    {
                        key: 'packageNum',
                        title: '已打数量',
                        dataIndex: 'packageNum',
                        render: (value: number, record: Record<string, any>, index: number) => (
                            <InputNumber
                                min={0}
                                max={Number(record?.num) - Number(record?.unPackageNum)}
                                placeholder="请输入"
                                defaultValue={record?.packageNum}
                                onBlur={(e) => updatePackage(record.id, e.target.value, record?.unPackageNum)}
                                size='small'
                                disabled={detailData?.packageStatus === 2}
                            />
                        )
                    },
                    {
                        key: 'unPackageNum',
                        title: '缺件数量',
                        dataIndex: 'unPackageNum',
                        render: (value: number, record: Record<string, any>, index: number) => (
                            <InputNumber
                                min={0}
                                max={Number(record?.num) - Number(record?.packageNum)}
                                placeholder="请输入"
                                defaultValue={value}
                                onBlur={(e) => updatePackage(record.id, record?.packageNum, e.target.value)}
                                size='small'
                                disabled={detailData?.packageStatus === 2}
                            />
                        )
                    }
                ]}
            />
        </DetailContent>
    </>
}