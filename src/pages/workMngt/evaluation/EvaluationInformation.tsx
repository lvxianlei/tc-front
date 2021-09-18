import React from 'react';
import { Button, Space, Modal, Input, Upload, Form, FormInstance } from 'antd';
import { DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './Evaluation.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { CloudUploadOutlined } from '@ant-design/icons';

export interface EvaluationInformationProps {}
export interface IEvaluationInformationRouteProps extends RouteComponentProps<EvaluationInformationProps>, WithTranslation {
    readonly id: number | string;
}

export interface EvaluationInformationState {
    readonly visible: boolean;
    readonly description?: string;
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

    public componentDidMount() {
        this.getInformation();
    }

    private async getInformation(): Promise<void> {
        const data = await RequestUtil.get(`/tower-market/bidInfo/${ this.props.id }`);
        this.setState({
            
        })
    }

    public onSave(): void {
        if (this.getForm()) {
            this.getForm()?.validateFields().then((res) => {
                console.log(this.getForm()?.getFieldsValue(true))
            })
        }  
    }

    public onSubmit(): void {
        
    }

     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="link" onClick={ () => this.setState({ visible: true }) }>评估信息</Button>
            <Modal 
                visible={ this.state.visible } 
                width="40%" 
                title="评估信息" 
                footer={ 
                    <Space direction="horizontal" size="small">
                        <Button type="ghost" onClick={() => this.modalCancel() }>关闭</Button> 
                        <Button type="primary" onClick={() => this.onSave() }>保存</Button> 
                        <Button type="primary" onClick={() => this.onSubmit() } ghost>保存并提交</Button> 
                    </Space>
                } 
                onCancel={ () => this.modalCancel() }
            >
                <Form onFinish={ () => this.onSave() } ref={ this.form }>
                    <DetailContent>
                        <p>说明文件</p>
                        <CommonTable columns={[
                            { 
                                key: 'name', 
                                title: '附件', 
                                dataIndex: 'name',
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
                                    </Space>) 
                            }
                        ]}
                            dataSource={ [] }
                        />
                        <p className={ styles.topPadding }>评估信息<span style={{ color: 'red' }}>*</span></p>
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: '请输入评估信息' }]}
                            >
                                <Input.TextArea placeholder="请输入" maxLength={ 300 } value={ this.state.description } showCount />
                            </Form.Item>
                        <p className={ styles.topPadding }>评估文件<Upload ><CloudUploadOutlined /></Upload></p>
                        <CommonTable columns={[
                            { 
                                key: 'name', 
                                title: '附件', 
                                dataIndex: 'name',
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
                                        <Button type="link">删除</Button>
                                    </Space>) 
                            }
                        ]}
                            dataSource={ [] }
                        />
                    </DetailContent>
                </Form>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(EvaluationInformation))
