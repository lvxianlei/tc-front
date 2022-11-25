import React from "react"
import { Spin } from "antd"
import { BaseInfo, DetailContent, DetailTitle, EditableTable } from "../../common"
import { edit } from "./data.json"
interface EditProps {
    id: string
    type: 1 | 2 | 3
}

export default function Edit({ id, type }: EditProps) {

    return <Spin spinning={false}>
        <DetailContent>
            <DetailTitle title="基础信息" />
            <BaseInfo col={4} edit columns={edit.base} dataSource={{}} />
            {type === 1 && <EditableTable columns={edit.content} dataSource={[]} />}
            {[2, 3].includes(type) && <EditableTable columns={edit.suspend} dataSource={[]} />}
        </DetailContent>
    </Spin>
}