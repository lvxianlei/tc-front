/**
 * @author zyc
 * @copyright © 2021
 */
import { Button, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Table, TableColumnType, TableProps } from 'antd';
import Form, { FormProps, RuleObject } from 'antd/lib/form';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import AbstractFillableComponent, { IAbstractFillableComponentState, IFormItemGroup } from '../../../components/AbstractFillableComponent';
import ContractSelectionComponent from '../../../components/ContractSelectionModal';
import { DataType } from '../../../components/AbstractSelectableModal';
import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
import styles from './AbstractTowerShapeSetting.module.less';
import { DeleteOutlined } from '@ant-design/icons';
import { GetRowKey } from 'antd/lib/table/interface';
import layoutStyles from '../../../layout/Layout.module.less';
import { IProductAdditionalDTOList, IProductDTOList, ITowerShape } from './ITowerShape';
import { productTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import { StoreValue } from 'antd/lib/form/interface';
import { idText } from 'typescript';
import RequestUtil from '../../../utils/RequestUtil';
 
export interface IAbstractTowerShapeSettingState extends IAbstractFillableComponentState {
    readonly towerShape: ITowerShape;
    readonly isVisible?: boolean;
    readonly index?: number;
    readonly oldTowerShape: ITowerShape;
    readonly isChange?: boolean;
    readonly isReference?: boolean;
    readonly productIdList?: (string| Number)[];
    readonly productAdditionalIdList?: (string| Number)[];
    readonly productDeleteList?: IProductDTOList[];
    readonly productAdditionalDeleteList?: IProductAdditionalDTOList[];
}

/**
 * Abstract towershape Setting
 */
export default abstract class AbstractTowerShapeSetting<P extends RouteComponentProps, S extends IAbstractTowerShapeSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = {
        towerShape: {},
        isVisible: false,
        isChange: false
    } as S;

    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return '/product/towershape';
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

    public onSelect = (selectedRows: DataType[] | any): void => {
        const towerShape: ITowerShape | undefined = this.state.towerShape;
        if(selectedRows && selectedRows.length > 0 ) {
            const modalSelectedValue: ITowerShape = {
                internalNumber: selectedRows[0].internalNumber,
                projectName: selectedRows[0].projectName,
                contractId: selectedRows[0].id,
            };
            this.setState({
                towerShape: {
                    ...(towerShape || {}),
                    ...modalSelectedValue
                },
            })
            this.getForm()?.setFieldsValue({ ...modalSelectedValue })
        }   
    }

     /**
     * @description 验证塔型+钢印塔型是否重复
     */
      public checkContractNumber = (value: StoreValue): Promise<void | any> =>{
        return new Promise(async (resolve, reject) => {  // 返回一个promise
            if(this.getForm()?.getFieldsValue(true).name && this.getForm()?.getFieldsValue(true).steelProductShape) {
                const resData = await RequestUtil.get('/tower-data-archive/productCategory/checkProductCategory', {
                    name: this.getForm()?.getFieldsValue(true).name,
                    steelProductShape: this.getForm()?.getFieldsValue(true).steelProductShape,
                    id: this.state.towerShape.id
                });
                if (resData) {
                    resolve(resData)
                } else {
                    resolve(false)
                }
            } else {
                resolve(true)
            }
        }).catch(error => {
            Promise.reject(error)
        })
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const towerShape: ITowerShape | undefined = this.state.towerShape;
        const isReference: boolean | undefined = this.state.isReference;
        return [[{
            title: '塔型信息',
            itemCol: {
                span: 8
            },
            itemProps: [ {
                label: '内部合同编号',
                name: 'internalNumber',
                initialValue: towerShape?.internalNumber,
                rules: [{
                    required: true,
                    message: '请选择关联合同'
                }],
                children: 
                (
                    isReference 
                    ?
                    <Input value={ towerShape?.internalNumber } disabled/> 
                    :
                    <Input value={ towerShape?.internalNumber } disabled suffix={ 
                        <ContractSelectionComponent onSelect={ this.onSelect }/>
                    }/> 
                )
            }, {
                label: '工程名称',
                name: 'projectName',
                initialValue: towerShape?.projectName,
                children: <Input disabled/>
            }, {
                label: '塔型',
                name: 'name',
                initialValue: towerShape?.name,
                rules: [{
                    required: true,
                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                        if(value && value != '') {
                            this.checkContractNumber(value).then(res => {
                                if (res) {
                                    callback()
                                } else {
                                    callback('塔型+钢印塔型已存在')
                                }
                            })
                        } else {
                            callback('请输入塔型')
                        }
                    }
                }],
                children: <Input maxLength={ 50 } disabled={ isReference }/>
            }, {
                label: '钢印塔型',
                name: 'steelProductShape',
                initialValue: towerShape?.steelProductShape,
                rules: [{
                    required: true,
                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                        if(value && value != '') {
                            this.checkContractNumber(value).then(res => {
                                if (res) {
                                    callback()
                                } else {
                                    callback('塔型+钢印塔型已存在')
                                }
                            })
                        } else {
                            callback('请输入钢印塔型')
                        }
                    }
                }],
                children: <Input maxLength={ 50 } disabled={ isReference }/>
            }, {
                label: '备注',
                name: 'description',
                initialValue: towerShape?.description,
                children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息" disabled={ isReference }/>
            }]
        }]]
    }

    /**
     * @description 验证杆塔号
     */
     public checkProductNumber = (value: StoreValue, index: number): Promise<void | any> =>{
        return new Promise(async (resolve, reject) => {  // 返回一个promise
            const productDTOList: IProductDTOList[] = this.getForm()?.getFieldsValue(true).productDTOList || [];
            if(value) {
                resolve(productDTOList.map((items: IProductDTOList, ind: number) => {
                    if(index !== ind && items.productNumber === value) {
                        return false
                    } else {
                        return true
                    }
                }).findIndex(item => item === false))
            } else {
                resolve(false)
            }
        }).catch(error => {
            Promise.reject(error)
        })
    }

    /**
      * @implements
      * @description Gets table columns
      * @param item 
      * @returns table columns 
      */
     public getColumns(): TableColumnType<object>[] {    
        const isChange: boolean | undefined = this.state.isChange;      
        return [{
            key: 'status',
            title: '* 状态',
            dataIndex: 'status',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.status } name={['productDTOList', index,'status']} rules= {[{
                    required: true,
                    message: '请输入线路名称'
                }]}>
                    { record.status === 0 ? '新建' : record.status === 1 ? '待下发' : record.status === 2 ? '审批中' : '已下发' }
                </Form.Item> 
            )
        }, {
            key: 'lineName',
            title: '* 线路名称',
            dataIndex: 'lineName',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'lineName']} rules= {[{
                    required: true,
                    message: '请输入线路名称'
                }]}>
                    <Input maxLength={ 100 } disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }/>
                </Form.Item> 
            )
        }, {
            key: 'productNumber',
            title: '* 杆塔号',
            dataIndex: 'productNumber',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'productNumber']} rules= {[{
                    required: true,
                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                        this.checkProductNumber(value, index).then((res) => {
                            if (res===-1) {
                                callback()
                            } else {
                                callback('请输入杆塔号，且塔型下杆塔号唯一！');
                            }
                        })
                    }
                }]}>
                    <Input maxLength={ 50 } disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }/>
                </Form.Item> 
            )
        }, {
            key: 'productType',
            title: '* 产品类型',
            dataIndex: 'productType',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'productType']} rules= {[{
                    required: true,
                    message: '请选择产品类型'
                }]}>
                    <Select placeholder="请选择电压等级" className={ styles.select_width } disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }>
                        { productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={ index } value={ id }>
                                { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item> 
            )
        }, {
            key: 'voltageGrade',
            title: '* 电压等级',
            dataIndex: 'voltageGrade',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'voltageGrade']} rules= {[{
                    required: true,
                    message: '请选择电压等级'
                }]}>
                    <Select placeholder="请选择电压等级" className={ styles.select_width } disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }>
                        { voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={ index } value={ id }>
                                { name }
                            </Select.Option>
                        }) }
                    </Select>
                </Form.Item> 
            )
        }, {
            key: 'productHeight',
            title: '* 呼高（m）',
            dataIndex: 'productHeight',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'productHeight']} rules= {[{
                    required: true,
                    message: '请输入呼高'
                }]}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }
                        disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }/>
                </Form.Item> 
            )
        }, {
            key: 'bodyWeight',
            title: '* 身部重量（kg）',
            dataIndex: 'bodyWeight',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'bodyWeight']} rules= {[{
                    required: true,
                    message: '请输入身部重量'
                }]}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0.01"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }
                        disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }
                        onChange={ () => {
                            this.getProductWeight(index) 
                        } }/>
                </Form.Item> 
            )
        }, {
            key: 'towerLeg1Length',
            title: '接腿1#长度（m）',
            dataIndex: 'towerLeg1Length',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'towerLeg1Length']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }
                        disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }/>
                </Form.Item> 
            )
        }, {
            key: 'towerLeg1Weight',
            title: '接腿1#重量（kg）',
            dataIndex: 'towerLeg1Weight',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'towerLeg1Weight']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }
                        disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }
                        onChange={ () => {
                            this.getProductWeight(index)
                        } }/>
                </Form.Item> 
            )
        }, {
            key: 'towerLeg2Length',
            title: '接腿2#长度（m）',
            dataIndex: 'towerLeg2Length',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'towerLeg2Length']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }
                        disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }/>
                </Form.Item> 
            )
        }, {
            key: 'towerLeg2Weight',
            title: '接腿2#重量（kg）',
            dataIndex: 'towerLeg2Weight',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'towerLeg2Weight']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }
                        disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }
                        onChange={ () => {
                            this.getProductWeight(index)
                        } }/>
                </Form.Item> 
            )
        }, {
            key: 'towerLeg3Length',
            title: '接腿3#长度（m）',
            dataIndex: 'towerLeg3Length',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'towerLeg3Length']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }
                        disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }/>
                </Form.Item> 
            )
        }, {
            key: 'towerLeg3Weight',
            title: '接腿3#重量（kg）',
            dataIndex: 'towerLeg3Weight',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'towerLeg3Weight']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }
                        disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }
                        onChange={ () => {
                            this.getProductWeight(index)
                        } }/>
                </Form.Item> 
            )
        }, {
            key: 'towerLeg4Length',
            title: '接腿#4长度（m）',
            dataIndex: 'towerLeg4Length',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'towerLeg4Length']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }
                        disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }/>
                </Form.Item> 
            )
        }, {
            key: 'towerLeg4Weight',
            title: '接腿#4重量（kg）',
            dataIndex: 'towerLeg4Weight',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'towerLeg4Weight']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }
                        disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }
                        onChange={ () => {
                            this.getProductWeight(index)
                        } }/>
                </Form.Item> 
            )
        },  {
            key: 'towerFootWeight',
            title: '塔脚板重量（kg）',
            dataIndex: 'towerFootWeight',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'towerFootWeight']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }
                        disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }
                        onChange={ () => {
                            this.getProductWeight(index)
                        } }/>
                </Form.Item> 
            )
        },  {
            key: 'productWeight',
            title: '杆塔重量（kg）',
            dataIndex: 'productWeight',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'productWeight']}>
                    <Input disabled/>
                </Form.Item> 
            )
        },  {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={['productDTOList', index,'description']}>
                    <Input maxLength={ 50 } disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }/>
                </Form.Item> 
            )
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 180,
            fixed: 'right',
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={ () => this.itemWeightClick(index) } disabled={ record.status === 2 || (isChange && record.status === 0) || (isChange && record.status === 1) || (!isChange && record.status == 3 ) }>
                        增重项
                    </Button>
                    <Popconfirm 
                        title="要删除该杆塔信息吗？" 
                        placement="topRight" 
                        okText="确认"
                        cancelText="取消"
                        onConfirm={ () => { this.onDelete(index, record) } }
                        disabled={ record.status === 2 || record.status === 1 || (!isChange && record.status == 3 ) }
                    >
                        <Button type="text" disabled={ record.status === 2 || (isChange && record.status === 0) || record.status === 1 || (!isChange && record.status == 3 ) }>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }];
    }

    /**
     * @description 点击增重项事件
     * @param event 
     */
    public itemWeightClick = (index: number): void => {
        let itemWeight: IProductAdditionalDTOList[] = this.getForm()?.getFieldsValue(true).productDTOList[index].productAdditionalDTOList;
        itemWeight && itemWeight.map((item: IProductAdditionalDTOList, index: number) => {
            if(item.additionalItem && item.additionalItem !== "") {
                itemWeight = itemWeight;
            } else {
                itemWeight.splice(index, 1);
            }
        })
        const productDtos: IProductDTOList[] = this.getForm()?.getFieldsValue(true).productDTOList || [];
        productDtos[index] = {
            ...productDtos[index],
            productAdditionalDTOList: itemWeight
        }
        let fieldsValue = {
            ...this.getForm()?.getFieldsValue(true),
            productDTOList: [...productDtos]
        }
        this.setState({ isVisible: true, index: index, oldTowerShape: fieldsValue })
        this.getForm()?.setFieldsValue({ ...fieldsValue })
    }

    /**
     * @description 弹窗关闭
     * @param event 
     */
    public onModalClose = (): void => {
        const oldTowerShape: ITowerShape | undefined = this.state.oldTowerShape;
        const index: number = this.state.index || 0;
        this.setState({
            isVisible: false,
            towerShape: oldTowerShape
        })
        this.getProductWeight(index);
        this.getForm()?.setFieldsValue({ ...this.state.oldTowerShape });
    }

    /**
     * @description 弹窗确定
     * @param event 
     */
    public onModalOk = async (): Promise<void> => {
        const index: number = this.state.index || 0;
        const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
        const productDTOList: IProductDTOList[] = towerShape?.productDTOList || [];
        const productAdditionalDTOList: IProductAdditionalDTOList[] = productDTOList[index]?.productAdditionalDTOList || [];
        let weight: number = 0;
        let itemTotalWeight: number = 0;
        if(productAdditionalDTOList.length > 0) {
            productAdditionalDTOList.map((items: IProductAdditionalDTOList, ind: number): void => {
                itemTotalWeight = Number(itemTotalWeight) + Number(items.weight || 0);
                this.getForm()?.validateFields([['productDTOList', index, "productAdditionalDTOList", ind, 'additionalItem'], ['productDTOList', index, "productAdditionalDTOList", ind, 'weight']])
                    .then(() => {
                        const bodyWeight: number = productDTOList[index].bodyWeight || 0;
                        const weightOne: number = productDTOList[index].towerLeg1Weight || 0;
                        const weightTwo: number = productDTOList[index].towerLeg2Weight || 0;
                        const weightThree: number = productDTOList[index].towerLeg3Weight || 0;
                        const weightFour: number = productDTOList[index].towerLeg4Weight || 0;
                        const towerFootWeight: number = productDTOList[index].towerFootWeight || 0;
                        weight = Number(bodyWeight) + Number(weightOne) + Number(weightTwo) + Number(weightThree) + Number(weightFour) + Number(towerFootWeight) + Number(itemTotalWeight);
                        weight = parseFloat(weight.toFixed(2));
                        productDTOList[index] = {
                            ...productDTOList[index],
                            productWeight: weight
                        }
                        this.setState({
                            towerShape: { ...towerShape },
                            isVisible: false,
                            oldTowerShape: this.getForm()?.getFieldsValue(true)
                        })
                        return true;
                    }).catch((error) => {
                        return false;
                    });
            })
        } else {
            this.getProductWeight(index);
            this.setState({
                isVisible: false
            })
        }
        
    }

    /**
      * @implements
      * @description Gets table columns
      * @param item 
      * @returns table columns 
      */
    public getItemColumns(index: number): TableColumnType<object>[] {        
        return [{
            key: 'additionalItem',
            title: '* 增重项',
            dataIndex: 'additionalItem',
            width: 150,
            render: (_: undefined, record: IProductAdditionalDTOList, ind: number): React.ReactNode => (
                <Form.Item initialValue={ record.additionalItem } name={['productDTOList', index, "productAdditionalDTOList", ind ,'additionalItem']} rules= {[{
                    required: true,
                    message: '请输入增重项'
                }]}>
                    <Input maxLength={ 20 }/>
                </Form.Item> 
            )
        }, {
            key: 'weight',
            title: '* 增重（kg）',
            dataIndex: 'weight',
            width: 150,
            render: (_: undefined, record: IProductAdditionalDTOList, ind: number): React.ReactNode => (
                <Form.Item initialValue={ record.weight } name={['productDTOList', index, "productAdditionalDTOList", ind,'weight']} rules= {[{
                    required: true,
                    message: '请输入增重'
                }]}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 180,
            fixed: 'right',
            render: (_: undefined, record: IProductAdditionalDTOList, ind: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm 
                        title="要删除该增重项吗？" 
                        placement="topRight" 
                        okText="确认"
                        cancelText="取消"
                        onConfirm={ () => { this.onModalDelete(index, ind, record) } }
                    >
                        <DeleteOutlined/>
                    </Popconfirm>
                </Space>
            )
        }];
    }

    /**
     * @description 增重项添加行
     * @param event 
     */
    public itemWeightAddRow = (): void =>  {
        const index: number = this.state.index || 0;
        const towerShape: ITowerShape | undefined = this.state.towerShape;
        const productDTOList: IProductDTOList[] = towerShape?.productDTOList || [];
        const productAdditionalDTOList: IProductAdditionalDTOList[] = productDTOList[index]?.productAdditionalDTOList || [];
        let item: IProductAdditionalDTOList = {
            additionalItem: '',
            weight: undefined
        }
        productDTOList[index] = {
            ...productDTOList[index],
            productAdditionalDTOList: [ 
                ...productAdditionalDTOList || [],
                item
            ]
        }
        this.setState({
            towerShape: towerShape
        })
        const productDtosValue: IProductDTOList[] = this.getForm()?.getFieldsValue(true).productDTOList || [];
        productDtosValue[index] = {
            ...productDtosValue[index],
            productAdditionalDTOList: [ 
                ...(productDtosValue[index].productAdditionalDTOList || []),
                item
            ]
        }
        let fieldsValue = {
            ...this.getForm()?.getFieldsValue(true),
            productDTOList: [...productDtosValue]
        }
        this.getForm()?.setFieldsValue({ ...fieldsValue });
    }

    /**
     * @description 增重项弹窗
     * @param event 
     */
    public itemWeightModal = (): React.ReactNode => {
        const index: number = this.state.index || 0;
        const towerShape: ITowerShape | undefined = this.state.towerShape;
        const productDTOList: IProductDTOList[] = towerShape?.productDTOList || [];
        const productAdditionalDTOList: IProductAdditionalDTOList[] = productDTOList[index]?.productAdditionalDTOList || [];
        return <>
            { this.state.isVisible ? <Modal title="增重项" visible={ this.state.isVisible } onCancel={ this.onModalClose } width={ "30%" } okText="确定" cancelText="取消" onOk={ this.onModalOk }>
                <Button type="primary" onClick={ this.itemWeightAddRow } className={ styles.btn }>添加行</Button>
                <Table rowKey= {this.getTableRowKey()} bordered={ true } dataSource = { [...productAdditionalDTOList] } columns={ this.getItemColumns(index) } pagination = { false }/>
            </Modal>
            : null }
        </> 
    }

    /**
     * @description 计算杆塔重量
     * @param event 
     */
    public getProductWeight = (index: number): void => {
        const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
        const productDtos: IProductDTOList[] = towerShape?.productDTOList || [];
        const itemWeight: IProductAdditionalDTOList[] = productDtos[index]?.productAdditionalDTOList || [];
        const bodyWeight: number = productDtos[index].bodyWeight || 0;
        const weightOne: number = productDtos[index].towerLeg1Weight || 0;
        const weightTwo: number = productDtos[index].towerLeg2Weight || 0;
        const weightThree: number = productDtos[index].towerLeg3Weight || 0;
        const weightFour: number = productDtos[index].towerLeg4Weight || 0;
        const towerFootWeight: number = productDtos[index].towerFootWeight || 0;
        let itemTotalWeight: number = 0;
        itemWeight.map((items: IProductAdditionalDTOList): number => {
            return itemTotalWeight = Number(itemTotalWeight) + Number(items.weight || 0);
        })
        let weight: number = 0;
        weight =  Number(bodyWeight) + Number(weightOne) + Number(weightTwo) + Number(weightThree) + Number(weightFour) + Number(towerFootWeight) + Number(itemTotalWeight);
        weight = parseFloat(weight.toFixed(2));
        productDtos[index] = {
            ...productDtos[index],
            productWeight: weight
        }
        this.setState({
            towerShape: { ...towerShape }
        })
    }

    /**
     * @description 产品信息删除行
     * @param event 
     */
    private onDelete = (index: number, record?: IProductDTOList): void => {
        const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
        const productDTOList: IProductDTOList[] = towerShape?.productDTOList || [];
        productDTOList.splice(index, 1);
        const productIdList: (string| Number)[]  = this.state.productIdList || [];
        const productDeleteList: IProductDTOList[] = this.state.productDeleteList || [];
        record && record.id && productIdList.push(record.id);
        record && record.id &&productDeleteList.push(record);
        this.setState({
            towerShape: {
                ...towerShape,
                productDTOList: [...productDTOList]
            },
            productIdList: productIdList,
            productDeleteList: productDeleteList
        })
    }

    /**
     * @description 弹窗删除行
     * @param event 
     */
    private onModalDelete = (index: number, ind: number, record?: IProductAdditionalDTOList): void => {
        const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
        const productDTOList: IProductDTOList[] = towerShape?.productDTOList || [];
        const productAdditionalDTOList: IProductAdditionalDTOList[] = productDTOList && productDTOList[index]?.productAdditionalDTOList || [];
        productAdditionalDTOList.splice(ind, 1);
        const productAdditionalIdList: (string| Number)[]  = this.state.productAdditionalIdList || [];
        const productAdditionalDeleteList: IProductAdditionalDTOList[] = this.state.productAdditionalDeleteList || [];
        record && record.id && productAdditionalIdList.push(record.id);
        record && record.id &&productAdditionalDeleteList.push(record);
        this.setState({
            towerShape: {
                ...towerShape,
                productDTOList: [...productDTOList]
            },
            productAdditionalIdList: productAdditionalIdList,
            productAdditionalDeleteList: productAdditionalDeleteList
        })
    }

    /**
     * @description Gets table props
     * @param item 
     * @returns table props 
     */
    protected getTableProps(): TableProps<object> {
        return {
            rowKey: this.getTableRowKey(),
            bordered: true,
            dataSource: this.state.towerShape?.productDTOList || [],
            columns: this.getColumns(),
            pagination: false,
            scroll: { x: 1200 }
        };
    }

    /**
     * @protected
     * @description Gets table row key
     * @returns table row key 
     */
    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
    
    /**
     * @description Renders extra sections
     * @returns extra sections 
     */
    public renderExtraSections(): IRenderedSection[] {
        const towerShape: ITowerShape | undefined = this.state.towerShape;
        const isChange: boolean | undefined = this.state.isChange;
        return [{
            title: '杆塔信息',
            render: (): React.ReactNode => {
                return (<>
                        { this.itemWeightModal() }
                        <Button type="primary" onClick={ () => { 
                            const productDTOList: IProductDTOList[] = towerShape?.productDTOList || [];
                            let product: IProductDTOList = {
                                status: 0,
                                bodyWeight: undefined,
                                description: '',
                                id: '',
                                lineName: '',
                                productAdditionalDTOList: [],
                                productHeight: undefined,
                                productNumber: '',
                                productCategoryName: '',
                                productShapeId: undefined,
                                productType: '',
                                productWeight: undefined,
                                towerFootWeight: undefined,
                                towerLeg1Length: undefined,
                                towerLeg1Num: undefined,
                                towerLeg1Weight: undefined,
                                towerLeg2Length: undefined,
                                towerLeg2Num: undefined,
                                towerLeg2Weight: undefined,
                                towerLeg3Length: undefined,
                                towerLeg3Num: undefined,
                                towerLeg3Weight: undefined,
                                towerLeg4Length: undefined,
                                towerLeg4Num: undefined,
                                towerLeg4Weight: undefined,
                                voltageGrade: ''
                            }
                            this.setState({
                                towerShape: {
                                    ...towerShape,
                                    productDTOList: [...productDTOList, product]
                                }
                            })
                            const towerShapeValue: ITowerShape = this.getForm()?.getFieldsValue(true);
                            const productDTOListValue: IProductDTOList[] = towerShapeValue?.productDTOList || [];
                            this.getForm()?.setFieldsValue({ ...towerShapeValue, productDTOList: [...productDTOListValue, product] })
                        } } className={ isChange ? styles.hidden : styles.btn }>添加行</Button>
                        <Table { ...this.getTableProps() } />
                    </>
                );
            }
        }];
    }

    /**
     * @description Renders extra operation area
     * @returns extra operation area 
     */
    protected renderExtraOperationArea(): React.ReactNode {
        return null;
    }

}