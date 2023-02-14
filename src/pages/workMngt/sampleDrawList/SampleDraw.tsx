import React, { useRef, useState } from 'react';
import { Space, Input, DatePicker, Button, Modal, Form, Image, message, Popconfirm, Upload, Select } from 'antd';
import { Attachment, AttachmentRef, Page } from '../../common';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { downloadTemplate } from '../setOut/downloadTemplate';
import styles from './sample.module.less';
import { FileProps } from '../../common/Attachment';

export default function SampleDraw(): React.ReactNode {
    const params = useParams<{ id: string, status: string }>()
    const history = useHistory();
    const [filterValue, setFilterValue] = useState({});
    const [visible, setVisible] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [url, setUrl] = useState<any>();
    const [form] = Form.useForm();
    const [headerName, setHeaderName] = useState({
        uploadSmallSampleCount: 0,
        noSmallSampleCount: 0
    });
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/smallSample/sampleStat/${params.id}`);
        setHeaderName(data);
        resole(data)
    }), {})
    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            console.log(submitData)
            setVisible(false)
        } catch (error) {
            console.log(error)
        }
    }
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'segmentName',
            title: '段名',
            width: 50,
            dataIndex: 'segmentName'
        },
        {
            key: 'code',
            title: '构件编号',
            width: 100,
            dataIndex: 'code'
        },
        {
            key: 'materialName',
            title: '材料名称',
            width: 100,
            dataIndex: 'materialName'
        },
        {
            key: 'smallSample',
            title: '小样图名称',
            width: 100,
            dataIndex: 'smallSample'
        },
        {
            key: 'uploadTime',
            title: '上传时间',
            width: 200,
            dataIndex: 'uploadTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 50,
            // fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    {params.status === '1' ? <Popconfirm
                        title="要删除该条数据吗？"
                        okText="确认"
                        cancelText="取消"
                        onConfirm={async () => await RequestUtil.delete(`/tower-science/smallSample/sampleDelete?ids=${record.id}`).then(() => {
                            message.success('删除成功！');
                        }).then(async () => {
                            const data: any = await RequestUtil.get(`/tower-science/smallSample/sampleStat/${params.id}`);
                            setHeaderName(data);
                            setRefresh(!refresh)
                        })}
                        disabled={!record.smallSample}
                    >
                        <Button type="link" disabled={!record.smallSample}>
                            删除
                        </Button>
                    </Popconfirm> : null}
                    <Button type='link' onClick={async () => {
                        const url: any = await RequestUtil.get(`/tower-science/smallSample/sampleView/${record.id}`);
                        if (url?.fileSuffix === 'pdf') {
                            window.open(`${process.env.PDF_PREVIEW}?fileName=${encodeURIComponent(url?.originalName as string)}&url=${encodeURIComponent(url?.downloadUrl as string)}`)
                        } else {
                            setUrl({
                                downloadUrl: url?.downloadUrl,
                                fileSuffix: url?.fileSuffix
                            });
                            setVisible(true)
                        }
                    }}>查看</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => { setVisible(false); setUrl(''); };
    const attachRef = useRef<AttachmentRef>({ getDataSource: () => [], resetFields: () => { } })
    const onFilterSubmit = (value: any) => {
        if (value.upLoadTime) {
            const formatDate = value.upLoadTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.uploadTimeStart = formatDate[0] + ' 00:00:00';
            value.uploadTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.upLoadTime
        }
        setFilterValue(value)
        return value
    }
    const uploadChange = async (event: any) => {
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                // const dataInfo = event.file.response.data
                // const fileInfo = dataInfo.name.split(".");
                // const value=[{
                //     name: dataInfo.originalName.split('.')[0],
                //     fileSuffix:fileInfo[fileInfo.length - 1],
                //     filePath: dataInfo.name,
                //     userName:dataInfo.userName
                // }]
                const data: any = await RequestUtil.get(`/tower-science/smallSample/sampleStat/${params.id}`)
                setHeaderName(data);
                // }).then(()=>{
                setRefresh(!refresh);
                // })
            }
        } else if (event.file.status === "error") {
            message.error('上传失败');
        }
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const del = () => {
        if (selectedKeys.length > 0) {
            RequestUtil.delete(`/tower-science/smallSample/sampleDelete?ids=${selectedKeys.join(',')}`).then(res => {
                message.success('删除成功');
                history.go(0);
            })
        } else {
            message.warning('请选择要删除的数据')
        }
    }

    return (
        <>
            <Modal
                visible={visible}
                title="预览" footer={false}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={1011}>
                {
                    url?.fileSuffix === "dxf" ? <>
                        <iframe
                            src={`${process.env.DXF_PREVIEW}?url=${encodeURIComponent(url?.downloadUrl)}`}
                            style={{
                                border: "none",
                                width: "100%",
                                minHeight: 400,
                                padding: 10
                            }}
                        />
                    </> : <Image
                        src={url?.downloadUrl}
                        preview={false}
                    />
                }
            </Modal>
            <Page
                path="/tower-science/smallSample/sampleList"
                columns={columns}
                refresh={refresh}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                requestData={{ productCategoryId: params.id }}
                extraOperation={
                    <Space>
                        {/* <Button type="primary">导出</Button> */}
                        <Button type="primary" onClick={() => {
                            downloadTemplate(`/tower-science/smallSample/download/${params.id}`, '小样图', {}, true)
                        }} ghost>导出</Button>
                        <Button type='primary' onClick={del} disabled={selectedKeys.length === 0} ghost>批量删除</Button>
                        {params.status === '1' ? <Popconfirm
                            title="确认完成小样图?"
                            onConfirm={async () => await RequestUtil.put(`/tower-science/smallSample/sampleComplete?productCategoryId=${params.id}`).then(() => {
                                message.success('提交成功！');
                            }).then(() => {
                                history.push('/workMngt/sampleDrawList');
                            })}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="primary">完成小样图</Button>
                        </Popconfirm> : null}
                        <Attachment multiple ref={attachRef} isTable={false} dataSource={[]} onDoneChange={(dataInfo: FileProps[]) => {
                            const data = dataInfo.map(res => {
                                return {
                                    ...res,
                                    fileName: res.originalName
                                }
                            })
                            RequestUtil.post(`/tower-science/smallSample/sampleUploadByZip/${params.id}`, [...data]).then(res => {
                                if (res) {
                                    message.success('上传成功');
                                    history.go(0);
                                }
                            }).catch(error => {
                                setTimeout(() => {
                                    history.go(0);
                                }, 1500)
                            })
                        }}>
                            <Button type="primary" ghost>导入</Button>
                        </Attachment>
                        <Button type="primary" onClick={() => {
                            history.push(`/workMngt/sampleDrawList/sampleDraw/${params.id}/${params.status}/downLoad`)
                        }} ghost>下载样图</Button>
                        <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                        <span>小样图数：<span style={{ color: '#FF8C00' }}>{headerName?.uploadSmallSampleCount}/{headerName?.uploadSmallSampleCount + headerName?.noSmallSampleCount}</span></span>
                    </Space>
                }
                tableProps={{
                    rowSelection: {
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }
                }}
                searchFormItems={[
                    {
                        name: 'upLoadTime',
                        label: '上传时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'uploadStatus',
                        label: '上传状态',
                        // 0是未上传1已上传
                        children: <Select style={{ width: "200px" }} defaultValue={''}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={0} key={0}>未上传</Select.Option>
                            <Select.Option value={1} key={1}>已上传</Select.Option>
                        </Select>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入段号/构件编号进行查询" maxLength={200} />
                    },
                ]}
            />
        </>
    )
}