import React, { useState, useRef } from 'react'
import { Button, Select, Input, Modal, message } from 'antd'
import { useHistory, } from 'react-router-dom'
import { priceMaintain } from "./rawMaterial.json"
import { Page } from '../../common'
import Edit from "./Edit"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import ApplicationContext from "../../../configuration/ApplicationContext"

export default function Overview(): React.ReactNode {
    const history = useHistory()
    const [editId, setEditId] = useState<string>("")
    const [oprationType, setOprationType] = useState<"new" | "edit">("new")
    const [visible, setVisible] = useState<boolean>(false)
    const editRef = useRef<{ onSubmit: () => void }>({ onSubmit: () => { } })
    const invoiceTypeEnum = (ApplicationContext.get().dictionaryOption as any)["104"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const onFilterSubmit = (value: any) => {
        return value
    }
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/materialPrice/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    await deleteRun(id)
                    message.success("成功删除...")
                    resove(true)
                    history.go(0)
                } catch (error) {
                    reject(false)
                }
            })
        })
    }

    const handleEditOk = () => new Promise(async (resove, reject) => {
        await editRef.current.onSubmit()
        message.success("保存成功...")
    })

    return (
        <>
            <Modal
                title={oprationType === "new" ? "添加" : "编辑"}
                width={1011}
                visible={visible}
                destroyOnClose
                onOk={handleEditOk}
                onCancel={() => {
                    setEditId("")
                    setVisible(false)
                }} >
                <Edit type={oprationType} id={editId} ref={editRef} />
            </Modal>
            <Page
                path="/tower-supply/materialPrice"
                columns={[
                    {
                        "title": "序号",
                        "dataIndex": "index",
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...priceMaintain.map((item: any) => {
                        if (item.dataIndex === "price") {
                            return ({ ...item, render: (value: number) => <>¥ {value} / 吨</> })
                        }
                        return item
                    }),
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        fixed: 'right',
                        width: 100,
                        render: (_: any, record: any): React.ReactNode => {
                            return <>
                                <Button type="link" onClick={() => {
                                    setOprationType("edit")
                                    setEditId(record.id)
                                    setVisible(true)
                                }}>编辑</Button>
                                <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
                            </>
                        }
                    }
                ]}
                extraOperation={<>
                    <Button type="primary" ghost>导出</Button>
                    <Button type="primary" ghost>导入</Button>
                    <Button type="primary" onClick={() => {
                        setOprationType("new")
                        setVisible(true)
                    }} ghost>添加</Button>
                    <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
                </>}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'materialCategoryId',
                        label: '原材料类型',
                        children: <Select style={{ width: "150px" }}>
                            {invoiceTypeEnum.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    },
                    {
                        name: 'materialStandard',
                        label: '原材料标准',
                        children: <Select style={{ width: "150px" }}>
                            <Select.Option value="">全部</Select.Option>
                            {invoiceTypeEnum.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    },
                    {
                        name: 'materialName',
                        label: '原材料名称',
                        children: <Input placeholder="原材料名称" />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: '查询',
                        children: <Input placeholder="原材料名称/规格" />
                    },
                ]}
            />
        </>
    )
}