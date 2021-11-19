/**
 * @author zyc
 * @copyright © 2021 
 * @description 选择用户穿梭框
*/
import React from 'react';
import { Button, Space, Modal, Form, Input, FormInstance, Descriptions, message, Transfer, Tree, Table, Col, Row } from 'antd';
import RequestUtil from '../../utils/RequestUtil';
import styles from './AnnouncementMngt.module.less';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { IDept } from '../dept/dept/DepartmentMngt';
import { DataNode } from 'antd/lib/tree';
import { IStaff } from '../dept/staff/StaffMngt';
import { TablePaginationConfig } from 'antd/lib/table';

interface IResponseData {
    readonly records?: IStaff[];
    readonly total: number | undefined;
    readonly size: number | undefined;
    readonly current: number | undefined;
    readonly parentCode: string;
}

export interface SelectUserTransferProps {}
export interface ISelectUserTransferRouteProps extends RouteComponentProps<SelectUserTransferProps>, WithTranslation {
    readonly save: (selectRows: IStaff[]) => void;
}

export interface SelectUserTransferState {
    readonly visible: boolean;
    readonly targetKeys?: string[];
    readonly deptData?: IDept[];
    readonly treeData?: IStaff[];
    readonly selectedRows?: IStaff[];
    readonly selectedRowKeys?: React.Key[];
    readonly rightData?: IStaff[];
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
        const data: IDept[] = await RequestUtil.get(`/tower-system/department`);
        this.setState({
            visible: true,
            deptData: data
        })
    }

    protected wrapRole2DataNode (roles: (any & DataNode)[] = []): DataNode[] {
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
        const data: IResponseData = await RequestUtil.get<IResponseData>(`/tower-system/employee`, { dept: selectedKeys[0], ...pagination })
        this.setState({
            treeData: data.records,
            detailData: data
        })
    }


     /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <>
            <Button type="link" onClick={ () => this.modalShow() }>选择员工</Button>
            <Modal
                visible={ this.state.visible } 
                width="40%" 
                title="选择员工"
                footer={ <Space>
                    <Button type="link" onClick={() => this.modalCancel() }>取消</Button>
                    <Button type="primary" onClick={() => { this.setState({ visible: false }); this.props.save(this.state.rightData || [])}} ghost>确定</Button>
                </Space> } 
                onCancel={ () => this.modalCancel() }
                className={styles.modalcontent}
            >
                <Row>
                    <Col span={11}>
                        <Tree
                            defaultExpandAll
                            treeData={ this.wrapRole2DataNode(this.state.deptData) }
                            onSelect={ (selectedKeys) => {
                                this.getStaffList(selectedKeys)
                                this.setState({
                                    treeSelectKeys: selectedKeys
                                })
                            } }
                        />
                        <Button onClick={ () => {
                            const rows = [ ...(this.state.rightData || []), ...(this.state.selectedRows || [])];
                            const res = new Map();
                            let newRows = rows.filter((item: IStaff) => !res.has(item.id) && res.set(item.id, 1));
                            this.setState({
                                rightData: newRows
                            })
                        } }>确定</Button>
                        <Table 
                            rowKey='id'
                            dataSource={[...this.state.treeData || []]} 
                            showHeader={ false } 
                            columns={ [
                                {
                                    key: 'name',
                                    title: '姓名',
                                    dataIndex: 'name',
                                    width: 150
                                }
                            ]} 
                            onChange={ (pagination: TablePaginationConfig) => { 
                                this.getStaffList(this.state.treeSelectKeys || [],pagination);
                            } }
                            pagination={{
                                current: this.state.detailData?.current || 0,
                                pageSize: this.state.detailData?.size || 0,
                                total: this.state.detailData?.total || 0,
                                showSizeChanger: false
                            }}
                            rowSelection={{
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
                        <Table rowKey='id' dataSource={[...(this.state.rightData || [])]} pagination={false} showHeader={ false } columns={ [
                            {
                                key: 'name',
                                title: '姓名',
                                dataIndex: 'name',
                                width: 150
                            },
                            {
                                key: 'operation',
                                title: '操作',
                                dataIndex: 'operation',
                                width: 150,
                                render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                    <Button type="link" onClick={ () => {
                                        const rightData: IStaff[] = this.state.rightData || [];
                                        rightData.splice(index, 1);
                                        console.log(rightData)
                                        this.setState({
                                            rightData: rightData
                                        })
                                    } } danger>删除</Button>
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
