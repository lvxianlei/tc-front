import React, { useState } from 'react';
import { Button, Spin, Space, Image, TablePaginationConfig, Modal } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './setOut.module.less';

interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: [];
}



export default function TowerMemberInfo(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, number: string }>()
    const [ detailData, setDetailData ] = useState<IResponseData | undefined>(undefined);
    const page = {
        current: 1,
        pageSize: 10
    };
    const columns = [
        { 
            title: '序号', 
            dataIndex: 'index', 
            key: 'index', 
            render: (_a: any, _b: any, index: number): React.ReactNode => (
                <span>{index + 1}</span>
            ) 
        },
        { 
            title: '段号', 
            dataIndex: 'segmentName', 
            key: 'segmentName', 
        },
        { 
            title: '构件编号', 
            dataIndex: 'code', 
            key: 'code' 
        },
        { 
            title: '材料', 
            dataIndex: 'materialName', 
            key: 'materialName' 
        },
        { 
            title: '材质', 
            dataIndex: 'structureTexture', 
            key: 'structureTexture' 
        },
        { 
            title: '规格', 
            dataIndex: 'structureSpec', 
            key: 'structureSpec', 
        },
        { 
            title: '宽度（mm）', 
            dataIndex: 'width', 
            key: 'width', 
            render: (_: any, _b: any, index: number): React.ReactNode => (
                <span>{(_===null||!_)?'-':_}</span>
            ) 
        },
        { 
            title: '厚度（mm）', 
            dataIndex: 'thickness', 
            key: 'thickness' , 
            render: (_: any, _b: any, index: number): React.ReactNode => (
                <span>{(_===null||!_)?'-':_}</span>
            ) 
        },
        { 
            title: '长度（mm）', 
            dataIndex: 'length', 
            key: 'length' , 
            render: (_: any, _b: any, index: number): React.ReactNode => (
                <span>{(_===null||!_)?'-':_}</span>
            ) 
        },
        { 
            title: '单件理算重量（kg）', 
            dataIndex: 'basicsWeight', 
            key: 'basicsWeight' , 
            render: (_: any, _b: any, index: number): React.ReactNode => (
                <span>{(_===null||!_)?'-':_}</span>
            ) 
        },
        { 
            title: '单件图纸重量（kg）', 
            dataIndex: 'drawBasicsWeight', 
            key: 'drawBasicsWeight' , 
            render: (_: any, _b: any, index: number): React.ReactNode => (
                <span>{(_===null||!_)?'-':_}</span>
            )  
        },
        { 
            title: '单段数量', 
            dataIndex: 'basicsPartNum', 
            key: 'basicsPartNum' , 
            render: (_: any, _b: any, index: number): React.ReactNode => (
                <span>{(_===null||!_)?'-':_}</span>
            ) 
        },
        { 
            title: '单段理算重量（kg）', 
            dataIndex: 'basicsPartWeight', 
            key: 'basicsPartWeight', 
            render: (_: any, _b: any, index: number): React.ReactNode => (
                <span>{(_===null||!_)?'-':_}</span>
            ) 
        },
        { 
            title: '单段图纸重量（kg）', 
            dataIndex: 'drawPartWeight', 
            key: 'drawPartWeight' , 
            render: (_: any, _b: any, index: number): React.ReactNode => (
                <span>{(_===null||!_)?'-':_}</span>
            ) 
        },
        { 
            title: '小样图名称', 
            dataIndex: 'smallSample', 
            key: 'smallSample' 
        },
        { 
            title: '上传时间', 
            dataIndex: 'uploadTime', 
            key: 'uploadTime' 
        },
        { 
            title: '备注', 
            dataIndex: 'description', 
            key: 'description' 
        },
        { 
            key: 'operation', 
            title: '操作', 
            dataIndex: 'operation', 
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type="link" onClick={async ()=>{
                        const url:any = await RequestUtil.get(`/tower-science/smallSample/sampleView/${record.id}`);
                        setUrl(url?.downloadUrl);
                        setVisible(true)
                    }}>查看</Button>
                </Space>
            ) 
        }
    ]
    const [visible, setVisible] = useState<boolean>(false);
    const [url, setUrl] = useState('');
    const getTableDataSource = (pagination: TablePaginationConfig) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<IResponseData>(`/tower-science/productStructure/getDetailPage`, { ...pagination, productCategoryId:params.id });
        setDetailData(data);
        resole(data);
    });

    const { loading } = useRequest<IResponseData>(() => getTableDataSource(page), {});

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }
    const handleModalCancel = () => {setVisible(false);setUrl('')}
    return <DetailContent operation={ [
        <Space direction="horizontal" size="small" >
            <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
        </Space>
    ] }>
        <Modal title='查看图片'  width={800} visible={visible} onCancel={handleModalCancel} footer={false}>
            <Image src={url||''}/>
        </Modal>
        <DetailTitle title="构件信息" />
        <p>件号数：<span style={{color:'#FF8C00'}}>{ params.number }</span></p>
        <CommonTable 
            columns={ columns } 
            dataSource={ detailData?.records } 
            onChange={ (pagination: TablePaginationConfig) => { 
                getTableDataSource(pagination);
            } }
            pagination={{
                current: detailData?.current || 0,
                pageSize: detailData?.size || 0,
                total: detailData?.total || 0,
                showSizeChanger: true,
                showTotal: (total: number) => `共${total} 条记录`,
            }}
        />
    </DetailContent>
}