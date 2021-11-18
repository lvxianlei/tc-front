import React from "react"
import { Row, Col } from "antd"
import styles from "./DetailTitle.module.less"
export default function DetailTitle({ title, operation }: { title: string | false, operation?: React.ReactNode[] }) {
    return <Row className={styles.detailTitle}>
        <Col span={6}>{title && title}</Col>
        {operation && <Col span={18} style={{ textAlign: "right" }}>{operation}</Col>}
    </Row>
}