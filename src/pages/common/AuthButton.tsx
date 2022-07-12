import React from 'react'
import { Button, ButtonProps } from "antd"

interface AuthButtonProps extends ButtonProps {
    auth?: string
}

export default function AuthButton({ auth, ...props }: AuthButtonProps) {

    return <Button {...props} />
}