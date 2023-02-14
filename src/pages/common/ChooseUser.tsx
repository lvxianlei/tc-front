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
                key: type === "group" ? item.employeeId || item.id : item.id,
                icon: <ApartmentOutlined />,
                children: formatTreeData(item.children)
            })
        }
        return ({
            ...item,
            title: type === "group" ? `${item.name}-${item.type}` : item.name,
            key: type === "group" ? item.employeeId || item.id : item.id,
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
    initRightData: any[]
    transferRef: RefObject<any>
    [key: string]: any
}

const TableTransfer = ({
    targetKeys,
    initRightData,
    transferRef,
    ...restProps }: TableTransferProps) => {
    const [chooseType, setChooseType] = useState<"dept" | "group">("dept")
    const [filterId, setFilterId] = useState<string>("")
    const [leftData, setLeftData] = useState<any[]>([])
    const [rightData, setRightData] = useState<any[]>(initRightData)

    const [pagination, setPagination] = useState<PagenationProps>({
        current: 1,
        size: 10
    })

    const [groupPagenation, setGroupPagenation] = useState<PagenationProps>({
        current: 1,
        size: 10
    })

    useEffect(() => setRightData([
        ...rightData,
        initRightData.filter((item: any) => !rightData.map((rItem: any) => rItem.id).includes(item.id))]),
        [JSON.stringify(initRightData)])

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
            resolve(result)
        } catch (error) {
            reject(error)
        }
    }), {
        ready: chooseType === "dept",
        refreshDeps: [JSON.stringify(pagination), filterId],
        onSuccess: (data: any) => {
            const currentData = data.records?.map((item: any) => ({ ...item, key: item.id })) || []
            setLeftData(currentData)
            setRightData([...rightData, ...currentData.filter((item: any) => !rightData.map((rItem: any) => rItem.id).includes(item.id))])
        }
    })

    const handleSelect = (event: any) => setFilterId(event)

    const handleGroupSelect = (_: any, node: any) => {
        setLeftData(node?.node?.noticeGroupEmployeeVOList?.map((item: any) => ({
            ...item,
            id: item.employeeId,
            key: item.employeeId,
            name: item.employeeName,
            deptName: item.deptName
        })))
        setRightData([...rightData, ...node?.node?.noticeGroupEmployeeVOList?.map((item: any) => ({
            ...item,
            id: item.employeeId,
            key: item.employeeId,
            name: item.employeeName,
            deptName: item.deptName
        })).filter((item: any) => !rightData.map((rItem: any) => rItem.id).includes(item.id))])
    }

    const paginationChange = (page: number, pageSize: any) => setPagination({
        ...pagination,
        current: page,
        size: pageSize || pagination.size
    })
    useImperativeHandle(transferRef, () => ({ rightData }), [rightData])
    return (
        <Transfer
            {...restProps}
            rowKey={(record) => record.id}
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
                selectedKeys: listSelectedKeys,
                disabled: listDisabled
            }) => {
                const leftDataSource = leftData?.map((item: any) => ({
                    ...item,
                    disabled: targetKeys.includes(item.id)
                }))

                const rightDataSource = rightData.filter((item: any) =>
                    targetKeys.includes(item.id)
                )

                const rowSelection = {
                    getCheckboxProps: (item: any) => ({
                        disabled: listDisabled || item.disabled
                    }),
                    onSelectAll(selected: boolean, selectedRows: any[]) {
                        const treeSelectedKeys = selectedRows
                            .filter((item) => !item.disabled)
                            .map(({ id }) => id)
                        const diffKeys = selected
                            ? difference(treeSelectedKeys, listSelectedKeys)
                            : difference(listSelectedKeys, treeSelectedKeys)
                        onItemSelectAll(diffKeys, selected)
                    },
                    onSelect({ id }: any, selected: boolean) {
                        onItemSelect(id, selected)
                    },
                    selectedRowKeys: listSelectedKeys
                }

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
                                loading={loading || groupLoading}
                                rowSelection={rowSelection}
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
                            rowSelection={rowSelection}
                            size="small"
                            columns={[userColumns[1]]}
                            dataSource={rightDataSource}
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
    const transferRef = useRef<any>()
    const [targetKeys, setTargetKeys] = useState<any[]>(values.map((item: any) => item.id));
    const handleTransferChange = (targeted: any[], direction: "left" | "right", moveKeys: any[]) => {
        if (direction === "left") {
            setTargetKeys(targetKeys.filter((item: any) => !moveKeys.includes(item)))
            return
        }
        if (direction === "right") {
            setTargetKeys([...targetKeys, ...targeted])
        }
    }

    useImperativeHandle(actionRef, () => ({
        dataSource: transferRef.current?.rightData.filter((item: any) => targetKeys.includes(item.id))
    }), [targetKeys, transferRef])

    return (<TableTransfer
        targetKeys={targetKeys}
        transferRef={transferRef}
        initRightData={values}
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