import React, { useState } from 'react';
import { Input, Select, DatePicker, Button, Modal, message, Table, Popconfirm } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SearchTable as Page, IntgSelect } from '../../../common';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../../utils/RequestUtil';
import { baseColumn } from "./detail.json";
import '../../StockPublicStyle.less';
import './detail.less';
import { exportDown } from '@utils/Export';

export default function Index(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, approval: string }>();
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
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
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
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
            title: '品名',
            dataIndex: 'materialName',
            width: 100,
        },
        {
            title: '规格',
            dataIndex: 'structureSpec',
            width: 100,
        }, {
            title: '数量',
            dataIndex: 'num',
            width: 40,
        }, {
            title: '单位',
            dataIndex: 'unit',
            width: 40,
        }, {
            title: '入库人',
            dataIndex: 'receiveCreateUserName',
            width: 70,
        }, {
            title: '入库时间',
            dataIndex: 'receiveCreateTime',
            width: 140,
        }, {
            title: '仓库',
            dataIndex: 'warehouseName',
            width: 60,
        }, {
            title: '库区',
            dataIndex: 'reservoirName',
            width: 80,
        }, {
            title: '库位',
            dataIndex: 'locatorName',
            width: 80,
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: 100,
        }
    ];//详情-入库表头
    const ExWarehousingColumns = [
        {
            title: '出库编号',
            dataIndex: 'pickingNumber'
        },
        {
            title: '品名',
            dataIndex: 'materialName'
        }, {
            title: '规格',
            dataIndex: 'structureSpec'
        }, {
            title: '数量',
            dataIndex: 'num'
        }, {
            title: '单位',
            dataIndex: 'unit'
        }, {
            title: '申请人',
            dataIndex: 'applyStaffName',
        }, {
            title: '出库时间',
            dataIndex: 'outStockTime',
        }, {
            title: '仓库',
            dataIndex: 'warehouseName',
        }, {
            title: '库区',
            dataIndex: 'reservoirName',
        }, {
            title: '库位',
            dataIndex: 'locatorName',
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
            title: '类别',
            dataIndex: 'materialCategoryName',
            width: 100,
        }, {
            title: '品名',
            dataIndex: 'materialName',
            width: 100,
        }, {
            title: '规格',
            dataIndex: 'structureSpec',
            width: 100,
        }, {
            title: '数量',
            dataIndex: 'num',
            width: 100,
        },
        {
            title: '库存数量',
            dataIndex: 'num',
            width: 100,
        },
        {
            title: '出库数量',
            dataIndex: 'standard',
            width: 100,
            render: (text: any, item: any, index: any) => {
                return (
                    <Input
                        placeholder="请输入"
                        value={item.outboundQuantity}
                        onChange={(e) => { inputChange(e, item, index, 'OutLibrary') }}
                    />
                )
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            width: 200,
            render: (text: any, item: any, index: any) => {
                return (
                    <Input.TextArea
                        placeholder="请输入"
                        value={item.remark}
                        rows={1}
                        onChange={(e) => { inputChange(e, item, index, 'remark') }} />
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
        materialType: 2
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

    // 撤销
    const { loading: revocating, run: revocationRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-storage/outStock/detail/revocation/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 删除
    const { loading: deleting, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-storage/outStock/detail/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // // 用友格式导出
    // const { run: exportRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
    //     try {
    //         const result: { [key: string]: any } = await RequestUtil.get(
    //             `/tower-storage/outStock/export/${params.id}`,
    //             {},
    //             {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //                 'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
    //                 'Tenant-Id': AuthUtil.getTenantId(),
    //                 'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
    //                 isExport: 'true',
    //             }
    //         )
    //         const data = await result.blob()
    //         var blob = new Blob([data]);
    //         var reader = new FileReader();
    //         reader.readAsDataURL(blob);
    //         reader.onload = function (e) {
    //             var a = document.createElement('a');
    //             a.download = `出库明细-${params.id}` + '.xlsx';
    //             a.href = URL.createObjectURL(blob);
    //             a.click();
    //         }
    //         resole(result)
    //     } catch (error) {
    //         reject(error)
    //     }
    // }), { manual: true })

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.updateTime) {
            const formatDate = value.updateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateTimeStart = `${formatDate[0]} 00:00:00`
            value.updateTimeEnd = `${formatDate[1]} 23:59:59`
            delete value.updateTime
        }
        if (value.outStockStaffId) {
            value.outStockStaffId = value.outStockStaffId.value
        }
        setFilterValue({ ...filterValue, ...value })
        return value
    }

    // 点击出库显示弹框内容
    const IssueOperation = async (record: any) => {
        setRequirement(record.num);
        setOutboundId(record.id);
        setApplyListdata([record]);
        const data: any = await RequestUtil.get(`/tower-storage/materialStock`, {
            materialName: record.materialName,//品名
            structureSpec: record.structureSpec,//规格
            materialType: 2,
            size: 1000
        });
        setOutLibraryListdata(data.records);
        setIsOutLibraryModal(true)
    }
    // 出库弹框列表输入框
    const inputChange = (e: any, item: any, index: any, type: string) => {
        let ary = [...OutLibraryListdata]
        if (type == 'OutLibrary') {
            ary[index].outboundQuantity = e.target.value.replace(/[^0-9.]/g, '')
            setOutLibraryListdata(ary)
            return
        } else if (type === "remark") {
            ary[index].remark = e.target.value
            setOutLibraryListdata(ary)
            return
        } else {
            ary = JSON.parse(JSON.stringify(ApplyListdata))
            ary[index].shortageNum = e.target.value.replace(/[^0-9.]/g, '')
            setApplyListdata(ary)
        }
    }
    //获取列表详情数据数据
    const getDetailData = async (id: any) => {
        const data: any = await RequestUtil.get(`/tower-storage/outStock/detail/${id}`, {
            materialType: 2
        });
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
                obj.remark = item.remark
                count += parseFloat(item.outboundQuantity || 0)
                ary.push(obj)
            }
        })
        if (count > requirement) {
            message.error("出库数量不能大于需求量...")
            return
        }
        if (ary.length == 0) return message.error('所有数据无出库数量')
        await RequestUtil.post(`/tower-storage/outStock/auxiliaryOutStock`, {
            id: OutboundId,
            materialStockList: ary
        });
        message.success('操作成功')
        setIsOutLibraryModal(false)
        // 刷新列表
        history.go(0);

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

    const handleExport = () => exportDown(
        `/tower-storage/outStock/export/${params.id}`,
        "GET",
        {},
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        `出库明细-${params.id}`
    )

    const handleRevocation = async (id: string) => {
        await revocationRun(id)
        await message.success("撤销成功...")
        history.go(0)
    }

    const handleDelete = async (id: string) => {
        await deleteRun(id)
        await message.success("成功删除...")
        history.go(0)
    }

    return (
        <>
            <Page
                path="/tower-storage/outStock/detail"
                exportPath={"/tower-storage/outStock/detail"}
                exportObject={{ id: params.id }}
                exportFileName="原材料出库明细"
                extraOperation={(data: any) => {
                    return <>
                        {/* <Button type="primary" ghost onClick={handleExport}>用友表格导出</Button> */}
                        <Button type="primary" ghost onClick={async ()=>{ await RequestUtil.post(`/tower-storage/outStock/auxiliary/batchOutStock`,{
                            outStockDetailId: selectedKeys,
                            outStockId: params.id
                        }).then(()=>{
                            message.success(`出库成功！`)
                            history.go(0)
                        })}} disabled={!(selectedKeys.length>0)}>批量出库</Button>
                        <Button onClick={() => history.goBack()}>返回上一级</Button>
                        <Button type="primary" ghost onClick={async () => { 
                            if([undefined,'undefined',null,'null', 0,'0',2,'2',3,'3',4,'4'].includes(params?.approval)){
                                await RequestUtil.get(`/tower-storage/outStock/auxiliary/workflow/start/${params.id}`)
                                message.success('发起成功！')
                                history.go(-1)
                            }else{
                                message.error("当前不可发起审批！")
                            }
                        }} >发起审批</Button>
                        <Button type="primary" ghost onClick={async () => {
                            if([1,'1'].includes(params?.approval)){
                                await RequestUtil.get(`/tower-storage/outStock/workflow/cancel/${params.id}`)
                                message.success('撤销成功！')
                                history.go(-1)
                            }else{
                                message.error('不可撤销！')
                            }
                        }} >撤销审批</Button>
                        <span style={{ marginLeft: "20px" }}>
                            总数量： {weightData?.totalNum || "0.00"}
                        </span>
                    </>
                }}
                tableProps={{
                    rowSelection: {
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange,
                        getCheckboxProps: (record: any) => record.outStockItemStatus !== 0
                    }
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
                        width: 180,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            // 0待出库 2 已出库  1缺料中
                            <>
                                <Button type='link' disabled={record.outStockItemStatus !== 0} onClick={() => { IssueOperation(record) }}>出库</Button>
                                <Button type='link' disabled={record.outStockItemStatus !== 2} onClick={() => { getDetailData(record.id) }}>详情</Button>
                                <Popconfirm
                                    title="确认撤销?"
                                    onConfirm={() => handleRevocation(record.id)}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button loading={revocating} disabled={record.outStockItemStatus !== 2} type="link">撤销</Button>
                                </Popconfirm>
                                <Popconfirm
                                    title="确认删除?"
                                    onConfirm={() => handleDelete(record?.id)}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button loading={deleting} disabled={record.outStockItemStatus === 2} type="link">删除</Button>
                                </Popconfirm>
                            </>
                        )
                    }
                ]}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                searchFormItems={[
                    {
                        name: 'updateTime',
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
                        name: 'outStockStaffId',
                        label: '出库人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询",
                        children: <Input placeholder="输入品名/规格查询" style={{ width: 300 }} />
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
                    <Button onClick={() => setIsDetailModal(false)}>关闭</Button>
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