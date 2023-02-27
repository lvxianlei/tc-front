import React, { useState, useRef } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Button, Form, message, Spin } from "antd"
import { DetailContent, BaseInfo, DetailTitle, Attachment, AttachmentRef, EditableTable, CommonTable } from '../../common'
import ManagementDetailTabsTitle from "../ManagementDetailTabsTitle"
import { baseInfoData, cargoVOListColumns, portedCargoColumns } from './baseInfo.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../../utils/RequestUtil"
import { TabTypes } from "../Detail"
import { UploadXLS } from "../bidResult/EditTabs"
import { downLoadTemplate } from "../../../utils"

export default function BaseInfoEdit(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ tab: TabTypes, id: string }>()
    const [address, setAddress] = useState<string>("")
    const [when, setWhen] = useState<boolean>(true)
    const [baseInfoForm] = Form.useForm()
    const [cargoVOListForm] = Form.useForm()
    const [portedCargoForm] = Form.useForm()
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })

    const { loading: addressLoading, data: addressList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const addressList: any[] = await RequestUtil.get(`/tower-system/region/00`)
            resole([...addressList.map(item => ({
                value: `${item.bigRegion}-${item.name}`,
                label: `${item.bigRegion}-${item.name}`
            })), { value: "其他-国外", label: "其他-国外" }])
        } catch (error) {
            reject(error)
        }
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/projectInfo/${params.id}`)
            // 对数据进行处理
            if (result && result.cargoVOList && result.cargoVOList.length > 0) {
                result.cargoVOList.forEach((item: any) => item.amount = item.amount <= 0 ? 0 : item.amount)
            }
            setAddress(result.address)
            resole({
                ...result,
                projectName: { value: result.projectName, id: result.nicheId },
                projectLeader: { value: result.projectLeader, id: result.projectLeaderId },
                biddingPerson: { value: result.biddingPerson, id: result?.biddingPersonId },
                address: `${["null", null].includes(result.bigRegion) ? "" : result.bigRegion}-${["null", null].includes(result.address) ? "" : result.address}`
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: params.id === "new" })

    const { loading: saveStatus, run } = useRequest<{ [key: string]: any }>((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[params.id === "new" ? "post" : "put"](`/tower-market/projectInfo`, postData)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        try {
            const baseInfoData = await baseInfoForm.validateFields()
            const cargoVOListData = await cargoVOListForm.validateFields()
            const portedCargoData = await portedCargoForm.validateFields()
            // const projectLeaderType = typeof baseInfoData.projectLeader === "string" ? true : false
            const [bigRegion, address] = baseInfoData.address !== "其他-国外" ? baseInfoData.address.split("-") : ["", "其他-国外"]
            const biddingAgency = Object.prototype.toString.call(baseInfoData.biddingAgency) === "[object String]" ?
                baseInfoData.biddingAgency :
                baseInfoData.biddingAgency?.value ?
                    baseInfoData.biddingAgency?.value : ""
            const result = await run({
                ...baseInfoData,
                id: data?.id,
                nicheId: baseInfoData.projectName?.id,
                projectName: baseInfoData.projectName?.value || baseInfoData.projectName,
                address,
                bigRegion,
                fileIds: attchsRef.current?.getDataSource().map(item => item.id),
                cargoDTOList: cargoVOListData.submit,
                portedCargoDTOList: portedCargoData.submit,
                projectLeaderId: baseInfoData.projectLeader?.id,
                projectLeader: baseInfoData.projectLeader?.value,
                biddingPerson: baseInfoData.biddingPerson?.value,
                biddingAgency
            })
            if (result) {
                setWhen(false)
                message.success("保存成功...")
                history.goBack()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleBaseInfoChange = (fields: any) => {
        if (fields.address) {
            setAddress(fields.address);
            //address 不是其他-国外 country 置空
            if (fields.address != '其他-国外') {
                baseInfoForm.setFieldsValue({ country: "" })
            }
        }
        if (fields.projectName && fields.projectName.records?.[0]) {
            const rowData = fields.projectName.records?.[0]
            baseInfoForm.setFieldsValue({
                projectNumber: rowData.projectNumber,
                bidBatch: rowData.batchSn,
                bidBuyEndTime: rowData.bidBuyEndTime,
                biddingEndTime: rowData.biddingEndTime,
                releaseDate: rowData.releaseDate,
                projectLeader: {
                    id: rowData.salesmanId,
                    value: rowData.salesmanName,
                    records: [{ id: rowData.salesmanId }]
                },
                biddingPerson: {
                    id: rowData.bidCompanyId,
                    value: rowData.bidCompanyName,
                    records: [{ id: rowData.bidCompanyId }]
                },
                biddingAgency: {
                    id: rowData.bidAgencyId,
                    value: rowData.bidAgencyName,
                    records: [{ id: rowData.bidAgencyId }]
                }
            })
        }
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

    return <>
        {params.id !== "new" && <ManagementDetailTabsTitle />}
        <DetailContent when={when} operation={[
            <Button
                key="save"
                type="primary"
                onClick={handleSubmit}
                loading={saveStatus}
                style={{ marginRight: 16 }}
            >保存</Button>,
            <Button key="cacel" onClick={() => history.goBack()}>取消</Button>
        ]}>
            <Spin spinning={loading || addressLoading}>
                <DetailTitle title="基本信息" />
                <BaseInfo
                    onChange={handleBaseInfoChange}
                    form={baseInfoForm}
                    columns={
                        address === "其他-国外" ?
                            baseInfoData.map((item: any) => item.dataIndex === "address" ?
                                ({
                                    ...item,
                                    type: "select",
                                    enum: addressList
                                }) : item) :
                            baseInfoData.map((item: any) => item.dataIndex === "address" ? ({
                                ...item,
                                type: "select",
                                enum: addressList
                            }) : item).filter((item: any) => item.dataIndex !== "country")
                    } dataSource={data || {}} edit />
                <DetailTitle title="物资清单" />
                {(params.id !== "new" && params.id) ? <CommonTable
                    haveIndex
                    columns={cargoVOListColumns}
                    dataSource={data?.cargoVOList}
                /> : <EditableTable
                    form={cargoVOListForm}
                    columns={cargoVOListColumns}
                    dataSource={data?.cargoVOList || []} />}
                <DetailTitle title="整理后物资清单" style={{ paddingTop: "24px" }} />
                <EditableTable
                    opration={[
                        <UploadXLS key="xlxs"
                            title={<>
                                文件导入要求：<br />
                                1、仅Excel文件导入（xls，xlsx均可）。<br />
                                2、列名必须包括包名称、 分包编号、项目单位、需求单位、 项目名称、
                                工程电压等级、货物名称、物资名称、物资描述、单位、
                                数量（吨）、首批交货日期、最后一批交货日期、交货地点、
                                交货方式、技术规范编码、网省采购申请号、总部采购申请号、
                                物料编码、扩展描述、扩展编码
                            </>}
                            readEnd={async (_data) => {
                                const vilidateCols = [
                                    "包名称", "分包编号", "项目单位", "需求单位", "项目名称",
                                    "工程电压等级", "货物名称", "物资名称", "物资描述", "单位",
                                    "数量（吨）", "首批交货日期", "最后一批交货日期", "交货地点",
                                    "交货方式", "技术规范编码", "网省采购申请号", "总部采购申请号",
                                    "物料编码", "扩展描述", "扩展编码"]
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
                                const filterUploadData = _data.filter(item => Object.keys(item).every(eItem => eItem))
                                const uploadData = filterUploadData.map((item: any, index) => {
                                    let rowData: any = { uid: _data.length + index }
                                    Object.keys(item).forEach((columnItem: string) => {
                                        const columnDataIndex = portedCargoColumns.find(bidItem => bidItem.title === columnItem)
                                        if (columnDataIndex) {
                                            rowData[columnDataIndex.dataIndex] = generateFormatEditData(columnDataIndex, item[columnItem])
                                        }
                                    })
                                    return rowData
                                })
                                const values = await portedCargoForm.getFieldsValue().submit || []
                                portedCargoForm.setFieldsValue({ submit: values.concat(uploadData) })
                            }} />,
                        <Button
                            key="download"
                            type="link"
                            onClick={() => downLoadTemplate(portedCargoColumns, "物资清单模板")}
                        >下载模板</Button>
                    ]}
                    form={portedCargoForm}
                    columns={portedCargoColumns}
                    dataSource={data?.portedCargoVOList || []} />
                <Attachment title="附件信息" maxCount={10} ref={attchsRef} edit dataSource={data?.attachVos} />
            </Spin>
        </DetailContent>
    </>
}