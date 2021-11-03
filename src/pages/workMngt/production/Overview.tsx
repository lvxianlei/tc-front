import React, { useState } from "react"
import { Button, message, Spin, Modal, Row, Col } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, CommonTable } from '../../common'
import { ConstructionDetails, ProductionIngredients } from "./productionData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Edit() {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false)
    const params = useParams<{ id: string }>()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/invoicing/getInvoicingInfo/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const handleModelOk = () => {

    }
    return <>
        <Modal title="配料" width={1011} visible={visible} onCancel={() => setVisible(false)} onOk={handleModelOk}>
            <Row gutter={10}>
                <Col span={12}>
                    <DetailTitle title="生产构建明细" />
                    <CommonTable columns={ConstructionDetails} dataSource={[]} />
                </Col>
                <Col span={12}>
                    <DetailTitle title="采购配料方案剩余原材料" />
                    <CommonTable columns={ConstructionDetails} dataSource={[]} />
                </Col>
            </Row>
            <DetailTitle title="生产配料方案" />
            <CommonTable columns={ConstructionDetails} dataSource={[]} />
        </Modal>
        <DetailContent title={[
            <Button key="export" type="primary" style={{ marginRight: 16 }}>导出</Button>,
            <Button key="peiliao" type="primary" ghost onClick={() => setVisible(true)}>配料</Button>
        ]} operation={[
            <Button type="primary" key="cancel" onClick={() => history.go(-1)}>完成</Button>
        ]}>
            <Spin spinning={loading}>
                <CommonTable columns={ConstructionDetails} dataSource={[]} />
                <DetailTitle title="生产配料方案" />
                <CommonTable columns={ProductionIngredients} dataSource={[]} />
            </Spin>
        </DetailContent>
    </>
}