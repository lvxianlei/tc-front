import React from "react"
import styles from './DetailContent.module.less'
export default function DetailContent({ ...props }): JSX.Element {
    return <section className={styles.detailContent}>{props.children}</section>
}