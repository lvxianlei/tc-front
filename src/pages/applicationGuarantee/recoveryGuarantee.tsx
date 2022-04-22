/**
 * 回收保函
 */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Spin } from 'antd';
import moment from 'moment';
import { BaseInfo } from '../common';
import { recoveryGuarantee } from './applicationColunm.json';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil';
import { EditProps } from './application';
export default forwardRef(function RecoveryGuaranteeLayer({id, requiredReturnTime}: EditProps, ref) {
  const [addCollectionForm] = Form.useForm();
  const [column, setColumn] = useState(recoveryGuarantee);
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
    } else {
      result = column;
      addCollectionForm.setFieldsValue({
        ...fields
      })
    }
    setColumn(result);
  }
  const resetFields = () => {
    addCollectionForm.resetFields();
    setColumn(recoveryGuarantee);
  }


  const { loading, run } = useRequest((postData: { path: string, data: {} }) => new Promise(async (resolve, reject) => {
      try {
          const result = await RequestUtil.put(postData.path, postData.data)
          resolve(result);
          addCollectionForm.resetFields();
      } catch (error) {
          reject(error)
      }
  }), { manual: true })

  const onSubmit = () => new Promise(async (resolve, reject) => {
      try {
          const baseData = await addCollectionForm.validateFields()
          await run({path: "/tower-finance/guarantee/saveRecycledGuarantee", data: {...baseData, id}})
          resolve(true)
      } catch (error) {
          reject(false)
      }
  })

  useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit]);

  return (
    <Spin spinning={loading}>
      <BaseInfo
        form={addCollectionForm}
        dataSource={{requiredReturnTime: requiredReturnTime ? moment(requiredReturnTime).format("YYYY-MM-DD") : ''}}
        col={ 2 }
        edit
        columns={ column}
        onChange={handleBaseInfoChange}
      />
    </Spin>
  )
})