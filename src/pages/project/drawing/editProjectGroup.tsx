import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Space, Modal, Form, message } from 'antd'
import { CommonTable, DetailTitle, BaseInfo, UploadXLSX } from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import {
    patternTypeOptions,
    productTypeOptions,
    towerStructureOptions,
    voltageGradeOptions
} from '../../../configuration/DictionaryOptions';
import { productGroupDetail, productGroupRow, productGroupXLSX } from "./drawing.json"

import { downloadTemplate } from '../../workMngt/setOut/downloadTemplate'

const patternTypeEnum = patternTypeOptions?.map((item: any) => ({ label: item.name, value: item.id }))
const productTypeEnum = productTypeOptions?.map((item: any) => ({ label: item.name, value: item.id }))
const towerStructureEnum = towerStructureOptions?.map((item: any) => ({ label: item.name, value: item.id }))
const voltageGradeEnum = voltageGradeOptions?.map((item: any) => ({ label: item.name, value: item.id }))
export default function ConfirmDetail() {
    const history = useHistory()
    const { id: businessId } = useParams<{ id: string }>()
    const [visible, setVisible] = useState<boolean>(false);
    const [rowId, setRowId] = useState()
    const [tableDataSource, setTableDataSource] = useState<object[]>([]);
    const [weight, setWeight] = useState<string>('0');
    const [form] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
    const [edit, setEdit] = useState('添加');
    const rowData: any = tableDataSource.find((item: any) => item.id === rowId)
    const { loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-market/drawingConfirmation/getDrawingAssist?id=${businessId}`)
        setTableDataSource(data?.records || [])
        resole(data);
    }))

    const { run: addnew } = useRequest<any>((bodyData: any[]) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.post(`/tower-market/drawingConfirmation/product`, bodyData?.map((item: any) => ({
            ...item,
            businessId
        })))
        resole(data);
    }), { manual: true })

    const { run: removeRun } = useRequest<any>((bodyData: any[]) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.delete(`/tower-market/drawingConfirmation/product`, bodyData?.map((item: any) => ({
            ...item,
            businessId
        })))
        resole(data);
    }), { manual: true })

    const { run: updateRow } = useRequest<any>((rowData: any[]) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.put(`/tower-market/drawingConfirmation/product`, rowData)
        resole(data);
    }), { manual: true })

    const handleModalOk = async () => {
        const rowData = await form.validateFields()
        if (rowId) {
            await updateRow({
                ...rowData,
                productTypeId: rowData?.productTypeName?.value,
                productTypeName: rowData?.productTypeName?.label,
                voltageGradeId: rowData?.voltageGradeName?.value,
                voltageGradeName: rowData?.voltageGradeName?.label,
                structureId: rowData?.structure?.value,
                structure: rowData?.structure?.label,
                patternId: rowData?.patternName?.value,
                patternName: rowData?.patternName?.label,
                id: rowId
            })
            await message.success("编辑成功...")
            history.go(0)
        } else {
            await addnew([{
                ...rowData,
                productTypeId: rowData?.productTypeName?.value,
                productTypeName: rowData?.productTypeName?.label,
                voltageGradeId: rowData?.voltageGradeName?.value,
                voltageGradeName: rowData?.voltageGradeName?.label,
                structureId: rowData?.structure?.value,
                structure: rowData?.structure?.label,
                patternId: rowData?.patternName?.value,
                patternName: rowData?.patternName?.label,
            }])
            await message.success("新增成功...")
            history.go(0)
        }
        setRowId(undefined)
        setVisible(false)
    }

    const handleModalCancel = () => {
        setVisible(false);
        form.resetFields();
    }

    const SelectChange = (selectedRowKeys: React.Key[]): void => {
        setSelectedKeys(selectedRowKeys)
    }

    const handleLoaded = async (data: any) => {
        await addnew(data)
        await message.success("导入成功...")
        history.go(0)
    }

    return <div>
        <DetailTitle title="确认明细" key="detail_title" />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <Space>
                <span key="number">总基数：{tableDataSource.length}基</span>
                <span key="weight">总重量：{weight}kg</span>
            </Space>
            <Space>
                <UploadXLSX
                    onLoaded={handleLoaded}
                    columns={productGroupXLSX}
                >
                    <Button type="primary" ghost>导入</Button>
                </UploadXLSX>
                <Button
                    type="primary"
                    ghost
                    onClick={() => downloadTemplate(
                        '/tower-science/drawProductDetail/importTemplate',
                        '杆塔明细模板'
                    )}
                >模版下载</Button>
                <Button type='primary' key="add" ghost onClick={() => {
                    setEdit('添加')
                    setVisible(true)
                }}>添加</Button>
                <Button type='primary' key="batchDelete" onClick={
                    async () => {
                        await RequestUtil.delete(`/tower-market/drawingConfirmation/product`, selectedKeys)
                        await message.success('删除成功！')
                        history.go(0)
                    }
                } ghost>批量删除</Button>
            </Space>
        </div>
        <CommonTable
            loading={loading}
            columns={[...productGroupDetail, {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                render: (_: any, record: any) => <Space>
                    <Button type="link" size="small" onClick={() => {
                        setRowId(record.id)
                        setVisible(true)
                    }}>编辑</Button>
                </Space>
            }]}
            rowKey="id"
            dataSource={[...tableDataSource]}
            pagination={false}
            rowSelection={{
                selectedRowKeys: selectedKeys,
                onChange: SelectChange
            }} />
        <Modal
            visible={visible}
            title={edit}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            width={"80%"}>
            <BaseInfo
                form={form}
                edit
                col={3}
                columns={productGroupRow.map((item: any) => {
                    if (item.dataIndex === "productTypeName") {
                        return ({
                            ...item,
                            type: "select", labelInValue: true,
                            enum: productTypeEnum || []
                        })
                    }
                    if (item.dataIndex === "voltageGradeName") {
                        return ({
                            ...item,
                            type: "select", labelInValue: true,
                            enum: voltageGradeEnum || []
                        })
                    }
                    if (item.dataIndex === "structure") {
                        return ({
                            ...item,
                            type: "select", labelInValue: true,
                            enum: towerStructureEnum || []
                        })
                    }
                    if (item.dataIndex === "patternName") {
                        return ({
                            ...item,
                            type: "select", labelInValue: true,
                            enum: patternTypeEnum || []
                        })
                    }
                    return item
                })}
                dataSource={{
                    ...rowData,
                    productTypeName: rowData ? {
                        value: rowData?.productTypeId,
                        label: rowData?.productTypeName
                    } : undefined,
                    voltageGradeName: rowData ? {
                        value: rowData?.voltageGradeId,
                        label: rowData?.voltageGradeName
                    } : undefined,
                    structure: rowData ? {
                        value: rowData?.structureId,
                        label: rowData?.structure
                    } : undefined,
                    patternName: rowData ? {
                        value: rowData?.patternId,
                        label: rowData?.patternName
                    } : undefined,
                } || {}}
            />
        </Modal>
    </div>
}