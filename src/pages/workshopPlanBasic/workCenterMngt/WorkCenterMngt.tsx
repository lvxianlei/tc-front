
/**
 * @author zyc
 * @copyright © 2021 
 * @description 工序管理
 */

import React, { useRef, useState } from 'react';
import { Space, Input, Button, Modal, Form, Table, Popconfirm, message, TreeSelect, InputNumber } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import useRequest from '@ahooksjs/use-request';
import { useHistory } from 'react-router';
import { EditRefProps, IDetailData, IWorkCenterMngt } from '../IWorkshopPlanBasic';
import Edit from "./WorkCenterSetting"

export default function ProcessMngt(): React.ReactNode {
    const columns = [
        {
            key: 'deptName',
            title: '编码',
            width: 150,
            dataIndex: 'deptName'
        },
        {
            key: 'createUserName',
            title: '工作中心名称',
            dataIndex: 'createUserName',
            width: 120
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 300,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={ () => {
                        getList(record.deptId);
                        setVisible(true);
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-production/workshopDept/remove?id=${ record.id }`).then(res => {
                                message.success('删除成功');
                                // setRefresh(!refresh);
                                history.go(0);
                            });
                        } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    

    const save = () => {
        form.validateFields().then(res => {
            let value = form.getFieldsValue(true);
            value = {
                ...value,
                deptId: value.deptId.split(',')[0],
                deptName: value.deptId.split(',')[1],
                deptProcessesList: value.deptProcessesDetailList
            }
            RequestUtil.post<IDetailData>(`/tower-production/workshopDept/submit`, { ...value }).then(res => {
                message.success('保存成功！')
                setVisible(false);
                setProcessList([]);
                setDetailData({});
                // setRefresh(!refresh);
                history.go(0);
                form.setFieldsValue({ deptId: '', deptProcessesDetailList: [] });
            });
        })
    }

    const cancel = () => {
        setVisible(false);
        form.setFieldsValue({ deptId: '', deptProcessesDetailList: [] });
        setProcessList([]);
        setDetailData({});
    }

    const getList = async (id: string) => {
        const data = await RequestUtil.get<IDetailData>(`/tower-production/workshopDept/detail?deptId=${ id }`);
        if(data?.id) {
            const newData = {
                ...data,
                deptId: data.deptId + ',' + data.deptName
            }
            setDetailData(newData);
            setProcessList(newData?.deptProcessesDetailList || []);
            form.setFieldsValue({ deptId: newData.deptId, deptProcessesDetailList: [...newData?.deptProcessesDetailList || []] })
        } else {
            setDetailData({});
            setProcessList([]);
            form.setFieldsValue({ deptProcessesDetailList: [] })
        }
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit()
            message.success(`票据${type === "new" ? "创建" : "编辑"}成功...`)
            setVisible(false)
            resove(true)
            history.go(0)
        } catch (error) {
            reject(false)
        }
    })

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ form ] = Form.useForm();
    const [ detailData, setDetailData ] = useState<IDetailData>({});
    const [ processList, setProcessList ] = useState<IWorkCenterMngt[]>([]);
    const [ filterValue, setFilterValue ] = useState({});
    const [ type, setType ] = useState<'new' | 'edit'>('new');
    const history = useHistory();
    const editRef = useRef<EditRefProps>();
    const [detailedId, setDetailedId] = useState<string>('');
    const { data } = useRequest<SelectDataNode[]>(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<SelectDataNode[]>(`/sinzetech-user/department/tree`);
        resole(data);
    }), {})
    const departmentData: any = data || [];
    return (
        <>
            <Modal
                destroyOnClose
                visible={visible}
                width="40%"
                title={type === "new" ? "创建" : "编辑"}
                onOk={handleModalOk}
                onCancel={() => {
                    editRef.current?.resetFields()
                    setType('new');
                    setDetailedId('');
                    setVisible(false);
                }}>
                <Edit type={type} ref={editRef} id={detailedId} />
            </Modal>
            <Page
                path="/tower-production/workshopDept/page"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => setVisible(true) } ghost>新增</Button> }
                refresh={ refresh }
                searchFormItems={ [
                    {
                        name: 'deptName',
                        label: '',
                        children: <Input placeholder="工作中心名称"/>
                    }
                ] }
                filterValue={ filterValue }
                onFilterSubmit = { (values: Record<string, any>) => {
                    setFilterValue(values);
                    return values;
                } }
            />
        </>
    )
}