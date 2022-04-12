import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Modal, Form, Image, message, Popconfirm, Upload } from 'antd';
import { Page } from '../../common';
import { useHistory, useParams } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import AuthUtil from '../../../utils/AuthUtil';
import { downloadTemplate } from '../setOut/downloadTemplate';
import styles from './sample.module.less';

export default function SampleDraw(): React.ReactNode {
    const params = useParams<{ id: string, status: string }>()
    const history = useHistory();
    const [filterValue, setFilterValue] = useState({});
    const [visible, setVisible] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [form] = Form.useForm();
    const [headerName, setHeaderName] = useState({
        uploadSmallSampleCount: 0,
        noSmallSampleCount: 0
    });
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
                        onConfirm={async () => await RequestUtil.delete(`/tower-science/smallSample/sampleDelete/${record.id}`).then(() => {
                            message.success('删除成功！');
                        }).then(async () => {
                            const data: any = await RequestUtil.get(`/tower-science/smallSample/sampleStat/${params.id}`);
                            setHeaderName(data);
                            setRefresh(!refresh)
                        })}
                    >
                        <Button type="link" disabled={!record.smallSample}>
                            删除
                        </Button>
                    </Popconfirm> : null}
                    <Button type='link' onClick={async () => {
                        const url: any = await RequestUtil.get(`/tower-science/smallSample/sampleView/${record.id}`);
                        if(url?.fileSuffix === 'pdf') {
                            window.open(url?.downloadUrl)
                        } else {
                            setUrl(url?.downloadUrl);
                            setVisible(true)
                        }
                    }}>查看</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => { setVisible(false); setUrl(''); };
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
    return (
        <>
            <Modal visible={visible} title="图片" footer={false} onOk={handleModalOk} onCancel={handleModalCancel} width={800}>
                <Image
                    src={url}
                    preview={false}
                />
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
                        }}>导出</Button>
                        {params.status === '1' ? <Upload
                            accept=".zip,.rar,.7z"
                            multiple={true}
                            action={`${process.env.REQUEST_API_PATH_PREFIX}/tower-science/smallSample/sampleUploadByZip/${params.id}`}
                            headers={{
                                'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                                'Tenant-Id': AuthUtil.getTenantId(),
                                'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                            }}
                            // data={ { productCategoryId:params.id } }
                            onChange={uploadChange}
                            showUploadList={false}
                        ><Button type="primary" >导入</Button></Upload> : null}
                        <Button type="primary" onClick={() => {
                            history.push(`/workMngt/sampleDrawList/sampleDraw/${params.id}/${params.status}/downLoad`)
                        }}>下载样图</Button>
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
                        <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                        <span>小样图数：<span style={{color:'#FF8C00'}}>{headerName?.uploadSmallSampleCount}/{headerName?.uploadSmallSampleCount + headerName?.noSmallSampleCount}</span></span>
                    </Space>
                }
                searchFormItems={[
                    {
                        name: 'upLoadTime',
                        label: '上传时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
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