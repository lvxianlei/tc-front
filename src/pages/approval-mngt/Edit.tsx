import React from 'react'
import { Button, Upload } from "antd"
import { useHistory } from "react-router-dom"
import { DetailContent, BaseInfo, CommonTable, DetailTitle } from "../common"
import { baseInfo } from "./approval.json"
import AuthUtil from "../../utils/AuthUtil"
export default function ApprovalMngtEdit(): JSX.Element {
    const history = useHistory()
    return <DetailContent operation={[
        <Button key="save" type="primary" style={{ marginRight: "16px" }}>保存</Button>,
        <Button key="goback" type="default" onClick={() => history.goBack()}>返回</Button>
    ]}>
        <DetailTitle title="基本信息" />
        <BaseInfo edit columns={baseInfo} dataSource={{}} />
        <DetailTitle title="附件" operation={[
            <Upload
                key="sub"
                name="file"
                multiple={true}
                action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
                headers={{
                    'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                    'Tenant-Id': AuthUtil.getTenantId(),
                    'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                }}
                showUploadList={false}
            ><Button type="primary" ghost>上传附件</Button></Upload>
        ]
        } />
        <CommonTable columns={baseInfo} />
    </DetailContent >
}