import React from "react"
import { CommonTable, DetailTitle } from "../../common"
import { productGroupColumns, newProductGroup } from '../managementDetailData.json'
export default function SelectProductGroup(): JSX.Element {

    return <>
        <CommonTable columns={newProductGroup.map(item => ({ ...item, width: 150 }))} dataSource={[]} />
        <DetailTitle title="明细" />
        <CommonTable columns={newProductGroup.map(item => ({ ...item, width: 150 }))} dataSource={[]} />
    </>
}