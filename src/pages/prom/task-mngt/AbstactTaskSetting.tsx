/**
 * @author zyc
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
 } from 'antd';
 import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
 import moment from 'moment';
 import React from 'react';
 import { RouteComponentProps } from 'react-router';
 import { Link } from 'react-router-dom';
 
 import AbstractFillableComponent, {
     IAbstractFillableComponentState,
     IFormItemGroup,
 } from '../../../components/AbstractFillableComponent';
 import ConfirmableButton from '../../../components/ConfirmableButton';
 import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
 import styles from './AbstractTaskSetting.module.less';
 const { Step } = Steps
 // import ModalComponent from '../../components/ModalComponent';
  
 export interface IAbstractTaskSettingState extends IAbstractFillableComponentState {
     visible: boolean | undefined;
     current: number;
     readonly task?: ITask;
     readonly taskTable?: IProductInfoVOList[];
     
 }
 
 export interface ITask {
    readonly contractId?: number;	
    readonly createTime?: string;
    readonly createUserName?: string;
    readonly customerCompany?: string;	
    readonly deliveryTime?:	string;	
    readonly description?: string;		
    readonly galvanizeDemand?:string;	
    readonly internalNumber?: string;	
    readonly materialDemand?: string;
    readonly materialStandard?:	number | string;
    readonly packDemand?: string;	
    readonly peculiarDescription?:	string;
    readonly planDeliveryTime?:	string;
    readonly productChangeInfoVOList?: object [];	
    readonly productInfoVOList?: IProductInfoVOList [];
    readonly projectName?: string;
    readonly saleOrderNumber?: string;	
    readonly signContractTime?:	string;	
    readonly signCustomerName?:	string;		
    readonly simpleProjectName?: string;	
    readonly taskNumber?: string;		
    readonly weldingDemand?: string;
 }
 
 export interface IProductInfoVOList {
    readonly description?:	string;	
    readonly lineName?:	string;	
    readonly num?: number;		
    readonly price?: number;	
    readonly productHeight?: number;
    readonly productNumber?: string;	
    readonly productShape?:	string;	
    readonly productStatus?: number;	
    readonly productTypeName?: string;
    readonly saleOrderId?: number;	
    readonly taskNoticeId?: number;	
    readonly tender?: string;	
    readonly totalAmount?: number;	
    readonly unit?:	string;
    readonly voltageGradeName?:	string;
 }
 
 export interface IproductInfoDto {
     readonly productType?: string;
     readonly voltageGrade?: number;
 }
 
 

 
 export interface DataType {
     key: React.Key;
     name: string;
     age: number;
     address: string;
 }
 
 /**
  * Abstract Task Setting
  */
 export default abstract class AbstractTaskSetting<P extends RouteComponentProps, S extends IAbstractTaskSettingState> extends AbstractFillableComponent<P, S> {
  
     public state: S = {
        task: undefined,
        visible: false,
        current: 0,
     } as S;
 
     constructor(props: P) {
         super(props)
         this.showModal = this.showModal.bind(this)
         this.closeModal = this.closeModal.bind(this)
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
 
     public checkChange(record: Record<string, any>): void {
         console.log(record)
     }

 
     public showModal(): void {
         this.setState({
             visible: true
         })
     }
 
     public closeModal(): void {
         this.setState({
             visible: false
         })
     }
 
     /**
      * @implements
      * @description Gets form item groups
      * @returns form item groups 
      */
     public getFormItemGroups(): IFormItemGroup[][] {
          const task: ITask | undefined = this.state.task;
          const GeneratNum: string = this.getGeneratNum();
          const { current } = this.state;
          let module: IFormItemGroup[][] = [];
          switch(current){
                case 0:
                    module = [[{
                        title: '基础信息',
                        itemCol: {
                            span: 8
                        },
                        itemProps: [{
                            label: '任务编号',
                            name: 'taskNumber',
                            initialValue: task?.taskNumber,
                            rules: [{
                                required: true,
                                message: '请输入任务编号'
                            }],
                            children: <Input disabled value={task?.taskNumber}/>
                        }, {
                            label: '关联订单',
                            name: 'saleOrderNumber',
                            initialValue: task?.saleOrderNumber,
                            rules: [{
                                required: true,
                                message: '请选择关联订单'
                            }],
                            children: 
                                <>
                                    <Input suffix={
                                        <Button type="primary" onClick={this.showModal}>
                                            Open Modal
                                        </Button>  
                                    }/>
                                    {/* <ModalComponent isModalVisible={ this.state.visible || false } confirmTitle="选择客户" handleOk={ this.closeModal} handleCancel={ this.closeModal }/> */}
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
                            name: 'signContractTime',
                            initialValue: moment(task?.signContractTime),
                            rules: [{
                                required: true,
                                message: '请选择订单交货日期'
                            }],
                            children:  <DatePicker disabled/>
                        }, {
                            label: '客户交货日期',
                            name: 'deliveryTime',
                            initialValue: moment(task?.deliveryTime),
                            rules: [{
                                required: true,
                                message: '请选择客户交货日期'
                            }],
                            children:  <DatePicker />
                        }, {
                            label: '计划交货日期',
                            name: 'planDeliveryTime',
                            initialValue: moment(task?.planDeliveryTime),
                            rules: [{
                                required: true,
                                message: '计划交货日期'
                            }],
                            children:  <DatePicker />
                        }, {
                            label: '备注',
                            name: 'description',
                            initialValue: task?.description,
                            children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
                        }]
                    }]];
                    break;
                case 1:
                    module = [[{
                        title: '基础信息',
                        itemCol: {
                            span: 8
                        },
                        itemProps: [{
                            label: '任务编号',
                            name: 'taskNumber',
                            initialValue: task?.taskNumber,
                            rules: [{
                                required: true,
                                message: '请输入任务编号'
                            }],
                            children: <Input disabled value={task?.taskNumber}/>
                        }, {
                            label: '关联订单',
                            name: 'saleOrderNumber',
                            initialValue: task?.saleOrderNumber,
                            rules: [{
                                required: true,
                                message: '请选择关联订单'
                            }],
                            children: 
                                <>
                                    <Input suffix={
                                        <Button type="primary" onClick={this.showModal}>
                                            Open Modal
                                        </Button>  
                                    }
                                        disabled
                                    />
                                    {/* <ModalComponent isModalVisible={ this.state.visible || false } confirmTitle="选择客户" handleOk={ this.closeModal} handleCancel={ this.closeModal }/> */}
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
                            name: 'signContractTime',
                            initialValue: moment(task?.signContractTime),
                            rules: [{
                                required: true,
                                message: '请选择订单交货日期'
                            }],
                            children:  <DatePicker disabled/>
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
                                message: '计划交货日期'
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
                            initialValue: task?.materialStandard || 1,
                            children: (
                                <Select>
                                    <Select.Option value={ 1 }>国家电网</Select.Option>
                                    <Select.Option value={ 2 }>南方电网</Select.Option>
                                </Select>
                            )
                        }, {
                            label: '原材料要求',
                            name: 'materialDemand',
                            initialValue: task?.materialDemand,
                            rules: [{
                                required: true,
                                message: '请输入原材料要求'
                            }],
                            children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
                        },  {
                            label: '焊接要求',
                            name: 'weldingDemand',
                            initialValue: task?.weldingDemand,
                            rules: [{
                                required: true,
                                message: '请输入焊接要求'
                            }],
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
                case 2:
                    module = [[{
                        title: '基础信息',
                        itemCol: {
                            span: 8
                        },
                        itemProps: [{
                            label: '任务编号',
                            name: 'taskNumber',
                            initialValue: task?.taskNumber,
                            rules: [{
                                required: true,
                                message: '请输入任务编号'
                            }],
                            children: <Input disabled/>
                        }, {
                            label: '关联订单',
                            name: 'saleOrderNumber',
                            initialValue: task?.saleOrderNumber,
                            rules: [{
                                required: true,
                                message: '请选择关联订单'
                            }],
                            children: 
                                <>
                                    <Input suffix={
                                        <Button type="primary" onClick={this.showModal}>
                                            Open Modal
                                        </Button>  
                                    }
                                        disabled    
                                    />
                                    {/* <ModalComponent isModalVisible={ this.state.visible || false } confirmTitle="选择客户" handleOk={ this.closeModal} handleCancel={ this.closeModal }/> */}
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
                            name: 'signContractTime',
                            initialValue: moment(task?.signContractTime),
                            rules: [{
                                required: true,
                                message: '请选择订单交货日期'
                            }],
                            children:  <DatePicker disabled/>
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
                                message: '计划交货日期'
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
                            initialValue: task?.materialStandard || 1,
                            children: (
                                <Select disabled>
                                    <Select.Option value={ 1 }>国家电网</Select.Option>
                                    <Select.Option value={ 2 }>南方电网</Select.Option>
                                </Select>
                            )
                        }, {
                            label: '原材料要求',
                            name: 'materialDemand',
                            initialValue: task?.materialDemand,
                            rules: [{
                                required: true,
                                message: '请输入原材料要求'
                            }],
                            children: <Input disabled/>
                        },  {
                            label: '焊接要求',
                            name: 'weldingDemand',
                            initialValue: task?.weldingDemand,
                            rules: [{
                                required: true,
                                message: '请输入焊接要求'
                            }],
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
    public steps=[
        {
            title: '创建任务单',
        },
        {
            title: '完善特殊要求',
        },
        {
            title: '完善产品信息',
        },
    ];

    protected renderSaveAndContinue(): React.ReactNode {
            const { current } = this.state;
            return (
                <Space className={styles.column_to_row}> 
                    
                    {current !== 2?
                        <Button 
                            type="primary" 
                            htmlType="button" 
                            onClick={ this.onSubmitAndContinue }
                        >
                            保存并转交下一节点
                        </Button> 
                    : null}
                    {/* {current !== 0? 
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
    public onSubmitAndContinue = () => {
        const{ current } = this.state;
        this.setState({
            current:current+1
        })
    } 
    public onSubmitAndBack = () => {
        const{ current } = this.state;
        this.setState({
            current:current-1
        })
    }

    /**
     * @description Renders extra sections
     * @returns extra sections 
     */
  
    public renderExtraSections():IRenderedSection[]{
        const { current, taskTable } = this.state;
        return [{
            title:'',
            render:():React.ReactNode=>{
                return (
                    <>
                    {current===2?
                        <>
                            <div className={styles.column_to_row}>
                                <div className={styles.title}>产品信息</div>
                                <Button type='primary' onClick={()=>{
                                    this.setState({
                                        taskTable:taskTable
                                    })
                                }}>新增</Button>
                            </div>
                            <Table 
                                columns={this.columns()} 
                                dataSource={taskTable} 
                                scroll={{ x: 1300 }} 
                                rowSelection={this.rowSelection}
                            />
                        </>
                    :null}
                    </>
                )
            }
        }]

    }
    //rowSelect
    public rowSelection = {
        onSelect: (record: IProductInfoVOList, selected: any, selectedRows: any, nativeEvent: any) => {
            // setSelectRows(selectedRows);
        },
        onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
            // setSelectRows(selectedRows);
        }
    };
    //table-column
    public columns= () => {
        return [
            {
                title: '状态',
                width: 100,
                dataIndex: 'productStatus',
                key: 'productStatus',
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
                dataIndex: 'productShape', 
                key: 'productShape' 
            },
            { 
                title: '杆塔号', 
                dataIndex: 'productNumber', 
                key: 'productNumber' 
            },
            { 
                title: '电压等级', 
                dataIndex: 'voltageGradeName', 
                key: 'voltageGradeName' 
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
            render: () => 
                    <ConfirmableButton 
                        confirmTitle="要删除该条回款计划吗？"
                        type="link" 
                        placement="topRight"
                        // onConfirm={ () => { operation.remove(index); } }
                    >
                        <DeleteOutlined />
                    </ConfirmableButton>
            },
        ];
    }
    protected getTitle(): string {
        const { current } = this.state;
        let title = '';
        switch (current){
            case 0: 
                title = '创建任务单';
                break;
            case 1: 
                title = '完善特殊要求';
                break;
            case 2: 
                title =' 完善产品信息';
                break;
        }
        return title;
    }
    public render(){
        console.log(this.state.current)
        return (
            <> 
                <Steps 
                    current={this.state.current} 
                    type="navigation"
                    size="small"
                >
                    {this.steps.map(item => (
                    <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                { super.render() }
            </>
        );
        
    }
  }