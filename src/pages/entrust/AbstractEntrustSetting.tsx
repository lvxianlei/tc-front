/**
 * @author zyc
 * @copyright © 2021 
 */
import { Button,  Col, ColProps, DatePicker, Form, FormInstance, FormItemProps, FormProps, Input, message, Row, Space } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import Dragger from 'antd/lib/upload/Dragger';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import AsyncComponent from '../../components/AsyncComponent';
import { IRenderedSection, ISection } from '../../utils/SummaryRenderUtil';
import styles from './AbstractEntrustSetting.module.less';
import { InboxOutlined } from '@ant-design/icons';
import moment from 'moment';
import RequestUtil from '../../utils/RequestUtil';
import { IAttachVo } from './EntrustDetail';

interface IAuthoritableFormItemProps extends FormItemProps {

}

export interface IFormItemGroup extends ISection {
    readonly itemProps: IAuthoritableFormItemProps[];
    readonly itemCol?: ColProps;
}

export interface IAbstractEntrustSettingState {
    readonly entrust?: IEntrust;
    readonly isVisible?: boolean;
    readonly attachList?: IAttachVo[];
    readonly entrustSubmitType?: number;
}

export interface IEntrust {
    readonly projectName?: string;
    readonly projectStartTime?: string;
    readonly projectEndTime?: string;
    readonly attachVoList?: IAttachVo[];
}

export enum SubmitType {
    SUBMIT = 1,
    SAVE = 2
}

/**
 * Abstract fillable form component.
 */
export default abstract class AbstractEntrustSetting<P extends RouteComponentProps, S extends IAbstractEntrustSettingState> extends AsyncComponent<P, S> {
    
    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    public state: S = {
        isVisible: false
    } as S;

    /**
     * @constructor
     * Creates an instance of abstract fillable component.
     * @param props 
     */
    constructor(props: P) {
        super(props);
        this.onFinishSubmit = this.onFinishSubmit.bind(this)
    }

    /**
     * @constructor
     * @description show modal
     * @param props 
     */
    public showModal = () : void => {
        this.setState({
            isVisible: true
        })
    } 

    /**
     * @private
     * @description Gets form item groups
     * @returns form item groups 
     */
    private getFormItemGroups(): IFormItemGroup[][] {
        const entrust: IEntrust | undefined = this.state?.entrust;
        return [[
            {
                title: '委托信息',
                itemCol: {
                    span: 22
                },
                itemProps: [{
                    label: '工程名称',
                    name: 'projectName',
                    initialValue: entrust?.projectName,
                    rules: [{
                        required: true,
                        message: '请输入工程名称'
                    }],
                    children: <Input />
                }, {
                    label: '工程周期',
                    name: 'projectTime',
                    initialValue: [moment(entrust?.projectStartTime), moment(entrust?.projectEndTime)],
                    rules: [{
                        required: true,
                        message: '请选择工程周期'
                    }],
                    children: <DatePicker.RangePicker />
                }, {
                    label: '资料包',
                    name: 'attachVoList',
                    initialValue: entrust?.attachVoList,
                    rules: [{
                        required: true,
                        message: '请上传资料'
                    }],
                    children: 
                    <Dragger 
                        name='file' 
                        multiple={ true } 
                        action= 'https://www.mocky.io/v2/5cc8019d300000980a055e76' 
                        className={ styles.upload_section } 
                        showUploadList={ false }
                        onChange={ (info) => {const { status } = info.file;
                            if (status === 'done') {
                                message.success(`${info.file.name} file uploaded successfully.`);
                                let attachList: IAttachVo[] | undefined = this.state.attachList || [];
                                attachList.push(info.file.response)
                                this.setState({
                                    attachList: attachList
                                })
                            } else if (status === 'error') {
                                message.error(`${info.file.name} file upload failed.`);
                            }} }
                    >
                        <p className={ styles.upload_drag_icon }>
                            <InboxOutlined />
                        </p>
                        <p className={ styles.upload_text }>点击或拖动文件上传</p>
                        <p className={ styles.upload_hint }>
                            支持单个或批量上传
                        </p>
                        <p className={ styles.upload_point }>
                            （工程图纸、加工配基表、塔杆明细）
                        </p>
                    </Dragger>
                }]
            }
        ]]
    }

    /**
     * @description Determines whether cancel on
     */
    protected onCancel = (): void => {
        this.setState({
            isVisible: false
        })
    }

    /**
     * @abstract
     * @description Determines whether save on
     * @param values 
     * @returns save 
     */
    public onSave = (): void => {
        this.setState({
            entrustSubmitType: SubmitType.SAVE
        }, () => {
            if (this.getForm()) {
                this.onFinishSubmit(this.getForm()?.getFieldsValue(true))
            }
        })
    }

    /**
     * @abstract
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    public onSubmit = (): void => {
        this.setState({
            entrustSubmitType: SubmitType.SUBMIT
        }, () => {
            if (this.getForm()) {
                this.onFinishSubmit(this.getForm()?.getFieldsValue(true))
            }
        })
    }

    public deleteAttach = async (values: Record<string, any>, index: number): Promise<void> => {
        await RequestUtil.delete(`/tower-system/attach?ids=${ values.attachId }`);
        const attachList: IAttachVo[] | undefined= this.state?.attachList;
        attachList && attachList.splice(index, 1);
        this.setState({
            attachList: attachList
        })
    }

     /**
     * @abstract
     * @description Determines whether finish on
     * @param values 
     * @returns onfinish 
     */
    abstract onFinishSubmit(values: Record<string, any>): Promise<void>;

    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
    protected getForm(): FormInstance | null {
        return this.form?.current;
    }

    /**
     * @protected
     * @description Gets form props
     * @returns form props 
     */
    protected getFormProps(): FormProps {
        return {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 20
            },
            onFinish: this.onFinishSubmit
        };
    }

    /**
     * @description Renders extra operation area
     * @returns pop modal button
     */
    abstract popModalButton(): React.ReactNode;

    /**
     * @description Renders extra operation area
     * @returns 额外的删除按钮
     */
    abstract renderExtraDeleteButton(): React.ReactNode;

    /**
     * @protected
     * @description Renders extra sections
     * @returns extra sections 
     */
    protected renderExtraSections(): IRenderedSection[] {
        return [{
            title: '已上传资料包',
            render: (): React.ReactNode => {
                return (
                    <>
                        { this.state.attachList ? 
                            <>{ this.state.attachList.map<React.ReactNode>((items: IAttachVo, index: number): React.ReactNode => {
                                    return <Row justify="center" gutter={24} key={ index }>
                                        <Col span={6}>{ items.name }</Col>
                                        <Col span={6}>{ items.fileUploadTime }</Col>
                                        <Col span={6}>
                                            <Button type="link" onClick={ () => this.deleteAttach(items, index) }>
                                                删除
                                            </Button>
                                        </Col>
                                    </Row>
                                })
                            }</> 
                            : <img src="" alt="" /> }
                        
                    </>
                )
            }
        }]
    }

    /**
     * @protected
     * @description Renders form items
     * @param items 
     * @param itemIndex 
     * @returns form items 
     */
     protected renderFormItems(items: IFormItemGroup[], itemIndex: number): React.ReactNode {
        return (
            <div key={ itemIndex }>
                {
                    items.map<React.ReactNode>((group: IFormItemGroup): React.ReactNode => (
                        <React.Fragment key={ group.title }>
                            <div className={ styles.title }>{ group.title }</div>
                            {
                                group.itemCol
                                ?
                                <Row gutter={ 24 }>
                                {
                                    group.itemProps.map<React.ReactNode>((props: FormItemProps, index: number): React.ReactNode => (
                                        <Col span={ group.itemCol?.span } key={ `${ props.name }_${ index }` }>
                                            <Form.Item { ...props }/>
                                        </Col>
                                    ))
                                }
                                </Row>
                                :
                                group.itemProps.map<React.ReactNode>((props: FormItemProps, index: number): React.ReactNode => (
                                    <Form.Item key={ `${ props.name }_${ index }` } { ...props }/>
                                ))
                            }
                        </React.Fragment>
                    ))
                }
            </div>
        );
    }

    /**
     * @description Renders AbstractFillableComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <>
                { this.popModalButton() }
                <Modal title="新建委托" width="60%" footer={ null } visible={ this.state.isVisible } onCancel={ this.onCancel }>
                    <Form { ...this.getFormProps() } ref={ this.form }>
                        <Space size="large" direction="horizontal">
                            <Row>
                                <Col span={ 12 }>
                                    <Space size="middle" direction="horizontal">
                                        {
                                            this.state.isVisible && this.getFormItemGroups().map<React.ReactNode>((items: IFormItemGroup[], itemIndex: number): React.ReactNode => this.renderFormItems(items, itemIndex))
                                        }
                                    </Space>
                                </Col>
                                <Col span={ 12 }>
                                    {
                                        this.state.isVisible && this.renderExtraSections().map<React.ReactNode>((section: IRenderedSection): React.ReactNode => (
                                            <React.Fragment key={ section.title }>
                                                <div className={ styles.title }>{ section.title }</div>
                                                { section.render.call(this) }
                                            </React.Fragment>
                                        ))
                                    }
                                </Col>
                            </Row>
                        </Space>
                        <Space size="large" direction="horizontal" className={ styles.footer_btn }>
                            { this.renderExtraDeleteButton() }
                            <Button type="default" htmlType="button" onClick={ this.onCancel }>关闭</Button>
                            <Button type="default" htmlType="button" onClick={ this.onSave }>保存</Button>
                            <Button type="primary" htmlType="button" onClick={ this.onSubmit }>提交</Button>
                        </Space>
                    </Form>
                </Modal>
            </>
        );
    }
}
