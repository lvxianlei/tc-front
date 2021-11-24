/**
 * 回收保函
 */
import React, { useState } from 'react';
import { Modal, Form, Button, ModalFuncProps } from 'antd';
import { BaseInfo } from '../common';
import { recoveryGuarantee } from './applicationColunm.json';

export default function RecoveryGuaranteeLayer(props: ModalFuncProps): JSX.Element {
  const [addCollectionForm] = Form.useForm();
  const [column, setColumn] = useState(recoveryGuarantee);
  const [loading, setLoading] = useState(false);

    // 提交
    const handleSure = async () => {
        const postData = await addCollectionForm.validateFields();
        console.log(postData, 'post')
        setLoading(true);
        props.onOk && props.onOk(postData, () => {
          // 回调的形式
          setLoading(false);
          addCollectionForm.resetFields();
        });
    }

    // 取消
    const handleCancle = () => {
      addCollectionForm.resetFields();
      setColumn(recoveryGuarantee);
      props.onCancel && props.onCancel();
   }

    const handleBaseInfoChange = (fields: any) => {
      let result: any = [];
      // 当触发的是是否交回原件并且他的值为是（1）
      if (fields.isOriginalScript && addCollectionForm.getFieldValue("isOriginalScript") === 1) {
        // 移除原因
        result = column.filter((item: any) => item.dataIndex !== 'reason')
      } else if (addCollectionForm.getFieldValue("isOriginalScript") !== 1) {
        // 添加原因 并且必填
        result = column.filter((item: any) => item.dataIndex !== 'reason');
        const index = column.findIndex((item: any) => item.dataIndex === "isOriginalScript");
        const v = {
            "dataIndex": "reason",
            "title": "原因",
            "rules": [
              {
                  "required": true,
                  "message": "请输入原因"
              }
          ]
        }
        result.splice(index + 1, 0, v);
        console.log(result, 'result')
      } else {
        result = column;
        addCollectionForm.setFieldsValue({
          ...fields
        })
      }
      setColumn(result);
    }

    return (
        <Modal
          title={'回收保函'}
          visible={props.visible}
          onOk={handleSure}
          onCancel={handleCancle}
          maskClosable={false}
          width={1100}
          footer={[
          <Button key="submit" type="primary" onClick={handleSure} loading={loading}>
            保存
          </Button>,
          <Button key="back" onClick={handleCancle}>
            取消
          </Button>
        ]}
        >
            <BaseInfo
              form={addCollectionForm}
              dataSource={{content: 1}}
              col={ 2 }
              edit
              columns={ column}
              onChange={handleBaseInfoChange}
            />
        </Modal>
    )
}