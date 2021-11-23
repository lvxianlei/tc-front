/**
 * 填写保函信息
 */
 import React, { useState } from 'react';
 import { Modal, Form, Upload, Button, ModalFuncProps } from 'antd';
 import { BaseInfo, DetailTitle, CommonTable } from '../common';
 import AuthUtil from "../../utils/AuthUtil"
 import { downLoadFile } from "../../utils"
 import { baseColums, enclosure } from './applicationColunm.json';
 
 export default function FillGuaranteeInformation(props: ModalFuncProps): JSX.Element {
    const [addCollectionForm] = Form.useForm();
     
    const [attachVosData, setAttachVosData] = useState<any[]>([])
 
     // 提交
     const handleSure = async () => {
         const postData = await addCollectionForm.validateFields();
         console.log(postData, 'post')
         props.onOk && props.onOk();
     }
 
     const handleBaseInfoChange = (fields: any) => {
         console.log(fields, 'filed')
         // "disabled": true,  stateName
         baseColums.map((item: any) => {
             if (item.dataIndex === 'stateName') {
                 item['disabled'] = true;
             }
             return item;
         })
     }

     const uploadChange = (event: any) => {
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                const dataInfo = event.file.response.data
                const fileInfo = dataInfo.name.split(".")
                setAttachVosData([...attachVosData, {
                    id: "",
                    uid: attachVosData.length,
                    link: dataInfo.link,
                    name: dataInfo.originalName.split(".")[0],
                    description: "",
                    filePath: dataInfo.name,
                    fileSize: dataInfo.size,
                    fileSuffix: fileInfo[fileInfo.length - 1],
                    userName: dataInfo.userName,
                    fileUploadTime: dataInfo.fileUploadTime
                }])
            }
        }
    }

    const deleteAttachData = (id: number) => {
        setAttachVosData(attachVosData.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
    }
 
     return (
         <Modal
           title={'填写保函信息'}
           visible={props.visible}
           onOk={handleSure}
           onCancel={props?.onCancel}
           maskClosable={false}
           width={1100}
           footer={[
            <Button key="submit" type="primary" onClick={handleSure}>
              保存并提交
            </Button>,
            <Button key="back" onClick={props?.onCancel}>
              取消
            </Button>
          ]}
         >
             <BaseInfo
                form={addCollectionForm}
                dataSource={{content: 1}}
                col={ 2 }
                edit
                columns={ baseColums}
             />
             <DetailTitle title="附件" operation={[<Upload
                key="sub"
                name="file"
                multiple={true}
                action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
                headers={{
                    'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                    'Tenant-Id': AuthUtil.getTenantId(),
                    'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                }}
                showUploadList={false}
                onChange={uploadChange}
            ><Button key="enclosure" type="primary" ghost>上传附件</Button></Upload>]} />
            <CommonTable columns={[{
                title: "操作", dataIndex: "opration",
                render: (_: any, record: any) => (<>
                    <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>删除</Button>
                    <Button type="link" onClick={() => downLoadFile(record.link || record.filePath)}>下载</Button>
                </>)
            }, ...enclosure]} dataSource={attachVosData} />
         </Modal>
     )
 }