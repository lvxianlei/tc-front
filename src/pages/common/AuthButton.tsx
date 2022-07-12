import React from 'react'
import { Button, ButtonProps } from "antd"
import { hasAuthority } from "../../hooks"
interface AuthButtonProps extends ButtonProps {
    auth?: string
}

export default function AuthButton({ auth, ...props }: AuthButtonProps) {
    if (hasAuthority(auth || "")) {
        return <Button {...props} />
    }
    return null
}
