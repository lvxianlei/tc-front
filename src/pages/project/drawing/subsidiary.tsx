import { Select } from "antd"
import React from "react"
import { SearchTable } from "../../common"
import { productGroupColumns } from "./drawing.json"
interface SubsidiaryProps {
    id: string
}

export default function Subsidiary({ id }: SubsidiaryProps) {
    return <div>
        <SearchTable
            path={`/tower-market/drawingConfirmation/getDrawingAssist`}
            filterValue={{ id }}
            modal={true}
            columns={productGroupColumns as any}
            searchFormItems={[
                {
                    name: 'productStatus',
                    label: '杆塔明细状态',
                    children: <Select style={{ width: "150px" }} placeholder="杆塔明细状态">
                        <Select.Option value={0}>未下发</Select.Option>
                        <Select.Option value={1}>已下发</Select.Option>
                        <Select.Option value={2}>审批中</Select.Option>
                    </Select>
                },
            ]}
        />
    </div>
}

