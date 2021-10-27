import React, { useState, useEffect } from 'react';
import { Space, Button, TableColumnProps, Modal, Input, DatePicker, Select, message, Table } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import ConfirmableButton from '../../../../components/ConfirmableButton';
import { Page } from '../../../common';
import { IClient } from '../../../IClient';
import RequestUtil from '../../../../utils/RequestUtil';
import '../../StockPublicStyle.less';
import './detail.less';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
export default function RawMaterialStock(): React.ReactNode {
    const history = useHistory(),
        [current, setCurrent] = useState(1),
        [total, setTotal] = useState(100),
        [pageSize, setPageSize] = useState<number>(10),
        [isRejectionModal, setRejectionModal] = useState<boolean>(false),//拒收弹框
        [isReceivingModal, setisReceivingModal] = useState<boolean>(false),//拒收弹框
        [status, setStatus] = useState(''),//采购状态
        [dateValue, setDateValue] = useState<any>([]),//时间
        [dateString, setDateString] = useState<any>([]),//时间字符串格式
        [keyword, setKeyword] = useState<any>('');//关键字搜索
    const [rejectionText, setRejectionText] = useState<any>('');//拒收原因
    const [warehouseId, setWarehouseId] = useState('');//收货弹框选择仓库
    const [locatorId, setLocatorId] = useState('');//收货弹框选择库位
    const [reservoirId, setReservoirId] = useState('');//收货弹框选择库位
    const [furnaceBatchNo, setFurnaceBatchNo] = useState('');//收货弹框输入炉批号
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            width: 50,
        },
        {
            title: '材质名称',
            dataIndex: 'name',
            width: 120,
            render: (text: any) => <a>{text}</a>,
        }, {
            title: '标准',
            dataIndex: 'receivingBatch',
            width: 120,
        }, {
            title: '规格',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '材质',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '长度',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '宽度',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '数量',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '合同单价(元/吨)',
            dataIndex: 'key',
            width: 120,
        }, {
            title: '价税合计(元)',
            dataIndex: 'key',
            width: 120,
        },
        {
            title: '操作',
            dataIndex: 'key',
            width: 240,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <span>质检单</span>
                    <span>质保单</span>
                    <Button type='link' onClick={() => { setisReceivingModal(true) }}>收货</Button>
                    <Button type='link' onClick={() => { setRejectionModal(true) }}>拒收</Button>
                </Space>
            )
        }
    ]
    const Listdata = [
        {
            name: '仓库1',
            key: '1',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '2',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '3',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '4',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '15',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '6',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '17',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '51',
            receivingBatch: '2021-1223-TT'
        }, {
            name: '仓库1',
            key: '18',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '8',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '9',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '10',
            receivingBatch: '2021-1223-TT'
        }, {
            name: '仓库1',
            key: '31',
            receivingBatch: '2021-1223-TT'
        },
        {
            name: '仓库1',
            key: '51',
            receivingBatch: '2021-1223-TT'
        },
    ]
    //获取列表数据
    const loadData = async () => {
        console.log('请求数据')
        const data: any[] = await RequestUtil.get(`/tower-system/dictionary/allDictionary`, {
            current,
            pageSize,
            keyword,
            dateString
        });
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
    // submit拒收弹框提交
    const rejectionSubmit = () => {
        // 拒收
    }
    // 拒收弹框取消
    const onRejectionCancel = () => {
        setRejectionModal(false);
        setRejectionText('');
    }
    // 收货弹框取消
    const onReceivingCancel = () => {
        setisReceivingModal(false);
        setWarehouseId('');
        setLocatorId('');
        setReservoirId('');
        setFurnaceBatchNo('');
    }
    // submit收货弹框提交
    const receivingSubmit = () => {
        //收货
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
                    <span className="tip">采购状态： </span>
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
                    <span className="tip">关键字：</span>
                    <div className='selectOrInput'>
                        <Input
                            placeholder="材料名称/标准/规格/材质"
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
                    type="primary"
                    ghost
                    className='func_btn'
                >申请质检</Button>
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
                <div>已收货：重量(支)合计：2209.90     价税合计(元)合计：51425.00   待收货：重量(支)合计：2209.90     价税合计(元)合计：51425.00</div>
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
            {/* 拒收弹框 */}
            <Modal
                visible={isRejectionModal}
                title="拒收原因*"
                onCancel={onRejectionCancel}
                maskClosable={false}
                footer={
                    <>
                        <Button onClick={onRejectionCancel}>取消</Button>
                        <Button type='primary' onClick={rejectionSubmit}>提交</Button>
                    </>
                }
            >
                {/* <div>拒收原因<span>*</span>：</div> */}
                <TextArea
                    placeholder="请输入拒收原因"
                    value={rejectionText}
                    rows={4}
                    maxLength={200}
                    onChange={(e) => {
                        console.log(e.target.value)
                        setRejectionText(e.target.value)
                    }}
                    onPressEnter={() => {
                        // 回车键回调
                    }}
                ></TextArea>
            </Modal>

            {/* 收货弹框 */}
            <Modal
                className="receiving_modal"
                visible={isReceivingModal}
                title="收货"
                maskClosable={false}
                onCancel={onReceivingCancel}
                footer={
                    <>
                        <Button onClick={onReceivingCancel}>关闭</Button>
                        <Button type='primary' onClick={receivingSubmit}>保存并提交</Button>
                    </>
                }
            >
                <div className="receiving_info">
                    <div className="part">
                        <div className="item">
                            <div className='tip'>收货批次</div>
                            <div className='info'>
                                自动产生
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>仓库<span>*</span></div>
                            <div className='info'>
                                <Select
                                    className="select"
                                    style={{ width: "100%" }}
                                    value={warehouseId ? warehouseId : '请选择'}
                                    onChange={(val) => { setWarehouseId(val) }}
                                >
                                    <Select.Option
                                        value="1"
                                    >
                                        仓库1
                                    </Select.Option>
                                    <Select.Option
                                        value="2"
                                    >
                                        仓库12
                                    </Select.Option>
                                    <Select.Option
                                        value="3"
                                    >
                                        仓库13
                                    </Select.Option>
                                </Select>
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>库位<span>*</span></div>
                            <div className='info'>
                                <Select
                                    className="select"
                                    style={{ width: "100%" }}
                                    value={locatorId ? locatorId : '请选择'}
                                    onChange={(val) => { setLocatorId(val) }}
                                >
                                    <Select.Option
                                        value="1"
                                    >
                                        库位1
                                    </Select.Option>
                                    <Select.Option
                                        value="2"
                                    >
                                        库位2
                                    </Select.Option>
                                    <Select.Option
                                        value="3"
                                    >
                                        库位3
                                    </Select.Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="part">
                        <div className="item">
                            <div className="tip"></div>
                            <div className="info"></div>
                        </div>
                        <div className="item">
                            <div className='tip'>库区<span>*</span></div>
                            <div className='info'>
                                <Select
                                    className="select"
                                    style={{ width: "100%" }}
                                    value={reservoirId ? reservoirId : '请选择'}
                                    onChange={(val) => { setReservoirId(val) }}
                                >
                                    <Select.Option
                                        value="1"
                                    >
                                        库区1
                                    </Select.Option>
                                    <Select.Option
                                        value="2"
                                    >
                                        库区12
                                    </Select.Option>
                                    <Select.Option
                                        value="3"
                                    >
                                        库区13
                                    </Select.Option>
                                </Select>
                            </div>
                        </div>
                        <div className="item">
                            <div className='tip'>炉批号<span>*</span></div>
                            <div className='info'>
                                <Input
                                    placeholder='请输入'
                                    value={furnaceBatchNo}
                                    onChange={(e) => {
                                        setFurnaceBatchNo(e.target.value)
                                    }}
                                ></Input>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}