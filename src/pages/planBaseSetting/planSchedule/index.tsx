import React, { useState } from 'react';
import { Input, Button, Select, DatePicker, Space, message, Form, Modal } from 'antd';
import { SearchTable as Page } from '../../common';
import { planSchedule } from "./data.json"
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import { IPlanSchedule } from './IPlanSchedule';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
export interface TechnicalIssuePropsRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function PlanScheduleMngt(): React.ReactNode {
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IPlanSchedule[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }
    const [filterValue, setFilterValue] = useState({});
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IPlanSchedule[]>([]);
    const [factoryForm] = Form.useForm();
    const [dateForm] = Form.useForm();
    const history = useHistory();
    const { run } = useRequest((option) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-aps/productionPlan/batch/group/unit/productCategory`, option);
            resole(result)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { manual: true })
    const { data: workUnitList } = useRequest<{ groupId: string, groupName: string }[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`tower-aps/group/unit/config/list?size=1000`);
        resole(data?.records)
    }), {})
    const { run: runDate } = useRequest((option) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-aps/productionPlan/batch/delivery/time/productCategory`, option);
            resole(result)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { manual: true })
    const useDate = () => {
        Modal.confirm({
            title: "设置计划交货期",
            icon: null,
            content: <Form form={dateForm}>
                <Form.Item
                    label="计划交货日期"
                    name="planDeliveryTime"
                    rules={[{ required: true, message: '请选择计划交货日期' }]}>
                    <DatePicker format='YYYY-MM-DD' placeholder='请选择' locale={zhCN}/>
                </Form.Item>
            </Form>,
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    const value = await dateForm.validateFields()
                    await runDate({
                        productCategoryList: selectedKeys,
                        planDeliveryTime: moment(value?.planDeliveryTime).format('YYYY-MM-DD'),
                    })
                    await message.success("已成功设置计划交货日期！")
                    setSelectedKeys([])
                    setSelectedRows([])
                    dateForm.resetFields()
                    history.go(0)
                    resove(true)
                } catch (error) {
                    reject(false)
                }
            }),
            onCancel() {
                dateForm.resetFields()
            }
        })
    }
    const useFactoryOk  = async () => {
        await factoryForm.validateFields()
        Modal.confirm({
            title: "确认后不可取消，是否确认？",
            onOk: async () => new Promise(async (resove, reject) => {
                try {
                    const factoryId = await factoryForm.getFieldsValue(true)
                    await run({
                        productCategoryList: selectedKeys,
                        unitGroupId: factoryId.factoryId,
                    })
                    await message.success("已成功分配生产单元组！")
                    setSelectedKeys([])
                    setSelectedRows([])
                    factoryForm.resetFields()
                    history.go(0)
                    resove(true)
                } catch (error) {
                    reject(false)
                }
            }),
            onCancel: () => factoryForm.resetFields()
        })
        
    }
    const useFactory = () => {
        Modal.confirm({
            title: "分配生产单元组",
            icon: null,
            content: <Form form={factoryForm}>
                <Form.Item
                    label="分组名称"
                    name="factoryId"
                    rules={[{ required: true, message: '请选择分组名称' }]}>
                    <Select>
                        {workUnitList?.map((item: any) => <Select.Option
                            key={item.groupId}
                            value={item.groupId}>
                            {item.groupName}
                        </Select.Option>)}
                    </Select>
                </Form.Item>
            </Form>,
            onOk: useFactoryOk,
            onCancel() {
                factoryForm.resetFields()
            }
        })
    }
    return (<Page
        path="/tower-aps/productionPlan"
        columns={(planSchedule as any).map((item: any) => {
            if (item.dataIndex === "loftingFeedBackTime") {
                return ({
                    ...item,
                    getCellProps(value: any, record: any) {
                        if (moment(record.loftingCompleteTime).isBefore(moment(value), "day")) {
                            return { style: { background: "red", color: 'white', fontWeight: 'bold' } }
                        }
                    }
                })
            }
            return item
        })}
        headTabs={[]}
        extraOperation={<Space>
            <Button type="primary" onClick={useDate} disabled={!(selectedKeys.length !== 0)}>设置计划交货期</Button>
            <Button type="primary" onClick={useFactory} disabled={!(selectedKeys.length !== 0)}>分配生产单元组</Button>
            <Link to={`/planProd/planScheduleMngt/planDeliveryTime/${selectedKeys.join(',')}`}><Button type="primary" disabled={selectedKeys.length <= 0}>变更计划交货期</Button></Link>
            <Link to={`/planProd/planScheduleMngt/SplitBatch/${selectedKeys[0]}`}><Button type="primary" disabled={selectedKeys.length !== 1}>拆分批次</Button></Link>
            <Button type="primary" disabled={selectedKeys.length <= 0} onClick={() => {
                // let tip: boolean[] = [];
                // selectedRows.forEach(res => {
                //     if (res.planDeliveryTime && res.productionBatchNo) {
                //         tip.push(true)
                //     } else {
                //         tip.push(false)
                //     }
                // })
                // if (tip.findIndex(res => res === false) === -1) {
                    history.push(`/planProd/planScheduleMngt/distributedTech/${selectedKeys.join(',')}`);
                //     tip = []
                // } else {
                //     message.warning('技术派工前，请先设置拆分批次')
                //     tip = []
                // }
            }}>技术派工</Button>
        </Space>}
        tableProps={{
            rowSelection: {
                type: "checkbox",
                selectedRowKeys: selectedKeys,
                onChange: SelectChange
            }
        }}
        searchFormItems={[
            {
                name: 'productType',
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
                name: 'status',
                label: '状态',
                children: <Select placeholder="请选择" style={{ width: "150px" }}>
                    <Select.Option value={0} key="0">未下发</Select.Option>
                    <Select.Option value={1} key="1">放样已下发</Select.Option>
                    <Select.Option value={2} key="2">放样已确认</Select.Option>
                    <Select.Option value={3} key="3">放样已完成</Select.Option>
                </Select>
            },
            {
                name: 'time',
                label: '计划交货日期',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input style={{ width: "200px" }} placeholder="计划号/塔型/业务经理/客户" />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: any) => {
            if (values.time) {
                const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
                values.startTime = formatDate[0] + ' 00:00:00';
                values.endTime = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        }}
    />)
}