import React, { useState } from "react"
import { Spin } from "antd"
import { CommonTable } from '../../common'
import { baseInfoColunm } from "./productionData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
interface EditProps {
    id: string
}
interface PagenationProps {
    current: number
    pageSize: number
}
export default function Edit({ id }: EditProps): JSX.Element {
    const [pagenation, setPagenation] = useState<PagenationProps>({
        current: 1,
        pageSize: 10
    })
    // 配料方案
    const { loading, data: popTableData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/produceIngredients/getLoftingSchemeStatistics`, {
                produceId: id,
                current: pagenation.current,
                size: pagenation.pageSize
            })
            resole(result)
            // 默认掉用第一条
            if (result.length > 0) {
                getUser(result[0].schemeIds, result[0].materialName, result[0].structureSpec, result[0].structureTexture)
            }
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    // 方案明细
    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((produceId: string, materialName: string, structureSpec: string, structureTexture: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/produceIngredients/getLoftingSchemesByCondition`, {
                produceId,
                materialName,
                structureSpec,
                structureTexture,
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const paginationChange = (page: number, pageSize: number) => setPagenation({ ...pagenation, current: page, pageSize })

    // return <CommonTable loading={loading} columns={BatchingScheme} dataSource={data || []} />
    return (
        <Spin spinning={loading}>
            <CommonTable
                columns={baseInfoColunm}
                dataSource={(popTableData as any) || []}
                pagination={{
                    size: "small",
                    pageSize: pagenation.pageSize,
                    onChange: paginationChange,
                    current: pagenation.current,
                    total: popTableData?.total
                }} 
                onRow={(record: any) => {
                    return {
                      onClick: async (event: any) => {
                          getUser(record.schemeIds, record.materialName, record.structureSpec, record.structureTexture)
                      }, // 点击行
                    };
                }}
            />
            {
                userData?.schemeData && userData?.headerColumnVos && (
                    <CommonTable haveIndex columns={userData?.headerColumnVos || []} dataSource={userData?.schemeData || []} />
                )
            }
        </Spin>
    )
}