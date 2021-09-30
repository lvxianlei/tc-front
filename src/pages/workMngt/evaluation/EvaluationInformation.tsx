import React from 'react';
import { Button, Space, Modal, Input, Upload, Form, FormInstance, message } from 'antd';
import { DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './Evaluation.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { CloudUploadOutlined } from '@ant-design/icons';
import AuthUtil from '../../../utils/AuthUtil';

interface IResponse {
    readonly id?: string;
    readonly description?: string;
    readonly status?: string;
    readonly assessFileList?: IFileList[];
    readonly descriptionFileList?: IFileList[];
}

interface IFileList {
    readonly id?: string;
    readonly fileName?: string;
    readonly filePath?: string;
    readonly fileSuffix?: string;
}


export interface EvaluationInformationProps {}
export interface IEvaluationInformationRouteProps extends RouteComponentProps<EvaluationInformationProps>, WithTranslation {
    readonly id: number | string;
}

export interface EvaluationInformationState {
    readonly visible: boolean;
    readonly description?: string;
    readonly information?: IResponse;
}

class EvaluationInformation extends React.Component<IEvaluationInformationRouteProps, EvaluationInformationState> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    
    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
    protected getForm(): FormInstance | null {
        return this.form?.current;
    }

    constructor(props: IEvaluationInformationRouteProps) {
        super(props)
    }

    public state: EvaluationInformationState = {
        visible: false
    }

    private modalCancel(): void {
        this.setState({
            visible: false
        })
        this.getForm()?.resetFields();
    }
    
    private async modalShow(): Promise<void> {
        const data: IResponse = await RequestUtil.get<IResponse>(`/tower-science/assessTask/infoDetail/${ this.props.id }`);
        this.setState({
            visible: true,
            information: data,
            description: data.description
        })
    }

    public onSave(): void {
        if (this.getForm()) {
            this.getForm()?.validateFields().then((res) => {
                RequestUtil.post(`/tower-science/assessTask/save`, {
                    description: this.getForm()?.getFieldsValue(true).description,
                    id: this.props.id,
                    fileList: this.state.information?.assessFileList
                });
            })
        }  
    }

    public onSubmit(): void {
        if (this.getForm()) {
            this.getForm()?.validateFields().then((res) => {
                RequestUtil.post(`/tower-science/assessTask/submit `, {
                    description: this.getForm()?.getFieldsValue(true).description,
                    id: this.props.id,
                    fileList: this.state.information?.assessFileList
                });
            })
        } 
    }

     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="link" onClick={ () => this.modalShow() }>评估信息</Button>
            <Modal 
                visible={ this.state.visible } 
                width="40%" 
                title="评估信息" 
                footer={ 
                    <Space direction="horizontal" size="small">
                        <Button type="ghost" onClick={() => this.modalCancel() }>关闭</Button> 
                        {
                            this.state.information?.status === '3' ? 
                            <><Button type="primary" onClick={() => this.onSave() }>保存</Button> 
                            <Button type="primary" onClick={() => this.onSubmit() } ghost>保存并提交</Button></>
                            : null
                        }
                    </Space>
                } 
                onCancel={ () => this.modalCancel() }
            >
                <Form onFinish={ () => this.onSave() } ref={ this.form }>
                    <DetailContent>
                        <p>说明文件</p>
                        <CommonTable 
                            columns={[
                                { 
                                    key: 'fileName', 
                                    title: '附件', 
                                    dataIndex: 'fileName',
                                    width: 250 
                                },
                                { 
                                    key: 'operation', 
                                    title: '操作', 
                                    dataIndex: 'operation', 
                                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                                        <Space direction="horizontal" size="small">
                                            <Button type="link">下载</Button>
                                            <Button type="link">预览</Button>
                                        </Space>
                                    )
                                }
                            ]}
                            dataSource={ this.state.information?.descriptionFileList }
                            pagination={ false }
                        />
                        <p className={ styles.topPadding }>评估信息<span style={{ color: 'red' }}>*</span></p>
                            <Form.Item
                                name="description"
                                rules={[{ required: true, message: '请输入评估信息' }]}
                                initialValue={ this.state.description }
                            >
                                <Input.TextArea placeholder="请输入" maxLength={ 300 } showCount />
                            </Form.Item>
                        <p className={ styles.topPadding }>评估文件
                            <Upload action={ () => {
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
                                data={ { productCategoryId: this.props.id } }
                                onChange={ (info) => {
                                    if(info.file.response && !info.file.response?.success) {
                                        message.warning(info.file.response?.msg)
                                    } 
                                    if(info.file.response && info.file.response?.success) {
                                        let resData: IFileList[] = info.file.response?.data;
                                        this.setState({
                                            information: {
                                                ...this.state.information,
                                                assessFileList: [
                                                    ...this.state.information?.assessFileList || [],
                                                    ...resData
                                                ]
                                            }
                                        })
                                    }
                                }}>
                                <CloudUploadOutlined />
                            </Upload>
                        </p>
                        <CommonTable    
                            columns={[
                                { 
                                    key: 'fileName', 
                                    title: '附件', 
                                    dataIndex: 'fileName',
                                    width: 250
                                },
                                { 
                                    key: 'operation', 
                                    title: '操作', 
                                    dataIndex: 'operation', 
                                    render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                        <Space direction="horizontal" size="small">
                                            <Button type="link">下载</Button>
                                            <Button type="link">预览</Button>
                                            <Button type="link" onClick={ () => {
                                                const information: IResponse = this.state.information || {};
                                                information.assessFileList && information.assessFileList.splice(index, 1);
                                                console.log(information.assessFileList)
                                                this.setState({
                                                    information: {
                                                        ...information,
                                                        assessFileList: [ ...information.assessFileList || [] ]
                                                    }
                                                })
                                            } }>删除</Button>
                                        </Space>
                                    ) 
                                }
                            ]}
                            dataSource={ this.state.information?.assessFileList }
                            pagination={ false }
                        />
                    </DetailContent>
                </Form>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(EvaluationInformation))
