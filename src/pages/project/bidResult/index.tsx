import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, } from "react"
import { Button, Row, Col, Tabs, Upload } from "antd";
import { useHistory, useParams } from "react-router";
import { DetailContent, BaseInfo, CommonTable, DetailTitle } from "../../common";
import { TabTypes } from "../ManagementDetail";
import { bidInfoColumns } from "../managementDetailData.json";
import * as XLSX from "xlsx";

export function readWorkbookFromLocalFile(file: Blob, callback?: (workbook: XLSX.WorkBook) => any) {
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
      const rowjson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
      data = data.concat(rowjson);
      if (onlyone) {
        break;
      }
    }
  }
  return data;
}

function formatWorkbook(
  input: { [key: string]: any; __rowNum__: number }[],
  keyNameDic?: Map<string, string>,
  requireKeys?: string[]
) {
  const _data = input.slice(0).sort((a, b) => a.__rowNum__ - b.__rowNum__);

  const fullKeys: string[] = [];
  const calcRequire = requireKeys && requireKeys.length > 0;
  const res = _data.map((item) => {
    const resObj = {} as { [key: string]: any };
    Object.keys(item).forEach((kname) => {
      const realKeyName = keyNameDic ? keyNameDic.get(kname) || kname : kname;
      const realVal = item[kname];
      resObj[realKeyName] = realVal;

      if (calcRequire && !fullKeys.includes(realKeyName)) {
        fullKeys.push(realKeyName);
      }
    });
    return resObj;
  });

  if (calcRequire) {
    if (requireKeys.some((kname) => !fullKeys.includes(kname))) {
      return [];
    }
  }

  return res;
}

const requireKeys = ["bidName", "bidCode", "cargoType", "projectCompany", "money", "weight"]
const xlsKeyNameDic: [string, string][] = [
  ["投标人名称", "bidName"],
  ["分标编号", "bidCode"],
  ["货物类别", "cargoType"],
  ["项目单位", "projectCompany"],
  ["总价", "money"],
  ["重量", "weight"],
];

const UploadXLS = (props: { children?: React.ReactNode }) => {
  return (
    <Upload
      accept=".xls,.xlsx"
      beforeUpload={(file) => {
        readWorkbookFromLocalFile(file, (workbook) => {
          const data = outputWorkbook(workbook);
          const xlsxList = formatWorkbook(
            data,
            new Map(xlsKeyNameDic),
            requireKeys
          );
          console.log(xlsxList);
        });
      }}
      showUploadList={false}
      onChange={() => false}
    >
      {props.children || <Button type="primary">导入文件</Button>}
    </Upload>
  );
};

interface BidProps {
  title: string;
  content: any;
  key: string;
  closable?: boolean;
}

const TabsCanEdit = forwardRef((props: { data?: BidProps[] }, ref?: any) => {
  const { data } = props;
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

  useImperativeHandle(
    ref,
    () => {
      return {
        tabAdd,
      };
    },
    [tabAdd]
  );

  return (
    <Tabs
      type="editable-card"
      style={{ marginTop: "10px" }}
      onChange={tabChange}
      activeKey={activeKey}
      onEdit={tabEdit}
      hideAdd={true}
    >
      {panes?.map((pane) => (
        <Tabs.TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
          {pane.content}
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
});

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

  const tabeditable = useRef(undefined as any);
  const tabAdd = useCallback(() => {
    tabeditable.current?.tabAdd();
  }, []);

  return (
    <DetailContent
      operation={[
        <Button key="edit" style={{ marginRight: "10px" }} type="primary" onClick={() => history.push(`/project/management/detail/edit/bidResult/${params.id}`)}>
          编辑
        </Button>,
        <Button key="goback" onClick={() => history.goBack()}>返回</Button>
      ]}
    >
      <DetailTitle title="基础信息" />
      <BaseInfo
        columns={[
          { title: "年份", dataIndex: "date" }, { title: "批次", dataIndex: "batch" },
          { title: "备注", dataIndex: "description" },
          {
            title: "是否中标",
            dataIndex: "isBid",
            type: "select",
            enum: [
              { value: -1, label: "未公布" },
              { value: 0, label: "否" },
              { value: 1, label: "是" }
            ]
          }
        ]}
        dataSource={{}}
      />
      <DetailTitle title="开标信息" operation={[<Button onClick={tabAdd} type="primary">新增一轮报价</Button>]} />
      <TabsCanEdit ref={tabeditable} data={data} />
    </DetailContent>
  );
};

export default BidResult;
