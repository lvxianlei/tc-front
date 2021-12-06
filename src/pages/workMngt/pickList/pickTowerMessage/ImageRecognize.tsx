import React from 'react'
import { Button, Spin, Image, Space, Upload, message, Popconfirm, Modal, Form, Table, Input } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../../utils/RequestUtil';
import AuthUtil from '../../../../utils/AuthUtil';
import { useState } from 'react';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./recognize.less";



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
    const [cropData, setCropData] = useState("");
    const [cropper, setCropper] = useState<any>();
    // const towerColumns = [
    //     { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    //     { title: '段名', dataIndex: 'segmentName', key: 'segmentName', },
    //     { title: '构件编号', dataIndex: 'code', key: 'code' },
    //     { title: '材料名称', dataIndex: 'materialName', key: 'materialName' },
    //     { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture' },
    //     { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec' },
    //     { title: '单段件数', dataIndex: 'basicsPartNum', key: 'basicsPartNum' },
    //     { title: '长度（mm）', dataIndex: 'length', key: 'length' },
    //     { title: '宽度（mm）', dataIndex: 'width', key: 'width' },
    //     { title: '理算重量（kg）', dataIndex: 'basicsTheoryWeight', key: 'basicsTheoryWeight' },
    //     { title: '单件重量（kg）', dataIndex: 'basicsWeight', key: 'basicsWeight' },
    //     { title: '小计重量（kg）', dataIndex: 'totalWeight', key: 'totalWeight' },
    //     { title: '备注', dataIndex: 'description', key: 'description' },
    //     { title: '操作', key:'operation', render:(_a: any, _b: any, index: number): React.ReactNode =>(
    //         <Button type='link' onClick={()=>{
    //             tableDataSource&&tableDataSource.splice(index,1);
    //             tableDataSource&&setTableDataSource([...tableDataSource])
    //         }}>删除</Button>
    //     )}
    // ];
    const getCropData = () => {
        if (typeof cropper !== "undefined") {
          setCropData(cropper.getCroppedCanvas().toDataURL());
        }
    };
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
                                setCropData('');
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
                        <Button type="primary">选择图片</Button>
                    </Upload>
                    <Button type='primary' onClick={getCropData} disabled={!urlBase}>确认剪裁</Button>
                    <Button type='primary' onClick={async ()=>{
                        const tableDataSource: any[]  = await RequestUtil.post(`/tower-science/drawProductStructure/ocr`,{base64File: cropData, productSegmentId: params.productSegmentId});
                        setTableDataSource(tableDataSource);
                    }} disabled={!cropData}>识别文字</Button>
                </Space>
                <div style={{ display: 'flex', width:'100%' }}>
                    {/* <CommonTable dataSource={[...tableDataSource]} columns={towerColumns} pagination={false} rowKey='index'/> */}
                    <Form form={form} style={{width:'60%'}}>
                    <Table
                        columns={[
                            { title: '段组号', dataIndex: 'segmentGroupName', key: 'segmentGroupName', render:(_: any, record: Record<string, any>, index: number): React.ReactNode =>(
                                <Form.Item name={['data',index, "segmentGroupName"]} initialValue={ _ }>
                                    <Input disabled/>
                                </Form.Item>
                            )},
                            { title: '段号', dataIndex: 'segmentName', key: 'segmentName', render:(_: any, _b: any, index: number): React.ReactNode =>(
                                <Form.Item name={['data',index, "segmentName"]}>
                                    <Input size="small"/>
                                </Form.Item>
                            )},
                            { title: '构件编号', dataIndex: 'code', key: 'code',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['data',index, "code"]} initialValue={ _ }>
                                    <Input size="small"/>
                                </Form.Item>
                            ) },
                            { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['data',index, "structureTexture"]} initialValue={ _ }>
                                    <Input size="small" />
                                </Form.Item>
                            ) },
                            { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec', render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['data',index, "structureSpec"]} initialValue={ _ }>
                                    <Input size="small" />
                                </Form.Item>
                            ) },
                            { title: '长度（mm）', dataIndex: 'length', key: 'length',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['data',index, "length"]} initialValue={ _ }>
                                    <Input size="small" />
                                </Form.Item>
                            ) },
                            { title: '单段件数', dataIndex: 'basicsPartNum', key: 'basicsPartNum',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['data',index, "basicsPartNum"]} initialValue={ _ }>
                                    <Input size="small"/>
                                </Form.Item>
                            ) },
                            { title: '单件重量（kg）', dataIndex: 'basicsWeight', key: 'basicsWeight',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['data',index, "basicsWeight"]} initialValue={ _ }>
                                    <Input size="small" />
                                </Form.Item>
                            ) },
                            { title: '小计重量（kg）', dataIndex: 'totalWeight', key: 'totalWeight',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <Form.Item name={['data',index, "totalWeight"]} initialValue={ _ }>
                                    <Input size="small" />
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
                        ]}
                        pagination={false}
                        dataSource={[...tableDataSource]}
                    />
                    </Form>
                    <div style={{ boxShadow:'0px 0px 5px 5px #ccc', width:'40%', marginLeft:'10px', textAlign:'center'}}>
                        {urlBase?<div style={{ width:'100%'}}>
                            <div style={{ width: "100%" }}>
                                <Cropper
                                    style={{ height: 300, width: "100%" }}
                                    zoomTo={0.5}
                                    initialAspectRatio={1}
                                    preview=".img-preview"
                                    src={urlBase}
                                    viewMode={1}
                                    minCropBoxHeight={10}
                                    minCropBoxWidth={10}
                                    background={false}
                                    responsive={true}
                                    autoCropArea={1}
                                    checkOrientation={false} 
                                    onInitialized={(instance) => {
                                        setCropper(instance);
                                    }}
                                    guides={true}
                                    />
                            </div>
                            <div>
                                <div className="box" style={{ width: "100%", float: "right" }}>
                                {/* <h1>Preview</h1> */}
                                {/* <div
                                    className="img-preview"
                                    style={{ width: "100%", float: "left", height: "500px" }}
                                /> */}
                                    {cropData?<Image style={{ width: "100%" }} src={cropData} alt="cropped" />:null}
                                </div>
                            </div>
                        </div>:<span style={{lineHeight:"200px"}}>当前暂无图片</span>}
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