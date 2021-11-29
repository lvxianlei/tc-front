/* eslint-disable no-useless-concat */
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Modal, Checkbox, message, Radio, } from 'antd';
import './list.less';
import AuthUtil from '../../utils/AuthUtil';
const CheckboxGroup = Checkbox.Group;
declare var document: any;


interface Props extends RouteComponentProps {
    columnsKey: () => any[],
    closeExportList: Function,
    serchObj: Object,
    size: number,
    current: number,
    total: number,
    url: string | undefined,
}

interface State {
    isLoading: boolean,
    columnsKey: any[],
    selectList: any[],
    isAllChecked: boolean,
    exportType: number,
}

class ExportList extends Component<Props, State>  {
    state: State = {
        isLoading: false,
        columnsKey: [],
        selectList: [],
        isAllChecked: true,
        exportType: 1,
    }
    UNSAFE_componentWillMount() {
        let initColumnsKey = this.props.columnsKey().map((item) => {
            return {
                label: item.title,
                value: item.dataIndex,
            }
        })
        let initSelectList = initColumnsKey.map(item => item.value)
        this.setState({
            columnsKey: initColumnsKey,
            selectList: initSelectList,
        })
    }
    // 导出
    ExportList = async () => {
        let { selectList, columnsKey } = this.state;
        let list: any[] = [];
        selectList.forEach((item,) => {
            columnsKey.forEach((it, ix) => {
                if (item === it.value) {
                    list.push(it)
                }
            })
        })
        if (!list.length) {
            message.error('至少选择一列导出！')
            return
        }
        let fields: any = {}
        list.forEach((item,) => {
            fields[item.value] = item.label;
        })
        // 关闭导出弹窗
        this.props.closeExportList()
        this.download(fields)
    }
    download = async (fields: any): Promise<void> => {
        let object: any = {
            ...this.props.serchObj,
            size: this.state.exportType === 1 ? this.props.size : this.props.total,
            current: this.state.exportType === 1 ? this.props.current : 1,
        }
        let paramsArray: any = [];
        //拼接参数
        Object.keys(object).forEach(key => paramsArray.push(key + '=' + object[key]))
        return fetch(`${this.props.url}?${paramsArray.join('&')}`, {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                'Tenant-Id': AuthUtil.getTenantId(),
                'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
                isExport: 'true',
                fields: encodeURI(JSON.stringify(fields)),
            },
        }).then((res) => {
            return res.blob();
        }).then((data) => {
            var blob = new Blob([data]);
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function (e) {
                var a = document.createElement('a');
                a.download = '导出数据' + '.xlsx';
                // a.download = fileName
                a.href = URL.createObjectURL(blob);
                document.querySelector('body').append(a);
                a.click();
            }
        })
    }
    // 单个选择
    childrenChange = (list: any[]) => {
        let { columnsKey, isAllChecked } = this.state;
        columnsKey.length === list.length ? isAllChecked = true : isAllChecked = false;
        this.setState({
            selectList: list,
            isAllChecked,
        })
    }
    // 全选/取消全选
    onCheckAllChange = (e: { target: { checked: any; }; }) => {
        let { columnsKey, selectList } = this.state;
        e.target.checked ? selectList = columnsKey.map(item => item.value) : selectList = []
        this.setState({ isAllChecked: e.target.checked, selectList })
    }
    render() {
        let { selectList, columnsKey, isAllChecked } = this.state;
        return (
            <div id='inStorage_modal'>
                <Modal
                    className='export_inStorage_modal'
                    title='数据导出'
                    visible={true}
                    onOk={this.ExportList}
                    onCancel={() => {
                        this.props.closeExportList()
                    }}
                    cancelText='取消'
                    okText='确定'
                >
                    <div className='exportType'>
                        <Radio.Group
                            name='radiogroup'
                            value={this.state.exportType}
                            onChange={(e) => {
                                this.setState({ exportType: e.target.value })
                            }}
                        >
                            <Radio value={1}>导出当前查询分页数据</Radio>
                            <Radio value={2}>导出当前查询全部数据</Radio>
                        </Radio.Group>
                    </div>
                    <div className='CheckAll' style={{ borderBottom: '1px solid #e9e9e9', marginBottom: 8, paddingBottom: 2, }}>
                        <Checkbox
                            onChange={(e) => { this.onCheckAllChange(e) }}
                            checked={isAllChecked}
                        >
                            导出表头选择
                        </Checkbox>
                    </div>
                    <CheckboxGroup
                        options={columnsKey}
                        value={selectList}
                        onChange={(list) => { this.childrenChange(list) }}
                    />
                </Modal>
            </div>
        );
    }
}

export default ExportList;