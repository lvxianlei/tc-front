import React from "react"
import { Tabs } from "antd"

interface EditTabsProps {
    children: React.ReactNode[]
}

const EditTable: React.FC<EditTabsProps> = ({ children, ...props }) => {

    return <Tabs>
        {children.map((item: React.ReactNode, index: number) => <Tabs.TabPane key={index} tab={`第${children.length - index}轮`}>{item}</Tabs.TabPane>)}
    </Tabs>
}

export default EditTable