import React from "react"
import { Row, Col } from "antd"
import styles from "./DetailTitle.module.less"
export default function DetailTitle({ title, operation, style }: { title: string | false, operation?: React.ReactNode[], style?: { [key: string]: string } }) {
    return <Row className={styles.detailTitle} style={{ padding: "0px 0px 8px 0px", ...style }}>
        <Col span={6} style={{position: "relative", top: 3}}>{title && title}</Col>
        {operation && <Col span={18} style={{ textAlign: "right" }}>{operation}</Col>}
    </Row>
}