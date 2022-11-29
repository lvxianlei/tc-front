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
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';

export interface TowerLoftingAssignProps { }
export interface ITowerLoftingAssignRouteProps extends RouteComponentProps<TowerLoftingAssignProps>, WithTranslation {
    readonly id: number | string;
    readonly update: () => void;
    readonly type?: string;  //detail为展示，此时需传detailData
    readonly disabled?: boolean
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
    readonly fyhs?: boolean;
    readonly zhqd?: boolean;
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
    readonly loftingDeliverTime?: string | moment.Moment;
    readonly programmingDeliverTime?: string | moment.Moment;
    readonly patternName?: string;
    readonly trialAssemble?: number | string
    readonly assignPlanId?: string;
    readonly loftingMutualReview?: string;
    readonly ncUser?: string;
    readonly weldingUser?: string;
    readonly productPartUser?: string;
    readonly packageUser?: string;
    readonly legProgrammingUser?: string;
    readonly programmingLeader?: string;
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
        fyhs: false,
        zhqd: false
    }

    private modalCancel(): void {
        this.getForm()?.resetFields();
        this.setState({
            visible: false,
        })
    }

    private async modalShow(): Promise<void> {
        this.getUserList();
        const data = await RequestUtil.get<IAppointed>(`/tower-science/productCategory/${this.props.id}`);
        this.setState({
            visible: true,
            appointed: data
        })
        if (this.props.type === 'edit') {
            const detailData = {
                ...data,
                loftingDeliverTime: data?.loftingDeliverTime ? moment(data?.loftingDeliverTime) : '',
                programmingDeliverTime: data?.programmingDeliverTime ? moment(data?.programmingDeliverTime) : '',
                loftingMutualReview: data?.loftingMutualReview ? data.loftingMutualReview?.split(',') : ['0'],
                ncUser: data?.ncUser ? data.ncUser : '0',
                weldingUser: data?.weldingUser ? data.weldingUser?.split(',') : ['0'],
                productPartUser: data?.productPartUser ? data.productPartUser : '0',
                packageUser: data?.packageUser ? data.packageUser : '0',
                legProgrammingUser: data?.legProgrammingUser ? data.legProgrammingUser : '0',
                loftingUser: data?.loftingUser && data?.loftingUser?.split(',')
            }
            this.getForm()?.setFieldsValue
                ({
                    ...detailData
                });
        }
    }

    private async getUserList(): Promise<void> {
        const data = await RequestUtil.get<any>(`/tower-system/employee?deptName=技术部&size=1000`);
        this.setState({
            user: data?.records
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
                let values = this.getForm()?.getFieldsValue(true);
                values = {
                    ...values,
                    loftingDeliverTime: values?.loftingDeliverTime && values?.loftingDeliverTime.format('YYYY-MM-DD HH:mm:ss'),
                    programmingDeliverTime: values?.programmingDeliverTime && values?.programmingDeliverTime.format('YYYY-MM-DD HH:mm:ss'),
                    idList: [this.props?.id],
                    productCategoryName: this.state.appointed?.productCategoryName,
                    loftingUser: values?.loftingUser && values?.loftingUser.join(','),
                    loftingMutualReview: values.loftingMutualReview[0] === '0' ? values.loftingUser.join(',') : values.loftingMutualReview.join(','),
                    weldingUser: values.weldingUser[0] === '0' ? values.loftingMutualReview[0] === '0' ? values.loftingUser.join(',') : values.loftingMutualReview.join(',') : values.weldingUser.join(','),
                    ncUser: values.ncUser === '0' ? values.programmingLeader : values.ncUser,
                    productPartUser: values.productPartUser === '0' ? values.ncUser === '0' ? values.programmingLeader : values.ncUser : values.productPartUser,
                    packageUser: values.packageUser === '0' ? values.productPartUser === '0' ? values.ncUser === '0' ? values.programmingLeader : values.ncUser : values.productPartUser : values.packageUser,
                    legProgrammingUser: values.legProgrammingUser === '0' ? values.packageUser === '0' ? values.productPartUser === '0' ? values.ncUser === '0' ? values.programmingLeader : values.ncUser : values.productPartUser : values.packageUser : values.legProgrammingUser,
                    type: 1
                }
                RequestUtil.post(`/tower-science/productCategory/assign`, { ...values }).then(() => {
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
    * @description Renders AbstractDetailComponent
    * @returns render 
    */
    public render(): React.ReactNode {
        return <>
            <Button type="link" disabled={this.props.disabled} onClick={() => this.modalShow()}>塔型放样分派</Button>
            <Modal
                visible={this.state.visible}
                width="80%"
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
                                {this.state.appointed?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="模式">
                                <Form.Item name="pattern"
                                    rules={[{
                                        required: true,
                                        message: '请选择优先级'
                                    }]} style={{ width: '100%', display: 'inline-block' }}>
                                    <Select>
                                        {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                            return <Select.Option key={index} value={id}>
                                                {name}
                                            </Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
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
                            <Descriptions.Item label="放样员">
                                <Form.Item name="loftingUser"
                                    rules={[{
                                        required: true,
                                        message: '请选择人员'
                                    }]} style={{ width: '50%', display: 'inline-block' }}>
                                    <Select placeholder="请选择" style={{ width: '100%' }} mode="multiple" allowClear>
                                        {this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="loftingDeliverTime"
                                    rules={[{
                                        required: true,
                                        message: '请选择完成时间'
                                    }]} style={{ width: '200px', display: 'inline-block', marginLeft: '0.8%' }}>
                                    <DatePicker showTime />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="编程负责人(生产下达)">
                                <Form.Item name="programmingLeader"
                                    rules={[{
                                        required: true,
                                        message: '请选择人员'
                                    }]} style={{ width: '50%', display: 'inline-block' }}>
                                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                        {this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="programmingDeliverTime"
                                    rules={[{
                                        required: true,
                                        message: '请选择完成时间'
                                    }]} style={{ width: '200px', display: 'inline-block', marginLeft: '0.8%' }}>
                                    <DatePicker showTime />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item children={[]} />
                            <Descriptions.Item label="放样互审">
                                <Form.Item name="loftingMutualReview"
                                    rules={[{
                                        required: true,
                                        message: '请选择人员'
                                    }]} style={{ width: '50%', display: 'inline-block' }}>
                                    <Select placeholder="请选择" style={{ width: '100%' }} mode="multiple" allowClear onChange={(e: any) => {
                                        if (e.length > 0 && e?.indexOf('0') !== -1) {
                                            this.form.current?.setFieldsValue({ loftingMutualReview: ['0'] })
                                            this.setState({
                                                fyhs: true
                                            })
                                        } else {
                                            this.setState({
                                                fyhs: false
                                            })
                                        }
                                    }}>
                                        <Select.Option key={0} value={'0'}>同上</Select.Option>
                                        {this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option key={item.userId} disabled={this.state.fyhs} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="NC程序">
                                <Form.Item name="ncUser"
                                    rules={[{
                                        required: true,
                                        message: '请选择人员'
                                    }]} style={{ width: '50%', display: 'inline-block' }}>
                                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                        <Select.Option key={0} value={'0'}>同上</Select.Option>
                                        {this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item children={[]} />
                            <Descriptions.Item label="组焊清单">
                                <Form.Item name="weldingUser"
                                    rules={[{
                                        required: true,
                                        message: '请选择人员'
                                    }]} style={{ width: '50%', display: 'inline-block' }}>
                                    <Select placeholder="请选择" style={{ width: '100%' }} mode="multiple" allowClear onChange={(e: any) => {
                                        if (e.length > 0 && e?.indexOf('0') !== -1) {
                                            this.form.current?.setFieldsValue({ weldingUser: ['0'] })
                                            this.setState({
                                                zhqd: true
                                            })
                                        } else {
                                            this.setState({
                                                zhqd: false
                                            })
                                        }
                                    }}>
                                        <Select.Option key={0} value={'0'}>同上</Select.Option>
                                        {this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option key={item.userId} disabled={this.state.zhqd} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="杆塔配段">
                                <Form.Item name="productPartUser"
                                    rules={[{
                                        required: true,
                                        message: '请选择人员'
                                    }]} style={{ width: '50%', display: 'inline-block' }}>
                                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                        <Select.Option key={0} value={'0'}>同上</Select.Option>
                                        {this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item children={[]} />
                            <Descriptions.Item label="高低腿配置编制">
                                <Form.Item name="legConfigurationUser" style={{ width: '50%', display: 'inline-block' }}>
                                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                        {this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="legConfigurationNum" style={{ width: '49%', display: 'inline-block', marginLeft: '0.8%' }}>
                                    <Input disabled placeholder="自动计算" />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="包装清单">
                                <Form.Item name="packageUser"
                                    rules={[{
                                        required: true,
                                        message: '请选择人员'
                                    }]} style={{ width: '50%', display: 'inline-block' }}>
                                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                        <Select.Option key={0} value={'0'}>同上</Select.Option>
                                        {this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item children={[]} />
                            <Descriptions.Item label="高低腿配置校核">
                                <Form.Item name="legConfigurationCheckUser" style={{ width: '50%', display: 'inline-block' }}>
                                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                        {this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="legConfigurationCheckNum" style={{ width: '49%', display: 'inline-block', marginLeft: '0.8%' }}>
                                    <Input disabled placeholder="自动获取" />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item label="编程高低腿">
                                <Form.Item name="legProgrammingUser" style={{ width: '50%', display: 'inline-block' }}>
                                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                        <Select.Option key={0} value={'0'}>同上</Select.Option>
                                        {this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="legProgrammingNum" style={{ width: '49%', display: 'inline-block', marginLeft: '0.8%' }}>
                                    <Input disabled placeholder="自动获取" />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item children={[]} />
                            <Descriptions.Item label="挂线板校核">
                                <Form.Item name="hangLineBoardCheckUser" style={{ width: '50%', display: 'inline-block' }}>
                                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                        {this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option key={item.userId} value={item.userId}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="hangLineBoardCheckNum" style={{ width: '49%', display: 'inline-block', marginLeft: '0.8%' }}>
                                    <InputNumber min={1} max={9999} style={{ width: '100%' }} placeholder="请输入数量" />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item children={[]} />
                            <Descriptions.Item children={[]} />
                        </Descriptions>
                    </Form>
                </DetailContent>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(TowerLoftingAssign))
