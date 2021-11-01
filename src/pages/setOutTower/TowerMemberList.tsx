import React, { useState } from 'react'
import { Button, Spin, Space, Image } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Page } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import Modal from 'antd/lib/modal/Modal';

export default function TowerMemberInfo(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false);
    const [url, setUrl] = useState('');
    const params = useParams<{ id: string, number: string }>()
    // const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
    //     const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
    //     resole(data)
    // }), {})
    // const detailData: any = data;
    const columns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '段号', dataIndex: 'segmentName', key: 'segmentName', },
        { title: '构件编号', dataIndex: 'code', key: 'code' },
        { title: '材料', dataIndex: 'materialName', key: 'materialName' },
        { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture' },
        { title: '规格', dataIndex: 'specName', key: 'specName', },
        { title: '宽度（mm）', dataIndex: 'width', key: 'width', render: (_: any, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
        { title: '厚度（mm）', dataIndex: 'thickness', key: 'thickness' , render: (_: any, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
        { title: '长度（mm）', dataIndex: 'length', key: 'length' , render: (_: any, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
        { title: '单件理算重量（kg）', dataIndex: 'basicsWeight', key: 'basicsWeight' , render: (_: any, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
        { title: '单件图纸重量（kg）', dataIndex: 'drawBasicsWeight', key: 'drawBasicsWeight' , render: (_: any, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
        { title: '单段数量', dataIndex: 'basicsPartNum', key: 'basicsPartNum' , render: (_: any, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
        { title: '单段理算重量（kg）', dataIndex: 'basicsPartWeight', key: 'basicsPartWeight', render: (_: any, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
        { title: '单段图纸重量（kg）', dataIndex: 'drawPartWeight', key: 'drawPartWeight' , render: (_: any, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>) },
        { title: '小样图名称', dataIndex: 'smallSample', key: 'smallSample' },
        { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime' },
        { title: '备注', dataIndex: 'description', key: 'description' },
        { 
            key: 'operation', 
            title: '操作', 
            dataIndex: 'operation', 
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={async ()=>{
                        const url:any = await RequestUtil.get(`/tower-science/smallSample/sampleView/${record.id}`);
                        setUrl(url?.filePath);
                        setVisible(true)
                    }}>查看</Button>
                </Space>
            ) 
        }
    ]
    const handleModalCancel = () => {setVisible(false);setUrl('')}
    return <>
        <Modal title='查看图片'  width={800} visible={visible} onCancel={handleModalCancel} footer={false}>
            <Image src={url||''}/>
        </Modal>
        <DetailContent operation={[
            <Button key="goback" onClick={() => history.goBack()}>返回</Button>
        ]}>
            <DetailTitle title="构件信息" />
            <Page
                path="/tower-science/productStructure/getDetailPage"
                columns={columns}
                requestData={{ productCategoryId: params.id }}
                // filterValue={filterValue}
                // onFilterSubmit={onFilterSubmit}
                extraOperation={ <span>件号数：{params.number}</span> }
                searchFormItems={[]}
            />
        </DetailContent>
    </>
}