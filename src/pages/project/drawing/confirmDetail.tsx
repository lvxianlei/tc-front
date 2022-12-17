import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Space, Modal, Form, Upload, message } from 'antd'
import { CommonTable, DetailTitle, BaseInfo } from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import AuthUtil from '../../../utils/AuthUtil'
import { patternTypeOptions, productTypeOptions, towerStructureOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import { productGroupDetail, productGroupRow } from "./drawing.json"
export default function ConfirmDetail() {
    const [visible, setVisible] = useState<boolean>(false);
    const [rowId, setRowId] = useState('');
    const [tableDataSource, setTableDataSource] = useState<object[]>([]);
    const [weight, setWeight] = useState<string>('0');
    const [form] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
    const [edit, setEdit] = useState('添加');

    const handleModalOk = async () => {
        const rowData = await form.validateFields()
        setTableDataSource([{ ...rowData, key: Math.random() * 1000000000 }, ...tableDataSource])
        setVisible(false)
    }

    const handleModalCancel = () => {
        setVisible(false);
        form.resetFields();
    }

    const params = useParams<{ id: string, status: string, confirmId: string }>()

    const { loading, data, run } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-market/drawingConfirmation/getDrawingAssist?id=${params.id}`)
        setTableDataSource(data?.records || [])
        resole(data);
    }), {
        manual: true
    })

    const SelectChange = (selectedRowKeys: React.Key[]): void => {
        setSelectedKeys(selectedRowKeys)
    }

    return <div>
        <DetailTitle title="确认明细" key="detail_title" />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <Space>
                <span key="number">总基数：{tableDataSource.length}基</span>
                <span key="weight">总重量：{weight}kg</span>
            </Space>
            <Space>
                {/* <Upload
                    key="import"
                    action={() => {
                        const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                        return baseUrl + '/tower-science/drawProductDetail/import'
                    }}
                    headers={
                        {
                            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    data={{ drawTaskId: params.id }}
                    showUploadList={false}
                    onChange={async (info) => {
                        if (info.file.response && !info.file.response?.success) {
                            message.warning(info.file.response?.msg)
                        }
                        if (info.file.response && info.file.response?.success) {
                            if (info.file.response && info.file.response?.success) {

                            }
                        }
                    }}
                >
                    <Button type="primary" disabled={userId !== params.confirmId} ghost >导入</Button>
                </Upload> */}
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
            width={1101}>
            <BaseInfo
                form={form}
                edit
                col={3}
                columns={productGroupRow}
                dataSource={{}}
            />
        </Modal>
    </div>
}
