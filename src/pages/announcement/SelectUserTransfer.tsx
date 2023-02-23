/**
 * @author zyc
 * @copyright © 2021 
 * @description 选择用户穿梭框
*/
import React from 'react';
import { Button, Space, Modal, Tree, Table, Col, Row, Switch, Input, Form } from 'antd';
import RequestUtil from '../../utils/RequestUtil';
import styles from './AnnouncementMngt.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { DataNode } from 'antd/lib/tree';
import { IStaff } from '../dept/staff/StaffMngt';
import { TablePaginationConfig } from 'antd/lib/table';
import { RowSelectionType } from 'antd/lib/table/interface';
import { IStaffList } from './AnnouncementMngt';

interface IResponseData {
    readonly records?: IStaff[];
    readonly total?: number;
    readonly size?: number;
    readonly current?: number;
    readonly parentCode?: string;
}

export interface SelectUserTransferProps { }
export interface ISelectUserTransferRouteProps extends RouteComponentProps<SelectUserTransferProps>, WithTranslation {
    readonly save: (selectRows: IStaff[]) => void;
    readonly type?: RowSelectionType;
    readonly staffData?: IStaffList[];
}

export interface SelectUserTransferState {
    readonly visible: boolean;
    readonly targetKeys?: string[];
    readonly deptData?: any[];
    readonly treeData?: IStaff[];
    readonly selectedRows?: IStaff[];
    readonly selectedRowKeys?: React.Key[];
    readonly rightData?: any[];
    readonly detailData?: IResponseData;
    readonly treeSelectKeys?: React.Key[];
}

class SelectUserTransfer extends React.Component<ISelectUserTransferRouteProps, SelectUserTransferState> {

    public state: SelectUserTransferState = {
        visible: false,
    }

    private modalCancel(): void {
        this.setState({
            visible: false,
            targetKeys: [],
        })
    }

    private async modalShow(): Promise<void> {
        const data: any[] = await RequestUtil.get(`/tower-system/department`);
        this.setState({
            visible: true,
            deptData: data,
            rightData: this.props.staffData,
            selectedRowKeys: this.props.staffData?.map(res => { return res?.id || '' })
        })
    }

    protected wrapRole2DataNode(roles: (any & DataNode)[] = []): DataNode[] {
        roles && roles.forEach((role: any & DataNode): void => {
            role.title = role.name;
            role.key = role.id;
            if (role.children && role.children.length > 0) {
                this.wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }

    protected getStaffList = async (selectedKeys: React.Key[], pagination?: TablePaginationConfig) => {
        if (selectedKeys[0] && selectedKeys[0] !== '') {
            const data: IResponseData = await RequestUtil.get<IResponseData>(`/tower-system/employee`, { dept: selectedKeys[0], ...pagination })
            this.setState({
                treeData: data.records,
                detailData: data
            })
        } else {
            this.setState({
                treeData: [],
                detailData: {
                    current: 0,
                    size: 10,
                    total: 0
                }
            })
        }
    }
    protected getStaffUserList = async (fuzzyQuery: string, pagination?: TablePaginationConfig) => {
        if (fuzzyQuery && fuzzyQuery !== '') {
            const data: IResponseData = await RequestUtil.get<IResponseData>(`/tower-system/employee`, { fuzzyQuery, ...pagination })
            this.setState({
                treeData: data.records,
                detailData: data
            })
        } else {
            this.setState({
                treeData: [],
                detailData: {
                    current: 0,
                    size: 10,
                    total: 0
                }
            })
        }
    }

    /**
    * @description Renders AbstractDetailComponent
    * @returns render 
    */
    public render(): React.ReactNode {
        return <>
            <Button type="link" onClick={() => this.modalShow()}>选择员工</Button>
            <Modal
                visible={this.state.visible}
                width="40%"
                title="选择员工"
                footer={<Space>
                    <Button type="ghost" onClick={() => this.modalCancel()}>取消</Button>
                    <Button type="primary" onClick={() => {
                        this.setState({ visible: false });
                        this.props.save(this.state.rightData || [])
                    }} ghost>确定</Button>
                </Space>}
                onCancel={() => this.modalCancel()}
                className={styles.modalcontent}
            >
                <Row>
                    <Col span={11} className={styles.left}>
                        <Form
                            onFinish={(event: any) => this.getStaffUserList(event?.fuzzyQuery)}
                            onReset={(event: any) => this.getStaffUserList(event?.fuzzyQuery)}
                        >
                            <Row>
                                <Col span={14}>
                                    <Form.Item label="姓名" name="fuzzyQuery">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item>
                                        <Button size="small" type="primary" htmlType="submit" style={{ marginLeft: 12 }}>查询</Button>
                                        <Button size="small" type="default" htmlType="reset" style={{ marginLeft: 12 }}>重置</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        <Tree
                            treeData={this.wrapRole2DataNode(this.state.deptData)}
                            onSelect={(selectedKeys) => {
                                this.getStaffList(selectedKeys)
                                this.setState({
                                    treeSelectKeys: selectedKeys
                                })
                            }}
                        />
                        <Button className={styles.btn} onClick={() => {
                            if (this.props.type) {
                                this.setState({
                                    rightData: this.state.selectedRows
                                })
                            } else {
                                const rows = [...(this.state.rightData || []), ...(this.state.selectedRows || [])];
                                const res = new Map();
                                let newRows = rows.filter((item: IStaff) => !res.has(item.id) && res.set(item.id, 1));
                                this.setState({
                                    rightData: newRows.map((item: any) => ({ ...item, signState: item.signState || 1 }))
                                })
                            }
                        }} size="small" type="primary">确定</Button>
                        <Table
                            rowKey='id'
                            dataSource={[...this.state.treeData || []]}
                            showHeader={false}
                            columns={[
                                {
                                    key: 'name',
                                    title: '姓名',
                                    dataIndex: 'name',
                                    width: 150
                                }
                            ]}
                            onChange={(pagination: TablePaginationConfig) => {
                                this.getStaffList(this.state.treeSelectKeys || [], pagination);
                            }}
                            pagination={{
                                current: this.state.detailData?.current || 0,
                                pageSize: this.state.detailData?.size || 0,
                                total: this.state.detailData?.total || 0,
                                showSizeChanger: false
                            }}
                            rowSelection={{
                                type: this.props.type || 'checkbox',
                                selectedRowKeys: this.state.selectedRowKeys,
                                onChange: (selectedRowKeys: React.Key[], selectedRows: IStaff[]) => {
                                    this.setState({
                                        selectedRows: selectedRows,
                                        selectedRowKeys: selectedRowKeys
                                    })
                                }
                            }}
                        />
                    </Col>
                    <Col className={styles.right} span={11}>
                        <Table rowKey='id' dataSource={[...(this.state.rightData || [])]} pagination={false} columns={[
                            {
                                key: 'name',
                                title: '姓名',
                                dataIndex: 'name',
                                width: '50%'
                            },
                            {
                                key: 'signState',
                                title: '是否签收',
                                dataIndex: 'signState',
                                width: 30,
                                render: (value: 1 | 2, _record: Record<string, any>, index: number) => <Switch
                                    size="small"
                                    checked={value === 1}
                                    onChange={(checked: boolean) => {
                                        const rightData: any[] = [...this.state.rightData || []];
                                        rightData[index].signState = checked ? 1 : 2
                                        this.setState({
                                            rightData: rightData,
                                            selectedRowKeys: rightData.map(res => { return res.id || '' }),
                                            selectedRows: rightData
                                        })
                                    }} />
                            },
                            {
                                key: 'operation',
                                title: '操作',
                                dataIndex: 'operation',
                                width: 30,
                                render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                    <Button type="link" onClick={() => {
                                        const rightData: IStaff[] = this.state.rightData || [];
                                        rightData.splice(index, 1);
                                        this.setState({
                                            rightData: rightData,
                                            selectedRowKeys: rightData.map(res => { return res.id || '' }),
                                            selectedRows: rightData
                                        })
                                    }} danger>删除</Button>
                                )
                            }
                        ]} />
                    </Col>
                </Row>
            </Modal>
        </>
    }
}

export default withRouter(withTranslation('translation')(SelectUserTransfer))
