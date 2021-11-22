/**
 * 新增回款信息
 */
import React, { useState } from 'react';
import { Modal, Form, ModalFuncProps } from 'antd';
import { BaseInfo } from '../common';
import { baseColums } from './collectionColumn.json';

export default function AddModal(props: ModalFuncProps): JSX.Element {
    const [addCollectionForm] = Form.useForm();

    // 提交
    const handleSure = async () => {
        const postData = await addCollectionForm.validateFields();
        console.log(postData, 'post')
        props.onOk && props.onOk();
    }

    return (
        <Modal
          title={props.title ? '新增回款信息' : '查看回款信息'}
          visible={props.visible}
          onOk={handleSure}
          onCancel={props?.onCancel}
          maskClosable={false}
          width={800}
        >
            <BaseInfo form={addCollectionForm} columns={ baseColums } dataSource={{}} col={ 2 } edit={props.title ? true : false} />
        </Modal>
    )
}