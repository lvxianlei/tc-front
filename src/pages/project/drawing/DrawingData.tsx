import React from "react"
import RequestUtil from '../../../utils/RequestUtil'
import { IClient } from '../../IClient'
import { Link, useHistory } from 'react-router-dom'
import { Space, Button, Input, DatePicker, Select, message } from 'antd'
import ConfirmableButton from '../../../components/ConfirmableButton'
import localeValues from "antd/es/locale/zh_CN"


 const columns = [
    {
        key: 'taskNumber',
        title: '任务编号',
        dataIndex: 'taskNumber',
    },
    {
        key: 'projectName',
        title: '工程名称',
        dataIndex: 'projectName',
        isResizable: true,
        width: 120,
        render: (_a: any, _b: any) => <Link to={`/project/management/detail/base/${_b.id}`}>{_b.projectName}</Link>
    },
    {
        key: 'internalNumber',
        title: '内部合同编号',
        dataIndex: 'internalNumber'
    },
    {
        key: 'contractName',
        title: '合同名称',
        dataIndex: 'contractName'
    },
    {
        key: 'serviceManager',
        title: '业务经理',
        dataIndex: 'serviceManager'
    },
    {
        key: 'refuseMsg',
        title: '拒绝原因',
        dataIndex: 'refuseMsg',
        // render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{projectType.find(item => item.value === Number(_a))?.label}</span>)
    },
    {
        key: 'auditStatus',
        title: '状态',
        dataIndex: 'auditStatus',
        // render: (_a: number) => <span>{currentProjectStage.find(item => item.value === _a)?.label}</span>
    },
    {
        key: 'createUserName',
        title: '制单人',
        dataIndex: 'createUserName'
    },
    {
        key: 'createTime',
        title: '制单时间',
        dataIndex: 'createTime'
    },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        render: (_: undefined, record: object): React.ReactNode => (
            <Space direction="horizontal" size="small">
                <Link to={`/project/drawing/details/${(record as IClient).id}`}>查看</Link>
                <Link to={`/project/drawing/new/${(record as IClient).id}`}>编辑</Link>
                <ConfirmableButton
                    confirmTitle="是否确定删除对应项目信息？"
                    type="link"
                    placement="topRight"
                    onConfirm={async () => {
                        const result = await RequestUtil.delete(`/tower-market/projectInfo?id=${(record as IClient).id}`)
                        if (result) {
                            message.success("项目成功删除...")
                        }
                    }}>
                    删除
                </ConfirmableButton>
            </Space>
        )
    }
]

export default columns
    
