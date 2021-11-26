/**
 * 填写保函信息
 */
 import React, { useState, forwardRef, useImperativeHandle } from 'react';
 import { Modal, Form, Upload, Button, Spin } from 'antd';
 import { BaseInfo, DetailTitle, CommonTable } from '../common';
 import AuthUtil from "../../utils/AuthUtil"
 import { downLoadFile } from "../../utils"
 import useRequest from '@ahooksjs/use-request'
 import RequestUtil from '../../utils/RequestUtil';
 import { baseColums, enclosure } from './applicationColunm.json';
 interface EditProps {
    id?: string
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
}
 
 export default forwardRef(function FillGuaranteeInformation({id}: EditProps, ref) {
    const [addCollectionForm] = Form.useForm();
    const [attachVosData, setAttachVosData] = useState<any[]>([])
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

    const resetFields = () => {
        addCollectionForm.resetFields()
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
            const baseData = await addCollectionForm.validateFields();
            console.log(baseData, 'baseData');
            console.log(attachVosData, "附件");
            await run({path: "/tower-finance/guarantee", data: {...baseData, file: [], id}})
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit])

    return (
        <Spin spinning={loading}>
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
        </Spin>
    )
 })