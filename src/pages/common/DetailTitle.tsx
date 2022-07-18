import React, { CSSProperties, ReactElement } from "react"
import { Row, Col } from "antd"
import styles from "./DetailTitle.module.less"
interface ColInterface {
    left: number
    right: number
}
export default function DetailTitle({ title, operation, style, col }: {
    title: string | false | ReactElement,
    operation?: React.ReactNode[],
    style?: CSSProperties
    col?: ColInterface
}) {
    return <Row className={styles.detailTitle} style={{ padding: "0px 0px 8px 0px", ...style }}>
        <Col span={col?.left || 12}>
            {title && title}
        </Col>
        {operation && <Col span={col?.right || 12} style={{ textAlign: "right" }}>{operation}</Col>}
    </Row>
}