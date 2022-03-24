import { Button, Space } from "antd"
import React, { useCallback, useState } from "react"
import { DetailContent, EditableTable, CommonTable } from "../../common"
import { pageTable } from "./data.json"
export default function Index(): React.ReactElement {
    const [edit, setEdit] = useState<boolean>(false)
    const handleEditClick = useCallback(() => setEdit(true), [setEdit])
    return <DetailContent>
        {edit && <EditableTable
            opration={[
                <Button type="primary" key="edit">保存</Button>
            ]}
            columns={pageTable}
            haveIndex={false}
            dataSource={[]}
        />}
        {!edit && <>
            <Space size={16} style={{ marginBottom: 16 }}>
                <Button type="primary" key="edit" onClick={handleEditClick}>编辑</Button>
            </Space>
            <CommonTable columns={pageTable} dataSource={[]} />
        </>}
    </DetailContent>
}