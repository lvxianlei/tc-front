/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-明细变更申请-申请
 */

import React, { useImperativeHandle, forwardRef, useState, useRef } from "react";
import { Button, Form, Input, Select, Modal, Spin, message, InputNumber } from "antd";
import { Attachment, AttachmentRef, BaseInfo, CommonTable, DetailContent } from "../../common";
import RequestUtil from "../../../utils/RequestUtil";
import useRequest from "@ahooksjs/use-request";
import styles from "./RequestForChange.module.less";
import SelectByTaskNum from "./SelectByTaskNum";
import { FixedType } from "rc-table/lib/interface";
import { productTypeOptions, typeOfChangeOptions, voltageGradeOptions } from "../../../configuration/DictionaryOptions";
import { applyColumns, changeColumns } from "./requestForChange.json"

interface modalProps {
    readonly id?: any;
    readonly type?: "new" | "edit";
    getLoading: (loading: boolean) => void
}

export default forwardRef(function ApplyForChange({ id, type, getLoading }: modalProps, ref) {
    const [form] = Form.useForm();
    const [changeForm] = Form.useForm();
    const [selectedForm] = Form.useForm();
    const [changeData, setChangeData] = useState<any>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [selectedData, setSelectedData] = useState<any>([]);
    const [detailData, setDetailData] = useState({});
    const attachRef = useRef<AttachmentRef>()

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/productChange/${id}`)
            setDetailData({ ...result })
            setSelectedData(result?.productChangeDetailList || [])
            selectedForm.setFieldsValue({
                data: [
                    ...result?.productChangeDetailList || []
                ]
            })
            form?.setFieldsValue({
                ...result
            })
            run(result?.drawTaskId, result?.productChangeDetailList?.map((res: any) => res?.drawProductId))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id, type] })

    const { run } = useRequest<any>((id: string, list: any[]) => new Promise(async (resole, reject) => {
        try {
            RequestUtil.get(`/tower-science/productChange/product/list/${id}`).then((res: any) => {
                let newData: any = [];
                newData = res?.filter((items: any) => {
                    return list.findIndex(e => e === items?.id) === -1
                })
                setChangeData(newData || [])
            })
            resole(true)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const selectedColumns = [
        {
            "key": "changeTypeId",
            "title": "变更类型",
            "width": 50,
            "dataIndex": "changeTypeId"
        },
        {
            "key": "productNumber",
            "title": "杆塔号（修改前）",
            "width": 80,
            "dataIndex": "productNumber"
        },
        {
            "key": "changeProductNumber",
            "title": "杆塔号（修改后）",
            "width": 80,
            "dataIndex": "changeProductNumber"
        },
        {
            "key": "productCategoryName",
            "title": "塔型名（修改前）",
            "width": 80,
            "dataIndex": "productCategoryName"
        },
        {
            "key": "changeProductCategoryName",
            "title": "塔型名（修改后）",
            "width": 80,
            "dataIndex": "changeProductCategoryName"
        },
        {
            "key": "steelProductShape",
            "title": "塔型钢印号（修改前）",
            "width": 80,
            "dataIndex": "steelProductShape"
        },
        {
            "key": "changeSteelProductShape",
            "title": "塔型钢印号（修改后）",
            "width": 80,
            "dataIndex": "changeSteelProductShape"
        },
        {
            "key": "voltageGradeName",
            "title": "电压等级（修改前）",
            "width": 80,
            "dataIndex": "voltageGradeName"
        },
        {
            "key": "changeVoltageGrade",
            "title": "电压等级（修改后）",
            "width": 80,
            "dataIndex": "changeVoltageGrade"
        },
        {
            "key": "productTypeName",
            "title": "产品类型（修改前）",
            "width": 80,
            "dataIndex": "productTypeName"
        },
        {
            "key": "changeProductType",
            "title": "产品类型（修改后）",
            "width": 80,
            "dataIndex": "changeProductType"
        },
        {
            "key": "monomerWeight",
            "title": "单重（修改前）",
            "width": 80,
            "dataIndex": "monomerWeight"
        },
        {
            "key": "changeMonomerWeight",
            "title": "单重（修改后）",
            "width": 80,
            "dataIndex": "changeMonomerWeight"
        },
        {
            "key": "productDescription",
            "title": "备注（修改前）",
            "width": 80,
            "dataIndex": "productDescription"
        },
        {
            "key": "changeProductDescription",
            "title": "备注（修改后）",
            "width": 80,
            "dataIndex": "changeProductDescription"
        },
        {
            "key": "operation",
            "title": "操作",
            "dataIndex": "operation",
            fixed: "right" as FixedType,
            "width": 80,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Button type="link" onClick={() => {
                    const value = selectedForm?.getFieldsValue(true)?.data;
                    setChangeData([
                        ...changeData || [],
                        {
                            ...record,
                            id: record?.drawProductId,
                            productCategory: record?.productCategoryName,
                            name: record?.productNumber,
                            voltageLevelName: record?.voltageGradeName,
                        }
                    ])
                    value?.splice(index, 1)
                    selectedForm?.setFieldsValue({
                        data: [...value]
                    })
                    setSelectedData([...value])
                }}>移除</Button>
            )
        }
    ]

    const SelectedChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const bulkChanges = () => {
        Modal.confirm({
            title: "添加修改",
            icon: null,
            content: <Form form={changeForm} layout="horizontal">
                <Form.Item
                    label="塔型名"
                    name="changeProductCategoryName"
                >
                    <Input maxLength={100} />
                </Form.Item>
                <Form.Item
                    label="塔型钢印号"
                    name="changeSteelProductShape"
                >
                    <Input maxLength={100} />
                </Form.Item>
                <Form.Item
                    label="电压等级kV"
                    name="changeVoltageGrade"
                >
                    <Select style={{ width: "100%" }} allowClear>
                        {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="产品类型"
                    name="changeProductType"
                >
                    <Select style={{ width: "100%" }} allowClear>
                        {
                            productTypeOptions?.map((item: any, index: number) =>
                                <Select.Option value={item.id} key={index}>
                                    {item.name}
                                </Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label="变更类型"
                    name="changeTypeId"
                >
                    <Select style={{ width: "100%" }} allowClear>
                        {typeOfChangeOptions && typeOfChangeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>

            </Form>,
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    const values = changeForm.getFieldsValue(true);
                    if (values?.changeProductCategoryName || values?.changeSteelProductShape || values?.changeVoltageGrade || values?.changeProductType || values?.changeTypeId) {

                        let newChangeData: any[] = changeData || []
                        const newSelectedData = selectedRows?.map(res => {
                            newChangeData = newChangeData.filter((item: any) => res?.id !== item?.id)
                            return {
                                ...res,
                                ...values,
                                id: '',
                                drawProductId: res?.id,
                                productCategoryName: res?.productCategory,
                                productNumber: res?.name,
                                voltageGradeName: res?.voltageLevelName,
                                voltageGrade: res?.voltageLevel,
                            }
                        })
                        setSelectedData([...selectedForm?.getFieldsValue(true)?.data || [], ...newSelectedData])
                        selectedForm?.setFieldsValue({
                            data: [...selectedForm?.getFieldsValue(true)?.data || [], ...newSelectedData]
                        })
                        setChangeData([...newChangeData])
                        setSelectedKeys([]);
                        setSelectedRows([]);
                        resove(true)
                    } else {
                        reject(false)
                        message.warning('至少添加一项！')
                    }
                } catch (error) {
                    reject(error)
                }
            }),
            onCancel() {
                changeForm.resetFields()
            }
        })
    }

    const removeAll = () => {
        const newList = selectedData?.map((res: any) => {
            return {
                ...res,
                id: res?.drawProductId,
                productCategory: res?.productCategoryName,
                name: res?.productNumber,
                voltageLevelName: res?.voltageGradeName,
            }
        })
        setChangeData([
            ...changeData || [],
            ...newList || []
        ])
        selectedForm?.setFieldsValue({ data: [] })
        setSelectedData([])
    }

    const onSave = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(e => {
                selectedForm.validateFields().then(async res => {
                    const value = form.getFieldsValue(true);
                    const values = selectedForm?.getFieldsValue(true)?.data
                    getLoading(true)
                    await saveRun({
                        ...value,
                        productChangeDetailList: values,
                        fileIds: attachRef.current?.getDataSource().map(item => item.id),
                    })
                    resolve(true);
                })
            })
        } catch (error) {
            reject(false)
        }
    })

    const { run: saveRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            await RequestUtil.post(`/tower-science/productChange`, data).then(res => {
                resove(true)
            }).catch(e => {
                reject(e)
                getLoading(false)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            form.validateFields().then(e => {
                if (selectedData.length > 0) {
                    selectedForm.validateFields().then(async res => {
                        const value = form.getFieldsValue(true);
                        const values = selectedForm?.getFieldsValue(true)?.data
                        getLoading(true)
                        await submitRun({
                            ...value,
                            productChangeDetailList: values
                        })
                        resolve(true);
                    })
                } else {
                    message.warning('请选择需要变更的数据！')
                }
            })
        } catch (error) {
            reject(error)
        }
    })

    const { run: submitRun } = useRequest<any>((data: any) => new Promise(async (resove, reject) => {
        try {
            await RequestUtil.post(`/tower-science/productChange/submit`, data).then(res => {
                resove(true)
            }).catch(e => {
                reject(e)
                getLoading(false)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const resetFields = () => {
        form.resetFields();
        changeForm.resetFields();
        selectedForm.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSubmit, onSave, resetFields }), [ref, onSubmit, onSave, resetFields]);

    return <Spin spinning={loading}>
        <DetailContent className={styles.changeForm}>
            <Form form={form}>
                <BaseInfo dataSource={detailData || {}} columns={applyColumns?.map((res: any) => {
                    if (res.dataIndex === "drawTaskNum") {
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number) => (
                                <Form.Item name={"drawTaskNum"} rules={[{
                                    required: true,
                                    message: '请选择确认明细编号！'
                                }]}>
                                    <Input size="small" disabled suffix={
                                        <SelectByTaskNum onSelect={(selectedRows: Record<string, any>) => {
                                            RequestUtil.get(`/tower-science/productChange/product/list/${selectedRows[0]?.id}`).then(res => {
                                                setChangeData(res || [])
                                                setDetailData({
                                                    ...selectedRows[0],
                                                    internalNumber: selectedRows[0]?.contractNum,
                                                    productCategoryName: selectedRows[0]?.productCategory,
                                                    productNumber: selectedRows[0]?.name,
                                                    description: selectedRows[0]?.assignorDescription
                                                })
                                                form?.setFieldsValue({
                                                    ...selectedRows[0],
                                                    productCategoryName: selectedRows[0]?.productCategory,
                                                    productNumber: selectedRows[0]?.name,
                                                    id: '',
                                                    drawTaskId: selectedRows[0]?.id,
                                                    drawTaskNum: selectedRows[0]?.taskNum,
                                                    internalNumber: selectedRows[0]?.contractNum,
                                                    description: selectedRows[0]?.assignorDescription
                                                })
                                                setSelectedData([]);
                                                selectedForm?.setFieldsValue({
                                                    data: []
                                                })
                                            })

                                        }} />} />
                                </Form.Item>
                            )
                        })
                    }
                    if (res.dataIndex === "changeExplain") { //变更说明
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number) => (
                                <Form.Item name={"changeExplain"}>
                                    <Input.TextArea maxLength={800} />
                                </Form.Item>
                            )
                        })
                    }
                    if (res.dataIndex === "updateDescription") {//备注（修改后）
                        return ({
                            ...res,
                            render: (_: string, record: Record<string, any>, index: number) => (
                                <Form.Item name={"updateDescription"}>
                                    <Input.TextArea maxLength={800} />
                                </Form.Item>
                            )
                        })
                    }
                    return res
                })} col={5} />

            </Form>
            <Button type="primary" className={styles.bottom16} disabled={selectedKeys.length === 0} onClick={bulkChanges} ghost>批量修改</Button>
            <CommonTable
                haveIndex
                columns={[
                    ...changeColumns,
                    {
                        "key": "operation",
                        "title": "操作",
                        "dataIndex": "operation",
                        fixed: "right" as FixedType,
                        "width": 80,
                        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                            <Button type="link" onClick={() => {
                                const value = selectedForm?.getFieldsValue(true)?.data;
                                selectedForm.setFieldsValue({
                                    data: [
                                        ...value || [],
                                        {
                                            ...record,
                                            id: '',
                                            drawProductId: record?.id,
                                            productCategoryName: record?.productCategory,
                                            productNumber: record?.name,
                                            voltageGradeName: record?.voltageLevelName,
                                            voltageGrade: record?.voltageLevel,
                                        }
                                    ]
                                })
                                setSelectedData([
                                    ...value || [],
                                    {
                                        ...record,
                                        id: '',
                                        drawProductId: record?.id,
                                        productCategoryName: record?.productCategory,
                                        productNumber: record?.name,
                                        voltageGradeName: record?.voltageLevelName,
                                        voltageGrade: record?.voltageLevel,
                                    }
                                ])
                                changeData.splice(index, 1);
                                setChangeData([...changeData])
                            }}>添加</Button>
                        )
                    }]}
                dataSource={changeData}
                className={styles.bottom16}
                pagination={false}
                rowSelection={{
                    selectedRowKeys: selectedKeys,
                    type: "checkbox",
                    onChange: SelectedChange,
                }}
            />
            <Button type="primary" className={styles.bottom16} onClick={removeAll} ghost>移除全部</Button>
            <Form form={selectedForm}>
                <CommonTable
                    haveIndex
                    className={styles.bottom16}
                    columns={selectedColumns.map(res => {
                        if (res.dataIndex === "changeTypeId") {
                            return ({
                                ...res,
                                render: (_: string, record: Record<string, any>, index: number) => (
                                    <Form.Item name={["data", index, "changeTypeId"]} rules={[
                                        {
                                            required: true,
                                            message: '请选择变更类型'
                                        }
                                    ]}>
                                        <Select style={{ width: "120px" }} allowClear>
                                            {typeOfChangeOptions && typeOfChangeOptions.map(({ id, name }, index) => {
                                                return <Select.Option key={index} value={id}>
                                                    {name}
                                                </Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                )
                            })
                        }
                        if (res.dataIndex === "changeProductNumber") {
                            return ({
                                ...res,
                                render: (_: string, record: Record<string, any>, index: number) => (
                                    <Form.Item name={["data", index, "changeProductNumber"]}>
                                        <Input maxLength={100} />
                                    </Form.Item>
                                )
                            })
                        }
                        if (res.dataIndex === "changeProductCategoryName") {
                            return ({
                                ...res,
                                render: (_: string, record: Record<string, any>, index: number) => (
                                    <Form.Item name={["data", index, "changeProductCategoryName"]}>
                                        <Input maxLength={100} />
                                    </Form.Item>
                                )
                            })
                        }
                        if (res.dataIndex === "changeSteelProductShape") {
                            return ({
                                ...res,
                                render: (_: string, record: Record<string, any>, index: number) => (
                                    <Form.Item name={["data", index, "changeSteelProductShape"]}>
                                        <Input maxLength={100} />
                                    </Form.Item>
                                )
                            })
                        }
                        if (res.dataIndex === "changeVoltageGrade") {
                            return ({
                                ...res,
                                render: (_: string, record: Record<string, any>, index: number) => (
                                    <Form.Item name={["data", index, "changeVoltageGrade"]}>
                                        <Select style={{ width: "100%" }} allowClear>
                                            {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                                                return <Select.Option key={index} value={id}>
                                                    {name}
                                                </Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                )
                            })
                        }
                        if (res.dataIndex === "changeProductType") {
                            return ({
                                ...res,
                                render: (_: string, record: Record<string, any>, index: number) => (
                                    <Form.Item name={["data", index, "changeProductType"]}>
                                        <Select style={{ width: "100%" }} allowClear>
                                            {
                                                productTypeOptions?.map((item: any, index: number) =>
                                                    <Select.Option value={item.id} key={index}>
                                                        {item.name}
                                                    </Select.Option>
                                                )
                                            }
                                        </Select>
                                    </Form.Item>
                                )
                            })
                        }
                        if (res.dataIndex === "changeMonomerWeight") {
                            return ({
                                ...res,
                                render: (_: string, record: Record<string, any>, index: number) => (
                                    <Form.Item name={["data", index, "changeMonomerWeight"]}>
                                        <InputNumber min={0} max={9999999.99} precision={2}/>
                                    </Form.Item>
                                )
                            })
                        }
                        if (res.dataIndex === "changeProductDescription") {
                            return ({
                                ...res,
                                render: (_: string, record: Record<string, any>, index: number) => (
                                    <Form.Item name={["data", index, "changeProductDescription"]}>
                                        <Input maxLength={800}/>
                                    </Form.Item>
                                )
                            })
                        }

                        return res
                    })}
                    pagination={false}
                    dataSource={selectedData}
                />
            </Form>
            <Attachment isBatchDel ref={attachRef} dataSource={data?.fileVOList} edit/>
        </DetailContent>
    </Spin>
})
