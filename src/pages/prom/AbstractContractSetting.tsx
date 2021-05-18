/**
 * @author zyc
 * @copyright © 2021 
 */
 import { Input, Select, DatePicker, Radio, Button, Table, TableColumnType, Space, Form  } from 'antd';
 import { DeleteOutlined } from '@ant-design/icons';
 import { Link } from 'react-router-dom';
 import React from 'react';
 import { RouteComponentProps } from 'react-router';
 import ConfirmableButton from '../../components/ConfirmableButton';
 
 import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../components/AbstractFillableComponent';
 
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
     readonly customerInfoDto?: IcustomerInfoVo;
     readonly signCustomerName?: string;
     readonly signContractTime?: string;
     readonly signUserName?: string;
     readonly deliveryTime?: string;
     readonly reviewTime?: string;
     readonly chargeType?: string;
     readonly salesman?: string;
     readonly regionInfoDTO?: string;
     readonly contractAmount?: number;
     readonly currencyType?: number;
     readonly description?: string;
     readonly productInfoDto?: IproductInfoDto;
     readonly planType?: number;
     readonly paymentPlanDtos?: IpaymentPlanDtos[];
     readonly attachVO?: [];
 }

 export interface IcustomerInfoVo {
    readonly customerCompany?: string;
    readonly customerLinkman?: string;
    readonly customerPhone?: string;
 }

 export interface IproductInfoDto {
    readonly productType?: string;
    readonly voltageGrade?: number;
 }

 export interface IpaymentPlanDtos {
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
        this.handleAdd = this.handleAdd.bind(this);
        this.getTableDataSource = this.getTableDataSource.bind(this);
     }
 
     /**
      * @override
      * @description Gets return path
      * @returns return path 
      */
     protected getReturnPath(): string {
         return '/prom/contract';
     }

     public handleAdd(): void {
        const contract: IContract | undefined = this.state.contract;
        let paymentPlanDtos: IpaymentPlanDtos[] | undefined = contract?.paymentPlanDtos;
        const indexLength : number | undefined= contract?.paymentPlanDtos?.length;
        let i:number | undefined = indexLength ? indexLength+1 : 1;
        const Plan: IpaymentPlanDtos = {
            index: i,
            returnedTime: '12',
            returnedRate: undefined,
            returnedAmount: undefined,
            description: ""
        };
        let addPlan = paymentPlanDtos ? paymentPlanDtos : []
        addPlan.push(Plan)
        this.setState({
            // contract: { paymentPlanDtos: addPlan }
            contract: {
                ...contract,
                paymentPlanDtos: addPlan
            }
        },() => {
            
        })
        this.forceUpdate()
        console.log(this.state.contract)
    }

    public getTableDataSource(): IpaymentPlanDtos[] | undefined {
        return this.state.contract?.paymentPlanDtos;
    }

    //  public onChange = (selectedRowKeys: React.Key[], selectedRows: DataType[]): void => {
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //   }
 
     public getpaymentPlanColumns(): TableColumnType<object>[] {
        return [{
            key: 'index',
            title: '期次',
            dataIndex: 'index',
            render: (text,record,index) => `${index+1}`
        }, {
            key: 'returnedTime',
            title: '计划回款日期',
            dataIndex: 'returnedTime',
            render: (): React.ReactNode => (
                <Form.Item
                    name="returnedTime"
                >
                     <Input />
                </Form.Item>
            )
        }, {
            key: 'returnedRate',
            title: '计划回款占比（%）',
            dataIndex: 'returnedRate'
        }, {
            key: 'returnedAmount',
            title: '计划回款金额（元）',
            dataIndex: 'returnedAmount'
        }, {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (): React.ReactNode => (
                <ConfirmableButton confirmTitle="要删除该条回款计划吗？" type="link" placement="topRight"><DeleteOutlined /></ConfirmableButton>
            )
        }]
     }

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
     /**
      * @implements
      * @description Gets form item groups
      * @returns form item groups 
      */
     public getFormItemGroups(): IFormItemGroup[][] {
         const contract: IContract | undefined = this.state.contract;
         return [[{
             title: '基础信息',
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
                initialValue: contract?.internalNumber,
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
                name: 'customerInfoDto.customerPhone',
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
                children:  <DatePicker showTime  format="YYYY-MM-DD HH:mm" />
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
         }, {
             title: '回款计划',
             itemProps: [ {
                name: 'planType',
                initialValue: contract?.planType,
                children: (
                    <>
                        <Radio.Group>
                            <Radio value={1}>按占比</Radio>
                            <Radio value={2}>按金额</Radio>
                        </Radio.Group>
                        <Button type="primary" style={{ float: 'right' }} onClick={ this.handleAdd }>新增</Button>
                    </>
                )
            }, {
                name: 'paymentPlanDtos',
                initialValue: contract?.paymentPlanDtos,
                children: (
                    <>
                        <Table columns={ this.getpaymentPlanColumns() }
                            dataSource={ this.state.contract?.paymentPlanDtos }
                            rowKey={(record) => `record`}
                        />
                    </>
                )
            }]
         },{
            title: '附件',
            itemProps: [ {
               children: (
                    <Space size="small" style={{ float: 'right' }}>
                        <Button type="primary">添加</Button>
                        <Button type="primary">下载</Button>
                        <Button type="primary">删除</Button>
                    </Space>
               )
           }, {
               name: 'attachVO',
               initialValue: contract?.attachVO,
               children: (
                   <>
                       <Table
                            rowSelection={{
                                type: 'checkbox'
                            }} 
                            columns={ this.getAttachmentColumns() }
                            dataSource={contract?.attachVO}
                       />
                   </>
               )
           }]
        }]];
     }
 }