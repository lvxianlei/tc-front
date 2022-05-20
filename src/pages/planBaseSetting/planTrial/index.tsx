import React, { useState } from 'react';
import { Space, Button, Popconfirm, Input, Form, message, InputNumber, Upload, Modal, Table, DatePicker, Select } from 'antd';
import { Page } from '../../common';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import styles from './Trial.module.less';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import AuthUtil from '../../../utils/AuthUtil';
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import useRequest from '@ahooksjs/use-request';
interface Column extends ColumnType<object> {
    editable?: boolean;
}
export default function PlanTrialList(): React.ReactNode {
    const history = useHistory();
   
    const params = useParams<{
        id: string,
        productSegmentId: string,
        status: string,
        materialLeader: string
    }>();
    const [filterValue, setFilterValue] = useState({status:1});
    const [refresh, setRefresh] = useState<boolean>(false);
    const [editorLock, setEditorLock] = useState('编辑');
    const [sum, setSum] = useState<any>({})
    const [formRef] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const { data: productUnitData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/productionUnit?size=10000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))
    const columns: any = [
        {
            title: "下达单",
            dataIndex: "issuedNumber",
            editable: true,
            width:120,
            fixed:'left',
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            key: 'startTransferTime',
            title: '开始转运日期',
            width: 150,
            editable: true,
            fixed:'left',
            dataIndex: 'startTransferTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['data', index, "startTransferTime"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择开始转运日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' onChange={ () => rowChange(index)} disabled={record?.status===2}/>
                </Form.Item>
            )
        },
        {
            key: 'endTransferTime',
            title: '完成转运日期',
            width: 150,
            editable: true,
            fixed:'left',
            dataIndex: 'endTransferTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['data', index, "endTransferTime"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择完成转运日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' onChange={ () => rowChange(index)} disabled={record?.status===2}/>
                </Form.Item>
            )
        },
        {
            key: 'planCompleteTime',
            title: '计划完成日期',
            width: 150,
            editable: true,
            fixed:'left',
            dataIndex: 'planCompleteTime',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['data', index, "planCompleteTime"]}
                    initialValue={record.segmentName}
                    rules={[{
                        required: true,
                        message: '请选择计划完成日期'
                    }]}
                >
                    <DatePicker format='YYYY-MM-DD' onChange={ () => rowChange(index)} disabled={record?.status===2}/>
                </Form.Item>
            )
        },
        {
            key: 'trialAssembleUnitId',
            title: '试装单元',
            dataIndex: 'trialAssembleUnitId',
            width: 120,
            fixed:'left',
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['data', index, "trialAssembleUnitId"]}
                    initialValue={_}
                    rules={[{
                        required: true,
                        message: '请选择试装单元'
                    }]}
                    // initialValue={ record.pattern }
                >
                    <Select onChange={ () => rowChange(index) } disabled={record?.status===2}>
                        { productUnitData && productUnitData.map(({ id, name }:any, index:number) => {
                        return <Select.Option key={ index } value={ id }>
                            { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item>
            )
        },
        {
            title: '试装备注',
            dataIndex: 'trialAssembleRemark',
            key: 'trialAssembleRemark',
            fixed:'left',
            width: 120,
            editable: true,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item
                    name={['data', index, "trialAssembleRemark"]}
                    initialValue={_}
                >
                    <TextArea
                        size="small"
                        rows={1}
                        showCount
                        maxLength={300}
                        onChange={() => rowChange(index)}
                        disabled={record?.status===2}
                    />
                </Form.Item>
            )
        },
        {
            title: "试装重量（t）",
            dataIndex: "trialAssembleWeight",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "试装段",
            dataIndex: "trialAssembleSegment",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "试装说明",
            dataIndex: "trialAssembleDemand",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "计划号",
            dataIndex: "planNumber",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "塔型",
            dataIndex: "productCategoryName",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "批次号",
            dataIndex: "productionBatchNo",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "产品类型",
            dataIndex: "productType",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "客户",
            dataIndex: "customerCompany",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "线路名称",
            dataIndex: "lineName",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "生产单元组",
            dataIndex: "productionUnitName",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "业务经理",
            dataIndex: "businessManagerName",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "计划交货期",
            dataIndex: "planDeliveryTime",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "电压等级（kv）",
            dataIndex: "voltageGradeName",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "状态",
            dataIndex: "status",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "下发日期",
            dataIndex: "issueTime",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "下发人",
            dataIndex: "issueUserName",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        },
        {
            title: "实际完成时间",
            dataIndex: "completeTime",
            editable: true,
            width:120,
            render: (_: any, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{_}</span>
            )
        }
    ];

    const columnsSetting: Column[] = columns.map((col: any) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            render: (_: number, record: Record<string, any>, index: number): React.ReactNode => (
                <p className={ col.dataIndex === 'loftingCompleteRealTime' ? styles.red : ''}>{_ === -1 ? 0 : _}</p>
            )
        }
    })
    const [tableColumns, setColumns] = useState(columnsSetting);
    const onFilterSubmit = (values: any) => {
            if (values.time) {
                const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
                values.startTime = formatDate[0] + ' 00:00:00';
                values.endTime = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
    }
    const rowChange = (index: number) => {
        rowChangeList.push(index);
        console.log(rowChangeList)
        setRowChangeList([...rowChangeList]);
    }
    const [rowChangeList, setRowChangeList] = useState<number[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
        console.log(selectedRows)
        const totalHoles = selectedRows.reduce((pre: any,cur: { trialAssembleSegment: any;})=>{
            return parseFloat(pre!==null?pre:0) + parseFloat(cur.trialAssembleSegment!==null?cur.trialAssembleSegment:0) 
        },0)
        const totalWeight = selectedRows.reduce((pre: any,cur: { trialAssembleWeight: any; })=>{
            return parseFloat(pre!==null?pre:0) + parseFloat(cur.trialAssembleWeight!==null?cur.trialAssembleWeight:0)
        },0)
        setSum({
            ...sum,
            totalHoles,
            totalWeight
        })
    }

    return <>
     <Form form={formRef} className={styles.descripForm}>
        <Page
            path="/tower-aps/trialAssemble/page"
            columns={[...tableColumns as any]}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange,
                    getCheckboxProps: (record: any) => ({
                        disabled: record.status === 2, //已下发不可再次下发
                    }),
                }
            }}
           
            filterValue={filterValue}
            extraOperation={
                <Space direction="horizontal" size="small">
                    <Space>
                        <span>合计：</span>
                        <span>试装重量（t）：{sum?.totalWeight}</span>
                        <span>试装总段数：{sum?.totalHoles}</span>
                    </Space>
                    <Button type="primary" ghost onClick={async () => {
                        if (editorLock === '编辑') {
                            setColumns(columns);
                            setEditorLock('保存');
                        } else {
                            const newRowChangeList: number[] = Array.from(new Set(rowChangeList));
                            await formRef.validateFields();
                            let values = formRef.getFieldsValue(true).data;
                            console.log(values)

                            if (values && values.length > 0 && newRowChangeList.length > 0) {
                                let changeValues = values.filter((item: any, index: number) => {
                                    return newRowChangeList.indexOf(index) !== -1;
                                })
                                RequestUtil.post(`/tower-aps/trialAssemble/save`, [...changeValues]).then(res => {
                                    setColumns(columnsSetting);
                                    setEditorLock('编辑');
                                    formRef.resetFields()
                                    setRowChangeList([]);
                                    setRefresh(!refresh);
                                    history.go(0)
                                });
                            } else {
                                setColumns(columnsSetting);
                                setEditorLock('编辑');
                                formRef.resetFields()
                                setRowChangeList([]);
                                setRefresh(!refresh);
                            }

                        }
                        console.log(formRef.getFieldsValue(true))
                    }} disabled={formRef.getFieldsValue(true).data && formRef.getFieldsValue(true).data?.length === 0}>{editorLock}</Button>
                    <Popconfirm
                        title="下发后不可取消，是否下发试装计划？"
                        onConfirm={async () => {
                            if (selectedKeys.length > 0)
                                if (!(selectedKeys.length > 100)) {
                                    await RequestUtil.post(`/tower-science/trialAssemble/distribute`,{
                                        issueOrderIds: selectedKeys
                                    }).then(() => {
                                        message.success('下发成功！');
                                        setRefresh(!refresh);
                                        history.go(0)
                                    })
                                }
                            else {
                                message.warning('请选择要下发的数据')
                            }
                        }}
                        okText="提交"
                        cancelText="取消"
                        disabled={editorLock === '保存' ? true : !(selectedKeys.length > 0)}
                    >
                        <Button type="primary" ghost disabled={editorLock === '保存' ? true : !(selectedKeys.length > 0)}>试装下发</Button>
                    </Popconfirm>
                </Space>
            }
            searchFormItems={[
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input style={{ width: "200px" }} placeholder="计划号/塔型/业务经理/客户/批次号" />
                },
                {
                    name: 'productTypeId',
                    label: '产品类型',
                    children: <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                        {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'productUnitName',
                    label: '生产单元',
                    children: <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                        { productUnitData?.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.name }>{ item.name }</Select.Option>
                        }) }
                    </Select>
                },
                {
                    name: 'status',
                    label: '状态',
                    children: <Form.Item name='status' initialValue={1}>
                        <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={1} key="1">未下发</Select.Option>
                            <Select.Option value={2} key="2">已下发</Select.Option>
                            <Select.Option value={3} key="3">已完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'time',
                    label: '计划交货日期',
                    children: <DatePicker.RangePicker />
                },
                
            ]}
            onFilterSubmit={onFilterSubmit}
        />
     </Form>   
        
    </>
}