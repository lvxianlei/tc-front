/**
 * 查看回款信息
 */
 import React from 'react';
 import { Modal, Form, Button, message } from 'antd';
 import { BaseInfo, DetailTitle, CommonTable } from '../../common';
 import { baseInfo, operationInformation } from './DetailOverView.json';
 import { OverViewProps } from './DetailOverViewInface';
 export default function DetailOverView(props: OverViewProps): JSX.Element {
     const [addCollectionForm] = Form.useForm();
     // 取消
     const handleCancle = () => {
         props.onCancel && props.onCancel();
     }
     // 接受
     const hanlePromise = () => {
        message.success("接受了啊")
     }
     return (
         <Modal
             title={'详情'}
             visible={props.visible}
             onCancel={handleCancle}
             maskClosable={false}
             width={800}
             footer={[
                <Button key="back" onClick={props?.onCancel}>关闭</Button>,
                <Button type="primary" onClick={hanlePromise}>接受</Button>
             ]}
         >
             <DetailTitle title="基础信息" />
             <BaseInfo
                 form={addCollectionForm}
                 dataSource={{}}
                 col={ 2 }
                 columns={baseInfo}
             />
             <DetailTitle title="操作信息" />
             <CommonTable haveIndex columns={operationInformation} dataSource={[]} pagination={ false }/>
         </Modal>
     )
 }