/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, message, Modal, Table, TableColumnType } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import { IFormItemGroup } from '../../components/AbstractFillableComponent';
import RequestUtil from '../../utils/RequestUtil';
import { IRenderedSection } from '../../utils/SummaryRenderUtil';
import AbstractTowerShapeSetting, { IAbstractTowerShapeSettingState } from '../product/TowerShape/AbstractTowerShapeSetting';
import { IProductAdditionalDTOList, IProductDTOList, ITowerShape } from '../product/TowerShape/ITowerShape';

export interface ITowerChangeApprovalProps {
    readonly businessId: any;
    readonly id: string;
}
export interface ITowerChangeApprovalRouteProps extends RouteComponentProps<ITowerChangeApprovalProps>, WithTranslation {}
export interface ITowerChangeApprovalState extends IAbstractTowerShapeSettingState {}

interface ITowerShapeChange extends ITowerShape {
    productChangeRecordVos?: IProductDTOList[];
} 

//类型
enum StateType {
    UNCHANGED = 0,              //未变更
    NEWREFERENCE = 1,         //新增引用
    QUOTE = 2,                //删除引用
    MODIFYREFERENCE = 3     //修改引用内容         
}

enum RecordType {
    BEFORE_THE_CHANGE = 1,
    AFTER_THE_CHANGE = 2       
}
/**
 * Product change approval
 */
class TowerChangeApproval extends AbstractTowerShapeSetting<ITowerChangeApprovalRouteProps, ITowerChangeApprovalState> {

    /**
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return "/approval/task";
    }

    /**
     * @override
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const towerShape: ITowerShapeChange = await RequestUtil.get<ITowerShapeChange>('/tower-market/audit/getProductCategoryByAuditId', {
            auditId: this.props.match.params.id
        });
        this.setState({
            towerShape: {
                ...towerShape,
                productChangeRecordVos: towerShape.productChangeRecordVos?.map<IProductDTOList>((product: IProductDTOList, index: number): IProductDTOList => {
                    return {
                        ...product,
                        index: index + 1
                    };
                })
            },
            isChange: true,
            isReference: true
        })
        this.getForm()?.setFieldsValue({
            ...towerShape
        });
    }

    /**
     * @override
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        if (this.state.towerShape) {
            return super.getFormItemGroups();
        }
        return [];
    }

    /**
     * @override
     * @description Determines whether submit on
     * @param _values 
     * @returns submit 
     */
    public onSubmit(_values: Record<string, any>): Promise<void> {
        return RequestUtil.post('/tower-market/audit/adopt', {
            auditId: this.props.match.params.id
        }).then((): void => {
            message.success('操作已成功！变更产品信息已通过审批。');
        });
    }

    /**
     * @description Determines whether reject on
     * @returns reject 
     */
    public onReject = (): Promise<void> => {
        return RequestUtil.post('/tower-market/audit/reject', {
            auditId: this.props.match.params.id
        }).then((): void => {
            message.warning('已驳回产品信息变更的申请！');
            this.props.history.push(this.getReturnPath());
        });
    }

    /**
     * @description Gets product table columns
     * @returns product table columns 
     */
    private getProductTableColumns(): TableColumnType<object>[] {
        return [{
            title: '类型',
            dataIndex: 'changeType',
            width: 120,
            render: (changeType: number): React.ReactNode => {
                switch (changeType) {
                    case StateType.UNCHANGED:
                        return '未变更';
                    case StateType.MODIFYREFERENCE:
                        return '新增引用';
                    case StateType.NEWREFERENCE:
                        return '删除引用'
                    case StateType.QUOTE:
                        return '修改内容'
                }
            }
        }, {
            title: '版本',
            dataIndex: 'recordType',
            width: 120,
            render: (recordType: number): React.ReactNode => {
                switch (recordType) {
                    case RecordType.BEFORE_THE_CHANGE:
                        return '变更前';
                    case RecordType.AFTER_THE_CHANGE:
                        return '变更后';
                }
            }
        },
        {
            title: '线路名称',
            dataIndex: 'lineName',
            width: 120,
        }, {
            title: '产品类型',
            dataIndex: 'productTypeName',
            width: 120,
        }, {
            title: '塔型',
            dataIndex: 'productCategoryName',
            width: 120,
        }, {
            title: '杆塔号',
            dataIndex: 'productNumber',
            width: 120,
        }, {
            title: '电压等级',
            dataIndex: 'voltageGradeName',
            width: 120,
        }, {
            title: '呼高（米）',
            dataIndex: 'productHeight',
            width: 120,
        }, {
            title: '身部重量（kg）',
            dataIndex: 'bodyWeight',
            width: 120,
        }, {
            title: '接腿1#长度（m）',
            dataIndex: 'towerLeg1Length',
            width: 120,
        }, {
            title: '接腿1#重量（kg）',
            dataIndex: 'towerLeg1Weight',
            width: 120,
        }, {
            title: '接腿2#长度（m）',
            dataIndex: 'towerLeg2Length',
            width: 120,
        }, {
            title: '接腿2#重量（kg）',
            dataIndex: 'towerLeg2Weight',
            width: 120,
        }, {
            title: '接腿3#长度（m）',
            dataIndex: 'towerLeg3Length',
            width: 120,
        }, {
            title: '接腿3#重量（kg）',
            dataIndex: 'towerLeg3Weight',
            width: 120,
        }, {
            title: '接腿4#长度（m）',
            dataIndex: 'towerLeg4Length',
            width: 120,
        }, {
            title: '接腿4#重量（kg）',
            dataIndex: 'towerLeg4Weight',
            width: 120,
        }, {
            title: '塔脚板重量（kg）',
            dataIndex: 'towerFootWeight',
            width: 120,
        }, {
            title: '杆塔重量（kg）',
            dataIndex: 'productWeight',
            width: 120,
        }, {
            title: '备注',
            dataIndex: 'description',
            width: 200,
        }, {
            key: 'operation',
            title: '增重项',
            dataIndex: 'operation',
            width: 180,
            fixed: 'right',
            render: (_: undefined, record: IProductDTOList, index: number): React.ReactNode => (
                <Button type="link" onClick={ () => this.itemWeightClick(index) }>
                    查看
                </Button>
            )
        }];
    }

    /**
     * @description 点击增重项事件
     * @param event 
     */
     public itemWeightClick = (index: number): void => {
        let itemWeight: IProductAdditionalDTOList[] = this.getForm()?.getFieldsValue(true).productChangeRecordVos[index].productAdditionalDTOList;
        itemWeight && itemWeight.map((item: IProductAdditionalDTOList, index: number) => {
            if(item.additionalItem && item.additionalItem !== "") {
                itemWeight = itemWeight;
            } else {
                itemWeight.splice(index, 1);
            }
        })
        const productDtos: IProductDTOList[] = this.getForm()?.getFieldsValue(true).productChangeRecordVos || [];
        productDtos[index] = {
            ...productDtos[index],
            productAdditionalDTOList: itemWeight
        }
        let fieldsValue = {
            ...this.getForm()?.getFieldsValue(true),
            productChangeRecordVos: [...productDtos]
        }
        this.setState({ isVisible: true, index: index, oldTowerShape: fieldsValue })
        this.getForm()?.setFieldsValue({ ...fieldsValue })
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
            title: '增重项',
            dataIndex: 'additionalItem',
            width: 150
        }, {
            key: 'weight',
            title: '增重（kg）',
            dataIndex: 'weight',
            width: 150
        }];
    }

      /**
     * @description 增重项弹窗
     * @param event 
     */
       public itemWeightModal = (): React.ReactNode => {
        const index: number = this.state.index || 0;
        const towerShape: ITowerShape | undefined = this.state.towerShape;
        const productChangeRecordVos: IProductDTOList[] = towerShape?.productChangeRecordVos || [];
        const productAdditionalDTOList: IProductAdditionalDTOList[] = productChangeRecordVos[index]?.productAdditionalDTOList || [];
        return <>
            { this.state.isVisible ? <Modal title="增重项" visible={ this.state.isVisible } onCancel={ () => {
                this.setState({ isVisible: false })
            } } width={ "30%" } footer={ null }>
                <Table rowKey= {this.getTableRowKey()} bordered={ true } dataSource = { [...productAdditionalDTOList] } columns={ this.getItemColumns(index) } pagination = { false }/>
            </Modal>
            : null }
        </> 
    }

    /**
     * @override
     * @description Renders extra sections
     * @returns extra sections 
     */
    public renderExtraSections(): IRenderedSection[] {
        return [{
            title: '杆塔信息',
            render: (): React.ReactNode => {
                return (<>
                    { this.itemWeightModal() }
                    <Table rowKey="index" bordered={true} pagination={false}
                        columns={this.getProductTableColumns()} dataSource={this.state.towerShape?.productChangeRecordVos} scroll={{ x: 1200 }} />
                    </>
                );
            }
        }];
    }

    /**
     * @override
     * @description Gets primary operation button label
     * @returns primary operation button label 
     */
     /**
     * @description Gets primary operation button
     * @returns primary operation button
     */
      protected getPrimaryOperationButton(): React.ReactNode {
        return <Button type="primary" htmlType="submit">通过</Button>;
    }

    /**
     * @override
     * @description Descriptions product change approval
     * @returns extra operation area 
     */
    protected renderExtraOperationArea(): React.ReactNode {
        return <Button type="default" onClick={this.onReject}>驳回</Button>;
    }
}

export default withRouter(withTranslation()(TowerChangeApproval));