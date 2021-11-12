import React, { useState } from 'react';
import { Line } from '@ant-design/charts';

interface IProps {
  results: any
  i:any
}
 
export default function Page(props: any) {
  const [o,setO]=useState<any>({});
  const results = props

  var arr1 = []
  for (let i in results) {
    o[i] = results[i];
    arr1.push(o)
  }
  const data=arr1[0].arr
  const config = {
    data,
    height: 400,
    xField: "updateTime",
    yField: "price",
    point: {
      size: 5,
      shape: 'diamond',
    },
  };
  return <Line {...config} />;
}