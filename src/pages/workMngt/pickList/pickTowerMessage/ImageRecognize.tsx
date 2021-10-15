import React from 'react'
import { Button, Spin, Image, Space, Upload, message, Popconfirm } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../../utils/RequestUtil';
import AuthUtil from '../../../../utils/AuthUtil';
import { useState } from 'react';

const towerColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '段名', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '构件编号', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '材料名称', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '材质', dataIndex: 'amount', key: 'amount' },
    { title: '规格', dataIndex: 'unit', key: 'unit' },
    { title: '单基件数', dataIndex: 'unit', key: 'unit' },
    { title: '长度（mm）', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '宽度（mm）', dataIndex: 'amount', key: 'amount' },
    { title: '理算重量（kg）', dataIndex: 'unit', key: 'unit' },
    { title: '单件重量（kg）', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '小计重量（kg）', dataIndex: 'amount', key: 'amount' },
    { title: '备注', dataIndex: 'unit', key: 'unit' },
    { title: '操作', key:'operation', render:(): React.ReactNode =>(
            <Button type='link'>删除</Button>
    )}
]

export default function PickTowerDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, productSegmentId: string }>()
    const [ url, setUrl ] = useState<string>('')
    const [ urlBase, setUrlBase ] = useState<undefined|any>('')
    const [ tableDataSource, setTableDataSource ] = useState<undefined|any[]>([])
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Popconfirm
                    title="确认保存数据?"
                    onConfirm={ async () => {
                        await RequestUtil.post(`/tower-science/drawProductStructure/ocr/${params.productSegmentId}/save`).then(()=>{
                            message.success('保存成功！')
                        }).then(()=>{
                            history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/pick/${params.productSegmentId}`)
                        })
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
                            }
                            return new Promise((resolve, reject) => {
                                resolve()
                            })
                        }
                    }
                    onChange={ (info)=>{
                        if (info.file.status === 'done') {
                            setUrl(info.file.response.data.link);
                        } else if (info.file.status === 'error') {
                            console.log(info.file, info.fileList);
                        }
                    } } showUploadList= {false}>
                        <Button type="primary">选择图片</Button>
                    </Upload>
                    <Button type='primary' onClick={async ()=>{
                        const tableDataSource: any[]|undefined  = await RequestUtil.post(`/tower-science/drawProductStructure/ocr`,{file: urlBase});
                        setTableDataSource(tableDataSource);
                    }}>识别文字</Button>
                </Space>
                <div style={{ display: 'flex' }}>
                    <CommonTable dataSource={tableDataSource} columns={towerColumns}/>
                    <div style={{ boxShadow:'0px 0px 5px 5px #ccc', width:'100%', marginLeft:'10px', textAlign:'center'}}>
                        {url?<Image src={url} />:<span style={{lineHeight:"200px"}}>当前暂无图片</span>}
                    </div>
                </div>
            </DetailContent>
        </Spin>
    </>
}