import  React from "react";
import { Space, Button, Popconfirm } from "antd";
import ContractAttachment from "../../prom/contract/ContractAttachment";
class ManagementContractAttachment extends ContractAttachment {
  getColumns() {
    return [
      ...super.getColumns(),
      {
        title: "操作",
        dataIndex: "operation",
        width: 200,
        fixed: "right" as any,
        render: (
          oper: undefined,
          record: Record<string, any>,
          index: number
        ) => {
          return (
            <Space direction="horizontal" size="small">
              <Button type="link" htmlType="button">
                预览
              </Button>
              <Button type="link" htmlType="button">
                下载
              </Button>
              <Popconfirm
                title="要删除该附件吗？"
                placement="topRight"
                okText="确认"
                cancelText="取消"
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];
  }
}

export default ManagementContractAttachment;
