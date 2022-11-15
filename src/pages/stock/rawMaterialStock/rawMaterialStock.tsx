import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { useHistory } from 'react-router';
import { Input, Select, Modal, message, Spin, Button, Upload, InputNumber, DatePicker } from 'antd';
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
    const [num, setNum] = useState<any>({});
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
    const [ReservoirArea, setReservoirArea] = useState<any[]>([]);//入库库区数据
    const [Location, setLocation] = useState<any[]>([]);//入库库位数据
    // 获取仓库/库区/库位
    const getWarehousing = async (id?: any, type?: any) => {
        const data: any = await RequestUtil.get(`/tower-storage/warehouse/tree`, {
            id,
            type,
        });
        switch (type) {
            case 1:
                setReservoirArea(data)
                break;
            case 2:
                setLocation(data)
                break;
            default:
                break;
        }
    }
    //统计
    const { data: totalNum, run } = useRequest((value: Record<string, any>) => new Promise(async (resole, reject) => {
        const data:any = await RequestUtil.get<any>(`/tower-storage/materialStock/getMaterialStockStatics`, { ...filterValue,...value })
        setNum(data)
        resole(data)
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
                title={attchType === 1 ? "质检单" : "质保单"}
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
                ...listPage as any,
                {
                    title: '操作',
                    dataIndex: 'key',
                    width: 120,
                    fixed: 'right' as FixedType,
                    render: (_: undefined, record: any): React.ReactNode => (
                        <>
                            <a style={{ marginRight: 12 }} onClick={() => {
                                setAttachType(2)
                                setDetailId(record.id)
                                setVisible(true)
                            }}>质保单</a>
                            <a style={{ marginRight: 12 }} onClick={() => {
                                setAttachType(1)
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
                    <span>
                        <span >数量合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.num||0}</span></span>
                        <span >重量合计（吨）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.weight||0}</span></span>
                        <span >含税金额合计（元）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.totalTaxPrice||0}</span></span>
                        <span >不含税金额合计（元）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.totalPrice||0}</span></span>
                    </span>
                </>
                }
                filterValue={filterValue}
                onFilterSubmit={(value: any) => {
                    if (value.time) {
                        const formatDate = value.time.map((item: any) => item.format("YYYY-MM-DD"))
                        value.startCreateTime = `${formatDate[0]} 00:00:00`
                        value.endCreateTime = `${formatDate[1]} 23:59:59`
                        delete value.time
                    }
                    if (value.length) {
                        value.lengthMin = value.length.lengthMin
                        value.lengthMax = value.length.lengthMax
                    }
                    setFilterValue(value)
                    run(value)
                    return value
                }}
                searchFormItems={[
                    {
                        name: 'time',
                        label: '入库日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'materialCategoryName',
                        label: '分类',
                        children: <Select style={{ width: "100px" }} defaultValue={""}>
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                data?.classify?.map((item: { materialCategoryId: string, materialCategoryName: string }) => <Select.Option
                                    value={item.materialCategoryName}
                                    key={item.materialCategoryId}>{item.materialCategoryName}</Select.Option>)
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
                        name: 'structureSpec',
                        label: '规格',
                        children: <Input width={100} maxLength={200} placeholder="请输入规格" />
                    },
                    {
                        name: 'materialName',
                        label: '品名',
                        children: <Input width={100} maxLength={200} placeholder="请输入品名" />
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
                        name: 'furnaceBatchNumber',
                        label: '炉批号',
                        children: <Input width={100}  placeholder="请输入炉批号"/>
                    },
                    {
                        name: 'warrantyNumber',
                        label: '质保书号',
                        children: <Input width={100}  placeholder="请输入炉批号"/>
                    },
                    {
                        name: 'warehouseId',
                        label: '仓库',
                        children: <Select style={{ width: "100px" }} defaultValue={""} onChange={(val) => {  getWarehousing(val, 1) }}>
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                data?.warehouseList?.map((item: { id: string, name: string }) => <Select.Option
                                    value={item.id}
                                    key={item.id}>{item.name}</Select.Option>)
                            }
                        </Select>
                    },
                    {
                        name: 'reservoirId',
                        label: '库区',
                        children: <Select
                            className="select"
                            style={{ width: "100px" }}
                            onChange={(val:any) => {  getWarehousing(val, 2) }}
                        >
                            {
                                ReservoirArea.map((item, index) => {
                                    return (
                                        <Select.Option
                                            value={item.id}
                                        >
                                            {item.name}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>
                    },
                    {
                        name: 'locatorId',
                        label: '库位',
                        children: <Select
                            className="select"
                            style={{ width: "100px" }}
                        >
                            {
                                Location.map((item, index) => {
                                    return (
                                        <Select.Option
                                            value={item.id}
                                        >
                                            {item.name}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>
                    },
                    {
                        name: 'fuzzyQuery',
                        label: '模糊查询项',
                        children: <Input width={100} maxLength={200} placeholder="请输入收货单号/收货批次" />
                    }
                ]}
            />
        </>
    )
}

