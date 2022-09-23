/**
 * @author zyc
 * @copyright © 2022 
 * @description 驾驶舱-放样人员画像-正确率设置
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Button, Form, Input, InputNumber, Space } from 'antd';
import { CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { FixedType } from 'rc-table/lib/interface';
import styles from './PersonnelPortrait.module.less';

interface modalProps {
    readonly record?: any;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: any;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input size="small" />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `请输入 ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default forwardRef(function CorrectSetting({ record }: modalProps, ref) {
    const [editingKey, setEditingKey] = useState('');
    const [form] = Form.useForm();

    const correctColumns = [
        {
            "key": "name",
            "title": "项目",
            "dataIndex": "name",
            "editable": false
        },
        {
            "key": "parameter",
            "title": "参数",
            "dataIndex": "parameter",
            "editable": true
        },
        {
            "key": "status",
            "title": "状态",
            "dataIndex": "status",
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Button type="link" onClick={() => changeStatus(record)}>{record?.statusName}</Button>
            )
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    {isEditing(record) ? (
                        <Space direction="horizontal" size="small" className={styles.operationBtn}>
                            <Button type="link" onClick={() => onSubmit(record.id)}>保存</Button>
                            <Button type="link" onClick={cancel}>取消</Button>
                        </Space>
                    ) : (
                        <Button type="link" onClick={() => editRow(record)} disabled={!(editingKey === '')}>编辑</Button>
                    )}
                </Space>
            )
        }
    ]

    const { loading, data, run } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/loftingUserWork/getAccuracyConfig`);
        resole(data);
    }), {})

    const changeStatus = (record: Record<string, any>) => {
        RequestUtil.post(`/tower-science/loftingUserWork/updateAccuracyConfig`, [{
            id: record.id,
            name: record.name,
            parameter: record.parameter,
            status: record.status === 0 ? 1 : 0
        }]).then(res => {
            run()
        })
    }

    const mergedColumns = correctColumns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Record<string, any>) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const isEditing = (record: Record<string, any>) => record.id === editingKey;

    const editRow = (record: Record<string, any>) => {
        form.setFieldsValue({ ...record, id: record.id });
        setEditingKey(record.id);
    }

    const cancel = () => {
        setEditingKey('');
    };

    const onSubmit = (key: React.Key) => new Promise(async (resolve, reject) => {
        try {
            const row = form.getFieldsValue(true);
            resolve(
                saveRun([{
                    id: row.id,
                    name: row.name,
                    parameter: row.parameter,
                    status: row.status,
                }])
            );
        } catch (error) {
            reject(false)
        }
    })

    const { run: saveRun } = useRequest((data: any) => new Promise(async (resove, reject) => {
        try {
            RequestUtil.post(`/tower-science/loftingUserWork/updateAccuracyConfig`, data).then(res => {
                setEditingKey('');
                run();
            })
            resove(true)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit]);

    return <>
        <Form form={form}>
            <CommonTable
                columns={mergedColumns}
                dataSource={data}
                pagination={false}
                changeHeight={false}
                scroll={{ y: 200 }}
                components={{
                    body: {
                        cell: EditableCell,
                    }
                }}
            />
        </Form>
    </>

})

