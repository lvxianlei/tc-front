import React, { useState, } from "react"
import { Button, Popconfirm, } from 'antd'
import { Page } from '../../common'
import { useHistory, useRouteMatch } from "react-router-dom"
import RequestUtil from "../../../utils/RequestUtil"
export default function TemplateDetail() {
    const history = useHistory()
    const match: any = useRouteMatch()
    const [refresh, setRefresh] = useState(false);
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
                        <Popconfirm
                            placement="bottomRight"
                            title={text}
                            onConfirm={() => {
                                deleteItem(item.id)
                            }}
                            okText="是"
                            cancelText="否"
                        >
                            <span
                                style={{ cursor: 'pointer', color: '#FF8C00' }}
                            >删除</span>
                        </Popconfirm>
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
    /**
     * 删除
     * @param templateId 
     */
    const deleteItem = async (templateId: string) => {
        await RequestUtil.put('/tower-science/loftingTemplate/delete', {
            templateId,
        })
        setRefresh(!refresh)
    }
    return (
        <>
            <Page
                path={`/tower-science/loftingTemplate/record/${match.params.id}`}
                columns={columns}
                refresh={refresh}
                extraOperation={
                    <div>
                        <Button type="primary" ghost>上传</Button>
                        <Button type="primary" ghost onClick={() => { history.go(-1) }}>返回上一级</Button>
                    </div>
                }
                searchFormItems={[]}
            />
        </>
    )
}
