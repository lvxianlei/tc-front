import React, { useCallback, useEffect, useMemo, useState } from "react";
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

interface BidProps {
  title: string;
  content: any;
  key: string;
  closable?: boolean;
}

const BidResult = () => {
  const history = useHistory();
  const params = useParams<{ id: string; tab?: TabTypes }>();

  const [data, setdata] = useState([
    {
      title: "第一轮",
      content: "",
      key: "第一轮",
    },
    {
      title: "第二轮",
      content: "",

      key: "第二轮",
    },
  ] as undefined | BidProps[]);
  const [panes, setpanes] = useState(undefined as undefined | BidProps[]);

  useEffect(() => {
    setpanes(
      data?.map((item) => {
        return Object.assign(
          { ...item },
          {
            content: (
              <>
                <Row>
                  <Button>新增一行</Button>
                  <UploadXLS />
                </Row>
                <CommonTable columns={bidInfoColumns} />
              </>
            ),
          }
        );
      })
    );
  }, [data]);

  const [activeKey, setactiveKey] = useState(undefined as undefined | string);
  const tabChange = useCallback((activeKey: string) => {
    setactiveKey(activeKey);
  }, []);

  const paneslen = panes?.length || 0;
  const tabAdd = useCallback(() => {
    const activeKey = `第${paneslen + 1}轮`;
    const newItem: BidProps = {
      title: activeKey,
      content: (
        <>
          <Row>
            <Button>新增一行</Button>
            <UploadXLS />
          </Row>
          <CommonTable columns={bidInfoColumns} />
        </>
      ),
      key: activeKey,
      closable: true,
    };
    setpanes((pre) => {
      if (!pre) {
        return [newItem];
      }
      const cpdata = pre.slice(0);
      cpdata.unshift(newItem);
      return cpdata;
    });
    setactiveKey(activeKey);
  }, [paneslen]);

  const tabEdit = (targetKey: any, action: "add" | "remove") => {
    if (action === "add") {
      tabAdd();
    } else if (action === "remove") {
      if (!panes) {
        return;
      }
      let newActiveKey = activeKey;

      const lastIndex = panes.reduce((v, pane, i) => {
        if (pane.key === targetKey) {
          v = i - 1;
        }
        return v;
      }, 0);
      const newPanes = panes.filter((pane) => pane.key !== targetKey);
      if (newPanes.length && newActiveKey === targetKey) {
        if (lastIndex >= 0) {
          newActiveKey = newPanes[lastIndex].key;
        } else {
          newActiveKey = newPanes[0].key;
        }
      }
      setpanes(newPanes);
      setactiveKey(newActiveKey);
    }
  };

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
        <Button
          key="goback"
          onClick={() => {
            history.goBack();
          }}
        >
          返回
        </Button>,
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
          <Button onClick={tabAdd}>新增一轮报价</Button>
        </Col>
      </Row>
      <Tabs
        type="editable-card"
        style={{ marginTop: "10px" }}
        onChange={tabChange}
        activeKey={activeKey}
        onEdit={tabEdit}
        hideAdd={true}
      >
        {panes?.map((pane) => (
          <Tabs.TabPane
            tab={pane.title}
            key={pane.key}
            closable={pane.closable}
          >
            {pane.content}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </DetailContent>
  );
};

export default BidResult;
