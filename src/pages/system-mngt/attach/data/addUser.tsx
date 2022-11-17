
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Input, Modal, Spin, Table } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { userSetting } from "./data.json"
import { BaseInfo } from "../../../common"

const DEPARTMENT = {
    /** 获取公司部门 */
    INDEX: `/tower-system/department`,
    /** 获取角色 */
    ROLE: `/sinzetech-system/role`,
    /** 获取岗位 */
    STATION: `/tower-system/station`,
    /** 获取人员 */
    EMPLOYEE: `/tower-system/employee`
}

interface AddUserProps {
    dataSource: any[]
    pushType: 1 | 2 | 3
}

const AddUserContent = forwardRef(function AddUser({ dataSource = [], pushType = 1 }: AddUserProps, ref) {
    const [IPushType, setIPushType] = useState<1 | 2 | 3>(pushType)
    const [columns, setColumns] = useState<any[]>(userSetting.roles)
    const [FETCH_URI, setFETCH_URI] = useState<string>(DEPARTMENT.ROLE)
    const [tableData, setTableData] = useState<any[]>(dataSource)
    useEffect(() => {
        setTableData(dataSource)
        setIPushType(pushType)
        switch (pushType) {
            case 1:
                setColumns(userSetting.roles)
                setFETCH_URI(DEPARTMENT.ROLE)
                break
            case 2:
                setColumns(userSetting.jobsMngt)
                setFETCH_URI(DEPARTMENT.STATION)
                break
            case 3:
                setColumns(userSetting.staffMngt)
                setFETCH_URI(DEPARTMENT.EMPLOYEE)
                break
            default:
                setColumns(userSetting.roles)
                setFETCH_URI(DEPARTMENT.ROLE)
                break
        }
    }, [pushType, dataSource])

    const { loading, data, run } = useRequest<{ [key: string]: any }>((params: any) => new Promise(async (resolve, reject) => {
        try {
            const data: { [key: string]: any } = await RequestUtil.get(FETCH_URI, {
                current: 1,
                size: 10000,
                ...params
            })
            resolve(data)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), {
        refreshDeps: [FETCH_URI]
    })

    const handleChange = (fields: any) => {
        setIPushType(fields.pushType)
        switch (fields.pushType) {
            case 1:
                setColumns(userSetting.roles)
                setFETCH_URI(DEPARTMENT.ROLE)
                break
            case 2:
                setColumns(userSetting.jobsMngt)
                setFETCH_URI(DEPARTMENT.STATION)
                break
            case 3:
                setColumns(userSetting.staffMngt)
                setFETCH_URI(DEPARTMENT.EMPLOYEE)
                break
            default:
                setColumns(userSetting.roles)
                setFETCH_URI(DEPARTMENT.ROLE)
                break
        }
        setTableData([])
    }

    useEffect(() => setTableData(dataSource), [dataSource])

    useImperativeHandle(ref, () => ({
        dataSource: tableData,
        pushType: IPushType
    }), [tableData, IPushType])

    const onSelectChange = (_: any, selectedRows: any[]) => {
        setTableData(selectedRows)
    }

    return <Spin spinning={loading}>
        <BaseInfo
            classStyle="addUser"
            col={1}
            edit
            onChange={handleChange}
            columns={[
                {
                    title: "任务推送类型",
                    dataIndex: "pushType",
                    type: "select",
                    enum: [
                        { label: "角色", value: 1 },
                        { label: "岗位", value: 2 },
                        { label: "人员", value: 3 },
                    ]
                }
            ]}
            dataSource={{ pushType: IPushType }}
        />
        {IPushType === 3 && <Input.Search onSearch={(value: any) => run({
            current: 1,
            size: 10000,
            fuzzyQuery: value
        })} allowClear style={{ width: "20%" }} />}
        <Table
            size="small"
            rowKey="pushId"
            columns={columns}
            dataSource={data?.records.map((item: any) => ({
                ...item,
                pushId: item[IPushType === 3 ? "userId" : "id"],
                pushName: item[IPushType === 2 ? "stationName" : "name"]
            }))}
            rowSelection={{
                selectedRowKeys: tableData.map((item: any) => item.pushId),
                type: "checkbox",
                onChange: onSelectChange,
            }}
        />
    </Spin>
})

export default function AddUser({ data, ...props }: any) {
    const addUserRef = useRef<any>()
    const [visible, setVisible] = useState<boolean>(false)
    const [value, setValue] = useState<{
        id: string,
        value: string,
        pushType: 1 | 2,
        records: any
    }>({
        value: (props as any).value,
        id: "",
        pushType: 1, records: []
    })

    useEffect(() => {
        setValue(props.value || ({ value: (props as any).value, id: "", records: [] }))
    }, [JSON.stringify(props.value || "")])


    const handleOk = () => {
        // const depFalseValue = popContent.id || popContent.value
        // const changeValue = data.dependencies ? popContent : depFalseValue;
        // depFalseValue && (props as any).onChange(changeValue)
        // setValue(popContent)
        setVisible(false)
    }

    const handleCancel = () => setVisible(false)


    const formatValue = () => typeof props.value === "string" ? props.value : value?.value

    return <>
        <Modal width={data.width || 520} title={`选择${data.title}`} destroyOnClose visible={visible} onOk={handleOk} onCancel={handleCancel}>
            <AddUserContent pushType={value.pushType} dataSource={value.records} ref={addUserRef} />
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