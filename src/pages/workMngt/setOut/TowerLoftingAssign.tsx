/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-塔型信息-塔型放样分派
 */

import React from 'react';
import { Button, Space, Modal, Input, Descriptions, Form, FormInstance, DatePicker, Select, message, InputNumber, Row, Col, Checkbox } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerLoftingAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import moment from 'moment';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';
import SelectUser from '../../common/SelectUser';

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
}

interface IAppointed {
    readonly productCategoryName?: string;
    readonly productCategoryId?: string;
    readonly pattern?: string | number;
    readonly sectionNum?: number;
    readonly name?: string;
    readonly loftingUser?: any;
    readonly checkUser?: string;
    readonly loftingUserName?: string;
    readonly checkUserName?: string;
    readonly loftingDeliverTime?: string | moment.Moment;
    readonly programmingDeliverTime?: string | moment.Moment;
    readonly patternName?: string;
    readonly trialAssemble?: number | string
    readonly assignPlanId?: string;
    readonly loftingMutualReview?: any;
    readonly loftingMutualReviewName?: string;
    readonly ncUser?: string;
    readonly ncUserName?: string;
    readonly weldingUser?: any;
    readonly weldingUserName?: string;
    readonly productPartUser?: string;
    readonly productPartUserName?: string;
    readonly packageUser?: string;
    readonly packageUserName?: string;
    readonly legProgrammingUser?: string;
    readonly legProgrammingUserName?: string;
    readonly programmingLeader?: string;
    readonly programmingLeaderName?: string;
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
        repeatModal: false
    }

    private modalCancel(): void {
        this.getForm()?.resetFields();
        this.setState({
            visible: false,
        })
    }

    private async modalShow(): Promise<void> {
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
                loftingMutualReview: data?.loftingMutualReview ? data.loftingMutualReview?.split(',') : '0',
                loftingMutualReviewName: data?.loftingMutualReview ? data?.loftingMutualReviewName : '同上',
                ncUser: data?.ncUser ? data.ncUser : '0',
                ncUserName: data?.ncUser ? data.ncUserName : '同上',
                weldingUser: data?.weldingUser ? data.weldingUser?.split(',') : '0',
                weldingUserName: data?.weldingUser ? data.weldingUserName : '同上',
                productPartUser: data?.productPartUser ? data.productPartUser : '0',
                productPartUserName: data?.productPartUser ? data.productPartUserName : '同上',
                packageUser: data?.packageUser ? data.packageUser : '0',
                packageUserName: data?.packageUser ? data.packageUserName : '同上',
                legProgrammingUser: data?.legProgrammingUser ? data.legProgrammingUser : '0',
                legProgrammingUserName: data?.legProgrammingUser ? data.legProgrammingUserName : '同上',
                loftingUser: data?.loftingUser && data?.loftingUser?.split(',')
            }
            this.getForm()?.setFieldsValue({ ...detailData });
            this.setState({
                appointed: { ...detailData }
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

    private checkChange(checked: boolean, id: string, name: string): void {
        if (checked) {
            this.setState({
                appointed: {
                    ...this.state.appointed,
                    [id]: '0'
                }
            })
            this.form?.current?.setFieldsValue({
                [id]: '0',
                [name]: '同上'
            })
        } else {
            this.setState({
                appointed: {
                    ...this.state.appointed,
                    [id]: ''
                }
            })
            this.form?.current?.setFieldsValue({
                [id]: '',
                [name]: ''
            })
        }
    }

    /**
    * @description Renders AbstractDetailComponent
    * @returns render 
    */
    public render(): React.ReactNode {
        return <>
            <Button type="text" disabled={this.props.disabled} onClick={() => this.modalShow()}>塔型放样分派</Button>
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
                                <Row gutter={12}>
                                    <Col span={14}>
                                        <Form.Item name="loftingUserName"
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]}>
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'loftingUser'} selectType="checkbox" selectedKey={this.form?.current?.getFieldsValue(true)?.loftingUser} onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form?.current?.setFieldsValue({
                                                        loftingUser: selectedRows.map((res: any) => res?.userId),
                                                        loftingUserName: selectedRows.map((res: any) => res?.name)?.join(',')
                                                    })
                                                    this.setState({
                                                        appointed: {
                                                            ...this.form?.current?.getFieldsValue(true),
                                                            loftingUser: selectedRows.map((res: any) => res?.userId),
                                                            loftingUserName: selectedRows.map((res: any) => res?.name)?.join(',')
                                                        }
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item name="loftingDeliverTime"
                                            rules={[{
                                                required: true,
                                                message: '请选择完成时间'
                                            }]}>
                                            <DatePicker showTime />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Descriptions.Item>
                            <Descriptions.Item label="编程负责人(生产下达)">
                                <Row gutter={12}>
                                    <Col span={14}>
                                        <Form.Item name="programmingLeaderName"
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]}>
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'programmingLeader'} selectedKey={[this.form?.current?.getFieldsValue(true)?.programmingLeader]} onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form?.current?.setFieldsValue({
                                                        programmingLeader: selectedRows[0]?.userId,
                                                        programmingLeaderName: selectedRows[0]?.name
                                                    })
                                                    this.setState({
                                                        appointed: {
                                                            ...this.form?.current?.getFieldsValue(true),
                                                            programmingLeader: selectedRows[0]?.userId,
                                                            programmingLeaderName: selectedRows[0]?.name
                                                        }
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item name="programmingDeliverTime"
                                            rules={[{
                                                required: true,
                                                message: '请选择完成时间'
                                            }]}>
                                            <DatePicker showTime />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Descriptions.Item>
                            <Descriptions.Item children={[]} />
                            <Descriptions.Item label="放样互审">
                                <Row gutter={12}>
                                    <Col span={14}>
                                        <Form.Item name="loftingMutualReviewName"
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]}>
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'loftingMutualReview'} selectType="checkbox" selectedKey={this.form?.current?.getFieldsValue(true)?.loftingMutualReview} onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form?.current?.setFieldsValue({
                                                        loftingMutualReview: selectedRows.map((res: any) => res?.userId),
                                                        loftingMutualReviewName: selectedRows.map((res: any) => res?.name)?.join(',')
                                                    })
                                                    this.setState({
                                                        appointed: {
                                                            ...this.form?.current?.getFieldsValue(true),
                                                            loftingMutualReview: selectedRows.map((res: any) => res?.userId),
                                                            loftingMutualReviewName: selectedRows.map((res: any) => res?.name)?.join(',')
                                                        }
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Checkbox onChange={(check) => {
                                            this.checkChange(check.target.checked, 'loftingMutualReview', 'loftingMutualReviewName')
                                        }} checked={this?.state?.appointed?.loftingMutualReview === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Descriptions.Item>
                            <Descriptions.Item label="NC程序">
                                <Row gutter={12}>
                                    <Col span={14}>
                                        <Form.Item name="ncUserName"
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]}>
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'ncUser'} selectedKey={[this.form?.current?.getFieldsValue(true)?.ncUser]} onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form?.current?.setFieldsValue({
                                                        ncUser: selectedRows[0]?.userId,
                                                        ncUserName: selectedRows[0]?.name
                                                    })
                                                    this.setState({
                                                        appointed: {
                                                            ...this.form?.current?.getFieldsValue(true),
                                                            ncUser: selectedRows[0]?.userId,
                                                            ncUserName: selectedRows[0]?.name
                                                        }
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Checkbox onChange={(check) => {
                                            this.checkChange(check.target.checked, 'ncUser', 'ncUserName')
                                        }} checked={this?.state?.appointed?.ncUser === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Descriptions.Item>
                            <Descriptions.Item children={[]} />
                            <Descriptions.Item label="组焊清单">
                                <Row gutter={12}>
                                    <Col span={14}>
                                        <Form.Item name="weldingUserName"
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]}>
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'weldingUser'} selectType='checkbox' selectedKey={this.form?.current?.getFieldsValue(true)?.weldingUser} onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form?.current?.setFieldsValue({
                                                        weldingUser: selectedRows.map((res: any) => res?.userId),
                                                        weldingUserName: selectedRows.map((res: any) => res?.name)?.join(',')
                                                    })
                                                    this.setState({
                                                        appointed: {
                                                            ...this.form?.current?.getFieldsValue(true),
                                                            weldingUser: selectedRows.map((res: any) => res?.userId),
                                                            weldingUserName: selectedRows.map((res: any) => res?.name)?.join(',')
                                                        }
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Checkbox onChange={(check) => {
                                            this.checkChange(check.target.checked, 'weldingUser', 'weldingUserName')
                                        }} checked={this?.state?.appointed?.weldingUser === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Descriptions.Item>
                            <Descriptions.Item label="杆塔配段">
                                <Row gutter={12}>
                                    <Col span={14}>
                                        <Form.Item name="productPartUserName"
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]}>
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'productPartUser'} selectedKey={[this.form?.current?.getFieldsValue(true)?.productPartUser]} onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form?.current?.setFieldsValue({
                                                        productPartUser: selectedRows[0]?.userId,
                                                        productPartUserName: selectedRows[0]?.name
                                                    })
                                                    this.setState({
                                                        appointed: {
                                                            ...this.form?.current?.getFieldsValue(true),
                                                            productPartUser: selectedRows[0]?.userId,
                                                            productPartUserName: selectedRows[0]?.name
                                                        }
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Checkbox onChange={(check) => {
                                            this.checkChange(check.target.checked, 'productPartUser', 'productPartUserName')
                                        }} checked={this?.state?.appointed?.productPartUser === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Descriptions.Item>
                            <Descriptions.Item children={[]} />
                            <Descriptions.Item label="高低腿配置编制">
                                <Row gutter={12}>
                                    <Col span={14}>
                                        <Form.Item name="legConfigurationUserName">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'legConfigurationUser'} selectedKey={[this.form?.current?.getFieldsValue(true)?.legConfigurationUser]} onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form?.current?.setFieldsValue({
                                                        legConfigurationUser: selectedRows[0]?.userId,
                                                        legConfigurationUserName: selectedRows[0]?.name
                                                    })
                                                    this.setState({
                                                        appointed: {
                                                            ...this.form?.current?.getFieldsValue(true),
                                                            legConfigurationUser: selectedRows[0]?.userId,
                                                            legConfigurationUserName: selectedRows[0]?.name
                                                        }
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item name="legConfigurationNum">
                                            <Input disabled placeholder="自动计算" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Descriptions.Item>
                            <Descriptions.Item label="包装清单">
                                <Row gutter={12}>
                                    <Col span={14}>
                                        <Form.Item name="packageUserName"
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]}>
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'packageUser'} selectedKey={[this.form?.current?.getFieldsValue(true)?.packageUser]} onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form?.current?.setFieldsValue({
                                                        packageUser: selectedRows[0]?.userId,
                                                        packageUserName: selectedRows[0]?.name
                                                    })
                                                    this.setState({
                                                        appointed: {
                                                            ...this.form?.current?.getFieldsValue(true),
                                                            packageUser: selectedRows[0]?.userId,
                                                            packageUserName: selectedRows[0]?.name
                                                        }
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Checkbox onChange={(check) => {
                                            this.checkChange(check.target.checked, 'packageUser', 'packageUserName')
                                        }} checked={this?.state?.appointed?.packageUser === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Descriptions.Item>
                            <Descriptions.Item children={[]} />
                            <Descriptions.Item label="高低腿配置校核">
                                <Row gutter={12}>
                                    <Col span={14}>
                                        <Form.Item name="legConfigurationCheckUserName">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'legConfigurationCheckUser'} selectedKey={[this.form?.current?.getFieldsValue(true)?.legConfigurationCheckUser]} onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form?.current?.setFieldsValue({
                                                        legConfigurationCheckUser: selectedRows[0]?.userId,
                                                        legConfigurationCheckUserName: selectedRows[0]?.name
                                                    })
                                                    this.setState({
                                                        appointed: {
                                                            ...this.form?.current?.getFieldsValue(true),
                                                            legConfigurationCheckUser: selectedRows[0]?.userId,
                                                            legConfigurationCheckUserName: selectedRows[0]?.name
                                                        }
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item name="legConfigurationCheckNum">
                                            <Input disabled placeholder="自动获取" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Descriptions.Item>
                            <Descriptions.Item label="编程高低腿">
                                <Row gutter={12}>
                                    <Col span={14}>
                                        <Form.Item name="legProgrammingUserName">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'legProgrammingUser'} selectedKey={[this.form?.current?.getFieldsValue(true)?.legProgrammingUser]} onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form?.current?.setFieldsValue({
                                                        legProgrammingUser: selectedRows[0]?.userId,
                                                        legProgrammingUserName: selectedRows[0]?.name
                                                    })
                                                    this.setState({
                                                        appointed: {
                                                            ...this.form?.current?.getFieldsValue(true),
                                                            legProgrammingUser: selectedRows[0]?.userId,
                                                            legProgrammingUserName: selectedRows[0]?.name
                                                        }
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Checkbox onChange={(check) => {
                                            this.checkChange(check.target.checked, 'legProgrammingUser', 'legProgrammingUserName')
                                        }} checked={this?.state?.appointed?.legProgrammingUser === '0'}>
                                            同上
                                        </Checkbox>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item name="legProgrammingNum">
                                            <Input disabled placeholder="自动获取" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Descriptions.Item>
                            <Descriptions.Item children={[]} />
                            <Descriptions.Item label="挂线板校核">
                                <Row gutter={12}>
                                    <Col span={14}>

                                        <Form.Item name="hangLineBoardCheckUserName">
                                            <Input size="small" disabled suffix={
                                                <SelectUser key={'hangLineBoardCheckUser'} selectedKey={[this.form?.current?.getFieldsValue(true)?.hangLineBoardCheckUser]} onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form?.current?.setFieldsValue({
                                                        hangLineBoardCheckUser: selectedRows[0]?.userId,
                                                        hangLineBoardCheckUserName: selectedRows[0]?.name
                                                    })
                                                    this.setState({
                                                        appointed: {
                                                            ...this.form?.current?.getFieldsValue(true),
                                                            hangLineBoardCheckUser: selectedRows[0]?.userId,
                                                            hangLineBoardCheckUserName: selectedRows[0]?.name
                                                        }
                                                    })
                                                }} />
                                            } />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item name="hangLineBoardCheckNum">
                                            <InputNumber min={1} max={9999} style={{ width: '100%' }} placeholder="请输入数量" />
                                        </Form.Item>
                                    </Col>
                                </Row>
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
