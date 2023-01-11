import React, { ReactElement } from 'react'
import { Select, Spin } from 'antd'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '@utils/RequestUtil'
import { FetchSelectData } from './FormItemType'
interface FetchSelectProps {
    data: FetchSelectData
    [key: string]: any
}
export default function FetchSelect({
    data,
    ...props
}: FetchSelectProps): ReactElement {
    const { loading, data: options } = useRequest(() => new Promise(async (resove, reject) => {
        try {
            const result: any = await RequestUtil.get(data.path, { current: 1, size: 1000 })
            resove(data.transformData ? data.transformData(result) : result?.records || [])
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }),
        {
            ready: !!data.path,
            refreshDeps: [data.path]
        }
    )
    return (
        <Spin spinning={loading}>
            <Select
                labelInValue
                style={{
                    width: data.width || '100%',
                    minWidth: 80,
                    minHeight: 32
                }}
                {...props}
                options={(options as any) || []}
            />
        </Spin>
    )
}
