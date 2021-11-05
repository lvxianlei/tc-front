import React from "react"
import { Button } from 'antd'
import { useHistory } from 'react-router-dom'
import { DetailContent } from '../../common'
export default function Edit() {
    const history = useHistory()
    return <DetailContent operation={[
        <Button
            type="primary" key="save"
            style={{ marginRight: 16 }}
        >保存</Button>,
        <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
    ]}>

    </DetailContent>
}