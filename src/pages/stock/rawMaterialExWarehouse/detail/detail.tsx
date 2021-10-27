import React, { useState, useEffect } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import ConfirmableButton from '../../../../components/ConfirmableButton';
import { Page } from '../../../common';
import { IClient } from '../../../IClient';
import RequestUtil from '../../../../utils/RequestUtil';
import '../../StockPublicStyle.less';
import './detail.less';

const { RangePicker } = DatePicker;
export default function RawMaterialStock(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const history = useHistory(),
        [current, setCurrent] = useState(1),
        [total, setTotal] = useState(100),
        [pageSize, setPageSize] = useState<number>(10),
        [status, setStatus] = useState(''),//状态
        [dateValue, setDateValue] = useState<any>([]),//时间
        [dateString, setDateString] = useState<any>([]),//时间字符串格式
        [keyword, setKeyword] = useState<any>('');//关键字搜索
    const [departmentId, setDepartmentId] = useState('');//部门
    const [outStockStaffId, setPersonnelId] = useState('');//人员
    const [Listdata, setListdata] = useState<any[]>([]);//列表数据
    const [supplierListdata, setSupplierListdata] = useState<any[]>([{}]);//详情-供应商信息列表数据
    const [WarehousingListdata, setWarehousingListdata] = useState<any[]>([{}]);//详情-入库信息列表数据
    const [ExWarehousingListdata, setExWarehousingListdata] = useState<any[]>([{}]);//详情-出库信息列表数据
    const [OutLibraryListdata, setOutLibraryListdata] = useState<any[]>([{}]);//出库-原材料信息列表数据
    const [ApplyListdata, setApplyListdata] = useState<any[]>([{}]);//出库-缺料申请-信息列表数据
    const [totalWeight, setTotalWeight] = useState<number>(0);//总重量
    const [MaterialShortageTotalWeight, setMaterialShortageTotalWeight] = useState<number>(0);//缺料总重量
    const [isDetailModal, setIsDetailModal] = useState<boolean>(false);//详情弹框显示
    const [isOutLibraryModal, setIsOutLibraryModal] = useState<boolean>(false);//出库弹框显示
    const [isApplyModal, setIsApplyModal] = useState<boolean>(false);//出库弹框显示
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                console.log(item, 'item')
                return <span>{index + 1}</span>
            }
        },
        {
            title: '品名',
            dataIndex: 'productName',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '状态',
            dataIndex: 'outStockItemStatus',
            width: 120,
        }, {
            title: '最新状态变更',
            dataIndex: 'createTime',
            width: 160,
        }, {
            title: '规格',
            dataIndex: 'spec',
            width: 120,
        }, {
            title: '标准',
            dataIndex: 'standard',
            width: 120,
        }, {
            title: '材质',
            dataIndex: 'materialTexture',
            width: 120,
        }, {
            title: '长度(mm)',
            dataIndex: 'length',
            width: 120,
        }, {
            title: '宽度(mm)',
            dataIndex: 'width',
            width: 120,
        }, {
            title: '重量(吨)',
            dataIndex: 'weight',
            width: 120,
        }, {
            title: '炉批号',
            dataIndex: 'furnaceBatch',
            width: 120,
        }, {
            title: '内部合同号',
            dataIndex: 'contractNumber',
            width: 120,
        }, {
            title: '塔型',
            dataIndex: 'productCategoryId',
            width: 120,
        }, {
            title: '塔杆号',
            dataIndex: 'productNumber',
            width: 120,
        }, {
            title: '出库人',
            dataIndex: 'outStockStaffId',
            width: 120,
        },
        {
            title: '操作',
            width: 140,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={() => { setIsOutLibraryModal(true) }}>出库</Button>
                    <Button type='link' onClick={() => { setIsDetailModal(true) }}>详情</Button>
                </Space>
            )
        }
    ];//列表表头
    const supplierColumns = [
        {
            title: '收货单号',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                console.log(item, 'item')
                return <span>{index + 1}</span>
            }
        },
        {
            title: '供应商',
            dataIndex: 'productName',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '联系人',
            dataIndex: 'outStockItemStatus',
            width: 120,
        }, {
            title: '联系电话',
            dataIndex: 'createTime',
            width: 160,
        }, {
            title: '合同编号',
            dataIndex: 'spec',
            width: 120,
        }
    ];//详情-供应商列表表头
    const WarehousingColumns = [
        {
            title: '材质名称',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                console.log(item, 'item')
                return <span>{index + 1}</span>
            }
        },
        {
            title: '标准',
            dataIndex: 'productName',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '规格',
            dataIndex: 'outStockItemStatus',
            width: 120,
        }, {
            title: '材质',
            dataIndex: 'createTime',
            width: 160,
        }, {
            title: '长度',
            dataIndex: 'spec',
            width: 120,
        }, {
            title: '宽度',
            dataIndex: 'standard',
            width: 120,
        }, {
            title: '入库人',
            dataIndex: 'materialTexture',
            width: 120,
        }, {
            title: '入库时间',
            dataIndex: 'length',
            width: 120,
        }, {
            title: '炉批号',
            dataIndex: 'width',
            width: 120,
        }, {
            title: '仓库',
            dataIndex: 'weight',
            width: 120,
        }, {
            title: '库位',
            dataIndex: 'furnaceBatch',
            width: 120,
        }, {
            title: '库区',
            dataIndex: 'contractNumber',
            width: 120,
        }, {
            title: '备注',
            dataIndex: 'productCategoryId',
            width: 120,
        }
    ];//详情-入库表头
    const ExWarehousingColumns = [
        {
            title: '领料编号',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                console.log(item, 'item')
                return <span>{index + 1}</span>
            }
        },
        {
            title: '任务编号',
            dataIndex: 'productName',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '生产批次',
            dataIndex: 'outStockItemStatus',
            width: 120,
        }, {
            title: '申请人',
            dataIndex: 'createTime',
            width: 160,
        }, {
            title: '出库人',
            dataIndex: 'spec',
            width: 120,
        }, {
            title: '出库时间',
            dataIndex: 'standard',
            width: 120,
        },
    ];//详情-出库表头
    const OutLibraryColumns = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                console.log(item, 'item')
                return <span>{index + 1}</span>
            }
        },
        {
            title: '所在仓库',
            dataIndex: 'productName',
            width: 100,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '收货批次',
            dataIndex: 'outStockItemStatus',
            width: 100,
        }, {
            title: '库位',
            dataIndex: 'createTime',
            width: 100,
        }, {
            title: '区位',
            dataIndex: 'spec',
            width: 100,
        }, {
            title: '物料编码',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '分类',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '标准',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '品名',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '材质',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '规格',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '长度（mm）',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '宽度（mm）',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '数量',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '重量（吨）',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '库存数量',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '出库数量',
            dataIndex: 'standard',
            width: 100,
        },
    ];//出库弹框-原材料信息表头
    const ApplyColumns = [
        {
            title: '序号',
            dataIndex: 'id',
            width: 50,
            render: (text: any, item: any, index: any) => {
                console.log(item, 'item')
                return <span>{index + 1}</span>
            }
        }, {
            title: '物料编码',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '分类',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '标准',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '品名',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '材质',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '规格',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '长度（mm）',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '宽度（mm）',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '数量',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '重量（吨）',
            dataIndex: 'standard',
            width: 100,
        }, {
            title: '缺料数量',
            dataIndex: 'standard',
            width: 100,
        },
    ];//出库弹框-缺料申请原材料信息表头

    //获取列表数据
    const loadData = async () => {
        console.log('请求数据')
        const data: any = await RequestUtil.get(`/tower-storage/outStock/detail`, {
            current,
            size: pageSize,
            keyword,
            id: params.id,
            departmentId,
            outStockStaffId,
            selectName: keyword,
            status,
            updateTimeStart: dateString[0],
            updateTimeEnd: dateString[1],
        });
        setListdata(data.records);
        setTotal(data.total);
    }
    // 重置
    const reset = () => {
        setCurrent(1);
        setPageSize(10);
        setStatus('');
        setDateValue([]);
        setDateString([]);
        setKeyword('')
    }
    // 详情弹框取消
    const onDetailCancel = () => {
        setIsDetailModal(false)
    }
    // 出库弹框取消
    const onOutLibraryCancel = () => {
        setIsOutLibraryModal(false)
    }
    // 缺料申请弹框取消
    const onApplyModalCancel = () => {
        setIsApplyModal(false)
    }
    //进入页面刷新
    useEffect(() => {
        loadData()
    }, [current, pageSize])
    return (
        <div id="RawMaterialStock">
            <div className="Search_public_Stock">
                <div className="search_item">
                    <span className="tip">最新状态变更时间：</span>
                    <div className='selectOrInput'>
                        <RangePicker
                            value={dateValue}
                            onChange={(date, dateString) => {
                                console.log(date, dateString)
                                setDateValue(date)
                                setDateString(dateString)
                            }}
                        ></RangePicker>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">状态： </span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={status ? status : '请选择'}
                            onChange={(val) => { setStatus(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                状态1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                状态2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                状态3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">出库人：</span>
                    <div className='selectOrInput'>
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={departmentId ? departmentId : '请选择'}
                            onChange={(val) => { setDepartmentId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                部门1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                部门2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                部门3
                            </Select.Option>
                        </Select>-
                        <Select
                            className="select"
                            style={{ width: "100px" }}
                            value={outStockStaffId ? outStockStaffId : '请选择'}
                            onChange={(val) => { setPersonnelId(val) }}
                        >
                            <Select.Option
                                value="1"
                            >
                                人员1
                            </Select.Option>
                            <Select.Option
                                value="2"
                            >
                                人员2
                            </Select.Option>
                            <Select.Option
                                value="3"
                            >
                                人员3
                            </Select.Option>
                        </Select>
                    </div>
                </div>
                <div className="search_item">
                    <span className="tip">关键字：</span>
                    <div className='selectOrInput'>
                        <Input
                            style={{ width: "200px" }}
                            placeholder="品名/炉批号/内部合同号/杆塔号"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value)
                            }}
                        >
                        </Input>
                    </div>
                </div>
                <div className="search_item">
                    <div className='search_Reset'>
                        <Button
                            className="btn"
                            type="primary"
                            onClick={() => { loadData() }}
                        >查询</Button>
                        <Button
                            className="btn"
                            type="primary"
                            ghost
                            onClick={reset}
                        >重置</Button>
                    </div>
                </div>
            </div>
            <div className="func_public_Stock">
                <Button
                    type="primary"
                    className='func_btn'
                >导出</Button>
                <Button
                    className='func_btn'
                    type="primary"
                    ghost
                    onClick={() => {
                        history.go(-1)
                    }}
                >返回上一级</Button>
            </div>
            <div className="tip_public_Stock">
                <div>总重量： {totalWeight} 吨    缺料总重量：{MaterialShortageTotalWeight} 吨</div>
            </div>
            <div className="page_public_Stock">
                <Table
                    columns={columns}
                    dataSource={Listdata}
                    size='small'
                    rowClassName={(item, index) => {
                        return index % 2 ? 'aaa' : ''
                    }}
                    scroll={
                        {
                            y: 400
                        }
                    }
                    pagination={{
                        size: 'small',
                        defaultPageSize: 5,
                        showQuickJumper: true,
                        current: current,
                        total: total,
                        pageSize: pageSize,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            console.log(page, pageSize)
                            setCurrent(page);
                            setPageSize(Number(pageSize));
                        }
                    }}
                />
            </div>

            {/* 详情弹框 */}
            <Modal
                className="Detail_modal"
                visible={isDetailModal}
                title="详细"
                width={1000}
                maskClosable={false}
                onCancel={onDetailCancel}
                footer={
                    <>
                        <Button onClick={onDetailCancel}>关闭</Button>
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
                            scroll={
                                {
                                    y: 400
                                }
                            }
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
                <div className="ExWarehouse_info">
                    <div className="title">出库信息</div>
                    <div className="table_wrap">
                        <Table
                            columns={ExWarehousingColumns}
                            dataSource={ExWarehousingListdata}
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
            {/* 出库弹框 */}
            <Modal
                className="out_library_modal"
                visible={isOutLibraryModal}
                title="出库"
                width={1000}
                maskClosable={false}
                onCancel={onOutLibraryCancel}
                footer={
                    <>
                        <Button onClick={onOutLibraryCancel}>关闭</Button>
                        <Button type='primary' onClick={() => { setIsApplyModal(true) }}>缺料申请</Button>
                        <Button type='primary' onClick={onOutLibraryCancel}>保存</Button>
                    </>
                }
            >
                <div className="out_library_info">
                    <div className="title">
                        出库原材料信息
                        <span className='cont'>需求量：30</span>
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
                onCancel={onApplyModalCancel}
                footer={
                    <>
                        <Button onClick={onApplyModalCancel}>关闭</Button>
                        <Button type='primary' onClick={() => { }}>保存并提交</Button>
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
        </div>
    )
}