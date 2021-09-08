import React from 'react'
import { Row, Table, Button, TableColumnProps } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { Detail, BaseInfo } from '../common'
import { baseInfoData } from './managementDetailData.json'
const tableColumns: TableColumnProps<Object>[] = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '分标编号', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '货物类别', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '包号', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '数量', dataIndex: 'amount', key: 'amount' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '交货日期', dataIndex: 'deliveryDate', key: 'deliveryDate' },
    { title: '交货地点', dataIndex: 'deliveryPlace', key: 'deliveryPlace' }
]

interface RouterParams {
    id: string | "new"
}

export default function ManagementEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<RouterParams>()
    console.log(params)
    return <Detail
        operation={[
            <Button key="save" style={{ marginRight: '10px' }}>保存</Button>,
            <Button key="goback" onClick={() => history.goBack()}>返回</Button>
        ]}
        tabItems={[
            {
                label: '',
                key: 1,
                content: <>
                    <BaseInfo columns={baseInfoData} dataSource={{}} edit />
                    <Row style={{ height: '50px', paddingLeft: '10px', lineHeight: '50px' }}>货物清单</Row>
                    <Table rowKey={(record: any) => `project_${record.id}`} columns={tableColumns} />
                    <Row style={{ height: '50px', paddingLeft: '10px', lineHeight: '50px' }}><span>附件信息</span><Button type="default">上传附件</Button></Row>
                    <Table  rowKey={(record: any) => `file_${record.id}`} columns={[
                        {
                            title: '序号',
                            dataIndex: 'index',
                            key: 'index',
                            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                        },
                        {
                            title: '文件名',
                            dataIndex: 'name',
                            key: 'name',
                        },
                        {
                            title: '大小',
                            dataIndex: 'fileSize',
                            key: 'fileSize',
                        },
                        {
                            title: '上传人',
                            dataIndex: 'userName',
                            key: 'userName',
                        },
                        {
                            title: '上传时间',
                            dataIndex: 'fileUploadTime',
                            key: 'fileUploadTime',
                        }
                    ]} />
                </>
            }
        ]} />
}