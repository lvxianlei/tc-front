
/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作中心管理
 */

import React, { useRef, useState } from 'react';
import { Space, Input, Button, Modal, Popconfirm, message } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import { EditRefProps } from '../IWorkshopPlanBasic';
import Edit from "./WorkCenterSetting"
import { useHistory } from 'react-router';

export default function ProcessMngt(): React.ReactNode {
    const columns = [
        {
            key: 'code',
            title: '编码',
            width: 150,
            dataIndex: 'code'
        },
        {
            key: 'workCenterName',
            title: '工作中心名称',
            dataIndex: 'workCenterName',
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
                    <Button type="link" onClick={() => {
                        // setVisible(true);
                        // setType('edit');
                        // setDetailedId(record.id);
                        history.push(`/workshopPlanBasic/workCenterMngt/edit/${record?.id}`)
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-aps/work/center/info/${record.id}`).then(res => {
                                message.success('删除成功');
                                setRefresh(!refresh);
                            });
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

    

    const [refresh, setRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const history = useHistory();
    const [filterValue, setFilterValue] = useState({});
    const [type, setType] = useState<'new' | 'edit'>('new');
    const editRef = useRef<EditRefProps>();
    const [detailedId, setDetailedId] = useState<string>('');
    return (
        <>
            {/* <Modal
                destroyOnClose
                visible={visible}
                width="60%"
                title={type === "new" ? "创建" : "编辑"}
                onOk={handleModalOk}
                onCancel={() => {
                    editRef.current?.resetFields()
                    setType('new');
                    setDetailedId('');
                    setVisible(false);
                }}>
                <Edit type={type} ref={editRef} id={detailedId} />
            </Modal> */}
            <Page
                path="/tower-aps/work/center/info"
                columns={columns}
                headTabs={[]}
                extraOperation={<Button type="primary" onClick={() => { 
                    // setVisible(true); 
                    // setType('new'); 
                    history.push(`/workshopPlanBasic/workCenterMngt/add`)
                }}>新增</Button>}
                refresh={refresh}
                searchFormItems={[
                    {
                        name: 'workCenterName',
                        label: '',
                        children: <Input placeholder="工作中心名称" />
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={(values: Record<string, any>) => {
                    setFilterValue(values);
                    return values;
                }}
            />
        </>
    )
}