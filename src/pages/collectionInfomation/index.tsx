/***
 * 回款信息
 * 2021/11/22
 */
import React, { useState, useRef } from 'react';
import { Button, Input, DatePicker, Radio, message, Modal, Popconfirm, Upload } from 'antd'
import useRequest from '@ahooksjs/use-request'
import { useHistory } from 'react-router-dom'
import { Page } from '../common'
import { collectionListHead, approvalStatus } from "./collectionColumn.json"
import RequestUtil from '../../utils/RequestUtil';
import AuthUtil from '../../utils/AuthUtil';
import { downloadTemplate } from '../workMngt/setOut/downloadTemplate';
import AddModal from './addModal'; // 新增
import OverView from './overView'; // 查看
interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function CollectionInfomation(): React.ReactNode {
    const history = useHistory()
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [confirmStatus, setConfirmStatus] = useState<number>(1);
    const [visible, setVisible] = useState(false);
    const [ visibleOverView, setVisibleOverView ] = useState<boolean>(false);
    const addRef = useRef<EditRefProps>()
    const confirmed = [{ "title": "备注", "dataIndex": "description"}],
        confirmedEnd = [
            { "title": "回款类型", "dataIndex": "returnType" },
            { "title": "确认日期", "dataIndex": "confirmTime" },
            { "title": "备注", "dataIndex": "description" }
        ]
    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-finance/backMoney/${id}`)
            resole(result)
            setVisibleOverView(true);
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 查询按钮
    const onFilterSubmit = (value: any) => {
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
    }

    // 新增回调
    const handleOk  = () => new Promise(async (resove, reject) => {
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
    　　var f_x = Math.round(100 * Number(x))/100;  
    　　var s_x = f_x.toString();  
    　　var pos_decimal = s_x.indexOf('.');  
    　　if (pos_decimal < 0)  {  
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
            <Page
                path="/tower-finance/backMoney"
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...collectionListHead.map((item: any) => {
                        if (item.dataIndex === 'confirmStatus') {
                            return ({
                                title: item.title,
                                dataIndex: 'confirmStatus',
                                width: 50,
                                render: (_: any, record: any): React.ReactNode => (<span>{record.confirmStatus === 1 ? '待确认' : '已确认'}</span>)
                            })
                        }
                        if (item.dataIndex === "payMoney") {
                            return ({
                                title: item.title,
                                dataIndex: 'payMoney',
                                width: 50,
                                render: (_: any, record: any): React.ReactNode => (<span>{record.payMoney ? changeTwoDecimal_f(record.payMoney) : ''}</span>)
                            })
                        }
                        return item;
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 100,
                        render: (_: any, record: any) => {
                            return (
                                <>
                                    <Button type="link" onClick={() => getUser(record.id)}>查看</Button>
                                    {record.confirmStatus === 1 && (
                                       <Popconfirm
                                            title="您确定删除该条回款信息?"
                                            onConfirm={ () => {
                                                RequestUtil.delete(`/tower-finance/backMoney/${record.id}`).then(res => {
                                                    setRefresh(!refresh); 
                                                });
                                            } }
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <Button type="link">删除</Button>
                                        </Popconfirm>
                                    )}
                                </>
                            )
                        }
                    }]}
                refresh={ refresh }
                extraOperation={
                    <div style={{display: 'flex', flexWrap: 'nowrap', justifyContent: 'spance-between'}}>
                        <div>
                            <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                                {approvalStatus.map((item: any, index: number) => <Radio.Button value={item.value} key={`${index}_${item.value}`}>{item.label}</Radio.Button>)}
                            </Radio.Group>
                        </div>
                        <div style={{marginLeft: '1200px'}}>
                            <Button type="primary" style={{marginRight: 20}} onClick={() => setVisible(true)}>新增</Button>
                            <Upload 
                                accept=".xls,.xlsx"
                                action={ () => {
                                    const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                                    return baseUrl+'/tower-finance/backMoney/importBackMoney'
                                } } 
                                headers={
                                    {
                                        'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                                        'Tenant-Id': AuthUtil.getTenantId(),
                                        'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                                    }
                                }
                                showUploadList={ false }
                                onChange={ (info) => {
                                    if(info.file.response && !info.file.response?.success) {
                                        message.warning(info.file.response?.msg)
                                    }else if(info.file.response && info.file.response?.success){
                                        message.success('导入成功！');
                                        setRefresh(!refresh);
                                    }
                                    
                                } }
                            >
                                <Button type="primary" ghost>导入</Button>
                            </Upload>
                            <Button type="link" onClick={() => downloadTemplate('/tower-finance/backMoney/exportBackMoney', '回款信息管理导入模板') }>下载导入模板</Button>
                        </div>
                    </div>
                }
                onFilterSubmit={onFilterSubmit}
                filterValue={{ confirmStatus }}
                searchFormItems={[
                    {
                        name: 'payCompany',
                        children: <Input placeholder="请输入来款单位进行查询" style={{ width: 300 }} />
                    },
                    {
                        name: 'startRefundTime',
                        label: '来款日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    }
                ]}
            />
            {/* 新增 */}
            <Modal
                title={'新增回款信息'}
                visible={visible}
                width={1000}
                onCancel={() => {
                    addRef.current?.resetFields();
                    setVisible(false);
                }}
                  footer={[
                    <Button key="submit" type="primary" onClick={() => handleOk()}>
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
                    <AddModal ref={addRef}/>
                </Modal>
            {/* 查看 */}
            <OverView
                title={confirmStatus === 1 ? confirmed : confirmedEnd}
                visible={visibleOverView}
                userData={userData}
                onCancel={() => setVisibleOverView(false)}
            />
        </>
    )
}