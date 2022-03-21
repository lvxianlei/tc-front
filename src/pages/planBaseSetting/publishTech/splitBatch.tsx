import React from "react"
import { Page } from "../../common"
import { splitBatch } from "./data.json"
export default function SplitBatch(): React.ReactElement {
    return <Page
        path=""
        columns={splitBatch}
        searchFormItems={[]}
        onFilterSubmit={(value) => value}
    />
}