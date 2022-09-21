import React, { useRef, useState } from 'react';
import { Spin, Button, Space, Form, Input, message, Col, Row, Radio, InputNumber, Checkbox, DatePicker, Table, Modal, Popconfirm } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DetailTitle, DetailContent, AttachmentRef, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import Dept from './Dept';
import { FixedType } from 'rc-table/lib/interface';
import moment from 'moment';
// import styles from './AnnouncementMngt.module.less';
// import { IAnnouncement, IStaffList } from './AnnouncementMngt';
// import SelectUserTransfer from './SelectUserTransfer';
// import { IStaff } from '../dept/staff/StaffMngt';
// import SelectGroup from './SelectGroup';
export default function AnnouncementNew(): React.ReactNode {
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const attachRef = useRef<AttachmentRef>()
    // const [attachInfo, setAttachInfo] = useState<FileProps[]>([]);
    const location = useLocation<{ type: string }>();
    const [staffList, setStaffList] = useState<any[]>([]);
    const [detailData, setDetailData] = useState<any>({});
    const [isProblem, setIsProblem] = useState<any>([]);
    const [editorState, setEditorState] = useState<any>('<p></p>');
    const history = useHistory();
    const [shiftList, setShiftList] = useState<any[]>([]);
    const [visible,setVisible] =  useState<boolean>(false);
    const [title,setTitle] = useState<string>('新增');
    const params = useParams<{ id: string }>();
    const { loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
            form.setFieldsValue({

            })
            resole({});
    }), {})
    const [selectKeys, setSelectKeys] = useState<React.Key[]>([]);
    const [selectRows, setSelectRows] = useState<any[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectKeys(selectedRowKeys);
        setSelectRows(selectedRows)
    }
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const tableColumns = [
        {
            key: 'shiftName',
            title: '班次',
            dataIndex: 'shiftName',
            width: 210,
        },
        {
            key: 'startTime',
            title: '上班时间',
            dataIndex: 'startTime',
            width: 210,
        },
        {
            key: 'endTime',
            title: '下班时间',
            dataIndex: 'endTime',
            width: 210,
        },
        {
            key: 'defaultShift',
            title: '默认班次',
            dataIndex: 'defaultShift',
            width: 210,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Radio
                    key={record.structureId}
                    checked={shiftList && shiftList[index].defaultShift === 1}
                    onChange={(e) => {
                        let newShiftList: any[] = shiftList || [];
                        if (e.target.checked) {
                            newShiftList = newShiftList.map((item: any, ind: number) => {
                                if (index === ind) {
                                    return {
                                        ...item,
                                        defaultShift: 1
                                    }
                                } else {
                                    return {
                                        ...item,
                                        defaultShift: 0
                                    }
                                }
                            })
                        } else {
                            newShiftList[index] = {
                                ...newShiftList[index],
                                defaultShift: 0
                            }
                        }
                        setShiftList([...newShiftList])
                    }}></Radio>
            )
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 100,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={async ()=>{
                        setVisible(true)
                        console.log(record)
                        console.log(moment(record?.startTime))
                        setTitle('编辑')
                        formRef.setFieldsValue({
                            ...record,
                            startTime: record?.startTime?moment(record?.startTime,'HH:mm:ss'):'',
                            endTime: record?.endTime?moment(record?.endTime,'HH:mm:ss'):''
                        })
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={async () => {
                            shiftList.splice(index,1)
                            setShiftList([...shiftList])
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]
    return <>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" >
                <Button key="saveC" type="primary" onClick={async () => {
                    await form.validateFields();
                    const value = form.getFieldsValue(true);
                    if(selectKeys.length===0){
                        return message.error('未选择班次!')
                    }
                    if(!(shiftList.map((item:any)=>{return item?.defaultShift?item?.defaultShift:0}).indexOf(1)>-1)){
                        return message.error('未选择默认班次!')
                    }
                    if(value.calendar){
                        const formatDate = value.calendar.map((item: any) => item.format("YYYY-MM-DD"))
                        value.startCalendar = formatDate[0] + ' 00:00:00';
                        value.endCalendar = formatDate[1] + ' 23:59:59';
                        // delete value.calendar
                    }
                    if(value?.weekStatus){
                        const res:any[]=[0,0,0,0,0,0,0]
                        const newRes = res.map((item:any,index:number)=>{
                            if(value?.weekStatus.indexOf(index+1)>-1){
                                return 1
                            }else{
                                return 0
                            }

                        })
                        value.status = newRes 
                    }
                   
                    
                    await RequestUtil.post(`/tower-as/calendar`,{
                        ...value,
                        weekStatus:value.status,
                        calendarShiftDTOS:shiftList.map((item:any)=>{
                            return {
                                ...item,
                                shiftStatus: item.index===selectKeys[0]?1:2,
                                defaultShift:item?.defaultShift?item?.defaultShift:0
                            }
                        })
                    }).then(()=>{
                        message.success('保存成功！')
                        history.goBack()
                    })
                }}>保存</Button>
                <Button key="cancel" type="ghost" onClick={() => history.goBack()}>取消</Button>
            </Space>
        ]}>
             <Form form={form} labelCol={{ span: 2 }} wrapperCol={{span:20}}>
                <DetailTitle title="基本信息" key={1} />
                <Form.Item name="calendar" label="日期"   rules={[{
                    "required": true,
                    "message": "请选择日期"
                }]}>
                    <DatePicker.RangePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item name="companyName" label="公司"  initialValue={'汇金通'} rules={[{
                    "required": true,
                    "message": "请选择公司"
                }]}>
                    <Input  maxLength={20} disabled/>
                </Form.Item>
                <Form.Item name="deptId" label=""  style={{display:'none'}}>
                    <Input  type='hidden'/>
                </Form.Item>
                <Form.Item name="deptName" label="部门"  rules={[{
                    "required": true,
                    "message": "请选择部门"
                }]}>
                    <Input addonBefore={
                        <Dept onSelect={(selectRows: any[]) => {
                            console.log(selectRows)
                            form.setFieldsValue({ deptName: selectRows[0].name,deptId: selectRows[0].id });
                            setDetailData({ ...detailData, deptName: selectRows[0].name,deptId: selectRows[0].id })
                        }} selectedKey={[detailData?.deptId]||[]} />
                    } disabled />
                </Form.Item>
                <Form.Item name="weekStatus" label="工作日设置"  rules={[{
                    "required": true,
                    "message": "请设置工作日"
                }]}>
                    <Checkbox.Group>
                        <Checkbox value={1}>星期一</Checkbox>
                        <Checkbox value={2}>星期二</Checkbox>
                        <Checkbox value={3}>星期三</Checkbox>
                        <Checkbox value={4}>星期四</Checkbox>
                        <Checkbox value={5}>星期五</Checkbox>
                        <Checkbox value={6}>星期六</Checkbox>
                        <Checkbox value={7}>星期日</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                <DetailTitle title="班次设置" key={1} operation={[<Button type='primary'
                   onClick={()=>{
                        setVisible(true)
                        setTitle('新增')
                   }}
                >新增</Button>]}/>
                <CommonTable
                    rowKey="index"
                    dataSource={[...shiftList]}
                    pagination={false}
                    columns={tableColumns}
                    rowSelection={{
                        selectedRowKeys: selectKeys,
                        type: "radio",
                        onChange: SelectChange,
                    }}
                />
                <Modal
                    visible={visible}
                    title={ title}
                    onCancel={() => {
                        setTitle('新增')
                        setVisible(false)
                        formRef.resetFields()
                    }}
                    onOk={async () => {
                        await formRef.validateFields()
                        const value = await formRef.getFieldsValue(true)
                        value.startTime = value?.startTime.format('HH:ss:mm')
                        value.endTime = value?.endTime.format('HH:ss:mm')
                        setVisible(false)
                        if(title==='新增'){
                            shiftList.push({
                                ...value,
                                index: shiftList.length
                            })
                        }else{
                            shiftList.splice(value?.index,1)
                            shiftList.push(value)
                        }
                        setShiftList(
                            [...shiftList]
                        )
                    
                        formRef.resetFields()
                        setTitle('新增')
                    }}
                >
                    <Form form={formRef}>
                        <Form.Item name="id" style={{display:'none'}}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="shiftName" label='班次名称' rules={[{
                            "required": true,
                            "message": "请输入班次名称"
                        }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="startTime" label='上班时间' rules={[{
                            "required": true,
                            "message": "请选择上班时间"
                        }]}>
                            <DatePicker.TimePicker/>
                        </Form.Item>
                        <Form.Item name="endTime" label='下班时间' rules={[{
                            "required": true,
                            "message": "请选择下班时间"
                        }]}>
                            <DatePicker.TimePicker/>
                        </Form.Item>
                    </Form>
                </Modal>
            </Form>
        </DetailContent>
    </>
}