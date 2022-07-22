import React, { memo, useCallback, useEffect, useState } from "react"
import { Prompt, useHistory } from "react-router-dom"
import { Modal } from "antd"
import styles from './DetailContent.module.less'
interface DetailContentProps {
    title?: React.ReactNode
    operation?: React.ReactNode[]
    style?: React.CSSProperties
    className?: string
    when?: boolean
}
const DetailContent: React.FC<DetailContentProps> = memo(({ title, operation, when, ...props }) => (
    <div {...props} style={{ width: "100%", ...props.style }}>
        <section className={operation ? styles.detailContentP : styles.detailContent}>
            {title && <div className={styles.title}>{title}</div>}
            <div>{props.children}</div>
        </section>
        {operation && <div className={styles.fixFooter}>
            {operation}
        </div>}
    </div>
))

// const DetailContent: React.FC<DetailContentProps> = ({ when = false, ...props }) => {
//     const history = useHistory()
//     const [visible, setVisible] = useState<boolean>(false)
//     const [leave, setLeave] = useState<boolean>(!!when)
//     const [leavePathname, setLeavePathname] = useState<string>()
//     const handleIntercept = (location: any) => {
//         if (leave) {
//             setVisible(true)
//             setLeavePathname(location.pathname)
//             return false
//         }
//         return false
//     }

//     const onOk = () => {
//         leavePathname && history.push(leavePathname)
//         setVisible(false)
//     }

//     const onCancel = () => {
//         setVisible(false)
//         setLeavePathname("")
//         return
//     }

//     useEffect(() => {
//         setLeave(!!when)
//     }, [when])
//     console.log(leavePathname, leave, when, visible)
//     return <>
//         {/* <Modal
//             visible={visible}
//             closable={false}
//             title=""
//             onOk={onOk}
//             onCancel={onCancel}>
//             <div>当前内容未保存，确认继续操作吗？</div>
//             <div>继续操作后当前内容将丢失</div>
//         </Modal> */}
//         <DetailContentContext {...props as any} />
//     </>
// }

export default DetailContent