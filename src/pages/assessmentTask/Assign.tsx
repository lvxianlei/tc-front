import React from 'react';
import { Button, Modal, FormProps, DatePicker, TreeSelect, Select } from 'antd';
import RequestUtil from '../../utils/RequestUtil';
import styles from './AssessmentTask.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../components/AbstractFillableComponent';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';

export interface AssignProps { }
export interface IAssignRouteProps extends RouteComponentProps<AssignProps>, WithTranslation {
    readonly id: number | string;
    readonly updataList: () => void;
}

export interface AssignState extends IAbstractFillableComponentState {
    readonly visible: boolean;
    readonly description?: string;
    readonly assessUserOptions?: [];
    readonly departmentData?: SelectDataNode[];
}
class Assign extends AbstractFillableComponent<IAssignRouteProps, AssignState> {
    constructor(props: IAssignRouteProps) {
        super(props)
    }

    public state: AssignState = {
        visible: false,
        height: 200
    }

    private async modalShow(): Promise<void> {
        const departmentData = await RequestUtil.get<SelectDataNode[]>(`/tower-system/department`);
        this.setState({
            visible: true,
            departmentData: departmentData
        })
    }

    public onSubmit = async (): Promise<void> => {
        if (this.getForm()) {
            this.getForm()?.validateFields().then((res) => {
                const values = this.getForm()?.getFieldsValue(true);
                RequestUtil.put(`/tower-science/assessTask/assign`, {
                    ...values,
                    id: this.props.id,
                    expectDeliverTime: values.expectDeliverTime.format("YYYY-MM-DD HH:ss:mm")
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
     * onDepartmentChange
     */
    public onDepartmentChange = async (value: Record<string, any>) => {
        const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
        this.getForm()?.setFieldsValue({ 'assessUser': '' })
        this.setState({
            assessUserOptions: userData.records
        })
    }

    public wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles && roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                this.wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }

    public renderTreeNodes = (data: any) => data.map((item: any) => {
        if (item.children) {
            item.disabled = true;
            return (<TreeNode key={item.id} title={item.name} value={item.id} className={styles.node} >
                {this.renderTreeNodes(item.children)}
            </TreeNode>);
        }
        return <TreeNode {...item} key={item.id} title={item.name} value={item.id} />;
    });

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
                name: 'assessUserDept',
                rules: [{
                    required: true,
                    message: '请选择部门'
                }],
                children: <TreeSelect placeholder="请选择" onChange={(value: any) => { this.onDepartmentChange(value) }} style={{ width: '100%' }}>
                    {this.renderTreeNodes(this.wrapRole2DataNode(this.state.departmentData))}
                </TreeSelect>
            }, {
                label: '人员',
                name: 'assessUser',
                rules: [{
                    required: true,
                    message: '请选择人员'
                }],
                children: (
                    <Select placeholder="请选择">
                        {this.state.assessUserOptions && this.state.assessUserOptions.map((item: any) => {
                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                        })}
                    </Select>
                )
            }, {
                label: '计划交付时间',
                name: 'expectDeliverTime',
                rules: [{
                    required: true,
                    message: '请选择计划交付时间'
                }],
                children: <DatePicker showTime className={styles.width100} />
            }]
        }]];
    }

    /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="link" onClick={() => this.modalShow()}>指派</Button>
            <Modal
                visible={this.state.visible}
                width="50%"
                title="指派"
                onCancel={() => this.onCancel()}
                onOk={() => this.onSubmit()}
                okText="提交"
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

export default withRouter(withTranslation('translation')(Assign))
