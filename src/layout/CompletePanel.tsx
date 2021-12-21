import React from "react"
interface CompletePanelProps {
    children: React.ReactElement
}
export default function CompletePanel({ children }: CompletePanelProps): JSX.Element {

    return <>{children}</>
}