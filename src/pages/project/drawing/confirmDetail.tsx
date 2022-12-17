import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Space, Modal, Form, Upload, message } from 'antd'
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
import AuthUtil from '@utils/AuthUtil'
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
    const [rowId, setRowId] = useState('');
    const [tableDataSource, setTableDataSource] = useState<object[]>([]);
    const [weight, setWeight] = useState<string>('0');
    const [form] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
    const [edit, setEdit] = useState('添加');

    const handleModalOk = async () => {
        const rowData = await form.validateFields()
        setTableDataSource([{
            ...rowData,
            key: Math.random() * 1000000000
        }, ...tableDataSource])
        setVisible(false)
    }

    const handleModalCancel = () => {
        setVisible(false);
        form.resetFields();
    }

    const { loading, data, run } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-market/drawingConfirmation/getDrawingAssist?id=${id}`)
        setTableDataSource(data?.records || [])
        resole(data);
    }), {
        manual: type === "create"
    })

    const SelectChange = (selectedRowKeys: React.Key[]): void => {
        setSelectedKeys(selectedRowKeys)
    }

    useImperativeHandle(ref, () => ({
        getDataSource: () => tableDataSource
    }))

    const handleLoaded = (data: any) => {
        console.log(data, "--------")
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
                        await RequestUtil.delete(`/tower-science/drawProductDetail?ids=${selectedKeys.join(',')}`,)
                        message.success('删除成功！')
                        run()
                    }
                } ghost>批量删除</Button>
            </Space>
        </div>
        <CommonTable
            columns={productGroupDetail}
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
                            enum: productTypeEnum || []
                        })
                    }
                    if (item.dataIndex === "voltageLevelName") {
                        return ({
                            ...item,
                            type: "select",
                            enum: voltageGradeEnum || []
                        })
                    }
                    if (item.dataIndex === "structureName") {
                        return ({
                            ...item,
                            type: "select",
                            enum: towerStructureEnum || []
                        })
                    }
                    if (item.dataIndex === "patternName") {
                        return ({
                            ...item,
                            type: "select",
                            enum: patternTypeEnum || []
                        })
                    }
                    return item
                })}
                dataSource={{}}
            />
        </Modal>
    </div>
}
)