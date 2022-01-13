import React, { useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, message, Spin, Modal } from "antd"
import { DetailContent, BaseInfo, DetailTitle, EditTable, formatData } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { bidInfoColumns } from '../managementDetailData.json'
import { EditTableHasForm, TabsCanEdit, UploadXLS } from "../bidResult"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
const columns = [
    {
        title: '年份',
        dataIndex: 'date',
        type: "date",
        format: "YYYY",
        picker: "year",
        rules: [
            {
                required: true,
                message: "请输入年份..."
            }
        ]
    },
    {
        title: '批次',
        dataIndex: 'batch',
        rules: [
            {
                required: true,
                message: "请输入批次..."
            }
        ]
    },
    {
        title: '中标包名称',
        dataIndex: "packageNum",
        disabled: "true"
    },
    {
        title: '中标价(元)',
        dataIndex: "bidMoney",
        disabled: "true"
    },
    {
        title: '中标重量(吨)',
        dataIndex: "bidWeight",
        type: "number",
        disabled: "true"
    },
    {
        title: '是否中标',
        dataIndex: "isBid",
        type: "select",
        disabled: "true",
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
        ],
        disable: true
    },
    {
        title: '中标单价(元)', // sc1.1.2迭代 需后台确认字段
        dataIndex: "bidWeight",
        type: "number",
        disabled: "true"
    },
    {
        title: '备注',
        dataIndex: 'description'
    },
]
export default function BidResultEdit(): JSX.Element {
    const history = useHistory()
    const ref = useRef()
    const params = useParams<{ id: string, tab: string }>()
    const [bidOpenRecordVos, setBidOpenRecordVos] = useState<any[]>([{ round: 1, roundName: "第 1 轮", fixed: true, bidOpenRecordVos: [] }])
    const [baseInfoForm] = Form.useForm()

    const map:Map<string,number> = new Map();

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/bidBase/${params.id}`)
            baseInfoForm.setFieldsValue(formatData(columns, result))
            if (result.bidOpenRecordListVos?.length > 0) {
                const resultBid = result.bidOpenRecordListVos
                if (resultBid[resultBid.length - 1].round !== 1) {
                    setBidOpenRecordVos([...resultBid, ...bidOpenRecordVos])
                } else {
                    setBidOpenRecordVos(resultBid)
                }
            }
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [params.id] })

    const { loading: saveStatus, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
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
                try {
                    if (refFun?.getForm()) {
                        const fdata = await refFun?.getForm().validateFields()
                        if (fdata?.submit.length <= 0) {
                            message.error("每轮至少新增一行...")
                            return
                        }
                        resove({ round, roundName, formData: fdata?.submit })
                    } else {
                        resove({ round, roundName, formData: bidOpenRecordVos.find((item: any) => item.round === round).bidOpenRecordVos || [] })
                    }
                } catch (error) {
                    reject(error)
                }
            })))
            console.log(_tabsData, "_tabsData")
            // 验证中标比例
            for (let i = 0; i < _tabsData.length; i += 1) {
                if (_tabsData[i].formData) {
                    for (let p = 0; p < _tabsData[i].formData.length; p += 1) {
                        if (map.has(_tabsData[i].formData[p].packageCode)) {
                            // 如果里面存在
                            const result = map.get(_tabsData[i].formData[p].packageCode);
                            map.set(_tabsData[i].formData[p].packageCode, result + (_tabsData[i].formData[p].test || 0));
                        } else {
                            map.set(_tabsData[i].formData[p].packageCode, (_tabsData[i].formData[p].test || 0));
                        }
                    }
                }
            }
            console.log(map, "ma0===============================>>>")
            map.forEach((value: any) => {
                console.log(value, "vale")
                if (value !== 100) {
                   message.error("相同包名称的中标比例必须等于100！");
                   throw new Error("相同包名称的中标比例必须等于100")
                }
            })
            console.log("还会走嘛")
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
            message.error("请检查是否有必填项尚未填写...")
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

    const handleTabsCanEditChange = (removeKey: string, removeItem: any) => {
        setBidOpenRecordVos(bidOpenRecordVos.filter((bid: any) => bid.round !== parseFloat(removeKey)))
    }

    const generateFormatEditData = (column: any, data: any) => {
        let value: any = ""
        switch (column.type) {
            case "select":
                value = column.enum.find((enumItem: any) => enumItem.label === data).value
                break
            default:
                value = data
        }
        return value
    }

    return (<>
        <ManagementDetailTabsTitle />
        <DetailContent operation={[
            <Button
                key="save"
                type="primary"
                onClick={handleSubmit}
                loading={saveStatus}
                style={{ marginRight: 16 }}
            >保存</Button>,
            <Button key="goback" onClick={handelCancel}>取消</Button>,
        ]}>
            <Spin spinning={loading}>
                <DetailTitle title="基本信息" />
                <BaseInfo form={baseInfoForm} edit columns={columns} dataSource={data || {}} />
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
                        content: <EditTable columns={bidInfoColumns} dataSource={item.bidOpenRecordVos || []} />
                    }))}
                    onRemove={handleTabsCanEditChange}
                    eachContent={(item: any, tempRef?: { ref: Record<string, any>; key: string; }) => {
                        const data: any[] = bidOpenRecordVos.find((bidItem: any) => bidItem.round === item.key).bidOpenRecordVos
                        return (
                            <EditTableHasForm
                                columns={bidInfoColumns}
                                dataSource={data}
                                opration={[<UploadXLS key="xlxs" readEnd={async (_data) => {
                                    const vilidateCols = ["包号", "投标人名称", "分标编号", "货物类别", "项目单位", "总价（元）", "重量（吨）", "中标比例（%）"]
                                    if (_data.length <= 0) {
                                        message.error("文件不能为空...")
                                        return
                                    }
                                    if (Object.keys(_data[0]).length <= 0) {
                                        message.error("文件不符合上传规则...")
                                        return
                                    }
                                    const rowItem: string[] = Object.keys(_data[0])
                                    const vilidateRow: number = rowItem.filter(item => vilidateCols.includes(item)).length
                                    if (vilidateRow !== vilidateCols.length) {
                                        message.error("文件不符合上传规则...")
                                        return
                                    }
                                    const resultData = bidOpenRecordVos.find((bidItem: any) => bidItem.round === item.key).bidOpenRecordVos
                                    const filterUploadData = _data.filter(item => Object.keys(item).every(eItem => eItem))
                                    const uploadData = filterUploadData.map((item: any, index) => {
                                        let rowData: any = { uid: resultData.length + index }
                                        Object.keys(item).forEach((columnItem: string) => {
                                            const columnDataIndex = bidInfoColumns.find(bidItem => bidItem.title === columnItem)
                                            if (columnDataIndex) {
                                                rowData[columnDataIndex.dataIndex] = generateFormatEditData(columnDataIndex, item[columnItem])
                                            }
                                        })
                                        return rowData
                                    })
                                    const editForm = tempRef?.ref[item.key].getForm()
                                    const values = await editForm.getFieldsValue().submit
                                    editForm.setFieldsValue({ submit: values.concat(uploadData) })
                                }} />]}
                                ref={tempRef ? (o) => (tempRef.ref[tempRef.key] = o) : undefined}
                            />
                        );
                    }}
                />
            </Spin>
        </DetailContent>
    </>)
}