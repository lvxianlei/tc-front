/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Button, ColProps, Popconfirm } from 'antd';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import AbstractDetailComponent from '../../components/AbstractDetailComponent';
import ConfirmableButton from '../../components/ConfirmableButton';
import { ITabItem } from '../../components/ITabableComponent';
import { IContract } from '../IContract';
import RequestUtil from '../../utils/RequestUtil';
import { IRegion, IResponseData } from '../prom/contract/AbstractContractSetting';
import ContractAttachment, { IContractAttachment } from '../prom/contract/ContractAttachment';
import ContractRefundRecord, { IContractRefundRecord } from '../prom/contract/ContractRefundRecord';
import ContractSummary, { IContractGeneral } from '../prom/contract/ContractSummary';

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


class InformationDetail extends AbstractDetailComponent<IContractDetailRouteProps, IContractDetailState> {

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
        const resData: IDetail = await RequestUtil.get<IDetail>(`/tower-market/contract/${this.props.match.params.id}`);
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
                if (items.code == region[0]) {
                    regionName = items.name;
                }
            })
            const secondData: IRegion[] = await RequestUtil.get(`/tower-system/region/${region[0]}`);
            if (region[1]) {
                secondData.filter((items: IRegion) => {
                    if (items.code == region[1]) {
                        regionName = regionName + '/' + items.name;
                    }
                })
                const thiedData: IRegion[] = await RequestUtil.get(`/tower-system/region/${region[1]}`);
                thiedData.filter((items: IRegion) => {
                    if (items.code == region[2]) {
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
        return [];
    }

    /**
     * @implements
     * @description Renders operation area
     * @returns operation area 
     */
    public renderOperationArea(): React.ReactNode | React.ReactNode[] {
        return [
            <Button key="new" href="/prom/contract/new">编辑</Button>,
            <Popconfirm
                key="delete"
                title="要删除该合同吗？"
                okText="确认"
                cancelText="取消"
                onConfirm={async () => {
                    const resData: IResponseData = await RequestUtil.delete(`/tower-market/contract?id=${this.props.match.params.id}`);
                    if (resData) {
                        this.props.history.push(`/prom/contract`);
                    }
                }}
                disabled={this.state.detail.contractStatus === 1}
            >
                <Button type="default" disabled={this.state.detail.contractStatus === 1}>
                    删除
                </Button>
            </Popconfirm>,
            <Button key="setting" href={`/prom/contract/setting/${this.props.match.params.id}`} disabled={this.state.detail.contractStatus === 1}>是否应标</Button>,
            <Button key="setting" onClick={() => this.props.history.goBack()}>返回</Button>,
        ]
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
            content: <ContractSummary baseInfo={this.state.detail} />
        }];
    }
}

export default withRouter(withTranslation()(InformationDetail));