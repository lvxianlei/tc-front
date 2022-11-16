import React from 'react';
import { Button, Space, Modal, Input, Descriptions, Form, FormInstance, DatePicker, TreeSelect, Select, message } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './TowerPickAssign.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import moment from 'moment';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';
import SelectUserByPick from './SelectUserByPick';

export interface TowerPickAssignProps { }
export interface ITowerPickAssignRouteProps extends RouteComponentProps<TowerPickAssignProps>, WithTranslation {
    readonly id: number | string;
    readonly update: () => void;
    readonly path: () => void;
    readonly title: string;
    readonly state?: number
    readonly type?: string;  //detail为展示，此时需传detailData
    readonly detailData?: IAppointed;
}

export interface TowerPickAssignState {
    readonly visible: boolean;
    readonly description?: string;
    readonly appointed?: IAppointed;
    readonly repeatModal: boolean;
    readonly repeatNum?: number;
    readonly selectKey?: number;
    user?: any[];
    pattern?: any[];
    materialCheckLeader?: any[];
    departmentData?: SelectDataNode[];
    time: any;
}

interface IAppointed {
    readonly productCategoryName?: string;
    readonly productCategory?: string;
    readonly productCategoryId?: string;
    readonly pattern?: string | number;
    readonly sectionNum?: number;
    readonly name?: string;
    readonly materialLeaderDepartment?: string | any;
    readonly materialLeaderDepartmentName?: string | any;
    readonly materialLeader?: string;
    readonly materialLeaderName?: string;
    readonly materialCheckLeaderDepartment?: string | any;
    readonly materialCheckLeaderDepartmentName?: string | any;
    readonly materialCheckLeader?: string;
    readonly materialCheckLeaderName?: string;
    readonly plannedDeliveryTime?: string | moment.Moment;
    readonly patternName?: string;
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

    public state: TowerPickAssignState = {
        visible: false,
        repeatModal: false,
        time: '',
        user: [],
        materialCheckLeader: [],
        departmentData: [],
        pattern: undefined,
    }

    private modalCancel(): void {
        this.getForm()?.resetFields();
        this.setState({
            visible: false,
        })
    }
    private async getUserList(): Promise<void> {
        const data = await RequestUtil.get<any>(`/tower-system/employee?deptName=技术部&size=1000`);
        this.setState({
            user: data?.records
        })
    }
    private async modalShow(): Promise<void> {
        this.getUserList();
        // const data = this.props.type === 'message'||this.props.type === 'detail'? await RequestUtil.get<IAppointed>(`/tower-science/drawProductSegment/detail/${ this.props.id }`):await RequestUtil.get<IAppointed>(`/tower-science/materialProductCategory/assign/${ this.props.id }`)
        const data: any = await RequestUtil.get<IAppointed>(`/tower-science/drawProductSegment/detail/${this.props.id}`)
        // const departmentData = await RequestUtil.get<SelectDataNode[]>(`/tower-system/department`);
        const renderEnum: any = patternTypeOptions && patternTypeOptions.map(({ id, name }) => {
            return {
                label: name,
                value: id,
            }
        })
        this.setState({
            // departmentData: departmentData,
            visible: true,
            appointed: data,
            pattern: renderEnum,
            time: moment(data?.plannedDeliveryTime)
        })
        let detailData = this.props.detailData;
        // if(this.props.type === 'message'||this.props.type === 'detail'){  //提料指派1.2.0版本 去掉
        detailData = {
            ...detailData,

            plannedDeliveryTime: moment(data?.plannedDeliveryTime)
        }
        // }
        this.getForm()?.setFieldsValue({
            ...data, ...detailData,
            materialLeader: data?.materialLeader ? data?.materialLeader.indexOf(',') ? data?.materialLeader.split(',') : [data?.materialLeader] : [],
            // materialLeaderName: values.materialLeader.split('-')[1],
            pattern: data?.pattern && data?.patternName ? data?.pattern + ',' + data?.patternName : '',
            materialCheckLeader: data?.materialCheckLeader ? data?.materialCheckLeader.indexOf(',') ? data?.materialCheckLeader.split(',') : [data?.materialCheckLeader] : [],
        });
        // if(data?.materialCheckLeaderDepartment && data.materialLeaderDepartment){
        //     this.onDepartmentChange(data.materialCheckLeaderDepartment, "校核人");
        //     this.onDepartmentChange(data.materialLeaderDepartment,"提料人");
        // }
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
                    plannedDeliveryTime: values?.plannedDeliveryTime && values?.plannedDeliveryTime.format('YYYY-MM-DD HH:mm:ss'),
                    productCategory: this.state.appointed?.productCategory || this.state.appointed?.productCategoryId,
                    productCategoryName: this.state.appointed?.productCategoryName,
                    pattern: values.pattern.split(',')[0],
                    patternName: values.pattern.split(',')[1],
                    materialLeader: values.materialLeader.join(','),
                    // materialLeaderName: values.materialLeader.split('-')[1],
                    materialCheckLeader: values.materialCheckLeader.join(','),
                    // materialCheckLeaderName: values.materialCheckLeader.split('-')[1],
                }
                RequestUtil.post(`/tower-science/drawProductSegment/assign`, { ...values }).then(() => {
                    message.success('指派成功');
                }).then(() => {
                    this.getForm()?.resetFields();
                    this.setState({
                        visible: false
                    })
                    if (window.location.pathname.indexOf('/1/') > -1) {
                        this.props.path();
                    } else {
                        this.props.update();
                    }
                    // 
                    // history.push(`/workMngt/pickList/pickTowerMessage/${window.location.pathname.id}/${params.status}/${params.materialLeader}/pick/all`)
                });
                return Promise.resolve();
            })
        }
    };
    // /**
    //  * onDepartmentChange
    //  */
    // public onDepartmentChange = async (value: Record<string, any>, title: string) => {
    //     const userData: any = await RequestUtil.get(`/tower-system/employee?dept=${ value }&size=1000`);
    //     let appointed = this.getForm()?.getFieldsValue(true);
    //     if(title === '校对'){
    //         this.setState({
    //             materialCheckLeader: userData.records,
    //             appointed: {
    //                 ...appointed,
    //                 materialCheckLeader: ''
    //             }
    //         })
    //         this.getForm()?.setFieldsValue({ materialCheckLeader:'' })
    //     }
    //     else if(title === '提料'){
    //         this.setState({
    //             user: userData.records,
    //             appointed: {
    //                 ...appointed,
    //                 materialLeader: ''
    //             }
    //         })
    //         this.getForm()?.setFieldsValue({ materialLeader:'' })
    //     }else if(title === '提料人'){
    //         this.setState({
    //             user: userData.records,
    //         })
    //         this.getForm()?.setFieldsValue({ ...appointed })
    //     }if(title === '校核人'){
    //         this.setState({
    //             materialCheckLeader: userData.records,
    //         })
    //         this.getForm()?.setFieldsValue({ ...appointed })
    //     }
    // }

    // public wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
    //     roles && roles.forEach((role: any & SelectDataNode): void => {
    //         role.value = role.id;
    //         role.isLeaf = false;
    //         if (role.children && role.children.length > 0) {
    //             this.wrapRole2DataNode(role.children);
    //         } else {
    //             role.children = []
    //         }
    //     });
    //     return roles;
    // }

    // public renderTreeNodes = (data:any) => data.map((item:any) => {
    //     if (item.children) {
    //         return (
    //             <TreeNode 
    //                 key={ item.id } 
    //                 title={ item.name } 
    //                 value={ item.id } 
    //                 className={ styles.node } 
    //                 >
    //                 { this.renderTreeNodes(item.children) }
    //             </TreeNode>
    //         );
    //     }
    //     return <TreeNode 
    //                 { ...item } 
    //                 key={ item.id } 
    //                 title={ item.name } 
    //                 value={ item.id }
    //             />;
    // });

    /**
    * @description Renders AbstractDetailComponent
    * @returns render 
    */
    public render(): React.ReactNode {
        return <>
            <Button
                type={this.props.title === "塔型提料指派" ? "primary" : 'link'}
                onClick={() => this.modalShow()}
                ghost
            >
                {this.props.title}
            </Button>
            <Modal
                visible={this.state.visible}
                width="60%"
                title="塔型提料指派"
                footer={
                    <Space direction="horizontal" className={styles.bottomBtn}>
                        <Button
                            type="ghost"
                            onClick={() => this.modalCancel()}
                        >
                            关闭
                        </Button>
                        {
                            this.props.type === 'detail' ?
                                null :
                                <Button
                                    type="primary"
                                    onClick={() => this.onSubmit()}
                                    ghost
                                >
                                    提交
                                </Button>
                        }
                    </Space>
                }
                onCancel={() => this.modalCancel()}
            >
                <DetailContent className={styles.modalHeight}>
                    <Form
                        ref={this.form}
                        className={styles.descripForm}
                    >
                        <Descriptions
                            title=""
                            bordered
                            size="small"
                            colon={false}
                            column={3}
                        >
                            <Descriptions.Item label="塔型">
                                {this.state.appointed?.productCategoryName}
                            </Descriptions.Item>
                            <Descriptions.Item label="模式">
                                <Form.Item
                                    name="pattern"
                                    initialValue={'全部'}
                                    rules={[{
                                        required: true,
                                        message: '请选择模式'
                                    }
                                    ]}>
                                    <Select style={{ width: '100%' }}>
                                        {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                            return <Select.Option key={index} value={id + ',' + name}>
                                                {name}
                                            </Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                {/* { this.props.type === 'detail'||this.props.type === 'message'? this.state.appointed?.pattern: this.state.appointed?.patternName } */}

                            </Descriptions.Item>
                            {this.props.type === 'detail' ?
                                <><Descriptions.Item label="段信息">
                                    {this.props.detailData?.name || ''}
                                </Descriptions.Item>
                                    <Descriptions.Item label="提料人">
                                        {this.props.detailData?.materialLeaderDepartmentName || ''} - {this.props.detailData?.materialLeaderName || ''}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="校核人">
                                        {this.props.detailData?.materialCheckLeaderDepartmentName || ''} - {this.props.detailData?.materialCheckLeaderName || ''}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="交付时间">
                                        {this.props.detailData?.plannedDeliveryTime || ''}
                                    </Descriptions.Item></>
                                : <><Descriptions.Item label="段信息">
                                    <Form.Item
                                        name="name"
                                        initialValue={'全部'}
                                        rules={[{
                                            required: true,
                                            message: '请输入段信息'
                                        },
                                        {
                                            pattern: /^[^\s]*$/,
                                            message: '禁止输入空格',
                                        },
                                        {
                                            pattern: /^(全部)$|^([0-9a-zA-Z-,]*)$/,
                                            message: '仅可输入数字/字母/-/,/全部',
                                        }]}>
                                        <Input placeholder="请输入（1-3，5，ac，w，全部）" disabled />
                                    </Form.Item>
                                </Descriptions.Item>
                                    <Descriptions.Item label="提料人">
                                        {/* <Form.Item name="materialLeaderDepartment"
                                    rules={[{
                                        required: true,
                                        message: '请选择部门'
                                    }]} style={ { width: '50%', display: 'inline-block' } }>
                                    <TreeSelect 
                                        placeholder="请选择" 
                                        style={{width:'120px'}} 
                                        onChange={ 
                                            (value: any) => { 
                                                this.onDepartmentChange(value,'提料')
                                            } 
                                        } 
                                        className={ styles.width200 }
                                    >
                                        { this.state.departmentData && this.renderTreeNodes(this.wrapRole2DataNode(this.state.departmentData)) }
                                    </TreeSelect>
                                </Form.Item> */}
                                        <Form.Item name="materialLeaderName"
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]}
                                            style={{
                                                width: '50%',
                                                display: 'inline-block'
                                            }}
                                        >
                                            <Input style={{ width: '120px' }} size="small" disabled suffix={[
                                                <SelectUserByPick requests={{ deptName: '技术-提料组' }} key={0} selectType="checkbox" onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form.current?.setFieldsValue({
                                                        materialLeader: selectedRows?.map((res: any) => res?.userId),
                                                        materialLeaderName: selectedRows?.map((res: any) => res?.name).join(',')
                                                    })
                                                }} />
                                            ]} />
                                            {/* <Select placeholder="请选择" style={{width:'120px'}} mode='multiple'>
                                        { this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option 
                                                        key={ item.userId } 
                                                        value={ item.userId }
                                                    >
                                                        { item.name }
                                                    </Select.Option>
                                        }) }
                                    </Select> */}
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="校核人">
                                        {/* <Form.Item 
                                    name="materialCheckLeaderDepartment"
                                    rules={[{
                                        required: true,
                                        message: '请选择部门'
                                    }]} 
                                    style={ { 
                                        width: '50%', 
                                        display: 'inline-block' 
                                    } }
                                >
                                    <TreeSelect 
                                        placeholder="请选择" 
                                        style={{width:'120px'}} 
                                        onChange={ 
                                            (value: any) => { 
                                                this.onDepartmentChange(value, '校对') 
                                            } 
                                        } 
                                        className={ styles.width200 }
                                    >
                                        { this.state.departmentData && this.renderTreeNodes(this.wrapRole2DataNode(this.state.departmentData)) }
                                    </TreeSelect>
                                </Form.Item> */}
                                        <Form.Item
                                            name="materialCheckLeaderName"
                                            rules={[{
                                                required: true,
                                                message: '请选择人员'
                                            }]}
                                            style={{
                                                width: '50%',
                                                display: 'inline-block'
                                            }}
                                        >
                                            <Input style={{ width: '120px' }} size="small" disabled suffix={[
                                                <SelectUserByPick key={1} requests={{ deptName: '技术-提料组' }} selectType="checkbox" onSelect={(selectedRows: Record<string, any>) => {
                                                    this.form.current?.setFieldsValue({
                                                        materialCheckLeader: selectedRows?.map((res: any) => res?.userId),
                                                        materialCheckLeaderName: selectedRows?.map((res: any) => res?.name).join(',')
                                                    })
                                                }} />
                                            ]} />
                                            {/* <Select placeholder="请选择" style={{width:'120px'}}  mode='multiple'>
                                        { this.state?.user && this.state.user.map((item: any) => {
                                            return <Select.Option 
                                                        key={ item.userId } 
                                                        value={ item.userId }
                                                    >
                                                        { item.name }
                                                    </Select.Option>
                                        }) }
                                    </Select> */}
                                        </Form.Item>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="交付时间">
                                        <Form.Item
                                            name="plannedDeliveryTime"
                                            rules={[{
                                                required: true,
                                                message: '请选择交付时间'
                                            }]}>
                                            <DatePicker format={'YYYY-MM-DD HH:mm:ss'} disabledDate={(current) => {
                                                return current && current < moment(this.state.time);
                                            }} showTime />
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

export default withRouter(withTranslation('translation')(TowerPickAssign))
