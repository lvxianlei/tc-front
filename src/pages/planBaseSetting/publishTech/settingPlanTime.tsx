import React from "react"
import { Page } from "../../common"
import { settingPlanTime } from "./data.json"
export default function SettingPlanTime(): React.ReactElement {
    return <Page
        path=""
        columns={settingPlanTime}
        searchFormItems={[]}
        onFilterSubmit={(value) => value}
    />
}