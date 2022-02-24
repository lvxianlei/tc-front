/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-组焊列表-组焊清单
*/

import React from 'react'
import { Button, message, Modal, Popconfirm, Space, Spin, TablePaginationConfig, Upload } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { useState } from 'react';
import styles from './AssemblyWelding.module.less';
import { downloadTemplate } from '../setOut/downloadTemplate';
import AssemblyWeldingNew, { IBaseData } from './AssemblyWeldingNew';
import AuthUtil from '../../../utils/AuthUtil';

interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: IData[];
}

interface IData {
    readonly id?: string;
}

export interface ISegmentNameList {
    readonly id?: string;
}

export default function AssemblyWeldingListing(): React.ReactNode {
    const towerColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            title: '段号',
            dataIndex: 'segmentName',
            key: 'segmentName'
        },
        {
            title: '组件号',
            dataIndex: 'componentId',
            key: 'componentId'
        },
        {
            title: '主件号',
            dataIndex: 'mainPartId',
            key: 'mainPartId'
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
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                    <Button type="link" onClick={() => { setVisible(true); setName('编辑'); setRecord(record) }}>编辑</Button>
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
    const params = useParams<{ id: string, productCategoryId: string }>();
    const [paragraphData, setParagraphData] = useState([] as undefined | any);
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [record, setRecord] = useState<IBaseData>({});
    const [url, setUrl] = useState<string>('');
    const [urlVisible, setUrlVisible] = useState<boolean>(false);
    const location = useLocation<{ status: number }>();
    const [segmentNameList, setSegmentNameList] = useState<ISegmentNameList[]>([]);

    const getTableDataSource = (pagination: TablePaginationConfig) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<IResponseData>(`/tower-science/welding/getDetailedById`, { weldingId: params.id, ...pagination });
        setDetailData(data);
        if (data?.records && data?.records[0]) {
            getParagraphData(data?.records && data?.records[0].id || '')
        }
        resole(data);
    });
    const getParagraphData = async (id: string) => {
        const resData: [] = await RequestUtil.get(`/tower-science/welding/getStructureById`, { segmentId: id });
        setParagraphData([...resData]);
    }

    const { loading } = useRequest<IResponseData>(() => getTableDataSource(page), {});

    return <>
        <Spin spinning={loading}>
            <DetailContent>
                <Space direction="horizontal" size="small" className={styles.bottomBtn}>
                    {location.state.status === 3 ? <>
                        <Button type="primary" onClick={() => downloadTemplate(`/tower-science/welding/downloadSummary?productCategoryId=${params.productCategoryId}`, '组焊清单')} ghost>导出</Button>
                        <Button type="primary" onClick={() => downloadTemplate('/tower-science/welding/exportTemplate', '组焊模板')} ghost>模板下载</Button>
                        <Button type="primary" onClick={() => RequestUtil.post<IResponseData>(`/tower-science/welding/completeWeldingTask`, { weldingId: params.id }).then(res => {
                            history.goBack();
                        })} >完成组焊清单</Button>
                        <Button type="primary" onClick={async () => {
                            setVisible(true);
                            setName('添加组焊');
                            const data: ISegmentNameList[] = await RequestUtil.get(`/tower-science/welding/getWeldingSegment?weldingId=${params.id}`);
                            setSegmentNameList(data);
                        }}>添加组焊</Button>
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
                            <Button type="primary" ghost>导入</Button>
                        </Upload></> : null}
                    <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                </Space>
                <CommonTable
                    dataSource={detailData?.records}
                    columns={location.state.status === 3 ? towerColumns : towerColumns.splice(0, 6)}
                    onRow={(record: Record<string, any>, index: number) => ({
                        onClick: () => { getParagraphData(record.id) },
                        className: styles.tableRow
                    })
                    }
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
        {
            visible ?
                <AssemblyWeldingNew
                    id={params.id}
                    segmentId={record.id}
                    record={record}
                    productCategoryId={params.productCategoryId}
                    name={name}
                    updateList={() => history.go(0)}
                    visible={visible}
                    modalCancel={() => setVisible(false)}
                    segmentNameList={segmentNameList}
                />
                : null
        }
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