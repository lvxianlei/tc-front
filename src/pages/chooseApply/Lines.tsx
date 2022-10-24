import React from 'react';
import { Line } from '@ant-design/plots';
import { line } from "./chart.json"
import { Col, Row } from 'antd';
const DemoLine = () => {
    const config = line.map((item: any) => ({
        data: item,
        xField: 'year',
        yField: 'gdp',
        seriesField: 'name',
        yAxis: {
            label: {
                formatter: (v: any) => `${(v / 10e8).toFixed(1)}`
            }
        },
        legend: {
            position: 'bottom'
        },
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000
            }
        }
    }))

    return <Row gutter={[10, 10]}>
        {config.map((item, index) => <Col
            key={index}
            span={8}
            style={{ height: 200 }}
        >
            <Line {...item as any} />
        </Col>)}
    </Row>
}

export default DemoLine
