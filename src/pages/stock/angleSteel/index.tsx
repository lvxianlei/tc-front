/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from 'react'
import { useHistory } from "react-router-dom"
import { Button, Modal, message, Form } from 'antd'
import { BaseInfo, CommonTable, DetailContent, DetailTitle } from '../../common'
import { baseInfo, material } from './angleSteel.json'
import RequestUtil from "../../../utils/RequestUtil"
import Edit from "./Edit"
import useRequest from '@ahooksjs/use-request'
import { materialTextureOptions } from '../../../configuration/DictionaryOptions'
type typeProps = "new" | "edit"
const AngleSteel = () => {
    const history = useHistory()
    const editRef = useRef<{ onSubmit: () => Promise<boolean>, loading: boolean }>()
    const [visible, setVisible] = useState<boolean>(false)
    const [ingredientsConfigVisible, setIngredientsConfigVisible] = useState<boolean>(false)
    const [type, setType] = useState<typeProps>("new")
    const [materialData, setMaterialData] = useState<{ [key: string]: any }>({})
    const [materialId, setMaterialId] = useState<string>()
    const [baseInfoForm] = Form.useForm()
    const materialTextureEnum = materialTextureOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const { loading, data } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get("/tower-supply/angleConfigStrategy")
            resole(result)
        } catch (error) {
            reject(false)
        }
    }))

    const { loading: deleteLoading, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/angleConfigStrategy/deleteIngredientsMaterialConfig?id=${id}`)
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/angleConfigStrategy/updateIngredientsConfig`, { ...data, id: materialId })
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    const handleModalOk = () => new Promise(async (resove, reject) => {
        const isClose = await editRef.current?.onSubmit()
        if (isClose) {
            message.success("材质配料设定成功...")
            setVisible(false)
            resove(true)
            history.go(0)
        }
    })

    const deleteItem = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此配料设定吗？",
            onOk: async () => {
                const result = await deleteRun(id)
                if (result) {
                    message.success("删除成功")
                    history.go(0)
                }
            }
        })

    }
    const handleIngredientsConfig = async () => {
        const baseInfoData = await baseInfoForm.validateFields()
        const result = await saveRun({ ...baseInfoData })
        if (result) {
            message.success("配置基础配置成功...")
            history.go(0)
        }
    }
    return <DetailContent>
        <Modal destroyOnClose visible={visible} width={1100} title="创建" onOk={handleModalOk} onCancel={() => {
            setVisible(false)
            setMaterialData({})
        }}>
            <Edit type={type} ref={editRef} data={materialData} />
        </Modal>

        <Modal visible={ingredientsConfigVisible} width={1011} title="基础配置" onOk={handleIngredientsConfig} onCancel={() => {
            setIngredientsConfigVisible(false)
        }}>
            <BaseInfo form={baseInfoForm} columns={baseInfo} dataSource={{}} edit />
        </Modal>
        <DetailTitle title="配料基础配置" />
        <CommonTable
            loading={loading}
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_, _b, index) => {
                        return <span>{index + 1}</span>
                    }
                },
                ...baseInfo,
                {
                    title: "操作",
                    dataIndex: "opration",
                    render: (_: any, records: any) => <Button type="link" onClick={() => {
                        setIngredientsConfigVisible(true)
                        setMaterialId(records.id)
                        baseInfoForm.setFieldsValue(records)
                    }}>编辑</Button>
                }
            ]}
            dataSource={data?.ingredientsConfigVos || []}
        />
        <DetailTitle style={{marginTop: "12px"}} title="材质配料设定" operation={[
            <Button key="add" type="primary" ghost style={{ marginRight: 16 }} onClick={() => {
                setVisible(true)
                setType("new")
                setMaterialData({})
            }}>添加</Button>,
            <Button key="goback" type="ghost" onClick={() => history.goBack()}>返回</Button>
        ]} />
        <CommonTable
            loading={loading}
            haveIndex
            columns={[...material.map((item: any) => {
                if (item.dataIndex === "materialTexture") {
                    return ({
                        ...item,
                        type: "select",
                        enum: materialTextureEnum
                    })
                }
                return item
            }),
            {
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <>
                    <Button type="link" className='btn-operation-link' onClick={() => {
                        setType("edit")
                        setMaterialData(records)
                        setVisible(true)
                    }}>编辑</Button>
                    <Button type="link" loading={deleteLoading} className="btn-operation-link" onClick={() => deleteItem(records.id)}>删除</Button>
                </>
            }]}
            dataSource={data?.ingredientsMaterialConfigVos || []} />
    </DetailContent>
}

export default AngleSteel