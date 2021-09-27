import React, { useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, message, Spin, Modal } from "antd"
import { DetailContent, BaseInfo, DetailTitle, EditTable } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { bidInfoColumns } from '../managementDetailData.json'
import { EditTableHasForm, TabsCanEdit, UploadXLS } from "../bidResult"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
export default function BidResultEdit(): JSX.Element {
    const history = useHistory()
    const ref = useRef()
    const params = useParams<{ id: string, tab: string }>()
    const [bidOpenRecordVos, setBidOpenRecordVos] = useState<any[]>([{ round: 1, roundName: "第 1 轮", fixed: true, bidOpenRecordVos: [] }])
    const [baseInfoForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/bidBase/${params.id}`)
        baseInfoForm.setFieldsValue(result)
        if (result.bidOpenRecordListVos?.length > 0) {
            const resultBid = result.bidOpenRecordListVos.reverse()
            resultBid[resultBid.length - 1].fixed = true
            setBidOpenRecordVos(resultBid)
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
        try {
            const tabsData = (ref.current as any).getData()
            const baseInfoData = await baseInfoForm.validateFields();
            const _tabsData = await Promise.all(tabsData.map((item: any) => new Promise(async (resove, reject) => {
                const { refFun, title: roundName, key: round } = item
                if (refFun?.getForm()) {
                    const fdata = await refFun?.getForm().validateFields()
                    resove({ round, roundName, formData: fdata?.submit })
                } else {
                    resove({ round, roundName, formData: bidOpenRecordVos.find((item: any) => item.round === round).bidOpenRecordVos || [] })
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
        } catch (error) {
            console.log(error)
        }
    }
    const handelCancel = () => {
        Modal.confirm({
            title: "离开提醒",
            content: "确定要离开吗？",
            onOk: () => history.goBack()
        })
    }

    const handleEditTableChange = (changeFiled: any, roundItem: any, action: "add" | "remove") => {
        const resultData = bidOpenRecordVos.find((bidItem: any) => bidItem.round === roundItem.key).bidOpenRecordVos
        setBidOpenRecordVos(bidOpenRecordVos.map((bidItem: any) => bidItem.round === roundItem.key ? ({
            ...bidItem,
            bidOpenRecordVos: resultData.concat(changeFiled).filter((fitem: any) => fitem.uid || fitem.id || fitem.uid === 0)
        }) : bidItem))
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
                            value: 0,
                            label: "是"
                        },
                        {
                            value: 1,
                            label: "否"
                        }
                    ]
                }]} dataSource={data || {}} />
            <DetailTitle title="开标信息" operation={[<Button key="new"
                type="primary"
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
                    content: <EditTable
                        onChange={(changeFiled: any, action: "add" | "remove") => handleEditTableChange(changeFiled, item, action)}
                        columns={bidInfoColumns}
                        dataSource={item.bidOpenRecordVos || []} />
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
                            onChange={(changeFiled: any, action: "add" | "remove") => handleEditTableChange(changeFiled, item, action)}
                            opration={[<UploadXLS key="xlxs" readEnd={(_data) => {
                                const resultData = bidOpenRecordVos.find((bidItem: any) => bidItem.round === item.key).bidOpenRecordVos
                                const uploadData = _data.map((item: any, index) => {
                                    const rowData: any = { uid: resultData.length + index }
                                    Object.keys(item).forEach((columnItem: string) => {
                                        const columnDataIndex = (bidInfoColumns).find(bidItem => bidItem.title === columnItem)
                                        columnDataIndex && (rowData[columnDataIndex.dataIndex] = item[columnItem])
                                    })
                                    return rowData
                                })
                                setBidOpenRecordVos(bidOpenRecordVos.map((bidItem: any) => bidItem.round === item.key ? ({
                                    ...bidItem,
                                    bidOpenRecordVos: resultData.concat(uploadData).filter((fitem: any) => fitem.uid || fitem.id || fitem.uid === 0)
                                }) : bidItem))
                            }} />]}
                            ref={tempRef ? (o) => (tempRef.ref[tempRef.key] = o) : undefined}
                        />
                    );
                }}
            />
        </Spin>
    </DetailContent>)
}