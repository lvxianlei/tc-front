/**
 * @author zyc
 * @copyright © 2021 
 */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, FormProps, Input, InputNumber, Radio, Row, Select, Space, Table, TableColumnType } from 'antd';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import moment from 'moment';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import AbstractFillableComponent, {
    IAbstractFillableComponentState,
    IExtraSection,
    IFormItemGroup,
} from '../../components/AbstractFillableComponent';
import ConfirmableButton from '../../components/ConfirmableButton';

 
 
 export interface IAbstractContractSettingState extends IAbstractFillableComponentState {
     readonly contract?: IContract;
 }
 
 export interface ITabItem {
    readonly label: string;
    readonly key: string | number;
}

 export interface IContract {
     readonly id?: number;
     readonly contractNumber?: string;
     readonly internalNumber?: string;
     readonly projectName?: string;
     readonly simpleProjectName?: string;
     readonly winBidType?: number;
     readonly saleType?: number;
     readonly customerInfoDto?: IcustomerInfoDto;
     readonly signCustomerName?: string;
     readonly signContractTime?: string;
     readonly signUserName?: string;
     deliveryTime?: any;
     readonly reviewTime?: string;
     readonly chargeType?: string;
     readonly salesman?: string;
     readonly regionInfoDTO?: string;
     readonly contractAmount?: number;
     readonly currencyType?: number;
     readonly description?: string;
     readonly productInfoDto?: IproductInfoDto;
     readonly planType?: number;
     readonly paymentPlanDtos?: IPaymentPlanDto[];
     readonly attachVO?: [];
 }

 export interface IcustomerInfoDto {
    readonly customerCompany?: string;
    readonly customerLinkman?: string;
    readonly customerPhone?: string;
 }

 export interface IproductInfoDto {
    readonly productType?: string;
    readonly voltageGrade?: number;
 }

 export interface IPaymentPlanDto {
    readonly index?: number;
    readonly returnedTime?: string;
    readonly returnedRate?: number;
    readonly returnedAmount?: number;
    readonly description?: string;
 }

 export interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
  }
 /**
  * Abstract Contract Setting
  */
 export default abstract class AbstractContractSetting<P extends RouteComponentProps, S extends IAbstractContractSettingState> extends AbstractFillableComponent<P, S> {
 
    public state: S = {
    contract: undefined
    } as S;

    constructor(props: P) {
    super(props)
    // this.handleAdd = this.handleAdd.bind(this);
    // this.getTableDataSource = this.getTableDataSource.bind(this);
    }

    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        // return '/prom/contract';
        return '';
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
                span: 16
            }
        };
    }

    // public handleAdd(): void {
    //     const contract: IContract | undefined = this.state.contract;
    //     const paymentPlanDtos: IPaymentPlanDto[] = contract?.paymentPlanDtos || [];
    //     const plan: IPaymentPlanDto = {
    //         index: paymentPlanDtos.length + 1,
    //         returnedTime: '',
    //         returnedRate: undefined,
    //         returnedAmount: undefined,
    //         description: ""
    //     };
    //     this.setState({
    //         contract: {
    //             ...(contract || {}),
    //             paymentPlanDtos: [...paymentPlanDtos, plan]
    //         }
    //     });
    // }

    public attachHandleAdd(): void {
        
    }


//  public onChange = (selectedRowKeys: React.Key[], selectedRows: DataType[]): void => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   }

    // public getpaymentPlanColumns(): TableColumnType<object>[] {
    //     return [{
    //         key: 'index',
    //         title: '期次',
    //         dataIndex: 'index',
    //         render: (text,record,index) => `${index+1}`
    //     }, {
    //         key: 'returnedTime',
    //         title: '计划回款日期',
    //         dataIndex: 'returnedTime',
    //         render: (): React.ReactNode => (
    //             <Form.Item
    //                 name={['paymentPlanDtos', 'returnedTime']}
    //             >
    //                 <DatePicker />
    //             </Form.Item>
    //         )
    //     }, {
    //         key: 'returnedRate',
    //         title: '计划回款占比（%）',
    //         dataIndex: 'returnedRate',
    //         render: (): React.ReactNode => (
    //             <Form.Item
    //                 name={['paymentPlanDtos', 'returnedRate']}
    //             >
    //                 <Input />
    //             </Form.Item>
    //         )
    //     }, {
    //         key: 'returnedAmount',
    //         title: '计划回款金额（元）',
    //         dataIndex: 'returnedAmount',
    //         render: (): React.ReactNode => (
    //             <Form.Item
    //                 name={['paymentPlanDtos', 'returnedAmount']}
                    
    //             >
    //                 <Input prefix="￥"/>
    //             </Form.Item>
    //         )
    //     }, {
    //         key: 'description',
    //         title: '备注',
    //         dataIndex: 'description',
    //         render: (): React.ReactNode => (
    //             <Form.Item
    //                 name={['paymentPlanDtos', 'description']}
    //             >
    //                 <Input.TextArea rows={ 5 } maxLength={ 300 }/>
    //             </Form.Item>
    //         )
    //     }, {
    //         key: 'operation',
    //         title: '操作',
    //         dataIndex: 'operation',
    //         render: (_: undefined, record: object): React.ReactNode => (
    //             <ConfirmableButton confirmTitle="要删除该条回款计划吗？" type="link" placement="topRight" onConfirm={ ()=>{
    //                 let index = (record as IPaymentPlanDto).index;
    //                 const paymentPlanDtos = this.state.contract?.paymentPlanDtos||[];
    //                 const contract: IContract | undefined = this.state.contract;
    //                 this.setState({ 
    //                     contract: {
    //                         ...(contract || {}),
    //                         paymentPlanDtos: paymentPlanDtos.filter(item => item.index !== index) 
    //                     }
    //                 });
    //             } }><DeleteOutlined /></ConfirmableButton>
    //         )
    //     }]
    // }

    public getAttachmentColumns(): TableColumnType<object>[] {
        return [{
            key: 'name',
            title: '附件名称',
            dataIndex: 'name'
        }, {
            key: 'fileSize',
            title: '文件大小',
            dataIndex: 'fileSize'
        }, {
            key: 'userName',
            title: '上传时间',
            dataIndex: 'userName'
        }, {
            key: 'userName',
            title: '上传人员',
            dataIndex: 'userName'
        }, {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={ `` }>预览</Link>
                    <Link to={ `` }>下载</Link>
                    <ConfirmableButton confirmTitle="要删除该附件吗？" type="link" placement="topRight">删除</ConfirmableButton>
                </Space>
            )
        }]
    }

    protected getGeneratNum(): string { 
        var result: number = Math.floor( Math.random() * 1000 );
        let num: string = '';
        if(result < 10) {
            num =  '00' + result;
        } else if (result<100){
            num = '0' + result;
        } else {
            num =  result.toString();
        }
        return moment().format('YYYYMMDD') + num;
    }
    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
         const contract: IContract | undefined = this.state.contract;
         const GeneratNum: string = this.getGeneratNum();
         return [[{
            title: '基础信息',
            itemCol: {
                span: 8
            },
            itemProps: [{
                label: '合同编号',
                name: 'contractNumber',
                initialValue: contract?.contractNumber,
                rules: [{
                    required: true,
                    message: '请输入合同编号'
                }],
                children: <Input/>
            }, {
                label: '内部合同编号',
                name: 'internalNumber',
                initialValue: contract?.internalNumber || GeneratNum,
                children: <Input disabled/>
            }, {
                label: '工程名称',
                name: 'projectName',
                initialValue: contract?.projectName,
                rules: [{
                    required: true,
                    message: '请输入工程名称'
                }],
                children: <Input/>
            }, {
                label: '工程简称',
                name: 'simpleProjectName',
                initialValue: contract?.simpleProjectName,
                children: <Input/>
            }, {
                label: '中标类型',
                name: 'winBidType',
                initialValue: contract?.winBidType,
                children: (
                    <Select>
                        <Select.Option value={ 1 }>国家电网</Select.Option>
                        <Select.Option value={ 2 }>南方电网</Select.Option>
                    </Select>
                )
             }, {
                label: '销售类型',
                name: 'saleType',
                initialValue: contract?.saleType,
                children: (
                    <Select>
                        <Select.Option value={ 1 }>国内业务</Select.Option>
                        <Select.Option value={ 2 }>国际业务</Select.Option>
                    </Select>
                )
            }, {
                label: '业主单位',
                name: 'customerCompany',
                initialValue: contract?.customerInfoDto?.customerCompany,
                rules: [{
                    required: true,
                    message: '请选择业主单位'
                }],
                children: <Input/>
            }, {
                label: '业主联系人',
                name: 'customerLinkman',
                initialValue: contract?.customerInfoDto?.customerLinkman,
                children: <Input/>
            }, {
                label: '业主联系电话',
                name: 'customerPhone',
                initialValue: contract?.customerInfoDto?.customerPhone,
                children: <Input/>
            }, {
                label: '合同签订单位',
                name: 'signCustomerName',
                initialValue: contract?.signCustomerName,
                rules: [{
                    required: true,
                    message: '请选择合同签订单位'
                }],
                children: <Input/>
            }, {
                label: '合同签订日期',
                name: 'signContractTime',
                initialValue: contract?.signContractTime,
                rules: [{
                    required: true,
                    message: '请选择合同签订日期'
                }],
                children:  <DatePicker />
            }, {
                label: '签订人',
                name: 'signUserName',
                initialValue: contract?.signUserName,
                rules: [{
                    required: true,
                    message: '请输入签订人'
                }],
                children:  <Input />
            }, {
                label: '要求交货日期',
                name: 'deliveryTime',
                initialValue: contract?.deliveryTime,
                rules: [{
                    required: true,
                    message: '请选择要求交货日期'
                }],
                children:  <DatePicker />
            }, {
                label: '评审时间',
                name: 'reviewTime',
                initialValue: contract?.reviewTime,
                children:  <DatePicker showTime format="YYYY-MM-DD HH:mm" />
            }, {
                label: '销售员',
                name: 'salesman',
                initialValue: contract?.salesman,
                rules: [{
                    required: true,
                    message: '请输入销售员'
                }],
                children:  <Input />
            }, {
                label: '计价方式',
                name: 'chargeType',
                initialValue: contract?.chargeType,
                children: (
                    <Select>
                        <Select.Option value={ 1 }>订单总价、总重计算单价</Select.Option>
                        <Select.Option value={ 2 }>产品单价、基数计算总价</Select.Option>
                    </Select>
                )
            }, {
                label: '所属区域',
                name: 'regionInfoDTO',
                initialValue: contract?.regionInfoDTO,
                children: <Input />
            }, {
                label: '合同总价',
                name: 'contractAmount',
                initialValue: contract?.contractAmount,
                children: <Input prefix="￥" />
            }, {
                label: '币种',
                name: 'currencyType',
                initialValue: contract?.currencyType,
                children: (
                    <Select>
                        <Select.Option value={ 1 }>RMB人民币</Select.Option>
                        <Select.Option value={ 2 }>USD美元</Select.Option>
                    </Select>
                )
            }, {
                label: '备注',
                 name: 'description',
                 initialValue: contract?.description,
                 children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
             }]
         }, {
            title: '产品信息',
            itemCol: {
                span: 12
            },
            itemProps: [ {
                label: '产品类型',
                name: 'productType',
                initialValue: contract?.productInfoDto?.productType,
                children: (
                    <Select>
                        <Select.Option value={ 1 }>角钢塔</Select.Option>
                        <Select.Option value={ 2 }>管塔</Select.Option>
                        <Select.Option value={ 3 }>螺栓</Select.Option>
                    </Select>
                )
            }, {
                label: '电压等级',
                name: 'voltageGrade',
                initialValue: contract?.productInfoDto?.voltageGrade,
                children: (
                    <>
                        <Select style={{ width: '90%' }}>
                            <Select.Option value={ 1 }>220</Select.Option>
                            <Select.Option value={ 2 }>110</Select.Option>
                        </Select>
                        <span> KV</span>
                    </>
                    
                )
            }]
        }]];
    }

    /**
     * @override
     * @description Renders extra sections
     * @returns extra sections 
     */
    public renderExtraSections(): IExtraSection[] {
        const contract: IContract | undefined = this.state.contract;
        return [{
            title: '回款计划',
            render: (): React.ReactNode => {
                return (
                    <>
                        <Form.Item name="planType" initialValue={ contract?.planType || 1 }>
                            <Radio.Group>
                                <Radio value={ 1 }>按占比</Radio>
                                <Radio value={ 2 }>按金额</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.List name="paymentPlanDtos">
                            {
                                (fields: FormListFieldData[], operation: FormListOperation): React.ReactNode => {
                                    return (
                                        <>
                                            <Button type="primary" onClick={ () => ( operation.add() ) }>新增</Button>
                                            {
                                                fields.map<React.ReactNode>((field: FormListFieldData, index: number): React.ReactNode => (
                                                    <Row key={ `${ field.name }_${ index }` }>
                                                        <Col span={ 2 }>{ index + 1 }</Col>
                                                        <Col span={ 5 }>
                                                            <Form.Item { ...field } name={[field.name, 'returnedTime']} fieldKey={[field.fieldKey, 'returnedTime']}>
                                                                <DatePicker format="YYYY-MM-DD"/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 5 }>
                                                            <Form.Item { ...field } name={[field.name, 'returnedRate']} fieldKey={[field.fieldKey, 'returnedRate']}>
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 5 }>
                                                            <Form.Item { ...field } name={[field.name, 'returnedAmount']} fieldKey={[field.fieldKey, 'returnedAmount']}>
                                                                <InputNumber stringMode={ false } precision={ 2 }
                                                                    formatter={ value => `$ ${ value }`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }
                                                                    parser={ value => value?.replace(/\$\s?|(,*)/g, '') || '' }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 5 }>
                                                            <Form.Item { ...field } name={[field.name, 'description']} fieldKey={[field.fieldKey, 'description']}>
                                                                <Input.TextArea rows={ 5 } maxLength={ 300 }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <ConfirmableButton confirmTitle="要删除该条回款计划吗？"
                                                                type="link" placement="topRight"
                                                                onConfirm={ () => { operation.remove(index); } }>
                                                                <DeleteOutlined />
                                                            </ConfirmableButton>
                                                        </Col>
                                                    </Row>
                                                ))
                                            }
                                        </>
                                    );
                                }
                            }
                        </Form.List>
                        {/* <Table columns={ this.getpaymentPlanColumns() } bordered={ true }
                            dataSource={ paymentPlanDtos }
                            pagination={ false }
                            rowKey='index'
                        /> */}
                    </>
                );
            }
        },{
            title: '附件',   
            render: (): React.ReactNode => {
                return (
                    <>
                        <Space size="small" style={{ float: 'right' }}>
                            <Button type="primary" onClick={ this.attachHandleAdd }>添加</Button>
                            <Button type="primary">下载</Button>
                            <Button type="primary">删除</Button>
                        </Space>
                        <Table
                            rowSelection={{
                                type: 'checkbox'
                            }} 
                            columns={ this.getAttachmentColumns() }
                            dataSource={contract?.attachVO}
                       />
                    </>
                )
            }
        }];
    }
 }