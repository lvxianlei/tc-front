/***
 * 新修改的原材料入库
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/06
 */
import React, { useState, useRef } from 'react';
import { Input, Select, DatePicker, Button, Modal, message } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SearchTable as Page } from '../../common';
import { Link, useHistory } from 'react-router-dom';
import { baseColumn } from "./data.json";
// 引入新增纸质单号
import PaperOrderModal from './PaperOrderModal';
import CreatePlan from "./CreatePlan";
interface EditRefProps {
    id?: string
    onSubmit: () => void
    resetFields: () => void
}
export default function RawMaterialWarehousing(): React.ReactNode {
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [id, setId] = useState<string>();
    const addRef = useRef<EditRefProps>();
    const [isOpenId, setIsOpenId] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState<any>({
        fuzzyQuery: "",
        receiveStatus: "",
        startStatusUpdateTime: "",
        endStatusUpdateTime: "",
    });

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = `${formatDate[0]} 00:00:00`
            value.endStatusUpdateTime = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        setFilterValue({ ...value })
        return value
    }
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

    const handleCreate = (options: any) => {
        if (options?.code === 1) {
            history.go(0);
        }
        setIsOpenId(false);
    }

    return (
        <>
            <Page
                path="/tower-storage/warehousingEntry"
                exportPath={"/tower-storage/warehousingEntry"}
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
                        width: 80,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <>
                                <Link className='btn-operation-link' to={`/stock/rawMaterialWarehousing/detail/${record.id}`}>明细</Link>
                            </>
                        )
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                extraOperation={
                    <>
                        <Button type='primary' ghost onClick={() => setIsOpenId(true)}>创建</Button>
                    </>
                }
                searchFormItems={[
                    {
                        name: 'startRefundTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'receiveStatus',
                        label: '状态',
                        children: (
                            <Select placeholder="请选择状态" style={{ width: "140px" }}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="0">待完成</Select.Option>
                                <Select.Option value="1">已完成</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'warehousingType',
                        label: '入库类型',
                        children: (
                            <Select placeholder="请选择入库类型" style={{ width: "140px" }}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="1">采购入库</Select.Option>
                                <Select.Option value="2">盘点入库</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input placeholder="请输入收货单号/供应商/合同编号/联系人/联系电话进行查询" style={{ width: 300 }} />
                    }
                ]}
            />
            <Modal
                title={'输入'}
                visible={visible}
                width={500}
                maskClosable={false}
                onCancel={() => {
                    addRef.current?.resetFields();
                    setVisible(false);
                }}
                footer={[
                    <Button key="submit" type="primary" onClick={() => handleOk()}>
                        提交
                    </Button>,
                    <Button key="back" onClick={() => {
                        addRef.current?.resetFields();
                        setVisible(false);
                    }}>
                        取消
                    </Button>
                ]}
            >
                <PaperOrderModal ref={addRef} id={id} />
            </Modal>

            <CreatePlan
                visible={isOpenId}
                handleCreate={handleCreate}
            />
        </>
    )
}