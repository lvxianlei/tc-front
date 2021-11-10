import React, { forwardRef, useImperativeHandle } from "react"
import { Row, Col, Spin } from 'antd'
import { useParams } from 'react-router-dom'
import { DetailTitle, CommonTable } from '../../common'
import { ConstructionDetails, ProductionIngredients, ComponentDetail } from "./productionData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default forwardRef(function Ingredients(_, ref) {
    const params = useParams<{ id: string }>()
    const { loading: getIngredients, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/produceIngredients/ingredients/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any, type: "save" | "saveAndSubmit") => new Promise(async (resole, reject) => {
        try {
            const baseUrl = type === "save" ? `/tower-supply/produceIngredients/programme` : "/tower-supply/produceIngredients/programme/submit"
            const result: { [key: string]: any } = await RequestUtil.post(baseUrl, data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = (type: "save" | "saveAndSubmit") => new Promise(async (resove, reject) => {
        try {
            await saveRun({ produceId: params.id, schemeDtos: data?.schemeVOS }, type)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, data, onSubmit])

    return <Spin spinning={getIngredients}>
        <Row gutter={10}>
            <Col span={12}>生产构件明细</Col>
            <Col span={12}>采购配料方案剩余原材料</Col>
        </Row>
        <Row gutter={10}>
            <Col span={12}>
                <CommonTable haveIndex columns={ConstructionDetails.map((item: any) => {
                    if (item.dataIndex === "alreadyIngredients") {
                        return ({
                            ...item,
                            render: (_: any, records: any) => <>{records.alreadyIngredients} / {records.noIngredients}</>
                        })
                    }
                    return item
                })} dataSource={data?.componentVOS || []} pagination={false} />
            </Col>
            <Col span={12}>
                <CommonTable columns={ComponentDetail} dataSource={data?.list || []} pagination={false} />
            </Col>
        </Row>
        <DetailTitle title="生产配料方案" />
        <CommonTable columns={ProductionIngredients} onRow={(records: any) => {
            if (records.status === 1) {
                return ({ style: { background: "yellow" } })
            }
            if (records.status === 2) {
                return ({ style: { background: "red", color: "#FFF" } })
            }
        }} dataSource={data?.schemeVOS} />
    </Spin>
})