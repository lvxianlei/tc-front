import React, { useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom"
import { Button, Spin, Form, message, Modal } from 'antd'
import { EditTable, EditableTable, DetailTitle, BaseInfo, DetailContent, Attachment, AttachmentRef } from '../common'
import { baseInfoData, detaiBidStatus, bidPageInfo } from './bidding.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from "../../utils/RequestUtil"

export default function InfomationNew(): JSX.Element {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const attachRef = useRef<AttachmentRef>()
    const [binddingStatus, setBinddingStatus] = useState<number>(0)
    const [visible, setVisible] = useState<boolean>(false)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [baseInfoForm] = Form.useForm()
    const [bidForm] = Form.useForm()
    const [form] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
            bidForm.setFieldsValue({ submit: data.bidPackageInfoVOS })
            setBinddingStatus(data.biddingStatus)
            resole(data)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: saveStatus, run } = useRequest((postData: {}) => new Promise(async (resove, reject) => {
        try {
            const data: any = await RequestUtil.put(`/tower-market/bidInfo`, postData)
            resove(data)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    const { run: bidResultRun } = useRequest((postData: {}) => new Promise(async (resole, reject) => {
        try {
            const data: any = await RequestUtil.post(`/tower-market/bidInfo/bidResponse`, { id: params.id, ...postData })
            form.setFieldsValue({ biddingStatus: 1 })
            resole(data)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    const detailData: any = data
    const handleSave = async () => {
        const baseInfoResult = await baseInfoForm.validateFields()
        const bidPackageInfoDTOList = await bidForm.validateFields()
        const postData = {
            ...detailData,
            ...baseInfoResult,
            bidPackageInfoDTOList: bidPackageInfoDTOList.submit,
            fileIds: attachRef.current?.getDataSource().map(item => item.id)
        }
        delete postData.bidPackageInfoVOS
        delete postData.attachVos
        const result = await run(postData)
        if (result) {
            message.success('保存成功...')
            history.goBack()
        }
    }

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const handleBaseInfoChange = (changeFiled: any) => {
        setIsEdit(true)
        if (Object.keys(changeFiled)[0] === "biddingStatus") {
            const { biddingStatus } = changeFiled
            if (biddingStatus === 2) {
                Modal.confirm({
                    title: "应标状态修改",
                    content: "当前标的已被应标，是否取消应标？确定后，该招标信息的项目将被删除，请再三确认！",
                    onOk: () => {
                        setBinddingStatus(biddingStatus)
                    },
                    onCancel: () => {
                        baseInfoForm.setFieldsValue({ biddingStatus: binddingStatus })
                    }
                })
                return
            }
            if (biddingStatus === 0) {
                Modal.confirm({
                    title: "应标状态修改",
                    content: "当前标的已被应标，是否取消应标？确定后，工程将被删除，请再三确认！",
                    onOk: () => {
                        setBinddingStatus(biddingStatus)
                    },
                    onCancel: () => {
                        baseInfoForm.setFieldsValue({ biddingStatus: binddingStatus })
                    }
                })
                return
            }
            if (biddingStatus === 1) {
                setVisible(true)
            }
            setBinddingStatus(biddingStatus)
        }

    }

    const filterBaseInfoData: (baseInfoData: any) => any[] = (baseInfoData) => {
        const newData = baseInfoData.map((item: any) => item.dataIndex === "biddingStatus" ? ({ ...item, disabled: detailData?.biddingStatus === 0 }) : item)
        return [0, 1].includes(binddingStatus) ? newData.filter((item: any) => item.dataIndex !== "reason") : newData
    }

    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields()

            await bidResultRun({
                ...submitData,
                 biddingStatus: 1,
                projectLeaderId: submitData.projectLeaderId?.id,
                bigPackageIds: submitData.bigPackageIds?.records.map((item: any) => item.id)
            })
            handleSave();
            setVisible(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalCancel = () => {
        setBinddingStatus(2)
        setVisible(false)
        baseInfoForm.setFieldsValue({ biddingStatus: 2 })
    }
    const handleChange = (fields: any, allFields: any) => {
        setIsEdit(true)
    }
    const handleBindChange = (fields: any, allFields: any) => {
        if (fields.submit.length - 1 >= 0) {
            const result = allFields.submit[fields.submit.length - 1];
            const flag = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
            if (flag.test(result['unit'])) {
                allFields.submit[fields.submit.length - 1]['unit'] = '';
            }
        }
    }
    const handelCancel = () => {
        if (!isEdit) {
            history.goBack();
            return;
        }
        Modal.confirm({
            title: "离开提醒",
            content: "确定要离开吗？",
            onOk: () => history.goBack()
        })
    }
    return <DetailContent
        operation={[
            <Button
                key="save"
                type="primary"
                onClick={handleSave}
                loading={saveStatus}
                style={{ marginRight: 16 }}
            >保存</Button>,
            <Button key="cancel" onClick={handelCancel}>取消</Button>
        ]}
    >
        <Modal zIndex={15} visible={visible} title="应标" okText="确定" onOk={handleModalOk} onCancel={handleModalCancel} >
            <BaseInfo edit form={form} columns={detaiBidStatus.map((item: any) => {
                if (item.dataIndex === "bigPackageIds") {
                    return ({ ...item, path: `${item.path}?bidInfoId=${params.id}` })
                }
                return item
            })} dataSource={{}} col={1} />
        </Modal>
        <DetailTitle title="基础信息" />
        <BaseInfo form={baseInfoForm} onChange={handleBaseInfoChange} columns={filterBaseInfoData(baseInfoData)} dataSource={detailData} edit />
        <DetailTitle title="物资清单" />
        <EditableTable form={bidForm} columns={bidPageInfo} dataSource={detailData.bidPackageInfoVOS} onChange={handleBindChange} />
        <Attachment title="附件" ref={attachRef} dataSource={data?.attachVos} edit />
    </DetailContent>
}