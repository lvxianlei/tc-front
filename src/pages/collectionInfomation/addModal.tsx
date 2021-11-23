/**
 * 新增回款信息
 */
import React, { useState } from 'react';
import { Modal, Form, Button, ModalFuncProps } from 'antd';
import { BaseInfo } from '../common';
import { baseColums } from './collectionColumn.json';

export default function AddModal(props: ModalFuncProps): JSX.Element {
    const [addCollectionForm] = Form.useForm();
    const [columns, setColumns] = useState(baseColums);
    const [ loading, setLoading ] = useState<boolean>(false);

    // 提交
    const handleSure = async () => {
        const postData = await addCollectionForm.validateFields();
        console.log(postData, 'post')
        setLoading(true);
        props.onOk && props.onOk({data: 10}, () => {
            addCollectionForm.resetFields();
            setLoading(false)
        });
    }

    // 取消
    const handleCancle = () => {
        addCollectionForm.resetFields();
        props.onCancel && props.onCancel();
    }

    const handleBaseInfoChange = (fields: any) => {
        console.log(fields, 'filed')
        // "disabled": true,  stateName
        const result = columns.map((item: any) => {
            if (item.dataIndex === 'stateName') {
                item['disabled'] = true;
            }
            return item;
        });
        console.log(result, '--------------')
        setColumns(result);
    }

    return (
        <Modal
          title={'新增回款信息'}
          visible={props.visible}
          onOk={handleSure}
          onCancel={handleCancle}
          maskClosable={false}
          width={800}
          footer={[
            <Button key="submit" type="primary" onClick={handleSure} loading={loading}>
              提交
            </Button>,
            <Button key="back" onClick={props?.onCancel}>
              取消
            </Button>
          ]}
        >
            <BaseInfo form={addCollectionForm} dataSource={{}} col={ 2 } edit
                columns={ columns.map((item: any) => {
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