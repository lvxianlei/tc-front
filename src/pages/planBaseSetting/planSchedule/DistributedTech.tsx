/**
 * @author zyc
 * @copyright © 2022 
 * @description 下发技术
 */

import React, { useState } from "react";
import { Input, Button, Modal, message, Select, DatePicker, Form, Tooltip, Space, Spin, Divider } from 'antd';
import { BaseInfo, CommonTable, DetailContent, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import { ILink, IPlanSchedule, IUnit } from './IPlanSchedule';
import { gantt } from 'dhtmlx-gantt';
import { Link, useHistory } from 'react-router-dom';
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import useRequest from "@ahooksjs/use-request";
import RequestUtil from "../../../utils/RequestUtil";


export interface DistributedTechRefProps {
    onSubmit: () => void
    resetFields: () => void
}


const SortableItem = SortableElement((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableRowElement> & React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />);
const SortableCon = SortableContainer((props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableSectionElement> & React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />);

export default function DistributedTech(): React.ReactNode {
    const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
    const [form] = Form.useForm();
    const [linkList, setLinkList] = useState<ILink[]>([])
    const history = useHistory();
    // const [dataSource, setDataSource] = useState(record.map((item: IPlanSchedule, index: number) => {
    //     return {
    //         ...item,
    //         index: index
    //     }
    // }))

    const [dataSource, setDataSource] = useState([])

    const { loading, data } = useRequest<IUnit[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: IUnit[] = await RequestUtil.get(`/tower-aps/productionUnit/list`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [] })

    const baseColumns = [
        {
            "title": "生产单元",
            "dataIndex": "unitId",
            "type": "select",
            "rules": [
                {
                    "required": true,
                    "message": "请选择生产单元"
                }
            ]
        },
        {
            "title": "生产环节",
            "dataIndex": "linkId",
            "type": "select",
            "rules": [
                {
                    "required": true,
                    "message": "请选择生产环节"
                }
            ]
        }
    ]

    const tableColumns = [
        {
            title: '排序',
            dataIndex: 'sort',
            width: 50,
            className: 'drag-visible',
            render: () => <DragHandle />,
        },
        {
            key: 'planNumber',
            title: '计划号',
            dataIndex: 'planNumber',
            width: 150
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            dataIndex: 'productCategoryName',
            width: 150
        },
        {
            key: 'productNum',
            title: '基数',
            dataIndex: 'productNum',
            width: 120
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            width: 180
        }
    ]

    const onSortEnd = (props: { oldIndex: number; newIndex: number; }) => {
        if (props.oldIndex !== props.newIndex) {
            const newData = arrayMove(dataSource, props.oldIndex, props.newIndex).filter(el => !!el);
            setDataSource(newData)
        }
    };


    const DraggableContainer = (props: any) => (
        <SortableCon
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={onSortEnd}
            {...props}
        />
    );

    const DraggableBodyRow = ({ ...restProps }) => {
        const index = dataSource.findIndex((x: any) => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };

    const unitChange = async (value: string) => {
        const result: ILink[] = await RequestUtil.get(`/tower-aps/productionLink/link/${value}`);
        setLinkList(result || [])
    }


    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IPlanSchedule[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }

    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IPlanSchedule[]>([]);
    return (<Spin spinning={loading}>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" >
                <Button type="primary" onClick={() => { }}>下发技术</Button>
                <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
            </Space>
        ]}>
            <BaseInfo form={form} columns={baseColumns.map((item: any) => {
                if (item.dataIndex === "unitId") {
                    return ({
                        ...item,
                        type: 'select',
                        render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name="unitId" style={{ width: '100%' }}>
                                <Select getPopupContainer={triggerNode => triggerNode.parentNode} onChange={(e: string) => unitChange(e)} style={{ width: "150px" }}>
                                    {data && data.map(({ id, name }, index) => {
                                        return <Select.Option key={index} value={id}>
                                            {name}
                                        </Select.Option>
                                    })}
                                </Select>
                            </Form.Item>)
                    })
                }
                if (item.dataIndex === "linkId") {
                    return ({
                        ...item,
                        type: 'select',
                        render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                            <Form.Item name="linkId" style={{ width: '100%' }}>
                                <Select getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                                    {linkList && linkList.map(({ id, name }, index) => {
                                        return <Select.Option key={index} value={id}>
                                            {name}
                                        </Select.Option>
                                    })}
                                </Select>
                            </Form.Item>)
                    })
                }
                return item
            })} col={2} dataSource={{}} edit />
            <Divider style={{ marginTop: '0' }}>请拖拽列表排序，列表排序为任务完成的顺序</Divider>
            <CommonTable
                scroll={{ x: '700' }}
                rowKey="index"
                dataSource={dataSource}
                pagination={false}
                columns={tableColumns}
                components={{
                    body: {
                        wrapper: DraggableContainer,
                        row: DraggableBodyRow,
                    },
                }}
            />
        </DetailContent>
    </Spin>
    )
}