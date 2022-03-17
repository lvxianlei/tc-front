import React, { useState, useRef } from 'react'
import { Button, Select, Input, Modal, message, Upload, Popconfirm } from 'antd'
import { useHistory } from 'react-router-dom'
import { priceMaintain } from "./rawMaterial.json"
import { Page } from '../../common'
import Edit from "./Edit"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import AuthUtil from '../../../utils/AuthUtil';
import { materialStandardOptions } from '../../../configuration/DictionaryOptions'

export default function Overview(): React.ReactNode {
    const history = useHistory()
    const [editId, setEditId] = useState<string>("")
    const [oprationType, setOprationType] = useState<"new" | "edit">("new")
    const [visible, setVisible] = useState<boolean>(false)
    const [ filterValue, setFilterValue ] = useState({});
    const editRef = useRef<{ onSubmit: () => void, loading: boolean }>({ onSubmit: () => { }, loading: false })
    const invoiceTypeEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const onFilterSubmit = (value: any) => {
        setFilterValue(value);
        return value
    }
    const { data: priceSourceEnum } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/supplier/list`)
            resove(result.map((item: any) => ({ label: item.supplierName, value: item.id })));


        } catch (error) {
            reject(error)
        }
    }))
    // 原材料类型
    const { data: materialCategory } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/materialCategory/category`)
            resove(result.map((item: any) => ({ label: item.materialCategoryName, value: item.materialCategoryId })));
        } catch (error) {
            reject(error)
        }
    }))
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/materialPrice/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleEditOk = async () => {
        await editRef.current.onSubmit()
        message.success("保存成功...")
        history.go(0)
        setVisible(false)
    }

    return (
        <>
            <Modal
                title={oprationType === "new" ? "添加" : "编辑"}
                width={1011}
                visible={visible}
                destroyOnClose
                onOk={handleEditOk}
                confirmLoading={editRef.current?.loading}
                onCancel={() => {
                    setEditId("")
                    setVisible(false)
                }} >
                <Edit type={oprationType} id={editId} ref={editRef} priceSourceEnum={priceSourceEnum} />
            </Modal>
            <Page
                path="/tower-supply/materialPrice"
                exportPath={`/tower-supply/materialPrice`}
                columns={[
                    {
                        "title": "序号",
                        "dataIndex": "index",
                        "fixed": "left",
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
                                <Button type="link" style={{ marginRight: 12 }} onClick={() => {
                                    setOprationType("edit")
                                    setEditId(record.id)
                                    setVisible(true)
                                }}>编辑</Button>
                                <Popconfirm
                                    title="确定删除吗？"
                                    onConfirm={async() => {
                                        await deleteRun(record?.id)
                                        message.success("删除成功...")
                                        history.go(0)
                                    }}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button
                                        type="link"
                                        size="small"
                                        className="btn-operation-link"
                                    >删除</Button>
                                </Popconfirm>
                            </>
                        }
                    }
                ]}
                extraOperation={<>
                    <Upload
                        accept=".xls,.xlsx"
                        action={() => {
                            const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                            return baseUrl + '/tower-supply/materialPrice/import'
                        }}
                        headers={
                            {
                                'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                                'Tenant-Id': AuthUtil.getTenantId(),
                                'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                            }
                        }
                        showUploadList={false}
                        onChange={(info) => {
                            if (info.file.response && !info.file.response?.success) {
                                message.warning(info.file.response?.msg)
                            } else if (info.file.response && info.file.response?.success) {
                                message.success('导入成功！');
                                history.go(0);
                            }

                        }}
                    >
                        <Button type="primary" ghost>导入</Button>
                    </Upload>
                    <Button type="primary" onClick={() => {
                        setOprationType("new")
                        setVisible(true)
                    }} ghost>添加</Button>
                    <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                </>}
                onFilterSubmit={onFilterSubmit}
                filterValue={ filterValue }
                searchFormItems={[
                    {
                        name: 'materialCategoryId',
                        label: '原材料类型',
                        children: <Select style={{ width: "150px" }}>
                            {materialCategory?.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    },
                    {
                        name: 'materialStandard',
                        label: '原材料标准',
                        children: <Select style={{ width: "150px" }}>
                            <Select.Option value="">全部</Select.Option>
                            {invoiceTypeEnum?.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input placeholder="原材料名称/规格" />
                    }
                ]}
            />
        </>
    )
}