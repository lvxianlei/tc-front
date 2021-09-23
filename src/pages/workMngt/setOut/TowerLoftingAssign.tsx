import React from 'react';
import { Button, Space, Modal, Input, Descriptions, Form, FormInstance, DatePicker, InputNumber } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import useRequest from '@ahooksjs/use-request';

export interface TowerLoftingAssignProps {}
export interface ITowerLoftingAssignRouteProps extends RouteComponentProps<TowerLoftingAssignProps>, WithTranslation {
    readonly id: number | string;
}

export interface TowerLoftingAssignState {
    readonly visible: boolean;
    readonly description?: string;
    readonly appointedList?: IAppointedList[];
    readonly repeatModal: boolean;
    readonly repeatNum?: number;
    readonly selectKey?: number;
}

interface IAppointedList {

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

    constructor(props: ITowerLoftingAssignRouteProps) {
        super(props)
    }

    public state: TowerLoftingAssignState = {
        visible: false,
        appointedList: [],
        repeatModal: false
    }

    private modalCancel(): void {
        this.getForm()?.resetFields();
        this.setState({
            visible: false
        })
    }

    private async modalShow(): Promise<void> {
        // const data = await RequestUtil.get(`/tower-market/bidInfo/${ this.props.id }`);
        this.setState({
            visible: true,
            appointedList: []
        })
    }

    /**
     * @protected
     * @description Determines whether submit and continue on
     */
    protected onSubmitAndContinue(): void {
        if (this.getForm()) {
            this.getForm()?.validateFields().then(() => {
                console.log(this.getForm()?.getFieldsValue())
                this.getForm()?.resetFields();
                return Promise.resolve()
            })
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
                console.log(this.getForm()?.getFieldsValue())
                this.getForm()?.resetFields();
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
            q: '',
            w: '',
            e: '',
            r: '',
            t: '',
            y: ''
        })
        this.setState({
            appointedList: appointedList
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
            appointedList: appointedList
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
                        const copyRowList = Array(this.state.repeatNum).fill({ ...copyRow, q: '' });
                        appointedList.push( ...copyRowList );
                        this.setState({
                            appointedList: appointedList,
                            repeatNum: undefined
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
                        <Button type="ghost"  onClick={ () => this.onSubmit() }>保存</Button>
                        <Button type="ghost" onClick={ () => this.onSubmitAndContinue() }>保存并提交</Button>
                    </Space>
                } 
                onCancel={ () => this.modalCancel() }
            >
                <DetailContent>
                    <p>指派信息</p>
                    <Form className={ styles.descripForm }>
                        <Descriptions title="" bordered size="small" colon={ false } column={ 9 }>
                            <Descriptions.Item label="塔型" span={ 1 }>
                                <Form.Item name="a"
                                    rules={[{
                                        required: true,
                                        message: '请输入塔型'
                                    }]}>
                                    <Input />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="模式" span={ 3 }>
                                <Form.Item name="b"
                                    rules={[{
                                        required: true,
                                        message: '请输入模式'
                                    }]}>
                                    <Input />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="段数" span={ 3 }>
                                <Form.Item name="c"
                                    rules={[{
                                        required: true,
                                        message: '请输入段数'
                                    }]}>
                                    <Input />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item children span={ 1 }></Descriptions.Item>
                            <Descriptions.Item span={ 1 }><Button type="primary" ghost size="small" onClick={ () => this.addRow() }>添加</Button></Descriptions.Item>
                            {
                                this.state.appointedList?.map((item: IAppointedList, index: number) => {
                                    return  <>  
                                        <Descriptions.Item label="段名" span={ 1 }>
                                            <Form.Item name={["appointedList", index, "q"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请输入段名'
                                                }]}>
                                                <Input />
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="放样人"  span={ 3 }>
                                            <Form.Item name={["appointedList", index, "w"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请输入放样人'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name={["appointedList", index, "e"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请输入放样人'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <Input />
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="校对人"  span={ 3 }>
                                            <Form.Item name={["appointedList", index, "r"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请输入校对人'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name={["appointedList", index, "t"]}
                                                rules={[{
                                                    required: true,
                                                    message: '请输入放样人'
                                                }]} style={ { width: '50%', display: 'inline-block' } }>
                                                <Input />
                                            </Form.Item>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="交付时间">
                                            <Form.Item name={["appointedList", index, "y"]}
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
