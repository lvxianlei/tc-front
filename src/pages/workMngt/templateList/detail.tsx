import React, { useRef, useState, } from "react"
import { Button, message, Modal, Popconfirm, Image, Space, } from 'antd'
import { Attachment, CommonTable, DetailContent } from '../../common'
import { useHistory, useParams, } from "react-router-dom"
import RequestUtil from "../../../utils/RequestUtil"
import { downLoadFile } from "../../../utils";
import { AttachmentRef, FileProps } from '../../common/Attachment';
import useRequest from "@ahooksjs/use-request"
export default function TemplateDetail() {
    const history = useHistory()
    const params: any = useParams<{ id: string, productCategoryId: string }>()
    const [isImgModal, setIsImgModal] = useState<boolean>(false);
    const [imgUrl, setImgUrl] = useState<string>('');
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-science/loftingTemplate/record/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const columns: any[] = [
        {
            title: '序号',
            dataIndex: 'entryNo',
            fixed: true,
            align: 'center',
            render: (text: any, item: any, index: number) => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '图纸名称',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '接收时间',
            dataIndex: 'receiveTime',
            align: 'center',
        },
        {
            title: '上传时间',
            dataIndex: 'createTime',
            align: 'center',
        },
        {
            title: '上传人',
            dataIndex: 'createUserName',
            align: 'center',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (text: string, item: { id: string, isView: number }) => {
                return (
                    <div className='operation'>
                        <span
                            hidden={item.isView === 2}
                            style={{ cursor: 'pointer', color: '#FF8C00', marginRight: 10, }}
                            onClick={() => {
                                seeFile(item.id)
                            }}
                        >查看</span>
                        <Popconfirm
                            placement="bottomRight"
                            title='确认删除？'
                            onConfirm={() => {
                                deleteItem(item.id)
                            }}
                            okText="是"
                            cancelText="否"
                        >
                            <span
                                style={{ cursor: 'pointer', color: '#FF8C00', marginRight: 10, }}
                            >删除</span>
                        </Popconfirm>
                        <span
                            style={{ cursor: 'pointer', color: '#FF8C00' }}
                            onClick={() => {
                                download(item.id)
                            }}
                        >下载</span>
                    </div>
                )
            }
        },
    ]
    /**
     * 
     * @param id 
     */
    const download = async (id: string) => {
        let data: any = await RequestUtil.get(`/tower-science/loftingTemplate/download/${id}`)
        downLoadFile(data.downloadUrl)
    }
    /**
     * 
     * @param templateId 
     */
    const seeFile = async (templateId: string) => {
        let data: any = await RequestUtil.get(`/tower-science/loftingTemplate/view/${templateId}`)
        if (['jpg', 'jpeg', 'png', 'gif'].includes(data.fileSuffix)) {
            setIsImgModal(true)
            setImgUrl(data.downloadUrl)
        } else {
            window.open(data.downloadUrl)
        }
    }
    /**
     * 
     */
    const cancelModal = () => {
        setIsImgModal(false)
        setImgUrl('')
    }
    /**
     * 删除
     * @param templateRecordId 
     */
    const deleteItem = async (templateRecordId: string) => {
        await RequestUtil.delete(`/tower-science/loftingTemplate/delete?templateRecordId=${templateRecordId}`)
        message.success('操作成功')
        history.go(0)
    }
    return (
        <>
            <DetailContent>
                {/* <Button type="primary" ghost>上传</Button> */}
                <Space size="small" style={{ marginBottom: "24px" }}>
                    <Attachment isTable={false} ref={attchsRef} onDoneChange={(dataInfo: FileProps[]) => {
                        console.log(attchsRef.current.getDataSource(), '0000000')
                        let fileList = attchsRef.current.getDataSource().map((item, index) => {
                            return {
                                name: item.originalName,
                                fileId: item.id,
                                templateId: params.id,
                                productCategoryId: params.productCategoryId,
                                createUser: sessionStorage.getItem('USER_ID') || '',
                                createUserName: sessionStorage.getItem('USER_NAME') || '',
                            }
                        })
                        if (!fileList.length) {
                            return;
                        }
                        RequestUtil.post(`/tower-science/loftingTemplate/upload`, [...fileList]).then(res => {
                            if (res) {
                                message.success('上传成功');
                                history.go(0)
                            }
                        })
                    }}>
                        <Button type="primary" ghost>上传</Button>
                    </Attachment>
                    <Button type="primary" ghost onClick={() => { history.go(-1) }}>返回</Button>
                </Space>
                <CommonTable columns={columns} dataSource={data} />
            </DetailContent>
            <Modal visible={isImgModal} onCancel={() => { cancelModal() }} footer={false}>
                <Image src={imgUrl} preview={false} />
            </Modal>
        </>
    )
}
