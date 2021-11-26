import React, { useState, } from "react"
import { Button, message, Popconfirm, } from 'antd'
import { Attachment, Page } from '../../common'
import { useHistory, useParams, } from "react-router-dom"
import RequestUtil from "../../../utils/RequestUtil"
import { downLoadFile } from "../../../utils";
import { FileProps } from '../../common/Attachment';
export default function TemplateDetail() {
    const history = useHistory()
    const params: any = useParams<{ id: string }>()
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
            render: (text: string, item: { id: string, isView: number },) => {
                return (
                    <div className='operation'>
                        <span
                            hidden={item.isView === 2}
                            style={{ cursor: 'pointer', color: '#FF8C00' }}
                            onClick={() => {
                                seeFile(item.id)
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
                                downLoadFile(`/tower-science/loftingTemplate/download/${item.id}`)
                            }}
                        >下载</span>
                    </div>
                )
            }
        },
    ]
    /**
     * 
     * @param templateId 
     */
    const seeFile = async (templateId: string) => {
        let data: any = await RequestUtil.get(`/tower-science/loftingTemplate/view/${templateId}`)
        window.open(data.downloadUrl)
    }
    /**
     * 删除
     * @param templateRecordId 
     */
    const deleteItem = async (templateRecordId: string) => {
        await RequestUtil.delete('/tower-science/loftingTemplate/delete', {
            templateRecordId,
        })
        setRefresh(!refresh)
    }
    return (
        <>
            <Page
                path={`/tower-science/loftingTemplate/record/${params.id}`}
                columns={columns}
                refresh={refresh}
                extraOperation={
                    <div>
                        {/* <Button type="primary" ghost>上传</Button> */}
                        <Attachment isTable={false} onDoneChange={(dataInfo: FileProps[]) => {
                            let fileList = dataInfo.map((item, index) => {
                                return {
                                    name: item.fileName,
                                    fileId: item.uid,
                                    templateId: params.id,
                                    createUser: sessionStorage.getItem('USER_ID') || '',
                                    createUserName: sessionStorage.getItem('USER_NAME') || '',
                                }
                            })
                            if (!fileList.length) {
                                return;
                            }
                            RequestUtil.post(`/tower-science/productNc/importProductNc`, [...fileList]).then(res => {
                                if (res) {
                                    message.success('上传成功');
                                    setRefresh(!refresh);
                                }
                            })
                        }}><Button type="primary" ghost>上传</Button></Attachment>
                        <Button type="primary" ghost onClick={() => { history.go(-1) }} style={{ marginLeft: 10, }}>返回上一级</Button>
                    </div>
                }
                searchFormItems={[]}
            />
        </>
    )
}
