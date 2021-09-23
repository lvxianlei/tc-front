import React from 'react'
import { Button, Spin, Image, Space, Upload, message } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../../utils/RequestUtil';
import AuthUtil from '../../../../utils/AuthUtil';

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
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button  onClick={() => history.goBack()}>保存数据</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
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
                            const isLt10M = file.size / 1024 / 1024 > 10;
                            return new Promise((resolve, reject) => {
                                // if(this.state.contract.attachInfoDtos && this.state.contract.attachInfoDtos.length >= 10 ) {
                                //     message.error('文件最多上传10个！')
                                //     reject()
                                // } else {
                                //     resolve()
                                // }
                                // if (isLt10M) {
                                //     message.error('上传文件不能大于10M')
                                //     reject()
                                // } else {
                                //     resolve()
                                // }
                            })
                        }
                    }
                    onChange={ (info)=>{
                        if (info.file.status === 'done') {
                            // let index: number = 1;
                            // if(this.state.contract.attachInfoDtos) {
                            //     index = this.state.contract.attachInfoDtos.length + 1;
                            // } else {
                            //     index = 1;
                            // } 
                            // const contract: IContractInfo = this.state.contract;
                            // let attachInfoDtos: IAttachDTO[] = contract.attachInfoDtos;
                            // const attachInfoItem: IAttachDTO = {
                            //     name: info.file.response.data.originalName,
                            //     userName: info.file.response.data.userName,
                            //     fileSize: info.file.response.data.size,
                            //     description: '',
                            //     filePath: info.file.response.data.name,
                            //     fileUploadTime: info.file.response.data.fileUploadTime,
                            //     fileSuffix: info.file.response.data.fileSuffix
                            // };
                            // operation.add(attachInfoItem);
                            // if(attachInfoDtos) {
                            //     attachInfoDtos.push(attachInfoItem);  
                            // } else {
                            //     attachInfoDtos = [attachInfoItem];
                            // }
                            // this.setState({
                            //     contract: {
                            //         ...(contract || {}),
                            //         attachInfoDtos: attachInfoDtos
                            //     }
                            // })
                        } else if (info.file.status === 'error') {
                            console.log(info.file, info.fileList);
                        }
                    } } showUploadList= {false}>
                        <Button type="primary">选择图片</Button>
                    </Upload>
                    {/* <Button type='primary' onClick={()=>{window.open()}}>选择图片</Button> */}
                    <Button type='primary' onClick={()=>{window.open()}}>识别文字</Button>
                </Space>
                <div style={{ display: 'flex' }}>
                <CommonTable dataSource={[]} columns={towerColumns}/>
                <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"/>
                </div>
            </DetailContent>
        </Spin>
    </>
}