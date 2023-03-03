import { BaseTable, BaseTableProps, Classes, LoadingContentWrapperProps } from 'ali-react-table'
import { Spin, Empty } from 'antd'
import React from 'react'
import styled from 'styled-components'
import "./AliTable.less"
const StyledBaseTable = (styled(BaseTable)`
  --line-height: 1.5715;
  --font-size: 14px;
  --row-height: 32px;
  --header-row-height: 36px;
  --cell-padding: 16px;
  --lock-shadow: rgba(0, 0, 0, 0.2) 0 0 10px 0px;
  --border-color: #f0f0f0;
  --color: rgba(0, 0, 0, 0.85);
  --bgcolor: white;
  --hover-bgcolor: #fff8e6;
  --highlight-bgcolor: #fff8e6;
  --header-color: rgba(0, 0, 0, 0.85);
  --header-bgcolor: #fafafa;
  --header-hover-bgcolor: #f5f5f5;
  --header-highlight-bgcolor: #f5f5f5;
  .art-horizontal-scroll-container{
    z-index: 3
  }
  .art-table-row.odd{
    --bgcolor: #f8f8f8;
  }
  &.dark {
    --lock-shadow: black 0 0px 6px 2px;
    --border-color: #303030;
    --color: rgba(255, 255, 255, 0.65);
    --bgcolor: #141414;
    --hover-bgcolor: #262626;
    --highlight-bgcolor: #262626;
    --header-color: rgba(255, 255, 255, 0.85);
    --header-bgcolor: #1d1d1d;
    --hover-hover-bgcolor: #222;
    --header-highlight-bgcolor: #222;
  }
  &.compact {
    --cell-padding: 12px 8px;
  }
  &.small {
    --font-size: 12px;
    --header-row-height: 36px;
    --header-color: #666;
    --cell-padding: 0px 8px;
    th {
      .resize-handle {
        dispaly: inline-block;
        width: 1px;
        height: 60%;
        margin: auto 0;
      }
      .ant-btn-link {
        padding-left: 0px;
      }
    }
    td {
        color: #666;
        padding: 0 8px;
      .ant-btn-link {
        padding-left: 0px;
        padding-right: 7px;
      }
    }
    &.edit {
      td {
        color: #666;
        padding: 4px 8px;
      }
    }
  }
  &.edit {
    td {
      color: #666;
      padding: 4px 8px;
      }
  }
  td {
    transition: background 0.3s;
  }
  th {
    font-weight: 500;
  }
  .${Classes.lockShadowMask} {
    .${Classes.lockShadow} {
      transition: box-shadow 0.3s;
    }
  }
  &:not(.bordered) {
    --cell-border-vertical: none;
    --header-cell-border-vertical: none;
    --cell-border-horizontal: none;
    thead > tr.first th {
      border-top: none;
    }
  }
` as unknown) as typeof BaseTable

const AntdEmptyContent = React.memo(() => <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)

function AntdLoadingContentWrapper({ children, visible }: LoadingContentWrapperProps) {
  return (
    <div
      className="ant-loading-content-wrapper"
      style={{ opacity: visible ? 1 : undefined }}
    >
      {children}
    </div>
  )
}

function AntdLoading() {
  return <Spin style={{ display: 'block' }} />
}

interface AntdTableProps extends BaseTableProps {
  size?: "default" | "middle" | "small"
}

/**改造为 Ant Design 风格的基础表格组件.
 *  `className="bordered"` 带边框样式
 *  `className="compact"` 紧凑样式
 *  `className="dark"` 暗色主题
 *  `className="edit"` 编辑时样式
 * */
export default ({ size = "default", ...props }: AntdTableProps) => {
  return <StyledBaseTable
    defaultColumnWidth={100}
    {...props}
    className={`${size} ${props.className}`}
    components={{
      EmptyContent: AntdEmptyContent,
      LoadingContentWrapper: AntdLoadingContentWrapper,
      LoadingIcon: AntdLoading,
      ...props.components,
    }}
  />
}