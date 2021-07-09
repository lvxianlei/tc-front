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
}

export interface ITowerShape {
    readonly id?: string;
    readonly contractId?: string;
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly name?: string;
    readonly description?: string;
    readonly productDtos?: ITower[];
}

interface ITower {
    readonly projectName?: string;
    readonly internalNumber?: string;
    readonly bodyWeight?: number;
    readonly weightOne?: number;
    readonly weightTwo?: number;
    readonly weightThree?: number;
    readonly weightFour?: number;
    readonly towerFootWeight?: number;
    readonly weight?: number;
    readonly itemWeight?: IItemWeight[];
    readonly state?: number;
}

interface IItemWeight {
    readonly id?: number | string;
    readonly item?: string;
    readonly weight?: number;
}

/**
 * Abstract towershape Setting
 */
export default abstract class AbstractTowerShapeSetting<P extends RouteComponentProps, S extends IAbstractTowerShapeSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = {
        towerShape: {},
        isVisible: false
    } as S;

    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return '/client/mngt/';
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
                children: <Input value={ towerShape?.internalNumber } suffix={ 
                    <ContractSelectionComponent onSelect={ this.onSelect }/>
                }/>  
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
                    message: '请输入塔型'
                }],
                children: <Input maxLength={ 50 }/>
            }, {
                label: '钢印塔型',
                name: 'name',
                initialValue: towerShape?.name,
                rules: [{
                    required: true,
                    message: '请输入钢印塔型'
                }],
                children: <Input maxLength={ 50 }/>
            }, {
                label: '备注',
                name: 'description',
                initialValue: towerShape?.description,
                children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
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
        return [{
            key: 'state',
            title: '* 线路名称',
            dataIndex: 'state',
            width: 150,
            render: (_: undefined, record: ITower, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.state } name={['productDtos', index,'state']} rules= {[{
                    required: true,
                    message: '请输入线路名称'
                }]}>
                    <Input disabled/>
                </Form.Item> 
            )
        }, {
            key: 'projectName',
            title: '* 线路名称',
            dataIndex: 'projectName',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'projectName']} rules= {[{
                    required: true,
                    message: '请输入线路名称'
                }]}>
                    <Input maxLength={ 100 }/>
                </Form.Item> 
            )
        }, {
            key: 'projectName',
            title: '* 杆塔号',
            dataIndex: 'projectName',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'projectName']} rules= {[{
                    required: true,
                    message: '请输入杆塔号'
                }]}>
                    <Input maxLength={ 50 }/>
                </Form.Item> 
            )
        }, {
            key: 'projectName',
            title: '* 产品类型',
            dataIndex: 'projectName',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'projectName']} rules= {[{
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
            key: 'internalNumber',
            title: '* 电压等级',
            dataIndex: 'internalNumber',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'internalNumber']} rules= {[{
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
            key: 'projectName',
            title: '* 呼高（m）',
            dataIndex: 'projectName',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'projectName']} rules= {[{
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
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'bodyWeight']} rules= {[{
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
                            const productDtos: ITower[] = towerShape?.productDtos || [];
                            const itemWeight: IItemWeight[] = productDtos[index]?.itemWeight || [];
                            const weightOne: number = productDtos[index].weightOne || 0;
                            const weightTwo: number = productDtos[index].weightTwo || 0;
                            const weightThree: number = productDtos[index].weightThree || 0;
                            const weightFour: number = productDtos[index].weightFour || 0;
                            const towerFootWeight: number = productDtos[index].towerFootWeight || 0;
                            let itemTotalWeight: number = 0;
                            itemWeight.map((items: IItemWeight): number => {
                                return itemTotalWeight = itemTotalWeight + (items.weight || 0);
                            })
                            let weight: number = 0;
                            weight = Number(value) + weightOne + weightTwo + weightThree + weightFour + towerFootWeight + itemTotalWeight;
                            console.log(weight,itemTotalWeight)
                        } }/>
                </Form.Item> 
            )
        }, {
            key: 'deliveryTime',
            title: '接腿1#长度（m）',
            dataIndex: 'deliveryTime',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'projectName']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        }, {
            key: 'weightOne',
            title: '接腿1#重量（kg）',
            dataIndex: 'weightOne',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'weightOne']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        }, {
            key: 'deliveryTime',
            title: '接腿2#长度（m）',
            dataIndex: 'deliveryTime',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'projectName']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        }, {
            key: 'weightTwo',
            title: '接腿2#重量（kg）',
            dataIndex: 'weightTwo',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'weightTwo']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        }, {
            key: 'deliveryTime',
            title: '接腿3#长度（m）',
            dataIndex: 'deliveryTime',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'projectName']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        }, {
            key: 'weightThree',
            title: '接腿3#重量（kg）',
            dataIndex: 'weightThree',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'weightThree']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        }, {
            key: 'deliveryTime',
            title: '接腿#4长度（m）',
            dataIndex: 'deliveryTime',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'projectName']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        }, {
            key: 'weightFour',
            title: '接腿#4重量（kg）',
            dataIndex: 'weightFour',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'weightFour']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        },  {
            key: 'towerFootWeight',
            title: '塔脚板重量（kg）',
            dataIndex: 'towerFootWeight',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'towerFootWeight']}>
                    <InputNumber 
                        stringMode={ false } 
                        min="0"
                        step="0.01"
                        precision={ 2 }
                        className={ layoutStyles.width100 }/>
                </Form.Item> 
            )
        },  {
            key: 'weight',
            title: '杆塔重量（kg）',
            dataIndex: 'weight',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'weight']}>
                    <Input disabled/>
                </Form.Item> 
            )
        },  {
            key: 'deliveryTime',
            title: '备注',
            dataIndex: 'deliveryTime',
            width: 150,
            render: (_: undefined, record: object, index: number): React.ReactNode => (
                <Form.Item name={['productDtos', index,'projectName']}>
                    <Input maxLength={ 50 }/>
                </Form.Item> 
            )
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 180,
            fixed: 'right',
            render: (_: undefined, record: object, index: number): React.ReactNode => (
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
        let itemWeight: IItemWeight[] = this.getForm()?.getFieldsValue(true).productDtos[index].itemWeight;
        itemWeight && itemWeight.map((item: IItemWeight, index: number) => {
            if(item.item && item.item !== "") {
                itemWeight = itemWeight;
            } else {
                itemWeight.splice(index, 1);
            }
        })
        const productDtos: ITower[] = this.getForm()?.getFieldsValue(true).productDtos || [];
        productDtos[index] = {
            ...productDtos[index],
            itemWeight: itemWeight
        }
        let fieldsValue = {
            ...this.getForm()?.getFieldsValue(true),
            productDtos: [...productDtos]
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
        const productDtos: ITower[] = towerShape?.productDtos || [];
        const itemWeight: IItemWeight[] = productDtos[index]?.itemWeight || [];
        let itemTotalWeight: number = 0;
        let a: boolean[] = itemWeight.map((items: IItemWeight, ind: number): boolean => {
            const b = this.getForm()?.validateFields([['productDtos', index, "itemWeight", ind ,'item'], ['productDtos', index, "itemWeight", ind ,'weight']])
            .then(() => {
                // itemTotalWeight = itemTotalWeight + (items.weight || 0);
                // this.setState({
                //     isVisible: false,
                //     oldTowerShape: this.getForm()?.getFieldsValue(true)
                // })
                return true;
            }).catch((error) => {
                return false;
            })
            console.log(b)
            return false
        })
        // const bodyWeight: number = productDtos[index].bodyWeight || 0;
        // const weightOne: number = productDtos[index].weightOne || 0;
        // const weightTwo: number = productDtos[index].weightTwo || 0;
        // const weightThree: number = productDtos[index].weightThree || 0;
        // const weightFour: number = productDtos[index].weightFour || 0;
        // const towerFootWeight: number = productDtos[index].towerFootWeight || 0;
        // let weight: number = 0;
        // weight = bodyWeight + weightOne + weightTwo + weightThree + weightFour + towerFootWeight + itemTotalWeight;
        // console.log(itemTotalWeight)
    }

    /**
      * @implements
      * @description Gets table columns
      * @param item 
      * @returns table columns 
      */
    public getItemColumns(index: number): TableColumnType<object>[] {        
        return [{
            key: 'item',
            title: '* 增重项',
            dataIndex: 'item',
            width: 150,
            render: (_: undefined, record: IItemWeight, ind: number): React.ReactNode => (
                <Form.Item initialValue={ record.item } name={['productDtos', index, "itemWeight", ind ,'item']} rules= {[{
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
            render: (_: undefined, record: IItemWeight, ind: number): React.ReactNode => (
                <Form.Item initialValue={ record.weight } name={['productDtos', index, "itemWeight", ind,'weight']} rules= {[{
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
        const productDtos: ITower[] = towerShape?.productDtos || [];
        const itemWeight: IItemWeight[] = productDtos[index]?.itemWeight || [];
        let item: IItemWeight = {
            id: Math.random(),
            item: '',
            weight: undefined
        }
        productDtos[index] = {
            ...productDtos[index],
            itemWeight:[ 
                ...itemWeight || [],
                item
            ]
        }
        this.setState({
            towerShape: towerShape
        })
        const productDtosVlue: ITower[] = this.getForm()?.getFieldsValue(true).productDtos || [];
        productDtosVlue[index] = {
            ...productDtosVlue[index],
            itemWeight:[ 
                ...(productDtosVlue[index].itemWeight || []),
                item
            ]
        }
        let fieldsValue = {
            ...this.getForm()?.getFieldsValue(true),
            productDtos: [...productDtosVlue]
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
        const productDtos: ITower[] = towerShape?.productDtos || [];
        const itemWeight: IItemWeight[] = productDtos[index]?.itemWeight || [];
        return <>
            {this.state.isVisible ? <Modal title="增重项" visible={ this.state.isVisible } onCancel={ this.onModalClose } width={ "30%" } okText="确定" cancelText="取消" onOk={ this.onModalOk }>
                <Button type="primary" onClick={ this.itemWeightAddRow } className={ styles.btn }>添加行</Button>
                <Table rowKey= {this.getTableRowKey()} bordered={ true } dataSource = { [...itemWeight] } columns={ this.getItemColumns(index) } pagination = { false }/>
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
        const productDtos: ITower[] = towerShape?.productDtos || [];
        productDtos.splice(index, 1);
        this.setState({
            towerShape: {
                ...towerShape,
                productDtos: [...productDtos]
            }
        })
    }

    /**
     * @description 弹窗删除行
     * @param event 
     */
    private onModalDelete = (index: number, ind: number): void => {
        const towerShape: ITowerShape | undefined = this.getForm()?.getFieldsValue(true);
        const productDtos: ITower[] = towerShape?.productDtos || [];
        const itemWeight: IItemWeight[] = productDtos && productDtos[index]?.itemWeight || [];
        itemWeight.splice(ind, 1);
        this.setState({
            towerShape: {
                ...towerShape,
                productDtos:[...productDtos] 
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
            dataSource: this.state.towerShape?.productDtos || [],
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
                            const productDtos: ITower[] = towerShape?.productDtos || [];
                            let product: ITower = {
                                state: 0,
                                projectName: '',
                                internalNumber: '',
                                itemWeight: []
                            }
                            this.setState({
                                towerShape: {
                                    ...towerShape,
                                    productDtos: [...productDtos, product]
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