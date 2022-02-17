import React from "react"
import { Row, Button, message, Popconfirm } from "antd"
import { useHistory } from "react-router-dom"
import { DetailContent, CommonTable, DetailTitle } from "../../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
const columns = [
    {
        title: "产品类型",
        dataIndex: "productName"
    },
    {
        title: "制单人",
        dataIndex: "createUser"
    },
    {
        title: "制单时间",
        dataIndex: "createTime"
    }
]

export default function CostConfig(): JSX.Element {
    const history = useHistory()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/ProductType/getProduct`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: deleteLoading, run: deleteRun } = useRequest<{ [key: string]: any }>((id) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/ProductType/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleDelete = async (id: string) => {
        try {
            await deleteRun(id)
            message.success("删除成功...")
            history.go(0)
        } catch (error) {
            console.log(error)
        }
    }

    return <DetailContent>
        <Row style={{ marginBottom: 12 }}><Button type="primary" onClick={() => history.push(`/sys/costconfig/edit/new`)}>新增</Button></Row>
        <CommonTable haveIndex loading={loading} columns={[
            ...columns,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 150,
                render: (_, record: any) => <>
                    <Button className="btn-operation-link" type="link" onClick={() => history.push(`/sys/costconfig/detail/${record.productName}`)}>查看</Button>
                    <Popconfirm onConfirm={() => handleDelete(record.id)} title="确定要删除？">
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </>
            }]}
            dataSource={(data as any) || []} />
    </DetailContent >
}