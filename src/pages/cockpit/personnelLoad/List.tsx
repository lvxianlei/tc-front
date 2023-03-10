/**
 * @author zyc
 * @copyright © 2022
 * @description 驾驶舱-人员工作负荷
 */

import React, { useRef, useState } from 'react';
import { Space, Input, Form, Spin, Button, Radio, RadioChangeEvent, Row, Col, Dropdown, Menu, Modal, message } from 'antd';
import { CommonAliTable, CommonTable, IntgSelect } from '../../common';
import styles from './PersonnelLoad.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { columns, tableColumns } from "./personnelLoad.json"
import { DownOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import Allocation from './Allocation';

export interface IPersonnelLoad {
    readonly id?: string;
}

interface modalProps {
    onSubmit: () => void;
    resetFields: () => void
}

export interface IResponseData {
    readonly total: number;
    readonly size: number;
    readonly current: number;
    readonly records: IPersonnelLoad[];
}

export default function List(): React.ReactNode {
    const [form] = Form.useForm();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [status, setStatus] = useState<number>(1);
    const [detailData, setDetailData] = useState<any>();
    const [visible, setVisible] = useState<boolean>(false);
    const editRef = useRef<modalProps>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const history = useHistory()
    const height = document.documentElement.clientHeight - 200;

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => userChange('放样员')}>
                放样员
            </Menu.Item>
            <Menu.Item key="2" onClick={() => userChange('提料员')}>
                提料员
            </Menu.Item>
            <Menu.Item key="3" onClick={() => userChange('编程员')}>
                编程员
            </Menu.Item>
            <Menu.Item key="4" onClick={() => userChange('螺栓员')}>
                螺栓员
            </Menu.Item>
        </Menu>
    );

    const userChange = (title: string) => {
        setTitle(title)
        setVisible(true)
    }

    const { loading, data, run } = useRequest<any[]>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<any>(`/tower-science/personal/work/load`, { type: status, ...filterValue });
        // setPage({ ...data });
        if (data?.workLoadVOList?.length > 0 && data?.workLoadVOList[0]?.id) {
            detailRun(data?.workLoadVOList[0]?.userId, data?.workLoadVOList[0]?.type)
        } else {
            setDetailData([]);
        }
        resole(data?.workLoadVOList);
    }), {})

    const { run: detailRun } = useRequest<any>((id: string, type: number) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/personal/work/load/detail/list`, {
                userId: id,
                type: type
            });
            setDetailData(result)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSearch = (values: Record<string, any>) => {
        setFilterValues(values);
        run({ ...values });
    }

    // const handleChangePage = (current: number, pageSize: number) => {
    //     setPage({ ...page, current: current, size: pageSize });
    //     run({ current: current, size: pageSize }, { ...filterValues })
    // }

    const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.userId, record.type)
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit();
            message.success('人员配置成功');
            setVisible(false);
            history?.go(0);
            resove(true);
        } catch (error) {
            reject(false)
        }
    })

    return <Spin spinning={loading}>
        <Modal
            destroyOnClose
            key='allocation'
            visible={visible}
            width="60%"
            title={"人员配置-" + title}
            footer={
                <Space>
                    <Button type="ghost" onClick={async () => {
                        setVisible(false);
                        editRef.current?.resetFields()
                    }}>关闭</Button>
                    <Button type="primary" loading={confirmLoading} onClick={handleModalOk} ghost>保存</Button>
                </Space>
            }
            onCancel={() => {
                setVisible(false);
            }}>
            <Allocation type={title} getLoading={(loading: boolean) => setConfirmLoading(loading)} ref={editRef} />
        </Modal>
        <Form form={form} layout="inline" className={styles.search} onFinish={onSearch}>
            <Form.Item name="userId">
                <IntgSelect style={{ width: '200px' }} placeholder="姓名" />
            </Form.Item>
            <Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button htmlType="reset">重置</Button>
                </Space>
            </Form.Item>
        </Form>
        <Row justify="space-between" style={{ marginBottom: '6px' }}>
            <Col>
                <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                    setStatus(event.target.value);
                    setFilterValues({ type: event.target.value });
                    run({ type: event.target.value })
                }}>
                    <Radio.Button value={1} key="1">全部</Radio.Button>
                    <Radio.Button value={2} key="2">放样</Radio.Button>
                    <Radio.Button value={3} key="3">提料</Radio.Button>
                    <Radio.Button value={4} key="4">编程</Radio.Button>
                    <Radio.Button value={5} key="5">螺栓</Radio.Button>
                </Radio.Group>
            </Col>
            <Col>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button type='primary' ghost>
                        人员配置
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </Col>
        </Row>
        <div className={styles.left}>
            <CommonTable
                haveIndex
                columns={[
                    ...columns.map((item: any) => {
                        if (item.dataIndex === 'segmentName') {
                            return ({
                                ...item,
                                sorter: (a: any, b: any) => a.segmentName - b.segmentName
                            })
                        }
                        return item
                    })
                ]}
                dataSource={data}
                // pagination={{
                //     current: page.current,
                //     pageSize: page.size,
                //     total: page?.total,
                //     showSizeChanger: true,
                //     onChange: handleChangePage
                // }}
                pagination={false}
                onRow={(record: Record<string, any>) => ({
                    onClick: () => onRowChange(record),
                    className: styles.tableRow
                })}
            />
        </div>
        <div className={styles.right}>
            <CommonAliTable
                haveIndex
                columns={tableColumns}
                dataSource={[...detailData || []]}
                pagination={false}
                style={{maxHeight: height, overflow: 'auto'}}
            />
        </div>
    </Spin>
}