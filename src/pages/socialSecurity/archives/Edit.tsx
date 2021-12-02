import React from "react"
import { Button, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { setting, insurance, business } from "./archives.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ transferId: string, type: "new" | "edit" }>()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-hr/employeeTransfer/detail/${params.transferId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: params.type === "new" })

    const { loading: saveLoading } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-hr/employeeTransfer/save`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSave = () => {

    }

    return <DetailContent operation={[
        <Button key="save" loading={saveLoading} onClick={handleSave} type="primary" style={{ marginRight: 16 }}>保存</Button>,
        <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="员工保险档案" />
            <BaseInfo columns={setting} dataSource={data || {}} edit />
            <DetailTitle title="社保公积金" />
            <BaseInfo columns={insurance} dataSource={[]} edit/>
            <DetailTitle title="商业保险方案" />
            <CommonTable columns={business} dataSource={[]} />
        </Spin>
    </DetailContent>
}