/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, ColProps, Popconfirm } from 'antd';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

import AbstractDetailComponent from '../../../components/AbstractDetailComponent';
import { ITabItem } from '../../../components/ITabableComponent';
import { IContract } from '../../IContract';
import RequestUtil from '../../../utils/RequestUtil';
import { IRegion, IResponseData } from './AbstractContractSetting';
import { IContractAttachment } from './ContractAttachment';
import ContractRefundRecord, { IContractRefundRecord } from './ContractRefundRecord';
import ContractSummary, { IContractGeneral } from './ContractSummary';
import { Attachment } from '../../common';

export interface IContractDetailProps {
    readonly id: string;
}
export interface IContractDetailRouteProps extends RouteComponentProps<IContractDetailProps> { }
export interface IContractDetailState {
    readonly detail: IDetail;
}

interface IDetail extends IContractGeneral, IContract, IContractAttachment, IContractRefundRecord {
    readonly regionName?: string;
    readonly contractStatus?: number;
}

/**
 * Contract detail page component.
 */
export class ContractDetail extends AbstractDetailComponent<IContractDetailRouteProps, IContractDetailState> {
    requestPath = "/tower-market/contract";

    public state: IContractDetailState = {
        detail: {
            paymentPlanVos: []
        }
    }

    /**
     * @description Fetchs table data
     * @param filterValues 
     */
    protected async fetchTableData() {
        const resData: IDetail = await RequestUtil.get<IDetail>(`${this.requestPath}/${this.props.match?.params?.id}`);
        this.setState({
            detail: resData
        });
        this.getRegionName();
    }

    public async getRegionName(): Promise<void> {
        const detail: IDetail | undefined = this.state.detail;
        const region: string[] | undefined = detail?.region;
        let resData: [] = await RequestUtil.get(`/tower-system/region/${'00'}`);
        let regionName: string = '';
        if (region && detail?.countryCode === 0) {
            resData.filter((items: IRegion) => {
                if (items.code === region[0]) {
                    regionName = items.name;
                }
            })
            const secondData: IRegion[] = await RequestUtil.get(`/tower-system/region/${region[0]}`);
            if (region[1]) {
                secondData.filter((items: IRegion) => {
                    if (items.code === region[1]) {
                        regionName = regionName + '/' + items.name;
                    }
                })
                const thiedData: IRegion[] = await RequestUtil.get(`/tower-system/region/${region[1]}`);
                thiedData.filter((items: IRegion) => {
                    if (items.code === region[2]) {
                        regionName = regionName + '/' + items.name;
                    }
                })
            }
        }
        this.setState({
            detail: {
                ...detail,
                regionName: regionName
            }
        })
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
                <span>内部合同编号：{detail?.internalNumber}</span>
            )
        }, {
            span: 8,
            children: (
                <span>交货日期：{detail?.deliveryTime}</span>
            )
        }];
    }

    /**
     * @implements
     * @description Renders operation area
     * @returns operation area 
     */
    public renderOperationArea(): React.ReactNode | React.ReactNode[] {
        return [
            <Button key="new" href="/prom/contract/new">新增</Button>,
            <Button key="setting" href={`/prom/contract/setting/${this.props?.match?.params?.id}`} disabled={this.state.detail.contractStatus === 1}>编辑</Button>,
            <Popconfirm
                key="delete"
                title="要删除该合同吗？"
                okText="确认"
                cancelText="取消"
                onConfirm={async () => {
                    const resData: IResponseData = await RequestUtil.delete(`/tower-market/contract?id=${this.props.match?.params?.id}`);
                    if (resData) {
                        this.props.history.push(`/prom/contract`);
                    }
                }}
                disabled={this.state.detail.contractStatus === 1}
            >
                <Button type="default" disabled={this.state.detail.contractStatus === 1}>
                    删除
                </Button>
            </Popconfirm>
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
            content: <ContractSummary baseInfo={this.state.detail} sysInfo={this.state.detail} />
        }, {
            label: '相关附件',
            key: 2,
            content: <Attachment dataSource={this.state.detail.attachVos as any} />
        }, {
            label: '回款记录',
            key: 3,
            content: <ContractRefundRecord paymentPlanVos={[...this.state.detail.paymentPlanVos]} contractStatus={this.state.detail.contractStatus} onDeleted={() => this.fetchTableData()} />
        }];
    }
}

export default withRouter(withTranslation()(ContractDetail));