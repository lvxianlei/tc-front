import React, { useRef, useState } from "react"
import { useHistory } from "react-router"
import { Button, message, Modal } from "antd"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { table, dic, aliDic } from "./data.json"
import { AliTable, CommonTable } from "../../common"
import Edit, { RowData } from "./edit"
import { BaseTable, features, useTablePipeline } from "ali-react-table"
export default function Index() {
    const history = useHistory()
    const editRef = useRef<any>()
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>()
    const [visible, setVisible] = useState<boolean>(false)
    const [dicVisible, setDicVisible] = useState<boolean>(false)
    const [rowData, setRowData] = useState<RowData>({})

    const { run: dictRun } = useRequest<{ [key: string]: any }>((dics: string[]) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-system/productType/dict`, dics)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: remove } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-system/productType?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: removeDict } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-system/productType/dict?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading, data: dicData } = useRequest<object[]>((ids: string[]) => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get("/tower-system/dictionary/types/10")
            resole(result?.find((item: any) => item.code === "101")?.dictionaries)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: productLoading, data: productData } = useRequest<any[]>((ids: string[]) => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get("/tower-system/productType")
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const handleRemove = async (id: string) => {
        Modal.confirm({
            title: '删除产品类别',
            content: '确定要删除吗？',
            onOk: () =>
                new Promise(async (resolve, reject) => {
                    try {
                        await remove(id)
                        resolve(true)
                        await message.success('删除成功...')
                        history.go(0)
                    } catch (error) {
                        reject(false)
                        console.log(error)
                    }
                })
        })
    }

    const handleRemoveDict = async (id: string) => {
        Modal.confirm({
            title: '删除此关联产品类型吗？',
            content: '确定要删除吗？',
            onOk: () =>
                new Promise(async (resolve, reject) => {
                    try {
                        await removeDict(id)
                        resolve(true)
                        await message.success('删除成功...')
                        history.go(0)
                    } catch (error) {
                        reject(false)
                        console.log(error)
                    }
                })
        })
    }

    const handleModalOk = async () => {
        await editRef.current?.onSave()
        setVisible(false)
        await message.success("保存成功")
        history.go(0)
    }

    const handleOk = () => new Promise(async (resove) => {
        try {
            const relationDics = dicData?.filter((item: any) => selectedRowKeys?.includes(item.id))
            await dictRun(relationDics?.map((item: any) => ({
                dictId: item.id,
                dictName: item.name,
                productTypeId: rowData.id
            })))
            setDicVisible(false)
            setSelectedRowKeys([])
            resove(true)
            history.go(0)
        } catch (error) {
            console.log(error)
        }
    })

    const pipeline = useTablePipeline().input({
        dataSource: productData || [],
        columns: [...table, {
            name: "操作",
            code: "opration",
            lock: true,
            render: (_, records: any) => <>
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                        setDicVisible(true)
                        setRowData(records)
                        setSelectedRowKeys(records?.productDictVOList?.map((item: any) => item.dictId) || [])
                    }}
                >
                    关联产品类型
                </Button>
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                        setVisible(true)
                        setRowData(records)
                    }}
                >
                    编辑
                </Button>
                <Button
                    type="link"
                    size="small"
                    onClick={() => handleRemove(records.id)}>
                    删除
                </Button>
            </>
        }]
    }).primaryKey("id").use(features.rowDetail({
        defaultOpenKeys: productData?.[0] ? [productData?.[0]?.id] : [],
        renderDetail: (row) => <AliTable
            size="small"
            style={{ boxShadow: '0 0 4px 1px #33333333', margin: 8 }}
            columns={[...aliDic, {
                name: "操作",
                code: "opration",
                lock: true,
                render: (_, records) => <Button
                    type="link"
                    size="small"
                    onClick={() => handleRemoveDict(records?.id)}
                >删除</Button>
            }]}
            dataSource={row?.productDictVOList || []}
        />
    }))

    return (
        <>
            <Modal
                title={rowData?.id ? "新建" : "编辑"}
                visible={visible}
                width={1101}
                destroyOnClose
                onCancel={() => setVisible(false)}
                onOk={handleModalOk}
                confirmLoading={editRef.current?.confirmLoading}
            >
                <Edit data={rowData} ref={editRef} />
            </Modal>
            <Modal
                title="产品类型"
                visible={dicVisible}
                destroyOnClose
                onCancel={() => {
                    setDicVisible(false)
                    setSelectedRowKeys([])
                }}
                onOk={handleOk}
            >
                <CommonTable
                    bordered={false}
                    loading={loading}
                    pagination={false}
                    columns={dic}
                    dataSource={dicData || []}
                    rowSelection={{
                        type: "checkbox",
                        selectedRowKeys,
                        onChange: (selectedRowKeys: any[]) => {
                            setSelectedRowKeys(selectedRowKeys)
                        }
                    }}
                />
            </Modal>
            <AliTable
                size="small"
                isLoading={productLoading}
                {...pipeline.getProps()}
            />
        </>)
}