/***
 * 税率参数配置
 * author：mschange
 * 时间：2022/05/14
 */
 import React, { useState, useEffect, useRef } from 'react';
 import { SearchTable as Page } from '../../common';
 import { FixedType } from 'rc-table/lib/interface'
import { useHistory } from 'react-router-dom';
import { Button, message, Modal } from 'antd';
import AddTaxRateModal from "./AddTaxRateModal";
import {
    baseColumn
} from "./taxRate.json";
interface EditRefProps {
    id?: string
    onSubmit: () => void
    resetFields: () => void
}
 
 export default function TaxRate(): React.ReactNode {
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [id, setId] = useState<string>();
    const addRef = useRef<EditRefProps>();
    // 新增回调
    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onSubmit()
            message.success("完善纸质单号成功...")
            setVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })
     return (
        <>
            <Page
                path="/tower-storage/receiveStock"
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...(baseColumn as any),
                    {
                        title: '操作',
                        dataIndex: 'key',
                        width: 160,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <>
                                <Button className='btn-operation-link' type="link" onClick={() => {
                                    setVisible(true);
                                    setId(record.id);
                                }}>编辑</Button>
                            </>
                        )
                    }
                ]}
                searchFormItems={[]}
            />
            <Modal
                title={'设置材料税率'}
                visible={visible}
                width={500}
                maskClosable={false}
                onCancel={() => {
                    addRef.current?.resetFields();
                    setVisible(false);
                }}
                footer={[
                    <Button key="submit" type="primary" onClick={() => handleOk()}>
                        保存
                    </Button>,
                    <Button key="back" onClick={() => {
                        addRef.current?.resetFields();
                        setVisible(false);
                    }}>
                        取消
                    </Button>
                ]}
            >
                <AddTaxRateModal ref={addRef} id={id} />
            </Modal>
        </>
     )
 }