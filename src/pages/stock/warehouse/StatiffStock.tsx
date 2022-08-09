/**
 * 区位设置
 * time: 2022/07/21
 * author: mschange
 */
import React, { useEffect, useState } from 'react';
import { Modal, message, Form, Input, InputNumber, Table, Button, Select } from 'antd';
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

const StatiffStock = (props: Props) => {
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [form] = Form.useForm();
    let [count, setCount] = useState<number>(1);
    const [flag, setFlag] = useState<boolean>(false);

    useEffect(() => {
        if (props.isModal) {
            props.warehouseDetails?.map((item: any) => item["source"] = "1");
            const result = props.warehouseDetails.filter((item: any) => item.type !== 0)
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
            key: 'segmentName',
            title: '库区',
            editable: true,
            dataIndex: 'segmentName',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => {
                return record?.source === "1" ?
                        <Form.Item
                            name={['data', index, "segmentName"]}
                            style={{width: 150}}
                            initialValue={record.reservoirName}>
                                <span>{record?.reservoirName}</span>
                        </Form.Item>
                    : <Form.Item
                            name={['data', index, "segmentName"]}
                            initialValue={record.segmentName}
                            style={{width: 150}}
                            rules={[{
                                required: true,
                                message: '请选择库位'
                            },]}
                        >
                        <Select placeholder="请选择库位" onChange={(val) => rowChange("segmentName", record.id, val)}>
                                {
                                    props.warehouseDetails?.filter((v: any) => v.type === 0)?.map((item: any) => <Select.Option key={"1"} value={`${item.reservoirName}_${item.id}`}>{ item.reservoirName }</Select.Option>)
                                }
                            </Select>
                        </Form.Item>
            }
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
                            style={{width: 150}}
                            initialValue={record.locatorName}>
                                <span>{record?.locatorName}</span>
                        </Form.Item>
                    : <Form.Item
                            name={['data', index, "locatorName"]}
                            initialValue={record.locatorName}
                            style={{width: 150}}
                            rules={[{
                                required: true,
                                message: '请输入段号'
                            },]}
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
                // 记录从表里面删除了
                setFlag(true);
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
                item["reservoirName"] = item?.source === "1" ? item.reservoirName : item.segmentName.split("_")[0];
                item["reservoirId"] = item?.source === "1" ? item.reservoirId : item.segmentName.split("_")[1];
                item["id"] = item?.source === "1" ? item.id : "";
                item["name"] = props.name;
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
                title={"区位设置"}
                visible={props.isModal}
                destroyOnClose
                maskClosable={false}
                onOk={() => {
                    submit()
                }}
                onCancel={() => {
                    setDataSource([])
                    form.resetFields()
                    let code = flag ? 1 : 0
                    props.cancelModal({code})
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
                            setDataSource([
                                ...dataSource,
                                {
                                    id: count + "",
                                    source: "2",
                                    segmentName: "",
                                    locatorName: ""
                                }
                            ])
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

export default StatiffStock;