/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-组焊列表-组焊清单
*/

import React from 'react'
import { Button, message, Modal, Popconfirm, Space, Spin, TablePaginationConfig, Upload } from 'antd';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { useState } from 'react';
import styles from './AssemblyWelding.module.less';
import { downloadTemplate } from '../setOut/downloadTemplate';
import AuthUtil from '../../../utils/AuthUtil';
import { IResponseData, ISegmentNameList } from './IAssemblyWelding';

export default function AssemblyWeldingListing(): React.ReactNode {
    const towerColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            title: '所属段',
            dataIndex: 'segmentName',
            key: 'segmentName'
        },
        {
            title: '组件号',
            dataIndex: 'componentId',
            key: 'componentId'
        },
        {
            title: '组焊类型',
            dataIndex: 'weldingTypeName',
            key: 'weldingTypeName'
        },
        {
            title: '单段组数',
            dataIndex: 'segmentGroupNum',
            key: 'segmentGroupNum'
        },
        {
            title: '主件号',
            dataIndex: 'mainPartId',
            key: 'mainPartId'
        },
        {
            title: '焊缝等级',
            dataIndex: 'weldGrade',
            key: 'weldGrade'
        },
        {
            title: '单组重量（kg）',
            dataIndex: 'singleGroupWeight',
            key: 'singleGroupWeight'
        },
        {
            title: '电焊米数（mm）',
            dataIndex: 'electricWeldingMeters',
            key: 'electricWeldingMeters'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => RequestUtil.delete(`/tower-science/welding/deleteWelding`, { segmentId: record.id }).then(res => {
                            message.success('删除成功');
                            history.go(0);
                        })}
                        okText="删除"
                        cancelText="取消"
                        disabled={params.weldingLeader.split(',').indexOf(userId) === -1}
                    >
                        <Button type="link" disabled={params.weldingLeader.split(',').indexOf(userId) === -1}>删除</Button>
                    </Popconfirm>
                    <Link to={`/workMngt/assemblyWeldingList/assemblyWeldingListing/${params.id}/${params.productCategoryId}/${params.weldingLeader}/edit/${record.id}`}>
                        <Button type='link' disabled={params.weldingLeader.split(',').indexOf(userId) === -1}>编辑</Button>
                    </Link>
                    <Link to={`/workMngt/assemblyWeldingList/assemblyWeldingListing/${params.id}/${params.productCategoryId}/${params.weldingLeader}/apply/${record.id}`}>
                        <Button type='link' disabled={params.weldingLeader.split(',').indexOf(userId) === -1}>套用</Button>
                    </Link>
                    {/* <Button type="link" onClick={() => { setVisible(true); setName('编辑'); setRecord(record) }}>编辑</Button> */}
                </Space>
            )
        }
    ]

    const paragraphColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            title: '零件号',
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
            key: 'structureSpec'
        },
        {
            title: '宽度（mm）',
            dataIndex: 'width',
            key: 'width'
        },
        {
            title: '厚度（mm）',
            dataIndex: 'thickness',
            key: 'thickness'
        },
        {
            title: '长度（mm）',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: '单组件数',
            dataIndex: 'singleNum',
            key: 'singleNum'
        },
        {
            title: '电焊长度（mm）',
            dataIndex: 'weldingLength',
            key: 'weldingLength'
        },
        {
            title: '备注',
            dataIndex: 'description',
            key: 'description'
        }
    ]

    const history = useHistory();
    const page = {
        current: 1,
        pageSize: 10
    };
    const [detailData, setDetailData] = useState<IResponseData | undefined>(undefined);
    const params = useParams<{ id: string, productCategoryId: string, weldingLeader: string }>();
    const [paragraphData, setParagraphData] = useState([] as undefined | any);
    // const [record, setRecord] = useState<IBaseData>({});
    const [url, setUrl] = useState<string>('');
    const [urlVisible, setUrlVisible] = useState<boolean>(false);
    const location = useLocation<{ status?: number }>();
    const userId = AuthUtil.getUserInfo().user_id;
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const getTableDataSource = (pagination: TablePaginationConfig) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<IResponseData>(`/tower-science/welding/getDetailedById`, { weldingId: params.id, ...pagination });
        setDetailData(data);
        if (data?.records && data?.records[0]) {
            getParagraphData(data?.records && data?.records[0].id || '')
        }
        resole(data);
    });
    const getParagraphData = async (id: string) => {
        const resData: [] = await RequestUtil.get(`/tower-science/welding/getStructureById`, { segmentId: id, flag: 0 });
        setParagraphData([...resData]);
    }

    const { loading } = useRequest<IResponseData>(() => getTableDataSource(page), {});

    const handleOk = () => {
        RequestUtil.get<boolean>(`/tower-science/welding/getWeldingStructure`, { weldingId: params.id }).then(res => {
            if (res) {
                RequestUtil.post<IResponseData>(`/tower-science/welding/completeWeldingTask`, { weldingId: params.id }).then(res => {
                    message.success('完成组焊清单成功！')
                    history.goBack();
                })
            } else {

                Modal.confirm({
                    title: "存在剩余未组合零件，是否完成组焊？",
                    onOk: async () => new Promise(async (resove, reject) => {
                        try {
                            RequestUtil.post<IResponseData>(`/tower-science/welding/completeWeldingTask`, { weldingId: params.id }).then(res => {
                                message.success('完成组焊清单成功！')
                                history.goBack();
                                resove(true)
                            })
                        } catch (error) {
                            reject(error)
                        }
                    })
                })
            }
        })
    }

    return <>
        <Spin spinning={loading}>
            <DetailContent>
                <Space direction="horizontal" size="small" className={styles.bottomBtn}>
                    <Button type="primary" onClick={() => downloadTemplate(`/tower-science/welding/downloadSummary?productCategoryId=${params.productCategoryId}`, '组焊清单')} ghost>导出</Button>
                    <Button type="primary" onClick={() => downloadTemplate('/tower-science/welding/exportTemplate', '组焊模板')} ghost>模板下载</Button>
                    <Button type="primary" disabled={location.state?.status === 3 || params.weldingLeader.split(',').indexOf(userId) === -1} onClick={handleOk} >完成组焊清单</Button>
                    <Link to={`/workMngt/assemblyWeldingList/assemblyWeldingListing/${params.id}/${params.productCategoryId}/${params.weldingLeader}/new`}>
                        <Button type="primary" disabled={params.weldingLeader.split(',').indexOf(userId) === -1}>添加组焊</Button>
                    </Link>
                    <Upload
                        action={() => {
                            const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                            return baseUrl + '/tower-science/welding/import'
                        }}
                        headers={
                            {
                                'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                                'Tenant-Id': AuthUtil.getTenantId(),
                                'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                            }
                        }
                        showUploadList={false}
                        data={{ weldingId: params.id }}
                        onChange={(info) => {
                            if (info.file.response && !info.file.response?.success) {
                                message.warning(info.file.response?.msg)
                            }
                            if (info.file.response && info.file.response?.success) {
                                if (Object.keys(info.file.response?.data).length > 0) {
                                    setUrl(info.file.response?.data);
                                    setUrlVisible(true);
                                } else {
                                    message.success('导入成功！');
                                    history.go(0);
                                }
                            }
                        }}
                    >
                        <Button type="primary" disabled={params.weldingLeader.split(',').indexOf(userId) === -1} ghost>导入</Button>
                    </Upload>
                    <Button type='primary' onClick={async () => {
                        await RequestUtil.delete(`/tower-science/welding/deleteList`, {
                            segmentIdList: selectedKeys
                        })
                        await message.success('删除成功！')
                        history.go(0)
                    }} disabled={selectedKeys?.length <= 0} ghost>批量删除</Button>
                    <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                </Space>
                <CommonTable
                    dataSource={detailData?.records}
                    columns={towerColumns}
                    onRow={
                        (record: Record<string, any>, index: number) => ({
                            onClick: () => { getParagraphData(record.id) },
                            className: styles.tableRow
                        })
                    }
                    rowSelection={{
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }}
                    onChange={(pagination: TablePaginationConfig) => {
                        getTableDataSource(pagination);
                    }}
                    pagination={{
                        current: detailData?.current || 0,
                        pageSize: detailData?.size || 0,
                        total: detailData?.total || 0,
                        showSizeChanger: false
                    }}
                />
                <CommonTable dataSource={paragraphData} columns={paragraphColumns} pagination={false} />
            </DetailContent>
        </Spin>
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
    </>
}