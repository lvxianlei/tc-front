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
import production2 from "../../../public/production2.png";
import qualityInspection from "../../../public/qualityInspection.png";
import sales from "../../../public/sales.png";
import supply from "../../../public/supply.png";
import plan from "../../../public/plan.png";
import fc from "../../../public/fc.png";
import { useHistory } from "react-router";
import AuthUtil from "../../utils/AuthUtil";
import apps from "../../app-name.config.jsonc"
type AppType = "SC" | "SW" | "FC" | "RD" | "TMS" | "HR" | "COMM" | "ASM" | "QMS" | "MC" | "MC2" | "PC"
interface IApplyType {
    readonly authority?: string;
    readonly icon?: string;
    readonly title?: string;
    readonly description?: string;
    readonly path: string;
    readonly appName: AppType;
    readonly corsWeb?: boolean;
    readonly iconFont: string;
    readonly color: string;
    readonly fontSize?: number;
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
    "MC2": production2,
    "PC": plan
}
export default function ChooseApply(): React.ReactNode {
    const history = useHistory()
    return <DetailContent>
        <DetailTitle title="选择应用" />
        <div className={styles.content}>
            {
                (apps as IApplyType[]).map((res: IApplyType, index: number) => (
                    <div className={styles.apply} key={index} onClick={() => {
                        AuthUtil.setCurrentAppName(res.appName)
                        if (res.corsWeb) {
                            let herf = res.path
                            switch (process.env.REACT_APP_ENV) {
                                case "integration":
                                    herf = res.path.replace("test", "dev")
                                    break
                                case "uat":
                                    herf = res.path.replace("test", "uat")
                                    break
                                default:
                                    herf = res.path
                            }
                            window.location.href = herf
                            return
                        }
                        history.push(res.path)
                    }}>
                        <div className={styles.icon}>
                            <span style={{display: "inline-block", width: 50, height: 50, background: res.color, borderRadius: 8, textAlign: "center", lineHeight: "50px"}}>
                                <span className={`iconfont ${res.iconFont}`} style={{
                                    fontFamily: "font_family",
                                    fontSize: res.fontSize || 28,
                                    color: "#fff"
                                }}></span>
                            </span>
                        </div>
                        <div className={styles.title}>{res.title}</div>
                        <div className={styles.description}>{res.description}</div>
                    </div>
                ))
            }
        </div>

    </DetailContent>
}