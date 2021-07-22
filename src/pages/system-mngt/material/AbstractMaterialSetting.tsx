/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber, Select, Table, TableColumnType, TreeSelect } from 'antd';
import Form, { FormInstance, FormProps, RuleObject } from 'antd/lib/form';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { RouteComponentProps } from 'react-router';
import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../../components/AbstractFillableComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
import { IMaterial, IMaterialTree } from './IMaterial';
import { unitOptions } from '../../../configuration/DictionaryOptions';

export interface IAbstractMaterialSettingState extends IAbstractFillableComponentState {
    readonly materialData?: any;
    readonly treeData?: IMaterialTree[];
}



 /**
  * Abstract Mateiral Setting
  */
 export default abstract class AbstractMaterialSetting<P extends RouteComponentProps, S extends IAbstractMaterialSettingState> extends AbstractFillableComponent<P, S> {
    // columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[];
    constructor(props:P){
        super(props);
         
    }

     
    public state: S = {
        materialData: [],
        treeData: undefined,
    } as S;
     /**
      * @override
      * @description Gets return path
      * @returns return path 
      */
     protected getReturnPath(): string {
         return '/sys/material';
     }

    /**
     * @description Wraps role to data node
     * @param [roles] 
     * @returns role to data node 
     */
     protected wrapRole2DataNode(materials: (IMaterialTree & SelectDataNode)[] = []): SelectDataNode[] {
        materials.forEach((material: IMaterialTree & SelectDataNode): void => {
            material.title = material.treeName;
            material.value = material.id;
            if (material.children && material.children.length) {
                material.disabled = true;
                this.wrapRole2DataNode(material.children);
            }
        });
        return materials;
    }
    protected getColumn(): TableColumnType<IMaterial>[]{
        return [{
            key: 'materialCategory',
            title: `* 类型`,
            dataIndex: 'materialCategory',
            align: "center",
            width: 300,
            render:(text: string, record: IMaterial, index: number): React.ReactNode=>(
                <Form.Item name={['materialData', index, 'materialCategory']} rules= {[{
                    required: true,
                    message: '请选择类型'
                }]}>
                     <TreeSelect
                            treeData={ this.wrapRole2DataNode( this.state.treeData ) } 
                            showSearch={ true }
                            allowClear
                            onChange = {(value: any, labelList: React.ReactNode[],extra: any)=>this.materialTreeChange(value,labelList,extra,index)}
                        />
                </Form.Item>
            )
            
        },{
            key: 'materialCode',
            title: `* 物料编号`,
            dataIndex: 'materialCode',
            align: "center",
            width: 300,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'materialCode']} rules= {[{
                    required: true,
                    message: '请输入物料编号'
                },{
                    pattern: /^[^\u4e00-\u9fa5]*$/,
                    message: '禁止输入中文',
                }]}>
                    { (record as IMaterial).id?<div>{text}</div>:<Input onChange={e => this.handleFields(index, 'materialCode', e.target.value)} defaultValue={ text }   maxLength={ 20 }/> }
                </Form.Item>
            )
            
        },{
            key: 'productName',
            title: '* 品名',
            dataIndex: 'productName',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index,'productName']} rules= {[{
                    required: true,
                    message: '请输入品名'
                }, ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue(['materialData', index,'spec']) === value) {
                        return Promise.reject(new Error('不可与规格相同!'));
                      }
                      return Promise.resolve();
                    },
                })]}>
                    <Input onChange={e => this.handleFields(index, 'productName', e.target.value)}    maxLength={ 20 }/>
                </Form.Item>
            )
        },{
            key: 'shortcutCode',
            title: '快捷码',
            dataIndex: 'shortcutCode',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'shortcutCode']} >
                    <Input onChange={e => this.handleFields(index, 'shortcutCode', e.target.value)}  maxLength={ 10 }/>
                </Form.Item>
            )
        },{
            key: 'rowMaterial',
            title: '* 材料',
            dataIndex: 'rowMaterial',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'rowMaterial']} rules= {[{
                    required: true,
                    message: '请输入材料'
                }]}>
                    <Input onChange={e => this.handleFields(index, 'rowMaterial', e.target.value)}    maxLength={ 20 }/>
                </Form.Item>
            )
        },{
            key: 'materialTexture',
            title: '* 材质',
            dataIndex: 'materialTexture',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'materialTexture']} rules= {[{
                    required: true,
                    message: '请输入材质'
                }]}>
                    <Input onChange={e => this.handleFields(index, 'materialTexture', e.target.value)}   maxLength={ 20 }/>
                </Form.Item>
            )
        },{
            key: 'spec',
            title: '* 规格',
            dataIndex: 'spec',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'spec']} rules= {[{
                    required: true,
                    message: '请输入规格'
                },({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue(['materialData', index,'productName']) === value) {
                        return Promise.reject(new Error('不可与品名相同!'));
                      }
                      return Promise.resolve();
                    },
                })]}>
                    <Input onChange={e => this.handleFields(index, 'spec', e.target.value)} maxLength={ 20 }/>
                </Form.Item>
            )
        },{
            key: 'unit',
            title: '计量单位',
            dataIndex: 'unit',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'unit']}>
                    <Select style={{width:'100%'}} onChange={(value:string) => this.handleFields(index, 'unit', value)} >
                        { unitOptions && unitOptions.map(({ id, name }, index) => {
                            return <Select.Option key={ index } value={ id }>
                                { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item> 
            )
        },{
            key: 'proportion',
            title: '比重',
            dataIndex: 'proportion',
            align: "center",
            width: 200,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'proportion']}>
                    <InputNumber onChange={e => this.handleFields(index, 'proportion', e)} precision={ 4 }/>
                </Form.Item>
            )
        },{
            key: 'weightAlgorithm',
            title: '重量算法',
            dataIndex: 'weightAlgorithm',
            align: "center",
            width: 300,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'weightAlgorithm']}>
                    <Select style={{width:'100%'}} onChange={ (value: string) => this.handleFields(index, 'weightAlgorithm', value) } >
                        <Select.Option value={ '0' } >
                            比重*体积（钢板类）
                        </Select.Option>
                        <Select.Option value={ '1' } >
                            比重*长度（角板类）
                        </Select.Option>
                    </Select>
                </Form.Item>
            )
        },{
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            align: "center",
            width: 400,
            render: (text: string, record: IMaterial, index: number): React.ReactNode => (
                <Form.Item name={['materialData', index, 'description']}>
                    <Input.TextArea onChange={e => this.handleFields(index, 'description', e.target.value)} rows={1} maxLength={ 300 }/>
                </Form.Item>
            )
        },{
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            align: "center",
            width: 100,
            render: (_, record,index) =>{
                return <ConfirmableButton confirmTitle="确定删除这条数据吗？" 
                            icon={ <DeleteOutlined /> }
                            onConfirm={ this.onDelete(record, index) } disabled={(record as IMaterial).id? true : false}>
                            删除
                        </ConfirmableButton>
        }
      }]
    }




     private onDelete(item: IMaterial, index: number): () => void {
        const { materialData } = this.state;
        return async () => {
            materialData&&materialData.splice(index, 1);
            this.setState({
                materialData,
            })
        };
    }
    /**
         * 遍历treeArray
         */
    protected expandKeysByValue(materialTrees: IMaterialTree[]) {
        let data: IMaterialTree[] = [];
        data = this.expandKeysId(materialTrees,data);
        return data;
    }

    //获取每一条tree
    protected expandKeysId(materialTrees: IMaterialTree[], data: IMaterialTree[]) {
        materialTrees.forEach((item: IMaterialTree): void => {
            data.push(item)
            if (item.children && item.children.length) {
                this.expandKeysId(item.children as IMaterialTree[], data);
            }
        });
        return data;
    }

    //treeSelect
    protected materialTreeChange(values:string,label: React.ReactNode[], extra: { triggerNode: { props: { parentId?: number; level: number } } },index:number){
        let checkedTree = [extra.triggerNode.props.parentId,values]
        let data = this.state?.materialData;
        const treeArray = this.state.treeData&&this.expandKeysByValue(this.state.treeData)
        let tree: IMaterialTree[] | undefined = treeArray && treeArray.filter((item:IMaterialTree) => {
            return checkedTree&&checkedTree.indexOf(item.id) > -1
        });
        checkedTree = [tree&&tree[0]?.parentId, extra.triggerNode.props.parentId, values];
        checkedTree = checkedTree.filter(item => item!=='0')
        if(data){
            let row = data[index];
            row['materialCategory']= values;
            row['bigCategory'] = checkedTree[0] || "";
            row['middleCategory'] = checkedTree[1] || "";
            row['smallCategory'] = checkedTree[2] || "";
            this.setState({
                materialData:data
            })
        };
    }
     /**
      * @override
      * @description Gets form props
      * @returns form props 
      */
      protected getFormProps(): FormProps {
         return {
             ...super.getFormProps(),
             labelCol:{ 
                 span: 6 
             },
             wrapperCol: {
                 offset: 1
             }
         };
     }


     /**
     * @description Renders extra operation area
     * @returns extra operation area 
     */
    protected renderExtraOperationArea(): React.ReactNode {
        return null;
    }
 
     /**
      * @implements
      * @description Gets form item groups
      * @returns form item groups 
      */
     public getFormItemGroups(): IFormItemGroup[][] {
         return []
     }

     public handleFields = (index:number, fieldKey:string, value:string | number) => {
        let data = this.state?.materialData;
        if(data){
            let row = data[index];
            row[fieldKey]= value;
            this.setState({
                materialData:data
            })
        };
    }
        


    public handleAddRow = () => {
        const materialValue = this.state.materialData || [];
        let nRow:IMaterial = {
            description: "",
            materialCode: "",
            materialTexture: "",
            productName: "",
            proportion: "",
            rowMaterial: "",
            shortcutCode: "",
            spec: "",
            unit: "",
            weightAlgorithm: "",
        };
        const data = [...materialValue, nRow];
        this.setState({
            materialData: data
        })
    };




     /**
     * @description Renders extra sections
     * @returns extra sections 
     */
    public renderExtraSections(): IRenderedSection[] {
        const tableData = this.state.materialData||[];
        return [{
            title: '原材料信息',
            render: (): React.ReactNode => {
                return (
                    <>
                       
                        {this.getButton()}
                        <Table
                            bordered
                            dataSource={[...tableData]}
                            columns={this.getColumn()}
                            scroll={{ x: 1300 }}
                            />
                    </>
                );
            }
        }];
    }

    protected getButton():React.ReactNode{
        return  <Button type='primary' onClick={this.handleAddRow}>新增</Button>
    }
     
 }




