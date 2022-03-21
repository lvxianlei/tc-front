import React from "react"
import { Page } from "../../common"
import { distributedTech } from "./data.json"
export default function DistributedTech(): React.ReactElement {
    return <Page
        path=""
        columns={distributedTech}
        searchFormItems={[]}
        onFilterSubmit={(value) => value}
    />
}