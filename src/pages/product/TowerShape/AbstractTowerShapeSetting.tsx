/**
 * @author zyc
 * @copyright © 2021
 */
import { Button, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, TableColumnType, TableProps } from 'antd';
import Form, { FormProps } from 'antd/lib/form';
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
 
export interface IAbstractTowerShapeSettingState extends IAbstractFillableComponentState {
    readonly towerShape: ITowerShape;
    readonly isVisible?: boolean;
    readonly index?: number;
    readonly oldTowerShape: ITowerShape;
    readonly isReference?: boolean;
}

export interface ITowerShape {
    readonly id?: string;
    readonly description?: string;
    readonly internalNumber?: string;
    readonly operateStatus?: number;
    readonly productShape?: string;
    readonly projectName?: string;
    readonly steelProductShape?: string;
    readonly contractId?: string;
    readonly productDTOList?: IProductDTOList[];
}

interface IProductDTOList {
    readonly bodyWeight?: number;
    readonly description?: string;
    readonly id?: string | number;
    readonly lineName?: string;
    readonly productAdditionalDTOList?: IProductAdditionalDTOList[];
    readonly productHeight?: number;
    readonly productNumber?: string;
    readonly productShape?: string;
    readonly productShapeId?: number;
    readonly productType?: string | number;
    readonly productWeight?: number;
    readonly towerFootWeight?: number;
    readonly towerLeg1Length?: number;
    readonly towerLeg1Num?: number;
    readonly towerLeg1Weight?: number;
    readonly towerLeg2Length?: number;
    readonly towerLeg2Num?: number;
    readonly towerLeg2Weight?: number;
    readonly towerLeg3Length?: number;
    readonly towerLeg3Num?: number;
    readonly towerLeg3Weight?: number;
    readonly towerLeg4Length?: number;
    readonly towerLeg4Num?: number;
    readonly towerLeg4Weight?: number;
    readonly voltageGrade?: string | number;
    readonly state?: number;
}

interface IProductAdditionalDTOList {
    readonly id?: number | string;
    readonly additionalItem?: string;
    readonly towerDetailId?: string | number;
    readonly weight?: number;
}

/**
 * Abstract towershape Setting
 */
export default abstract class AbstractTowerShapeSetting<P extends RouteComponentProps, S extends IAbstractTowerShapeSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = {
        towerShape: {},
        isVisible: false,
        isReference: false
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
                },
            })
            this.getForm()?.setFieldsValue({ ...modalSelectedValue })
        }   
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
                children: <Input value={ towerShape?.internalNumber } disabled={ isReference } suffix={ 
                    <ContractSelectionComponent onSelect={ this.onSelect }/>
                }/>  
            }, {
                label: '工程名称',
                name: 'projectName',
                initialValue: towerShape?.projectName,
                children: <Input disabled/>
            }, {
                label: '塔型',
                name: 'productShape',
                initialValue: towerShape?.productShape,
                rules: [{
                    required: true,
                    message: '请输入塔型'
                }],
                children: <Input maxLength={ 50 } disabled={ isReference }/>
            }, {
                label: '钢印塔型',
                name: 'steelProductShape',
                initialValue: towerShape?.steelProductShape,
                rules: [{
                    required: true,
                    message: '请输入钢印塔型'
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
      * @implements
      * @description Gets table columns
      * @param item 
      * @returns table columns 
      */
     public getColumns(): TableColumnType<object>[] {    
        const isReference: boolean | undefined = this.state.isReference;    
        return [{
            key: 'state',
            title: '* 状态',
            dataIndex: 'state',
            width: 150,
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.state } name={['productDTOList', index,'state']} rules= {[{
                    required: true,
                    message: '请输入线路名称'
                }]}>
                    <Input disabled/>
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
                    <Input maxLength={ 100 }  disabled={ isReference || record.state === 1 }/>
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
                    message: '请输入杆塔号'
                }]}>
                    <Input maxLength={ 50 }/>
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
                    <Select placeholder="请选择电压等级" className={ styles.select_width }>
                        <Select.Option value="0" >国内业务</Select.Option>
                        <Select.Option value="1">国际业务</Select.Option>
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
                    <Select placeholder="请选择电压等级" className={ styles.select_width }>
                        <Select.Option value="0" >国内业务</Select.Option>
                        <Select.Option value="1">国际业务</Select.Option>
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
                        className={ layoutStyles.width100 }/>
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
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }
                        onChange={ (value) => {
                            const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
                            const productDtos: IProductDTOList[] = towerShape?.productDTOList || [];
                            const itemWeight: IProductAdditionalDTOList[] = productDtos[index]?.productAdditionalDTOList || [];
                            const weightOne: number = productDtos[index].towerLeg1Weight || 0;
                            const weightTwo: number = productDtos[index].towerLeg2Weight || 0;
                            const weightThree: number = productDtos[index].towerLeg3Weight || 0;
                            const weightFour: number = productDtos[index].towerLeg4Weight || 0;
                            const towerFootWeight: number = productDtos[index].towerFootWeight || 0;
                            let itemTotalWeight: number = 0;
                            itemWeight.map((items: IProductAdditionalDTOList): number => {
                                return itemTotalWeight = itemTotalWeight + (items.weight || 0);
                            })
                            let weight: number = 0;
                            weight = Number(value) + weightOne + weightTwo + weightThree + weightFour + towerFootWeight + itemTotalWeight;
                            productDtos[index] = {
                                ...productDtos[index],
                                productWeight: weight
                            }
                            this.setState({
                                towerShape: { ...towerShape }
                            })
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
                        className={ layoutStyles.width100 }/>
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
                        onChange={ (value) => {
                            const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
                            const productDtos: IProductDTOList[] = towerShape?.productDTOList || [];
                            const itemWeight: IProductAdditionalDTOList[] = productDtos[index]?.productAdditionalDTOList || [];
                            const bodyWeight: number = productDtos[index].bodyWeight || 0;
                            const weightTwo: number = productDtos[index].towerLeg2Weight || 0;
                            const weightThree: number = productDtos[index].towerLeg3Weight || 0;
                            const weightFour: number = productDtos[index].towerLeg4Weight || 0;
                            const towerFootWeight: number = productDtos[index].towerFootWeight || 0;
                            let itemTotalWeight: number = 0;
                            itemWeight.map((items: IProductAdditionalDTOList): number => {
                                return itemTotalWeight = itemTotalWeight + (items.weight || 0);
                            })
                            let weight: number = 0;
                            weight = Number(value) + bodyWeight + weightTwo + weightThree + weightFour + towerFootWeight + itemTotalWeight;
                            productDtos[index] = {
                                ...productDtos[index],
                                productWeight: weight
                            }
                            this.setState({
                                towerShape: { ...towerShape }
                            })
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
                        className={ layoutStyles.width100 }/>
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
                        onChange={ (value) => {
                            const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
                            const productDtos: IProductDTOList[] = towerShape?.productDTOList || [];
                            const itemWeight: IProductAdditionalDTOList[] = productDtos[index]?.productAdditionalDTOList || [];
                            const bodyWeight: number = productDtos[index].bodyWeight || 0;
                            const weightOne: number = productDtos[index].towerLeg1Weight || 0;
                            const weightThree: number = productDtos[index].towerLeg3Weight || 0;
                            const weightFour: number = productDtos[index].towerLeg4Weight || 0;
                            const towerFootWeight: number = productDtos[index].towerFootWeight || 0;
                            let itemTotalWeight: number = 0;
                            itemWeight.map((items: IProductAdditionalDTOList): number => {
                                return itemTotalWeight = itemTotalWeight + (items.weight || 0);
                            })
                            let weight: number = 0;
                            weight = Number(value) + bodyWeight + weightOne + weightThree + weightFour + towerFootWeight + itemTotalWeight;
                            productDtos[index] = {
                                ...productDtos[index],
                                productWeight: weight
                            }
                            this.setState({
                                towerShape: { ...towerShape }
                            })
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
                        className={ layoutStyles.width100 }/>
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
                        onChange={ (value) => {
                            const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
                            const productDtos: IProductDTOList[] = towerShape?.productDTOList || [];
                            const itemWeight: IProductAdditionalDTOList[] = productDtos[index]?.productAdditionalDTOList || [];
                            const bodyWeight: number = productDtos[index].bodyWeight || 0;
                            const weightOne: number = productDtos[index].towerLeg1Weight || 0;
                            const weightTwo: number = productDtos[index].towerLeg2Weight || 0;
                            const weightFour: number = productDtos[index].towerLeg4Weight || 0;
                            const towerFootWeight: number = productDtos[index].towerFootWeight || 0;
                            let itemTotalWeight: number = 0;
                            itemWeight.map((items: IProductAdditionalDTOList): number => {
                                return itemTotalWeight = itemTotalWeight + (items.weight || 0);
                            })
                            let weight: number = 0;
                            weight = Number(value) + bodyWeight + weightOne + weightTwo + weightFour + towerFootWeight + itemTotalWeight;
                            productDtos[index] = {
                                ...productDtos[index],
                                productWeight: weight
                            }
                            this.setState({
                                towerShape: { ...towerShape }
                            })
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
                        className={ layoutStyles.width100 }/>
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
                        onChange={ (value) => {
                            const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
                            const productDtos: IProductDTOList[] = towerShape?.productDTOList || [];
                            const itemWeight: IProductAdditionalDTOList[] = productDtos[index]?.productAdditionalDTOList || [];
                            const bodyWeight: number = productDtos[index].bodyWeight || 0;
                            const weightOne: number = productDtos[index].towerLeg1Weight || 0;
                            const weightTwo: number = productDtos[index].towerLeg2Weight || 0;
                            const weightThree: number = productDtos[index].towerLeg3Weight || 0;
                            const towerFootWeight: number = productDtos[index].towerFootWeight || 0;
                            let itemTotalWeight: number = 0;
                            itemWeight.map((items: IProductAdditionalDTOList): number => {
                                return itemTotalWeight = itemTotalWeight + (items.weight || 0);
                            })
                            let weight: number = 0;
                            weight = Number(value) + bodyWeight + weightOne + weightTwo + weightThree + towerFootWeight + itemTotalWeight;
                            productDtos[index] = {
                                ...productDtos[index],
                                productWeight: weight
                            }
                            this.setState({
                                towerShape: { ...towerShape }
                            })
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
                        onChange={ (value) => {
                            const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
                            const productDtos: IProductDTOList[] = towerShape?.productDTOList || [];
                            const itemWeight: IProductAdditionalDTOList[] = productDtos[index]?.productAdditionalDTOList || [];
                            const bodyWeight: number = productDtos[index].bodyWeight || 0;
                            const weightOne: number = productDtos[index].towerLeg1Weight || 0;
                            const weightTwo: number = productDtos[index].towerLeg2Weight || 0;
                            const weightThree: number = productDtos[index].towerLeg3Weight || 0;
                            const weightFour: number = productDtos[index].towerLeg4Weight || 0;
                            let itemTotalWeight: number = 0;
                            itemWeight.map((items: IProductAdditionalDTOList): number => {
                                return itemTotalWeight = itemTotalWeight + (items.weight || 0);
                            })
                            let weight: number = 0;
                            weight = Number(value) + bodyWeight + weightOne + weightTwo + weightThree + weightFour + itemTotalWeight;
                            productDtos[index] = {
                                ...productDtos[index],
                                productWeight: weight
                            }
                            this.setState({
                                towerShape: { ...towerShape }
                            })
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
                    <Input maxLength={ 50 }/>
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
                    <Button type="link" onClick={ () => this.itemWeightClick(index) }>
                        增重项
                    </Button>
                    <Popconfirm 
                        title="要删除该客户吗？" 
                        placement="topRight" 
                        okText="确认"
                        cancelText="取消"
                        onConfirm={ () => { this.onDelete(index) } }
                    >
                        <Button type="link">
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
        this.setState({
            isVisible: false,
            towerShape: oldTowerShape
        })
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
        productAdditionalDTOList.map((items: IProductAdditionalDTOList, ind: number): void => {
            itemTotalWeight = itemTotalWeight + (items.weight || 0);
            this.getForm()?.validateFields([['productDTOList', index, "productAdditionalDTOList", ind, 'additionalItem'], ['productDTOList', index, "productAdditionalDTOList", ind, 'weight']])
                .then(() => {
                    const bodyWeight: number = productDTOList[index].bodyWeight || 0;
                    const weightOne: number = productDTOList[index].towerLeg1Weight || 0;
                    const weightTwo: number = productDTOList[index].towerLeg2Weight || 0;
                    const weightThree: number = productDTOList[index].towerLeg3Weight || 0;
                    const weightFour: number = productDTOList[index].towerLeg4Weight || 0;
                    const towerFootWeight: number = productDTOList[index].towerFootWeight || 0;
                    weight = bodyWeight + weightOne + weightTwo + weightThree + weightFour + towerFootWeight + itemTotalWeight;
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
            render: (_: undefined, record: object, ind: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm 
                        title="要删除该客户吗？" 
                        placement="topRight" 
                        okText="确认"
                        cancelText="取消"
                        onConfirm={ () => { this.onModalDelete(index, ind) } }
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
            id: Math.random(),
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
        this.getForm()?.setFieldsValue({ ...fieldsValue })
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
            {this.state.isVisible ? <Modal title="增重项" visible={ this.state.isVisible } onCancel={ this.onModalClose } width={ "30%" } okText="确定" cancelText="取消" onOk={ this.onModalOk }>
                <Button type="primary" onClick={ this.itemWeightAddRow } className={ styles.btn }>添加行</Button>
                <Table rowKey= {this.getTableRowKey()} bordered={ true } dataSource = { [...productAdditionalDTOList] } columns={ this.getItemColumns(index) } pagination = { false }/>
            </Modal>
            : null}
        </> 
    }

    /**
     * @description 产品信息删除行
     * @param event 
     */
    private onDelete = (index: number): void => {
        const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
        const productDTOList: IProductDTOList[] = towerShape?.productDTOList || [];
        productDTOList.splice(index, 1);
        this.setState({
            towerShape: {
                ...towerShape,
                productDTOList: [...productDTOList]
            }
        })
    }

    /**
     * @description 弹窗删除行
     * @param event 
     */
    private onModalDelete = (index: number, ind: number): void => {
        const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
        const productDTOList: IProductDTOList[] = towerShape?.productDTOList || [];
        const productAdditionalDTOList: IProductAdditionalDTOList[] = productDTOList && productDTOList[index]?.productAdditionalDTOList || [];
        productAdditionalDTOList.splice(ind, 1);
        this.setState({
            towerShape: {
                ...towerShape,
                productDTOList: [...productDTOList] 
            }
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
        return [{
            title: '产品信息',
            render: (): React.ReactNode => {
                return (<>
                        { this.itemWeightModal()}
                        <Button type="primary" onClick={ () => { 
                            const productDTOList: IProductDTOList[] = towerShape?.productDTOList || [];
                            let product: IProductDTOList = {
                                state: 0,
                                bodyWeight: undefined,
                                description: '',
                                id: '',
                                lineName: '',
                                productAdditionalDTOList: [],
                                productHeight: undefined,
                                productNumber: '',
                                productShape: '',
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
                        } } className={ styles.btn }>添加行</Button>
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