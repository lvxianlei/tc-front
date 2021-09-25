import React, { useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, message, Spin, Modal } from "antd"
import { DetailContent, BaseInfo, DetailTitle, EditTable, EditTabs } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { bidInfoColumns } from '../managementDetailData.json'
import { EditTableHasForm, TabsCanEdit, UploadXLS } from "../bidResult"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
export default function BidResultEdit(): JSX.Element {
    const history = useHistory()
    const ref = useRef()
    const params = useParams<{ id: string, tab: string }>()
    const [bidOpenRecordVos, setBidOpenRecordVos] = useState<any[]>([{ round: 1, roundName: "第 1 轮", bidOpenRecordVos: [] }])
    const [baseInfoForm] = Form.useForm()
    const { loading, error, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/bidBase/${params.id}`)
        baseInfoForm.setFieldsValue(result)
        if (result.bidOpenRecordListVos?.length > 0) {
            setBidOpenRecordVos(result.bidOpenRecordListVos)
        }
        resole(result)
    }))
    const { loading: saveStatus, data: saveResult, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/bidBase`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        const tabsData = (ref.current as any).getData()
        const baseInfoData = await baseInfoForm.getFieldsValue();
        const _tabsData = await Promise.all(tabsData.map((item: any, index: number) => new Promise(async (resove, reject) => {
            const { refFun, title: roundName, key: round } = item
            if (refFun?.getForm()) {
                const fdata = await refFun?.getForm().getFieldsValue()
                resove({ round: index, roundName, formData: fdata?.submit })
            } else {
                resove({ round: index, roundName, formData: [] })
            }
        })))

        const postTabsData = _tabsData.reduce((total: any, nextItem: any) => {
            const nextTabItem = nextItem.formData ? nextItem.formData.map((formItem: any) => ({
                ...formItem,
                round: nextItem.round,
                roundName: nextItem.roundName
            })) : []
            return total.concat(nextTabItem)
        }, [])

        const result = await run({
            ...baseInfoData,
            bidOpenRecordDtos: postTabsData,
            roundCount: _tabsData.length,
            projectId: params.id,
            id: data?.id
        })

        if (result) {
            message.success("保存成功...")
            history.goBack()
        }
    }
    const handelCancel = () => {
        Modal.confirm({
            title: "离开提醒",
            content: "确定要离开吗？",
            onOk: () => history.goBack()
        })
    }
    return (<DetailContent operation={[
        <Button
            key="save"
            type="primary"
            onClick={handleSubmit}
            loading={saveStatus}
            style={{ marginRight: 16 }}
        >保存</Button>,
        <Button key="goback" onClick={handelCancel}>取消</Button>,
    ]}>
        <ManagementDetailTabsTitle />
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo form={baseInfoForm} edit columns={[
                {
                    title: '年份',
                    dataIndex: 'date',
                    type: "date",
                    format: "YYYY",
                    picker: "year"
                },
                {
                    title: '批次',
                    dataIndex: 'batch',
                    type: "number"
                }, {
                    title: '备注',
                    dataIndex: 'description'
                },
                {
                    title: '是否中标',
                    dataIndex: "isBid",
                    type: "select",
                    enum: [
                        {
                            value: -1,
                            label: "未公布"
                        },
                        {
                            value: 1,
                            label: "是"
                        },
                        {
                            value: 2,
                            label: "否"
                        }
                    ]
                }]} dataSource={data || {}} />
            <DetailTitle title="开标信息" operation={[<Button key="new" type="primary"
                onClick={() => setBidOpenRecordVos([
                    {
                        round: bidOpenRecordVos.length + 1,
                        roundName: `第 ${bidOpenRecordVos.length + 1} 轮`,
                        bidOpenRecordVos: []
                    },
                    ...bidOpenRecordVos
                ])}>新增一轮报价</Button>]} />
            <TabsCanEdit
                ref={ref}
                canEdit={true}
                hasRefFun={true}
                data={bidOpenRecordVos.map((item: any) => ({
                    title: item.roundName,
                    key: item.round,
                    content: <EditTable columns={bidInfoColumns} dataSource={item.bidOpenRecordVos || []} />
                }))}
                eachContent={(item: any, tempRef?: {
                    ref: Record<string, any>;
                    key: string;
                }) => {
                    const data: any[] = bidOpenRecordVos.find((bidItem: any) => bidItem.round === item.key).bidOpenRecordVos
                    return (
                        <EditTableHasForm
                            columns={bidInfoColumns}
                            dataSource={data}
                            opration={[<UploadXLS key="xlxs" readEnd={(_data) => {
                                console.log(_data)
                                // 伪代码 不可用
                                // setData(data.concat(_data))
                            }} />]}
                            ref={tempRef ? (o) => (tempRef.ref[tempRef.key] = o) : undefined}
                        />
                    );
                }}
            />
        </Spin>
    </DetailContent>)
}