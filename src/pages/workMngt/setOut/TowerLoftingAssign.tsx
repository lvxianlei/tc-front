import React from 'react';
import { Button, Space, Modal, Input, Descriptions, Form, FormInstance, DatePicker, InputNumber, TreeSelect, Select, message } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';

export interface TowerLoftingAssignProps {}
export interface ITowerLoftingAssignRouteProps extends RouteComponentProps<TowerLoftingAssignProps>, WithTranslation {
    readonly id: number | string;
    readonly update: () => void;
}

export interface TowerLoftingAssignState {
    readonly visible: boolean;
    readonly description?: string;
    readonly appointed?: IAppointed;
    readonly appointedList?: IAppointedList[];
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
}
interface IAppointedList {
    readonly plannedDeliveryTime?: string;
    readonly id	?: string;
    readonly checkUser?: string;
    readonly checkUserDepartment?: string;
    readonly checkUserDepartmentName?: string;
    readonly checkUserName?: string;
    readonly loftingUser?: string;
    readonly loftingUserDepartment?: string;
    readonly loftingUserDepartmentName?: string;
    readonly loftingUserName?: string;
    readonly name?: string;
    readonly pattern?: string;
    readonly productCategoryName?: string;
    readonly productCategoryId?: string;
    readonly index?: number;
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
        appointedList: [],
        repeatModal: false,
        user: [],
        checkUser: [],
        departmentData: [],
    }

    private modalCancel(): void {
        this.getForm()?.setFieldsValue({
            appointedList: []
        })
        this.getForm()?.resetFields();
        this.setState({
            visible: false,
            appointedList: []
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
                let values = this.getForm()?.getFieldsValue().appointedList;
                if(values){
                    values = values.map((item: Record<string, any>) => {
                        return {
                            ...item,
                            plannedDeliveryTime: item?.plannedDeliveryTime && item?.plannedDeliveryTime.format('YYYY-MM-DD') + ' 00:00:00',
                            productCategoryId: this.state.appointed?.productCategoryId,
                            productCategoryName: this.state.appointed?.productCategoryName,
                            pattern: this.state.appointed?.pattern,
                            loftingUser: item.loftingUser.split('-')[0],
                            loftingUserName: item.loftingUser.split('-')[1],
                            checkUser: item.checkUser.split('-')[0],
                            checkUserName: item.checkUser.split('-')[1],
                        }
                    })
                    RequestUtil.post(`/tower-science/productSegment/submit`, [ ...values ]).then(() => {
                        message.success('指派成功');
                    }).then(() => {
                        this.getForm()?.resetFields();
                        this.getForm()?.setFieldsValue({
                            appointedList: []
                        });
                        this.setState({  
                            appointedList: [],
                            visible: false
                        })
                        this.props.update();
                    });
                } else {
                    message.error('当前暂无指派数据，不可提交！')
                }
                return Promise.resolve();
            })
        }
    };

    /**
     * @protected
     * @description 添加一行
     * @param values 
     */
    protected addRow(): void {
        let appointedList: IAppointedList[] = this.getForm()?.getFieldsValue(true).appointedList || [];
        appointedList.push({
            index: appointedList.length + 1,
            name: '',
            loftingUserDepartment: '',
            loftingUser: '',
            checkUserDepartment: '',
            checkUser: '',
            plannedDeliveryTime: ''
        })
        this.setState({
            appointedList: appointedList,
            appointed: {
                ...this.state.appointed,
                sectionNum: (this.state.appointed?.sectionNum || 0) + 1
            }
        })
        this.getForm()?.setFieldsValue({
            appointedList: appointedList
        })
    };

    /**
     * @protected
     * @description 删除一行
     * @param values 
     */
    protected deleteRow(index: number): void {
        let appointedList: IAppointedList[] = this.getForm()?.getFieldsValue(true).appointedList || [];
        appointedList.splice(index, 1);
        this.setState({
            appointedList: appointedList,
            appointed: {
                ...this.state.appointed,
                sectionNum: (this.state.appointed?.sectionNum || 0) - 1
            }
        })
        this.getForm()?.setFieldsValue({
            appointedList: appointedList
        })
    };

    protected repeatAdd = () => {
        const { user, checkUser } = this.state;
        if(this.state.repeatNum && this.state.repeatNum > 0) {
            this.setState({ 
                repeatModal: false
            }, () => {
                let appointedList: IAppointedList[] = this.getForm()?.getFieldsValue(true).appointedList || [];
                const copyRow: IAppointedList = this.getForm()?.getFieldsValue(true).appointedList[this.state.selectKey || 0];
                const copyRowList = Array(this.state.repeatNum).fill({ ...copyRow, name: '' });
                appointedList.push( ...copyRowList );
                user && appointedList.forEach((_: any, index: number)=>{
                    user[index] = user[this.state.selectKey || 0]
                })
                checkUser && appointedList.forEach((_: any, index: number)=>{
                    checkUser[index] = checkUser[this.state.selectKey || 0]
                })
                this.setState({
                    appointedList: appointedList,
                    repeatNum: undefined,
                    appointed: {
                        ...this.state.appointed,
                        sectionNum: (this.state.appointed?.sectionNum || 0) + (this.state.repeatNum || 0)
                    },
                    user: user,
                    checkUser: checkUser
                })
                this.getForm()?.setFieldsValue({
                    appointedList: appointedList
                })
            })   
        }
    }
    
    /**
     * @description Gets primary operation button
     * @returns primary operation button
     */
     protected getRepeatModal(): React.ReactNode {
        return <Modal 
            title="重复添加"
            visible={ this.state.repeatModal } 
            onCancel={ () => { 
                this.setState({ 
                    repeatModal: false,
                    repeatNum: undefined
                }) 
            } } 
            onOk={ () => this.repeatAdd()  }>
            <InputNumber value={ this.state.repeatNum } min={ 1 } step={ 1 } style={{ width: '100%' }} placeholder="请输入重复添加的行数" onChange={ (e) => {
                this.setState({
                    repeatNum: e
                })
            } } />
        </Modal>
    }
    /**
     * onDepartmentChange
     */
    public onDepartmentChange = async (value: Record<string, any>, index: number, title: string) => {
        const userData: any = await RequestUtil.get(`/sinzetech-user/user?departmentId=${ value }&size=1000`);
        let appointedList = this.getForm()?.getFieldsValue(true).appointedList;
        if(title === '校对'){
            const user = this.state.checkUser||[];
            user[index] = userData.records;
            this.setState({
                checkUser: user
            })
            appointedList[index] = {
                ...appointedList[index],
                checkUser: ''
            }
        }
        else{
            const user = this.state.user||[];
            user[index] = userData.records;
            this.setState({
                user: user
            })
            appointedList[index] = {
                ...appointedList[index],
                loftingUser: ''
            }
        }
        this.setState({
            appointedList: [...appointedList]
        })
        this.getForm()?.setFieldsValue({ appointedList: [...appointedList] })
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
            <Button type="primary" onClick={ () => this.modalShow() } ghost>塔型放样指派</Button>
            <Modal
                visible={ this.state.visible } 
                width="90%" 
                title="塔型放样指派" 
                footer={ 
                    <Space direction="horizontal" className={ styles.bottomBtn }>
                        <Button type="ghost" onClick={ () => this.modalCancel() }>关闭</Button>
                        <Button type="primary" onClick={ () => this.onSubmit() } ghost>提交</Button>
                    </Space>
                } 
                onCancel={ () => this.modalCancel() }
            >
                <DetailContent className={ styles.modalHeight }>
                    <p>指派信息</p>
                    <Form ref={ this.form } className={ styles.descripForm }>
                        <Descriptions title="" bordered size="small" colon={ false } column={ 5 }>
                            <Descriptions.Item label="塔型">
                                { this.state.appointed?.productCategoryName }
                            </Descriptions.Item>
                            <Descriptions.Item label="模式">
                                { this.state.appointed?.pattern === 1 ? '新放' :  this.state.appointed?.pattern === 2 ? '重新出卡' : '套用' }
                            </Descriptions.Item>
                            <Descriptions.Item label="段数">
                                { this.state.appointed?.sectionNum || 0 }
                            </Descriptions.Item>
                            <Descriptions.Item children></Descriptions.Item>
                            <Descriptions.Item><Button type="primary" ghost size="small" onClick={ () => this.addRow() }>添加</Button></Descriptions.Item>
                            {
                                this.state.appointedList?.map((item: IAppointedList, index: number) => {
                                    return  <>  
                                        <Descriptions.Item label="段名">
                                            <Form.Item name={["appointedList", index, "name"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请输入段名'
                                                },
                                                {
                                                  pattern: /^[^\s]*$/,
                                                  message: '禁止输入空格',
                                                }]}>
                                                <Input />
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="放样人">
                                            <Form.Item name={["appointedList", index, "loftingUserDepartment"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择部门'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <TreeSelect placeholder="请选择" style={{width:'120px'}} onChange={ (value: any) => { this.onDepartmentChange(value,index,'放样') } } className={ styles.width200 }>
                                                    { this.state.departmentData && this.renderTreeNodes(this.wrapRole2DataNode(this.state.departmentData)) }
                                                </TreeSelect>
                                            </Form.Item>
                                            <Form.Item name={["appointedList", index, "loftingUser"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择人员'
                                                }]} style={ { width: '50%', display: 'inline-block' } } key={ index }>
                                                <Select placeholder="请选择" style={{width:'120px'}} key={ index }>
                                                    { this.state?.user && this.state.user[index] && this.state.user[index].map((item: any) => {
                                                        return <Select.Option key={ item.id } value={ item.id + '-' + item.name }>{ item.name }</Select.Option>
                                                    }) }
                                                </Select>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="校核人">
                                            <Form.Item name={["appointedList", index, "checkUserDepartment"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择部门'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <TreeSelect placeholder="请选择" style={{width:'120px'}} onChange={ (value: any) => { this.onDepartmentChange(value,index,'校对') } } className={ styles.width200 }>
                                                    { this.state.departmentData && this.renderTreeNodes(this.wrapRole2DataNode(this.state.departmentData)) }
                                                </TreeSelect>
                                            </Form.Item>
                                            <Form.Item name={["appointedList", index, "checkUser"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择人员'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <Select placeholder="请选择" style={{width:'120px'}} key={ index }>
                                                    { this.state?.checkUser && this.state.checkUser[index] && this.state.checkUser[index].map((item: any) => {
                                                        return <Select.Option key={ item.id } value={ item.id + '-' + item.name }>{ item.name }</Select.Option>
                                                    }) }
                                                </Select>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="交付时间">
                                            <Form.Item name={["appointedList", index, "plannedDeliveryTime"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择交付时间'
                                                }]}>
                                                <DatePicker />
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item>
                                            <Space direction="horizontal">
                                                <Button type="primary" ghost size="small" onClick={ () => this.setState({ repeatModal: true, selectKey: index }) }>重复添加</Button>
                                                <Button type="ghost" size="small" onClick={ () => this.deleteRow(index) }>删除</Button>
                                            </Space>
                                        </Descriptions.Item>
                                    </>
                                })
                            }
                        </Descriptions>
                    </Form>
                </DetailContent>
                { this.getRepeatModal() }
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(TowerLoftingAssign))
