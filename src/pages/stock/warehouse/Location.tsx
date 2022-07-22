/**
 * 库位设置
 * time: 2022/07/21
 * author: mschange
 */
import React, { useEffect, useState } from 'react';
import { Modal, message, Form, Input, InputNumber, Table, Button } from 'antd';
import RequestUtil from "../../../utils/RequestUtil"
import useRequest from '@ahooksjs/use-request';
import { ColumnType, FixedType } from 'rc-table/lib/interface';
import { CommonTable } from '../../common';
import "./location.less"
interface Props {
    isModal: boolean,
    cancelModal: Function,
    id: string | null,
    warehouseDetails: any[]
    name: string
}

const Location = (props: Props) => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [form] = Form.useForm();
    let [count, setCount] = useState<number>(1);

    useEffect(() => {
        if (props.isModal) {
            props.warehouseDetails?.map((item: any) => item["source"] = "1");
            const result = props.warehouseDetails.filter((item: any) => item.type === 1)
            setDataSource(result || []);
        }
    }, [props.isModal])

    const columns = [
        {
            key: 'id',
            title: '序号',
            dataIndex: 'id',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <>
                    <span>{index + 1}</span>
                    <Form.Item
                        name={['data', index, "id"]}
                        initialValue={_}
                        style={{ display: "none" }}
                    >
                        <Input
                            size="small"
                        />
                    </Form.Item>
                </>
            )
        },
        {
            key: 'locatorName',
            title: '库位',
            editable: true,
            dataIndex: 'locatorName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => {
                return record?.source === "1" ?
                        <Form.Item
                            name={['data', index, "locatorName"]}
                            style={{width: 300}}>
                                <span>{record?.locatorName}</span>
                        </Form.Item>
                    : <Form.Item
                            name={['data', index, "locatorName"]}
                            style={{width: 300}}
                            rules={[{
                                required: true,
                                message: '请输入库位'
                            }]}
                        >
                            <Input size="small" maxLength={10} onChange={(e) => rowChange("locatorName", record.id, e.target.value)} />
                        </Form.Item>
            }
        }
    ];

    const rowChange = (key: string, id: string, val: any) => {
        const result = dataSource,
            v = result.filter((item: any) => item.id === id),
            index = result.findIndex((item: any) => item.id === id);
        result[index][key] = val;
        setDataSource(result)
    }

    const { loading: saveLoading, run } = useRequest<{ [key: string]: any }>((params: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/warehouse/saveWarehouseDetail`, params)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: deleteRun } = useRequest<{ [key: string]: any }>((params: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-storage/warehouse/warehouseDetailById?id=${params.id}`)
            if (result) {
                const result = dataSource;
                let v = result.filter((item: any) => item.id !== params.id);
                setDataSource(v.slice(0));
            }
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const submit = async () => {
        try {
            const data = await form.validateFields();
            dataSource?.map((item: any) => {
                item["type"] = 1;
                item["warehouseId"] = props.id;
                item["id"] = item?.source === "1" ? item.id : ""
            })
            await run(dataSource)
            message.success("保存成功...")
            props.cancelModal({code: 1})
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Modal
                className='locationWrapper'
                title={"库位设置"}
                visible={props.isModal}
                maskClosable={false}
                destroyOnClose
                onOk={() => {
                    submit()
                }}
                onCancel={() => {
                    form.resetFields()
                    setDataSource([])
                    props.cancelModal({code: 0})
                }}
                okText='保存'
                cancelText='取消'
            >
                <div className='buttonWrapper'>
                    <p>
                        <span>仓库:</span>
                        <span>{ props.name }</span>
                    </p>
                    <Button
                        type='primary'
                        ghost
                        onClick={() => {
                            console.log(dataSource, "====>>>")
                            setDataSource([
                                ...dataSource,
                                {
                                    id: count + "",
                                    source: "2",
                                    locatorName: ""
                                }
                            ].slice(0))
                            setCount(count + 1)
                        }
                    }>添加</Button>
                </div>
                <Form form={form}>
                    <CommonTable
                        columns={[...columns as any, {
                            key: 'operation',
                            title: '操作',
                            dataIndex: 'operation',
                            width: 20,
                            render: (_: number, record: any, index: number): React.ReactNode => (
                                <>
                                    <Button type="link"
                                        onClick={()=>{
                                            /**
                                             * 如果source为1需调用接口 为2不用
                                             */
                                            if (record.source === "1") {
                                                deleteRun({id: record.id})
                                            } else {
                                                const result = dataSource;
                                                let v = result.filter((item: any) => item.id !== record.id);
                                                setDataSource(v.slice(0));
                                            }
                                        }}
                                    >删除</Button>
                                </>
                            )
                        }]}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </Form>
            </Modal>
        </div>
    )
}

export default Location;