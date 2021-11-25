import { Button, message, Modal, Upload, } from 'antd';
import React, { useState } from 'react';
import { useHistory, useParams, } from 'react-router-dom';
import AuthUtil from '../../../utils/AuthUtil';
import { Page } from '../../common';
import { downloadTemplate } from '../setOut/downloadTemplate';
import BoltDetailAdd from './addModal';
import './BoltDetailList.less';
import BoltDetailProblem from './problemModal';

export default function BoltCheck(): React.ReactNode {
    const params = useParams<{ id: string, boltId: string }>();
    const history = useHistory()
    const [urlVisible, setUrlVisible] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const columns: any = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 100,
            render: (_text: any, _item: any, index: number): React.ReactNode => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '螺栓类型',
            width: 150,
            dataIndex: 'typeName',
        },
        {
            title: '名称',
            width: 150,
            dataIndex: 'name',
        },
        {
            title: '等级',
            width: 150,
            dataIndex: 'level',
        },
        {
            title: '规格',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '无扣长（mm）',
            dataIndex: 'unbuckleLength',
            width: 120,
        },
        {
            title: '小计',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '合计',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '单重（kg）',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '合计重（kg）',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '备注',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '操作',
            width: 120,
            dataIndex: 'operation',
            render: (text: string, item: { id: string }) => {
                return (
                    <div className='operation'>
                        <span
                            onClick={() => {
                                setId(item.id)
                                setIsAddModal(true)
                            }}
                        >编辑</span>
                        <span
                            onClick={() => {
                                setId(item.id)
                                setIsProblemModal(true)
                            }}
                        >提交问题单</span>
                        <span
                            onClick={() => {
                            }}
                        >删除</span>
                    </div>
                )
            }
        },
    ]
    const [isAddModal, setIsAddModal] = useState<boolean>(false);//添加弹框显示
    const [isProblemModal, setIsProblemModal] = useState<boolean>(false);//提交问题弹框显示
    const [refresh, setRefresh] = useState(false);
    const [id, setId] = useState<string | null>(null)
    /**
     * 
     * @param refresh 是否刷新列表
     */
    const onCancel = (refresh?: boolean) => {
        if (refresh) {
            setRefresh(!refresh)
        }
        setIsAddModal(false)
        setIsProblemModal(false)
    }
    return (
        <div>
            <Page
                path={`/tower-science/boltRecord/basicHeight/${params.boltId}`}
                columns={columns}
                refresh={refresh}
                extraOperation={
                    <div>
                        <Button type="primary" onClick={() => downloadTemplate('/tower-science/boltRecord/exportTemplate', '螺栓导入模板')} ghost>模板下载</Button>
                        <Button type="primary" ghost onClick={() => { }} style={{ marginLeft: 10, }}>编辑/锁定</Button>
                        <Upload
                            action={() => {
                                const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                                return baseUrl + '/tower-science/boltRecord/import'
                            }}
                            headers={
                                {
                                    'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                                    'Tenant-Id': AuthUtil.getTenantId(),
                                    'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                                }
                            }
                            data={{ basicHeightId: params.id, productCategoryId: params.boltId }}
                            showUploadList={false}
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
                                        setRefresh(!refresh)
                                    }
                                }
                            }}
                        >
                            <Button type="primary" ghost onClick={() => { }} style={{ marginLeft: 10, }}>导入</Button>
                        </Upload>
                        <Button type="primary" ghost onClick={() => { setIsProblemModal(true) }} style={{ marginLeft: 10, }}>添加</Button>
                        <Button type="primary" ghost onClick={() => { history.go(-1) }} style={{ marginLeft: 10, }}>返回上一级</Button>
                    </div>
                }
                headTabs={[]}
                searchFormItems={[]}
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
            {
                isAddModal ?
                    <BoltDetailAdd
                        cancelModal={onCancel}
                        id={id}
                    /> : null
            }
            {
                isProblemModal ?
                    <BoltDetailProblem
                        cancelModal={onCancel}
                        id={id}
                    /> : null
            }
        </div>
    )
}