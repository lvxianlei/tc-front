import React from "react";
import { Button, Row, Col, Tabs, Upload } from "antd";
import { useHistory, useParams } from "react-router";
import { DetailContent, BaseInfo, CommonTable } from "../../common";
import { TabTypes } from "../ManagementDetail";
import { bidInfoColumns } from "../managementDetailData.json";
import * as XLSX from "xlsx";

export function readWorkbookFromLocalFile(
  file: Blob,
  callback?: (workbook: XLSX.WorkBook) => any
) {
  var reader = new FileReader();
  reader.onload = function (e) {
    const data = e.target?.result;
    const workbook = XLSX.read(data, { type: "binary" });
    if (callback) callback(workbook);
  };
  reader.readAsBinaryString(file);
}

function outputWorkbook(workbook: XLSX.WorkBook, onlyone = true) {
  let data = [] as any[];
  for (const sheet in workbook.Sheets) {
    if (workbook.Sheets.hasOwnProperty(sheet)) {
      data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
      if (onlyone) {
        break;
      }
    }
  }
  return data;
}

const mustKeys = [
  "投标人名称",
  "分标编号",
  "货物类别",
  "项目单位",
  "总价",
  "重量",
];
const UploadXLS = () => {
  return (
    <Upload
      accept=".xls,.xlsx"
      beforeUpload={(file) => {
        readWorkbookFromLocalFile(file, (workbook) => {
          const data = outputWorkbook(workbook);
          console.log(data);
        });
      }}
      showUploadList={false}
      onChange={() => false}
    >
      <Button type="primary">导入文件</Button>
    </Upload>
  );
};

const BidResult = () => {
  const history = useHistory();
  const params = useParams<{ id: string; tab?: TabTypes }>();

  return (
    <DetailContent
      operation={[
        <Button
          key="edit"
          style={{ marginRight: "10px" }}
          type="primary"
          onClick={() =>
            history.push(
              `/project/management/detail/edit/bidResult/${params.id}`
            )
          }
        >
          编辑
        </Button>,
        <Button key="goback">返回</Button>,
      ]}
    >
      <Row>基础信息</Row>
      <BaseInfo
        columns={[
          {
            title: "年份",
            dataIndex: "baseInfo?.contractNumber",
          },
          {
            title: "批次",
            dataIndex: "baseInfo?.internalNumber",
          },
          {
            title: "备注",
            dataIndex: "baseInfo?.projectName",
          },
          {
            title: "是否中标",
            dataIndex: "baseInfo?.simpleProjectName",
          },
        ]}
        dataSource={{}}
      />
      <Row>开标信息</Row>
      <Row gutter={[10, 0]}>
        <Col>
          <Button>新增一轮报价</Button>
        </Col>
      </Row>
      <Tabs type="editable-card" style={{ marginTop: "10px" }}>
        <Tabs.TabPane tab="第二轮" key="b">
          <Row>
            <Button>新增一行</Button>
            <UploadXLS />
          </Row>
          <CommonTable columns={bidInfoColumns} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="第一轮" key="a">
          <Row>
            <Button>新增一行</Button>
            <UploadXLS />
          </Row>
          <CommonTable columns={bidInfoColumns} />
        </Tabs.TabPane>
      </Tabs>
    </DetailContent>
  );
};

export default BidResult;
