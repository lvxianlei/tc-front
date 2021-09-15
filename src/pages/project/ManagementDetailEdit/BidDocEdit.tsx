import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { Row, Button } from "antd"
import { DetailContent, BaseInfo, EditTable, DetailTitle } from '../../common'
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { baseInfoData } from '../managementDetailData.json'
const tableColumns = [
    { title: '分标编号', dataIndex: 'partBidNumber' },
    { title: '货物类别', dataIndex: 'goodsType' },
    { title: '包号', dataIndex: 'packageNumber' },
    { title: '数量', dataIndex: 'amount' },
    { title: '单位', dataIndex: 'unit' },
    { title: '交货日期', dataIndex: 'deliveryDate' },
    { title: '交货地点', dataIndex: 'deliveryPlace' }
]
export default function BaseInfoEdit(): JSX.Element {
    const history = useHistory()
    return <DetailContent operation={[<Button key="save" type="primary">保存</Button>, <Button key="cacel" onClick={() => history.goBack()}>取消</Button>]}>
        <ManagementDetailTabsTitle />
        <DetailTitle title="基本信息" />
        <BaseInfo columns={baseInfoData} dataSource={{}} edit />
        <DetailTitle title="货物清单" />
        <EditTable columns={tableColumns} dataSource={[]} />
        <DetailTitle title="附件信息" operation={[<Button key="bidDoc" type="primary">上传附件</Button>]} />
        <EditTable columns={[
            { title: '文件名', dataIndex: 'name' },
            { title: '大小', dataIndex: 'fileSize' },
            { title: '上传人', dataIndex: 'userName' },
            { title: '上传时间', dataIndex: 'fileUploadTime' }
        ]} dataSource={[]} />
    </DetailContent>
}