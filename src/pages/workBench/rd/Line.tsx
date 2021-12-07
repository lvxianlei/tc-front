import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import * as echarts from 'echarts';

export interface LineProps {}
export interface ILineRouteProps extends RouteComponentProps<LineProps>, WithTranslation {
    readonly keyIndex: string;
    readonly valueList: (string| number)[];
}

export interface LineState {}

const dateList = [1, 2, 3, 4, 5, 6, 7 ];

class Line extends React.Component<ILineRouteProps, LineState> {

    componentDidMount() {
        this.initCharts();
    }

	protected initCharts() {
		const myChart = echarts.init((document as HTMLElement | any).getElementById(this.props.keyIndex || 'main'));
        // 绘制图表
        myChart.setOption({ 
			color: '#FF8C00',
            tooltip: { show: false },
            xAxis: [{
				data: dateList,
				show: false,
                boundaryGap: false
            }],
            yAxis: [{ show: false }],
            grid: { x: 10, y: 10, y2: 10 },
            series: [{
				type: 'line',
				showSymbol: false,
				data: this.props.valueList
            }]
        });
	}

    /**
     * @description Renders AbstractDetailComponent
     * @returns render 
     */
    public render(): React.ReactNode {
        return <div id={ this.props.keyIndex || 'main'} style={{ width:'100%', height:'50px', background:'#F8F8F8' }} key={ this.props.keyIndex }></div>
    }
}

export default withRouter(withTranslation('translation')(Line))
