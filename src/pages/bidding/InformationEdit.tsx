import React from "react";
import { useHistory } from "react-router-dom"
import { Button, TableColumnProps, Row, Spin } from 'antd'
import { EditTable, Detail, BaseInfo } from '../common'
import { baseInfoData } from './biddingHeadData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../utils/RequestUtil"
const columns = [
    {
        title: '分标编号',
        dataIndex: 'partBidNumber',
        key: 'partBidNumber',
        type: 'text'
    },
    { title: '货物类别', dataIndex: 'goodsType', key: 'goodsType', type: 'text' },
    { title: '包号', dataIndex: 'packageNumber', key: 'packgeNumber', type: 'text' },
    { title: '数量', dataIndex: 'amount', key: 'amount', type: 'text' },
    { title: '单位', dataIndex: 'unit', key: 'unit', type: 'text' },
    { title: '交货日期', dataIndex: 'deliveryDate', key: 'deliveryDate', type: 'text' },
    { title: '交货地点', dataIndex: 'deliveryPlace', key: 'deliveryPlace', type: 'text' }
]
const tableColumns: TableColumnProps<Object>[] = [
    { title: '分标编号', dataIndex: 'partBidNumber' },
    { title: '货物类别', dataIndex: 'goodsType' },
    { title: '包号', dataIndex: 'packageNumber' },
    { title: '数量', dataIndex: 'amount' },
    { title: '单位', dataIndex: 'unit' },
    { title: '交货日期', dataIndex: 'deliveryDate' },
    { title: '交货地点', dataIndex: 'deliveryPlace' }
]
export default function InfomationNew(): JSX.Element {
    const history = useHistory()
    const { loading, error, data, run } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get('/tower-market/bidInfo/1')
        resole(data)
    }), {})
    const detailData: any = data
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <Detail
        operation={[
            <Button key="save" type="default">保存</Button>,
            <Button key="new" onClick={() => history.goBack()}>取消</Button>
        ]}
        tabItems={[{
            label: '', key: 1, content: <>
                <BaseInfo columns={baseInfoData} dataSource={detailData} edit />
                <EditTable columns={columns} dataSource={detailData.bidPackageInfoDTOList} />
                <Row>附件</Row>
                <EditTable columns={[
                    {
                        title: '文件名',
                        dataIndex: 'name',
                        key: 'name',
                        type: 'text'
                    },
                    {
                        title: '大小',
                        dataIndex: 'fileSize',
                        key: 'fileSize',
                        type: 'text'
                    },
                    {
                        title: '上传人',
                        dataIndex: 'userName',
                        key: 'userName',
                        type: 'text'
                    },
                    {
                        title: '上传时间',
                        dataIndex: 'fileUploadTime',
                        key: 'fileUploadTime',
                        type: 'text'
                    }
                ]} dataSource={detailData.attachVos} />
            </>
        }]} />
}