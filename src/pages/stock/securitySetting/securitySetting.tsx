/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Pagination, TableColumnProps, Table, Modal, Input, message } from 'antd'
import RequestUtil from '../../../utils/RequestUtil';
const SecuritySetting = (): React.ReactNode => {
    // const history = useHistory()
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (text, item, index) => {
                return <span>{index + 1}</span>
            }
        },
        {
            key: 'productName',
            title: '品名',
            dataIndex: 'productName',
        },
        {
            key: 'projectNumber',
            title: '标准',
            dataIndex: 'projectNumber'
        },
        {
            key: 'spec',
            title: '规格',
            dataIndex: 'spec',
        },
        {
            key: 'material_texture',
            title: '材质',
            dataIndex: 'material_texture'
        },
        {
            key: 'safetyStock',
            title: '安全库存（吨）',
            dataIndex: 'safetyStock'
        },
        {
            key: 'alarmStock',
            title: '告警库存（吨）',
            dataIndex: 'alarmStock'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_text: any, item: any, index: number): React.ReactNode => {
                return (
                    <div>
                        <span
                            className='yello'
                            onClick={() => {
                                setIsModal(true)
                                setId(item.id)
                            }}
                        >编辑</span>
                    </div>
                )
            }
        }
    ]
    const [columnsData, setColumnsData] = useState<any[]>([]);
    const [isModal, setIsModal] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [size, setSize] = useState<number>(10);
    const [current, setCurrent] = useState<number>(1);
    const [id, setId] = useState<string | null>(null);
    const [safetyStock, setSafetyStock] = useState<string>('');
    const [alarmStock, setAlarmStock] = useState<string>('');
    useEffect(() => {
        getColumnsData()
    }, [current, size]);
    // 获取列表
    const getColumnsData = async () => {
        const data: any = await RequestUtil.get('/tower-storage/safetystock', {
            current,
            size,
        })
        setTotal(data.data)
        setColumnsData(data.records)
    }
    // 编辑
    const submit = async () => {
        await RequestUtil.put('/tower-storage/safetystock', {
            id,
            safetyStock,
            alarmStock,
        })
        message.success('操作成功')
        closeModal()
    }
    // 关闭弹窗
    const closeModal = () => {
        setIsModal(false)
        setId(null)
        setSafetyStock('')
        setAlarmStock('')
    }
    return (
        <div className='public_page'>
            <div className='public_content'>
                <div className='func'>
                    <Button
                        className='func_item'
                        type='primary'
                    >导出</Button>
                </div>
                <Table
                    className='public_table'
                    scroll={{ x: true }}
                    columns={columns}
                    dataSource={columnsData}
                    pagination={false}
                    size='small'
                />
                <div className='page_content'>
                    <Pagination
                        className='page'
                        showSizeChanger
                        showQuickJumper
                        total={total}
                        pageSize={size}
                        current={current}
                        onChange={(page: number, size: any) => {
                            setCurrent(page)
                            setSize(size)
                        }}
                    />
                </div>
            </div>
            {/* 编辑弹框 */}
            <Modal
                className="public_modal_input"
                title='编辑'
                visible={isModal}
                onOk={() => { submit() }}
                maskClosable={false}
                onCancel={() => {
                    closeModal()
                }}
                cancelText="取消"
                okText="确定"
            >
                <div className="edit-item">
                    <span className="tip">安全库存(吨)：</span>
                    <Input
                        className="input"
                        placeholder="请输入"
                        value={safetyStock}
                        maxLength={50}
                        onChange={(ev) => { setSafetyStock(ev.target.value.trim()) }}
                    />
                </div>
                <div className="edit-item">
                    <span className="tip">告警库存(吨)：</span>
                    <Input
                        className="input"
                        placeholder="请输入"
                        value={alarmStock}
                        maxLength={50}
                        onChange={(ev) => { setAlarmStock(ev.target.value.trim()) }}
                    />
                </div>
            </Modal>
        </div>
    )
}

export default SecuritySetting;