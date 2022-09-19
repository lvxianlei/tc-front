//供应商管理
import React, { Key, useRef, useState } from 'react'
import { Input, Select, Button, Modal, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { SearchTable as Page } from '../../common'
import { supplierMngt } from "./supplier.json"
import Edit from "./Edit"
import Overview from "./Overview"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { qualityAssuranceOptions, supplierTypeOptions, supplyProductsOptions } from '../../../configuration/DictionaryOptions'
export default function SupplierMngt(): React.ReactNode {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({})
    const [editVisible, setEditVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")
    const [overviewVisible, setOverviewVisible] = useState<boolean>(false)
    const [oprationType, setOprationType] = useState<"new" | "edit">("new")
    const editRef = useRef<{ onSubmit: () => void }>({ onSubmit: () => { } })
    const supplierTypeEnum = supplierTypeOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const qualityAssuranceEnum = qualityAssuranceOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const invoiceTypeEnum2 = supplyProductsOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/supplier?supplierId=${id}`)
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }
    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此数据吗？",
            onOk: async () => {
                await deleteRun(id)
                await message.success("成功删除...")
                history.go(0)
            }
        })
    }
    const handleEditOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit()
            message.success("成功添加供应商...")
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })
    return <>
        <Modal destroyOnClose width={1011} title={oprationType === "new" ? "创建" : "编辑"} onOk={handleEditOk} visible={editVisible} onCancel={() => {
            setDetailId("")
            setEditVisible(false)
        }}>
            <Edit id={detailId} type={oprationType} ref={editRef} />
        </Modal>
        <Modal
            destroyOnClose
            width={1011}
            title="详情"
            visible={overviewVisible}
            footer={[<Button type="primary" key="ok" onClick={() => {
                setDetailId("")
                setOverviewVisible(false)
            }}>确定</Button>]}
            onCancel={() => {
                setDetailId("")
                setOverviewVisible(false)
            }}>
            <Overview id={detailId} />
        </Modal>
        <Page
            path="/tower-supply/supplier"
            exportPath={`/tower-supply/supplier`}
            filterValue={filterValue}
            columns={[
                {
                    title: "序号",
                    dataIndex: "index",
                    width: 40,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                }
                ,
                ...supplierMngt.map((item: any) => {
                    switch (item.dataIndex) {
                        case "supplierType":
                            return ({ ...item, type: "select", enum: supplierTypeEnum })
                        case "qualityAssurance":
                            return ({ ...item, type: "select", enum: qualityAssuranceEnum })
                        default:
                            return item
                    }
                }),
                {
                    title: "操作",
                    dataIndex: "opration",
                    width: 200,
                    fixed: "right",
                    render: (_: any, record: any) => {
                        return <>
                            <Button type="link" style={{ marginRight: 12 }} onClick={() => {
                                setOprationType("edit")
                                setDetailId(record.id)
                                setEditVisible(true)
                            }}>编辑</Button>
                            <Button type="link" style={{ marginRight: 12 }} onClick={() => {
                                setDetailId(record.id)
                                setOverviewVisible(true)
                            }}>详情</Button>
                            <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
                        </>
                    }
                }
            ]}
            extraOperation={<>
                <Button
                    type="primary"
                    ghost
                    onClick={() => {
                        setOprationType("new")
                        setEditVisible(true)
                    }}>创建</Button>
            </>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'supplierType',
                    label: '供应商类型',
                    children: <Select style={{ width: "150px" }} defaultValue="请选择">
                        {
                            supplierTypeEnum?.map((item: { value: Key; label: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, index: string | number | undefined) => {
                                return <Select.Option value={item.value} key={index}>{item.label}</Select.Option>
                            })
                        }
                    </Select>
                },
                {
                    name: 'materialCategoryId',
                    label: '供货产品',
                    children: <Select style={{ width: "150px" }} defaultValue="请选择">
                        {
                            invoiceTypeEnum2?.map((item: { value: Key; label: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, index: string | number | undefined) => {
                                return <Select.Option value={item.value} key={index}>{item.label}</Select.Option>
                            })
                        }
                    </Select>
                },
                {
                    name: 'qualityAssurance',
                    label: '质量保证体系',
                    children: <Select style={{ width: "150px" }} defaultValue="请选择">
                        {
                            qualityAssuranceEnum?.map((item: { value: Key; label: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, index: string | number | undefined) => {
                                return <Select.Option value={item.value} key={index}>{item.label}</Select.Option>
                            })
                        }
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input style={{ width: 280 }} placeholder="供应商编号/供应商名称/联系人/联系电话" maxLength={200} />
                }
            ]}
        />
    </>
}