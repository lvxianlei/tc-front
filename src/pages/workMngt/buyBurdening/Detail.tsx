import React, { useState, useRef } from 'react'
import { Input, Button, Modal, message } from 'antd'
import { useParams, useHistory } from 'react-router-dom'
import { ComponentDetails } from "./buyBurdening.json"
import { Page } from '../../common'
import Batcher from "./Batcher"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import IngredientsModal from './IngredientsModal';
export default function EnquiryList(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, status: string }>()
    const [visible, setVisible] = useState<boolean>(false)
    const ref = useRef<{ data: any }>()
    const { run } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const detail: any = await RequestUtil.put(`/tower-supply/purchaseTaskTower/finish/${params.id}`)
            resole(detail)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resole, reject) => {
        try {
            const detail: any = await RequestUtil.post(`/tower-supply/purchaseBatchingScheme`, { ...data, id: params.id })
            resole(detail)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: createScheme } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/initData/scheme?purchaseTaskTowerId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })


    const onFilterSubmit = (value: any) => {
        return { ...value, purchaseTaskTowerId: params.id }
    }

    const handleSuccess = () => {
        Modal.confirm({
            title: "提交/完成",
            content: "确认提交/完成？",
            okText: "提交/完成",
            onOk() {
                return new Promise(async (resove, reject) => {
                    try {
                        await run()
                        message.success("操作成功...")
                        resove(true)
                        history.goBack();
                    } catch (error) {
                        reject(false)
                    }
                })
            }
        })
    }

    const createBatchingScheme = () => {
        Modal.confirm({
            title: "临时生成配料方案",
            content: "确定要生成提料配料方案吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await createScheme(params.id))
                    message.success("成功生成配料方案...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const handleModalOk = () => new Promise(async (resove, rejects) => {
        try {
            const result = await saveRun({ ...ref.current?.data })
            resove(true)
            message.success("保存成功...")
            setVisible(false)
        } catch (error) {
            rejects(false)
        }
    })

    return <>
        {/* <Modal title="配料" width={1011} visible={visible} okText="保存并提交" onOk={handleModalOk} onCancel={() => setVisible(false)}>
            <Batcher id={params.id} ref={ref} />
        </Modal> */}
        <Page
            path="/tower-supply/purchaseTaskTower/component"
            columns={ComponentDetails.map((item: any) => {
                if (item.dataIndex === "completionProgres") {
                    return ({ ...item, render: (text: any, records: any) => <>{records.completionProgres} / {records.num}</> })
                }
                return item
            })}
            extraOperation={<>
                <Button type="primary" ghost>导出</Button>
                <Button type="primary" disabled={params.status !== "1"} ghost onClick={handleSuccess}>完成</Button>
                <Button type="primary" disabled={params.status !== "1"} ghost onClick={() => setVisible(true)}>配料</Button>
                <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
                {/* <Button type="primary" ghost onClick={() => createBatchingScheme()}>临时创建配料方案</Button> */}
            </>}
            filterValue={{ purchaseTaskTowerId: params.id }}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'fuzzyQuery',
                    label: '查询',
                    children: <Input placeholder="件号/材质/规格" maxLength={200} />
                }
            ]}
        />
        {/* 新增配料 */}
        <IngredientsModal
            id={params.id}
            visible={visible}
            onOk={() => {
                history.go(0);
                setVisible(false)
            }}
            onCancel={() => setVisible(false)}
        />
    </>
}
