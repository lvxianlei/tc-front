import React from "react"
import { ApartmentOutlined } from '@ant-design/icons'

export function generateTreeData(data: any[] = []): any[] {
    return data.map((item: any) => {
        return ({
            ...item,
            key: item.id,
            title: item.title || item.name,
            icon: <ApartmentOutlined />,
            children: item.children && generateTreeData(item.children)
        })
    })
}