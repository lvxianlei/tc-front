import React, { useState } from 'react';
import { Line } from '@ant-design/charts';

interface IProps {
  results: any
  i:any
}
 
export default function Page(props: any) {
  const [o,setO]=useState<any>({});
  const results = props
  console.log(results, 'a1');

  var arr1 = []
  for (let i in results) {
    o[i] = results[i];
    arr1.push(o)
  }
  console.log(arr1[0].arr,'a2');

  const data=arr1[0].arr
  console.log(data,12345);
  
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