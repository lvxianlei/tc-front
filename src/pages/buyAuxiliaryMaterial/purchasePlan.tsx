import React, { useState, useRef } from 'react';
import { Modal, Button, DatePicker, Select, Input, message } from 'antd';
import {Attachment, BaseInfo, DetailTitle, IntgSelect, OperationRecord, SearchTable as Page} from '../common'
import {Link, useHistory, useLocation, useRouteMatch} from 'react-router-dom';
import RequestUtil from '../../utils/RequestUtil';
import { purchasePlan } from './purchasePlan.json'
import useRequest from '@ahooksjs/use-request';
import {materialColumns} from "../contract-mngt/enquiryCompare/enquiry.json";
import ExportList from "../../components/export/list";
import Edit from "./edit";
interface TaskAssignRef {
    onSubmit: () => void
    resetFields: () => void
}
export default function PurchasePlan() {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [detailId, setDetailId] = useState<string>("")
    const location = useLocation<{ state: {} }>();
    const match = useRouteMatch()
    // 导出模态框
    const [isExport, setIsExportStoreList] = useState(false)
    // 选中数据列表
    const [generateIds, setGenerateIds] = useState<string[]>([])
    const [dataSource, setDataSource] = useState<object[]>([])
    // 筛选组
    const [filterValue, setFilterValue] = useState<object>({
        ...history.location.state as object,
        inquirer: history.location.state ? sessionStorage.getItem('USER_ID') : "",
        purchaseType:1
    })
    const editRef = useRef<TaskAssignRef>({ onSubmit: () => { }, resetFields: () => { } })
    // 模态窗
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // 聚焦采购任务
    const [id, setId] = useState<string>("");//采购任务id
    const [obj, setObj] = useState<any>({});
    const [rejectionDescription, setRejectionDescription] = useState("");
    // getlist
    const { run: generaterRun } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const data = await RequestUtil.get(`/tower-supply/initData/materialPurchaseTask`);
            resole(data)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 汇总request
    const selectMerge = async () => {
        const result: { [key: string]: any } = await RequestUtil.post('/tower-supply/auxiliaryMaterialPurchasePlan/collect',generateIds)
    }

    // 关闭
    const handleClose = () => {
        setIsModalVisible(false);
    }

    const buttons: {} | null | undefined = [
        <Button onClick={() => handleClose()} key='close'>关闭</Button>,
        <Button type="primary"  onClick={async () =>{
            console.log(generateIds)
            if (!editRef.current) {
                message.warning("请先选择辅材...")
                return
            }

            // planPurchaseNum

            await editRef.current?.onSubmit();
            handleClose()
        }} key='submit'>提交</Button>
    ]

    const onFilterSubmit = (value: any) => {
        if (value.createdTime) {
            const formatDate = value.createdTime.map((item: any) => item.format("YYYY-MM-DD"))
            delete value.createdTime
            value.createdTime = formatDate[0] + ' 00:00:00';
            value.createdTime = formatDate[1] + ' 23:59:59';
        }
        setFilterValue({...filterValue,...value})
        return value
    }
    return (
        <>
            <Page
                path="/tower-supply/auxiliaryMaterialPurchasePlan"
                exportPath="/tower-supply/auxiliaryMaterialPurchasePlan"
                refresh={ refresh }
                columns={[
                    {
                        title: "序号",
                        dataIndex: "index",
                        width: 50,
                        fixed: "left",
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...purchasePlan.map((item: any) => {
                        return ({ ...item})
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 80,
                        render: (_: any, records: any) => <>
                            <Button type="link" className="btn-operation-link" onClick={
                                ()=>{setDetailId(records.id)}
                            }>
                                <Link className="btn-operation-link" to={{
                                    pathname: `/buyAuxiliaryMaterial/purchasePlan/${records.id}`,
                                    search: `${records.purchasePlanNumber || records.collectPurchasePlanNumber},${records.repurchaseTime == null ? '': records.repurchaseTime},${records.purchasePlanStatus}`
                                }}>采购清单</Link>
                            </Button>
                        </>
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                extraOperation={<>
                    <Button type="primary" ghost onClick={() => {
                        editRef.current?.resetFields()
                        setIsModalVisible(true)
                    }}>创建采购计划</Button>
                    <Button type="primary" ghost onClick={() => {
                        if(!generateIds.length){
                            return message.warn('请选择采购计划')
                        }
                        Modal.confirm({
                            title: "汇总",
                            content: "确定汇总计划吗？",
                            onOk: async () => {
                                await selectMerge()
                                message.success("操作成功")
                                setRefresh(!refresh)
                                history.go(0)
                            }
                        })
                    }}>创建计划汇总</Button>
                </>}
                searchFormItems={[
                    {
                        name: 'purchasePlanStatus',
                        label: '计划状态',
                        children: <Select style={{ width: 100 }} defaultValue="">
                            <Select.Option value="" key="">全部</Select.Option>
                            <Select.Option value={1} key={1}>待完成</Select.Option>
                            <Select.Option value={2} key={2}>已完成</Select.Option>
                            <Select.Option value={3} key={3}>已取消</Select.Option>
                        </Select>
                    },
                    {
                        name: 'createTime',
                        label: '创建日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'collectType',
                        label: '汇总状态',
                        children: <Select style={{ width: 100 }} defaultValue="">
                            <Select.Option value="" key="">全部</Select.Option>
                            <Select.Option value={0} key={0}>未汇总</Select.Option>
                            <Select.Option value={1} key={1}>已汇总</Select.Option>
                        </Select>
                    },
                    // todo 申请人字段未返回
                    {
                        name: 'applyName',
                        label: '申请人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: '模糊查询',
                        children: <Input placeholder="采购任务编号/使用部门" style={{ width: 260 }} maxLength={200} />
                    }
                ]}
                tableProps={{
                    rowSelection: {
                        type: "checkbox",
                        selectedRowKeys: generateIds,
                        onChange: (selectedRowKeys: any[]) => {
                            setGenerateIds(selectedRowKeys)
                        },
                        getCheckboxProps: (record: any) => record.collectType === 1
                    }
                }}
            />
            <Modal width={1011} title="创建采购计划" visible={isModalVisible} footer={buttons} onCancel={handleCancel}
             onOk={()=>{}}
            >
                <Edit ref={editRef} id={detailId} type={'new'}/>
            </Modal>
        </>
    )
}