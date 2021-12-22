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
import apps from "../../app-name.config.jsonc"
type AppType = "SC" | "SW" | "FC" | "RD" | "TMS" | "HR" | "COMM" | "ASM" | "QMS" | "MC" | "PS"
interface IApplyType {
    readonly authority?: string;
    readonly icon?: string;
    readonly title?: string;
    readonly description?: string;
    readonly path: string;
    readonly appName: AppType;
}
const icons: { [key in AppType]: any } = {
    "SC": marketing,
    "SW": supply,
    "FC": fc,
    "RD": develop,
    "TMS": logistic,
    "HR": hr,
    "COMM": general,
    "ASM": sales,
    "QMS": qualityInspection,
    "MC": production,
    "PS": plan
}
export default function ChooseApply(): React.ReactNode {
    const history = useHistory()
    return <DetailContent>
        <DetailTitle title="选择应用" />
        {
            (apps as IApplyType[]).map((res: IApplyType, index: number) => (
                <div className={styles.apply} key={index} onClick={() => {
                    AuthUtil.setCurrentAppName(res.appName)
                    history.push(res.path)
                }}>
                    <div className={styles.icon}><Image preview={false} src={icons[res.appName]} /></div>
                    <div className={styles.title}>{res.title}</div>
                    <div className={styles.description}>{res.description}</div>
                </div>
            ))
        }
    </DetailContent>
}