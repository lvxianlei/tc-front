/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, Card, Col, ColProps, Form, FormInstance, FormItemProps, FormProps, message, Popconfirm, Row, Space } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import layoutStyles from '../layout/Layout.module.less';
import { IRenderedSection, ISection } from '../utils/SummaryRenderUtil';
import styles from './AbstractFillableComponent.module.less';
import AbstractTitledRouteComponent from './AbstractTitledRouteComponent';

interface IAuthoritableFormItemProps extends FormItemProps {
    readonly authority?: string;
}

export interface IFormItemGroup extends ISection {
    readonly itemProps: IAuthoritableFormItemProps[];
    readonly itemCol?: ColProps;
}

export interface IAbstractFillableComponentState {
    readonly height?: number;
}

/**
 * Abstract fillable form component.
 */
export default abstract class AbstractFillableComponent<P extends RouteComponentProps, S extends IAbstractFillableComponentState> extends AbstractTitledRouteComponent<P, S> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    /**
     * @constructor
     * Creates an instance of abstract fillable component.
     * @param props 
     */
    constructor(props: P) {
        super(props);
        this.onFormFinish = this.onFormFinish.bind(this);
        this.onSubmitAndContinue = this.onSubmitAndContinue.bind(this);
    }

    /**
     * @protected
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return '';
    }

    /**
     * @private
     * @description Determines whether form finish on
     * @param values 
     */
    private onFormFinish(values: Record<string, any>): void {
        this.onSubmit(values).then(() => {
            this.onCancel()
        });
    }

    /**
     * @abstract
     * @description Gets form item groups
     * @returns form item groups 
     */
    abstract getFormItemGroups(): IFormItemGroup[][];

    /**
     * @abstract
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    abstract onSubmit(values: Record<string, any>): Promise<void>;

    /**
     * @description Determines whether cancel on
     */
    protected onCancel = (): void => {
        const returnPath: string = this.getReturnPath();
        if (returnPath) {
            this.props.history.push(returnPath);
            // this.props.history.go(-1);
        }
    }

    /**
     * @protected
     * @description Determines whether submit and continue on
     */
    protected async onSubmitAndContinue() {
        if (this.getForm()) {
            this.getForm()?.validateFields().then((res) => {
                const result: any = (this.getForm() as any).validateFields();
                if (result) {
                    this.onSubmit(result).then(() => {
                        message.success("保存成功！");
                        this.getForm()?.resetFields();
                    });
                }
            })
        }
    }
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
            onFinish: this.onFormFinish
        };
    }

    /**
     * @protected
     * @description Renders extra sections
     * @returns extra sections 
     */
    protected renderExtraSections(): IRenderedSection[] {
        return [];
    }

    /**
     * @description Renders extra operation area
     * @returns extra operation area 
     */
    protected renderExtraOperationArea(): React.ReactNode {
        return <Button type="primary" htmlType="button" style={{ marginRight: 16, position: "absolute", top: 20 }} onClick={this.onSubmitAndContinue}>保存并继续新增</Button>;
    }

    /**
     * @description Renders extra operation area
     * @returns extra operation area 
     */
    protected cancelOperationButton(): React.ReactNode {
        return <Button type="ghost" htmlType="reset" style={{ marginRight: 16, position: "absolute", top: 20, left: 94 }} onClick={this.onCancel}>取消</Button>;
    }

    /**
     * @description Gets primary operation button
     * @returns primary operation button
     */
    protected getPrimaryOperationButton(): React.ReactNode {
        return <Button type="primary" htmlType="submit" style={{ marginRight: 16, position: "absolute", top: 20 }}>保存</Button>;
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
            <div key={itemIndex}>
                {
                    items.map<React.ReactNode>((group: IFormItemGroup): React.ReactNode => (
                        <React.Fragment key={group.title}>
                            <div className={styles.titleWrapper} style={{ marginBottom: 12 }}>{group.title}</div>
                            {
                                group.itemCol
                                    ?
                                    <Row gutter={24}>
                                        {
                                            group.itemProps.map<React.ReactNode>((props: FormItemProps, index: number): React.ReactNode => (
                                                <Col span={group.itemCol?.span} key={`${props.name}_${index}`}>
                                                    <Form.Item {...props} />
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                    :
                                    group.itemProps.map<React.ReactNode>((props: FormItemProps, index: number): React.ReactNode => (
                                        <Form.Item key={`${props.name}_${index}`} {...props} />
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
        const formItemGroups: IFormItemGroup[][] = this.getFormItemGroups();
        const height = this.state.height ? this.state.height : document.documentElement.clientHeight - 140;
        return (
            <Card className={styles.cardWrapper}>
                <Form {...this.getFormProps()} ref={this.form}>
                    <Space size="large" direction="vertical" className={`${layoutStyles.width100} ${styles.space}`}>
                        <div style={{ height: height, "overflowY": "auto", overflowX: "hidden" }}>
                            <Space size="middle" direction="horizontal" className={`${layoutStyles.width100} ${styles.hspace}`}>
                                {
                                    formItemGroups.map<React.ReactNode>((items: IFormItemGroup[], itemIndex: number): React.ReactNode => this.renderFormItems(items, itemIndex))
                                }
                            </Space>
                            {
                                this.renderExtraSections().map<React.ReactNode>((section: IRenderedSection): React.ReactNode => (
                                    <React.Fragment key={section.title}>
                                        <div className={styles.titleWrapper}>{section.title}</div>
                                        {section.render.call(this)}
                                    </React.Fragment>
                                ))
                            }
                        </div>
                        <div className={styles.btnOperationContainer}>
                            {/* <Space direction="horizontal" size="large"> */}
                            {this.getPrimaryOperationButton()}
                            {this.renderExtraOperationArea()}
                            {this.cancelOperationButton()}
                            {/* </Space> */}
                        </div>
                    </Space>
                </Form>
            </Card>
        );
    }
}