import React from "react"
import styles from './DetailContent.module.less'
interface DetailContentProps {
    title?: React.ReactNode
    operation?: React.ReactNode[]
}
const DetailContent: React.FC<DetailContentProps> = ({ title, operation, ...props }) => {
    return (
        <>
            <section className={styles.detailContent}>
                {title && <div className={styles.title}>{title}</div>}
                <div>{props.children}</div>
            </section>
            {operation && <div className={styles.fixFooter}>
                {operation}
            </div>}
        </>)
}

export default DetailContent