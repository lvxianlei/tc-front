import React, { ReactNode, useState } from "react"
import { Button, Modal } from "antd"
const baseUrl = process.env.IFRAME_BASE_URL
interface WorkflowProps {
    workflowId?: string
    disabled?: boolean
    type?: "RECORD" | "APPROVAL"
    children?: ReactNode
}

export default function Workflow({
    workflowId,
    disabled = false,
    children = "流程履历"
}: WorkflowProps) {
    const [open, setOpen] = useState<boolean>(false)

    return <>
        <Modal
            title={children}
            visible={open}
            width={1101}
            onCancel={() => setOpen(false)}
        >
            <div style={{ width: "100%" }}>
                <iframe
                    src={`${baseUrl}/#/tower/processInfo?id=${workflowId}`}
                    style={{
                        width: "100%",
                        minHeight: 480,
                        border: "none"
                    }}
                />
            </div>
        </Modal>
        <Button
            type='link'
            size="small"
            disabled={disabled}
            onClick={() => setOpen(true)}
        >{children}</Button>
    </>
}