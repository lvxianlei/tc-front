/**
 * @author zyc
 * @copyright © 2021
 */
import { Button, ColProps } from 'antd';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import AbstractDetailComponent from '../../../components/AbstractDetailComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { ITabItem } from '../../../components/ITabableComponent';
import RequestUtil from '../../../utils/RequestUtil';
import { IResponseData } from './SaleOrder';
import SaleOrderSummary, { ISaleOrderBaseInfo, ISaleOrderSysInfo } from './SaleOrderSummary';

export interface ISaleOrderDetailProps {
    readonly id: string;
}
export interface IContractDetailRouteProps extends RouteComponentProps<ISaleOrderDetailProps> { }
export interface ISaleOrderDetailState {
    readonly detail: IDetail;
}

interface IDetail extends ISaleOrderBaseInfo, ISaleOrderSysInfo {
    readonly id?: number;
}

/**
 * SaleOrder detail page component.
 */
export class SaleOrderDetail extends AbstractDetailComponent<IContractDetailRouteProps, ISaleOrderDetailState> {
    requestPath = "/tower-market/saleOrder";

    public state: ISaleOrderDetailState = {
        detail: {}
    }

    /**
     * @description Fetchs table data
     * @param filterValues 
     */
    protected async fetchTableData() {
        const resData: IDetail = await RequestUtil.get<IDetail>(`${this.requestPath}/${this.props.match.params.id}`);
        this.setState({
            detail: resData
        });
    }

    public async componentDidMount() {
        this.fetchTableData();
    }

    /**
     * @implements
     * @description Gets subinfo col props
     * @returns subinfo col props 
     */
    public getSubinfoColProps(): ColProps[] {
        const detail: IDetail | undefined = this.state?.detail;
        return [{
            span: 8,
            children: (
                <span>关联合同：{detail?.contractNumber}</span>
            )
        }, {
            span: 8,
            children: (
                <span>交货日期：{detail?.contractInfoVo?.deliveryTime}</span>
            )
        }];
    }

    public deleteOrder = async (): Promise<void> => {
        const resData: IResponseData = await RequestUtil.delete(`/tower-market/saleOrder?id=${this.props.match.params.id}`)
        if (resData) {
            this.props.history.go(-1);
        }
    }

    /**
     * @implements
     * @description Renders operation area
     * @returns operation area 
     */
    public renderOperationArea(): React.ReactNode | React.ReactNode[] {
        return [
            <Button key="new" href="/prom/order/new">新增</Button>,
            <Button key="setting" href={`/prom/order/setting/${this.props.match.params.id}`}>编辑</Button>,
            <ConfirmableButton key="delete" confirmTitle="要删除该订单吗？" onConfirm={this.deleteOrder}>删除</ConfirmableButton>
        ];
    }

    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
    public getTabItems(): ITabItem[] {
        return [{
            label: '概况信息',
            key: 1,
            content: <SaleOrderSummary baseInfo={this.state.detail} sysInfo={this.state.detail} />
        }];
    }
}

export default withRouter(withTranslation()(SaleOrderDetail));