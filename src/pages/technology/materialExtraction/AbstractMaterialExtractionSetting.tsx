/**
 * @author lxy
 * @copyright © 2021 
 */

 import { FormProps, Input,  Select, TablePaginationConfig, Tabs, Table, TableColumnType } from 'antd';
 import React from 'react';
 import { RouteComponentProps } from 'react-router';
 import AbstractFillableComponent, {
     IAbstractFillableComponentState,
     IFormItemGroup,
 } from '../../../components/AbstractFillableComponent';
 import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
 import ClientSelectionComponent from '../../../components/ClientSelectionModal';
 import RequestUtil from '../../../utils/RequestUtil';
 import { DataType } from '../../../components/AbstractSelectableModal';
 import { winBidTypeOptions } from '../../../configuration/DictionaryOptions';
 import { IContract } from '../../IContract';
 const { TabPane } = Tabs;
 export interface IAbstractMaterialExtractionSettingState extends IAbstractFillableComponentState {
     readonly tablePagination: TablePaginationConfig;
     readonly contract: IContractInfo;
     readonly tableDataSource: [];
     readonly regionInfoData: [] | IRegion[];
     readonly childData: [] | undefined;
     readonly col: [];
 }
 
 export interface ITabItem {
     readonly label: string;
     readonly key: string | number;
 }
 
 export interface IContractInfo extends IContract {
     readonly customerInfoDto?: ICustomerInfoDto;
     paymentPlanDtos?: IPaymentPlanDto[];
     attachInfoDtos: IAttachDTO[];
     readonly customerInfoVo?: ICustomerInfoDto;
     readonly attachVos: IAttachDTO[];
     readonly paymentPlanVos?: IPaymentPlanDto[];
 }
 
 export interface ICustomerInfoDto {
     readonly customerId?: string | number;
     readonly customerCompany?: string;
     readonly customerLinkman?: string;
     readonly customerPhone?: string;
 }
 
 export interface IPaymentPlanDto {
     readonly index?: number;
     readonly period?: number;
     readonly returnedTime?: any;
     readonly returnedRate: number;
     readonly returnedAmount: number;
     readonly description?: string;
 }
 
 export interface IAttachDTO {
     readonly name?: string;
     readonly userName?: string;
     readonly fileSize?: string;
     readonly description?: string;
     readonly keyType?: string;
     readonly keyId?: number;
     readonly id?: string;
     readonly fileSuffix?: string;
     readonly filePath: string;
     readonly fileUploadTime?: string;
     readonly index?: number;
 }
 
 export interface IResponseData {
     readonly total: number | undefined;
     readonly size: number | undefined;
     readonly current: number | undefined;
     readonly parentCode: string;
     readonly records: [];
 }
 
 export interface IRegion {
     readonly name: string;
     readonly code: string;
     children: IRegion[];
 }
 
 export enum planType {
     PROPORTION = 0,   //占比
     AMOUNT = 1,   //金额
 }
 
 //tab分页
 enum tabStep {
     SEGMENT_NUMBER_SETTING = '1',              //未变更
     COMPONENT_DETAILS = '2',         //新增引用       
 }
 /**
  * Abstract Contract Setting
  */
 export default abstract class AbstractMaterialExtractionSetting<P extends RouteComponentProps, S extends IAbstractMaterialExtractionSettingState> extends AbstractFillableComponent<P, S> {
 
     public state: S = {
         contract: {},
     } as S;
 
     public async componentDidMount() {
         super.componentDidMount();
 
     }
 
     /**
      * @override
      * @description Gets return path
      * @returns return path 
      */
     protected getReturnPath(): string {
         return '/prom/contract';
     }
 
      /**
     * @description Renders extra operation area
     * @returns extra operation area 
     */
     protected renderExtraOperationArea(): React.ReactNode {
         return null;
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
                 span: 16,
                 offset: 1
             }
         };
     }
 

 

 

 
     /**
      * @override
      * @description 弹窗
      * @returns 
      */
     public onSelect = (selectedRows: DataType[]):void => {
         const contract: IContractInfo | undefined = this.state.contract;
         if(selectedRows && selectedRows.length > 0 ) {
             this.setState({
                 contract: {
                     ...(contract || {}),
                     signCustomerName: selectedRows[0].name,
                     signCustomerId: selectedRows[0].id?.toString()
                 }
             })
             this.getForm()?.setFieldsValue({ signCustomerName: selectedRows[0].name });
         }
     }
 


 


 

 
     /**
      * @implements
      * @description Gets form item groups
      * @returns form item groups 
      */
     public getFormItemGroups(): IFormItemGroup[][] {
             const contract: IContractInfo | undefined = this.state.contract;
             return [[{
                 title: '基础信息',
                 itemCol: {
                     span: 8
                 },
                 itemProps: [{
                     label: '批次号',
                     name: 'simpleProjectName',
                     initialValue: contract?.simpleProjectName,
                     rules: [{
                        required: true,
                        message: '请填写批次号'
                    }],
                     children: <Input maxLength={ 50 }/>
                 }, {
                     label: '材料标准',
                     name: 'winBidType', 
                     initialValue: contract?.winBidType,
                     rules: [{
                        required: true,
                        message: '请选择材料标准'
                     }],
                     children: (
                         <Select getPopupContainer={ triggerNode => triggerNode.parentNode }>
                             { winBidTypeOptions && winBidTypeOptions.map(({ id, name }, index) => {
                                 return <Select.Option key={ index } value={ id }>
                                     { name }
                                 </Select.Option>
                             }) }
                         </Select>
                     )
                 }, {
                     label: '任务单编号',
                     name: 'signCustomerName',
                     initialValue: contract?.signCustomerName,
                     rules: [{
                         required: true,
                         message: '请选择任务单编号'
                     }],
                     children:
                        <>
                            <Input value={ contract?.signCustomerName } suffix={ 
                                <ClientSelectionComponent onSelect={ this.onSelect } selectKey={ [contract.signCustomerId] }/>
                            }/>
                        </>
                 }, {
                    label: '塔型',
                    name: 'customerLinkman',
                    initialValue: contract?.customerInfoDto?.customerLinkman,
                    children:   
                        <>
                            <Input value={ contract?.signCustomerName } suffix={ 
                                <ClientSelectionComponent onSelect={ this.onSelect } selectKey={ [contract.signCustomerId] }/>
                            }/>
                        </>
                 }, {
                    label: '钢印塔型',
                    name: 'customerPhone',
                    initialValue: contract?.customerInfoDto?.customerPhone,
                    children: <Input value={ contract?.customerInfoDto?.customerPhone } disabled/>
                 }, {
                    label: '工程名称',
                    name: 'customerPhone',
                    initialValue: contract?.customerInfoDto?.customerPhone,
                    children: <Input value={ contract?.customerInfoDto?.customerPhone } disabled/>
                 }, {
                     label: '备注',
                     name: 'description',
                     initialValue: contract?.description,
                     children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
                 }]}
        ]];
     };
 
    public getComponentColumns(): TableColumnType<object>[] {
        return [{
           key: 'materialCode',
           title: '序号',
           dataIndex: 'materialCode',
           align: "center",
           width: 50,
        },{
           key: 'productName',
           title: '构件编号',
           dataIndex: 'productName',
           align: "center",
           width: 200,
        },{
           key: 'rowMaterial',
           title: '材料',
           dataIndex: 'rowMaterial',
           align: "center",
           width: 200,
        },{
           key: 'materialTexture',
           title: '材质',
           dataIndex: 'materialTexture',
           align: "center",
           width: 200,
        },{
           key: 'spec',
           title: '规格',
           dataIndex: 'spec',
           align: "center",
           width: 200,
        },{
           key: 'unitName',
           title: '宽度（mm）',
           dataIndex: 'unitName',
           align: "center",
           width: 200,
        },{
           key: 'proportion',
           title: '厚度（mm）',
           dataIndex: 'proportion',
           align: "center",
           width: 200,
        },{
           key: 'weightAlgorithm',
           title: '长度（mm）',
           dataIndex: 'weightAlgorithm',
           align: "center",
           width: 200,
        },{
           key: 'description',
           title: '单段数量',
           dataIndex: 'description',
           align: "center",
           width: 200,
        },{
            key: 'description',
            title: '合计数量',
            dataIndex: 'description',
            align: "center",
            width: 200,
        },{
            key: 'description',
            title: '理算重量（kg）',
            dataIndex: 'description',
            align: "center",
            width: 200,
        },{
            key: 'description',
            title: '单件重量（kg）',
            dataIndex: 'description',
            align: "center",
            width: 200,
        },{
            key: 'description',
            title: '单段小计重量（kg）',
            dataIndex: 'description',
            align: "center",
            width: 200,
        },{
            key: 'description',
            title: '合计重量（kg）',
            dataIndex: 'description',
            align: "center",
            width: 200,
        },{
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            align: "center",
            width: 500,
        }]
    };


    public getSegmentColumns(): TableColumnType<object>[] {
        return [{
           key: 'materialCode',
           title: '段号',
           dataIndex: 'materialCode',
           align: "center",
        },{
           key: 'productName',
           title: '本次提料段数',
           dataIndex: 'productName',
           align: "center",
           render:(text, record, index)=>{
                return  <Input  defaultValue={text} onChange={e => this.handleFields(index, 'materialCode', e.target.value)}/>
           }
        },{
           key: 'shortcutCode',
           title: '已提料段数',
           dataIndex: 'shortcutCode',
           align: "center",
        }]
    };
 
    public handleFields = (index:number, fieldKey:string, value:string) => {
        // let data = this.state?.materialData;
        // if(data){
        //     let row = data[index];
        //     console.log(row)
        //     row[fieldKey]= value;
        //     // this.setState({
        //     //     materialData:data
        //     // })
        // };
    }
 
     /**
      * @description Renders extra sections
      * @returns extra sections 
      */
     public renderExtraSections(): IRenderedSection[] {
         const contract: IContractInfo | undefined = this.state.contract;
         return [{
             title: '其他信息',
             render: (): React.ReactNode => {
                 return (
                    <Tabs defaultActiveKey={ tabStep.SEGMENT_NUMBER_SETTING } >
                        <TabPane tab="段数设置" key={ tabStep.SEGMENT_NUMBER_SETTING }>
                            <Table columns={this.getSegmentColumns()} dataSource={[{},{},{}]}/>
                        </TabPane>
                        <TabPane tab="查看构建明细" key={ tabStep.COMPONENT_DETAILS } >
                            <Table columns={this.getComponentColumns()} scroll={{ x:1200 }}/>
                        </TabPane>
                  </Tabs>
                 );
             }
         }];
     }
 }
 
 