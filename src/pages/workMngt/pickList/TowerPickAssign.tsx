import React from 'react';
import { Button, Space, Modal, Input, Descriptions, Form, FormInstance, DatePicker, InputNumber, Select, Row, Col, message } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerPickAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import TreeSelect, { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
export interface TowerPickAssignProps {}
export interface ITowerPickAssignRouteProps extends RouteComponentProps<TowerPickAssignProps>, WithTranslation {
    readonly id: number | string;
    onRefresh: () => void;
}

export interface TowerPickAssignState {
    readonly visible: boolean;
    readonly description?: string;
    readonly appointed?: IAppointed;
    readonly appointedList?: IAppointedList[];
    readonly repeatModal: boolean;
    readonly repeatNum?: number;
    readonly selectKey?: number;
    user?: any[];
    materialCheckLeader?: any[];
    departmentData?: SelectDataNode[];
}

interface IAppointed {
    readonly productCategoryName?: string;
    readonly productCategory?: string;
    readonly pattern?: string;
    readonly sectionNum?: number;
}
interface IAppointedList {
    readonly plannedDeliveryTime?: string;
    readonly id	?: string;
    readonly materialCheckLeader?: string;
    readonly materialCheckLeaderDepartment?: string;
    readonly materialCheckLeaderDepartmentName?: string;
    readonly materialCheckLeaderName?: string;
    readonly materialLeader?: string;
    readonly materialLeaderDepartment?: string;
    readonly materialLeaderDepartmentName?: string;
    readonly materialLeaderName?: string;
    readonly name?: string;
    readonly pattern?: string;
    readonly productCategoryName?: string;
    readonly productCategory?: string;
    readonly index?: number;
}
class TowerPickAssign extends React.Component<ITowerPickAssignRouteProps, TowerPickAssignState> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();
    
    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
    protected getForm(): FormInstance | null {
        return this.form?.current;
    }

    constructor(props: ITowerPickAssignRouteProps) {
        super(props)
    }

    public state: TowerPickAssignState = {
        visible: false,
        appointedList: [],
        repeatModal: false,
        user: [],
        materialCheckLeader: [],
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
                let values = {
                    drawProductSegmentList:this.getForm()?.getFieldsValue().appointedList.map((item: Record<string, any>) => {
                        return {
                            ...item,
                            plannedDeliveryTime: item?.plannedDeliveryTime && item?.plannedDeliveryTime.format('YYYY-MM-DD')+ ' 00:00:00',
                            // productCategory: this.state.appointed?.productCategory,
                            // productCategoryName: this.state.appointed?.productCategoryName,
                            // pattern: this.state.appointed?.pattern
                        }
                    }),
                    productCategoryId: this.props.id
                }
                RequestUtil.post(`/tower-science/drawProductSegment/assign`, { ...values }).then(()=>{
                    message.success('提交成功！')
                }).then(()=>{
                    this.getForm()?.resetFields();
                    this.getForm()?.setFieldsValue({
                        appointedList: []
                    });
                    this.setState({  
                        appointedList: [],
                        visible:false 
                    });
                    this.props.onRefresh()
                })
                
                return Promise.resolve()
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
            materialLeaderDepartment: '',
            materialLeader: '',
            materialCheckLeaderDepartment: '',
            materialCheckLeader: '',
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
            onOk={ () => {
                const { user, materialCheckLeader } = this.state;
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
                        materialCheckLeader && appointedList.forEach((_: any, index: number)=>{
                            materialCheckLeader[index] = materialCheckLeader[this.state.selectKey || 0]
                        })
                        this.getForm()?.setFieldsValue({
                            appointedList: appointedList
                        })
                        this.setState({
                            appointedList: appointedList,
                            repeatNum: undefined,
                            appointed: {
                                ...this.state.appointed,
                                sectionNum: (this.state.appointed?.sectionNum || 0) + (this.state.repeatNum || 0)
                            },
                            user: user,
                            materialCheckLeader:materialCheckLeader
                        })
                    })   
                }
            } }>
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
        if(title==='提料'){
            const user = this.state.materialCheckLeader||[];
            user[index] = userData.records;
            this.setState({
                user:user
            })
            const value = this.getForm()?.getFieldsValue(true).appointedList
            value[index].materialLeader = '';
            this.getForm()?.setFieldsValue({appointedList: value});
            this.setState({
                appointedList: value
            })
        }
        else{
            const user = this.state.user||[];
            user[index] = userData.records;
            this.setState({
                materialCheckLeader:user
            })
            const value = this.getForm()?.getFieldsValue(true).appointedList
            value[index].materialCheckLeader = '';
            this.getForm()?.setFieldsValue({appointedList: value});
            this.setState({
                appointedList: value
            })
        }
        
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
            <Button type="primary" onClick={ () => this.modalShow() } ghost>塔型提料指派</Button>
            <Modal
                visible={ this.state.visible } 
                width="80%" 
                title="塔型提料指派" 
                footer={ 
                    <Space direction="horizontal" className={ styles.bottomBtn }>
                        <Button type="ghost" onClick={ () => this.modalCancel() }>关闭</Button>
                        <Button type="ghost" onClick={ () => this.onSubmit() }>提交</Button>
                    </Space>
                } 
                onCancel={ () => this.modalCancel() }
            >
                <DetailContent className={ styles.modalHeight }>
                    <p>指派信息</p>
                    <Form ref={ this.form } className={ styles.descripForm }>
                        <Descriptions title="" bordered size="small" colon={ false } column={ 9 }>
                            <Descriptions.Item label="塔型" span={ 1 }>
                                { this.state.appointed?.productCategoryName }
                            </Descriptions.Item>
                            <Descriptions.Item label="模式" span={ 3 }>
                                { this.state.appointed?.pattern === '1'?'新放':this.state.appointed?.pattern === '2'?'重新出卡':'套用' }
                            </Descriptions.Item>
                            <Descriptions.Item label="段数" span={ 3 }>
                                { this.state.appointed?.sectionNum || 0 }
                            </Descriptions.Item>
                            <Descriptions.Item children span={ 1 }></Descriptions.Item>
                            <Descriptions.Item span={ 1 }><Button type="primary" ghost size="small" onClick={ () => this.addRow() }>添加</Button></Descriptions.Item>
                            {
                                this.state.appointedList?.map((item: IAppointedList, index: number) => {
                                    return  <>  
                                        <Descriptions.Item label="段名" span={ 1 }>
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
                                        <Descriptions.Item label="提料人"  span={ 3 }>
                                            <Form.Item name={["appointedList", index, "materialLeaderDepartment"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择部门'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <TreeSelect placeholder="请选择" style={{width:'100px'}} onChange={ (value: any) => { this.onDepartmentChange(value,index,'提料') } } className={ styles.width200 }>
                                                    {this.state.departmentData && this.renderTreeNodes(this.wrapRole2DataNode(this.state.departmentData)) }
                                                </TreeSelect>
                                            </Form.Item>
                                            <Form.Item name={["appointedList", index, "materialLeader"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择人员'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <Select placeholder="请选择" style={{width:'100px'}}>
                                                    { this.state?.user && this.state.user[index] && this.state.user[index].map((item: any) => {
                                                        return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                                                    }) }
                                                </Select>
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="校对人"  span={ 3 }>
                                            <Form.Item name={["appointedList", index, "materialCheckLeaderDepartment"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择部门'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <TreeSelect placeholder="请选择" style={{width:'100px'}} onChange={ (value: any) => { this.onDepartmentChange(value,index,'校对') } } className={ styles.width200 }>
                                                    {this.state.departmentData && this.renderTreeNodes(this.wrapRole2DataNode(this.state.departmentData)) }
                                                </TreeSelect>
                                            </Form.Item>
                                            <Form.Item name={["appointedList", index, "materialCheckLeader"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择人员'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <Select placeholder="请选择" style={{width:'100px'}}>
                                                    { this.state?.materialCheckLeader && this.state.materialCheckLeader[index] && this.state.materialCheckLeader[index].map((item: any) => {
                                                        return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
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
                                        <Descriptions.Item >
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

export default withRouter(withTranslation('translation')(TowerPickAssign))
