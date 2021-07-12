/**
 * @author lxy
 * @copyright © 2021 
 */

 import { FormProps, Input,  Select, TablePaginationConfig, Tabs, Table, TableColumnType, InputNumber } from 'antd';
 import React from 'react';
 import { RouteComponentProps } from 'react-router';
 import AbstractFillableComponent, {
     IAbstractFillableComponentState,
     IFormItemGroup,
 } from '../../../components/AbstractFillableComponent';
 import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
 import TaskSelectionComponent from '../../../components/TaskSelectionModal';
 import TowerSelectionComponent from '../../../components/TowerSelectionModal';
 import RequestUtil from '../../../utils/RequestUtil';
 import { DataType } from '../../../components/AbstractSelectableModal';
 import { materialStandardOptions } from '../../../configuration/DictionaryOptions';
 import { IDetail, IMaterialExtraction, IParagraph } from './IMaterialExtraction';
 const { TabPane } = Tabs;
 export interface IAbstractMaterialExtractionSettingState extends IAbstractFillableComponentState {
     readonly tablePagination: TablePaginationConfig;
     readonly materialExtraction: IMaterialExtractionInfo;
     readonly paragraphDataSource: [] | IParagraph[];
     readonly detailDataSource:  [] | IDetail[];
     readonly tableDataSource: [];
 }
 
 export interface ITabItem {
     readonly label: string;
     readonly key: string | number;
 }
 
 export interface IMaterialExtractionInfo extends IMaterialExtraction {
     readonly taskNoticeId: string;
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
 
 const title = {
     border:'1px solid #d9d9d9',
     width: '100%'
 }

 const titleC = {
     border:'1px solid red',
     width: '100%'
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
         materialExtraction: {},
         paragraphDataSource: [],
         detailDataSource: [],
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
         return '/prom/materialExtraction';
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
         const materialExtraction: IMaterialExtractionInfo | undefined = this.state.materialExtraction;
         if(selectedRows && selectedRows.length > 0 ) {
            //  this.setState({
            //      materialExtraction: {
            //          ...(materialExtraction || {}),
            //          signCustomerName: selectedRows[0].name,
            //          signCustomerId: selectedRows[0].id?.toString()
            //      }
            //  })
            //  this.getForm()?.setFieldsValue({ signCustomerName: selectedRows[0].name });
         }
     }
 


 


 

 
     /**
      * @implements
      * @description Gets form item groups
      * @returns form item groups 
      */
     public getFormItemGroups(): IFormItemGroup[][] {
             const materialExtraction: IMaterialExtractionInfo | undefined = this.state.materialExtraction;
             return [[{
                 title: '基础信息',
                 itemCol: {
                     span: 8
                 },
                 itemProps: [{
                     label: '批次号',
                     name: 'batchSn',
                     initialValue: materialExtraction?.batchSn,
                     rules: [{
                        required: true,
                        message: '请填写批次号'
                    }],
                     children: <Input maxLength={ 20 }/>
                 }, {
                     label: '材料标准',
                     name: 'materialStandard', 
                     initialValue: '' || materialStandardOptions && materialStandardOptions.length > 0 && materialStandardOptions[0].id,
                     rules: [{
                        required: true,
                        message: '请选择材料标准'
                     }],
                     children: (
                        <Select >
                            { materialStandardOptions && materialStandardOptions.map(({ id, name }, index) => {
                                return <Select.Option key={ index } value={ id }>
                                    { name }
                                </Select.Option>
                            }) }
                        </Select>
                     )
                 }, {
                     label: '任务单编号',
                     name: 'taskNumber',
                     initialValue: materialExtraction?.taskNumber,
                     rules: [{
                         required: true,
                         message: '请选择任务单编号'
                     }],
                     children:
                        <Input value={ materialExtraction?.taskNumber } suffix={ 
                            <TaskSelectionComponent onSelect={ this.onSelect } selectKey={ [materialExtraction] }/>
                        }/>
                 }, {
                    label: '塔型',
                    name: 'customerLinkman',
                    initialValue: materialExtraction?.productShape,
                    children:   
                        <Input value={ materialExtraction?.productShape } suffix={ 
                            <TowerSelectionComponent onSelect={ this.onSelect } selectKey={ [materialExtraction.taskNoticeId] }/>
                        }/>
                 }, {
                    label: '钢印塔型',
                    name: 'embossedStamp',
                    initialValue: materialExtraction?.embossedStamp,
                    children: <Input value={ materialExtraction?.embossedStamp } disabled/>
                 }, {
                    label: '工程名称',
                    name: 'projectName',
                    initialValue: materialExtraction?.projectName,
                    children: <Input value={ materialExtraction?.projectName } disabled/>
                 }, {
                     label: '备注',
                     name: 'description',
                     initialValue: materialExtraction?.description,
                     children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
                 }]}
        ]];
     };
 
    public getComponentColumns(): TableColumnType<object>[] {
        return [{
           key: 'partNum',
           title: '序号',
           dataIndex: 'partNum',
           align: "center",
           width: 50,
        },{
           key: 'componentCode',
           title: '构件编号',
           dataIndex: 'componentCode',
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
           key: 'width',
           title: '宽度（mm）',
           dataIndex: 'width',
           align: "center",
           width: 200,
        },{
           key: 'thickness',
           title: '厚度（mm）',
           dataIndex: 'thickness',
           align: "center",
           width: 200,
        },{
           key: 'length',
           title: '长度（mm）',
           dataIndex: 'length',
           align: "center",
           width: 200,
        },{
           key: 'number',
           title: '单段数量',
           dataIndex: 'number',
           align: "center",
           width: 200,
        },{
            key: 'totalQuantity',
            title: '合计数量',
            dataIndex: 'totalQuantity',
            align: "center",
            width: 200,
        },{
            key: 'accurateWeight',
            title: '理算重量（kg）',
            dataIndex: 'accurateWeight',
            align: "center",
            width: 200,
        },{
            key: 'singleWeight',
            title: '单件重量（kg）',
            dataIndex: 'singleWeight',
            align: "center",
            width: 200,
        },{
            key: 'subtotalWeight',
            title: '单段小计重量（kg）',
            dataIndex: 'subtotalWeight',
            align: "center",
            width: 200,
        },{
            key: 'totalWeight',
            title: '合计重量（kg）',
            dataIndex: 'totalWeight',
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
           key: 'sectionSn',
           title: '段号',
           dataIndex: 'sectionSn',
           align: "center",
        },{
           key: 'sectionCount',
           title: '* 本次提料段数',
           dataIndex: 'sectionCount',
           align: "center",
           render:(text, record, index)=>{
                return  <InputNumber min={0} defaultValue={text} onChange={value => this.handleFields(index,value)} style={ text? title : titleC } bordered={false} precision={0} max={(record as IParagraph).sectionTotalCount}/>
            }
        },{
           key: 'sectionTotalCount',
           title: '已提料段数',
           dataIndex: 'sectionTotalCount',
           align: "center",
        }]
    };
 
    public handleFields = (index:number, value:string) => {
        // let data = this.state?.materialData;
        // if(data){
        //     let row = data[index];
        //     row.sectionCount= value;
            // this.setState({
            //     materialData:data
            // })
        // };
    }
 
     /**
      * @description Renders extra sections
      * @returns extra sections 
      */
     public renderExtraSections(): IRenderedSection[] {
         const { paragraphDataSource, detailDataSource } = this.state;
         return [{
             title: '其他信息',
             render: (): React.ReactNode => {
                 return (
                    <Tabs defaultActiveKey={ tabStep.SEGMENT_NUMBER_SETTING } >
                        <TabPane tab="段数设置" key={ tabStep.SEGMENT_NUMBER_SETTING }>
                            <Table columns={this.getSegmentColumns()} dataSource={ paragraphDataSource }/>
                        </TabPane>
                        <TabPane tab="查看构建明细" key={ tabStep.COMPONENT_DETAILS } >
                            <Table columns={this.getComponentColumns()} scroll={{ x:1200 }} dataSource={ detailDataSource }/>
                        </TabPane>
                  </Tabs>
                 );
             }
         }];
     }
 }
 
 