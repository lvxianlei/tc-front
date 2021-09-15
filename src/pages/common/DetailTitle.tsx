import React from "react"
import { Row, Col } from "antd"
import styles from "./DetailTitle.module.less"
export default function DetailTitle({ title, operation }: { title: string, operation?: React.ReactNode[] }) {
    return <Row className={styles.detailTitle}>
        <Col span={4}>{title}</Col>
        {operation && <Col span={20} style={{ textAlign: "right" }}>{operation}</Col>}
    </Row>
}