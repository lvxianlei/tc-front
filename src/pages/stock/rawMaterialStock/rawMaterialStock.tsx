import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { useHistory } from 'react-router';
import { Input, Select, Modal, message, Spin, Button, Upload, InputNumber } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import { listPage } from "./rowMaterial.json"
import { materialStandardOptions, materialTextureOptions } from '../../../configuration/DictionaryOptions';
import { Attachment, AttachmentRef, SearchTable as Page } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { exportDown } from '../../../utils/Export';
import AuthUtil from '../../../utils/AuthUtil';
import '../StockPublicStyle.less';
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
                resole(false as any)
                return false;
            }
            source.map((item: any) => fieldIds.push(item.id));
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/receiveStock/attach`, {
                attachType: type,
                id,
                fieldIds
            })
            resole(true as any)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit: saveRun }), [saveRun, attachRef.current.getDataSource])

    return <Spin spinning={loading}>
        <Attachment dataSource={data} edit title="附件" ref={attachRef} style={{ margin: "0px" }} marginTop={false} />
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
        const res = await receiveRef.current.onSubmit()
        if (!(res as any)) {
            setSaveLoading(false)
            return;
        }
        setSaveLoading(false)
        message.success("保存成功...")
        setVisible(false)
    }

    const handleDownload = () => {
        exportDown(`/tower-storage/materialStock/masterplate/export`)
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
                    dataIndex: 'index',
                    width: 50,
                    fixed: "left",
                    render: (text: any, item: any, index: any) => <span>{index + 1}</span>
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
                extraOperation={<>
                    <Upload
                        accept=".xls,.xlsx"
                        action={() => {
                            const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                            return baseUrl + '/tower-storage/materialStock/masterplate/import'
                        }}
                        headers={
                            {
                                'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                                'Tenant-Id': AuthUtil.getTenantId(),
                                'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                            }
                        }
                        showUploadList={false}
                        onChange={(info) => {
                            if (info.file.response && !info.file.response?.success) {
                                message.warning(info.file.response?.msg)
                            } else if (info.file.response && info.file.response?.success) {
                                message.success('导入成功！');
                                history.go(0)
                            }
                        }}
                    >
                        <Button type="primary" ghost>导入</Button>
                    </Upload>
                    <Button type="primary" ghost onClick={handleDownload}>模版下载</Button>
                    <div>数量合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{data?.num}</span> 重量合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{data?.weight}</span></div>
                </>
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
                        name: 'structureTexture',
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
                        name: 'materialStandard',
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
                        children: <InputNumber />
                    },
                    {
                        name: 'width',
                        label: '宽度',
                        children: <InputNumber />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: '模糊查询项',
                        children: <Input width={100} maxLength={200} placeholder="请输入规格/品名" />
                    }
                ]}
            />
        </>
    )
}

