/**
 * 查看回款信息
 */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, ModalFuncProps } from 'antd';
import { BaseInfo } from '../common';
import { overViewColunms } from './collectionColumn.json';

export default function OverView(props: ModalFuncProps): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [ columns, setColumns ] = useState(overViewColunms);
    // 取消
    const handleCancle = () => {
        addCollectionForm.resetFields();
        props.onCancel && props.onCancel();
    }

    useEffect(() => {
        if (props?.title) {
            setColumns([
                ...columns,
                {
                    "title": "备注",
                    "dataIndex": "payCompany"
                }
            ])
        } else {
            setColumns([
                ...columns,
                {
                    "title": "回款类型",
                    "dataIndex": "payCompany"
                },
                {
                    "title": "确认日期",
                    "dataIndex": "payCompany"
                },
                {
                    "title": "备注",
                    "dataIndex": "payCompany"
                }
            ])
        }
    }, [props?.title])

    return (
        <Modal
            title={'查看回款信息'}
            visible={props.visible}
            onCancel={handleCancle}
            maskClosable={false}
            width={800}
            footer={[
                <Button key="back" onClick={props?.onCancel}>
                取消
                </Button>
            ]}
        >
            <BaseInfo form={addCollectionForm} dataSource={{}} col={ 2 }
                columns={ columns }
            />
        </Modal>
    )
}