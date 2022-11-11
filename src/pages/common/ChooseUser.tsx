import React, { FC, RefObject, useEffect, useRef, useState, useImperativeHandle } from "react"
import {
    Col,
    Input,
    Modal,
    Row,
    Select,
    Spin,
    Tree,
    Transfer,
    Table,
    Space,
    // Button
} from "antd"
import { PlusOutlined, ApartmentOutlined } from "@ant-design/icons"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { difference } from "@antv/util"
const userColumns: any[] = [
    {
        "title": "部门",
        "dataIndex": "deptName"
    },
    {
        "title": "姓名",
        "dataIndex": "name"
    }
]

const formatTreeData: ((treeData: any[], type?: "group") => any[]) = (treeData = [], type) => {
    return treeData?.map((item: any) => {
        if (item.children) {
            return ({
                ...item,
                title: type === "group" ? `${item.name}-${item.type}` : item.name,
                key: type === "group" ? item.employeeId : item.id,
                icon: <ApartmentOutlined />,
                children: formatTreeData(item.children)
            })
        }
        return ({
            ...item,
            title: type === "group" ? `${item.name}-${item.type}` : item.name,
            key: type === "group" ? item.employeeId : item.id,
            icon: <ApartmentOutlined />,
        })
    })
}

export interface ChooseUserData {
    [key: string]: any
}

interface PagenationProps {
    current: number
    size: number
}

interface TableTransferProps {
    [key: string]: any
}

const TableTransfer = ({ targetKeys, ...restProps }: TableTransferProps) => {
    const [chooseType, setChooseType] = useState<"dept" | "group">("dept")
    const [filterId, setFilterId] = useState<string>("")
    const [tableDataSource, setTableDataSource] = useState<any[]>([])
    const [pagination, setPagination] = useState<PagenationProps>({
        current: 1,
        size: 10
    })

    const [groupPagenation, setGroupPagenation] = useState<PagenationProps>({
        current: 1,
        size: 10
    })

    const { loading: deptLoading, data: deptData } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        try {
            const deptTree: any = await RequestUtil.get<{ data: any }>("/tower-system/department")
            resolve(deptTree)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: groupLoading, data: groupData } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        try {
            const deptTree: any = await RequestUtil.get<{ data: any }>("/tower-system/noticeGroup", {
                ...groupPagenation
            })
            resolve(deptTree)
        } catch (error) {
            reject(error)
        }
    }), {
        ready: chooseType === "group",
        refreshDeps: [JSON.stringify(groupPagenation)]
    })

    const { loading, data: userData } = useRequest<any>(() => new Promise(async (resolve, reject) => {
        try {
            const result: any = await RequestUtil.get<{ data: any }>("/tower-system/employee", {
                ...pagination,
                dept: filterId
            })
            resolve({
                ...result,
                records: result?.records?.map((item: any) => ({
                    ...item,
                    key: item.id
                }))
            })
        } catch (error) {
            reject(error)
        }
    }), {
        ready: chooseType === "dept",
        refreshDeps: [JSON.stringify(pagination), filterId],
        onSuccess: (data: any) => setTableDataSource(data.records || [])
    })

    const handleSelect = (event: any) => setFilterId(event)

    const handleGroupSelect = (_: any, node: any) => setTableDataSource(node?.node?.noticeGroupEmployeeVOList?.map((item: any) => ({
        ...item,
        id: item.employeeId,
        name: item.employeeName,
        deptName: item.deptName
    })))

    const paginationChange = (page: number, pageSize: any) => setPagination({
        ...pagination,
        current: page,
        size: pageSize || pagination.size
    })

    return (
        <Transfer
            {...restProps}
            rowKey={(record: any) => record.id}
            titles={[
                "待选区",
                <Space key="choosed">
                    {/* <Button type="link">创建新分组</Button> */}
                    <div>选中区</div>
                </Space>
            ]}
        >
            {({
                direction,
                onItemSelectAll,
                onItemSelect,
                selectedKeys: listSelectedRows,
                disabled: listDisabled
            }) => {
                const leftDataSource = tableDataSource?.map((item: any) => ({
                    ...item,
                    disabled: targetKeys.map((item: any) => item.id).includes(item.id)
                }))
                return <>
                    {direction === "left" && <Row>
                        <Col span={9} style={{ maxHeight: 600, overflowY: "auto" }}>
                            <div>
                                <span>选择方式：</span>
                                <Select
                                    value={chooseType}
                                    style={{ width: 160, height: 32 }}
                                    onChange={(value: "dept" | "group") => setChooseType(value)}
                                >
                                    <Select.Option key="dept" value="dept">按部门</Select.Option>
                                    <Select.Option key="group" value="group">按分组</Select.Option>
                                </Select>
                            </div>
                            <Spin spinning={deptLoading || groupLoading}>
                                {chooseType === "dept" && <Tree.DirectoryTree
                                    showIcon
                                    defaultExpandAll
                                    onSelect={handleSelect}
                                    treeData={formatTreeData(deptData)}
                                />}
                                {chooseType === "group" && <Tree.DirectoryTree
                                    showIcon
                                    defaultExpandAll
                                    onSelect={handleGroupSelect}
                                    treeData={formatTreeData(groupData?.records || [], "group")}
                                />}
                            </Spin>
                        </Col>
                        <Col span={15}>
                            <Table
                                bordered={false}
                                rowKey="id"
                                loading={loading || groupLoading}
                                rowSelection={{
                                    getCheckboxProps: (item) => ({
                                        disabled: listDisabled || item.disabled
                                    }),
                                    onSelectAll(selected, selectedRows) {
                                        const listSelectedKeys = listSelectedRows.map((item: any) => item.id)
                                        const treeSelectedKeys = selectedRows
                                            .filter((item) => !item.disabled)
                                            .map(({ id }) => id)
                                        const diffKeys = selected
                                            ? difference(treeSelectedKeys, listSelectedKeys)
                                            : difference(listSelectedKeys, treeSelectedKeys);
                                        onItemSelectAll((selected ? selectedRows : listSelectedRows).filter((item: any) => diffKeys.includes(item.id)), selected);
                                    },
                                    onSelect(selectRows: any, selected) {
                                        onItemSelect(selectRows, selected);
                                    },
                                    selectedRowKeys: listSelectedRows.map((item: any) => item.id)
                                }}
                                size="small"
                                columns={userColumns}
                                pagination={{
                                    total: userData?.total,
                                    current: pagination.current,
                                    onChange: paginationChange,
                                    pageSize: pagination.size
                                }}
                                dataSource={leftDataSource}
                            />
                        </Col>
                    </Row>}
                    {
                        direction === "right" && <Table
                            bordered={false}
                            rowKey="id"
                            rowSelection={{
                                getCheckboxProps: (item) => ({
                                    disabled: listDisabled || item.disabled
                                }),
                                onSelectAll(selected, selectedRows) {
                                    const listSelectedKeys = listSelectedRows.map((item: any) => item.id)
                                    const treeSelectedKeys = selectedRows
                                        .filter((item) => !item.disabled)
                                        .map(({ id }) => id)
                                    const diffKeys = selected
                                        ? difference(treeSelectedKeys, listSelectedKeys)
                                        : difference(listSelectedKeys, treeSelectedKeys);
                                    onItemSelectAll((selected ? selectedRows : listSelectedRows).filter((item: any) => diffKeys.includes(item.id)), selected);
                                },
                                onSelect(selectRows: any, selected) {
                                    onItemSelect(selectRows, selected);
                                },
                                selectedRowKeys: listSelectedRows.map((item: any) => item.id)
                            }}
                            size="small"
                            columns={[userColumns[1]]}
                            dataSource={targetKeys}
                        />
                    }
                </>
            }}
        </Transfer>
    )
}
interface ChooseUserContentProps {
    actionRef: RefObject<any>
    values: any[]
}

const ChooseUserContent: FC<ChooseUserContentProps> = ({ actionRef, values = [] }) => {
    const [targetRows, setTargetRows] = useState<any[]>(values);
    const handleTransferChange = (targetKeys: any[], direction: "left" | "right", moveKeys: any[]) => {
        if (direction === "left") {
            setTargetRows(targetRows.filter((item: any) => !moveKeys.some((sItem: any) => sItem.id === item.id)))
            return
        }
        if (direction === "right") {
            setTargetRows([...targetRows, ...targetKeys])
        }
    }

    useImperativeHandle(actionRef, () => ({
        dataSource: targetRows
    }), [JSON.stringify(targetRows)])

    return (<TableTransfer
        targetKeys={targetRows}
        showSelectAll={false}
        listStyle={({ direction }: any) => ({
            flex: direction === "left" ? "1 1 65%" : "1 1 35%",
        })}
        onChange={handleTransferChange} />)
}

const ChooseUser: FC<ChooseUserData> = ({ data, ...props }) => {
    const actionRef = useRef<any>()
    const [visible, setVisible] = useState<boolean>(false)
    const [value, setValue] = useState<{
        id: string,
        value: string,
        records: any
    }>({ value: (props as any).value, id: "", records: [] })

    useEffect(() => {
        setValue(props.value || ({ value: (props as any).value, id: "", records: [] }))
    }, [JSON.stringify(props.value || "")])

    const handleOk = () => {
        const dataSource = actionRef.current?.dataSource
        const newValue = {
            id: dataSource?.map((item: any) => item.id).join(","),
            value: dataSource?.map((item: any) => item.name).join(","),
            records: dataSource || []
        }
        setValue(newValue)
        props.onChange && props.onChange(newValue)
        setVisible(false)
    }

    const formatValue = () => typeof props.value === "string" ? props.value : value?.value

    return <>
        <Modal
            width={1101}
            title={`选择${data.title}`}
            destroyOnClose
            visible={visible}
            onOk={handleOk}
            onCancel={() => setVisible(false)}>
            <ChooseUserContent actionRef={actionRef} values={value?.records} />
        </Modal>
        <Input
            {...props}
            disabled={data.disabled}
            style={{ width: "100%", height: "100%", ...props.style }}
            onClick={(data.readOnly === undefined || data.readOnly) ? (() => !data.disabled && setVisible(true)) : (() => { })}
            readOnly={data.readOnly === undefined ? true : data.readOnly}
            value={formatValue()}
            suffix={<PlusOutlined onClick={() => !data.disabled && setVisible(true)} />} />
    </>
}

export default ChooseUser