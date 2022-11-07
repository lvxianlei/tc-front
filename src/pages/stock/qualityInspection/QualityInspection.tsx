import React, { useState } from 'react';
import { Button, Form, Modal, InputNumber, message, Space } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';

interface IOteherParameters {
    readonly description?: string;
    readonly id?: string;
    readonly retaParam?: string;
    readonly reteName?: string;
}

export default function SetOutTaskList(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const history = useHistory();
    
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'configValue',
            title: '内容策略',
            width: 150,
            dataIndex: 'configValue'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space>
                <Button type="link" onClick={ async () => {
                    await RequestUtil.put(`/tower-storage/settingConfig/on/${record?.id}`)
                    message.success('开启成功！')
                    history.go(0)
                } } disabled={record?.takeEffect===1}>开启</Button>
                <Button type="link" onClick={ async () => {
                    await RequestUtil.put(`/tower-storage/settingConfig/off/${record?.id}`)
                    message.success('关闭成功！')
                    history.go(0)
                } } disabled={record?.takeEffect===2}>关闭</Button>
                </Space>
            )
        }
    ]



    
    const [ detailData, setDetailData ] = useState<IOteherParameters>({});  
    const [ form ] = Form.useForm();
    const [ visible, setVisible ] = useState(false);

    return <>
        <Page
            path="/tower-storage/settingConfig"
            columns={ columns }
            headTabs={ [] }
            refresh={ refresh }
            extraOperation={
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
            }
            searchFormItems={ [] }
        />
    </>
}