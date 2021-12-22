import React from "react";
import { DetailContent, DetailTitle } from "../common";
import styles from "./ChooseApply.module.less";
import { Image } from "antd";
import hr from "../../../public/hr.png";
import develop from "../../../public/develop.png";
import general from "../../../public/general.png";
import logistic from "../../../public/logistic.png";
import marketing from "../../../public/marketing.png";
import production from "../../../public/production.png";
import qualityInspection from "../../../public/qualityInspection.png";
import sales from "../../../public/sales.png";
import supply from "../../../public/supply.png";
import plan from "../../../public/plan.png";
import fc from "../../../public/fc.png";
import { useHistory } from "react-router";
import AuthUtil from "../../utils/AuthUtil";
type AppType = "SC" | "SW" | "FC" | "RD" | "TMS" | "HR" | "COMM" | "ASM" | "QMS" | "MC"
interface IApplyType {
    readonly authority?: string;
    readonly icon?: string;
    readonly title?: string;
    readonly description?: string;
    readonly path: string;
    readonly appName: AppType;
}
export default function ChooseApply(): React.ReactNode {
    const history = useHistory()
    const card: IApplyType[] = [
        {
            authority: "",
            icon: marketing,
            title: "营销中心",
            description: "包含客户、合同、订单等",
            path: "/notice/SC",
            appName: "SC",
        },
        {
            authority: "",
            icon: plan,
            title: "计划中心",
            description: "包含客户、合同、订单等",
            path: "/notice/SC",
            appName: "SC",
        },
        {
            authority: "",
            icon: develop,
            title: "研发中心",
            description: "包含提料、放样等",
            path: "/notice/RD",
            appName: "RD"
        },
        {
            authority: "",
            icon: supply,
            title: "供应中心",
            description: "包含配料、采购合同、采购计划、收货单等",
            path: "/workBench/sw",
            appName: "SW"
        },
        {
            authority: "",
            icon: qualityInspection,
            title: "质检中心",
            description: "质检过程相关功能",
            path: "/notice/QMS",
            appName: "QMS"
        },
        {
            authority: "",
            icon: production,
            title: "生产中心",
            description: "生产过程管理相关功能",
            path: "/notice/MC",
            appName: "MC"
        },
        {
            authority: "",
            icon: logistic,
            title: "物流中心",
            description: "配车、发货等相关功能",
            path: "/notice/TMS",
            appName: "TMS"
        },
        {
            authority: "",
            icon: sales,
            title: "售后中心",
            description: "售后服务相关功能",
            path: "/notice/ASM",
            appName: "ASM"
        },
        {
            authority: "",
            icon: hr,
            title: "人资中心",
            description: "人资管理相关功能",
            path: "/notice/HR",
            appName: "HR"
        },
        {
            authority: "",
            icon: fc,
            title: "财务中心",
            description: "人资管理相关功能",
            path: "/notice/FC",
            appName: "FC"
        },
        {
            authority: "",
            icon: general,
            title: "通用中心",
            description: "必备基础功能",
            path: "/notice/COMM",
            appName: "COMM"
        }
    ]
    return <DetailContent>
        <DetailTitle title="选择应用" />
        {
            card.map((res: IApplyType, index: number) => (
                <div className={styles.apply} key={index} onClick={() => {
                    AuthUtil.setCurrentAppName(res.appName)
                    history.push(res.path)
                }}>
                    <div className={styles.icon}><Image preview={false} src={res.icon} /></div>
                    <div className={styles.title}>{res.title}</div>
                    <div className={styles.description}>{res.description}</div>
                </div>
            ))
        }
    </DetailContent>
}