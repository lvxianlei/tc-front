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
 import { IDetail, IMaterialExtraction, IParagraph, ITower } from './IMaterialExtraction';
import { RuleObject } from 'antd/lib/form';
 const { TabPane } = Tabs;
 export interface IAbstractMaterialExtractionSettingState extends IAbstractFillableComponentState {
     readonly tablePagination: TablePaginationConfig;
     readonly materialExtraction: IMaterialExtraction;
     readonly paragraphDataSource: [] | IParagraph[];
     readonly detailDataSource:  [] | IDetail[];
     readonly tableDataSource: [];
     readonly dataSource: []| ITower[];
 }
 
 export interface ITabItem {
     readonly label: string;
     readonly key: string | number;
 }
 

 
 export  interface DataTypeMore extends DataType{
   readonly productCategoryName?: string;
   readonly taskNumber?: string;
   readonly steelProductShape?: string;
 }
 
 export interface IResponseProduct{
     readonly extractionMaterialComponentVO: IDetail[];
     readonly extractionMaterialSectionVO: IParagraph[];
 }

 
 export interface IResponseData {
     readonly total: number | undefined;
     readonly size: number | undefined;
     readonly current: number | undefined;
     readonly parentCode: string;
     readonly records: [];
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
         dataSource:[],
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
         return '/technology/materialExtraction';
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
     public onSelect = async (selectedRows: DataTypeMore[]):Promise<void> => {
         const materialExtraction: IMaterialExtraction | undefined = this.state.materialExtraction;
         
         if(selectedRows && selectedRows.length > 0 ) {
            this.setState({
                materialExtraction: {
                    ...materialExtraction,
                    projectName: selectedRows[0].projectName,
                    taskNumber: selectedRows[0].taskNumber,
                    taskNoticeId: selectedRows[0].id
                }
            })
            this.getForm()?.setFieldsValue({ 
                 projectName: selectedRows[0].projectName, 
                 taskNumber: selectedRows[0].taskNumber 
            });
            const resData: ITower[] = await RequestUtil.get<ITower[]>('/tower-market/extractionMaterial/getProductShape', {
                taskNoticeId: selectedRows[0].id
            });
            this.setState({
                dataSource: resData,
            });
         }
     }


     /**
      * @override
      * @description 弹窗
      * @returns 
      */
      public onSelectTower = async (selectedRows: DataTypeMore[]) => {
        const materialExtraction: IMaterialExtraction | undefined = this.state.materialExtraction;
        
        if(selectedRows && selectedRows.length > 0 ) {
            this.setState({
                materialExtraction: {
                    ...materialExtraction,
                    steelProductShape: selectedRows[0].steelProductShape,
                    productCategoryName: selectedRows[0].productCategoryName,
                    productCategoryId: selectedRows[0].id
                }
            })
            this.getForm()?.setFieldsValue({ 
                    steelProductShape: selectedRows[0].steelProductShape, 
                    productCategoryName: selectedRows[0].productCategoryName,
            });
            const resData: IResponseProduct = await RequestUtil.get<IResponseProduct>(`/tower-market/extractionMaterial/getProduct/${selectedRows[0].id}`);
            const paragraphData: IParagraph[] = resData.extractionMaterialSectionVO.map((item:IParagraph)=>{
                return {
                    ...item,
                    sectionCount:''
                }
            }) 
            this.setState({
                paragraphDataSource: paragraphData,
                detailDataSource: resData.extractionMaterialComponentVO
            });
        }
    }
 


 


 

 
     /**
      * @implements
      * @description Gets form item groups
      * @returns form item groups 
      */
     public getFormItemGroups(): IFormItemGroup[][] {
             const materialExtraction: IMaterialExtraction | undefined = this.state.materialExtraction;
             const dataSource: ITower[] = this.state.dataSource;
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
                        validator: (rule: RuleObject, value: string, callback: (error?: string) => void) => {
                            if(value && value != '') {
                                this.checkBatchSn(value).then(res => {
                                    if (res) {
                                        callback()
                                    } else {
                                        callback('批次号重复')
                                    }
                                })
                            } else {
                                callback('请输入批次号')
                            }
                        }
                    }],
                     children: <Input maxLength={ 20 } />
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
                            <TaskSelectionComponent onSelect={ this.onSelect } selectKey={ [materialExtraction && materialExtraction.taskNumber] }/>
                        }/>
                 }, {
                    label: '塔型',
                    name: 'productCategoryName',
                    initialValue: materialExtraction?.productCategoryName,
                    rules: [{
                        required: true,
                        message: '请选择塔型'
                    }],
                    children:   
                        <Input value={ materialExtraction?.productCategoryName } suffix={ 
                            <TowerSelectionComponent onSelect={ this.onSelectTower } selectKey={ [materialExtraction && materialExtraction.taskNumber] } dataSource={dataSource}/>
                        }/>
                 }, {
                    label: '钢印塔型',
                    name: 'steelProductShape',
                    initialValue: materialExtraction?.steelProductShape,
                    children: <Input value={ materialExtraction?.steelProductShape } disabled/>
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
           title: '段号',
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
           render:(text, record, index)=>(
               <InputNumber  defaultValue={ 0 } onChange={ value => this.handleFields(index,value) } style={{width:'100%'}} precision={ 0 } min={ 0 }/>
           )
        },{
           key: 'allocatedSectionCount',
           title: '已提料段数',
           dataIndex: 'allocatedSectionCount',
           align: "center",
        }]
    };
 
    public handleFields = (index:number, value:number) => {
        let paragraphData = this.state.paragraphDataSource;
        let detailData = this.state?.detailDataSource;
        if(paragraphData){
            let row = paragraphData[index];
            const dataSource: IDetail[] | undefined = detailData && detailData.map((item: IDetail)=>{
                if(item.partNum === row.sectionSn){
                    item.totalQuantity = value*item.number;
                    item.totalWeight = (value*item.subtotalWeight).toFixed(2);
                }
                return item;
            })
            row.sectionCount= value;
            this.setState({
                paragraphDataSource: paragraphData,
                detailDataSource: dataSource || []
            })
        };
    }

    /**
     * @description 验证批次号是否重复
     */
     public checkBatchSn = (value: string): Promise<void | any> =>{
        return new Promise(async (resolve, reject) => {  // 返回一个promise
            const resData = await RequestUtil.get('/tower-market/extractionMaterial/checkBatchSn', {
                batchSn: value
            });
            console.log(resData)
            if (resData) {
                resolve(resData)
            } else {
                resolve(false)
            }
        }).catch(error => {
            Promise.reject(error)
        })
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
                            <Table columns={this.getComponentColumns()} scroll={{ x:1200 }}  dataSource={ detailDataSource }/>
                        </TabPane>
                  </Tabs>
                 );
             }
         }];
     }
 }
 
 