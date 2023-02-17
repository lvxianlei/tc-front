/**
 * @author zyc
 * @copyright © 2022
 * @description 驾驶舱-放样人员画像
 */

import React, { useState } from 'react';
import { Space, Input, Form, Spin, Button, Row, Select, Modal } from 'antd';
import { CommonTable } from '../../common';
import styles from './PersonnelPortrait.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { columns, tableColumns } from "./personnelPortrait.json";
import CorrectSetting from './CorrectSetting';

export interface IPersonnelLoad {
    readonly id?: string;
}

export interface IResponseData {
    readonly total: number;
    readonly size: number;
    readonly current: number;
    readonly records: IPersonnelLoad[];
}

export default function List(): React.ReactNode {
    const [form] = Form.useForm();
    const [detailData, setDetailData] = useState<any>();
    const [visible, setVisible] = useState<boolean>(false);
    const [rowId, setRowId] = useState<string>()
    const [date, setDate] = useState<any>();
    const halfYear = (new Date().getMonth() > 6) ? `${new Date().getFullYear()}-07,${new Date().getFullYear()}-12` : `${new Date().getFullYear()}-01,${new Date().getFullYear()}-06`;

    const { loading, data, run } = useRequest<any[]>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: any[] = await RequestUtil.get<any[]>(`/tower-science/loftingUserWork`, { fuzzyMsg: filterValue?.fuzzyMsg || '' });
        if (data?.length > 0 && data[0]?.loftingUser) {
            detailRun(data[0]?.loftingUser);
            setRowId(data[0]?.loftingUser)
        } else {
            setDetailData([]);
        }
        resole(data);
    }), {})

    const { run: detailRun } = useRequest<any>((id: string, time: string) => new Promise(async (resole, reject) => {
        try {
            let result: any = await RequestUtil.get<any>(`/tower-science/loftingUserWork/getLoftingUserWork`, {
                loftingUser: id,
                timeEnd: time ? time.split(',')[1] : halfYear.split(',')[1],
                timeStart: time ? time.split(',')[0] : halfYear.split(',')[0]
            });
            const data: any[] = [];
            result?.loftingUserWorkVOList?.forEach((element: any) => {
                data.push(
                    {
                        years: element.years?.split('-')[1],
                        type: '放样数',
                        angleSteelTower: element.angleSteelTowerLoftingNum,
                        steelPipePole: element.steelPipePoleLoftingNum,
                        pipeTower: element.pipeTowerLoftingNum,
                        framework: element.frameworkLoftingNum,
                        steelStructure: element.steelStructureLoftingNum,
                        basics: element.basicsLoftingNum,
                        subtotal: element.subtotalLoftingNum,
                        redColumn: element.redColumn.map((res: string) => {
                            if (res === 'angleSteelTowerLoftingNum') {
                                return 'angleSteelTower'
                            } else if (res === 'steelPipePoleLoftingNum') {
                                return 'steelPipePole'
                            } else if (res === 'pipeTowerLoftingNum') {
                                return 'pipeTower'
                            } else if (res === 'frameworkLoftingNum') {
                                return 'framework'
                            } else if (res === 'steelStructureLoftingNum') {
                                return 'steelStructure'
                            } else if (res === 'basicsLoftingNum') {
                                return 'basics'
                            } else if (res === 'subtotalLoftingNum') {
                                return 'subtotal'
                            } else {
                                return null
                            }
                        })
                    },
                    {
                        years: element.years?.split('-')[1],
                        type: '错误数',
                        angleSteelTower: element.angleSteelTowerLoftingErrorNum,
                        steelPipePole: element.steelPipePoleLoftingErrorNum,
                        pipeTower: element.pipeTowerLoftingErrorNum,
                        framework: element.frameworkLoftingErrorNum,
                        steelStructure: element.steelStructureLoftingErrorNum,
                        basics: element.basicsLoftingErrorNum,
                        subtotal: element.subtotalLoftingErrorNum,
                        redColumn: element.redColumn.map((res: string) => {
                            if (res === 'angleSteelTowerLoftingErrorNum') {
                                return 'angleSteelTower'
                            } else if (res === 'steelPipePoleLoftingErrorNum') {
                                return 'steelPipePole'
                            } else if (res === 'pipeTowerLoftingErrorNum') {
                                return 'pipeTower'
                            } else if (res === 'frameworkLoftingErrorNum') {
                                return 'framework'
                            } else if (res === 'steelStructureLoftingErrorNum') {
                                return 'steelStructure'
                            } else if (res === 'basicsLoftingErrorNum') {
                                return 'basics'
                            } else if (res === 'subtotalLoftingErrorNum') {
                                return 'subtotal'
                            } else {
                                return null
                            }
                        })
                    },
                    {
                        years: element.years?.split('-')[1],
                        type: '正确率',
                        angleSteelTower: element.angleSteelTowerRate,
                        steelPipePole: element.steelPipePoleRate,
                        pipeTower: element.pipeTowerRate,
                        framework: element.frameworkRate,
                        steelStructure: element.steelStructureRate,
                        basics: element.basicsRate,
                        subtotal: element.subtotalRate,
                        redColumn: element.redColumn.map((res: string) => {
                            if (res === 'angleSteelTowerRate') {
                                return 'angleSteelTower'
                            } else if (res === 'steelPipePoleRate') {
                                return 'steelPipePole'
                            } else if (res === 'pipeTowerRate') {
                                return 'pipeTower'
                            } else if (res === 'frameworkRate') {
                                return 'framework'
                            } else if (res === 'steelStructureRate') {
                                return 'steelStructure'
                            } else if (res === 'basicsRate') {
                                return 'basics'
                            } else if (res === 'subtotalRate') {
                                return 'subtotal'
                            } else {
                                return null
                            }
                        })
                    }
                )
            });
            setDetailData(data)
            resole(result?.loftingUserWorkVOList)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })


    const checkColor = (record: Record<string, any>, dataIndex: string) => {
        const brown: number = record.redColumn?.indexOf(dataIndex);
        if (brown !== -1) {
            return 'brown';
        } else {
            return 'normal'
        }
    }

    const { data: yearLists } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const now = new Date().getFullYear();
            var startYear = now - 3;//起始年份
            var arr = new Array();
            for (var i = startYear; i <= now; i++) {
                var obj = [
                    { "id": i + '-01,' + i + '-06', "label": i + "上半年" },
                    { "id": i + '-07,' + i + '-12', "label": i + "下半年" }
                ];
                arr.push(...obj);
            }
            resole(arr)
        } catch (error) {
            reject(error)
        }
    }), {})

    const onSearch = (values: Record<string, any>) => {
        run({ ...values });
    }

    const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.loftingUser, date)
        setRowId(record?.loftingUser)
    }

    return <Spin spinning={loading}>
        <Modal
            destroyOnClose
            key='CorrectSetting'
            visible={visible}
            title={'正确率设置'}
            footer={
                <Button type='primary' onClick={() => setVisible(false)} ghost>关闭</Button>
            }
            onCancel={() => setVisible(false)}>
            <CorrectSetting />
        </Modal>
        <Form form={form} layout="inline" className={styles.search} onFinish={onSearch}>
            <Form.Item name="fuzzyMsg">
                <Input style={{ width: '200px' }} placeholder="姓名" />
            </Form.Item>
            <Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button htmlType="reset">重置</Button>
                </Space>
            </Form.Item>
        </Form>
        <Button type='primary' className={styles.btnTop} onClick={() => setVisible(true)} ghost>正确率设置</Button>
        <div className={styles.left}>
            <CommonTable
                haveIndex
                columns={columns}
                dataSource={data}
                pagination={false}
                onRow={(record: Record<string, any>) => ({
                    onClick: () => onRowChange(record),
                    className: styles.tableRow
                })}
            />
        </div>
        <div className={styles.right}>
            <CommonTable
                columns={[
                    ...tableColumns.map((item: any) => {
                        if (item.dataIndex === 'years') {
                            return ({
                                ...item,
                                title: () => {
                                    return <>
                                        <Row>年份选择</Row>
                                        <Row>
                                            <Select size="small" placeholder="请选择" style={{ width: "150px" }} defaultValue={halfYear} onChange={(e) => {
                                                setDate(e)
                                                detailRun(rowId, e)
                                            }}>
                                                {
                                                    yearLists && yearLists.map((res: any, index: number) => (
                                                        <Select.Option key={index} value={res.id}>{res.label}</Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        </Row>
                                    </>
                                }
                            })
                        }
                        return {
                            ...item,
                            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                <p className={checkColor(record, item.dataIndex) === 'brown' ? styles.brown : styles.normal}>{_ || '-'}</p>
                            )
                        }
                    })
                ]}
                dataSource={[...detailData || []]}
                pagination={false}
            />
        </div>
    </Spin>
}