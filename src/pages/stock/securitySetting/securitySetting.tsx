/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { Button, TableColumnProps, Modal, Input, message } from 'antd'
import RequestUtil from '../../../utils/RequestUtil';
import { useHistory } from 'react-router-dom';
import { DetailContent, SearchTable } from '../../common';

export default (): React.ReactNode => {
    const history = useHistory()
    const columns: TableColumnProps<object>[] = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a, _b, index) => <span>{index + 1}</span>
        },
        {
            title: '品名',
            dataIndex: 'materialName'
        },
        {
            title: '标准',
            dataIndex: 'materialStandard'
        },
        {
            title: '规格',
            dataIndex: 'structureSpec'
        },
        {
            title: '材质',
            dataIndex: 'structureTexture'
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
                                setSafetyStock(item.safetyStock)
                                setAlarmStock(item.alarmStock)
                                setId(item.id)
                            }}
                        >编辑</span>
                    </div>
                )
            }
        }
    ]
    const [isModal, setIsModal] = useState<boolean>(false);
    const [id, setId] = useState<string | null>(null);
    const [safetyStock, setSafetyStock] = useState<string>('');
    const [alarmStock, setAlarmStock] = useState<string>('');

    // 编辑
    const submit = async () => {
        await RequestUtil.put(`/tower-storage/safetyStock/${id}?safetyStock=${safetyStock}&alarmStock=${alarmStock}`, {
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
    return (<DetailContent
        operation={[<Button
            type="default"
            key="goback"
            onClick={() => history.go(-1)
            }>返回</Button>]}>
        <SearchTable
            path='/tower-storage/safetyStock'
            columns={[...columns as any]}
            searchFormItems={[]} />
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
    </DetailContent >)
};