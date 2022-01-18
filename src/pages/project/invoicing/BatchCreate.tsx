import React from "react"
import { EditableTable } from "../../common"
import { batchCreateColumns } from "./InvoicingData.json"
export default function BatchCreate(): JSX.Element {
    const handleChange = (fields: any, allFields: any) => {
        console.log(fields, allFields)
    }

    return <EditableTable columns={batchCreateColumns} dataSource={[]} onChange={handleChange} />
}