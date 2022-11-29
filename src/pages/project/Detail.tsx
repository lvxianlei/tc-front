import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Radio, Spin } from 'antd'
import CostDetail from './cost'
import PayInfo from './payInfo'
import ManagementDetailTabsTitle from './ManagementDetailTabsTitle'
import Base from "./baseInfo/Overview"
import BidDoc from "./bidDoc/Overview"
import QualificationReview from "./qualificationReview/Overview"
import BidResult from "./bidResult/Overview"
import FrameAgreement from './frameAgreement'
import ProductGroup from './productGroup'
import SalesPlan from './salesPlan'
// 合同列表
import ContractList from "./contract";
import SaleOrder from "./order";
export type TabTypes = "base" | "bidDoc" | "bidResult" | "frameAgreement" | "contract" | "productGroup" | "salesPlan" | "payInfo" | undefined

export default function ManagementDetail(): React.ReactNode {
    const params = useParams<{ id: string, tab?: TabTypes }>()
    const [contractStatus, setContractStatus] = useState<string>("contract");
    const [contractLoading, setContractLoaing] = useState<boolean>(false);

    // 点击合同以及订单
    const operationChange = (event: any) => {
        setContractStatus(event.target.value);
        setContractLoaing(true);
        setTimeout(() => {
            setContractLoaing(false);
        }, 500);
    }

    const tabItems: { [key: string]: JSX.Element | React.ReactNode } = {
        tab_base: <Base id={params.id} />,
        tab_cost: <CostDetail />,
        tab_bidDoc: <BidDoc id={params.id} />,
        tab_qualificationReview: <QualificationReview id={params.id} />,
        tab_bidResult: <BidResult id={params.id} />,
        tab_frameAgreement: <FrameAgreement />,
        tab_contract: <>
            <div style={{ paddingTop: 16 }}>
                <Radio.Group defaultValue={"contract"} onChange={operationChange}>
                    <Radio.Button value={"contract"} key={`contract`}>合同</Radio.Button>
                    <Radio.Button value={"order"} key={"order"}>订单</Radio.Button>
                </Radio.Group>
            </div>
            <Spin spinning={contractLoading}>
                {
                    contractStatus === "contract" ? <ContractList /> : <SaleOrder />
                }
            </Spin>
        </>,
        tab_productGroup: <ProductGroup />,
        tab_salesPlan: <SalesPlan />,
        tab_payInfo: <PayInfo />
    }
    return <>
        <ManagementDetailTabsTitle />
        {tabItems['tab_' + (params.tab || 'base')]}
    </>
}