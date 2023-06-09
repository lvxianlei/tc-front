import React, { useState } from "react"
import { Button, Upload, Form, message, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, EditTable, formatData } from '../../common'
import { enclosure } from '../../project/managementDetailData.json'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import AuthUtil from "../../../utils/AuthUtil"
import { downLoadFile } from "../../../utils"
import ApplicationContext from "../../../configuration/ApplicationContext"
export default function Edit() {
    const history = useHistory()
    return <DetailContent operation={[
        <Button
            type="primary" key="save"
            style={{ marginRight: 16 }}
        >保存</Button>,
        <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
    ]}>

    </DetailContent>
}