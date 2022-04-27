import React from 'react'
import { Button, Spin, Image, Space, Upload, message, Popconfirm, Modal, Form, Table, Input } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent } from '../../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../../utils/RequestUtil';
import AuthUtil from '../../../../utils/AuthUtil';
import { useState } from 'react';
import "./recognize.less";
import styles from './SetOut.module.less';


export default function PickTowerDetail(): React.ReactNode {
    

    const history = useHistory()
    const params = useParams<{ id: string, productSegmentId: string, status: string, materialLeader: string }>()
    const [ url, setUrl ] = useState<string>('')
    const [ visible, setVisible ] = useState<boolean>(false)
    const [ urlBase, setUrlBase ] = useState<undefined|any>('')
    const [ tableDataSource, setTableDataSource ] = useState<any[]>([]);
    const [ form ] = Form.useForm();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {});
    const columns = [
        // { title: '段组号', dataIndex: 'segmentGroupName', key: 'segmentGroupName', render:(_: any, record: Record<string, any>, index: number): React.ReactNode =>(
        //     <Form.Item name={['data',index, "segmentGroupName"]} initialValue={ _ }>
        //         <Input disabled />
        //     </Form.Item>
        // )},
        { title: '段号', dataIndex: 'segmentName', key: 'segmentName',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "segmentName"]}>
                <Input size="small" className={ checkColor(record, 'segmentName') === 'red' ? styles.red : checkColor(record, 'segmentName') === 'green' ? styles.green : checkColor(record, 'segmentName') === 'yellow' ? styles.yellow :  checkColor(record, 'segmentName') === 'blue' ? styles.blue: checkColor(record, 'segmentName') === 'brown' ? styles.brown:'' }/>
            </Form.Item>
        )},
        { title: '构件编号', dataIndex: 'code', key: 'code',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "code"]} initialValue={ _ }>
                <Input size="small" className={ checkColor(record, 'code') === 'red' ? styles.red : checkColor(record, 'code') === 'green' ? styles.green : checkColor(record, 'code') === 'yellow' ? styles.yellow :  checkColor(record, 'code') === 'blue' ? styles.blue: checkColor(record, 'code') === 'brown' ? styles.brown:'' }/>
            </Form.Item>
        ) },
        { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "structureTexture"]} initialValue={ _ }>
                <Input size="small" className={ checkColor(record, 'structureTexture') === 'red' ? styles.red : checkColor(record, 'structureTexture') === 'green' ? styles.green : checkColor(record, 'structureTexture') === 'yellow' ? styles.yellow :  checkColor(record, 'structureTexture') === 'blue' ? styles.blue: checkColor(record, 'structureTexture') === 'brown' ? styles.brown:'' }/>
            </Form.Item>
        ) },
        { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec', render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "structureSpec"]} initialValue={ _ }>
                <Input size="small" className={ checkColor(record, 'structureSpec') === 'red' ? styles.red : checkColor(record, 'structureSpec') === 'green' ? styles.green : checkColor(record, 'structureSpec') === 'yellow' ? styles.yellow :  checkColor(record, 'structureSpec') === 'blue' ? styles.blue: checkColor(record, 'structureSpec') === 'brown' ? styles.brown:'' }/>
            </Form.Item>
        ) },
        { title: '长度（mm）', dataIndex: 'length', key: 'length',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "length"]} initialValue={ _ }>
                <Input size="small" className={ checkColor(record, 'length') === 'red' ? styles.red : checkColor(record, 'length') === 'green' ? styles.green : checkColor(record, 'length') === 'yellow' ? styles.yellow :  checkColor(record, 'length') === 'blue' ? styles.blue: checkColor(record, 'length') === 'brown' ? styles.brown:'' }/>
            </Form.Item>
        ) },
        { title: '单段件数', dataIndex: 'basicsPartNum', key: 'basicsPartNum',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "basicsPartNum"]} initialValue={ _ }>
                <Input size="small" className={ checkColor(record, 'basicsPartNum') === 'red' ? styles.red : checkColor(record, 'basicsPartNum') === 'green' ? styles.green : checkColor(record, 'basicsPartNum') === 'yellow' ? styles.yellow :  checkColor(record, 'basicsPartNum') === 'blue' ? styles.blue: checkColor(record, 'basicsPartNum') === 'brown' ? styles.brown:'' }/>
            </Form.Item>
        ) },
        { title: '单件重量（kg）', dataIndex: 'basicsWeight', key: 'basicsWeight',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "basicsWeight"]} initialValue={ _ }>
                <Input size="small" className={ checkColor(record, 'basicsWeight') === 'red' ? styles.red : checkColor(record, 'basicsWeight') === 'green' ? styles.green : checkColor(record, 'basicsWeight') === 'yellow' ? styles.yellow :  checkColor(record, 'basicsWeight') === 'blue' ? styles.blue: checkColor(record, 'basicsWeight') === 'brown' ? styles.brown:'' }/>
            </Form.Item>
        ) },
        { title: '小计重量（kg）', dataIndex: 'totalWeight', key: 'totalWeight',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "totalWeight"]} initialValue={ _ }>
                <Input size="small" className={ checkColor(record, 'totalWeight') === 'red' ? styles.red : checkColor(record, 'totalWeight') === 'green' ? styles.green : checkColor(record, 'totalWeight') === 'yellow' ? styles.yellow :  checkColor(record, 'totalWeight') === 'blue' ? styles.blue: checkColor(record, 'totalWeight') === 'brown' ? styles.brown:'' }/>
            </Form.Item>
        ) },
        { title: '备注', dataIndex: 'description', key: 'description',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Form.Item name={['data',index, "description"]} initialValue={ _ }>
                <Input.TextArea showCount rows={1} />
            </Form.Item>
        ) },
        { title: '操作', key:'operation', render:(_a: any, _b: any, index: number): React.ReactNode =>(
            <Button type='link' onClick={()=>{
                tableDataSource&&tableDataSource.splice(index,1);
                tableDataSource&&setTableDataSource([...tableDataSource])
            }}>删除</Button>
        )}
    ]
    const checkColor = (record: Record<string, any>, dataIndex: string) => {
        const red: number = record?.redColumn?.indexOf(dataIndex);
        const green: number = record?.greenColumn?.indexOf(dataIndex);
        const yellow: number = record?.yellowColumn?.indexOf(dataIndex);
        const blueColumn: number = record?.blueColumn?.indexOf(dataIndex);
        const brownColumn: number = record?.brownColumn?.indexOf(dataIndex);
        if(red&&red !== -1) {
            return 'red';
        } else if(green&&green !== -1) {
            return 'green';
        } else if(yellow&&yellow !== -1) {
            return 'yellow';
        } else if(blueColumn&&blueColumn !== -1){
            return 'blue';
        } else if(brownColumn&&brownColumn !== -1){
            return 'brown';
        }else {
            return 'normal'
        }
    }
    window.addEventListener("paste", function (e:any){
        if ( !(e.clipboardData && e.clipboardData.items) ) {
            return ;
        }
    
        for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
            var item = e.clipboardData.items[i];
            console.log(item)
            if (item.kind === "string") {
                console.log(1)  // str 是获取到的字符串
            } else if (item.kind === "file") {
                var pasteFile = item.getAsFile();
                var reader = new FileReader();
                reader.readAsDataURL(pasteFile);//读取图像文件 result 为 DataURL, DataURL 可直接 赋值给 img.src
                reader.onload = function(event:any){
                    setUrlBase(event.target.result) //base64
                }
                // pasteFile就是获取到的文件
            }
        }
    });
   
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Popconfirm
                    title="确认保存数据?"
                    onConfirm={ async () => {
                        if(form.getFieldsValue(true).data&&form.getFieldsValue(true).data.length>0){
                            let values = form.getFieldsValue(true).data;
                            values = values.map((res: any) => {
                                return {
                                    ...res,
                                    segmentGroupId: tableDataSource[0].segmentGroupId,
                                    productCategory: tableDataSource[0].productCategory
                                }
                            })
                            const value = await RequestUtil.post(`/tower-science/drawProductStructure/check/cover`, values)
                            if(value){
                                await RequestUtil.post(`/tower-science/drawProductStructure/ocr/save?cover=0`, values).then(()=>{
                                    message.success('保存成功！')
                                }).then(()=>{
                                    history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${params.productSegmentId}`)
                                })
                            }else{
                                setVisible(true)
                            }
                            
                        }else{
                            message.error('当前无数据，不可保存！')
                        }
                        
                    } }
                    okText="确认"
                    cancelText="取消"
                >   
                    <Button type='primary'>保存数据</Button>
                </Popconfirm>,
                <Button key="goback" onClick={() => history.goBack()} style={{marginLeft:"10px"}}>返回</Button>
            ]}>
                <Space>
                
                    {/* <Button type='primary' onClick={getCropData} disabled={!urlBase}>确认剪裁</Button> */}
                    <Button type='primary' onClick={async ()=>{
                        const tableDataSource: any[]  = await RequestUtil.post(`/tower-science/drawProductStructure/ocr`,{base64File: urlBase, productSegmentId: params.productSegmentId});
                        setTableDataSource(tableDataSource);
                        form.setFieldsValue({
                            data: tableDataSource
                        })
                    }} 
                    disabled={!urlBase}
                    >识别文字</Button>

                </Space>
                <div style={{ display: 'flex', width:'100%' }}>
                    <Form form={form} style={{width:'60%'}}>
                    <Table
                        columns={columns}
                        pagination={false}
                        dataSource={[...tableDataSource]}
                        scroll={{x:1500}}
                    />
                    </Form>
                    <div style={{ width:'40%'}}>
                        <Upload
                    maxCount = { 1 }
                    accept="image/png,image/jpeg"
                    action={ () => {
                        const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                        return baseUrl+'/sinzetech-resource/oss/put-file'
                    } } 
                    headers={
                        {
                            'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }
                    }
                    beforeUpload = { 
                        (file) => {
                            const reader = new FileReader();
                            reader.readAsDataURL(file); // 读取图片文件
                            reader.onload = (file) => {
                                const params = {
                                    myBase64: file?.target?.result, // 把 本地图片的base64编码传给后台，调接口，生成图片的url
                                };
                                setUrlBase(params.myBase64);
                                form.setFieldsValue({
                                    data: []
                                })
                                setTableDataSource([])
                            }
                            return new Promise((resolve, reject) => {
                                resolve()
                            })
                        }
                    }
                    onChange={ (info)=>{
                        if (info.file.status === 'done') {
                            setUrl(info.file.response.data.link)
                            
                        } else if (info.file.status === 'error') {
                            console.log(info.file, info.fileList);
                        }
                    } } showUploadList= {false}>
                        <Button type="primary" style={{marginLeft:'10px'}}>选择图片</Button>
                    </Upload>
                    <span>或<span style={{fontWeight:'bold',fontSize:"20px"}}>Ctrl+V</span>粘贴图片</span>
                    <div style={{ boxShadow:'0px 0px 5px 5px #ccc', width:'100%', marginLeft:'10px', textAlign:'center'}}>
                        
                        {urlBase?<div style={{ width:'100%'}}>
                                <Image style={{ width: "100%" }} src={urlBase}  />
                        </div>:<span style={{lineHeight:"200px"}}>当前暂无图片</span>}
                    </div>
                        </div>
                    
                </div>
            </DetailContent>
            <Modal visible={visible} title='' onCancel={()=>{setVisible(false)}} okText='是' cancelText='否' footer={<Space><Button onClick={async ()=>{
                let values = form.getFieldsValue(true).data;
                values = values.map((res: any) => {
                    return {
                        ...res,
                        segmentGroupId: params.productSegmentId
                    }
                })
                await RequestUtil.post(`/tower-science/drawProductStructure/ocr/save?cover=1`,values).then(()=>{
                    message.success('保存成功！')
                }).then(()=>{
                    history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${params.productSegmentId}`)
                })
            }}>是</Button><Button onClick={async ()=>{
                let values = form.getFieldsValue(true).data;
                values = values.map((res: any) => {
                    return {
                        ...res,
                        segmentGroupId: params.productSegmentId
                    }
                })
                await RequestUtil.post(`/tower-science/drawProductStructure/ocr/save?cover=0`,values).then(()=>{
                    message.success('保存成功！')
                }).then(()=>{
                    setVisible(false);
                    history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${params.productSegmentId}`)
                })
                
            }}>否</Button></Space>}>
                存在相同构件编号，确定覆盖？
            </Modal>
        </Spin>
    </>
}