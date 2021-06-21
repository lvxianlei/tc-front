/**
 * @author zyc
 * @copyright © 2021 
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import RequestUtil from '../../utils/RequestUtil';
import { Button, Col, Form, FormInstance, Input,  Modal, Row, Space } from 'antd';
import AsyncComponent from '../../components/AsyncComponent';
import styles from './AbstractEntrustSetting.module.less';

export interface IDeliveryAcceptanceProps {}
export interface IDeliveryAcceptanceRouteProps extends RouteComponentProps<IDeliveryAcceptanceProps>, WithTranslation {
    readonly data: IEntrust;
}
export interface IDeliveryAcceptanceState {
    readonly isVisible?: boolean;
    readonly entrust?: IEntrust;
    readonly isBack?: boolean;
}

export interface IEntrust{
    readonly id?: string;
    readonly examineNum?: number;
    readonly attachInfoVOs?: IAttachVo[];     
    readonly description?: string; 
}

export interface IAttachVo {
    readonly id?: number | string;
    readonly name?: string;
    readonly fileUploadTime?: string;
    readonly fileSuffix?: string;
    readonly fileSize?: number;        
    readonly filePath?: string;
}

/**
 * Create a new entrust.
 */
class DeliveryAcceptance extends AsyncComponent<IDeliveryAcceptanceRouteProps, IDeliveryAcceptanceState> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    public state: IDeliveryAcceptanceState = {
        isVisible: false,
        isBack: false
    } as IDeliveryAcceptanceState;

    public popModalButton(): React.ReactNode {
        return <Button type="link" htmlType="button" onClick={ this.showModal }>交付验收</Button>
    }

    /**
     * @constructor
     * @description show modal
     * @param props 
     */
    public showModal = async () : Promise<void> => {
        this.setState({
            isVisible: true
        })
        const entrust: IEntrust = await RequestUtil.get<IEntrust>(`/tower-outsource/towerModel/detail/${ this.props.data.id }`);
        this.setState({
            entrust: entrust
        });
        this.getForm()?.setFieldsValue({
            ...entrust
        })
    } 

    /**
     * @description Determines whether cancel on
     */
    protected onCancel = (): void => {
        this.setState({
            isVisible: false,
            isBack: false
        })
    }

    /**
     * @description Determines whether back on
     */
     protected onBack = (): void => {
        this.setState({
            isBack: true
        })
    }

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns save 
     */
    public onFinishSubmit = async (values: Record<string, any>): Promise<void> => {
        const entrust: IEntrust | undefined = this.state.entrust;
        values = { ...entrust, ...values };
        console.log(values)
        return await RequestUtil.put('/tower-outsource/towerModel/accept', values);
    }

    /**
     * @implements
     * @description Determines whether submit on
     * @param values 
     * @returns back submit 
     */
     public onBackSubmit = async (): Promise<void> => {
        const entrust: IEntrust | undefined = this.state.entrust;
        let values: IEntrust = this.getForm()?.getFieldsValue(true);
        values = { ...entrust, description: this.getForm()?.getFieldValue('description') };
        console.log(values)
        return await RequestUtil.put('/tower-outsource/towerModel/reject', values);
    }

    public uploadAttach = (value: Record<string, any>): void => {
        window.open(value.filePath);
    }

    /**
     * @description Renders AbstractFillableComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        const entrust: IEntrust | undefined = this.state.entrust;
        return (
            <>
                { this.popModalButton() }
                <Modal title={ this.state.isBack ? "退回确认" : "交付文件" } width="50%" footer={ null } visible={ this.state.isVisible } onCancel={ this.onCancel }>
                     <Form onFinish={ this.onFinishSubmit } ref={ this.form } style={ { width: '100%' } }>
                        { this.state.isBack ? 
                            <Space size="middle" direction="vertical" className={ styles.modal_center }>
                                <Form.Item 
                                    name="description"  
                                    rules={[{ required: true,
                                    message: '请输入退回原因' }]}
                                    wrapperCol={{ offset: 7, span: 10 }}
                                >
                                    <Input.TextArea placeholder={ "请输入退回原因（必填）" }/>
                                </Form.Item>
                                <Space size="large" direction="horizontal">
                                    <Button type="primary" htmlType="button" onClick={ this.onBackSubmit }>确认退回</Button>
                                </Space>
                            </Space>
                            :<Space size="middle" direction="vertical" className={ styles.modal_center }>
                                <Form.Item 
                                    label="审核件数" 
                                    name="examineNum" 
                                    initialValue={ entrust?.examineNum } 
                                    rules={[{ required: true,
                                    message: '请输入审核件数' }]}
                                    wrapperCol={{ span: 10 }}
                                    labelCol={{ offset: 7 }}
                                    >
                                    <Input />
                                </Form.Item>
                                { entrust?.attachInfoVOs && entrust?.attachInfoVOs.map<React.ReactNode>((items: IAttachVo, index: number): React.ReactNode => {
                                        return <Row justify="center" key={ index }>
                                            <Col span={6}>{ items.name }</Col>
                                            <Col span={6}>{ items.fileUploadTime }</Col>
                                            <Col span={6}>
                                                <Button type="link" onClick={ () => this.uploadAttach(items) }>
                                                    下载
                                                </Button>
                                            </Col>
                                        </Row>
                                    })
                                }
                                <Space size="large" direction="horizontal">
                                    <Button type="default" htmlType="button" onClick={ this.onCancel }>关闭</Button>
                                    <Button type="default" htmlType="button" onClick={ this.onBack }>退回</Button>
                                    <Button type="primary" htmlType="submit">验收通过</Button>
                                </Space>
                            </Space> 
                        }
                    </Form>
                </Modal>
                { this.backModal() }
            </>
        );
    }

    public backModal(): React.ReactNode {
        return <Modal>

        </Modal>
    }

    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
     protected getForm(): FormInstance | null {
        return this.form?.current;
    }

}

export default withRouter(withTranslation()(DeliveryAcceptance));
