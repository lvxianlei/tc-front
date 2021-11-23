/**
 * 查看回款信息
 */
import React from 'react';
import { Modal, Form, Button } from 'antd';
import { BaseInfo } from '../common';
import { overViewColunms } from './collectionColumn.json';

export default function OverView(props: any): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    // 取消
    const handleCancle = () => {
        addCollectionForm.resetFields();
        props.onCancel && props.onCancel();
    }
    console.log(props.title)
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
                columns={[
                    ...overViewColunms,
                    ...props.title.map((item: any) => {
                        if (item.dataIndex === 'returnType') {
                            return ({
                                title: item.title,
                                dataIndex: 'returnType',
                                width: 50,
                                render: (_: any, record: any): React.ReactNode => (<span>{record.returnType === 0 ? '投标保证金' : '合同应收款'}</span>)
                            })
                        }
                        return item;
                    }),
                ]}
            />
        </Modal>
    )
}