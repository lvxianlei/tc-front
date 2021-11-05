import React, { forwardRef, useImperativeHandle } from 'react'
import { Input, DatePicker, Select, Button, Form, Modal, Row, Col } from 'antd'
import { useParams, useHistory } from 'react-router-dom'
import { ComponentDetails, Batchingschemed } from "./buyBurdening.json"
import { CommonTable, Page } from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface BatcherProps {
    id: string
}
export default forwardRef(function Batcher({ id }: BatcherProps, ref) {

    const { loading, run, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const detail: any = await RequestUtil.get(`/tower-supply/purchaseBatchingScheme/batcher/${id}`)
            resole(detail)
        } catch (error) {
            reject(error)
        }
    }))
    
    useImperativeHandle(ref, () => ({ data }), [JSON.stringify(data)])

    return <>
        <Row gutter={4}>
            <Col span={8}>
                <div>构建明细分类</div>
                <CommonTable columns={ComponentDetails} dataSource={data?.schemeData || []} pagenation={false} />
            </Col>
            <Col span={16}>
                <div>配料方案</div>
                <CommonTable columns={data?.headerColumnVos || []} dataSource={data?.schemeData || []} pagenation={false} />
            </Col>
        </Row>
    </>
})