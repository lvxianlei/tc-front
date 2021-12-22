import React from "react"
interface ExportProps {
    children: JSX.Element
}

export default function Export({ children }: ExportProps): JSX.Element {

    return <>
        {children}
    </>
}