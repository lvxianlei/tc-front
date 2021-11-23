import React, { forwardRef, useRef, useState } from 'react';
import { Button, Space, Modal, message, Form, Input } from 'antd';
import { DetailContent, Attachment, CommonTable, AttachmentRef } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { FileProps } from '../../common/Attachment';

export interface UploadModalProps {}
export interface IUploadModalRouteProps {
    readonly id: number | string;
    // readonly path: string;
    // readonly requestData?: {};
    // readonly uploadUrl: string;
    // readonly delPath: string;
}

export interface UploadModalState {
    readonly visible: boolean;
    readonly description?: string;
    readonly data?: IData;
}

interface IFile extends FileProps {
    readonly name?: string;
}

interface IData{
    readonly attachInfoVOList?: [];
    readonly productSegmentId?: string;
    readonly productSegmentRecordVOList?: [];
}

export default forwardRef(function ({}: IUploadModalRouteProps, ref): JSX.Element {
    const [ visible, setVisible ] = useState(false);
    const [ form ] = Form.useForm();
    const [ list, setList ] = useState<IFile[]>([]);
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })

    const modalCancel = (): void => {
        setVisible(false);
    }

    const getDetail = async (): Promise<void> => {
        // const data = await RequestUtil.get<IData>(`${ props.path }`);

    }

    const modalShow = (): void => {
        getDetail();
        setVisible(true);
    }

    const delRow = (index: number) => {
        const data = form.getFieldsValue(true).data;
        data.splice(index, 1);
        setList(data);
    }

    const save = () => {
        let value = form.getFieldsValue(true).data;
        console.log(value)
    }

    return <>
        <Button type="primary" onClick={ () => modalShow() } ghost>上传</Button>
        <Modal
            visible={ visible } 
            width="40%" 
            title="上传"
            footer={ <Space direction="horizontal" size="small">
                <Button type="ghost" onClick={() => modalCancel() }>关闭</Button>
                <Button type="primary" onClick={() => save() } ghost>确定</Button>
            </Space> } 
            onCancel={ () => modalCancel() }
        >
            <DetailContent>
                <Attachment ref={ attchsRef } isTable={ false } dataSource={ [] } onDoneChange={ (attachs: FileProps[]) => { setList(attachs) } }/>
                <Form form={ form }>
                    <CommonTable columns={[
                        { 
                            key: 'name', 
                            title: '附件名称', 
                            dataIndex: 'name',
                            width: 300 
                        },
                        { 
                            key: 'name', 
                            title: '段信息', 
                            dataIndex: 'name',
                            width: 150,
                            render: (_: undefined, record: Record<string, any>, index: number
                                ): React.ReactNode => (
                                <Form.Item name={['data', index, 'name']}>
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
                {/* <div className={ styles.topPadding }>相关附件
                    <span style={ { position: 'absolute', right: '1%' } }>
                        <Upload 
                            action={ () => {
                                const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                                return baseUrl + '/sinzetech-resource/oss/put-file'
                            } } 
                            headers={
                                {
                                    'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                                    'Tenant-Id': AuthUtil.getTenantId(),
                                    'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                                }
                            }
                            showUploadList={ false }
                            onChange={ (info) => {
                                if(info.file.response && !info.file.response?.success) {
                                    message.warning(info.file.response?.msg)
                                } 
                                if(info.file.response && info.file.response?.success) {
                                    const dataInfo = info.file.response.data
                                    const fileInfo = dataInfo.name.split(".")
                                    RequestUtil.post(this.props.uploadUrl, {
                                        attachInfoDTOList: [{
                                            filePath: dataInfo.name,
                                            fileSize: dataInfo.size,
                                            fileUploadTime: dataInfo.fileUploadTime,
                                            name: dataInfo.originalName,
                                            userName: dataInfo.userName,
                                            fileSuffix: fileInfo[fileInfo.length - 1]
                                        }],
                                        ...this.props.requestData
                                    }).then(res => {
                                        message.success('上传成功');
                                        this.getDetail();
                                    })
                                }
                            }}> <Button type='primary' ghost>添加</Button>
                        </Upload>
                    </span>
                </div>
                <CommonTable columns={[
                    { 
                        key: 'name', 
                        title: '附件名称', 
                        dataIndex: 'name',
                        width: 150 
                    },
                    { 
                        key: 'operation', 
                        title: '操作', 
                        dataIndex: 'operation', 
                        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Button type="link" onClick={ () => window.open(record.filePath) }>下载</Button>
                                <Button type="link" onClick={ () => RequestUtil.delete(this.props.delPath + `?productSegmentId=${ this.props.id }&attachId=${ record.id }`).then(res => {
                                    message.success('删除成功');
                                    this.getDetail();
                                }) }>删除</Button>
                            </Space>
                    ) }
                ]}
                    dataSource={ this.state.data?.attachInfoVOList }
                    pagination={ false }
                /> */}
            </DetailContent>
        </Modal>
    </>
})
