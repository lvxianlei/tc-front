import React, { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button, Upload, Form, message, Spin, Modal, InputNumber, Row, Col } from 'antd'
import { DetailTitle, BaseInfo, CommonTable } from '../../common'
import { BasicInformation, CargoDetails, SelectedArea, Selected } from "./receivingListData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
interface ChooseModalProps {
    id: string
}
const ChooseModal = forwardRef(({ id }: ChooseModalProps, ref) => {
    const [chooseList, setChooseList] = useState<any[]>([])
    const [selectList, setSelectList] = useState<any[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [currentId, setCurrentId] = useState<string>("")
    const [oprationType, setOprationType] = useState<"select" | "remove">("select")
    const [form] = Form.useForm()
    useImperativeHandle(ref, () => ({ dataSource: chooseList }), [ref, JSON.stringify(chooseList)])

    const { loading } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialContract/${id}`)
            setSelectList(result?.materialContractDetailVos)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const handleRemove = async (id: string) => {
        const formData = await form.validateFields()
        const currentData = chooseList.find((item: any) => item.id === id)
        const currentSelectData = chooseList.find((item: any) => item.id === id)
        if ((currentData.num - formData.num) <= 0) {
            setChooseList(chooseList.filter((item: any) => item.id !== id))
            if (currentSelectData) {
                setSelectList(selectList.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                setSelectList([...selectList, { ...currentData, num: formData.num }])
            }
        } else {
            setChooseList(selectList.map((item: any) => item.id === id ? ({ ...item, num: item.num - formData.num }) : item))
        }
    }

    const handleSelect = async (id: string) => {
        const formData = await form.validateFields()
        const currentData = selectList.find((item: any) => item.id === id)
        const currentChooseData = chooseList.find((item: any) => item.id === id)
        if ((currentData.num - formData.num) <= 0) {
            console.log("<=0")
            setSelectList(selectList.filter((item: any) => item.id !== id))
            if (currentChooseData) {
                setChooseList(chooseList.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                setChooseList([...chooseList, { ...currentData, num: formData.num }])
            }
        } else {
            setSelectList(selectList.map((item: any) => item.id === id ? ({ ...item, num: item.num - formData.num }) : item))
            if (currentData) {
                console.log("currentData")
                setChooseList(chooseList.map((item: any) => item.id === id ? ({ ...item, num: parseFloat(item.num) + parseFloat(formData.num) }) : item))
            } else {
                console.log("else currentData")
                setChooseList([...chooseList, { ...currentData, num: formData.num }])
            }
        }
    }

    const handleModalOk = () => oprationType === "select" ? handleSelect(currentId) : handleRemove(currentId)

    return <Spin spinning={loading}>
        <Modal title="选定数量"
            visible={visible}
            onOk={handleModalOk}
            onCancel={() => {
                setVisible(false)
                form.resetFields()
            }}>
            <Form form={form}>
                <Row>
                    <Col span={24}><Form.Item
                        rules={[
                            {
                                required: true,
                                message: "请输入数量..."
                            }
                        ]}
                        style={{ width: "100%" }}
                        name="num"
                        label="输入数量"><InputNumber /></Form.Item></Col>
                </Row>
            </Form>
        </Modal>
        <DetailTitle title="选定区" />
        <CommonTable columns={[
            ...SelectedArea, {
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <a onClick={() => {
                    setCurrentId(records.id)
                    setOprationType("remove")
                    setVisible(true)
                }}>移除</a>
            }]} dataSource={chooseList} />
        <DetailTitle title="待选区" />
        <CommonTable columns={[
            ...Selected,
            {
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <a onClick={() => {
                    setCurrentId(records.id)
                    setOprationType("select")
                    setVisible(true)
                }}>选择</a>
            }]} dataSource={selectList} />
    </Spin>
})
interface EditProps {
    id: string,
    type: "new" | "edit"
}
interface ModalRef {
    dataSource: any[]
    resetFields: () => void
}
export default forwardRef(function Edit({ id, type }: EditProps, ref): JSX.Element {
    const modalRef = useRef<ModalRef>({ dataSource: [], resetFields: () => { } })
    const [visible, setVisible] = useState<boolean>(false)
    const [cargoData, setCargoData] = useState<any[]>([])
    const [contractId, setContractId] = useState<string>("")
    const [form] = Form.useForm()
    const handleModalOk = () => {
        const dataSource: any[] = modalRef.current?.dataSource
        setCargoData(dataSource)
    }

    const onSubmit = () => {

    }

    const resetFields = () => {
        form.resetFields()
        setCargoData([])
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref])

    const handleBaseInfoChange = (fields: any) => {
        if (fields.contractNumber) {
            setContractId(fields.contractNumber.id)
        }
    }

    return <>
        <Modal width={1011} visible={visible} title="选择货物明细" onCancel={() => {
            modalRef.current?.resetFields()
            setVisible(false)
        }} onOk={handleModalOk}>
            <ChooseModal id={contractId} ref={modalRef} />
        </Modal>
        <DetailTitle title="收货单基础信息" />
        <BaseInfo form={form} onChange={handleBaseInfoChange} columns={BasicInformation} dataSource={{}} edit />
        <DetailTitle title="货物明细" operation={[<Button
            type="primary" key="choose" ghost
            onClick={() => {
                if (!contractId) {
                    message.warning("请先选择合同编号...")
                    return
                }
                setVisible(true)
            }}>选择</Button>]} />
        <CommonTable columns={CargoDetails} dataSource={cargoData} />
    </>
})