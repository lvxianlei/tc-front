import React, { useRef, useState, } from "react"
import { Button, message, Modal, Popconfirm, Image, Space, InputNumber, Form, Typography, Input, } from 'antd'
import { Attachment, CommonTable, DetailContent } from '../../common'
import { useHistory, useParams, } from "react-router-dom"
import RequestUtil from "../../../utils/RequestUtil"
import { downLoadFile } from "../../../utils";
import { AttachmentRef, FileProps } from '../../common/Attachment';
import useRequest from "@ahooksjs/use-request"
import AuthUtil from "@utils/AuthUtil"

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text' | 'select' | 'edit' | 'textArea';
    enums?: object[];
    record: any;
    index: number;
    children: React.ReactNode;
}
export default function TemplateDetail() {
    const history = useHistory()
    const params: any = useParams<{ id: string, productCategoryId: string, uploadDrawType: string }>()
    const [isImgModal, setIsImgModal] = useState<boolean>(false);
    const [imgUrl, setImgUrl] = useState<string>('');
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
    const [editingKey, setEditingKey] = useState<any>('');
    const [tableDataSource, setTableDataSource] = useState<any>([]);
    const [formRef] = Form.useForm();
    const isEditing = (record: any) => record.id === editingKey;
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-science/loftingTemplate/record/${params.id}`)
            setTableDataSource(result.map((item: any, index: number) => {
                return {
                    ...item,
                }
            }))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const EditableCell: React.FC<EditableCellProps> = ({
        editing,
        dataIndex,
        title,
        inputType,
        enums,
        record,
        index,
        children,
        ...restProps
    }) => {
        const inputNode = inputType === 'number' ? <InputNumber style={{ width: '100%' }} min={1} precision={0} max={9999} /> : inputType === 'text' ? <Input maxLength={300} /> : <p />;

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );

    };
    const edit = (record: Partial<any> & { key: React.Key }) => {
        formRef.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };
    const columns: any[] = [
        {
            title: '序号',
            dataIndex: 'entryNo',
            fixed: true,
            key: 'entryNo',
            render: (text: any, item: any, index: number) => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '图纸名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '接收时间',
            dataIndex: 'receiveTime',
            key: 'receiveTime',
        },
        {
            title: '上传时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '图纸页数',
            dataIndex: 'pageNumber',
            editable: true,
            type: 'number',
            key: 'pageNumber',
            render: (text: any) => {
                return <span>{text === null ? '-' : text}</span>
            }
        },
        {
            title: '上传人',
            dataIndex: 'createUserName',
            key: 'createUserName',
        },
        {
            title: '备注',
            dataIndex: 'description',
            editable: true,
            key: 'description',
            type: 'text'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text: string, item: any) => {
                const editable = isEditing(item);
                return editable ? (
                    <Space>
                        <span
                            hidden={item.isView === 2}
                            style={{ cursor: 'pointer', color: '#FF8C00' }}
                            onClick={() => {
                                seeFile(item.id)
                            }}
                        >查看</span>
                        <Button type="link" onClick={() => {
                            if (params.uploadDrawType === '1') {
                                if (formRef.getFieldsValue().pageNumber) {
                                    RequestUtil.post(`/tower-science/loftingTemplate/templateRecord/${item.id}`, {
                                        id: item.id,
                                        pageNumber: formRef.getFieldsValue().pageNumber
                                    }).then(async () => {
                                        message.success('保存成功！')
                                        setEditingKey('');
                                        const result: any[] = await RequestUtil.get(`/tower-science/loftingTemplate/record/${params.id}`)
                                        setTableDataSource(result)
                                    })
                                } else {
                                    message.warning('请输入页数！')
                                }
                            } else {
                                RequestUtil.post(`/tower-science/loftingTemplate/templateRecord/${item.id}`, {
                                    id: item.id,
                                    pageNumber: formRef.getFieldsValue().pageNumber
                                }).then(async () => {
                                    message.success('保存成功！')
                                    setEditingKey('');
                                    const result: any[] = await RequestUtil.get(`/tower-science/loftingTemplate/record/${params.id}`)
                                    setTableDataSource(result)
                                })
                            }
                        }} >
                            保存
                        </Button>
                        <Popconfirm
                            placement="bottomRight"
                            title='确认删除？'
                            onConfirm={() => {
                                deleteItem(item.id)
                            }}
                            okText="是"
                            cancelText="否"
                        >
                            <Button type="link">删除</Button>
                        </Popconfirm>
                        <span
                            style={{ cursor: 'pointer', color: '#FF8C00' }}
                            onClick={() => {
                                download(item.id)
                            }}
                        >下载</span>
                    </Space>


                ) : (
                    <Space className='operation'>

                        <span
                            hidden={item.isView === 2}
                            style={{ cursor: 'pointer', color: '#FF8C00' }}
                            onClick={() => {
                                seeFile(item.id)
                            }}
                        >查看</span>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(item)}>
                            编辑
                        </Typography.Link>
                        <Popconfirm
                            placement="bottomRight"
                            title='确认删除？'
                            onConfirm={() => {
                                deleteItem(item.id)
                            }}
                            okText="是"
                            cancelText="否"
                        >
                            <Button type="link">删除</Button>
                        </Popconfirm>
                        <span
                            style={{ cursor: 'pointer', color: '#FF8C00' }}
                            onClick={() => {
                                download(item.id)
                            }}
                        >下载</span>
                    </Space>
                )
            }
        },
    ]
    const mergedColumns = columns.map((col: any) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: any) => ({
                record,
                inputType: col.type,
                dataIndex: col.dataIndex,
                enums: col.enums,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
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
        } else if (data.fileSuffix === 'pdf') {
            let response = await fetch(data.downloadUrl); // 内容转变成blob地址
            let blob = await response.blob();
            let blobNew = new Blob([blob], { type: 'application/pdf' });
            let href = window.URL.createObjectURL(blobNew)// 创建下载的链接
            // var a = document.createElement('a');
            // a.href = href;
            // document.body.appendChild(a);
            // a.click();
            // window.URL.revokeObjectURL(href);
            window.open(href)
        }
        else {
            message.error('暂只支持*.png,*.jpeg,*.jpg,*.gif*.pdf预览...')
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
        message.success('删除成功！')
        history.go(0)
        // history.push(`/workMngt/templateList/detail/${params.id}/${params.productCategoryId}`)
    }
    return (
        <>
            <DetailContent>
                <Space size="small" style={{ marginBottom: "24px" }}>
                    <Attachment multiple maxCount={99} isTable={false} ref={attchsRef} onDoneChange={(dataInfo: FileProps[]) => {
                        let fileList = dataInfo.map((item, index) => {
                            return {
                                name: item.originalName,
                                fileId: item.id,
                                templateId: params.id,
                                productCategoryId: params.productCategoryId,
                                createUser: AuthUtil.getUserInfo().user_id || '',
                                createUserName: AuthUtil.getUserInfo().username || '',
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
                    }} />
                    <Button type="ghost" onClick={() => { history.go(-1) }}>返回</Button>
                </Space>
                <Form form={formRef} component={false} >
                    <CommonTable columns={mergedColumns} dataSource={[...tableDataSource]} components={{
                        body: {
                            cell: EditableCell,
                        },
                    }} />
                </Form>
            </DetailContent>
            <Modal visible={isImgModal} onCancel={() => { cancelModal() }} footer={false}>
                <Image src={imgUrl} preview={false} />
            </Modal>
        </>
    )
}
