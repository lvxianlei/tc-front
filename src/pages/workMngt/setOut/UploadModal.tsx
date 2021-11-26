import React, { forwardRef, useRef, useState } from 'react';
import { Button, Space, Modal, Form, Input } from 'antd';
import { DetailContent, Attachment, CommonTable, AttachmentRef } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import { FileProps } from '../../common/Attachment';

export interface UploadModalProps {}
export interface IUploadModalRouteProps {
    readonly id: number | string;
    readonly updateList?: () => void;
    readonly path: string;
}

export interface UploadModalState {
    readonly visible: boolean;
    readonly description?: string;
    readonly data?: IData;
}

interface IFile extends FileProps {
    readonly name?: string;
    readonly segmentName?: string
}

interface IData{
    readonly attachInfoVOList?: [];
    readonly productSegmentId?: string;
    readonly productSegmentRecordVOList?: [];
}

export default forwardRef(function ({
    id = '',
    path = '',
    updateList = () => {}
}: IUploadModalRouteProps, ref): JSX.Element {
    const [ visible, setVisible ] = useState(false);
    const [ form ] = Form.useForm();
    const [ list, setList ] = useState<IFile[]>([]);
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })

    const modalCancel = (): void => {
        setVisible(false);
    }

    const modalShow = (): void => {
        setVisible(true);
    }

    const delRow = (index: number) => {
        const data = form.getFieldsValue(true).data;
        data.splice(index, 1);
        setList(data);
    }

    const save = () => {
        let value = form.getFieldsValue(true).data;
        value = value.map((res: IFile) => {
            return {
                fileVo: res,
                productCategoryId: id,
                segmentName: res.segmentName
            }
        })
        RequestUtil.post(path, [...value]).then(res => {
            setVisible(false);
            updateList();
        })
    }

    return <>
        <Button type="primary" onClick={ () => modalShow() } ghost>上传</Button>
        <Modal
            visible={ visible } 
            width="40%" 
            title="上传"
            footer={ <Space direction="horizontal" size="small">
                <Button type="ghost" onClick={() => modalCancel() }>关闭</Button>
                <Button type="primary" onClick={save} ghost>确定</Button>
            </Space> } 
            onCancel={ () => modalCancel() }
        >
            <DetailContent>
                <Attachment ref={ attchsRef } isTable={ false } onDoneChange={ (attachs: FileProps[]) => { 
                    setList(attchsRef.current.getDataSource()); 
                    form.setFieldsValue({ data: attchsRef.current.getDataSource() });
                } }/>
                <Form form={ form }>
                    <CommonTable columns={[
                        { 
                            key: 'originalName', 
                            title: '附件名称', 
                            dataIndex: 'originalName',
                            width: 300 
                        },
                        { 
                            key: 'segmentName', 
                            title: '段信息', 
                            dataIndex: 'segmentName',
                            width: 150,
                            render: (_: undefined, record: Record<string, any>, index: number
                                ): React.ReactNode => (
                                <Form.Item name={['data', index, 'segmentName']} rules={[{
                                    required: true,
                                    message: '请输入段信息 '
                                }]}>
                                    <Input placeholder="请输入段信息" maxLength={ 50 }/>
                                </Form.Item>
                            ) 
                        },
                        { 
                            key: 'operation', 
                            title: '操作', 
                            dataIndex: 'operation', 
                            width: 150,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Space direction="horizontal" size="small">
                                    <Button type="link" onClick={ () => delRow(index) }>删除</Button>
                                </Space>
                            ) 
                        }
                    ]}
                        dataSource={ list || [] }
                        pagination={ false }
                    />
                </Form>
            </DetailContent>
        </Modal>
    </>
})
