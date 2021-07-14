/**
 * @author zyc
 * @copyright © 2021
 */

import { Button, Form, FormInstance, Input, Modal, Popconfirm, Space, Table, TableColumnType } from 'antd';
import { ColumnType} from 'antd/lib/table';
import { GetRowKey } from 'rc-table/lib/interface';
import React from 'react';
import RequestUtil from '../../../utils/RequestUtil';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { IProductAdditionalDTOList, IProductDeployVOList, IProductDTOList } from './ITowerShape';

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
                return  productAdditional += (items.weight || 0);
            })
            const productDeployRow: string[] | undefined = records.productDeployVOList?.map((items: IProductDeployVOList) => {
                return items.partNum + '*' + items.number;
            })
            return {
                ...records,
                productAdditional: productAdditional,
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
            return {
                ...items,
                productDeployVOList: towerSection[index]?.productDeployVOList
            }
        })
        console.log(values)
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
                    { record.status === 4 ? '审批中' : record.status === 3 ? '已下发': record.status === 2 ? '待下发' : '新建' }
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
                        let productDeployVOList: IProductDeployVOList[] = this.getForm()?.getFieldsValue(true)[index].productDeployVOList;
                        productDeployVOList && productDeployVOList.map((item: IProductDeployVOList, index: number) => {
                            if(item.partNum && item.partNum !== "") {
                                productDeployVOList = productDeployVOList;
                            } else {
                                productDeployVOList.splice(index, 1);
                            }
                        })
                        const towerSection: IProductDTOList[] = this.getForm()?.getFieldsValue(true) || [];
                        towerSection[index] = {
                            ...towerSection[index],
                            productDeployVOList: productDeployVOList
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
                <Form.Item initialValue={ record.partNum } name={[index, 'productDeployVOList', ind ,'partNum']} rules= {[{
                    required: true,
                    message: '请输入段号'
                }]}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'number',
            title: '* 段号数',
            dataIndex: 'number',
            width: 150,
            render: (_: undefined, record: IProductDeployVOList, ind: number): React.ReactNode => (
                <Form.Item initialValue={ record.number } name={[index, 'productDeployVOList', ind,'number']} rules= {[{
                    required: true,
                    message: '请输入段号数'
                }]}>
                    <Input/>
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
                        title="要删除该身部配段吗？" 
                        placement="topRight" 
                        okText="确认"
                        cancelText="取消"
                        onConfirm={ () => { this.onDelete(index, ind) } }
                    >
                        <DeleteOutlined/>
                    </Popconfirm>
                </Space>
            )
        }];
    }

    /**
     * @description 配段弹窗删除行
     * @param event 
     */
    private onDelete = (index: number, ind: number): void => {
        const towerSection: IProductDTOList[] | undefined = Object.values(this.getForm()?.getFieldsValue(true));
        const productDeployVOList: IProductDeployVOList[] | undefined = towerSection[index].productDeployVOList;     
        productDeployVOList && productDeployVOList.splice(ind, 1);
        this.setState({
            towerSection: [...towerSection]
        }) 
        this.getForm()?.setFieldsValue([...towerSection])
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
        values[bodyIndex].productDeployVOList.map((items: any,ind: number) => {
            this.getForm()?.validateFields([[bodyIndex,'productDeployVOList',ind,'partNum'], [bodyIndex,'productDeployVOList',ind,'number']]).then((res) => {
                const productDeployRow: [] = values[bodyIndex].productDeployVOList.map((items: IProductDeployVOList) => {
                    return items.partNum + '*' + items.number;
                })
                towerSection[bodyIndex] = {
                    ...this.getForm()?.getFieldsValue(true)[bodyIndex],
                    productDeploy: productDeployRow.join('+'),
                    productDeployVOList: values[bodyIndex].productDeployVOList
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
    }
    
    /**
     * @description 弹窗列表新增行
     * @param event 
     */
    public addBodyRow = (): void => {
        const bodyIndex: number = this.state.bodyIndex;
        let towerSection: IProductDTOList[] = this.state.towerSection;
        let productDeployVOList: IProductDeployVOList[] | undefined = towerSection && towerSection[bodyIndex || 0]?.productDeployVOList || [];
        let item: IProductDeployVOList = {
            id: Math.random(),
            partNum: '',
            number: undefined
        }
        if(towerSection && bodyIndex !== undefined) {
            towerSection[bodyIndex] = {
                ...towerSection[bodyIndex],
                productDeployVOList: [ 
                    ...productDeployVOList || [],
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
        let productDeployVOList: IProductDeployVOList[] | undefined = towerSection && towerSection[bodyIndex || 0]?.productDeployVOList || [];
        return <Modal visible={ this.state.isBodyVisible } title="配段" onCancel={ this.onModalClose } width={ "30%" } footer={ null }>
            <Button type="primary" onClick={ this.addBodyRow }>添加行</Button>
            <Table rowKey="id" bordered={ true } dataSource = { [...productDeployVOList] } columns={ this.getItemColumns(bodyIndex || 0) } pagination = { false }/>
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
