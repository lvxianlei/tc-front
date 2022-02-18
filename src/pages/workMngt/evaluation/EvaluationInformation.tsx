import React from 'react';
import { Button, Space, Modal, Input, Form, FormInstance } from 'antd';
import { DetailContent, Attachment, AttachmentRef } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './Evaluation.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { FileProps } from '../../common/Attachment';

interface IResponse {
    readonly id?: string;
    readonly assessInfo?: string;
    readonly status?: string | number;
    readonly assessFileVOList?: FileProps[];
    readonly instructionFileVOList?: FileProps[];
}

export interface EvaluationInformationProps { }
export interface IEvaluationInformationRouteProps extends RouteComponentProps<EvaluationInformationProps>, WithTranslation {
    readonly id: number | string;
    readonly updateList: () => void;
}

export interface EvaluationInformationState {
    readonly visible: boolean;
    readonly description?: string;
    readonly information?: IResponse;
}

class EvaluationInformation extends React.Component<IEvaluationInformationRouteProps, EvaluationInformationState> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    private attchsRef: React.RefObject<AttachmentRef> = React.createRef<AttachmentRef>();
    /**
     * @protected
     * @description Gets ref
     * @returns ref 
     */
    protected getAttchsRef(): AttachmentRef | null {
        return this.attchsRef?.current
    }

    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
    protected getForm(): FormInstance | null {
        return this.form?.current;
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
        const data: IResponse = await RequestUtil.get<IResponse>(`/tower-science/assessTask/infoDetail/${this.props.id}`);
        this.setState({
            visible: true,
            information: data,
            description: data.assessInfo
        })
    }

    public onSave(): void {
        if (this.getForm()) {
            this.getForm()?.validateFields().then((res) => {
                RequestUtil.post(`/tower-science/assessTask/infoSave`, {
                    assessInfo: this.getForm()?.getFieldsValue(true).description,
                    id: this.props.id,
                    fileIdList: this.getAttchsRef()?.getDataSource().map(res => { return res.id })
                }).then(res => {
                    this.setState({
                        visible: false
                    })
                    this.props.updateList();
                });
            })
        }
    }

    public onSubmit(): void {
        if (this.getForm()) {
            this.getForm()?.validateFields().then((res) => {
                RequestUtil.post(`/tower-science/assessTask/infoSubmit`, {
                    assessInfo: this.getForm()?.getFieldsValue(true).description,
                    id: this.props.id,
                    fileIdList: this.getAttchsRef()?.getDataSource().map(res => { return res.id })
                }).then(res => {
                    this.setState({
                        visible: false
                    })
                    this.props.updateList();
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
            <Button type="link" onClick={() => this.modalShow()}>评估信息</Button>
            <Modal
                visible={this.state.visible}
                width="40%"
                title="评估信息"
                footer={
                    <Space direction="horizontal" size="small">
                        <Button type="ghost" onClick={() => this.modalCancel()}>关闭</Button>
                        {
                            this.state.information?.status === 3 ?
                                <><Button type="primary" onClick={() => this.onSave()}>保存</Button>
                                    <Button type="primary" onClick={() => this.onSubmit()} ghost>保存并提交</Button></>
                                : null
                        }
                    </Space>
                }
                className={styles.modal}
                onCancel={() => this.modalCancel()}
            >
                <Form onFinish={() => this.onSave()} ref={this.form}>
                    <DetailContent>
                        <Attachment title="说明文件" dataSource={this.state.information?.instructionFileVOList} />
                        <p className={styles.topPadding}>评估信息<span style={{ color: 'red' }}>*</span></p>
                        <Form.Item
                            name="description"
                            rules={[{ required: true, message: '请输入评估信息' }]}
                            initialValue={this.state.description}
                        >
                            <Input.TextArea placeholder="请输入" maxLength={300} disabled={this.state.information?.status === 4} showCount />
                        </Form.Item>
                        <Attachment title="评估文件" ref={this.attchsRef} edit={!(this.state.information?.status === 4)} dataSource={this.state.information?.assessFileVOList} />
                    </DetailContent>
                </Form>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(EvaluationInformation))
