import React from 'react';
import { Button, Space, Modal, Input, Descriptions, Form, FormInstance, DatePicker, TreeSelect, Select, message } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import moment from 'moment';

export interface TowerLoftingAssignProps {}
export interface ITowerLoftingAssignRouteProps extends RouteComponentProps<TowerLoftingAssignProps>, WithTranslation {
    readonly id: number | string;
    readonly update: () => void;
    readonly title: string;
    readonly state?: number
    readonly type?: string;  //detail为展示，此时需传detailData
    readonly detailData?: IAppointed;
    readonly rowId?: string;
}

export interface TowerLoftingAssignState {
    readonly visible: boolean;
    readonly description?: string;
    readonly appointed?: IAppointed;
    readonly repeatModal: boolean;
    readonly repeatNum?: number;
    readonly selectKey?: number;
    user?: any[];
    checkUser?: any[];
    departmentData?: SelectDataNode[];
}

interface IAppointed {
    readonly productCategoryName?: string;
    readonly productCategoryId?: string;
    readonly pattern?: string | number;
    readonly sectionNum?: number;
    readonly name?: string;
    readonly loftingUserDepartment?: string;
    readonly loftingUser?: string;
    readonly checkUserDepartment?: string;
    readonly checkUser?: string;
    readonly loftingUserDepartmentName?: string;
    readonly loftingUserName?: string;
    readonly checkUserDepartmentName?: string;
    readonly checkUserName?: string;
    readonly plannedDeliveryTime?: string | moment.Moment;
    readonly patternName?: string;
}

class TowerLoftingAssign extends React.Component<ITowerLoftingAssignRouteProps, TowerLoftingAssignState> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    
    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
    protected getForm(): FormInstance | null {
        return this.form?.current;
    }
    
    public state: TowerLoftingAssignState = {
        visible: false,
        repeatModal: false,
        user: [],
        checkUser: [],
        departmentData: [],
    }

    private modalCancel(): void {
        this.getForm()?.resetFields();
        this.setState({
            visible: false,
        })
    }

    private async modalShow(): Promise<void> {
        const data = await RequestUtil.get<IAppointed>(`/tower-science/productSegment/detail?productCategoryId=${ this.props.id }`);
        const departmentData = await RequestUtil.get<SelectDataNode[]>(`/sinzetech-user/department/tree`);
        this.setState({
            departmentData: departmentData,
            visible: true,
            appointed: data
        })
        if(this.props.type === 'edit') {
            let detailData = this.props.detailData;
            detailData = {
                ...detailData,
                plannedDeliveryTime: detailData?.plannedDeliveryTime ? moment(detailData?.plannedDeliveryTime) : ''
            }
            detailData?.loftingUserDepartment && this.onDepartmentChange(detailData?.loftingUserDepartment || '', '放样');
            detailData?.checkUserDepartment && this.onDepartmentChange(detailData?.checkUserDepartment || '', '校对');
            this.getForm()?.setFieldsValue({ ...detailData, ...data });
        }
    }
    
    /**
     * @protected
     * @description Determines whether submit on
     * @param values 
     * @returns submit 
     */
    protected onSubmit(): void {
        if (this.getForm()) {
            this.getForm()?.validateFields().then(() => {
                let values = this.getForm()?.getFieldsValue(true);
                values = {
                    ...values,
                    id: this.props.rowId,
                    plannedDeliveryTime: values?.plannedDeliveryTime && values?.plannedDeliveryTime.format('YYYY-MM-DD') + ' 00:00:00',
                    productCategoryId: this.state.appointed?.productCategoryId,
                    productCategoryName: this.state.appointed?.productCategoryName,
                    pattern: this.state.appointed?.pattern,
                    loftingUser: values.loftingUser.split('-')[0],
                    loftingUserName: values.loftingUser.split('-')[1],
                    checkUser: values.checkUser.split('-')[0],
                    checkUserName: values.checkUser.split('-')[1],
                }
                RequestUtil.post(`/tower-science/productSegment/submit`, { ...values }).then(() => {
                    message.success('指派成功');
                }).then(() => {
                    this.getForm()?.resetFields();
                    this.setState({  
                        visible: false
                    })
                    this.props.update();
                });
                return Promise.resolve();
            })
        }
    };

    /**
     * onDepartmentChange
     */
    public onDepartmentChange = async (value: string, title: string) => {
        const userData: any = await RequestUtil.get(`/sinzetech-user/user?departmentId=${ value }&size=1000`);
        let appointed = this.getForm()?.getFieldsValue(true);
        if(title === '校对'){
            this.setState({
                checkUser: userData.records,
                appointed: {
                    ...appointed,
                    checkUser: ''
                }
            })
        }
        else{
            this.setState({
                user: userData.records,
                appointed: {
                    ...appointed,
                    loftingUser: ''
                }
            })
        }
        this.getForm()?.setFieldsValue({ ...appointed })
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

    public renderTreeNodes = (data:any) => data.map((item:any) => {
        if (item.children) {
            item.disabled = true;
            return (<TreeNode key={ item.id } title={ item.title } value={ item.id } disabled={ item.disabled } className={ styles.node } >
                { this.renderTreeNodes(item.children) }
            </TreeNode>);
        }
        return <TreeNode { ...item } key={ item.id } title={ item.title } value={ item.id }/>;
    });
    
     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type={ this.props.title === "塔型放样指派" ? "primary" : 'link' } onClick={ () => this.modalShow() } ghost>{ this.props.title }</Button>
            <Modal
                visible={ this.state.visible } 
                width="60%" 
                title="塔型放样指派" 
                footer={ 
                    <Space direction="horizontal" className={ styles.bottomBtn }>
                        <Button type="ghost" onClick={ () => this.modalCancel() }>关闭</Button>
                        {this.props.type === 'detail'?null:<Button type="primary" onClick={ () => this.onSubmit() } ghost>提交</Button>}
                    </Space>
                } 
                onCancel={ () => this.modalCancel() }
            >
                <DetailContent className={ styles.modalHeight }>
                    <p>指派信息</p>
                    <Form ref={ this.form } className={ styles.descripForm }>
                        <Descriptions title="" bordered size="small" colon={ false } column={ 3 }>
                            <Descriptions.Item label="塔型">
                                { this.state.appointed?.productCategoryName }
                            </Descriptions.Item>
                            <Descriptions.Item label="模式">
                                { this.state.appointed?.patternName }
                            </Descriptions.Item>
                            { this.props.type === 'detail' ?
                                <><Descriptions.Item label="段信息">
                                    { this.props.detailData?.name || '' }
                                </Descriptions.Item>
                                <Descriptions.Item label="放样人">
                                    { this.props.detailData?.loftingUserDepartmentName || '' } - {  this.props.detailData?.loftingUserName || '' }
                                </Descriptions.Item>
                                <Descriptions.Item label="校核人">
                                    { this.props.detailData?.checkUserDepartmentName || '' } - {  this.props.detailData?.checkUserName || '' }
                                </Descriptions.Item>
                                <Descriptions.Item label="交付时间">
                                    { this.props.detailData?.plannedDeliveryTime || '' }
                                </Descriptions.Item></>
                                : <><Descriptions.Item label="段信息">
                                <Form.Item name="name" initialValue={ this.props.detailData?.name }
                                    rules={[{
                                        required: true,
                                        message: '请输入段信息'
                                    },
                                    {
                                        pattern: /^[^\s]*$/,
                                        message: '禁止输入空格',
                                    }, {
                                        pattern: /^[0-9a-zA-Z-,]*$/,
                                        message: '仅可输入数字/字母/-/,',
                                    }]}>
                                    <Input placeholder="请输入（1-3，5，ac，w）"/>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="放样人">
                                <Form.Item name="loftingUserDepartment" initialValue={ this.props.detailData?.loftingUserDepartment }
                                    rules={[{
                                        required: true,
                                        message: '请选择部门'
                                    }]} style={ { width: '50%', display: 'inline-block' } }>
                                    <TreeSelect placeholder="请选择" style={{width:'120px'}} onChange={ (value: string) => { this.onDepartmentChange(value,'放样') } } className={ styles.width200 }>
                                        { this.state.departmentData && this.renderTreeNodes(this.wrapRole2DataNode(this.state.departmentData)) }
                                    </TreeSelect>
                                </Form.Item>
                                <Form.Item name="loftingUser" initialValue={ this.props.detailData?.loftingUser }
                                    rules={[{
                                        required: true,
                                        message: '请选择人员'
                                    }]} style={ { width: '50%', display: 'inline-block' } }>
                                    <Select placeholder="请选择" style={{width:'120px'}}>
                                        { this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option key={ item.id } value={ item.id + '-' + item.name }>{ item.name }</Select.Option>
                                        }) }
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="校核人">
                                <Form.Item name="checkUserDepartment" initialValue={ this.props.detailData?.checkUserDepartment }
                                    rules={[{
                                        required: true,
                                        message: '请选择部门'
                                    }]} style={ { width: '50%', display: 'inline-block' } }>
                                    <TreeSelect placeholder="请选择" style={{width:'120px'}} onChange={ (value: any) => { this.onDepartmentChange(value, '校对') } } className={ styles.width200 }>
                                        { this.state.departmentData && this.renderTreeNodes(this.wrapRole2DataNode(this.state.departmentData)) }
                                    </TreeSelect>
                                </Form.Item>
                                <Form.Item name="checkUser" initialValue={ this.props.detailData?.checkUser }
                                    rules={[{
                                        required: true,
                                        message: '请选择人员'
                                    }]} style={ { width: '50%', display: 'inline-block' } }>
                                    <Select placeholder="请选择" style={{width:'120px'}}>
                                        { this.state?.checkUser && this.state.checkUser.map((item: any) => {
                                            return <Select.Option key={ item.id } value={ item.id + '-' + item.name }>{ item.name }</Select.Option>
                                        }) }
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="交付时间">
                                <Form.Item name="plannedDeliveryTime"
                                    rules={[{
                                        required: true,
                                        message: '请选择交付时间'
                                    }]}>
                                    <DatePicker />
                                </Form.Item>
                            </Descriptions.Item></>
                            }
                        </Descriptions>
                    </Form>
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(TowerLoftingAssign))
