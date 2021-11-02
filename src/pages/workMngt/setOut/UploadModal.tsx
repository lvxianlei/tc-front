import React from 'react';
import { Button, Space, Modal, Upload, message } from 'antd';
import { DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import AuthUtil from '../../../utils/AuthUtil';

export interface UploadModalProps {}
export interface IUploadModalRouteProps extends RouteComponentProps<UploadModalProps>, WithTranslation {
    readonly id: number | string;
    readonly btnName: string;
    readonly path: string;
    readonly requestData?: {};
    readonly uploadUrl: string;
    readonly delPath: string;
}

export interface UploadModalState {
    readonly visible: boolean;
    readonly description?: string;
    readonly data?: IData;
}

interface IData{
    readonly attachInfoVOList?: [];
    readonly productSegmentId?: string;
    readonly productSegmentRecordVOList?: [];
}

const tableColumns = [
    { 
        key: 'index', 
        title: '序号', 
        dataIndex: 'index', 
        width: 50, 
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>) },
    {
        key: 'createUserDepartmentName',
        title: '操作部门',
        dataIndex: 'createUserDepartmentName', 
    },
    {  
        key: 'createUserName', 
        title: '操作人', 
        dataIndex: 'createUserName' 
    },
    { 
        key: 'createTime', 
        title: '操作时间', 
        dataIndex: 'createTime' 
    },
    {
        key: 'action', 
        title: '操作动作', 
        dataIndex: 'action',
        render: (status: number): React.ReactNode => {
            switch (status) {
                case 1:
                    return '上传';
                case 2:
                    return '删除';
            }
        }
    },
    { 
        key: 'name', 
        title: '对象', 
        dataIndex: 'name' 
    }
]

class UploadModal extends React.Component<IUploadModalRouteProps, UploadModalState> {

    public state: UploadModalState = {
        visible: false
    }

    private modalCancel(): void {
        this.setState({
            visible: false
        })
    }

    protected async getDetail(): Promise<void> {
        const data = await RequestUtil.get<IData>(`${ this.props.path }`);
        this.setState({
            data: data
        })
    }

    private modalShow(): void {
        this.getDetail();
        this.setState({
            visible: true
        })
    }

     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="primary" onClick={ () => this.modalShow() } ghost>{ this.props.btnName }</Button>
            <Modal
                visible={ this.state.visible } 
                width="40%" 
                title={ this.props.btnName }
                footer={ <Button type="ghost" onClick={() => this.modalCancel() }>关闭</Button> } 
                onCancel={ () => this.modalCancel() }
            >
                <DetailContent>
                    <div className={ styles.topPadding }>相关附件
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
                    />
                    <p className={ styles.topPadding }>操作信息</p>
                    <CommonTable columns={ tableColumns } dataSource={ this.state.data?.productSegmentRecordVOList }  pagination={ false } />
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(UploadModal))
