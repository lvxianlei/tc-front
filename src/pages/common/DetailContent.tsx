import React from "react"
import styles from './DetailContent.module.less'
interface DetailContentProps {
    title?: React.ReactNode
    operation?: React.ReactNode[]
    style?: React.CSSProperties
    className?: string
}
const DetailContent: React.FC<DetailContentProps> = ({ title, operation, ...props }) => {
    return (
        <div {...props} style={{ width: "100%", ...props.style }}>
            <section className={operation ? styles.detailContentP : styles.detailContent}>
                {title && <div className={styles.title}>{title}</div>}
                <div>{props.children}</div>
            </section>
            {operation && <div className={styles.fixFooter}>
                {operation}
            </div>}
        </div>)
}

export default DetailContent