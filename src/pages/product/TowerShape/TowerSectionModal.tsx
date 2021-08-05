/**
 * @author zyc
 * @copyright © 2021
 */

import { Button, Form, FormInstance, Input, InputNumber, message, Modal, Popconfirm, Space, Table, TableColumnType } from 'antd';
import { ColumnType} from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';
import RequestUtil from '../../../utils/RequestUtil';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { IProductAdditionalDTOList, IProductDeployVOList, IProductDTOList } from './ITowerShape';
import layoutStyles from '../../../layout/Layout.module.less';
import { RuleObject } from 'antd/lib/form';
import { StoreValue } from 'antd/lib/form/interface';

export interface ITowerSectionModalProps {
    readonly id?: number | string;
}

export interface ITowerSectionModalState {
    readonly isModalVisible: boolean;
    readonly towerSection: IProductDTOList[];
    readonly oldTowerSection: IProductDTOList[];
    readonly isBodyVisible?: boolean;
    readonly bodyIndex: number;
}

export default abstract class TowerSectionModal<P extends ITowerSectionModalProps, S extends ITowerSectionModalState> extends React.Component<P,S> {

    private form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    /**
     * @protected
     * @description Gets form
     * @returns form 
     */
    protected getForm(): FormInstance | null {
        return this.form?.current;
    }
    
    /**
     * @constructor
     * Creates an instance of TowerSectionModal.
     * @param props 
     */
    constructor(props: P) {
        super(props);
        this.state = this.getState();
    }

    /**
     * @description Gets state, it can override.
     */
    protected getState(): S {
        return {
            isModalVisible: false,
            isBodyVisible: false
        } as S;
    }

    /**
     * @description 取消操作 
     * @param event 
     */
    public handleCancel = (): void => {
        this.setState ({
            isModalVisible: false
        })
        this.getForm()?.resetFields();
    };

    /**
     * @description 显示弹窗 
     * @param event 
     */
    public showModal = async (): Promise<void> => {
        let towerSection: IProductDTOList[] = await RequestUtil.get(`/tower-data-archive/product/${ this.props.id }`);
        towerSection = towerSection.map((records: IProductDTOList) => {
            let productAdditional: number = 0;
            records.productAdditionalDTOList?.map((items: IProductAdditionalDTOList): number => {
                return productAdditional += (Number(items.weight) || 0);
            })
            const productDeployRow: string[] | undefined = records.productDeployVOList?.map((items: IProductDeployVOList) => {
                return items.partNum + '*' + items.number;
            })
            return {
                ...records,
                towerLeg1Length: records.towerLeg1Length == -1 ? undefined : records.towerLeg1Length,
                towerLeg1Weight: records.towerLeg1Weight == -1 ? undefined : records.towerLeg1Weight,
                towerLeg2Length: records.towerLeg2Length == -1 ? undefined : records.towerLeg2Length,
                towerLeg2Weight: records.towerLeg2Weight == -1 ? undefined : records.towerLeg2Weight,
                towerLeg3Length: records.towerLeg3Length == -1 ? undefined : records.towerLeg3Length,
                towerLeg3Weight: records.towerLeg3Weight == -1 ? undefined : records.towerLeg3Weight,
                towerLeg4Length: records.towerLeg4Length == -1 ? undefined : records.towerLeg4Length,
                towerLeg4Weight: records.towerLeg4Weight == -1 ? undefined : records.towerLeg4Weight,
                towerFootWeight: records.towerFootWeight == -1 ? undefined : records.towerFootWeight,
                productAdditional: parseFloat(productAdditional.toFixed(2)),
                productDeployDTOList: records.productDeployVOList,
                productDeploy: productDeployRow?.join('+')
            }
        })
        this.setState({
            isModalVisible: true,
            towerSection: towerSection,
        })
        this.getForm()?.setFieldsValue(towerSection);
    }

    /**
     * @description Gets table data source
     * @param item 
     * @returns table data source 
     */
    public getTableDataSource(): object[] {
        return this.state.towerSection;
    };

    /**
     * @description 杆塔配段确定
     * @param event 
     */
    public towerSectionSubmit = async (values: Record<string, any>): Promise<void> => {
        const towerSection: IProductDTOList[] = this.getForm()?.getFieldsValue(true);
        values = Object.values(values);
        values = values.map((items: IProductDTOList, index: number) => {
            const productDeploy: IProductDeployVOList[] | undefined = this.state.towerSection[index]?.productDeployDTOList || [];
            const productDeployDTOList: IProductDeployVOList[] | undefined = towerSection[index].productDeployDTOList?.map((item: IProductDeployVOList, ind: number) => {
                return {
                    ...item,
                    productId: this.state.towerSection[index]?.id,
                    status: productDeploy[ind].status || 1 
                }
            })
            return {
                ...items,
                id: this.state.towerSection[index].id,
                productNumber: this.state.towerSection[index].productNumber,
                productCategoryId: this.state.towerSection[index]?.productCategoryId,
                productDeployDeleteList: this.state.towerSection[index]?.productDeployDeleteList,
                productDeployDTOList: productDeployDTOList
            }
        })
        await RequestUtil.post('/tower-data-archive/product', values);
        this.setState ({
            isModalVisible: false
        })
        this.getForm()?.resetFields();
    }

    /**
     * @implements
     * @description Gets table columns
     * @param item 
     * @returns table columns 
     */
    public getTableColumns(): ColumnType<object>[] {
        return [{
            key: 'status',
            title: '状态',
            width: 120,
            dataIndex: 'status',
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.status } name={[index, 'status']}>
                    { record.status === 0 ? '新建' : record.status === 1 ? '待下发' : record.status === 2 ? '审批中' : '已下发' }
                </Form.Item> 
            )
        }, {
            key: 'lineName',
            title: '线路名称',
            width: 150,
            dataIndex: 'lineName'
        }, {
            key: 'productNumber',
            title: '杆塔号',
            width: 150,
            dataIndex: 'productNumber'
        }, {
            key: 'productTypeName',
            title: '产品类型',
            width: 150,
            dataIndex: 'productTypeName'
        }, {
            key: 'voltageGradeName',
            title: '电压等级（kv）',
            width: 120,
            dataIndex: 'voltageGradeName'
        }, {
            key: 'productHeight',
            title: '呼高（m）',
            width: 120,
            dataIndex: 'productHeight'
        }, {
            key: 'bodyWeight',
            title: '身部重量（kg）',
            width: 150,
            dataIndex: 'bodyWeight'
        }, {
            key: 'towerLeg1Length',
            title: '接腿1#长度（m）',
            width: 150,
            dataIndex: 'towerLeg1Length'
        }, {
            key: 'towerLeg1Weight',
            title: '接腿1#重量（kg）',
            width: 150,
            dataIndex: 'towerLeg1Weight'
        }, {
            key: 'towerLeg2Length',
            title: '接腿2#长度（m）',
            width: 150,
            dataIndex: 'towerLeg2Length'
        }, {
            key: 'towerLeg2Weight',
            title: '接腿2#重量（kg）',
            width: 150,
            dataIndex: 'towerLeg2Weight'
        }, {
            key: 'towerLeg3Length',
            title: '接腿3#长度（m）',
            width: 150,
            dataIndex: 'towerLeg3Length'
        }, {
            key: 'towerLeg3Weight',
            title: '接腿3#重量（kg）',
            width: 150,
            dataIndex: 'towerLeg3Weight'
        }, {
            key: 'towerLeg4Length',
            title: '接腿4#长度（m）',
            width: 150,
            dataIndex: 'towerLeg4Length'
        }, {
            key: 'towerLeg4Weight',
            title: '接腿4#重量（kg）',
            width: 150,
            dataIndex: 'towerLeg4Weight'
        }, {
            key: 'productAdditional',
            title: '增重（kg）',
            width: 150,
            dataIndex: 'productAdditional'
        }, {
            key: 'productWeight',
            title: '杆塔重量（kg）',
            width: 150,
            dataIndex: 'productWeight'
        }, {
            key: 'description',
            title: '备注',
            width: 150,
            dataIndex: 'description'
        }, {
            key: 'productDeploy',
            title: '身部段号',
            width: 150,
            dataIndex: 'productDeploy',
            fixed: 'right',
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item name={[index, 'productDeploy']}>
                    <Input suffix={ <FormOutlined onClick={ () => {
                        let productDeployDTOList: IProductDeployVOList[] = this.getForm()?.getFieldsValue(true)[index].productDeployDTOList;
                        productDeployDTOList && productDeployDTOList.map((item: IProductDeployVOList, index: number) => {
                            if(item.partNum && item.partNum !== "") {
                                productDeployDTOList = productDeployDTOList;
                            } else {
                                productDeployDTOList.splice(index, 1);
                            }
                        })
                        const towerSection: IProductDTOList[] = this.getForm()?.getFieldsValue(true) || [];
                        towerSection[index] = {
                            ...towerSection[index],
                            productDeployDTOList: productDeployDTOList
                        }
                        this.setState({
                            isBodyVisible: true,
                            bodyIndex: index,
                            oldTowerSection: towerSection
                        })
                    } }/> }/>
                </Form.Item> 
            )
        }, {
            key: 'towerLeg1Num',
            title: '接腿1#段号',
            width: 100,
            dataIndex: 'towerLeg1Num',
            fixed: 'right',
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.towerLeg1Num } name={[index, 'towerLeg1Num']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'towerLeg2Num',
            title: '接腿2#段号',
            width: 100,
            dataIndex: 'towerLeg2Num',
            fixed: 'right',
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.towerLeg2Num } name={[index, 'towerLeg2Num']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'towerLeg3Num',
            title: '接腿3#段号',
            width: 100,
            dataIndex: 'towerLeg3Num',
            fixed: 'right',
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.towerLeg3Num } name={[index, 'towerLeg3Num']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'towerLeg4Num',
            title: '接腿4#段号',
            width: 100,
            dataIndex: 'towerLeg4Num',
            fixed: 'right',
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.towerLeg4Num } name={[index, 'towerLeg4Num']}>
                    <Input/>
                </Form.Item> 
            )
        }];
    };

    /**
     * @description modal内表格 
     */
    protected renderTableContent(): React.ReactNode {
        return (
            <>
                <Table 
                    rowKey={ this.getTableRowKey() }
                    bordered={ true } 
                    dataSource={ this.getTableDataSource() } 
                    columns={ this.getTableColumns() }
                    pagination={ false }
                    scroll={{ x: true }}/>
                <Space direction="horizontal" size="small">
                    <Button type="primary" htmlType="submit">确定</Button>
                    <Button type="ghost" onClick={ this.handleCancel }>取消</Button>
                </Space>
            </>
        );
    }

    /**
     * @description 验证杆塔号
     */
    public checkPartNum = (value: StoreValue, index: number, ind: number): Promise<void | any> =>{
        return new Promise(async (resolve, reject) => {  // 返回一个promise
            const productDeployDTOList: IProductDeployVOList[] = this.getForm()?.getFieldsValue(true)[index].productDeployDTOList || [];
            if(value) {
                resolve(productDeployDTOList.map((items: IProductDeployVOList, itemInd: number) => {
                    if(ind !== itemInd && items.partNum === value) {
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
    public getItemColumns(index: number): TableColumnType<object>[] {
        return [{
            key: 'partNum',
            title: '* 段号',
            dataIndex: 'partNum',
            width: 150,
            render: (_: undefined, record: IProductDeployVOList, ind: number): React.ReactNode => (
                <Form.Item initialValue={ record.partNum } name={[index, 'productDeployDTOList', ind ,'partNum']} rules= {[{
                    required: true,
                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                        if(value !== undefined) {
                            this.checkPartNum(value, index, ind).then((res) => {
                                if (res===-1) {
                                    callback()
                                } else {
                                    callback('杆塔下段号唯一！');
                                }
                            })
                        } else {
                            callback('请输入段号');
                        }
                        
                    }
                }]}>
                    <Input disabled={ record.status === 2 }/>
                </Form.Item> 
            )
        }, {
            key: 'number',
            title: '* 段号数',
            dataIndex: 'number',
            width: 150,
            render: (_: undefined, record: IProductDeployVOList, ind: number): React.ReactNode => (
                <Form.Item initialValue={ record.number } name={[index, 'productDeployDTOList', ind,'number']} rules= {[{
                    required: true,
                    message: '请输入段号数'
                }]}>
                    <InputNumber 
                        stringMode={ false }
                        min="1"
                        max="10"
                        step="1"
                        precision={ 0 }
                        className={ layoutStyles.width100 } 
                        disabled={ record.status === 2 }/>
                </Form.Item> 
            )
        }, {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 180,
            fixed: 'right',
            render: (_: undefined, record: IProductDeployVOList, ind: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm 
                        title="要删除该身部配段吗？" 
                        placement="topRight" 
                        okText="确认"
                        cancelText="取消"
                        onConfirm={ () => { this.onDelete(index, ind, record) } }
                        disabled={ record.status === 2 }
                    >
                        <DeleteOutlined/>
                    </Popconfirm>
                </Space>
            )
        }];
    }

    /**
     * @description 配段弹窗删除行操作
     * @param event 
     */
     private toDelete = (index: number, ind: number, record?: IProductDeployVOList): void => {
        let towerSection: IProductDTOList[] | undefined = Object.values(this.getForm()?.getFieldsValue(true));
        const productDeployDTOList: IProductDeployVOList[] | undefined = towerSection[index].productDeployDTOList; 
        productDeployDTOList && productDeployDTOList.splice(ind, 1);
        const productDeployDeleteList: IProductDeployVOList[] = this.state.towerSection[index].productDeployDeleteList || [];
        record && productDeployDeleteList.push(record);
        towerSection = towerSection.map((items: IProductDTOList) => {
            return {
                ...items,
                productDeployDeleteList: productDeployDeleteList
            }
        })
        this.setState({
            towerSection: [...towerSection],
        }) 
        this.getForm()?.setFieldsValue([...towerSection])
    }

    /**
     * @description 配段弹窗删除行
     * @param event 
     */
    private onDelete = async (index: number, ind: number, record?: IProductDeployVOList): Promise<void> => {
        if(record?.id) {
            const resData: boolean =  await RequestUtil.get('/tower-data-archive//productDeploy/checkDelete', {
                partNum: record && record.partNum,
                productCategoryId: this.state.towerSection[index].productCategoryId
            });
            if(resData) {
                this.toDelete(index, ind, record);
            } else {
                message.warning('已被提料引用，无法进行删除！')
            }
        } else {
            this.toDelete(index, ind, record);
        }
    }

    /**
     * @description 弹窗关闭
     * @param event 
     */
    public onModalClose = (): void => {
        this.setState({
            isBodyVisible: false,
            towerSection: Object.values(this.state.oldTowerSection)
        })
        this.getForm()?.setFieldsValue({ ...Object.values(this.state.oldTowerSection) });
    } 

    /**
     * @description 弹窗确定
     * @param event 
     */
    public onBodyModalSubmit = (): void => {
        const bodyIndex: number = this.state.bodyIndex;
        let towerSection: IProductDTOList[] = this.state.towerSection;
        const values = this.getForm()?.getFieldsValue(true);
        if(values[bodyIndex].productDeployDTOList.length > 0) {
            values[bodyIndex].productDeployDTOList.map((items: any,ind: number) => {
                this.getForm()?.validateFields([[bodyIndex,'productDeployDTOList',ind,'partNum'], [bodyIndex,'productDeployDTOList',ind,'number']]).then((res) => {
                    const productDeployRow: [] = values[bodyIndex].productDeployDTOList.map((items: IProductDeployVOList) => {
                        return items.partNum + '*' + items.number;
                    })
                    towerSection[bodyIndex] = {
                        ...this.getForm()?.getFieldsValue(true)[bodyIndex],
                        productDeploy: productDeployRow.join('+'),
                        productDeployDTOList: values[bodyIndex].productDeployDTOList
                    };
                    this.setState({
                        isBodyVisible: false,
                        towerSection: towerSection,
                        oldTowerSection: towerSection
                    })
                    this.getForm()?.setFieldsValue({ ...Object.values(towerSection) });
                }).catch(error => {
                    // return error.errorFields[0].errors
                })
            })
        } else {
            towerSection[bodyIndex] = {
                ...this.getForm()?.getFieldsValue(true)[bodyIndex],
                productDeploy: '',
            };
            this.setState({
                isBodyVisible: false,
                towerSection: towerSection
            })
            this.getForm()?.setFieldsValue({ ...Object.values(towerSection) });
        }
        
    }
    
    /**
     * @description 弹窗列表新增行
     * @param event 
     */
    public addBodyRow = (): void => {
        const bodyIndex: number = this.state.bodyIndex;
        let towerSection: IProductDTOList[] = this.state.towerSection;
        let productDeployDTOList: IProductDeployVOList[] | undefined = towerSection && towerSection[bodyIndex || 0]?.productDeployDTOList || [];
        let item: IProductDeployVOList = {
            partNum: '',
            number: undefined
        }
        if(towerSection && bodyIndex !== undefined) {
            towerSection[bodyIndex] = {
                ...towerSection[bodyIndex],
                productDeployDTOList: [ 
                    ...productDeployDTOList || [],
                    item
                ]
            };
            this.setState({
                towerSection: towerSection
            })
        }
    }

    /**
     * @description 配段弹窗
     * @param event 
     */
    public bodySectionModal(): React.ReactNode {
        const bodyIndex: number = this.state.bodyIndex;
        let towerSection: IProductDTOList[] = this.state.towerSection;
        let productDeployDTOList: IProductDeployVOList[] | undefined = towerSection && towerSection[bodyIndex || 0]?.productDeployDTOList || [];
        return <Modal visible={ this.state.isBodyVisible } title="配段" onCancel={ this.onModalClose } width={ "30%" } footer={ null }>
            <Button type="primary" onClick={ this.addBodyRow }>添加行</Button>
            <Table rowKey="id" bordered={ true } dataSource = { [...productDeployDTOList] } columns={ this.getItemColumns(bodyIndex || 0) } pagination = { false }/>
            <Space direction="horizontal" size="small">
                <Button type="primary" htmlType="submit" onClick={ this.onBodyModalSubmit }>确定</Button>
            </Space>
        </Modal>
    }

    public render(): React.ReactNode {
        return (
            <>
                <Button onClick={ this.showModal } type="link">杆塔配段</Button>
                    <Modal 
                        title="杆塔配段" 
                        visible={ this.state.isModalVisible } 
                        footer={ false }
                        onCancel={ this.handleCancel }
                        width="80%"
                    >
                    <Form ref={ this.form } onFinish={ this.towerSectionSubmit }>
                        {this.renderTableContent()}  
                        { this.state.isBodyVisible ? this.bodySectionModal() : null }
                    </Form>
                </Modal> 
            </>
        );
    }

    protected getTableRowKey(): string | GetRowKey<object> {
        return 'id';
    }
}
