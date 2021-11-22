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

    const handleBaseInfoChange = (fields: any) => {
        console.log(fields, 'filed')
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
            <BaseInfo form={addCollectionForm} dataSource={{}} col={ 2 } edit={props.title ? true : false}
                columns={ baseColums.map((item: any) => {
                    if (item.dataIndex === 'content') {
                        const materialStandardEnum = [
                            {"label": "是", "value": 1},
                            {"label": "否", "value": 2}
                        ]
                        return ({...item, enum: materialStandardEnum})
                    }
                    return item;
                })}
                onChange={handleBaseInfoChange}
            />
        </Modal>
    )
}