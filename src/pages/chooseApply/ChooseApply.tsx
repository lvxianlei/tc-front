import React from "react";
import { DetailTitle } from "../common";
import styles from "./ChooseApply.module.less";
import { useHistory } from "react-router";
import AuthUtil from "../../utils/AuthUtil";
import apps from "../../app-name.config.jsonc"
import { Col, Row, Tabs } from "antd";
import { useAuthorities } from "../../hooks";
import Charts from "./Charts"
import Lines from "./Lines";
import ThirdPartyUtil from "@utils/ThirdPartyUtil";
const baseUrl = process.env.IFRAME_BASE_URL;
export default function ChooseApply(): JSX.Element {
    const history = useHistory()
    const authorities = useAuthorities()
    return <nav style={{ overflowY: "auto" }}>
        <Row style={{ width: "100%", padding: 20 }} gutter={[12, 12]}>
            <Col span={8}>
                <DetailTitle title="项目统计" />
                <div className={styles.content}>
                    {
                        (apps as any[]).filter((itemVos: any) => authorities?.
                            includes(itemVos.authority)).
                            map((res: any, index: number) => (
                                <div
                                    className={styles.apply}
                                    key={index}
                                    onClick={() => {
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
                                                herf = `${ThirdPartyUtil.getMesBaseInfo("mes").skipUrl}${res.path}?saasid=${AuthUtil.getUserInfo().user_id}&tenantid=${AuthUtil.getTenantId()}`
                                            }
                                            if (res.appName === "CRM") {
                                                herf = process.env.CRM_BREACK_URL
                                            } if(res.appName === "QMS"){
                                                herf = `${ThirdPartyUtil.getMesBaseInfo("qms").skipUrl}`;
                                            }
                                            window.location.href = herf
                                            return
                                        }
                                        history.push(res.path)
                                    }}>
                                    <div className={styles.title}>{res.title}</div>
                                </div>
                            ))
                    }
                </div>
            </Col>
            <Col span={8}>
                <DetailTitle title="年度业绩达成情况" />
                <Charts />
            </Col>
            <Col span={8}>
                <DetailTitle title="周产出统计" />
                <Lines />
            </Col>
        </Row>
        <div style={{ padding: 30 }}>
            <Tabs type="card">
                <Tabs.TabPane tab="待办事项" key="1">
                    <iframe
                        style={{ width: "100%", minHeight: 500 }}
                        src={`${baseUrl}/#/tower/flowTodo`}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="我发起的" key="2">
                    <iframe
                        style={{ width: "100%", minHeight: 500 }}
                        src={`${baseUrl}/#/tower/flowLaunch`}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="已办事宜" key="3">
                    <iframe
                        style={{ width: "100%", minHeight: 500 }}
                        src={`${baseUrl}/#/tower/flowDone`}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="抄送事宜" key="4">
                    <iframe
                        style={{ width: "100%", minHeight: 500 }}
                        src={`${baseUrl}/#/tower/flowCirculate`}
                    />
                </Tabs.TabPane>
            </Tabs>
        </div>
    </nav>
}
