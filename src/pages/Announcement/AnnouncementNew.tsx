import React, { useState } from 'react';
import { Spin, Button, Space, Modal, message, Image, Form, Input, Upload, Transfer, Tree } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DetailTitle, DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './AnnouncementMngt.module.less';
import { IAnnouncement, IFileList } from './AnnouncementMngt';
import { downLoadFile } from '../../utils';
import AuthUtil from '../../utils/AuthUtil';
import SelectUserTransfer from './SelectUserTransfer';

export interface ITreeData {
    readonly key: string;
    readonly title: string;
    readonly children?: ITreeData[];
}

export default function AnnouncementNew(): React.ReactNode {
    const [ form ] = Form.useForm();
    const [ attachInfo, setAttachInfo ] = useState<IFileList[]>([]);
    const location = useLocation<{ type: string }>();
    const [ staffList, setStaffList ] = useState<string[]>([]);

    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading, data } = useRequest<IAnnouncement>(() => new Promise(async (resole, reject) => {
        if(location.state.type === 'edit') {
            let data = await RequestUtil.get<IAnnouncement>(`/tower-system/notice/getNoticeById/${ params.id }`);
            data = {
                ...data,
            }
            setAttachInfo(data.attachVos || []);
            resole(data);
        } else {
            resole({});
        }
    }), {})
    const detailData: IAnnouncement = data || {};
    const [ pictureVisible, setPictureVisible ] = useState<boolean>(false);
    const [ pictureUrl, setPictureUrl ] = useState('');
    const handlePictureModalCancel = () => { setPictureVisible(false) };

    const deleteAttachData = (id: number) => {
        setAttachInfo(attachInfo.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
    }

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const save = () => {
        if(form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true);
                if(location.state.type === 'new') {
                    RequestUtil.post<IAnnouncement>(`/tower-system/notice`, {
                        id: detailData.id,
                        ...value,
                        attachInfoDtos: attachInfo,
                        staffList: staffList
                    });
                } else {
                    RequestUtil.put<IAnnouncement>(`/tower-system/notice`, {
                        ...value,
                        attachInfoDtos: attachInfo,
                        staffList: staffList
                    });
                }
            })
        }
    }

    const treeData = [
        { key: '0-0', title: '0-0' },
        {
            key: '0-1',
            title: '0-1',
            children: [
                { key: '0-1-0', title: '0-1-0' },
                { key: '0-1-1', title: '0-1-1' },
            ],
        },
        { key: '0-2', title: '0-3' },
    ];
    const transferDataSource: ITreeData[] = [];
    const flatten = (list:ITreeData[] = []): void => {
        list.forEach((item: ITreeData) => {
            transferDataSource.push(item);
            flatten(item.children);
        });
    }
    flatten(treeData);

    return <>
        <DetailContent operation={ [
            <Space direction="horizontal" size="small" className={ styles.bottomBtn }>
                <Button type="primary" onClick={ save }>立即发布</Button>
                <Button type="primary" onClick={ save }>保存草稿</Button>
                <Button type="ghost" onClick={() => history.goBack()}>取消</Button>
            </Space>
        ] }>
            <DetailTitle title="基本信息" key={ 1 }/>
            <Form form={ form } labelCol={{ span: 2 }}>
                <Form.Item name="title" label="标题" initialValue={ detailData.title } rules={[{
                        "required": true,
                        "message": "请输入标题"
                    },
                    {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                    }]}>
                    <Input placeholder="请输入" maxLength={ 50 } />
                </Form.Item>
                <Form.Item name="content" label="内容" initialValue={ detailData.content } rules={[{
                        "required": true,
                        "message": "请输入内容"
                    },
                    {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                    }]}>
                    <Input placeholder="请输入" maxLength={ 50 } />
                </Form.Item>
                <Form.Item name="userNames" label="接收人" initialValue={ detailData.userNames } rules={[{
                        "required": true,
                        "message": "请选择接收人"
                    }]}>
                    {/* <SelectUserTransfer transferDataSource={ transferDataSource } treeData={ treeData }/> */}
                    <Input bordered={false}/>
                </Form.Item>
            </Form>
            <DetailTitle title="上传附件" key={ 2 } operation={[<Upload
                action={ () => {
                    const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                    return baseUrl+'/sinzetech-resource/oss/put-file'
                } } 
                headers={
                    {
                        'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                        'Tenant-Id': AuthUtil.getTenantId(),
                        'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                    }
                }
                showUploadList={ false }
                data={ { productCategoryId: params.id } }
                onChange={ (info) => {
                    if(info.file.response && !info.file.response?.success) {
                        message.warning(info.file.response?.msg)
                    } 
                    if(info.file.response && info.file.response?.success) {
                        const dataInfo = info.file.response.data
                        const fileInfo = dataInfo.name.split(".")
                        setAttachInfo([...attachInfo, {
                            id: "",
                            uid: attachInfo.length,
                            name: dataInfo.originalName,
                            description: "",
                            filePath: dataInfo.name,
                            link: dataInfo.link,
                            fileSize: dataInfo.size,
                            fileSuffix: fileInfo[fileInfo.length - 1],
                            userName: dataInfo.userName,
                            fileUploadTime: dataInfo.fileUploadTime
                        }])
                    }
                } }
            ><Button key="enclosure" type="primary" ghost>添加</Button></Upload>]} />
            <CommonTable columns={[
                { 
                    key: 'name', 
                    title: '附件名称', 
                    dataIndex: 'name',
                    width: 350 
                },
                { 
                    key: 'operation', 
                    title: '操作', 
                    dataIndex: 'operation', 
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                            <Button type="link" onClick={() => downLoadFile(record.id ? record.filePath : record.link)}>下载</Button>
                            {record.fileSuffix === 'pdf' ? <Button type='link' onClick={()=>{ window.open(record.id ? record.filePath : record.link) }}>预览</Button> : null}
                            {['jpg','jpeg', 'png', 'gif'].includes(record.fileSuffix) ? <Button type='link' onClick={()=>{setPictureUrl(record.id ? record.filePath : record.link); setPictureVisible(true);}}>预览</Button> : null}
                            <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>删除</Button>
                        </Space>
                    ) 
                }
            ]}
            dataSource={ attachInfo }
            pagination={ false }/>
        </DetailContent>
        <Modal visible={ pictureVisible } onCancel={ handlePictureModalCancel } footer={ false }>
            <Image src={ pictureUrl } preview={ false } />
        </Modal>
    </>
}