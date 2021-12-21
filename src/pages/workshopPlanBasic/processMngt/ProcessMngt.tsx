/**
 * @author zyc
 * @copyright © 2021 
 * @description 生产工序管理
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Select, Form, Popconfirm, message } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import { useHistory } from 'react-router-dom';
import styles from './WorkshopEquipmentMngt.module.less';
import { IDetailData } from '../IWorkshopPlanBasic';



export default function ProcessMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ title, setTitle ] = useState('新增');
    const [ form ] = Form.useForm();
    const [ detailData, setDetailData ] = useState<IDetailData>({});
    const history = useHistory();

    const columns = [
        {
            key: 'name',
            title: '产线名称',
            width: 150,
            dataIndex: 'name'
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
                        setVisible(true);
                        setTitle("编辑");
                        getList(record.id);
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-production/productionLines/remove?id=${ record.id }`).then(res => {
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
                id: detailData.id,
            }
            RequestUtil.post<IDetailData>(`/tower-production/productionLines/submit`, { ...value }).then(res => {
                message.success('保存成功！');
                setVisible(false);
                setRefresh(!refresh);
                setDetailData({});
                form.setFieldsValue({ name: '', id: '' });
            });
        })
    }

    const cancel = () => {
        setDetailData({});
        form.setFieldsValue({ name: '', id: '' });
        setVisible(false);
    }

    const getList = async (id: string) => {
        const data = await RequestUtil.get<IDetailData>(`/tower-production/productionLines/detail?id=${ id }`);
        setDetailData(data);
        form.setFieldsValue({...data})
    }

    return (
        <>
            <Page
                path="/tower-production/productionLines/page"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => {setVisible(true); setTitle("新增");} } ghost>新增</Button> }
                refresh={ refresh }
                searchFormItems={ [
                    {
                        name: 'productionLinesName',
                        label: '',
                        children: <Input placeholder="生产工序名称"/>
                    }
                ] }
                onFilterSubmit = { (values: Record<string, any>) => {
                    return values;
                } }
            />
            <Modal visible={ visible } width="40%" title={ title + "生产工序" } okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Form form={ form } labelCol={{ span: 4 }}>
                    <Form.Item name="name" label="生产工序名称" initialValue={ detailData.name } rules={[{
                            "required": true,
                            "message": "请输入生产工序名称"
                        },
                        {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                        }]}>
                        <Input placeholder="请输入" maxLength={ 50 } />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}