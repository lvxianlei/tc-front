import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { Button, Input, Select, Form, Row, Modal, message, Spin } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import { listPage } from "./rowMaterial.json"
import '../StockPublicStyle.less';
import { materialStandardOptions, materialTextureOptions } from '../../../configuration/DictionaryOptions';
import { Attachment, AttachmentRef, Page } from '../../common';
import useRequest from '@ahooksjs/use-request';
interface ReceiveStrokAttachProps {
    type: 1 | 2
    id: string
}
const ReceiveStrokAttach = forwardRef(({ type, id }: ReceiveStrokAttachProps, ref): JSX.Element => {
    const attachRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/attach?attachType=${type}&id=${id}`)
            resole(result?.attachInfoDtos || [])
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const { run: saveRun } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            // 对上传数据进行处理
            const fieldIds: any = [],
                source = attachRef.current.getDataSource();
            if (source.length < 1) {
                message.error("请您先上传附件！");
                return false;
            }
            source.map((item: any) => fieldIds.push(item.id));
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/attach`, {
                attachType: type,
                id,
                fieldIds
            })
            resole(result?.attachInfoDtos || [])
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit: saveRun }), [saveRun, attachRef.current.getDataSource])

    return <Spin spinning={loading}>
        <Attachment title={false} dataSource={data} edit ref={attachRef} style={{margin: "0px"}} marginTop={false} />
    </Spin>
})
    
export default function RawMaterialStock(): React.ReactNode {
    const history = useHistory()
    const [attchType, setAttachType] = useState<1 | 2>(1)
    const [detailId, setDetailId] = useState<string>("")
    const [visible, setVisible] = useState<boolean>(false)
    const [saveLoding, setSaveLoading] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState({})
    const receiveRef = useRef<{ onSubmit: () => void }>({ onSubmit: () => { } })
    const { data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const [warehouseList, askPrice, classify] = await Promise.all<any>([
                RequestUtil.get(`/tower-storage/warehouse/tree?type=0`),
                RequestUtil.get(`/tower-storage/materialStock/getMaterialStockStatics`),
                RequestUtil.get(`/tower-system/materialCategory/category`)
            ])
            resole({ warehouseList, ...askPrice, classify })
        } catch (error) {
            reject(error)
        }
    }))
    
    const handleAttachOk = async () => {
        setSaveLoading(true)
        await receiveRef.current.onSubmit()
        setSaveLoading(false)
        message.success("保存成功...")
        setVisible(false)
    }
    return (
        <>
            <Modal
                destroyOnClose
                visible={visible}
                title={attchType === 1 ? "质保单" : "质检单"}
                confirmLoading={saveLoding}
                onOk={handleAttachOk}
                okText="保存"
                onCancel={() => {
                    setAttachType(1)
                    setDetailId("")
                    setVisible(false)
                }}>
                <ReceiveStrokAttach type={attchType} id={detailId} ref={receiveRef} />

            </Modal>
            <Page
                path={`/tower-storage/materialStock`}
                exportPath={`/tower-storage/materialStock`}
                columns={[{
                    title: '序号',
                    dataIndex: 'id',
                    width: 50,
                    render: (text: any, item: any, index: any) => {
                        return <span>{index + 1}</span>
                    }
                },
                ...listPage,
                {
                    title: '操作',
                    dataIndex: 'key',
                    width: 120,
                    fixed: 'right' as FixedType,
                    render: (_: undefined, record: any): React.ReactNode => (
                        <>
                            <a style={{ marginRight: 12 }} onClick={() => {
                                setAttachType(1)
                                setDetailId(record.id)
                                setVisible(true)
                            }}>质保单</a>
                            <a style={{ marginRight: 12 }} onClick={() => {
                                setAttachType(2)
                                setDetailId(record.id)
                                setVisible(true)
                            }}>质检单</a>
                        </>
                    )
                }]}
                extraOperation={
                    <div>数量合计：<span style={{marginRight: 12, color: "#FF8C00"}}>{data?.quantity}</span> 重量合计：<span style={{marginRight: 12, color: "#FF8C00"}}>{data?.weight}</span></div>
                }
                filterValue={filterValue}
                onFilterSubmit={(value: any) => {
                    if (value.length) {
                        value.lengthMin = value.length.lengthMin
                        value.lengthMax = value.length.lengthMax
                    }
                    setFilterValue(value)
                    return value
                }}
                searchFormItems={[
                    {
                        name: 'warehouseId',
                        label: '仓库',
                        children: <Select style={{ width: "100px" }} defaultValue={""}>
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                data?.warehouseList?.map((item: { id: string, name: string }) => <Select.Option
                                    value={item.id}
                                    key={item.id}>{item.name}</Select.Option>)
                            }
                        </Select>
                    },
                    {
                        name: 'materialTexture',
                        label: '材质',
                        children: <Select style={{ width: "100px" }} defaultValue={""}>
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                materialTextureOptions?.map((item: { id: string, name: string }) => <Select.Option
                                    value={item.name}
                                    key={item.id}>{item.name}</Select.Option>)
                            }
                        </Select>
                    },
                    {
                        name: 'materialName',
                        label: '品名',
                        children: <Input width={100} maxLength={200} placeholder="请输入品名" />
                    },
                    {
                        name: 'standard',
                        label: '标准',
                        children: <Select style={{ width: "100px" }} defaultValue={""}>
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                materialStandardOptions?.map((item: { id: string, name: string }) => <Select.Option
                                    value={item.id}
                                    key={item.id}>{item.name}</Select.Option>)
                            }
                        </Select>
                    },
                    {
                        name: 'classifyId',
                        label: '分类',
                        children: <Select style={{ width: "100px" }} defaultValue={""}>
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                data?.classify?.map((item: { materialCategoryId: string, materialCategoryName: string }) => <Select.Option
                                    value={item.materialCategoryId}
                                    key={item.materialCategoryId}>{item.materialCategoryName}</Select.Option>)
                            }
                        </Select>
                    },
                    {
                        name: 'length',
                        label: '长度',
                        children: <Row>
                            <Form.Item name={["length", "lengthMin"]} style={{ width: 100 }}>
                                <Select style={{ width: 100 }} placeholder="最小长度">
                                    <Select.Option value={0} key={0}>0</Select.Option>
                                    <Select.Option value={1000} key={1}>1</Select.Option>
                                    <Select.Option value={2000} key={2}>2</Select.Option>
                                    <Select.Option value={3000} key={3}>3</Select.Option>
                                    <Select.Option value={4000} key={4}>4</Select.Option>
                                    <Select.Option value={5000} key={5}>5</Select.Option>
                                    <Select.Option value={6000} key={6}>6</Select.Option>
                                    <Select.Option value={7000} key={7}>7</Select.Option>
                                    <Select.Option value={8000} key={8}>8</Select.Option>
                                    <Select.Option value={9000} key={9}>9</Select.Option>
                                    <Select.Option value={10000} key={10}>10</Select.Option>
                                    <Select.Option value={11000} key={11}>11</Select.Option>
                                    <Select.Option value={12000} key={12}>12</Select.Option>
                                    <Select.Option value={13000} key={13}>13</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name={["length", "lengthMax"]} style={{ width: 100 }}>
                                <Select style={{ width: 100 }} placeholder="最大长度">
                                    <Select.Option value={0} key={0}>0</Select.Option>
                                    <Select.Option value={1000} key={1}>1</Select.Option>
                                    <Select.Option value={2000} key={2}>2</Select.Option>
                                    <Select.Option value={3000} key={3}>3</Select.Option>
                                    <Select.Option value={4000} key={4}>4</Select.Option>
                                    <Select.Option value={5000} key={5}>5</Select.Option>
                                    <Select.Option value={6000} key={6}>6</Select.Option>
                                    <Select.Option value={7000} key={7}>7</Select.Option>
                                    <Select.Option value={8000} key={8}>8</Select.Option>
                                    <Select.Option value={9000} key={9}>9</Select.Option>
                                    <Select.Option value={10000} key={10}>10</Select.Option>
                                    <Select.Option value={11000} key={11}>11</Select.Option>
                                    <Select.Option value={12000} key={12}>12</Select.Option>
                                    <Select.Option value={13000} key={13}>13</Select.Option>
                                </Select>
                            </Form.Item>
                        </Row>
                    },
                    {
                        name: 'spec',
                        label: '规格',
                        children: <Input width={100} maxLength={200} placeholder="请输入规格" />
                    }
                ]}
            />
        </>
    )
}