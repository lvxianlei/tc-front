import React from "react"
import { Prompt } from "react-router-dom"
import styles from './DetailContent.module.less'
interface DetailContentProps {
    title?: React.ReactNode
    operation?: React.ReactNode[]
    style?: React.CSSProperties
    className?: string
    when?: boolean
}
const DetailContent: React.FC<DetailContentProps> = ({ title, operation, when, ...props }) => {
   return (<>
        <Prompt when={!!when} message="当前内容未保存，确认继续操作吗？/继续操作后当前修改内容将无效" />
        <div {...props} style={{ width: "100%", ...props.style }}>
            <section className={operation ? styles.detailContentP : styles.detailContent}>
                {title && <div className={styles.title}>{title}</div>}
                <div>{props.children}</div>
            </section>
            {operation && <div className={styles.fixFooter}>
                {operation}
            </div>}
        </div>
    </>)
}

export default DetailContent