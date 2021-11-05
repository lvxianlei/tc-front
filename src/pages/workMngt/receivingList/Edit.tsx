import React, { useState } from "react"
import { Button, Upload, Form, message, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailTitle, BaseInfo, CommonTable } from '../../common'
import { BasicInformation, CargoDetails } from "./receivingListData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
export default function Edit() {
    const history = useHistory()
    return <>
        <DetailTitle title="收货单基础信息" />
        <BaseInfo columns={BasicInformation} dataSource={[]} edit />
        <DetailTitle title="货物明细" operation={[<Button type="primary" key="choose" ghost>选择</Button>]} />
        <CommonTable columns={CargoDetails} dataSource={[]} />
    </>
}