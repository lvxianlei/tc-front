import React, { useState } from 'react'
import { Button, Modal, message, Form } from 'antd'
import RequestUtil from '../../../utils/RequestUtil';
import { useHistory } from 'react-router-dom';
import { materialStandardOptions, materialTextureOptions } from "../../../configuration/DictionaryOptions"
import { BaseInfo, DetailContent, DetailTitle, SearchTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { tableHeadColumns, setting } from "./setting.json"
export default (): React.ReactNode => {
    const history = useHistory()
    const [form] = Form.useForm()
    const [visible, setVisible] = useState<boolean>(false);
    const [editRow, setEditRow] = useState<any | "new" | null>();
    const { loading, run } = useRequest<{ [key: string]: any }>((params: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil[editRow === "new" ? "post" : "put"](
                `/tower-storage/safetyStock`,
                editRow === "new" ? params : ({ id: editRow.id, ...params }))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: deleting, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.delete(`/tower-storage/safetyStock/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        const params = await form.validateFields()
        await run({ ...params, materialName: params.materialName.value })
        message.success('操作成功')
    }

    const handleDelete = async (id: string) => {
        await deleteRun(id)
        await message.success("删除成功...")
        history.go(0)
    }

    const handleChange = (fields: any) => {
        if (fields.materialName) {
            form.setFieldsValue({
                materialCode: fields.materialName.records?.[0].materialCode,
                structureSpec: fields.materialName.records?.[0].structureSpec
            })
        }
    }

    // 关闭弹窗
    const closeModal = () => {
        setVisible(false)
        setEditRow(null)
    }

    return (<DetailContent
        operation={[<Button
            type="default"
            key="goback"
            onClick={() => history.go(-1)
            }>返回</Button>]}>
        <DetailTitle title="安全库存设置" operation={[<Button type="primary" ghost key="new" onClick={() => {
            setVisible(true)
            setEditRow("new")
        }}>添加</Button>]} />
        <SearchTable
            path='/tower-storage/safetyStock'
            modal
            columns={[
                {
                    title: '序号',
                    dataIndex: 'index',
                    width: 40,
                    render: (_a, _b, index) => <span>{index + 1}</span>
                },
                ...tableHeadColumns,
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 100,
                    render: (_text: any, item: any): React.ReactNode => {
                        return (
                            <>
                                <Button type="link"
                                    onClick={() => {
                                        setVisible(true)
                                        setEditRow(item)
                                    }}
                                >编辑</Button>
                                <Button type="link"
                                    onClick={() => handleDelete(item.id)}
                                >删除</Button>
                            </>
                        )
                    }
                }
            ]}
            searchFormItems={[]} />
        <Modal
            width={1101}
            className="public_modal_input"
            title='编辑'
            visible={visible}
            onOk={handleSubmit}
            maskClosable={false}
            onCancel={closeModal}
            confirmLoading={loading}
            cancelText="取消"
            okText="确定"
        >
            <BaseInfo form={form} col={2} edit
                columns={setting.map((item: any) => {
                    switch (item.dataIndex) {
                        case "structureTextureId":
                            return ({ ...item, type: "select", enum: materialTextureOptions?.map((item: any) => ({ label: item.name, value: item.id })) })
                        case "materialStandard":
                            return ({ ...item, enum: materialStandardOptions?.map((item: any) => ({ label: item.name, value: item.id })) })
                        default:
                            return item
                    }
                })}
                onChange={handleChange}
                dataSource={editRow === "new" ? {} : editRow || {}}
            />
        </Modal>
    </DetailContent >)
};