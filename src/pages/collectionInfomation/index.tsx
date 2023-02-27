/***
 * 回款信息
 * 2021/11/22
 */
import React, { useState, useRef } from 'react';
import { Button, Input, DatePicker, Radio, message, Modal, Popconfirm, Upload, Select } from 'antd'
import useRequest from '@ahooksjs/use-request'
import { useHistory } from 'react-router-dom'
import { SearchTable } from '../common'
import { collectionListHead, approvalStatus } from "./collectionColumn.json"
import RequestUtil from '../../utils/RequestUtil';
import AuthUtil from '../../utils/AuthUtil';
import AddModal from './addModal'; // 新增
import OverView from './overView'; // 查看
import { EditRefProps, Contract } from './collection';
import { collectionTypeeOptions } from '../../configuration/DictionaryOptions';
import { exportDown } from "../../utils/Export";

export default function CollectionInfomation(): React.ReactNode {
    const history = useHistory()
    const [refresh, setRefresh] = useState<boolean>(false);
    const [clearSearch, setClearSearch] = useState<boolean>(false);
    const [confirmStatus, setConfirmStatus] = useState<number>(1);
    const [visible, setVisible] = useState(false);
    const [editId, setEditId] = useState("new")
    const [visibleOverView, setVisibleOverView] = useState<boolean>(false);
    const [contractList, setContractList] = useState<Contract[]>([]);
    const addRef = useRef<EditRefProps>()

    const confirmed = [
        { "title": "备注", "dataIndex": "description" }
    ],
        confirmedEnd = [
            { "title": "回款类型", "dataIndex": "returnType" },
            { "title": "确认日期", "dataIndex": "confirmTime" },
            { "title": "备注", "dataIndex": "description" }
        ]

    // 查看的数据
    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-finance/backMoney/${id}`)
            resole(result)
            setVisibleOverView(true);
            setContractList(result.contractList || [])
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        // 来款日期
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startPayTime = `${formatDate[0]} 00:00:00`
            value.endPayTime = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime;
        }
        value["confirmStatus"] = confirmStatus;
        return value
    }

    // tab切换
    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
        setClearSearch(!clearSearch);
    }

    // 新增回调
    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onSubmit()
            message.success("回款信息新增成功...")
            setVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const changeTwoDecimal_f = (x: string) => {
        var f_x = parseFloat(x);
        if (isNaN(f_x)) return 0;
        var f_x = Math.round(100 * Number(x)) / 100;
        var s_x = f_x.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        return s_x;
    }

    return (
        <>
            <SearchTable
                path="/tower-finance/backMoney"
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => {
                            return (
                                <span>{index + 1}</span>
                            )
                        }
                    },
                    ...collectionListHead.map((item: any) => {
                        if (item.dataIndex === "payMoney") {
                            return ({
                                title: item.title,
                                dataIndex: item.dataIndex,
                                width: 150,
                                render: (_: any, record: any): React.ReactNode => {
                                    return (
                                        <span>{record.payMoney ? changeTwoDecimal_f(record.payMoney) : ''}</span>
                                    )
                                }
                            })
                        }
                        if (item.dataIndex === "abroadMoney") {
                            return ({
                                title: item.title,
                                dataIndex: item.dataIndex,
                                width: 150,
                                render: (_: any, record: any): React.ReactNode => {
                                    return (
                                        <span>{record.abroadMoney ? changeTwoDecimal_f(record.abroadMoney) : ''}</span>
                                    )
                                }
                            })
                        }
                        return item;
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 140,
                        render: (_: any, record: any) => {
                            return (
                                <>
                                    <Button
                                        type="link"
                                        className="btn-operation-link"
                                        onClick={() => getUser(record.id)}
                                    >查看</Button>
                                    <Button
                                        type="link"
                                        className="btn-operation-link"
                                        onClick={() => {
                                            setEditId(record.id)
                                            setVisible(true)
                                        }}
                                    >编辑</Button>
                                    {record.confirmStatus === 1 && (
                                        <Popconfirm
                                            title="您确定删除该条回款信息?"
                                            onConfirm={() => {
                                                RequestUtil.delete(`/tower-finance/backMoney/${record.id}`).then(res => {
                                                    setRefresh(!refresh);
                                                });
                                            }}
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <Button className="btn-operation-link" type="link">删除</Button>
                                        </Popconfirm>
                                    )}
                                </>
                            )
                        }
                    }]}
                refresh={refresh}
                clearSearch={clearSearch}
                extraOperation={
                    <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'spance-between' }}>
                        <div>
                            <Radio.Group
                                defaultValue={confirmStatus}
                                onChange={operationChange}
                            >
                                {approvalStatus.map((item: any, index: number) => {
                                    return <Radio.Button
                                        value={item.value}
                                        key={`${index}_${item.value}`}
                                    >{item.label}</Radio.Button>
                                })}
                            </Radio.Group>
                        </div>
                        {
                            confirmStatus === 1 && (
                                <div style={{ marginLeft: '20px' }}>
                                    <Button
                                        type="primary"
                                        style={{ marginRight: 12 }}
                                        onClick={() => {
                                            setEditId("new")
                                            setVisible(true)
                                        }}
                                    >新增</Button>
                                    <Upload
                                        accept=".xls,.xlsx"
                                        action={() => {
                                            const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                                            return baseUrl + '/tower-finance/backMoney/importBackMoney'
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
                                                setRefresh(!refresh);
                                            }

                                        }}
                                    >
                                        <Button type="primary" ghost>导入</Button>
                                    </Upload>
                                    <Button
                                        type="primary"
                                        ghost
                                        style={{ marginLeft: 12 }}
                                        onClick={() => {
                                            exportDown("/tower-finance/backMoney/exportBackMoney", "POST", {}, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "回款信息管理导入模板")
                                        }
                                        }>下载导入模板</Button>
                                </div>
                            )
                        }
                    </div>
                }
                onFilterSubmit={onFilterSubmit}
                filterValue={{ confirmStatus: confirmStatus }}
                searchFormItems={[
                    {
                        name: 'returnType',
                        label: '回款类型',
                        children: (
                            <Select placeholder="请选择回款类型" style={{ width: "140px" }}>
                                {collectionTypeeOptions && collectionTypeeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select>
                        )
                    },
                    {
                        name: 'startRefundTime',
                        label: '来款日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'payCompany',
                        children: <Input placeholder="请输入来款单位进行查询" style={{ width: 300 }} />
                    },
                ]}
            />
            {/* 新增 */}
            <Modal
                title={`${editId === "new" ? "新增" : "编辑"}回款信息`}
                visible={visible}
                width={1000}
                maskClosable={false}
                onCancel={() => {
                    addRef.current?.resetFields();
                    setVisible(false);
                }}
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => handleOk()}
                    >
                        提交
                    </Button>,
                    <Button key="back" onClick={() => {
                        addRef.current?.resetFields();
                        setVisible(false)
                    }}>
                        取消
                    </Button>
                ]}
            >
                <AddModal ref={addRef} editId={editId} />
            </Modal>
            {/* 查看 */}
            <OverView
                title={confirmStatus === 1 ? confirmed : confirmedEnd}
                visible={visibleOverView}
                userData={userData}
                contractList={contractList}
                status={confirmStatus}
                onCancel={() => setVisibleOverView(false)}
            />
        </>
    )
}