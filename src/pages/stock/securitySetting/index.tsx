/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { Button, TableColumnProps, Modal, Input, message, Form } from 'antd'
import RequestUtil from '../../../utils/RequestUtil';
import { useHistory } from 'react-router-dom';
import { BaseInfo, DetailContent, DetailTitle, SearchTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { setting } from "./setting.json"
export default (): React.ReactNode => {
    const history = useHistory()
    const [form] = Form.useForm()
    const [visible, setVisible] = useState<boolean>(false);
    const [editRow, setEditRow] = useState<any | "new" | null>();
    const columns: TableColumnProps<object>[] = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a, _b, index) => <span>{index + 1}</span>
        },
        {
            title: '物料编码',
            dataIndex: 'materialCode',
            width: 100
        }, {
            title: '标准',
            dataIndex: 'materialStandard',
            width: 100
        },
        {
            title: '品名',
            dataIndex: 'materialName',
            width: 100
        },
        {
            title: '材质',
            dataIndex: 'structureTexture',
            width: 100
        },
        {
            title: '规格',
            dataIndex: 'structureSpec',
            width: 100
        },
        {
            title: '长度',
            dataIndex: 'length',
            width: 60
        },
        {
            title: '宽度',
            dataIndex: 'weight',
            width: 60
        },
        {
            title: '安全库存（吨）',
            dataIndex: 'safetyStockWeight',
            width: 100
        },
        {
            title: '告警库存（吨）',
            dataIndex: 'warningStockWeight',
            width: 100
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            render: (_text: any, item: any, index: number): React.ReactNode => {
                return (
                    <div>
                        <span
                            className='yello'
                            onClick={() => {
                                setVisible(true)
                                setEditRow(item)
                            }}
                        >编辑</span>
                    </div>
                )
            }
        }
    ]

    const { loading, data, run } = useRequest<{ [key: string]: any }>((params: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil[editRow === "new" ? "post" : "put"](
                `/tower-storage/safetyStock`,
                editRow === "new" ? params : ({ id: editRow.id, ...params }))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        await run()
        message.success('操作成功')
    }
    // 关闭弹窗
    const closeModal = () => {
        setVisible(false)
        setEditRow(null)
    }

    return (<DetailContent
        operation={[<Button
            type="default"
            key="goback"
            onClick={() => history.go(-1)
            }>返回</Button>]}>
        <DetailTitle title="安全库存设置" operation={[<Button type="primary" ghost key="new" onClick={() => {
            setVisible(true)
            setEditRow("new")
        }}>添加</Button>]} />
        <SearchTable
            path='/tower-storage/safetyStock'
            columns={[...columns as any]}
            searchFormItems={[]} />
        <Modal
            width={1101}
            className="public_modal_input"
            title='编辑'
            visible={visible}
            onOk={handleSubmit}
            maskClosable={false}
            onCancel={closeModal}
            cancelText="取消"
            okText="确定"
        >
            <BaseInfo form={form} col={2} edit columns={setting.map((item: any) => {
                return item
            })} dataSource={editRow === "new" ? {} : editRow || {}} />
        </Modal>
    </DetailContent >)
};