import React, { useRef, useEffect } from "react";
import { DetailTitle } from "../common";
import styles from "./ChooseApply.module.less";
import { useHistory } from "react-router";
import AuthUtil from "../../utils/AuthUtil";
import apps from "../../app-name.config.jsonc"
import ApplicationContext from "../../configuration/ApplicationContext";
import { Tabs } from "antd";
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

export default function ChooseApply(): JSX.Element {
    const history = useHistory()
    const iframeRef: any = useRef()
    const authorities = ApplicationContext.get().authorities
    // document.cookie = AuthUtil.getSinzetechAuth()
    useEffect(() => {
        console.log(document.cookie)
        console.dir(iframeRef.current)
        console.log(iframeRef.current?.contentDocment)
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.document.cookie = document.cookie
        }
    }, [])
    return <nav style={{ overflowY: "auto" }}>
        <DetailTitle title="选择应用" style={{ padding: "16px" }} />
        <div className={styles.content}>
            {
                (apps as IApplyType[]).filter((itemVos: any) => authorities?.includes(itemVos.authority)).map((res: IApplyType, index: number) => (
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
                            if (res.appName === "MC") {
                                herf = res.path + AuthUtil.getUserId()
                            }
                            window.location.href = herf
                            return
                        }
                        history.push(res.path)
                    }}>
                        <div className={styles.icon}>
                            <span style={{ display: "inline-block", width: 50, height: 50, background: res.color, borderRadius: 8, textAlign: "center", lineHeight: "50px" }}>
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
        <div style={{ padding: 30 }}>
            <Tabs type="card">
                <Tabs.TabPane style={{ height: 500 }} tab="Tab 1" key="1">
                    <iframe
                        ref={iframeRef}
                        style={{ width: "100%", height: 500 }}
                        src="http://workflow-dev.dhwy.cn/#/tower/flowLaunch"
                    />
                </Tabs.TabPane >
                <Tabs.TabPane style={{ height: 500 }} tab="Tab 2" key="2">
                    Content of Tab Pane 2
                </Tabs.TabPane>
                <Tabs.TabPane style={{ height: 500 }} tab="Tab 3" key="3">
                    Content of Tab Pane 3
                </Tabs.TabPane>
            </Tabs></div>
    </nav>
}