import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Modal, Form, Image, Popconfirm, Descriptions, Upload, message } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import { CommonTable, DetailTitle, Page, SearchTable } from '../../common';
import { useHistory, useParams } from 'react-router-dom';
import { CloudUploadOutlined } from '@ant-design/icons';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import { downLoadFile } from '../../../utils';
import useRequest from '@ahooksjs/use-request';
import styles from './sample.module.less'

export default function SampleDrawCheck(): React.ReactNode {
    const params = useParams<{ id: string }>()
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [errorVisible, setErrorVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [attachInfo, setAttachInfo] = useState<any>({})
    const [filterValue, setFilterValue] = useState({});
    const [questionDetail, setQuestionDetail] = useState<any>({});
    const [url, setUrl] = useState<string>('');
    const [questionStatus, setQuestionStatus] = useState<number>(0);
    const handleErrorModalOk = async () => {
        try {
            const submitData = {
                keyId: questionDetail.keyId,
                currentFile: questionDetail.currentFile,
                newFile: attachInfo
            }
            await RequestUtil.post(`/tower-science/smallSample/saveIssue`, submitData).then(()=>{
                message.success('提交成功！')
            }).then(()=>{
                setErrorVisible(false);
                setRefresh(!refresh)
            })
        } catch (error) {
            console.log(error)
        }
    }
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/smallSample/sampleStat/${params.id}`)
        resole(data)
    }), {})
    const headerName:any = data;

    const tableColumns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '操作部门', dataIndex: 'createDeptName', key: 'createDeptName', },
        { title: '操作人', dataIndex: 'createUserName', key: 'createUserName' },
        { title: '操作时间', dataIndex: 'createTime', key: 'createTime' },
        { title: '问题单状态', dataIndex: 'status', key: 'status',render: (value: number, record: object): React.ReactNode => {
            const renderEnum: any = [
              {
                value: 1,
                label: "待修改"
              },
              {
                value: 2,
                label: "已修改"
              },
              {
                value: 3,
                label: "已拒绝"
              },
              {
                value: 4,
                label: "已删除"
              }
            ]
            return <>{value && renderEnum.find((item: any) => item.value === value).label}</>
        } },
        { title: '备注', dataIndex: 'description', key: 'description' }
    ]
    
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
            width: 100,
            dataIndex: 'segmentName'
        },
        {
            key: 'code',
            title: '构件编号',
            width: 200,
            dataIndex: 'code'
        },
        {
            key: 'materialName',
            title: '材料名称',
            width: 200,
            dataIndex: 'materialName'
        },
        {
            key: 'smallSample',
            title: '小样图名称',
            width: 200,
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
            width: 100,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={async () => {
                        const url:any = await RequestUtil.get(`/tower-science/smallSample/sampleView/${record.id}`);
                        setUrl(url?.filePath);
                        setVisible(true)
                    }}>查看</Button>
                    <Button type='link' onClick={async () => {
                        setQuestionStatus(record.issueStatus);
                        const data:any = await RequestUtil.get(`/tower-science/smallSample/issueDetail?keyId=${record.id}`)
                        setQuestionDetail(data);
                        setAttachInfo(data.newFile)
                        setErrorVisible(true);
                    }}>{record.issueStatus!==1?'提交问题单':'查看问题单'}</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => {setVisible(false); setUrl('');setQuestionStatus(0);};
    const handleErrorModalCancel = () => setErrorVisible(false);
    const onFilterSubmit = (value: any) => {
        if (value.upLoadTime) {
            const formatDate = value.upLoadTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.uploadTimeStart = formatDate[0]+ ' 00:00:00';
            value.uploadTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.upLoadTime
        }
        setFilterValue(value)
        return value
    }
    const deleteAttachData = () => {
        setAttachInfo({})
    }
    return (
        <div className={styles.check}>
            <Modal visible={visible} title="图片" footer={false}  onCancel={handleModalCancel} width={800}>
                <Image 
                    src={url}
                    preview={false}
                />
            </Modal>
            <Modal visible={errorVisible} title={questionStatus===1?"查看问题单":"创建问题单"}  onCancel={handleErrorModalCancel} width={1200} footer={false}>
                <DetailTitle title="问题信息" />
                <Descriptions
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="小样图名称">{questionDetail?.smallSample}</Descriptions.Item>
                    <Descriptions.Item label="备注">{questionDetail?.description}</Descriptions.Item>
                    <Descriptions.Item label="校核前图片">
                        <Image src={questionDetail?.currentFile?.filePath||''} height={100}/>
                    </Descriptions.Item>
                    {questionStatus!==1?<Descriptions.Item label={<Upload 
                        accept="image/png,image/jpeg"
                        multiple={true}
                        action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
                        headers={{
                            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                            'Tenant-Id': AuthUtil.getTenantId(),
                            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
                        }}
                        onChange={(event: any)=>{
                            if (event.file.status === "done") {
                                if (event.file.response.code === 200) {
                                    const dataInfo = event.file.response.data
                                    const fileInfo = dataInfo.name.split(".")
                                    setAttachInfo({
                                        // id: "",
                                        uid: attachInfo.length,
                                        name: dataInfo.originalName.split(".")[0],
                                        description: "",
                                        filePath: dataInfo.name,
                                        link: dataInfo.link,
                                        fileSize: dataInfo.size,
                                        fileSuffix: fileInfo[fileInfo.length - 1],
                                        userName: dataInfo.userName,
                                        fileUploadTime: dataInfo.fileUploadTime
                                    })
                                }
                            }
                        }}
                        showUploadList={false}
                    >校核后图片 <CloudUploadOutlined /></Upload>}>
                        <div style={{display:'flex',alignItems:'center'}}> 
                        { attachInfo.link ? 
                            <>
                            <Image src={ attachInfo.link } height={100}/>
                            <Button type='link' onClick={()=>{downLoadFile(attachInfo.link)}}>下载</Button>
                            <Button type='link' onClick={()=>{deleteAttachData()}}>删除</Button>
                            </>
                        :null }
                        </div>
                    </Descriptions.Item>:
                    <Descriptions.Item label="校核后图片">
                        <Image src={questionDetail?.newFile?.filePath||''} height={100}/>
                    </Descriptions.Item>}
                </Descriptions>
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={questionDetail?.issueRecordList} pagination={false}/>
                {questionStatus!==1?<Space style={{position:'relative',left:'90%'}}>
                    <Button onClick={handleErrorModalCancel}>取消</Button>
                    <Button type='primary' onClick={handleErrorModalOk}>确定</Button>
                </Space>:null}
            </Modal>
            <SearchTable
                path="/tower-science/smallSample/checkList"
                columns={columns}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                refresh={refresh}
                requestData={{productCategoryId: params.id}}
                extraOperation={
                    <Space>
                        {/* <Button type="primary">导出</Button> */}
                        <Popconfirm
                            title="确认完成校核?"
                            onConfirm={ async () =>  await RequestUtil.put(`/tower-science/smallSample/completeCheck?productCategoryId=${params.id}`).then(()=>{
                                message.success('提交成功！');
                            }).then(()=>{
                                history.push('/workMngt/sampleDrawList');
                            })}
                            okText="确认"
                            cancelText="取消"
                        >   
                            <Button type="primary">完成校核</Button>
                        </Popconfirm>
                        <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                        <span>小样图数：<span style={{color:'#FF8C00'}}>{headerName?.uploadSmallSampleCount&&headerName?.uploadSmallSampleCount!==-1?headerName?.uploadSmallSampleCount:0}/{(headerName?.uploadSmallSampleCount&&headerName?.uploadSmallSampleCount!==0?headerName?.uploadSmallSampleCount:0)+(headerName?.noSmallSampleCount&&headerName?.noSmallSampleCount!==-1?headerName?.noSmallSampleCount:0)}</span></span>
                    </Space>
                }
                tableProps={{
                    onRow:(record:any) => ({
                        // onDoubleClick: async () => {
                        //     setQuestionStatus(record.issueStatus);
                        //     const data:any = await RequestUtil.get(`/tower-science/smallSample/issueDetail?keyId=${record.id}`)
                        //     setQuestionDetail(data);
                        //     setAttachInfo(data.newFile)
                        //     setErrorVisible(true);
                        // },
                        className: record.issueStatus===1? styles.red: record.issueStatus===2? styles.green:record.issueStatus===0?styles.yellow :styles.tableRow
                    })
                }}
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
        </div>
    )
}