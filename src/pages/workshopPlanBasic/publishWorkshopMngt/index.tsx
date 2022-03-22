import React from "react"
import { EditableTable } from "../../common"
import { pageTable } from "./data.json"
export default function Index(): React.ReactElement {

    return <EditableTable columns={pageTable} dataSource={[]} />
}