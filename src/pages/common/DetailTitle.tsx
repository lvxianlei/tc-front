import React from "react"
import { Row, Col } from "antd"
import styles from "./DetailTitle.module.less"
export default function DetailTitle({ title, operation, padding = false }: { title: string | false, operation?: React.ReactNode[], padding?: boolean }) {
    return <Row className={styles.detailTitle} style={{padding: padding ? "0 0 8px 0" : "24px 0px 8px 0px",}}>
        <Col span={6} >{title && title}</Col>
        {operation && <Col span={18} style={{ textAlign: "right" }}>{operation}</Col>}
    </Row>
}