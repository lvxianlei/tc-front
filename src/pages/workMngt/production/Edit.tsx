import React, { useState } from "react"
import { Spin } from "antd"
import { CommonTable } from '../../common'
import { baseInfoColunm, BatchingSchemeList } from "./productionData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import "./Edit.less"
interface EditProps {
    id: string
}
interface PagenationProps {
    current: number
    pageSize: number
}
export default function Edit({ id }: EditProps): JSX.Element {
    // 存储id
    const [tableId, setTableId] = useState<string>("");
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
            let v = [];
            if ((result as any)?.records.length > 0) {
                v = (result as any)?.records.map((item: any, index: number) => {
                    return ({
                        ...item,
                        id: index
                    })
                });
            }
            resole(v)
            // 默认掉用第一条
            if (v.length > 0) {
                getUser(id, v[0].materialName, v[0].structureSpec, v[0].structureTexture, v[0].length)
                setTableId(v[0].id);
            }
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    // 方案明细
    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((produceId: string, materialName: string, structureSpec: string, structureTexture: string, length: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/produceIngredients/getLoftingSchemesByCondition`, {
                produceId,
                materialName,
                structureSpec,
                structureTexture,
                length,
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const paginationChange = (page: number, pageSize: number) => setPagenation({ ...pagenation, current: page, pageSize })

    const setRowClassName = (record: any) => {
        // const { tableId } = this.state;
        return record.id === tableId ? "clickRowStyl" : '';
    };

    return (
        <Spin spinning={loading}>
            <CommonTable
                columns={baseInfoColunm}
                dataSource={(popTableData as any) || []}
                rowClassName={setRowClassName}
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
                          getUser(id, record.materialName, record.structureSpec, record.structureTexture, record.length);
                          setTableId(record.id);
                      }, // 点击行
                    };
                }}
            />
            {/* {
                userData?.schemeData && userData?.headerColumnVos && (
                    <CommonTable haveIndex columns={userData?.headerColumnVos || []} dataSource={userData?.schemeData || []} />
                )
            } */}
             <CommonTable haveIndex columns={BatchingSchemeList} dataSource={(userData as any) || []} />
        </Spin>
    )
}