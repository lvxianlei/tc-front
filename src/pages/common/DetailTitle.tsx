import React, { CSSProperties, ReactElement } from "react"
import { Row, Col } from "antd"
import styles from "./DetailTitle.module.less"
export default function DetailTitle({ title, operation, style }: {
    title: string | false | ReactElement,
    operation?: React.ReactNode[],
    style?: CSSProperties
}) {
    return <Row className={styles.detailTitle} style={{ padding: "0px 0px 8px 0px", ...style }}>
        <Col span={14}>
            {title && title}
        </Col>
        {operation && <Col span={10} style={{ textAlign: "right" }}>{operation}</Col>}
    </Row>
}