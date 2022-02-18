import React from 'react';
import { Button, Modal, Input, FormProps, Select } from 'antd';
import RequestUtil from '../../../utils/RequestUtil';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../../components/AbstractFillableComponent';
import { boltTypeOptions } from '../../../configuration/DictionaryOptions';

export interface BoltNewModalProps { }
export interface IBoltNewModalRouteProps extends RouteComponentProps<BoltNewModalProps>, WithTranslation {
    readonly id: number | string;
    readonly updataList: () => void;
    readonly basicHeightId: number | string;
}

export interface BoltNewModalState extends IAbstractFillableComponentState {
    readonly visible: boolean;
}
class BoltNewModal extends AbstractFillableComponent<IBoltNewModalRouteProps, BoltNewModalState> {

    public state: BoltNewModalState = {
        visible: false
    }

    private async modalShow(): Promise<void> {
        this.setState({
            visible: true,
            height: 380
        })
    }

    public onSubmit = async (): Promise<void> => {
        if (this.getForm()) {
            this.getForm()?.validateFields().then((res) => {
                const values = this.getForm()?.getFieldsValue(true);
                RequestUtil.post(`/tower-science/boltRecord`, {
                    ...values,
                    productCategoryId: this.props.id,
                    basicHeightId: this.props.basicHeightId
                }).then(res => {
                    this.onCancel();
                    this.props.updataList();
                });
            })
        }
    }

    /**
     * @description Determines whether cancel on
     */
    protected onCancel = (): void => {
        this.setState({
            visible: false
        })
        this.getForm()?.resetFields();
    }

    /**
     * @override
     * @description Gets form props
     * @returns form props 
     */
    protected getFormProps(): FormProps {
        return {
            ...super.getFormProps(),
            labelCol: {
                span: 8
            },
            wrapperCol: {
                offset: 1
            }
        };
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        return [[{
            title: '',
            itemCol: {
                span: 12
            },
            itemProps: [{
                label: '类型',
                name: 'type',
                rules: [{
                    required: true,
                    message: '请选择类型'
                }],
                children: <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择'>
                    {boltTypeOptions && boltTypeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={id}>
                            {name}
                        </Select.Option>
                    })}
                </Select>
            }, {
                label: '名称',
                name: 'name',
                rules: [{
                    required: true,
                    message: '请输入名称'
                }],
                children: (
                    <Input maxLength={10} />
                )
            }, {
                label: '规格',
                name: 'specs',
                rules: [{
                    required: true,
                    message: '请输入规格'
                }],
                children: (
                    <Input maxLength={20} />
                )
            }, {
                label: '无扣长',
                name: 'unbuckleLength',
                children: (
                    <Input type="number" max={9999} />
                )
            }, {
                label: '等级',
                name: 'level',
                rules: [{
                    required: true,
                    message: '请输入等级'
                }],
                children: (
                    <Input maxLength={20} />
                )
            }, {
                label: '单重',
                name: 'singleWeight',
                rules: [{
                    required: true,
                    message: '请输入单重'
                }],
                children: (
                    <Input type="number" min={0} max={9999} onChange={(e) => {
                        if (this.getForm()?.getFieldsValue(true).total) {
                            this.getForm()?.setFieldsValue({ totalWeight: Number(e.target.value) * this.getForm()?.getFieldsValue(true).total })
                        }
                    }} />
                )
            }, {
                label: '小计',
                name: 'subtotal',
                rules: [{
                    required: true,
                    message: '请输入小计'
                }],
                children: (
                    <Input type="number" max={9999} onChange={(e) => {
                        const total = Number(e.target.value) + Number(this.getForm()?.getFieldsValue(true).wealth);
                        this.getForm()?.setFieldsValue({ total: total })
                        if (this.getForm()?.getFieldsValue(true).singleWeight) {

                            this.getForm()?.setFieldsValue({ totalWeight: total * this.getForm()?.getFieldsValue(true).singleWeight })

                        }
                    }} />
                )
            }, {
                label: '裕度',
                name: 'wealth',
                rules: [{
                    required: true,
                    message: '请输入裕度'
                }],
                initialValue: 0,
                children: (
                    <Input type="number" max={9999} onChange={(e) => {

                        const total = Number(e.target.value) + Number(this.getForm()?.getFieldsValue(true).subtotal);
                        this.getForm()?.setFieldsValue({ total: total })
                        if (this.getForm()?.getFieldsValue(true).subtotal && this.getForm()?.getFieldsValue(true).singleWeight) {
                            this.getForm()?.setFieldsValue({ totalWeight: total * this.getForm()?.getFieldsValue(true).singleWeight })
                        }
                    }} />
                )
            }, {
                label: '合计',
                name: 'total',
                rules: [{
                    required: true,
                    message: '请输入合计'
                }],
                children: (
                    <Input type="number" min={0} max={9999} disabled />
                )
            }, {
                label: '总重（kg）',
                name: 'totalWeight',
                rules: [{
                    required: true,
                    message: '请输入总重（kg）'
                }],
                children: (
                    <Input disabled />
                )
            }, {
                label: '备注',
                name: 'description',
                children: (
                    <Input maxLength={50} />
                )
            }]
        }]];
    }

    /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="primary" onClick={() => this.modalShow()} ghost>添加</Button>
            <Modal
                visible={this.state.visible}
                width="40%"
                title="添加"
                onCancel={() => this.onCancel()}
                onOk={() => this.onSubmit()}
                okText="确定"
                cancelText="关闭"
            >
                {super.render()}
            </Modal>
        </>
    }

    /**
     * @description Renders extra operation area
     * @returns extra operation area 
     */
    protected renderExtraOperationArea(): React.ReactNode {
        return null;
    }

    /**
     * @description Gets primary operation button
     * @returns primary operation button
     */
    protected getPrimaryOperationButton(): React.ReactNode {
        return null;
    }

    /**
     * @description Renders extra operation area
     * @returns extra operation area 
     */
    protected cancelOperationButton(): React.ReactNode {
        return null;
    }


    /**
     * @protected
     * @description Gets title
     * @returns title 
     */
    protected getTitle(): string {
        return '';
    }
}

export default withRouter(withTranslation('translation')(BoltNewModal))
