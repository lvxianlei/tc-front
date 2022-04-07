/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-杆塔配段-包装清单-套用包
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin, Form, Input, Space, Button, message, Modal } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { IPackingList } from "./ISetOut";
import styles from './SetOut.module.less';

interface ApplyPackingProps {
    id: string;
    detailData: any;
}

export interface EditProps {
    onSubmit: () => void
}

interface ISelectTower {
    readonly id?: string;
    readonly productCategory?: string;
    readonly productCategoryName?: string;
    readonly productHeight?: string;
    readonly productId?: string;
    readonly productNumber?: string;
    readonly projectName?: string;
}

export default forwardRef(function ApplyPacking({ id, detailData }: ApplyPackingProps, ref) {
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState<IPackingList[]>([]);
    const [packingData, setPackingData] = useState<IPackingList[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectRows, setSelectRows] = useState<any>([]);
    const [selectTower, setSelectTower] = useState<ISelectTower>({});


    const towerColumns = [
        {
            "key": "planNumber",
            "title": "计划号",
            "dataIndex": "planNumber",
            "width": 150
        },
        {
            "key": "projectName",
            "title": "工程名称",
            "dataIndex": "projectName",
            "width": 150
        },
        {
            "key": "productCategoryName",
            "title": "塔型",
            "dataIndex": "productCategoryName",
            "width": 120
        },
        {
            "key": "productNumber",
            "title": "杆塔号",
            "dataIndex": "productNumber",
            "width": 120
        },
        {
            "key": "productHeight",
            "title": "呼高",
            "dataIndex": "productHeight",
            "width": 80
        }
    ]

    const packingColumns = [
        {
            "key": "balesCode",
            "title": "包名",
            "dataIndex": "balesCode",
            "width": 150
        },
        {
            "key": "packageTypeName",
            "title": "包类型",
            "dataIndex": "packageTypeName",
            "width": 150
        },
        {
            "key": "packageAttributeName",
            "title": "包属性",
            "dataIndex": "packageAttributeName",
            "width": 150
        },
        {
            "key": "packageSegment",
            "title": "包段落",
            "dataIndex": "packageSegment",
            "width": 150
        }
    ]

    const { loading } = useRequest(() => new Promise(async (resole, reject) => {
        try {
            getTableDataSource();
            resole(true)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const getTableDataSource = (filterValues?: Record<string, any>) => new Promise(async (resole, reject) => {
        const list = await RequestUtil.get<IPackingList[]>(`/tower-science/packageStructure/getPackageProduct`, { ...filterValues, productId: id });
        setDataSource(list);
    });

    const { run: saveRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.post(`/tower-science/packageStructure/copy`, postData);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            if (selectRows.length > 0) {
                const newDetailData = detailData.map((res: any) => res.balesCode)
                const tip = selectRows.filter((item: any) => newDetailData.indexOf(item.balesCode) > -1);
                const data = {
                    id: id,
                    productCategory: selectTower.productCategory,
                    productCategoryName: selectTower.productCategoryName,
                    productId: selectTower.id,
                    productNumber: selectTower.productNumber,
                    projectName: selectTower.projectName,
                    productHeight: selectTower.productHeight,
                    packageStructureSaveDTOS: selectRows
                }
                if (tip.length > 0) {
                    Modal.confirm({
                        title: "复制",
                        content: "包名已存在，是否覆盖？",
                        onOk: async () => {
                            await saveRun(data);
                            resolve(true);
                        }
                    })

                } else {
                    await saveRun(data)
                    resolve(true);
                }

            } else {
                message.warning('请选择要复制的数据');
                reject(false)
            }
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields();
    }

    const handleChange = (selectedRowKeys: string[], selectRows: []) => {
        setSelectedRowKeys(selectedRowKeys)
        setSelectRows(selectRows)
    }

    const getPackingList = (record: Record<string, any>) => new Promise(async (resole, reject) => {
        const list = await RequestUtil.get<IPackingList[]>(`/tower-science/packageStructure/${record.id}`);
        setSelectTower(record)
        setPackingData(list);
    });

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent style={{ padding: '16px' }}>
            <Form
                form={form}
                layout="inline"
                style={{ paddingBottom: '16px' }}
                onFinish={(value: Record<string, any>) => getTableDataSource(value)}
            >
                <Form.Item name="projectName" label="工程名称">
                    <Input placeholder="请输入" maxLength={100} />
                </Form.Item>
                <Form.Item name="planNumber" label="计划号">
                    <Input placeholder="请输入" maxLength={100} />
                </Form.Item>
                <Form.Item name="productCategory" label="塔型">
                    <Input placeholder="请输入" maxLength={100} />
                </Form.Item>
                <Form.Item name="productNumber" label="杆塔号">
                    <Input placeholder="请输入" maxLength={100} />
                </Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button type="ghost" htmlType="reset">重置</Button>
                </Space>
            </Form>
            <div style={{minHeight: '476px'}}>
                <CommonTable
                    haveIndex
                    columns={towerColumns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ y: '500px' }}
                    style={{
                        width: '48%',
                        position: 'absolute'
                    }}
                    onRow={(record: Record<string, any>, index: number) => ({
                        onClick: () => getPackingList(record),
                        className: styles.tableRow
                    })}
                />
                <CommonTable
                    haveIndex
                    columns={packingColumns}
                    rowKey="id"
                    style={{
                        width: '48%',
                        position: 'absolute',
                        left: '50%',
                        right:'16px'
                    }}
                    scroll={{ y: '500px' }}
                    dataSource={packingData}
                    pagination={false}
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        type: "checkbox",
                        onChange: handleChange
                    }}
                />
                
            </div>
        </DetailContent>
    </Spin>
})

