/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, Card, Form, FormInstance, FormItemProps, FormProps, Space } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import ApplicationContext from '../configuration/ApplicationContext';
import layoutStyles from '../layout/Layout.module.less';
import styles from './AbstractFillableComponent.module.less';
import AsyncComponent from './AsyncComponent';

interface ISection {
    readonly title: string;
}

export interface IFormItemGroup extends ISection {
    readonly itemProps: FormItemProps[];
}

export interface IExtraSection extends ISection {
    readonly render: () => React.ReactNode;
}

// export interface IData {
//     readonly id: number | string;
// }

export interface IAbstractFillableComponentState {
    // data: IData
}

/**
 * Abstract fillable form component.
 */
export default abstract class AbstractFillableComponent<P extends RouteComponentProps, S extends IAbstractFillableComponentState> extends AsyncComponent<P, S> {
    
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
     * @description Gets title
     * @returns title 
     */
    protected getTitle(): string {
        return ApplicationContext.getRouterItemByPath(this.props.match.path)?.name || '';
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
            const returnPath: string = this.getReturnPath();
            if (returnPath) {
                this.props.history.push(returnPath);
            }
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
     * @protected
     * @description Determines whether submit and continue on
     */
    protected onSubmitAndContinue(): void {
        if (this.form.current) {
            this.onSubmit(this.form.current.getFieldsValue()).then(() => {
                this.form.current?.resetFields();
            });
        }
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
    protected renderExtraSections(): IExtraSection[] {
        return [];
    }

    /**
     * @protected
     * @description Renders save and continue
     * @returns save and continue 
     */
    protected renderSaveAndContinue(): React.ReactNode {
        return <Button type="primary" htmlType="button" onClick={ this.onSubmitAndContinue }>保存并继续新增</Button>;
    }

    /**
     * @description Renders AbstractFillableComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        const formItemGroups: IFormItemGroup[][] = this.getFormItemGroups();
        return (
            <Card title={ this.getTitle() }>
                <Form { ...this.getFormProps() } ref={ this.form }>
                    <Space size="large" direction="vertical" className={ `${ layoutStyles.width100 } ${ styles.space }` }>
                        <Space size="middle" direction="horizontal" className={ `${ layoutStyles.width100 } ${ styles.hspace }` }>
                            {
                                formItemGroups.map<React.ReactNode>((items: IFormItemGroup[], itemIndex: number): React.ReactNode => (
                                    <div key={ itemIndex }>
                                        {
                                            items.map<React.ReactNode>((group: IFormItemGroup): React.ReactNode => (
                                                <React.Fragment key={ group.title }>
                                                    <div className={ styles.title }>{ group.title }</div>
                                                    {
                                                        group.itemProps.map<React.ReactNode>((props: FormItemProps, index: number): React.ReactNode => (
                                                            <Form.Item key={ `${ props.name }_${ index }` } { ...props }/>
                                                        ))
                                                    }
                                                </React.Fragment>
                                            ))
                                        }
                                    </div>
                                ))
                            }
                        </Space>
                        {
                            this.renderExtraSections().map<React.ReactNode>((section: IExtraSection): React.ReactNode => (
                                <React.Fragment key={ section.title }>
                                    <div className={ styles.title }>{ section.title }</div>
                                    { section.render() }
                                </React.Fragment>
                            ))
                        }
                        <div className={ styles.btnOperationContainer }>
                            <Space direction="horizontal" size="large">
                                <Button type="primary" htmlType="submit">保存</Button>
                                { this.renderSaveAndContinue() }
                                <Button type="ghost" htmlType="reset">取消</Button>
                            </Space>
                        </div>
                    </Space>
                </Form>
            </Card>
        );
    }
}