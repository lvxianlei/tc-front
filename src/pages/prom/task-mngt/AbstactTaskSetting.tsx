/**
 * @author lxy
 * @copyright © 2021 
 */
 import { DeleteOutlined } from '@ant-design/icons';
 import {
     Button,
     Cascader,
     Checkbox,
     Col,
     DatePicker,
     Form,
     FormProps,
     Input,
     InputNumber,
     Radio,
     Row,
     Select,
     Space,
     Upload,
     Steps,
     Table,
     TableColumnType,
 } from 'antd';
 import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
 import moment from 'moment';
 import React from 'react';
 import { RouteComponentProps } from 'react-router';
 import { Link } from 'react-router-dom';
 import OrderSelectionComponent from '../../../components/OrderSelectionModal';
 import ProductSelectionComponent from '../../../components/ProductSelectionModal';
 import AbstractFillableComponent, {
     IAbstractFillableComponentState,
     IFormItemGroup,
 } from '../../../components/AbstractFillableComponent';
 import ConfirmableButton from '../../../components/ConfirmableButton';
 import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
 import { DataType } from '../../../components/AbstractSelectableModal';
 import styles from './AbstractTaskSetting.module.less';
 import RequestUtil from '../../../utils/RequestUtil';
 import { materialStandardOptions } from '../../../configuration/DictionaryOptions';
import { IProduct } from '../../IProduct';
import { ITask } from '../../ITask';
 const { Step } = Steps
  
 export interface IAbstractTaskSettingState extends IAbstractFillableComponentState {
     checkStep: StepItem;
     productDataSource: IProduct[];
     selectedKeys: React.Key[];
     readonly task?: ITaskInfo;
     readonly taskInfoDTO : ITaskInfo;
     
 }
 export interface DataTypeMore extends DataType {
    readonly contractId?: number;
    readonly internalNumber?: string;
    readonly orderDeliveryTime?: string;
    readonly saleOrderNumber?: string;
    readonly lineName?: string	;
    readonly num?:number;
    readonly price?: number;
    readonly productHeight?: number;
    readonly productNumber?: string;
    readonly productCategoryName?: string;
    readonly productStatus?: number;
    readonly productType?: number;
    readonly saleOrderId?: number;
    readonly taskNoticeId?: number;	
    readonly tender?: string;
    readonly totalAmount?:number;
    readonly unit?: string;
    readonly voltageGrade?: number;
 }


 export interface OrderDataType extends DataType {
    productStatus?: number;
    readonly status?: number;
 }
 
 export interface ITaskInfo extends ITask {
    id?: string | number;
    readonly createTime?: string;
    readonly createUserName?: string;
    readonly customerCompany?: string;	
    readonly productChangeInfoVOList?: IProduct [];	
    readonly productInfoVOList?: IProduct [];
    readonly orderDeliveryTime?:	string;	
    readonly signCustomerName?:	string;		
    readonly simpleProjectName?: string;	
 }
 
export interface IproductInfoDto {
    readonly productType?: string;
    readonly voltageGrade?: number;
}
 
 
export interface IStep {
    readonly title: string;
}
 
export enum StepItem {
    NEW_TASK = 0,   //新增任务单
    COMPLETE_SPECIAL_OPTIONS = 1,   //完善特殊信息
    COMPLETE_PRODUCT_INFO = 2,   //完善产品信息
}
enum StepTitleItem {
    NEW_TASK = '新增任务单',   //新增任务单
    COMPLETE_SPECIAL_OPTIONS = '完善特殊信息',   //完善特殊信息
    COMPLETE_PRODUCT_INFO = '完善产品信息',   //完善产品信息
}
 /**
  * Abstract Task Setting
  */
 export default abstract class AbstractTaskSetting<P extends RouteComponentProps, S extends IAbstractTaskSettingState> extends AbstractFillableComponent<P, S> {
  
     public state: S = {
         task: undefined,
         checkStep: StepItem.NEW_TASK, 
         selectedKeys: {},
         taskInfoDTO:{},
     }  as S;
 
     constructor(props: P) {
         super(props)
     }
 
     /**
      * @override
      * @description Gets return path
      * @returns return path 
      */
     protected getReturnPath(): string {
         return '/prom/task';
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
    
    //订单选择
    public onOrderSelect = (selectedRows: DataTypeMore[]):void => {
        if(selectedRows && selectedRows.length > 0 ) {
            const task:ITaskInfo = {
                contractId: selectedRows[0].contractId,
                customerCompany: selectedRows[0].customerCompany,
                internalNumber: selectedRows[0].internalNumber,
                projectName: selectedRows[0].projectName,
                saleOrderId: selectedRows[0].id,
                deliveryTime: '',
                orderDeliveryTime: selectedRows[0].orderDeliveryTime,
                signCustomerName: selectedRows[0].signCustomerName,
                saleOrderNumber: selectedRows[0].saleOrderNumber,
            }
            this.getForm()?.setFieldsValue({
                orderDeliveryTime: moment(selectedRows[0].orderDeliveryTime),
                deliveryTime: '',
                internalNumber: selectedRows[0].internalNumber,
                saleOrderNumber: selectedRows[0].saleOrderNumber,
                projectName: selectedRows[0].projectName,
                customerCompany: selectedRows[0].customerCompany,
                signCustomerName: selectedRows[0].signCustomerName,
            });
            this.setState({
                task,
                taskInfoDTO:task
            })
        }
    }
   
    //产品选择
    public onProductSelect = (selectedRows: OrderDataType[]):void => {
        const { productDataSource } = this.state;
        if(selectedRows && selectedRows.length > 0 ) {
            const task:IProduct[] = productDataSource || [];
            selectedRows[0].productStatus = selectedRows[0].status;
            task.push(selectedRows[0])
            this.setState({
                productDataSource:[...task]
            })
        }
    }
  


 
     /**
      * @implements
      * @description Gets form item groups
      * @returns form item groups 
      */
     public getFormItemGroups(): IFormItemGroup[][] {
          const task: ITaskInfo | undefined = this.state.task;
          const { checkStep } = this.state;
          let module: IFormItemGroup[][] = [];
          switch(checkStep){
                case StepItem.NEW_TASK:
                    module = [[{
                        title: '基础信息',
                        itemCol: {
                            span: 8
                        },
                        itemProps: [{
                            label: '关联订单',
                            name: 'saleOrderNumber',
                            initialValue: task?.saleOrderNumber,
                            rules: [{
                                required: true,
                                message: '请选择关联订单'
                            }],
                            children: 
                                <>
                                    <Input value={ task?.saleOrderNumber } suffix={ 
                                        <OrderSelectionComponent onSelect={ this.onOrderSelect } />
                                    }/>
                                </>
                        },  {
                            label: '内部合同编号',
                            name: 'internalNumber',
                            initialValue: task?.internalNumber,
                            rules: [{
                                required: true,
                                message: '请输入内部合同编号'
                            }],
                            children: <Input disabled/>
                        }, {
                            label: '工程名称',
                            name: 'projectName',
                            initialValue: task?.projectName,
                            children: <Input disabled/>
                        }, {
                            label: '业主单位',
                            name: 'customerCompany',
                            initialValue: task?.customerCompany,
                            children: <Input disabled/>
                        }, {
                            label: '合同签订单位',
                            name: 'signCustomerName',
                            initialValue: task?.signCustomerName,
                            children: <Input disabled/>
                        }, {
                            label: '订单交货日期',
                            name: 'orderDeliveryTime',
                            initialValue: task?.orderDeliveryTime ? moment(task?.orderDeliveryTime) : '',
                            rules: [{
                                required: true,
                                message: '请选择订单交货日期'
                            }],
                            children:  <DatePicker disabled  format='YYYY-MM-DD'/>
                        }, {
                            label: '客户交货日期',
                            name: 'deliveryTime',
                            initialValue: task?.deliveryTime ? moment(task?.deliveryTime) : '',
                            rules: [{
                                required: true,
                                message: '请选择客户交货日期'
                            }],
                            children:  <DatePicker disabledDate={(current)=>{return current > moment(task?.orderDeliveryTime).add(1, 'days')}} format="YYYY-MM-DD"/>
                        }, {
                            label: '计划交货日期',
                            name: 'planDeliveryTime',
                            initialValue: task?.planDeliveryTime ? moment(task?.planDeliveryTime) : '',
                            rules: [{
                                required: true,
                                message: '请选择计划交货日期'
                            }],
                            children:  <DatePicker/>
                        }, {
                            label: '备注',
                            name: 'description',
                            initialValue: task?.description,
                            children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
                        }]
                    }]];
                    break;
                case StepItem.COMPLETE_SPECIAL_OPTIONS:
                    module = [[{
                        title: '基础信息',
                        itemCol: {
                            span: 8
                        },
                        itemProps: [{
                            label: '关联订单',
                            name: 'saleOrderNumber',
                            initialValue: task?.saleOrderNumber,
                            rules: [{
                                required: true,
                                message: '请选择关联订单'
                            }],
                            children: <Input disabled />
                        },  {
                            label: '内部合同编号',
                            name: 'internalNumber',
                            initialValue: task?.internalNumber,
                            rules: [{
                                required: true,
                                message: '请输入内部合同编号'
                            }],
                            children: <Input disabled/>
                        }, {
                            label: '工程名称',
                            name: 'projectName',
                            initialValue: task?.projectName,
                            children: <Input disabled/>
                        }, {
                            label: '业主单位',
                            name: 'customerCompany',
                            initialValue: task?.customerCompany,
                            children: <Input disabled/>
                        }, {
                            label: '合同签订单位',
                            name: 'signCustomerName',
                            initialValue: task?.signCustomerName,
                            children: <Input disabled/>
                        }, {
                            label: '订单交货日期',
                            name: 'orderDeliveryTime',
                            initialValue: moment(task?.orderDeliveryTime),
                            rules: [{
                                required: true,
                                message: '请选择订单交货日期'
                            }],
                            children: <DatePicker disabled format='YYYY-MM-DD'/>
                        }, {
                            label: '客户交货日期',
                            name: 'deliveryTime',
                            initialValue: moment(task?.deliveryTime),
                            rules: [{
                                required: true,
                                message: '请选择客户交货日期'
                            }],
                            children:  <DatePicker disabled/>
                        }, {
                            label: '计划交货日期',
                            name: 'planDeliveryTime',
                            initialValue: moment(task?.planDeliveryTime),
                            rules: [{
                                required: true,
                                message: '请选择计划交货日期'
                            }],
                            children:  <DatePicker disabled/>
                        }, {
                            label: '备注',
                            name: 'description',
                            initialValue: task?.description,
                            children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息" disabled/>
                        }]
                    },{
                        title: '特殊要求',
                        itemCol: {
                            span: 13
                        },
                        itemProps: [{
                            label: '原材料标准',
                            name: 'materialStandard',
                            initialValue: task?.materialStandard && task?.materialStandard =='-1'?  '' : task?.materialStandard ,
                            children: (
                                <Select>
                                    { materialStandardOptions && materialStandardOptions.map(({ id, name }, index) => {
                                        return <Select.Option key={ index } value={ id }>
                                            { name }
                                        </Select.Option>
                                    }) }
                                </Select>
                            )
                        }, {
                            label: '原材料要求',
                            name: 'materialDemand',
                            initialValue: task?.materialDemand,
                            children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
                        },  {
                            label: '焊接要求',
                            name: 'weldingDemand',
                            initialValue: task?.weldingDemand,
                            children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
                        }, {
                            label: '包装要求',
                            name: 'packDemand',
                            initialValue: task?.packDemand,
                            children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
                        }, {
                            label: '镀锌要求',
                            name: 'galvanizeDemand',
                            initialValue: task?.galvanizeDemand,
                            children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
                        }, {
                            label: '备注',
                            name: 'peculiarDescription',
                            initialValue: task?.peculiarDescription,
                            children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息" />
                        }]
                    }]];
                    break;
                case StepItem.COMPLETE_PRODUCT_INFO:
                    module = [[{
                        title: '基础信息',
                        itemCol: {
                            span: 8
                        },
                        itemProps: [{
                            label: '关联订单',
                            name: 'saleOrderNumber',
                            initialValue: task?.saleOrderNumber,
                            rules: [{
                                required: true,
                                message: '请选择关联订单'
                            }],
                            children: <Input disabled />
                        },  {
                            label: '内部合同编号',
                            name: 'internalNumber',
                            initialValue: task?.internalNumber,
                            rules: [{
                                required: true,
                                message: '请输入内部合同编号'
                            }],
                            children: <Input disabled/>
                        }, {
                            label: '工程名称',
                            name: 'projectName',
                            initialValue: task?.projectName,
                            children: <Input disabled/>
                        }, {
                            label: '业主单位',
                            name: 'customerCompany',
                            initialValue: task?.customerCompany,
                            children: <Input disabled/>
                        }, {
                            label: '合同签订单位',
                            name: 'signCustomerName',
                            initialValue: task?.signCustomerName,
                            children: <Input disabled/>
                        }, {
                            label: '订单交货日期',
                            name: 'orderDeliveryTime',
                            initialValue: moment(task?.orderDeliveryTime),
                            rules: [{
                                required: true,
                                message: '请选择订单交货日期'
                            }],
                            children:  <DatePicker disabled format='YYYY-MM-DD'/>
                        }, {
                            label: '客户交货日期',
                            name: 'deliveryTime',
                            initialValue: moment(task?.deliveryTime),
                            rules: [{
                                required: true,
                                message: '请选择客户交货日期'
                            }],
                            children:  <DatePicker disabled/>
                        }, {
                            label: '计划交货日期',
                            name: 'planDeliveryTime',
                            initialValue: moment(task?.planDeliveryTime),
                            rules: [{
                                required: true,
                                message: '请选择计划交货日期'
                            }],
                            children:  <DatePicker disabled/>
                        }, {
                            label: '备注',
                            name: 'description',
                            initialValue: task?.description,
                            children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息" disabled/>
                        }]
                    },{
                        title: '特殊要求',
                        itemCol: {
                            span: 13
                        },
                        itemProps: [{
                            label: '原材料标准',
                            name: 'materialStandard',
                            initialValue: task?.materialStandard && task?.materialStandard =='-1'?  '' : task?.materialStandard,
                            children: (
                                <Select disabled>
                                    { materialStandardOptions && materialStandardOptions.map(({ id, name }, index) => {
                                        console.log(materialStandardOptions)
                                        return <Select.Option key={ index } value={ id }>
                                            { name }
                                        </Select.Option>
                                    }) }
                                </Select>
                            )
                        }, {
                            label: '原材料要求',
                            name: 'materialDemand',
                            initialValue: task?.materialDemand,
                            children: <Input disabled/>
                        },  {
                            label: '焊接要求',
                            name: 'weldingDemand',
                            initialValue: task?.weldingDemand,
                            children: <Input disabled/>
                        }, {
                            label: '包装要求',
                            name: 'packDemand',
                            initialValue: task?.packDemand,
                            children: <Input disabled/>
                        }, {
                            label: '镀锌要求',
                            name: 'galvanizeDemand',
                            initialValue: task?.galvanizeDemand,
                            children: <Input disabled/>
                        }, {
                            label: '备注',
                            name: 'peculiarDescription',
                            initialValue: task?.peculiarDescription,
                            children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息" disabled/>
                        }]
                    }]];
                    break;
                
          }
          return module
          
     }
    //步骤
    public steps: StepTitleItem[] = [
        StepTitleItem.NEW_TASK,
        StepTitleItem.COMPLETE_SPECIAL_OPTIONS,
        StepTitleItem.COMPLETE_PRODUCT_INFO
    ]

    //底部按钮
    protected renderExtraOperationArea(): React.ReactNode {
            const { checkStep } = this.state;
            return (
                <Space className={styles.column_to_row}> 
                    
                    {checkStep !== StepItem.COMPLETE_PRODUCT_INFO ?
                        <Button 
                            type="primary" 
                            htmlType="button" 
                            onClick={ this.onSubmitAndContinue }
                        >
                            保存并转交下一节点
                        </Button> 
                    : null}
                    {/* {checkStep !== StepItem.NEW_TASK ? 
                        <Button 
                            type="primary" 
                            htmlType="button" 
                            onClick={ this.onSubmitAndBack }
                        >
                            保存并返回到上一节点
                        </Button> 
                    : null} */}
                </Space>
            );
    }
    //底部保存按钮
    public getPrimaryOperationButtonLabel() {
        return this.state.checkStep === StepItem.COMPLETE_PRODUCT_INFO ? '保存并提交审批' : '保存'
    }


    //下一步
    public async onSubmitAndContinue() {
       
        this.getForm()?.validateFields().then(async ()=>{
            // if(!err.errorFields.length){
                const{ checkStep, task } = this.state;
                let data = task || {};
                const values = this.getForm()?.getFieldsValue(true);
                values.productIds = this.state.selectedKeys.length > 0 ? this.state.selectedKeys : [];
                values.taskInfoDTO = this.state.taskInfoDTO;
                values.saleOrderId = this.state?.task?.saleOrderId;
                console.log(values.deliverTime)
                const taskId: number = await RequestUtil.post('/tower-market/taskNotice/saveToNextStep', {
                    ...values,
                    id:this.state?.task?.id,
                    planDeliveryTime:moment(values.planDeliveryTime).format('YYYY-MM-DD'),
                    deliveryTime: values.deliveryTime && moment(values.deliveryTime).format('YYYY-MM-DD') || '',
                    orderDeliveryTime: moment(values.orderDeliveryTime).format('YYYY-MM-DD') || '',
                });
                data.id = taskId
                this.setState({
                    task: data,
                    checkStep: checkStep + 1,
                })
            // }
        }).catch(err => {
            console.log(err)
        })
        
        
    }
    

    //上一步
    public onSubmitAndBack = () => {
        const{ checkStep } = this.state;
        this.setState({
            checkStep: checkStep - 1
        })
    }


    /**
     * @description Renders extra sections
     * @returns extra sections 
     */
  
    public renderExtraSections(): IRenderedSection[] {
        const { checkStep, productDataSource } = this.state;
        console.log(productDataSource)
        return [{
            title:'',
            render:():React.ReactNode => {
                return (
                    <>
                    {checkStep === StepItem.COMPLETE_PRODUCT_INFO ?
                        <>
                            <div className={styles.column_to_row}>
                                <div className={styles.title}>产品信息</div>
                                <ProductSelectionComponent onSelect={ this.onProductSelect }  saleOrderId={ this.state?.task?.saleOrderId } selectKey={this.state.productDataSource}/>
                            </div>
                            <Table 
                                columns={this.columns()} 
                                dataSource={ [...productDataSource] } 
                                scroll={{ x: 1300 }} 
                                // rowKey={( record: IProduct ) => record?.id? record?.id : ''}
                                // rowSelection={{
                                //     type:'checkbox',
                                //     onChange:( selectedKeys: React.Key[] )=>{
                                //         this.setState({
                                //             selectedKeys
                                //         })
                                //     }
                                // }}
                            />
                        </>
                    :null}
                    </>
                )
            }
        }]

    }

    //table-column
    public columns(): TableColumnType<IProduct>[] {

        const { productDataSource } = this.state;

        return [
            {
                title: '状态',
                width: 100,
                dataIndex: 'productStatus',
                key: 'productStatus',
                render:(productStatus:number)=>{
                    return productStatus === 1 ? '待下发' : productStatus === 2 ? '审批中' : '已下发'
                }
            },
            {
                title: '线路名称',
                width: 150,
                dataIndex: 'lineName',
                key: 'lineName',
            },
            { 
                title: '产品类型', 
                dataIndex: 'productTypeName', 
                key: 'productTypeName' 
            },
            { 
                title: '塔型', 
                dataIndex: 'productCategoryName', 
                key: 'productCategoryName' 
            },
            { 
                title: '杆塔号', 
                dataIndex: 'productNumber', 
                key: 'productNumber' 
            },
            { 
                title: '电压等级（KV）', 
                dataIndex: 'voltageGradeName', 
                key: 'voltageGradeName',
                width: 150 
            },
            { 
                title: '呼高（米）',
                dataIndex: 'productHeight', 
                key: 'productHeight' 
            },
            { 
                title: '单位', 
                dataIndex: 'unit', 
                key: 'unit' 
            },
            { 
                title: '数量', 
                dataIndex: 'num', 
                key: 'num' 
            },
            { 
                title: '标段', 
                dataIndex: 'tender', 
                key: 'tender' 
            },
            { 
                title: '备注', 
                dataIndex: 'description', 
                key: 'description' 
            },
            {
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 100,
                render: ( record: IProduct ): React.ReactNode => 
                        <ConfirmableButton 
                            confirmTitle="要删除该条数据吗？"
                            type="link" 
                            placement="topRight"
                            onConfirm={ () => {
                                let num:number = 0;
                                productDataSource.map(({ id }, index: number)=>{
                                    if( id == record.id ){
                                        num = index;
                                    }
                                })
                                productDataSource.splice(num, 1);
                                this.setState({
                                    productDataSource
                                })
                            }}
                        >
                            <DeleteOutlined />
                        </ConfirmableButton>
            },
        ];
    }

    //标题
    protected getTitle(): string {
        return this.steps[this.state.checkStep];
    }
    public render() {
        return (
            <> 
                <Steps 
                    current={ this.state.checkStep } 
                    type="navigation"
                    size="small"
                >
                    {this.steps.map(item => (
                        <Step key={item} title={item} />
                    ))}
                </Steps>
                { super.render() }
            </>
        );
        
    }
  }

function saleOrderNumber(saleOrderNumber: any): any {
    throw new Error('Function not implemented.');
}
