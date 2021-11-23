import React, { useState, } from "react"
import { Button, } from 'antd'
import { Page } from '../../common'
import { useHistory } from "react-router-dom"
export default function TemplateDetail() {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState<any>({})
    const columns: any[] = [
        {
            title: '序号',
            dataIndex: 'entryNo',
            fixed: true,
            align: 'center',
        },
        {
            title: '图纸名称',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '接收时间',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '上传时间',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '上传人',
            dataIndex: 'supplierName',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (text: string, item: { id: string },) => {
                return (
                    <div className='operation'>
                        <span
                            style={{ cursor: 'pointer', color: '#FF8C00' }}
                            onClick={() => {
                            }}
                        >查看</span>
                        <span
                            style={{ cursor: 'pointer', color: '#FF8C00' }}
                            onClick={() => {
                            }}
                        >删除</span>
                        <span
                            style={{ cursor: 'pointer', color: '#FF8C00' }}
                            onClick={() => {
                            }}
                        >下载</span>
                    </div>
                )
            }
        },
    ]
    const onFilterSubmit = (value: any) => {
        if (value.updateStartTime) {
            const formatDate = value.updateStartTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStartTime = formatDate[0]
            value.updateEndTime = formatDate[1]
        }
        setFilterValue({ ...filterValue, ...value })
        return value
    }
    return (
        <>
            <Page
                path="/tower-supply/materialShortage"
                filterValue={filterValue}
                columns={columns}
                extraOperation={
                    <div>
                        <Button type="primary" ghost>导出</Button>
                        <Button type="primary" ghost onClick={() => { history.go(-1) }}>返回上一级</Button>
                    </div>
                }
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[

                ]}
            />
        </>
    )
}
