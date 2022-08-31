/***
 * 新修改的原材料出库详情
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/11
 */
import React, { useState } from 'react';
import { Input, Select, DatePicker, Button, Modal, message, Table } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SearchTable as Page, IntgSelect } from '../../../common';
import { useHistory, useParams } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../../utils/RequestUtil';
import { materialStandardOptions, materialTextureOptions } from '../../../../configuration/DictionaryOptions';
import { baseColumn } from "./detail.json";

import '../../StockPublicStyle.less';
import './detail.less';

export default function RawMaterialWarehousing(): React.ReactNode {
    // 标准
    const standardEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    // 材质 
    const materialEnum = materialTextureOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const [supplierListdata, setSupplierListdata] = useState<any[]>([{}]);//详情-供应商信息列表数据
    const [WarehousingListdata, setWarehousingListdata] = useState<any[]>([{}]);//详情-入库信息列表数据
    const [ExWarehousingListdata, setExWarehousingListdata] = useState<any[]>([{}]);//详情-出库信息列表数据
    const [OutLibraryListdata, setOutLibraryListdata] = useState<any[]>([{}]);//出库-原材料信息列表数据
    const [ApplyListdata, setApplyListdata] = useState<any[]>([{}]);//出库-缺料申请-信息列表数据
    const [isDetailModal, setIsDetailModal] = useState<boolean>(false);//详情弹框显示
    const [isOutLibraryModal, setIsOutLibraryModal] = useState<boolean>(false);//出库弹框显示
    const [isApplyModal, setIsApplyModal] = useState<boolean>(false);//出库弹框显示
    const [requirement, setRequirement] = useState<number | string>('');//出库-弹框需求量
    const [OutboundId, setOutboundId] = useState<number | string>('');//出库-弹框-需要的列表id

    const supplierColumns = [
        {
            title: '收货单号',
            dataIndex: 'receiveNumber',
            width: 120,
        },
        {
            title: '供应商',
            dataIndex: 'supplierName',
            width: 120,
        }, {
            title: '联系人',
            dataIndex: 'contactsUser',
            width: 120,
        }, {
            title: '联系电话',
            dataIndex: 'contactsPhone',
            width: 160,
        }, {
            title: '合同编号',
            dataIndex: 'contractNumber',
            width: 120,
        }
    ];//详情-供应商列表表头
    const WarehousingColumns = [
        {
            title: '材质名称',
            dataIndex: 'materialName',
            width: 120,
        },
        {
            title: '标准',
            dataIndex: 'materialStandardName',
            width: 120,
        }, {
            title: '规格',
            dataIndex: 'structureSpec',
            width: 120,
        }, {
            title: '材质',
            dataIndex: 'structureTexture',
            width: 160,
        }, {
            title: '长度',
            dataIndex: 'length',
            width: 120,
        }, {
            title: '宽度',
            dataIndex: 'width',
            width: 120,
        }, {
            title: '入库人',
            dataIndex: 'receiveStockUser',
            width: 120,
        }, {
            title: '入库时间',
            dataIndex: 'receiveStockTime',
            width: 160,
        }, {
            title: '炉批号',
            dataIndex: 'furnaceBatch',
            width: 120,
        }, {
            title: '仓库',
            dataIndex: 'warehouseName',
            width: 120,
        }, {
            title: '库位',
            dataIndex: 'locatorName',
            width: 120,
        }, {
            title: '库区',
            dataIndex: 'reservoirName',
            width: 120,
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: 120,
        }
    ];//详情-入库表头
    const ExWarehousingColumns = [
        {
            title: '领料编号',
            dataIndex: 'pickingNumber',
            width: 120,
        },
        {
            title: '任务编号',
            dataIndex: 'taskNumber',
            width: 120,
        }, {
            title: '生产批次',
            dataIndex: 'productionBatchNumber',
            width: 120,
        }, {
            title: '申请人',
            dataIndex: 'applyStaffName',
            width: 160,
        }, {
            title: '出库人',
            dataIndex: 'outStockUserName',
            width: 120,
        }, {
            title: '出库时间',
            dataIndex: 'outStockTime',
            width: 120,
        },
    ];//详情-出库表头
    const OutLibraryColumns = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '所在仓库',
            dataIndex: 'warehouseName',
            width: 100,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '收货批次',
            dataIndex: 'receiveBatchNumber',
            width: 100,
        }, {
            title: '库位',
            dataIndex: 'locatorName',
            width: 100,
        }, {
            title: '区位',
            dataIndex: 'reservoirName',
            width: 100,
        }, {
            title: '物料编码',
            dataIndex: 'materialCode',
            width: 100,
        }, {
            title: '分类',
            dataIndex: 'materialCategoryName',
            width: 100,
        }, {
            title: '标准',
            dataIndex: 'materialStandardName',
            width: 100,
        }, {
            title: '品名',
            dataIndex: 'materialName',
            width: 100,
        }, {
            title: '材质',
            dataIndex: 'structureTexture',
            width: 100,
        }, {
            title: '规格',
            dataIndex: 'structureSpec',
            width: 100,
        }, {
            title: '长度（mm）',
            dataIndex: 'length',
            width: 100,
        }, {
            title: '宽度（mm）',
            dataIndex: 'width',
            width: 100,
        }, {
            title: '数量',
            dataIndex: 'num',
            width: 100,
        }, {
            title: '重量（吨）',
            dataIndex: 'weight',
            width: 100,
        }, {
            title: '库存数量',
            dataIndex: 'num',
            width: 100,
        }, {
            title: '出库数量',
            dataIndex: 'standard',
            width: 100,
            fixed: 'right' as FixedType,
            render: (text: any, item: any, index: any) => {
                return (
                    <Input
                        placeholder="请输入"
                        value={item.outboundQuantity}
                        onChange={(e) => { inputChange(e, item, index, 'OutLibrary') }}
                    ></Input>
                )
            }
        },
    ];//出库弹框-原材料信息表头
    const ApplyColumns = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '物料编码',
            dataIndex: 'materialCode',
            width: 100,
        }, {
            title: '分类',
            dataIndex: 'materialCategoryName',
            width: 100,
        }, {
            title: '标准',
            dataIndex: 'materialStandardName',
            width: 100,
        }, {
            title: '品名',
            dataIndex: 'materialName',
            width: 100,
        }, {
            title: '材质',
            dataIndex: 'structureTexture',
            width: 100,
        }, {
            title: '规格',
            dataIndex: 'structureSpec',
            width: 100,
        }, {
            title: '长度（mm）',
            dataIndex: 'length',
            width: 100,
        }, {
            title: '宽度（mm）',
            dataIndex: 'width',
            width: 100,
        }, {
            title: '数量',
            dataIndex: 'num',
            width: 100,
        }, {
            title: '重量（吨）',
            dataIndex: 'weight',
            width: 100,
        }, {
            title: '缺料数量',
            dataIndex: 'shortageNum',
            width: 100,
            render: (text: any, item: any, index: any) => {
                return (
                    <Input
                        placeholder="请输入"
                        value={item.shortageNum}
                        onChange={(e) => { inputChange(e, item, index, 'shortage') }}
                    ></Input>
                )
            }
        },
    ];//出库弹框-缺料申请原材料信息表头

    const [filterValue, setFilterValue] = useState<any>({
        id: params.id,
    });

    // 获取统计的数据
    const { run: getUser, data: weightData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/outStock/detail/statistics`, {
                ...filterValue
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        const result: any = {
            selectName: value.selectName || "",
            status: value.status || "",
            updateTimeStart: "",
            updateTimeEnd: "",
            departmentId: "",
            outStockStaffId: "",
            id: params.id,
            materialTexture: value.materialTexture || "",
            standard: value.standard || ""
        }
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            result.updateTimeStart = `${formatDate[0]} 00:00:00`
            result.updateTimeEnd = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        if (value.batcherId) {
            result.outStockStaffId = value.batcherId.value
        }
        setFilterValue({ ...value })
        return value
    }

    // 点击出库显示弹框内容
    const IssueOperation = async (record: any) => {
        setRequirement(record.num);
        setOutboundId(record.id);
        setApplyListdata([record]);
        const data: any = await RequestUtil.get(`/tower-storage/materialStock`, {
            structureTexture: record.structureTexture,//材质
            materialName: record.materialName,//品名
            materialStandard: record.materialStandard,//标准
            lengthMin: record.length,//长度最小值
            lengthMax: record.length,//长度最大值
            structureSpec: record.structureSpec,//规格
            width: record.width,
            size: 1000
        });
        setOutLibraryListdata(data.records);
        setIsOutLibraryModal(true)
    }
    // 出库弹框列表输入框
    const inputChange = (e: any, item: any, index: any, type: string) => {
        let ary = []
        if (type == 'OutLibrary') {
            ary = JSON.parse(JSON.stringify(OutLibraryListdata))
            ary[index].outboundQuantity = e.target.value.replace(/[^0-9]/g, '')
            setOutLibraryListdata(ary)
        } else {
            ary = JSON.parse(JSON.stringify(ApplyListdata))
            ary[index].shortageNum = e.target.value.replace(/[^0-9]/g, '')
            setApplyListdata(ary)
        }
    }
    //获取列表详情数据数据
    const getDetailData = async (id: any) => {
        const data: any = await RequestUtil.get(`/tower-storage/outStock/detail/${id}`);
        let supplierObj = {
            ...data,
            key: 1,
        }
        let WarehousingObj = {
            ...data,
            key: 2,
        }
        let ExwarehousingObj = {
            ...data,
            key: 3,
        }
        setSupplierListdata([supplierObj])
        setWarehousingListdata([WarehousingObj])
        setExWarehousingListdata([ExwarehousingObj])
        setIsDetailModal(true)
    }
    // 点击出库-缺料申请-按钮
    const MaterialShortageApplication = async () => {
        if (OutLibraryListdata.length != 0) {
            message.error('库存未用完')
            return
        }
        setIsApplyModal(true)
    }
    // 出库保存
    const IssueSave = async () => {
        let ary: any = [];
        let count: number = 0;
        OutLibraryListdata.map((item, index) => {
            if (item.outboundQuantity) {
                let obj: any = {};
                obj.num = item.outboundQuantity
                obj.id = item.id
                count += parseFloat(item.outboundQuantity || 0)
                ary.push(obj)
            }
        })
        if (count > requirement) {
            message.error("出库数量不能大于需求量...")
            return
        }
        if (ary.length == 0) return message.error('所有数据无出库数量')
        const data: any = await RequestUtil.post(`/tower-storage/outStock`, {
            id: OutboundId,
            materialStockList: ary
        });
        if (data) {
            message.success('操作成功')
            setIsOutLibraryModal(false)
            // 刷新列表
            history.go(0);
        }

    }
    // 缺料申请
    const shortage = async () => {
        const data: any = await RequestUtil.put(`/tower-storage/outStock/lack?id=${OutboundId}`);
        if (data) {
            message.success('申请成功')
            setIsApplyModal(false)
            setIsOutLibraryModal(false)
            history.go(0)
        }
    }

    return (
        <>
            <Page
                path="/tower-storage/outStock/detail"
                exportPath={"/tower-storage/outStock/detail"}
                exportObject={{ id: params.id }}
                extraOperation={(data: any) => {
                    return <>
                        <span style={{ marginLeft: "20px" }}>
                            总重量： {weightData?.weightCount || "0.00"} 吨， 缺料总重量：{weightData?.excessWeight || "0.00"} 吨
                        </span>
                    </>
                }}
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
                        width: 80,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            // 0待出库 2 已出库  1缺料中
                            <>
                                {record.outStockItemStatus == 0 ? <Button type='link' onClick={() => { IssueOperation(record) }}>出库</Button> : null}
                                {record.outStockItemStatus == 2 ? <Button type='link' onClick={() => { getDetailData(record.id) }}>详情</Button> : null}
                            </>
                        )
                    }
                ]}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                searchFormItems={[
                    {
                        name: 'startRefundTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'status',
                        label: '状态',
                        children: (
                            <Select placeholder="请选择状态" style={{ width: "140px" }}>
                                <Select.Option value="0">待出库</Select.Option>
                                <Select.Option value="1">缺料中</Select.Option>
                                <Select.Option value="2">已出库</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'batcherId',
                        label: '出库人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'materialTexture',
                        label: '材质',
                        children: (
                            <Select placeholder="请选择材质" style={{ width: "140px" }}>
                                {
                                    materialEnum && materialEnum.length > 0 && materialEnum.map((item: any, index: number) => {
                                        return <Select.Option value={item.label} key={index}>{item.label}</Select.Option>
                                    })
                                }
                            </Select>
                        )
                    },
                    {
                        name: 'standard',
                        label: '标准',
                        children: (
                            <Select placeholder="请选择标准" style={{ width: "140px" }}>
                                {
                                    standardEnum && standardEnum.length > 0 && standardEnum.map((item: any, index: number) => {
                                        return <Select.Option value={item.value} key={index}>{item.label}</Select.Option>
                                    })
                                }
                            </Select>
                        )
                    },
                    {
                        name: 'selectName',
                        label: "关键字",
                        children: <Input placeholder="请输入品名/炉批号/内部合同号/杆塔号/批号、质保书号、轧制批号进行查询" style={{ width: 300 }} />
                    }
                ]}
            />
            {/* 详情弹框 */}
            <Modal
                className="Detail_modal"
                visible={isDetailModal}
                title="详细"
                width={1000}
                maskClosable={false}
                onCancel={() => setIsDetailModal(false)}
                footer={
                    <>
                        <Button onClick={() => setIsDetailModal(false)}>关闭</Button>
                    </>
                }
            >
                <div className="supplier_info">
                    <div className="title">供应商信息</div>
                    <div className="table_wrap">
                        <Table
                            columns={supplierColumns}
                            dataSource={supplierListdata}
                            size='small'
                            rowClassName={(item, index) => {
                                return index % 2 ? 'aaa' : ''
                            }}
                            pagination={false}
                        />
                    </div>
                </div>
                <div className="Warehousing_info">
                    <div className="title">入库信息</div>
                    <div className="table_wrap">
                        <Table
                            columns={WarehousingColumns}
                            dataSource={WarehousingListdata}
                            scroll={{ x: 1200 }}
                            size='small'
                            rowClassName={(item, index) => {
                                return index % 2 ? 'aaa' : ''
                            }}
                            pagination={false}
                        />
                    </div>
                </div>
                <div className="ExWarehouse_info">
                    <div className="title">出库信息</div>
                    <div className="table_wrap">
                        <Table
                            columns={ExWarehousingColumns}
                            dataSource={ExWarehousingListdata}
                            size='small'
                            rowClassName={(_item, index) => index % 2 ? 'aaa' : ''}
                            pagination={false}
                        />
                    </div>
                </div>
            </Modal>
            {/* 出库弹框 */}
            <Modal
                className="out_library_modal"
                visible={isOutLibraryModal}
                title="出库"
                width={1000}
                maskClosable={false}
                onCancel={() => setIsOutLibraryModal(false)}
                footer={
                    <>
                        <Button onClick={() => setIsOutLibraryModal(false)}>关闭</Button>
                        {/* <Button type='primary' onClick={() => { MaterialShortageApplication() }}>缺料申请</Button> */}
                        <Button type='primary' onClick={IssueSave}>保存</Button>
                    </>
                }
            >
                <div className="out_library_info">
                    <div className="title">
                        出库原材料信息
                        <span className='cont'>需求量：{requirement}</span>
                    </div>
                    <div className="table_wrap">
                        <Table
                            columns={OutLibraryColumns}
                            dataSource={OutLibraryListdata}
                            size='small'
                            rowClassName={(item, index) => {
                                return index % 2 ? 'aaa' : ''
                            }}
                            scroll={
                                {
                                    y: 400
                                }
                            }
                            pagination={false}
                        />
                    </div>
                </div>
            </Modal>
            {/* 缺料申请弹框 */}
            <Modal
                className="apply_modal"
                visible={isApplyModal}
                title="缺料申请"
                width={1000}
                maskClosable={false}
                onCancel={() => setIsApplyModal(false)}
                footer={
                    <>
                        <Button onClick={() => setIsApplyModal(false)}>关闭</Button>
                        <Button type='primary' onClick={() => { shortage() }}>保存并提交</Button>
                    </>
                }
            >
                <div className="out_library_info">
                    <div className="table_wrap">
                        <Table
                            columns={ApplyColumns}
                            dataSource={ApplyListdata}
                            size='small'
                            rowClassName={(item, index) => {
                                return index % 2 ? 'aaa' : ''
                            }}
                            scroll={
                                {
                                    y: 400
                                }
                            }
                            pagination={false}
                        />
                    </div>
                </div>
            </Modal>
        </>
    )
}