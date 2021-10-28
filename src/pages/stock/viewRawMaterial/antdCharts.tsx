import React from 'react';
import { Line } from '@ant-design/charts';

const Page: React.FC = () => {
  const data = [
    { year: '5号', value: 70 },
    { year: '10号', value: 140 },
    { year: '15号', value: 90 },
    { year: '20号', value: 180 },
    { year: '25号', value: 40 },
    { year: '30号', value: 210 },
  ];

  const config = {
    data,
    height: 400,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };
  return <Line {...config} />;
};
export default Page;