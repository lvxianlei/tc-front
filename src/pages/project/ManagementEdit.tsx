import React from "react";
import { Row, Button, TableColumnProps, Form, Upload } from "antd";
import { EditTable, DetailContent, BaseInfo, DetailTitle } from "../common";
import { useHistory, useParams } from "react-router-dom";
import { baseInfoData } from "./managementDetailData.json";
import AuthUtil from "../../utils/AuthUtil";
const tableColumns: TableColumnProps<Object>[] = [
  { title: "分标编号", dataIndex: "partBidNumber", key: "partBidNumber" },
  { title: "货物类别", dataIndex: "goodsType", key: "goodsType" },
  { title: "包号", dataIndex: "packageNumber", key: "packgeNumber" },
  { title: "数量", dataIndex: "amount", key: "amount" },
  { title: "单位", dataIndex: "unit", key: "unit" },
  { title: "交货日期", dataIndex: "deliveryDate", key: "deliveryDate" },
  { title: "交货地点", dataIndex: "deliveryPlace", key: "deliveryPlace" },
];

interface RouterParams {
  id: string | "new";
}

export default function ManagementEdit(): JSX.Element {
  const history = useHistory();
  const params = useParams<RouterParams>();
  const [baseInfoForm] = Form.useForm();
  return (
    <DetailContent
      operation={[
        <Button key="save" type="primary" style={{ marginRight: "10px" }}>保存</Button>,
        <Button key="saveOrSubmit" type="primary" style={{ marginRight: "10px" }}>保存并提交审核</Button>,
        <Button key="goback" onClick={() => history.goBack()}>取消</Button>,
      ]}
    >
      <Row>基本信息</Row>
      <BaseInfo form={baseInfoForm} columns={baseInfoData} dataSource={{}} edit />
      <Row style={{ height: "50px", paddingLeft: "10px", lineHeight: "50px" }}>货物清单</Row>
      <EditTable columns={tableColumns} dataSource={[]} />
      <DetailTitle title="附件信息" operation={[
        <Upload
          key="sub"
          name="file"
          multiple={true}
          action={`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-resource/oss/put-file`}
          headers={{
            'Content-Type': 'application/json',
            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
            'Tenant-Id': AuthUtil.getTenantId(),
            'Sinzetech-Auth': AuthUtil.getSinzetechAuth()
          }}
          showUploadList={false}
        ><Button type="default">上传附件</Button></Upload>
      ]} />
      <EditTable
        columns={[
          {
            title: "文件名",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "大小",
            dataIndex: "fileSize",
            key: "fileSize",
          },
          {
            title: "上传人",
            dataIndex: "userName",
            key: "userName",
          },
          {
            title: "上传时间",
            dataIndex: "fileUploadTime",
            key: "fileUploadTime",
          },
        ]}
        dataSource={[]}
      />
    </DetailContent>
  )
}
