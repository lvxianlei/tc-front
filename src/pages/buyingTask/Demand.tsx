import React from 'react'
import { Button, InputNumber, message, Modal, Space, Spin, Upload } from 'antd';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { CommonTable, DetailContent, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import { useState } from 'react';
import { downloadTemplate } from '../workMngt/setOut/downloadTemplate';
import AuthUtil from '@utils/AuthUtil';

const materialColumns = [
    { 
        title: '序号', 
        dataIndex: 'index', 
        key: 'index', 
        render: (_a: any, _b: any, index: number): React.ReactNode => (
            <span>{index + 1}</span>
        ) 
    },
    { 
        title: '品名', 
        dataIndex: 'materialName', 
        key: 'materialName', 
    },
    // { 
    //     title: '模式', 
    //     dataIndex: 'patternName', 
    //     key: 'patternName'
    // },
    { 
        title: '标准', 
        dataIndex: 'materialStandardName', 
        key: 'materialStandardName' 
    },
    { 
        title: '材质', 
        dataIndex: 'structureTexture', 
        key: 'structureTexture' 
    },
    { 
        title: '规格', 
        dataIndex: 'structureSpec', 
        key: 'structureSpec' 
    },
    { 
        title: '长度（mm）', 
        dataIndex: 'length', 
        key: 'length' 
    },
    { 
        title: '宽度（mm）', 
        dataIndex: 'width', 
        key: 'width', 
    },
    { 
        title: '数量', 
        dataIndex: 'num', 
        key: 'num', 
    },
    { 
        title: '重量（吨）', 
        dataIndex: 'totalWeight', 
        key: 'totalWeight', 
    },
    { 
        title: '待采购数量', 
        dataIndex: 'waitPurchaseNum', 
        key: 'waitPurchaseNum', 
    },
    { 
        title: '待采购重量（吨）', 
        dataIndex: 'waitPurchaseWeight', 
        key: 'waitPurchaseWeight' 
    },
    { 
        title: '已采购数量', 
        dataIndex: 'purchaseNum', 
        key: 'purchaseNum'
    },
    { 
        title: '已采购重量（吨）', 
        dataIndex: 'purchaseWeight', 
        key: 'purchaseWeight' 
    },
    { 
        title: '已到货数量',
        dataIndex: 'receivedNum', 
        key: 'receivedNum' 
    },
    { 
        title: '已到货重量（吨）', 
        dataIndex: 'receivedWeight', 
        key: 'receivedWeight' 
    }
]
export default function PickTowerDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{id:string, projectName: string, status: string, planNumber: string }>();
    const [tableDataSource,setTableDataSource] = useState<any[]>([]);
    const [materialDataSource,setMaterialDataSource] = useState<any[]>([]);
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [visible, setVisible] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [loadedR, setLoadedR] = useState(false)
    const [url, setUrl] = useState<string>('');
    const [urlVisible, setUrlVisible] = useState<boolean>(false);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-supply/materialPurchaseTask/material/${params.id}/1`)
        setTableDataSource(data);
        resole(data)
    }), {});


    const handleNumChange = (value: number, id: number) => {
        console.log(value)
        const list = materialDataSource.map((item: any,index:number) => {
            if (index === id) {
                return ({
                    ...item,
                    waitPurchaseNum: value,
                    occupiedNum: item?.realMaterialStock && value < item?.realMaterialStock ?  item?.realMaterialStock-value: 0
                })
            }
            return item
        })
        setMaterialDataSource(list.slice(0));
    }
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <span style={{fontSize:'17px',fontWeight:'bold'}}>工程用料需求</span>
                <span style={{marginLeft:'10px'}}>计划号：{params.planNumber}</span>
                <span style={{marginLeft:'10px'}}>工程名称：{params.projectName}</span>
                <div style={{margin:'10px 0px'}}>
                    {params.status!=='1'&&<Space>
                        <Upload
                            accept=".xls,.xlsx"
                            action={() => {
                                const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                                return baseUrl + '/tower-supply/materialPurchaseTask/importData'
                            }}
                            headers={
                                {
                                    'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                                    'Tenant-Id': AuthUtil.getTenantId(),
                                    'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                                }
                            }
                            showUploadList={false}
                            data={{ purchaseTaskId: params.id }}
                            onChange={(info) => {
                                if (info.file.response && !info.file.response?.success) {
                                    message.warning(info.file.response?.msg)
                                }
                                if (info.file.response && info.file.response?.success) {
                                    if (Object.keys(info.file.response?.data).length > 0) {
                                        info.file.response?.data?.downUrl&&setUrl(info.file.response?.data?.downUrl);
                                        info.file.response?.data?.downUrl&&setUrlVisible(true);
                                        info.file.response?.data?.successData&&message.success('导入成功！');
                                        info.file.response?.data?.successData&&setTableDataSource(tableDataSource.concat(info.file.response?.data?.successData))
                                    }
                                }
                            }}
                        >
                            <Button type="primary"  ghost>上传材料需求</Button>
                        </Upload>
                        <Button type="primary" onClick={() => downloadTemplate('/tower-supply/materialPurchaseTask/export', '材料需求模板')} ghost>模板下载</Button>
                        <Button type="primary" onClick={async () => {
                            const data: any = await RequestUtil.get(`/tower-supply/materialPurchaseTask/material/${params.id}/2`)
                            setMaterialDataSource(data.map((item:any,index:number)=>{
                                return{
                                    ...item,
                                    waitPurchaseNum: tableDataSource[index].waitPurchaseNum,
                                }
                            }));
                            setVisible(true)
                        }}>扣减库存</Button>
                        <Button type="primary" onClick={async () => {
                            setLoaded(true)
                            await RequestUtil.put(`/tower-supply/materialPurchaseTask/material`,{
                                projectMaterialList: tableDataSource,
                                purchaseTaskId: params.id
                            })
                            message.success(`保存成功！`)
                            setLoaded(false)
                            history.go(0)
                        }} loading={loaded}>保存</Button>
                        <Button type="primary" onClick={async () => {
                            setLoadedR(true)
                            await RequestUtil.put(`/tower-supply/materialPurchaseTask/material/finish`,{
                                projectMaterialList: tableDataSource,
                                purchaseTaskId: params.id
                            })
                            message.success(`汇总完成！`)
                            setLoadedR(false)
                            history.go(-1)
                        }} loading={loadedR}>完成汇总</Button>
                    </Space>}
                </div>
                
                <CommonTable 
                    dataSource={[...tableDataSource]} 
                    columns={materialColumns}
                    pagination={false}
                />
                <Modal
                    visible={urlVisible}
                    onOk={() => {
                        window.open(url);
                        setUrlVisible(false);
                    }}
                    onCancel={() => { setUrlVisible(false); setUrl('') }}
                    title='提示'
                    okText='下载'
                >
                    当前存在错误数据，请重新下载上传！
                </Modal>
                <Modal
                    visible={visible}
                    width={'90%'}
                    onOk={() => {
                        setTableDataSource(tableDataSource.map((item:any,index:number)=>{
                            return{
                                ...item,
                                waitPurchaseNum: materialDataSource[index].waitPurchaseNum,
                                waitPurchaseWeight: (parseFloat(item?.totalWeight)/parseFloat(item?.num)*parseFloat(materialDataSource[index].waitPurchaseNum)).toFixed(4),
                                occupiedNum: materialDataSource[index].occupiedNum,
                            }
                        }))
                        setVisible(false)
                    }}
                    onCancel={() => { setVisible(false) }}
                    title='扣减库存'
                >
                    <CommonTable 
                        pagination={false}
                        dataSource={[...materialDataSource]} 
                        columns={[
                            { 
                                title: '序号', 
                                dataIndex: 'index', 
                                key: 'index', 
                                render: (_a: any, _b: any, index: number): React.ReactNode => (
                                    <span>{index + 1}</span>
                                ) 
                            },
                            { 
                                title: '品名', 
                                dataIndex: 'materialName', 
                                key: 'materialName', 
                            },
                            // { 
                            //     title: '模式', 
                            //     dataIndex: 'patternName', 
                            //     key: 'patternName'
                            // },
                            { 
                                title: '标准', 
                                dataIndex: 'materialStandardName', 
                                key: 'materialStandardName' 
                            },
                            { 
                                title: '材质', 
                                dataIndex: 'structureTexture', 
                                key: 'structureTexture' 
                            },
                            { 
                                title: '规格', 
                                dataIndex: 'structureSpec', 
                                key: 'structureSpec' 
                            },
                            { 
                                title: '长度（mm）', 
                                dataIndex: 'length', 
                                key: 'length' 
                            },
                            { 
                                title: '宽度（mm）', 
                                dataIndex: 'width', 
                                key: 'width', 
                            },
                            { 
                                title: '数量', 
                                dataIndex: 'num', 
                                key: 'num', 
                            },
                            { 
                                title: '总重量（吨）', 
                                dataIndex: 'totalWeight', 
                                key: 'totalWeight', 
                            },
                            { 
                                title: '仓库可用库存（个）', 
                                dataIndex: 'realMaterialStock', 
                                render:(value:number)=> <span>{value}</span>
                            },
                            { 
                                title: '本次占用库存（个）', 
                                dataIndex: 'occupiedNum', 
                                render:(value:number)=> <span>{value}</span>
                            },
                            { 
                                title: '计划采购（个）', 
                                dataIndex: 'waitPurchaseNum', 
                                key: 'waitPurchaseNum',
                                render: (value: number, records: any, key: number) => <InputNumber min={0} precision={0} value={value || undefined} onChange={(value: number) => handleNumChange(value, key)} key={key} />
                            }
                        ]}
                    />
                </Modal>
            </DetailContent>
        </Spin>
    </>
}