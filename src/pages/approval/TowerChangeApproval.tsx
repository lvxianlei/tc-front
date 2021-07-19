/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, message, Table, TableColumnType } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import { IFormItemGroup } from '../../components/AbstractFillableComponent';
import RequestUtil from '../../utils/RequestUtil';
import { IRenderedSection } from '../../utils/SummaryRenderUtil';
import AbstractTowerShapeSetting, { IAbstractTowerShapeSettingState } from '../product/TowerShape/AbstractTowerShapeSetting';
import { IProductDTOList, ITowerShape } from '../product/TowerShape/ITowerShape';

export interface ITowerChangeApprovalProps {
    readonly businessId: any;
    readonly id: string;
}
export interface ITowerChangeApprovalRouteProps extends RouteComponentProps<ITowerChangeApprovalProps>, WithTranslation {}
export interface ITowerChangeApprovalState extends IAbstractTowerShapeSettingState {}

interface ITowerShapeChange extends ITowerShape {
    productDTOList?: IProductDTOList[];
} 

//类型
enum StateType {
    UNCHANGED = 0,              //未变更
    NEWREFERENCE = 1,         //新增引用
    QUOTE = 2,                //删除引用
    MODIFYREFERENCE = 3     //修改引用内容         
}
/**
 * Product change approval
 */
class TowerChangeApproval extends AbstractTowerShapeSetting<ITowerChangeApprovalRouteProps, ITowerChangeApprovalState> {

    // /**
    //  * @override
    //  * @description Gets state
    //  * @returns state 
    //  */
    // protected getState(): ITowerChangeApprovalState {
    //     return {
    //         ...super.getState(),
    //         isChangeProduct: true
    //     };
    // }

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
        const towerShape: ITowerShapeChange = await RequestUtil.get<ITowerShapeChange>('/tower-market/saleOrder/getSaleOrderByAuditId', {
            auditId: this.props.match.params.id
        });
        this.setState({
            towerShape: {
                ...towerShape,
                // productChangeRecordVos: towerShape.productChangeRecordVos?.map<IProductDTOList>((product: IProductDTOList, index: number): IProductDTOList => {
                //     return {
                //         ...product,
                //         index: index + 1
                //     };
                // })
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
            render: (changeType: number): React.ReactNode => {
                switch (changeType) {
                    case StateType.UNCHANGED:
                        return '未变更';
                    case StateType.MODIFYREFERENCE:
                        return '修改';
                    case StateType.NEWREFERENCE:
                        return '变更前'
                    case StateType.QUOTE:
                        return '变更后'
                }
            }
        }, {
            title: '序号',
            dataIndex: 'index'
        },
        {
            title: '线路名称',
            dataIndex: 'lineName'
        }, {
            title: '产品类型',
            dataIndex: 'productTypeName'
        }, {
            title: '塔型',
            dataIndex: 'productShape'
        }, {
            title: '杆塔号',
            dataIndex: 'productNumber'
        }, {
            title: '电压等级',
            dataIndex: 'voltageGradeName'
        }, {
            title: '呼高（米）',
            dataIndex: 'productHeight'
        }, {
            title: '身部重量（kg）',
            dataIndex: 'bodyWeight'
        }, {
            title: '接腿1#长度（m）',
            dataIndex: 'towerLeg1Length'
        }, {
            title: '接腿1#重量（kg）',
            dataIndex: 'towerLeg1Weight'
        }, {
            title: '接腿2#长度（m）',
            dataIndex: 'towerLeg2Length'
        }, {
            title: '接腿2#重量（kg）',
            dataIndex: 'towerLeg2Weight'
        }, {
            title: '接腿3#长度（m）',
            dataIndex: 'towerLeg3Length'
        }, {
            title: '接腿3#重量（kg）',
            dataIndex: 'towerLeg3Weight'
        }, {
            title: '接腿4#长度（m）',
            dataIndex: 'towerLeg4Length'
        }, {
            title: '接腿4#重量（kg）',
            dataIndex: 'towerLeg4Weight'
        }, {
            title: '塔脚板重量（kg）',
            dataIndex: 'towerFootWeight'
        }, {
            title: '杆塔重量（kg）',
            dataIndex: 'productWeight'
        }, {
            title: '备注',
            dataIndex: 'description'
        }];
    }

    // /**
    //  * @override
    //  * @description Renders extra sections
    //  * @returns extra sections 
    //  */
    // public renderExtraSections(): IRenderedSection[] {
    //     return [{
    //         title: '产品信息',
    //         render: (): React.ReactNode => {
    //             return <Table rowKey="index" bordered={true} pagination={false}
    //                 columns={this.getProductTableColumns()} dataSource={this.state.towerShape?.productChangeRecordVos} />;
    //         }
    //     }];
    // }

    /**
     * @override
     * @description Gets primary operation button label
     * @returns primary operation button label 
     */
    protected getPrimaryOperationButtonLabel(): string {
        return '通过';
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