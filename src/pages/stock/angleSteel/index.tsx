/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from 'react'
import { useHistory } from "react-router-dom"
import { Button, Modal, message, } from 'antd'
import { CommonTable, DetailContent, DetailTitle } from '../../common'
import { baseInfo, material } from './angleSteel.json'
import RequestUtil from "../../../utils/RequestUtil"
import Edit from "./Edit"
// import useRequest from '_@ahooksjs_use-request@2.8.13@@ahooksjs/use-request'
import useRequest from "@ahooksjs/use-request"
type typeProps = "new" | "edit"
const AngleSteel = () => {
    const history = useHistory()
    const editRef = useRef<{ onSubmit: () => Promise<boolean>, loading: boolean }>()
    const [visible, setVisible] = useState<boolean>(false);
    const [type, setType] = useState<typeProps>("new");

    const { loading, data } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get("/tower-supply/angleConfigStrategy")
            resole(result)
        } catch (error) {
            reject(false)
        }
    }))

    const handleModalOk = () => new Promise(async (resove, reject) => {
        const isClose = await editRef.current?.onSubmit()
        if (isClose) {
            message.success("成功...")
            setVisible(false)
            resove(true)
        }
    })
    return <>
        <Modal visible={visible} width={1011} title="创建" onOk={handleModalOk} onCancel={() => setVisible(false)}>
            <Edit type={type} ref={editRef} />
        </Modal>
        <DetailContent>
            <DetailTitle title="配置基础配置" />
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
                    }, ...baseInfo]}
                dataSource={data?.ingredientsConfigVos || []}
            />
            <DetailTitle title="材质配料设定" operation={[
                <Button key="add" type="primary" ghost style={{ marginRight: 16 }} onClick={() => {
                    setVisible(true)
                    setType("new")
                }}>添加</Button>,
                <Button key="goback" type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
            ]} />
            <CommonTable columns={material} dataSource={data?.ingredientsMaterialConfigVos || []} />
        </DetailContent>
    </>
}

export default AngleSteel;