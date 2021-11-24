/**
 * 新增请款申请
 */
import React, { useState,useRef } from 'react';
import { Modal, Form, Button, ModalFuncProps } from 'antd';
import { BaseInfo,Attachment,AttachmentRef,EditTable } from '../common';
import { addColums } from './fundListHead.json';
import RequestUtil from '../../utils/RequestUtil'
export default function AddModal(props: ModalFuncProps): JSX.Element {
    const [addFund] = Form.useForm();
    // const [columns, setColumns] = useState(baseColums);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [attachVosData, setAttachVosData] = useState<any[]>([]);
    const attchsRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } });
    // 提交
    const handleSure = async () => {
        setLoading(true);
        const postData = await addFund.validateFields();
        console.log(postData)
        const result: { [key: string]: any } = await RequestUtil.post('/tower-finance/payApply', {
            ...postData
        })
        console.log(result, 'post')
        // props.onOk && props.onOk({data: 10}, () => {
        //     addFund.resetFields();
            setLoading(false)
        // });
    }

    // 取消
    const handleCancle = () => {
        addFund.resetFields();
        props.onCancel && props.onCancel();
    }
    return (
        <Modal
          title={'付款'}
          visible={props.visible}
          onOk={handleSure}
          onCancel={handleCancle}
          maskClosable={false}
          width={800}
          footer={[
            <Button key="submit" type="primary" onClick={handleSure} loading={loading}>
              确认付款
            </Button>,
            <Button key="back" onClick={props?.onCancel}>
              取消
            </Button>
          ]}
        >
            <BaseInfo 
                form={addFund} 
                dataSource={{content: 1}}
                col={ 2 }
                edit
                columns={ addColums}
            />
             <Attachment title="附件" maxCount={10} ref={attchsRef} edit dataSource={attachVosData || [] } />
        </Modal>
    )
}