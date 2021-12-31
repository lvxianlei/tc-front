import React, { useState } from 'react';
import { Button, Form, Modal, InputNumber, message } from 'antd';
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
            key: 'rateName',
            title: '名称',
            width: 150,
            dataIndex: 'rateName'
        },
        {
            key: 'rateParam',
            title: '参数',
            dataIndex: 'rateParam',
            width: 120
        },
        {
            key: 'description',
            title: '说明',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Button type="link" onClick={ () => showModal(record.id) }>编辑</Button>
            )
        }
    ]

    const showModal = async (id: string) => {
        const data = await RequestUtil.get<IOteherParameters>(`/tower-supply/materialRate/${ id }`);
        setDetailData(data);
        form.setFieldsValue({...data});
        setVisible(true);
    }

    const close = () => {
        setVisible(false); 
        setDetailData({}); 
        form.resetFields();
    }

    const save = () => {
        if(form) {
            form.validateFields().then(res => {
                const values = form.getFieldsValue(true);
                RequestUtil.put('/tower-supply/materialRate', {
                    ...detailData,
                    ...values
                }).then(res => {
                    close();
                    setRefresh(!refresh);
                    message.success('保存成功');
                })
            })
        }
    }
    
    const [ detailData, setDetailData ] = useState<IOteherParameters>({});  
    const [ form ] = Form.useForm();
    const [ visible, setVisible ] = useState(false);

    return <>
        <Page
            path="/tower-supply/materialRate"
            columns={ columns }
            headTabs={ [] }
            refresh={ refresh }
            extraOperation={<Button type="ghost" onClick={() => history.goBack()}>返回</Button>}
            searchFormItems={ [] }
        />
        <Modal visible={ visible } title="编辑" onCancel={ close } onOk={ save }>
            <Form form={ form }>
                <Form.Item label="税率参数" name="rateParam" rules={[{
                        required: true,
                        message: '请输入税率参数'
                    }]}>
                    <InputNumber min={ 0 } step="0.01" precision={ 2 } max={ 99.99 } style={{ width: '100%' }}/>
                </Form.Item>
            </Form>
        </Modal>
    </>
}