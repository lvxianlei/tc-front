/**
 * 查看回款信息
 */
import React from 'react';
import { Modal, Form, Button } from 'antd';
import { BaseInfo, DetailTitle, CommonTable } from '../common';
import { overViewColunms, contractInformation } from './collectionColumn.json';
import { OverViewProps } from './collection';
export default function OverView(props: OverViewProps): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    // 取消
    const handleCancle = () => {
        addCollectionForm.resetFields();
        props.onCancel && props.onCancel();
    }
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
            <DetailTitle title="基本信息" />
            <BaseInfo
                form={addCollectionForm}
                dataSource={props.userData || {}}
                col={ 2 }
                columns={[
                    ...overViewColunms,
                    ...props.title
                ]}
            />
            <DetailTitle title="合同信息" />
            <CommonTable columns={contractInformation} dataSource={[]} pagination={ false }/>
        </Modal>
    )
}