/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-塔型信息-塔型放样分派
 */

import React from 'react';
import { Button, Space, Modal, Input, Descriptions, Form, FormInstance, DatePicker, Select, message, InputNumber } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import moment from 'moment';

export interface TowerLoftingAssignProps { }
export interface ITowerLoftingAssignRouteProps extends RouteComponentProps<TowerLoftingAssignProps>, WithTranslation {
    readonly id: number | string;
    readonly update: () => void;
    readonly title: string;
    readonly state?: number
    readonly type?: string;  //detail为展示，此时需传detailData
    readonly detailData?: IAppointed;
    readonly rowId?: string;
    readonly patternName?: string;
}

export interface TowerLoftingAssignState {
    readonly visible: boolean;
    readonly description?: string;
    readonly appointed?: IAppointed;
    readonly repeatModal: boolean;
    readonly repeatNum?: number;
    readonly selectKey?: number;
    readonly user?: any[];
    readonly checkUser?: any[];
    time: any;
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
    readonly trialAssemble?: number | string
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
        time: '',
    }

    private modalCancel(): void {
        this.getForm()?.resetFields();
        this.setState({
            visible: false,
        })
    }

    private async modalShow(): Promise<void> {
        const data = await RequestUtil.get<IAppointed>(`/tower-science/productSegment/${this.props.id}`);
        this.setState({
            visible: true,
            appointed: data,
            time: moment(data?.plannedDeliveryTime)
        })
        if (this.props.type === 'edit') {
            let detailData = this.props.detailData;
            console.log(detailData)
            detailData = {
                ...detailData,
                ...data,
                plannedDeliveryTime: detailData?.plannedDeliveryTime ? moment(detailData?.plannedDeliveryTime) : '',
            }
            detailData?.loftingUserDepartment && this.onDepartmentChange(detailData?.loftingUserDepartment || '', '放样');
            detailData?.checkUserDepartment && this.onDepartmentChange(detailData?.checkUserDepartment || '', '校对');
            this.getForm()?.setFieldsValue({ ...detailData, plannedDeliveryTime: detailData?.plannedDeliveryTime ? moment(detailData?.plannedDeliveryTime) : '', trialAssemble: this.props.detailData?.trialAssemble });
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
                    plannedDeliveryTime: values?.plannedDeliveryTime && values?.plannedDeliveryTime.format('YYYY-MM-DD HH:mm:ss'),
                    productCategoryId: this.state.appointed?.productCategoryId,
                    productCategoryName: this.state.appointed?.productCategoryName,
                    pattern: this.state.appointed?.pattern,
                    loftingUser: values.loftingUser.split('-')[0],
                    loftingUserName: values.loftingUser.split('-')[1],
                    checkUser: values.checkUser.split('-')[0],
                    checkUserName: values.checkUser.split('-')[1],
                }
                RequestUtil.post(`/tower-science/productSegment`, { ...values }).then(() => {
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
        const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${value}&size=1000`);
        let appointed = this.getForm()?.getFieldsValue(true);
        if (title === '校对') {
            this.setState({
                checkUser: userData.records,
                appointed: {
                    ...appointed,
                    checkUser: ''
                }
            })
        }
        else {
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

    /**
    * @description Renders AbstractDetailComponent
    * @returns render 
    */
    public render(): React.ReactNode {
        return <>
            <Button type={this.props.title === "塔型放样分派" ? "primary" : 'link'} onClick={() => this.modalShow()} ghost>{this.props.title}</Button>
            <Modal
                visible={this.state.visible}
                width="60%"
                title="塔型放样分派"
                footer={
                    <Space direction="horizontal" className={styles.bottomBtn}>
                        <Button type="ghost" onClick={() => this.modalCancel()}>关闭</Button>
                        {this.props.type === 'detail' ? null : <Button type="primary" onClick={() => this.onSubmit()} ghost>提交</Button>}
                    </Space>
                }
                onCancel={() => this.modalCancel()}
            >
                <DetailContent className={styles.modalHeight}>
                    <Form ref={this.form} className={styles.descripForm}>
                        <Descriptions title="" bordered size="small" colon={false} column={3}>
                            <Descriptions.Item label="塔型">
                                {this.state.appointed?.productCategoryName}
                            </Descriptions.Item>
                            <Descriptions.Item label="模式">
                                {this.props.patternName || this.state.appointed?.patternName}
                            </Descriptions.Item>
                            <Descriptions.Item label="优先级*">
                                <Form.Item name="priority"
                                    rules={[{
                                        required: true,
                                        message: '请选择优先级'
                                    }]} style={{ width: '100%', display: 'inline-block' }}>
                                    <Select placeholder="请选择" style={{ width: '120px' }}>
                                        <Select.Option value={1} key={1}>紧急</Select.Option>
                                        <Select.Option value={2} key={2}>高</Select.Option>
                                        <Select.Option value={3} key={3}>中</Select.Option>
                                        <Select.Option value={4} key={4}>低</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            {this.props.type === 'detail' ?
                                <>
                                    <Descriptions.Item label="试组装">
                                        {this.props.detailData?.trialAssemble === 1 ? '是' : '否' || ''}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="段信息">
                                        {this.props.detailData?.name || ''}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="放样人">
                                        {this.props.detailData?.loftingUserDepartmentName || ''} - {this.props.detailData?.loftingUserName || ''}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="校核人">
                                        {this.props.detailData?.checkUserDepartmentName || ''} - {this.props.detailData?.checkUserName || ''}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="交付时间">
                                        {this.props.detailData?.plannedDeliveryTime || ''}
                                    </Descriptions.Item>
                                </>
                                : <>
                                    <Descriptions.Item label="放样员">
                                        <Form.Item name="loftingUser" initialValue={this.props.detailData?.loftingUser}
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]} style={{ width: '50%', display: 'inline-block' }}>
                                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                                {this.state?.user && this.state.user.map((item: any) => {
                                                    return <Select.Option key={item.userId} value={item.userId + '-' + item.name}>{item.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="loftingUser" initialValue={this.props.detailData?.loftingUser}
                                            rules={[{
                                                required: true,
                                                message: '请选择完成时间'
                                            }]} style={{ width: '49%', display: 'inline-block', marginLeft: '0.8%' }}>
                                            <DatePicker showTime />
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="编程负责人(生产下达)">
                                        <Form.Item name="loftingUser" initialValue={this.props.detailData?.loftingUser}
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]} style={{ width: '50%', display: 'inline-block' }}>
                                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                                {this.state?.user && this.state.user.map((item: any) => {
                                                    return <Select.Option key={item.userId} value={item.userId + '-' + item.name}>{item.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="loftingUser" initialValue={this.props.detailData?.loftingUser}
                                            rules={[{
                                                required: true,
                                                message: '请选择完成时间'
                                            }]} style={{ width: '49%', display: 'inline-block', marginLeft: '0.8%' }}>
                                            <DatePicker showTime />
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item children={[]} />
                                    <Descriptions.Item label="放样互审">
                                        <Form.Item name="loftingUser" initialValue={0}
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]} style={{ width: '50%', display: 'inline-block' }}>
                                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                                <Select.Option key={0} value={0}>同上</Select.Option>
                                                {this.state?.user && this.state.user.map((item: any) => {
                                                    return <Select.Option key={item.userId} value={item.userId + '-' + item.name}>{item.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="NC程序">
                                        <Form.Item name="loftingUser" initialValue={0}
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]} style={{ width: '50%', display: 'inline-block' }}>
                                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                                <Select.Option key={0} value={0}>同上</Select.Option>
                                                {this.state?.user && this.state.user.map((item: any) => {
                                                    return <Select.Option key={item.userId} value={item.userId + '-' + item.name}>{item.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item children={[]} />
                                    <Descriptions.Item label="组焊清单">
                                        <Form.Item name="loftingUser" initialValue={0}
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]} style={{ width: '50%', display: 'inline-block' }}>
                                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                                <Select.Option key={0} value={0}>同上</Select.Option>
                                                {this.state?.user && this.state.user.map((item: any) => {
                                                    return <Select.Option key={item.userId} value={item.userId + '-' + item.name}>{item.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="杆塔配段">
                                        <Form.Item name="loftingUser" initialValue={0}
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]} style={{ width: '50%', display: 'inline-block' }}>
                                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                                <Select.Option key={0} value={0}>同上</Select.Option>
                                                {this.state?.user && this.state.user.map((item: any) => {
                                                    return <Select.Option key={item.userId} value={item.userId + '-' + item.name}>{item.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item children={[]} />
                                    <Descriptions.Item label="高低腿配置编制">
                                        <Form.Item name="loftingUser" initialValue={0} style={{ width: '50%', display: 'inline-block' }}>
                                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                                {this.state?.user && this.state.user.map((item: any) => {
                                                    return <Select.Option key={item.userId} value={item.userId + '-' + item.name}>{item.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="loftingUser" initialValue={this.props.detailData?.loftingUser}
                                            rules={[{
                                                required: true,
                                                message: '请选择完成时间'
                                            }]} style={{ width: '49%', display: 'inline-block', marginLeft: '0.8%' }}>
                                            <Input disabled placeholder="自动计算" />
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="包装清单">
                                        <Form.Item name="loftingUser" initialValue={0}
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]} style={{ width: '50%', display: 'inline-block' }}>
                                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                                <Select.Option key={0} value={0}>同上</Select.Option>
                                                {this.state?.user && this.state.user.map((item: any) => {
                                                    return <Select.Option key={item.userId} value={item.userId + '-' + item.name}>{item.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item children={[]} />
                                    <Descriptions.Item label="高低腿配置校核">
                                        <Form.Item name="loftingUser" initialValue={0} style={{ width: '50%', display: 'inline-block' }}>
                                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                                {this.state?.user && this.state.user.map((item: any) => {
                                                    return <Select.Option key={item.userId} value={item.userId + '-' + item.name}>{item.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="loftingUser" initialValue={this.props.detailData?.loftingUser}
                                            rules={[{
                                                required: true,
                                                message: '请选择完成时间'
                                            }]} style={{ width: '49%', display: 'inline-block', marginLeft: '0.8%' }}>
                                            <Input disabled placeholder="自动获取" />
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="编程高低腿">
                                        <Form.Item name="loftingUser" initialValue={0} style={{ width: '50%', display: 'inline-block' }}>
                                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                                <Select.Option key={0} value={0}>同上</Select.Option>
                                                {this.state?.user && this.state.user.map((item: any) => {
                                                    return <Select.Option key={item.userId} value={item.userId + '-' + item.name}>{item.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="loftingUser" initialValue={this.props.detailData?.loftingUser}
                                            rules={[{
                                                required: true,
                                                message: '请选择完成时间'
                                            }]} style={{ width: '49%', display: 'inline-block', marginLeft: '0.8%' }}>
                                            <Input disabled placeholder="自动获取" />
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item children={[]} />
                                    <Descriptions.Item label="挂线板校核">
                                        <Form.Item name="loftingUser" initialValue={0} style={{ width: '50%', display: 'inline-block' }}>
                                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                                {this.state?.user && this.state.user.map((item: any) => {
                                                    return <Select.Option key={item.userId} value={item.userId + '-' + item.name}>{item.name}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="loftingUser" initialValue={this.props.detailData?.loftingUser} style={{ width: '49%', display: 'inline-block', marginLeft: '0.8%' }}>
                                            <InputNumber min={1} max={9999} placeholder="请输入数量" />
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item children={[]} />
                                    <Descriptions.Item children={[]} />
                                </>
                            }
                        </Descriptions>
                    </Form>
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(TowerLoftingAssign))
