/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-补件申请-申请-添加补件
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Input, InputNumber, Radio, RadioChangeEvent, Select } from 'antd';
import { Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { addColumns } from "./patchApplication.json";
import { FixedType } from 'rc-table/lib/interface';
import styles from './PatchApplication.module.less';

interface modalProps {
    readonly record?: any;
}

export default forwardRef(function AddPatch({ record }: modalProps, ref) {
    const [filterValue, setFilterValue] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [status, setStatus] = useState<1 | 2>(1);
    const [detailData, setDetailData] = useState<any>([])

    const { data: sectionsNames } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/productSegment/segmentList?productCategoryId=${record.productCategoryId}`);
        resole(data)
    }), {})

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const value = detailData.filter((res: any) => {
                return selectedRowKeys.findIndex(item => item === res?.id) !== -1
            })
            if (status === 1) {
                resolve(value.map((res: any) => {
                    return {
                        ...res,
                        productCategoryId: record.productCategoryId,
                        productCategoryName: record.productCategoryName,
                        basicsPartNum: record.partNum,
                        structureId: res.id
                    }
                }));
            } else {
                let newValue: any = []
                value.forEach((element: any) => {
                    newValue.push(element, ...(element?.child?.map((item: any) => {
                        return {
                            ...item,
                            partNum: element?.partNum,
                            totalWeight: (Number(item?.partNum) * Number(item?.basicsWeight || 0)).toFixed(2)
                        }
                    }) || []))
                });
                resolve(newValue.filter(Boolean)?.map((res: any) => {
                    return {
                        ...res,
                        productCategoryId: record.productCategoryId,
                        productCategoryName: record.productCategoryName,
                        basicsPartNum: res.partNum,
                        structureId: res.id,
                        totalWeight: (Number(res?.partNum) * Number(res?.basicsWeight || 0) * Number(res?.singleNum || 0)).toFixed(2)
                    }
                }));
            }
        } catch (error) {
            reject(error)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit]);

    const onSelectChange = (selectedRowKeys: any[], selectRows: any[]) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectRows);
    }

    return <>
        <Page
            path={status === 1 ? "/tower-science/productStructure/supply/entry/list" : '/tower-science/productStructure/supply/weld/structure'}
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    fixed: "left" as FixedType,
                    render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...addColumns.map(res => {
                    if (res.dataIndex === 'code') {
                        return ({
                            ...res,
                            render: (_: number, record: any, key: number): React.ReactNode => (record.isMainPart === 1 ? <p className={styles.weldingGreen}>{_}</p> : <span>{_}</span>)
                        })
                    }
                    if (res.dataIndex === 'partNum') {
                        return {
                            ...res,
                            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                                <InputNumber disabled={record?.isMainPart === 0} min={0} max={9999} precision={0} size="small" defaultValue={0} onChange={(e) => {
                                    const newList = detailData.map((res: any, ind: number) => {
                                        if (ind === index) {
                                            return {
                                                ...res,
                                                partNum: e
                                            }
                                        } else {
                                            return res
                                        }
                                    })
                                    setDetailData([...newList])
                                }} />
                            )
                        }
                    }
                    return res
                })]}
            onGetDataSource={(e) => {
                const newData = e.map((res: any) => {
                    return {
                        ...res,
                        child: [
                            ...e.map((item: any) => {
                                if (item?.weldSegmentId === res?.weldSegmentId && item?.isMainPart === 0) {
                                    return item
                                }
                            })
                        ].filter(Boolean)
                    }
                })
                setDetailData(newData)
                return e
            }}
            headTabs={[]}
            requestData={{ productCategoryId: record?.productCategoryId }}
            extraOperation={
                <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                    setStatus(event.target.value);
                    setFilterValue({})
                    setSelectedRowKeys([]);
                    setSelectedRows([]);
                }}>
                    <Radio.Button value={1} key="1">零件</Radio.Button>
                    <Radio.Button value={2} key="2">电焊件</Radio.Button>
                </Radio.Group>}
            searchFormItems={[
                {
                    name: 'productCategoryName',
                    label: '塔型名称',
                    children: <p style={{ marginTop: '6px' }}>{record?.productCategoryName}</p>
                },
                {
                    name: 'segmentId',
                    label: '段名',
                    children: <Select placeholder="请选择段名" mode="multiple" allowClear style={{ width: '200px' }}>
                        {sectionsNames && sectionsNames.map(({ id, segmentName }: any, index: number) => {
                            return <Select.Option key={index} value={id}>
                                {segmentName}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'code',
                    label: '件号名称',
                    children: <Input />
                },
                {
                    name: 'description',
                    label: '备注',
                    children: <Input />
                },
                {
                    name: 'specialCode',
                    label: '特殊件号',
                    children: <Select placeholder="请选择特殊件号">
                        <Select.Option value={''} key={0}>全部</Select.Option>
                        <Select.Option value={1} key={1}>是</Select.Option>
                        <Select.Option value={2} key={2}>否</Select.Option>
                    </Select>
                }
            ]}
            filterValue={filterValue}
            tableProps={{
                rowKey: 'id',
                pagination: status === 1 ? {
                    pageSize: 50
                } : false,
                rowSelection: {
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                    type: "checkbox",
                    getCheckboxProps: (record) => ({
                        disabled: record?.isMainPart === 0
                    }),
                }
            }}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.segmentId) {
                    values.segmentId = values.segmentId.join(',');
                }
                setFilterValue(values);
                return values;
            }}
        />
    </>
})

