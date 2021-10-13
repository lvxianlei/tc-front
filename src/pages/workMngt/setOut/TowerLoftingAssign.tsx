import React from 'react';
import { Button, Space, Modal, Input, Descriptions, Form, FormInstance, DatePicker, InputNumber } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

export interface TowerLoftingAssignProps {}
export interface ITowerLoftingAssignRouteProps extends RouteComponentProps<TowerLoftingAssignProps>, WithTranslation {
    readonly id: number | string;
}

export interface TowerLoftingAssignState {
    readonly visible: boolean;
    readonly description?: string;
    readonly appointed?: IAppointed;
    readonly appointedList?: IAppointedList[];
    readonly repeatModal: boolean;
    readonly repeatNum?: number;
    readonly selectKey?: number;
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
    readonly productCategory?: string;
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
        repeatModal: false
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
        this.setState({
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
                values = values.map((item: Record<string, any>) => {
                    return {
                        ...item,
                        plannedDeliveryTime: item?.plannedDeliveryTime && item?.plannedDeliveryTime.format('YYYY-MM-DD'),
                        productCategory: this.state.appointed?.productCategory,
                        productCategoryName: this.state.appointed?.productCategoryName,
                        pattern: this.state.appointed?.pattern
                    }
                })
                RequestUtil.post(`/tower-science/productSegment/submit`, { ...values })
                this.getForm()?.resetFields();
                this.getForm()?.setFieldsValue({
                    appointedList: []
                });
                this.setState({  
                    appointedList: []
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
                if(this.state.repeatNum && this.state.repeatNum > 0) {
                  this.setState({ 
                        repeatModal: false
                    }, () => {
                        let appointedList: IAppointedList[] = this.getForm()?.getFieldsValue(true).appointedList || [];
                        const copyRow: IAppointedList = this.getForm()?.getFieldsValue(true).appointedList[this.state.selectKey || 0];
                        const copyRowList = Array(this.state.repeatNum).fill({ ...copyRow, name: '' });
                        appointedList.push( ...copyRowList );
                        this.setState({
                            appointedList: appointedList,
                            repeatNum: undefined,
                            appointed: {
                                ...this.state.appointed,
                                sectionNum: (this.state.appointed?.sectionNum || 0) + (this.state.repeatNum || 0)
                            }
                        })
                        this.getForm()?.setFieldsValue({
                            appointedList: appointedList
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
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="primary" onClick={ () => this.modalShow() } ghost>塔型放样指派</Button>
            <Modal
                visible={ this.state.visible } 
                width="80%" 
                title="塔型放样指派" 
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
                                { this.state.appointed?.pattern }
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
                                                }]}>
                                                <Input />
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="放样人"  span={ 3 }>
                                            <Form.Item name={["appointedList", index, "loftingUserDepartment"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择部门'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name={["appointedList", index, "loftingUser"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择人员'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <Input />
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="校对人"  span={ 3 }>
                                            <Form.Item name={["appointedList", index, "checkUserDepartment"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择部门'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name={["appointedList", index, "checkUser"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请选择人员'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <Input />
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

export default withRouter(withTranslation('translation')(TowerLoftingAssign))
