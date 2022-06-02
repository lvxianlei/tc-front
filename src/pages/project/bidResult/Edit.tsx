import React, { Fragment, memo, useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, message, Spin, Modal, Select, Row, Col } from "antd"
import { DetailContent, BaseInfo, DetailTitle, EditTable, formatData, Page } from "../../common"
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { bidInfoColumns, setting, partBidNumber } from './bidResult.json'
import { EditTableHasForm, TabsCanEdit, UploadXLS } from "./EditTabs"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { exportDown } from "../../../utils/Export";
export default function BidResultEdit(): JSX.Element {
    const history = useHistory()
    const ref = useRef()
    const params = useParams<{ id: string, tab: string }>()
    const [bidOpenRecordVos, setBidOpenRecordVos] = useState<any[]>([{ round: 1, roundName: "第 1 轮", fixed: true, bidOpenRecordVos: [] }])
    const [baseInfoForm] = Form.useForm()

    const map: Map<string, number> = new Map();

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/bidBase/${params.id}`)
            baseInfoForm.setFieldsValue(formatData(setting, result))
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
            map.clear();
            const tabsData = (ref.current as any).getData()
            const baseInfoData = await baseInfoForm.validateFields();
            const _tabsData = await Promise.all<any>(tabsData.map((item: any) => new Promise(async (resove, reject) => {
                const { refFun, title: roundName, key: round } = item
                try {
                    if (refFun?.getForm()) {
                        const fdata = await refFun?.getForm().validateFields()
                        console.log(fdata, "data")
                        // if (fdata?.submit.length <= 0) {
                        //     message.error("每轮至少新增一行...")
                        //     return
                        // }
                        resove({ round, roundName, formData: fdata?.submit })
                    } else {
                        resove({ round, roundName, formData: bidOpenRecordVos.find((item: any) => item.round === round).bidOpenRecordVos || [] })
                    }
                } catch (error) {
                    reject(error)
                }
            })))

            // 验证中标比例
            for (let i = 0; i < _tabsData.length; i += 1) {
                if (_tabsData[i].formData && _tabsData[i].formData.length > 0) {
                    for (let p = 0; p < _tabsData[i].formData.length; p += 1) {
                        if (_tabsData[i].formData[p].isBid === 1) {
                            if (map.has(`${_tabsData[i].formData[p].packageCode}_${_tabsData[i].roundName}`)) {
                                // 如果里面存在
                                const result: any = map.get(`${_tabsData[i].formData[p].packageCode}_${_tabsData[i].roundName}`);
                                map.set(`${_tabsData[i].formData[p].packageCode}_${_tabsData[i].roundName}`, +result + (+_tabsData[i].formData[p].bidPro || 0));
                            } else {
                                map.set(`${_tabsData[i].formData[p].packageCode}_${_tabsData[i].roundName}`, (_tabsData[i].formData[p].bidPro || 0));
                            }
                        }
                    }
                } else {
                    message.error("每轮至少新增一行...");
                    return false;
                }
            }
            let flag = false;
            map.forEach((value: any) => {
                if (+value !== 100) flag = true;
            })

            if (flag) {
                message.error("相同包名称的中标比例必须等于100！");
                return false;
            }

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

    const handleTabsCanEditChange = (removeKey: string) => setBidOpenRecordVos(bidOpenRecordVos.filter((bid: any) => bid.round !== parseFloat(removeKey)))

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
    // 新增一轮
    const handleAddNew = () => {
        const tabsData = (ref.current as any).getData().map((item: any) => {
            const { refFun, title: roundName, key: round } = item
            if (refFun?.getForm()) {
                const fdata = refFun?.getForm().getFieldsValue()
                return ({ round, roundName, bidOpenRecordVos: fdata?.submit })
            } else {
                return ({ round, roundName, bidOpenRecordVos: bidOpenRecordVos.find((item: any) => item.round === round).bidOpenRecordVos || [] })
            }
        })
        setBidOpenRecordVos([
            {
                round: bidOpenRecordVos.length + 1,
                roundName: `第 ${bidOpenRecordVos.length + 1} 轮`,
                bidOpenRecordVos: tabsData[0]?.bidOpenRecordVos || []
            },
            ...bidOpenRecordVos
        ])
    }

    const handleEditableChange = (fields: any, allFields: any, itemKey: any) => {
        const changeFileds = fields.submit[fields.submit.length - 1]
        const changeRow = allFields.submit[fields.submit.length - 1]
        const tabsRef: any = (ref.current as any).getData().find((item: any) => item.key === itemKey)?.refFun?.getForm()
        const prevData: any = bidOpenRecordVos.find((item: any) => item.round === itemKey)?.bidOpenRecordVos
        if (changeFileds.id) {
            setBidOpenRecordVos(bidOpenRecordVos.map((item: any) => {
                if (item.round === itemKey) {
                    return ({ ...item, bidOpenRecordVos: allFields.submit.map((item: any) => item.id === changeFileds.id ? ({ ...item, isBid: -1 }) : item) })
                }
                return item
            }))
            return
        }

        if (changeFileds.isBid) {
            switch (changeFileds.isBid) {
                case 3:
                    console.log("---流标--")
                    tabsRef?.setFieldsValue({
                        submit: allFields.submit.map((item: any) => {
                            if (item.projectCompany === changeRow.projectCompany) {
                                return ({ ...item, isBid: changeFileds.isBid })
                            }
                            return item
                        })
                    })
                    break
                case 4:
                    console.log("---废标--")
                    tabsRef?.setFieldsValue({
                        submit: allFields.submit.map((item: any) => {
                            if (item.bidName === changeRow.bidName) {
                                return ({ ...item, isBid: changeFileds.isBid })
                            }
                            return item
                        })
                    })
                    break
                default:
                    const prevIsBid = prevData.find((item: any) => item.id === changeRow.id)?.isBid
                    if ([3, 4].includes(prevIsBid)) {
                        tabsRef?.setFieldsValue({
                            submit: allFields.submit.map((item: any) => {
                                if ((prevIsBid === 4) && (item.bidName === changeRow.bidName)) {
                                    return ({ ...item, isBid: -1 })
                                }
                                if ((prevIsBid === 3) && (item.projectCompany === changeRow.projectCompany)) {
                                    return ({ ...item, isBid: -1 })
                                }
                                return item
                            })
                        })
                    }
                    break
            }
        }
        setBidOpenRecordVos(bidOpenRecordVos.map((item: any) => {
            if (item.round === itemKey) {
                return ({ ...item, bidOpenRecordVos: allFields.submit })
            }
            return item
        }))
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
                <BaseInfo form={baseInfoForm} edit columns={setting} dataSource={data || {}} />
                <PartBidInfo id={params.id} />
                <DetailTitle title="开标信息" operation={[<Button key="new"
                    type="primary"
                    onClick={handleAddNew}>新增一轮报价</Button>]} />
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
                                onChange={(changeFileds, allFields) => handleEditableChange(changeFileds, allFields, item.key)}
                                opration={[
                                    <UploadXLS key="xlxs" readEnd={async (_data) => {
                                        const vilidateCols = ["包名称", "投标人名称", "分标编号", "物资资别", "项目单位", "总价（元）", "重量（吨）", "电压等级"]
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
                                    }} />,
                                    <Button
                                        type="link"
                                        key="export"
                                        onClick={() => exportDown(
                                            "/tower-market/bidBase/export",
                                            "POST",
                                            {},
                                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                            "开标信息导入模板"
                                        )}
                                        style={{ marginRight: 16 }}
                                    >下载导入模板</Button>
                                ]}
                                ref={tempRef ? (o) => (tempRef.ref[tempRef.key] = o) : undefined}
                            />
                        );
                    }}
                />
            </Spin>
        </DetailContent>
    </>)
}

const PartBidInfo = memo(({ id }: { id: string }) => {
    const [isSign, setIsSign] = useState("")
    return <>
        <DetailTitle title="中标信息" operation={[<Fragment key="right">
            <span style={{ fontSize: 14 }}>合同状态：</span>
            <Select
                defaultValue={""}
                onChange={(value) => setIsSign(value)}
                style={{ width: 100, fontWeight: 500, color: "#333", textAlign: "left" }}>
                <Select.Option value="">全部</Select.Option>
                <Select.Option value={1}>未签完</Select.Option>
                <Select.Option value={2}>已签完</Select.Option>
            </Select></Fragment>]
        } />
        < Page
            columns={partBidNumber}
            path={`/tower-market/bidBase/partBidNumber`}
            filterValue={{ id, isSign }}
            searchFormItems={[]} />
    </>
}) 