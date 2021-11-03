import React, { useState } from "react"
import { Button, Upload, Form, message, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { CommonTable } from '../../common'
import { MaterialShortage } from "./differentListData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import ApplicationContext from "../../../configuration/ApplicationContext"
export default function Edit() {
    const history = useHistory()
    return <CommonTable columns={MaterialShortage} dataSource={[]} />
}