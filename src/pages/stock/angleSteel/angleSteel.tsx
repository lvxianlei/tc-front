/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react'
import { Button, TableColumnProps, Modal, message } from 'antd'
import { CommonTable, DetailContent, DetailTitle } from '../../common'
import RequestUtil from "../../../utils/RequestUtil"
import Edit from "./Edit"
import { RouteProps } from '../public'
type typeProps = "new" | "edit"
const AngleSteel = (props: RouteProps) => {
    // const history = useHistory()
    const editRef = useRef<{ onSubmit: () => Promise<boolean> }>()
    const [visible, setVisible] = useState<boolean>(false);
    const [type, setType] = useState<typeProps>("new");
    const [columnsData, setColumnsData] = useState([]);
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (text, item, index) => {
                return <span>{index + 1}</span>
            }
        },
        {
            key: 'policy',
            title: '策略项',
            dataIndex: 'policy',
        },
        {
            key: 'configData',
            title: '配置数据',
            dataIndex: 'configData',
        },
        {
            key: 'description',
            title: '说明',
            dataIndex: 'description'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
        }]


    // const getColumnsData = async () => {
    //     const data: any = await RequestUtil.get('/tower-supply/angleConfigStrategy', {
    //         current,
    //         size,
    //     })
    //     setTotal(data.data)
    //     setColumnsData(data.records)
    // }
    const handleModalOk = () => new Promise(async (resove, reject) => {
        const isClose = await editRef.current?.onSubmit()
        if (isClose) {
            message.success("票据创建成功...")
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
                columns={columns}
                dataSource={columnsData}
            />
            <DetailTitle title="材质配料设定" operation={[
                <Button key="add" type="primary" ghost style={{ marginRight: 16 }} onClick={() => {
                    setVisible(true)
                    setType("new")
                }}>添加</Button>,
                <Button key="goback" type="primary" ghost>返回上一级</Button>
            ]} />
            <CommonTable
                columns={columns}
                dataSource={columnsData}
            />
        </DetailContent>
    </>




}

export default AngleSteel;