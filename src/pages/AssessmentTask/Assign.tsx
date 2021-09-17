import React from 'react';
import { Button, Space, Modal, Input, FormProps, DatePicker } from 'antd';
import { DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import styles from './AssessmentTask.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../components/AbstractFillableComponent';
import Select from 'rc-select';

export interface AssignProps {}
export interface IAssignRouteProps extends RouteComponentProps<AssignProps>, WithTranslation {
    readonly id: number | string;
}

export interface AssignState extends IAbstractFillableComponentState {
    readonly visible: boolean;
    readonly description?: string;
}
class Assign extends AbstractFillableComponent<IAssignRouteProps, AssignState> {
    constructor(props: IAssignRouteProps) {
        super(props)
    }

    public state: AssignState = {
        visible: false
    }

    public componentDidMount() {
        this.getInformation();
    }

    private async getInformation(): Promise<void> {
        const data = await RequestUtil.get(`/tower-market/bidInfo/${ this.props.id }`);
        this.setState({
            
        })
    }

    public onSubmit = async (): Promise<void> => {

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
            labelCol:{ 
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
                label: '部门',
                name: 'name',
                rules: [{
                    required: true,
                    message: '请选择部门'
                }],
                children: <Input maxLength={ 100 } size="small"/>
            }, {
                label: '人员',
                name: 'type',
                rules: [{
                    required: true,
                    message: '请选择人员'
                }],
                children: (
                    <Input maxLength={ 100 } size="small" />
                    // <Select getPopupContainer={ triggerNode => triggerNode.parentNode }>
                    //     { clientTypeOptions && clientTypeOptions.map(({ id, name }, index) => {
                    //         return <Select.Option key={ index } value={ id }>
                    //             { name }
                    //         </Select.Option>
                    //     }) }
                    // </Select>
                )
            }, {
                label: '计划交付时间 ',
                name: 'description',
                rules: [{
                    required: true,
                    message: '请选择计划交付时间'
                }],
                children: <DatePicker />
            }]
        }]];
    }

    /**
     * @description Renders extra operation area
     * @returns extra operation area 
     */
    protected renderExtraOperationArea(): React.ReactNode {
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

     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="link" onClick={ () => this.setState({ visible: true }) }>指派</Button>
            <Modal 
                visible={ this.state.visible } 
                width="40%" 
                title="评估信息" 
                footer={ <Button type="ghost" onClick={() => this.onCancel() }>关闭</Button> } 
                onCancel={ () => this.onCancel() }
            >
                { super.render() }
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(Assign))
