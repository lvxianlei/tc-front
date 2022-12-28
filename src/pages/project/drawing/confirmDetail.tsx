import React, {useState, useImperativeHandle, forwardRef, useEffect} from 'react'
import { Button, Space, Modal, Form, message } from 'antd'
import { CommonTable, DetailTitle, BaseInfo, UploadXLSX } from '../../common'
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
interface ConfirmDetailProps {
    id: string
    type: "edit" | "create"
}

export default forwardRef(function ConfirmDetail({ id, type }: ConfirmDetailProps, ref) {
    const [visible, setVisible] = useState<boolean>(false);
    const [rowId, setRowId] = useState<string>();
    const [tableDataSource, setTableDataSource] = useState<object[]>([]);
    const [weightCount, setWeightCount] = useState<number>(0);
    const [form] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
    const [edit, setEdit] = useState('添加');
    const rowData: any = tableDataSource.find((item: any) => item.key === rowId)
    const handleModalOk = async () => {
        const rowData = await form.validateFields()
        if (rowId) {
            setTableDataSource(tableDataSource.map((item: any) => {
                if (item.key === rowId) {
                    return ({
                        ...rowData,
                        productTypeId: rowData?.productTypeName?.value,
                        productTypeName: rowData?.productTypeName?.label,
                        voltageGradeId: rowData?.voltageGradeName?.value,
                        voltageGradeName: rowData?.voltageGradeName?.label,
                        structureId: rowData?.structureName?.value,
                        structureName: rowData?.structureName?.label,
                        pattern: rowData?.patternName?.value,
                        patternName: rowData?.patternName?.label,
                        key: rowId
                    })
                }
                return item
            }))
        } else {
            setTableDataSource([{
                ...rowData,
                productTypeId: rowData?.productTypeName?.value,
                productTypeName: rowData?.productTypeName?.label,
                voltageGradeId: rowData?.voltageGradeName?.value,
                voltageGradeName: rowData?.voltageGradeName?.label,
                structureId: rowData?.structureName?.value,
                structureName: rowData?.structureName?.label,
                pattern: rowData?.patternName?.value,
                patternName: rowData?.patternName?.label,
                key: `${(Math.random() * 100000000000).toFixed(12)}-${tableDataSource.length}`
            }, ...tableDataSource])
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

    useImperativeHandle(ref, () => ({
        getDataSource: () => tableDataSource
    }))

    const handleLoaded = (data: any) => {
        setTableDataSource([...data.map((item: any, index: number) => ({
            ...item,
            // productTypeId: item?.productTypeName?.value,
            // productTypeName: item?.productTypeName,
            // voltageGradeId: item?.voltageGradeName?.value,
            // voltageGradeName: item?.voltageGradeName?.label,
            // structureId: item?.structureName?.value,
            // structureName: item?.structureName?.label,
            // pattern: item?.patternName?.value,
            // patternName: item?.patternName?.label,
            totalWeight:item?.monomerWeight,
            key: `${(Math.random() * 100000000000).toFixed(12)}-${index}`
        })), ...tableDataSource])
    }

    const handleDelete = () => {
        setTableDataSource(tableDataSource.filter((item: any) => !selectedKeys.includes(item?.key)))
    }
        useEffect(()=>{
            // 更新总重
            calcWeightCount()
        },[tableDataSource])

    const calcWeightCount = ()=>{
            let count = 0
            tableDataSource.forEach((item:any)=>{
                count += item.monomerWeight || 0
            })
            setWeightCount(count)
    }
    return <div>
        <DetailTitle title="确认明细" key="detail_title" />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <Space>
                <span key="number">总基数：{tableDataSource.length}基</span>
                <span key="weight">总重量：{ weightCount }kg</span>
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
                <Button
                    type='primary'
                    key="batchDelete"
                    onClick={handleDelete} ghost>批量删除</Button>
            </Space>
        </div>
        <CommonTable
            columns={[...productGroupDetail, {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                render: (_: any, record: any) => <Space>
                    <Button type="link" size="small" onClick={() => {
                        setRowId(record.key)
                        setVisible(true)
                    }}>编辑</Button>
                </Space>
            }]}
            rowKey="key"
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
                col={6}
                columns={productGroupRow.map((item: any) => {
                    if (item.dataIndex === "productTypeName") {
                        return ({
                            ...item,
                            type: "select",
                            labelInValue: true,
                            enum: productTypeEnum || []
                        })
                    }
                    if (item.dataIndex === "voltageGradeName") {
                        return ({
                            ...item,
                            type: "select",
                            labelInValue: true,
                            enum: voltageGradeEnum || []
                        })
                    }
                    if (item.dataIndex === "structure") {
                        return ({
                            ...item,
                            type: "select",
                            labelInValue: true,
                            enum: towerStructureEnum || []
                        })
                    }
                    if (item.dataIndex === "patternName") {
                        return ({
                            ...item,
                            type: "select",
                            labelInValue: true,
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
                    structureName: rowData ? {
                        value: rowData?.structureId,
                        label: rowData?.structureName
                    } : undefined,
                    patternName: rowData ? {
                        value: rowData?.pattern,
                        label: rowData?.patternName
                    } : undefined,
                } || {}}
            />
        </Modal>
    </div>
}
)