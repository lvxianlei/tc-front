import React, { useState } from 'react';
import { Modal, Button, Input, Select } from 'antd';
import { CommonTable } from '../../common';
import './associatedEmployees.less';
import { FileProps } from '../../common/Attachment';

const { Option } = Select;

interface Assciated {
    item: object,
    hanleCallBack?: () => void;
}
interface IAnnouncement {
    readonly id?: string;
    readonly title?: string;
    readonly content?: string;
    readonly state?: number;
    readonly updateTime?: string;
    readonly userNames?: string;
    readonly attachInfoDtos?: FileProps[];
    readonly attachVos?: FileProps[];
    readonly staffList?: string[];
}
const EmployeesColumns = [
    {
        key: 'index',
        title: '工号',
        dataIndex: 'nunmber',
    },
    {
        key: 'index',
        title: '姓名',
        dataIndex: 'nunmber',
    },
    {
        key: 'index',
        title: '手机号',
        dataIndex: 'nunmber',
    },
]
export default function AssociatedEmployees(props: Assciated): JSX.Element {
    const [ visible, setVisible ] = useState<boolean>(false);
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const handleClick = () => {
        console.log(props, '-----------------------------')
        setVisible(true);
    }
    const handleOk = () => {
        setVisible(false);
    }
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IAnnouncement[]): void => {
        console.log(selectedRowKeys, '-----', selectedRows)
        setSelectedKeys(selectedRowKeys);
    }
    return (
        <>
            <Button type="link" onClick={handleClick}>关联员工</Button>
            <Modal
                title={'关联员工'}
                visible={visible}
                width={1000}
                onCancel={() => {
                    setVisible(false);
                }}
                  footer={[
                    <Button key="submit" type="primary" onClick={() => handleOk()}>
                      提交
                    </Button>,
                    <Button key="back" onClick={() => {
                        setVisible(false);
                    }}>
                      取消
                    </Button>
                  ]}
            >
                {/* 查询条件 */}
                <div className="searchWrapper">
                    <div>
                        <Input placeholder="请输入工号/手机号/姓名" style={{ width: 120, marginRight: 10 }} />
                        <Select defaultValue="lucy" style={{ width: 120 }}>
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                        </Select>
                    </div>
                    <div>
                        <Button type='primary' style={{marginRight: 10}}>查询</Button>
                        <Button type='primary' ghost>重置</Button>
                    </div>
                </div>
                <CommonTable
                    columns={EmployeesColumns}
                    rowSelection = {{
                        type: 'radio',
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }}
                    dataSource={[
                        {nunmber: 2020, id: 1},
                        {nunmber: 2020, id: 2},
                        {nunmber: 2020, id: 3}
                    ]}
                />
            </Modal>
        </>
    )
}
