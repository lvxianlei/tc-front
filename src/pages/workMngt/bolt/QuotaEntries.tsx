/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-螺栓列表-定额条目
 */

import React, { useImperativeHandle, forwardRef } from "react";
import { Spin, Form, Select } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './BoltList.module.less';
import { FixedType } from 'rc-table/lib/interface';
import { patternTypeOptions } from "../../../configuration/DictionaryOptions";

export interface EditProps {
    onSubmit: () => void
}

interface QuotaEntriesProps {
    readonly id: string;
}

export default forwardRef(function QuotaEntries({ id }: QuotaEntriesProps, ref) {
    const [form] = Form.useForm();

    const { data: userDatas } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/boltRecord/getBoltUser?id=${id}`);
            resole({
                user: result?.boltUserList || [],
                check: result?.boltCheckUserList || []
            })
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            fixed: "left" as FixedType,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'segmentName',
            title: '段信息',
            dataIndex: 'segmentName'
        },
        {
            key: 'boltProjectEntriesName',
            title: '螺栓定额条目',
            dataIndex: 'boltProjectEntriesName',
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["data", index, "boltProjectEntriesName"]}>
                    <Select size="small">
                        {
                            patternTypeOptions?.map((item: any, index: number) =>
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
            key: 'boltPrice',
            title: '螺栓单价',
            dataIndex: 'boltPrice'
        },
        {
            key: 'boltCheckPrice',
            title: '校核单价',
            dataIndex: 'boltCheckPrice'
        },
        {
            key: 'codeCount',
            title: '件号数',
            dataIndex: 'codeCount'
        },
        {
            key: 'boltUser',
            title: '螺栓清单',
            dataIndex: 'boltUser',
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["data", index, "boltUser"]}>
                    <Select size="small">
                        {
                            userDatas?.user.map((res: any) => {
                                return <Select.Option value={res.userId} key={res.userId}>{res.userName}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
            )
        },
        {
            key: 'boltCheckUser',
            title: '清单校核',
            dataIndex: 'boltCheckUser',
            render: (_: string, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={["data", index, "boltCheckUser"]}>
                    <Select size="small">
                        {
                            userDatas?.check.map((res: any) => {
                                return <Select.Option value={res.userId} key={res.userId}>{res.userName}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
            )
        }
    ]

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/boltRecord/getBoltSegment?id=${id}`);
            form.setFieldsValue({ data: result })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [] })

    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.post(`/tower-science/boltRecord/saveBoltSegment`, postData);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const data = form.getFieldsValue(true).data;
            await saveRun(data)
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent className={styles.quotaEntries}>
            <Form form={form} >
                <CommonTable
                    isPage={false}
                    columns={columns}
                    dataSource={data || []}
                    pagination={false}
                />
            </Form>
        </DetailContent>
    </Spin >
})