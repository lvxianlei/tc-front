import React, { useState } from 'react';
import { Spin, Button, Descriptions, Modal, Form, Input, Table, Switch } from 'antd';
import { useHistory } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import { FixedType } from 'rc-table/lib/interface';
import useRequest from '@ahooksjs/use-request';
import { Page } from '../common';

interface IPersonal {
    readonly userAccount?: string;
    readonly phone?: string;
    readonly description?: string;
    readonly number?: string;
}

export default function SelectGroup({ onSelect, selectedKey = [], ...props }: any): JSX.Element {

    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [filterValue, setFilterValue] = useState<any>({});
    const { loading } = useRequest<IPersonal>(() => new Promise(async (resole) => {
        resole({})
    }), {})
    const [detailData, setDetailData] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(selectedKey);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'name',
            title: '分组名称',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'employeeNames',
            title: '人员',
            width: 150,
            dataIndex: 'employeeNames'
        },
        {
            key: 'type',
            title: '分组分类',
            dataIndex: 'type',
            width: 120
        },
        // {
        //     key: 'clientId',
        //     title: '应用范围',
        //     width: 200,
        //     dataIndex: 'clientId'
        // },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        }
    ]

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }
    const onExpand = (expanded: any, record: any) => {
        setSelectedRows(selectedRows.concat(record?.noticeGroupEmployeeVOList))
        setSelectedKeys(selectedKeys.concat(record?.noticeGroupEmployeeVOList.map((item: any) => { return item?.employeeId })))
    }
    const expandedRowRender = (record: any) => {
        const columnsOther = [
            {
                key: 'deptName',
                title: '组织',
                dataIndex: 'deptName'
            },
            {
                key: 'employeeName',
                title: '姓名',
                dataIndex: 'employeeName'
            },
            {
                key: 'signState',
                title: '是否签收',
                dataIndex: 'signState',
                render: (_: undefined, record: Record<string, any>, index: number) => {
                    return <Switch
                        size="small"
                        checked={selectedRows.find((item: any) => item.employeeId === record.employeeId)?.signState || false}
                        onChange={(checked: boolean) => {
                            const rightData: any[] = [...selectedRows];
                            rightData[index].signState = checked ? 1 : 2
                            setSelectedRows(rightData)
                        }} />
                }
            },
        ]
        return <CommonTable
            columns={columnsOther}
            dataSource={record && record?.noticeGroupEmployeeVOList ? [...record?.noticeGroupEmployeeVOList] : []}
            rowSelection={{
                selectedRowKeys: selectedKeys,
                onChange: SelectChange,
            }}
            rowKey='employeeId'
            pagination={false}
        />;
    }

    return <>
        <Modal
            visible={visible}
            title="选择分组"
            onCancel={() => {
                setVisible(false);
                setDetailData([])
                form.resetFields();
            }}
            onOk={() => {
                setVisible(false);
                onSelect(selectedRows)
                setDetailData([])
            }}
            width='60%'
        >
            <Page
                path="/tower-system/noticeGroup"
                columns={columns}
                headTabs={[]}
                extraOperation={<></>}
                // refresh={refresh}
                tableProps={{
                    expandable: {
                        expandedRowRender,
                        onExpand
                    }
                    // rowSelection: {
                    //     selectedRowKeys: selectedKeys,
                    //     onChange: SelectChange
                    // },
                    // onRow:(record:any) => ({
                    //     onDoubleClick: async () => {
                    //         history.push(`/announcement/user/edit/${record?.id}`)
                    //     },
                    // })
                }}
                searchFormItems={[
                    {
                        name: 'type',
                        label: '分组分类',
                        children: <Input maxLength={50} placeholder="请输入分组分类" />
                    },
                    {
                        name: 'name',
                        label: '分组名称',
                        children: <Input maxLength={50} placeholder="请输入分组名称" />
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={(values: Record<string, any>) => {
                    setFilterValue(values);
                    return values;
                }}
            />
        </Modal>
        <Button type='primary' onClick={() => setVisible(true)}>选择分组</Button>
    </>
}










