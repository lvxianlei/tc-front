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

// import styles from './TowerSectionModal.module.less';

export interface ITowerSectionModalProps {
    readonly id?: number | string;
}

export interface ITowerSectionModalState {
    readonly isModalVisible: boolean;
    readonly towerSection: ITowerSection[];
    readonly oldTowerSection: ITowerSection[];
    readonly isBodyVisible?: boolean;
    readonly bodyIndex: number;
}

interface ITowerSection {
    readonly id?: number | string;
    readonly name?: string;
    readonly phone?: string;
    readonly a?: string;
    readonly b?: string;
    readonly d?: string;
    readonly projectName?: string;
    readonly bodySection?: IBodySection[]; 
}
interface IBodySection {
    readonly id?: number | string;
    readonly item?: string;
    readonly weight?: string;
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
        let towerSection: ITowerSection[] = await RequestUtil.get(`/tower-market/${ this.props.id }`);
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
    public towerSectionSubmit = (values: Record<string, any>): void => {
        const towerSection: ITowerSection[] = this.getForm()?.getFieldsValue(true);
        values = Object.values(values);
        values = values.map((items: ITowerSection, index: number) => {
            return {
                ...items,
                bodySection: towerSection[index]?.bodySection
            }
        })
        console.log(values)
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
            key: 'type',
            title: '状态',
            width: 120,
            dataIndex: 'type',
        }, {
            key: 'name',
            title: '线路名称',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.name } name={[index, 'name']} fieldKey={[index, 'name']}>
                    { record.name }
                </Form.Item> 
            )
        }, {
            key: 'linkman',
            title: '杆塔号',
            width: 150,
            dataIndex: 'linkman'
        }, {
            key: 'phone',
            title: '产品类型',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '电压等级（kv）',
            width: 120,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '呼高（m）',
            width: 120,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '身部重量（kg）',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '接腿1#长度（m）',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '接腿1#重量（kg）',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '接腿2#长度（m）',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '接腿2#重量（kg）',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '接腿3#长度（m）',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '接腿3#重量（kg）',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '接腿4#长度（m）',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '接腿4#重量（kg）',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '增重（kg）',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '杆塔重量（kg）',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'phone',
            title: '备注',
            width: 150,
            dataIndex: 'phone'
        }, {
            key: 'projectName',
            title: '身部段号',
            width: 150,
            dataIndex: 'projectName',
            fixed: 'right',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.projectName } name={[index, 'projectName']}>
                    <Input suffix={ <FormOutlined onClick={ () => {
                        let bodySection: IBodySection[] = this.getForm()?.getFieldsValue(true)[index].bodySection;
                        bodySection && bodySection.map((item: IBodySection, index: number) => {
                            if(item.item && item.item !== "") {
                                bodySection = bodySection;
                            } else {
                                bodySection.splice(index, 1);
                            }
                        })
                        const towerSection: ITowerSection[] = this.getForm()?.getFieldsValue(true) || [];
                        towerSection[index] = {
                            ...towerSection[index],
                            bodySection: bodySection
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
            key: 'phone',
            title: '接腿1#段号',
            width: 100,
            dataIndex: 'phone',
            fixed: 'right',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.phone } name={[index, 'phone']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'd',
            title: '接腿2#段号',
            width: 100,
            dataIndex: 'd',
            fixed: 'right',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.d } name={[index, 'd']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'a',
            title: '接腿3#段号',
            width: 100,
            dataIndex: 'a',
            fixed: 'right',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.a } name={[index, 'a']}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'b',
            title: '接腿4#段号',
            width: 100,
            dataIndex: 'b',
            fixed: 'right',
            render: (_: undefined, record: ITowerSection, index: number): React.ReactNode => (
                <Form.Item initialValue={ record.b } name={[index, 'b']}>
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
            key: 'item',
            title: '* 段号',
            dataIndex: 'item',
            width: 150,
            render: (_: undefined, record: IBodySection, ind: number): React.ReactNode => (
                <Form.Item initialValue={ record.item } name={[index, 'bodySection', ind ,'item']} rules= {[{
                    required: true,
                    message: '请输入段号'
                }]}>
                    <Input/>
                </Form.Item> 
            )
        }, {
            key: 'weight',
            title: '* 段号数',
            dataIndex: 'weight',
            width: 150,
            render: (_: undefined, record: IBodySection, ind: number): React.ReactNode => (
                <Form.Item initialValue={ record.weight } name={[index, 'bodySection', ind,'weight']} rules= {[{
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
        const towerSection: ITowerSection[] | undefined = Object.values(this.getForm()?.getFieldsValue(true));
        const bodySection: IBodySection[] | undefined = towerSection[index].bodySection;     
        bodySection && bodySection.splice(ind, 1);
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
        this.getForm()?.setFieldsValue({...Object.values(this.state.oldTowerSection)});
    } 

    /**
     * @description 弹窗确定
     * @param event 
     */
    public onBodyModalSubmit = (): void => {
        const bodyIndex: number = this.state.bodyIndex;
        let towerSection: ITowerSection[] = this.state.towerSection;
        const values = this.getForm()?.getFieldsValue(true);
        values[bodyIndex].bodySection.map((items: any,ind: number) => {
            this.getForm()?.validateFields([[bodyIndex,'bodySection',ind,'item'], [bodyIndex,'bodySection',ind,'weight']]).then((res) => {
                const a: [] = values[bodyIndex].bodySection.map((items: IBodySection) => {
                    return items.item+'*'+items.weight
                })
                towerSection[bodyIndex] = {
                    ...this.getForm()?.getFieldsValue(true)[bodyIndex],
                    projectName: a.join('+'),
                    bodySection: values[bodyIndex].bodySection
                };
                this.setState({
                    isBodyVisible: false,
                    towerSection: towerSection,
                    oldTowerSection: towerSection
                })
                this.getForm()?.setFieldsValue({...Object.values(towerSection)});
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
        let towerSection: ITowerSection[] = this.state.towerSection;
        let bodySection: IBodySection[] | undefined = towerSection && towerSection[bodyIndex || 0]?.bodySection || [];
        let item: IBodySection = {
            id: Math.random(),
            item: '',
            weight: ''
        }
        if(towerSection && bodyIndex !== undefined) {
            towerSection[bodyIndex] = {
                ...towerSection[bodyIndex],
                bodySection: [ 
                    ...bodySection || [],
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
        let towerSection: ITowerSection[] = this.state.towerSection;
        let bodySection: IBodySection[] | undefined = towerSection && towerSection[bodyIndex || 0]?.bodySection || [];
        return <Modal visible={ this.state.isBodyVisible } title="配段" onCancel={ this.onModalClose } width={ "30%" } footer={ null }>
            <Button type="primary" onClick={ this.addBodyRow }>添加行</Button>
            <Table rowKey="id" bordered={ true } dataSource = { [...bodySection] } columns={ this.getItemColumns(bodyIndex || 0) } pagination = { false }/>
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
