/**
 * @author zyc
 * @copyright © 2022 
 * @description 颜色选择器
 */

import React, { useState } from 'react';
import { Popover, Space } from 'antd';
import { ChromePicker } from 'react-color';
import styles from './SelectColor.module.less'

interface SelectColorProps {
  defaultColor?: string;
  onChange: (color: string) => void;
  disabled: boolean;
}

export interface IColorObj {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export default function SelectColor({
  defaultColor = '#FF8C00',
  onChange,
  disabled = false
}: SelectColorProps): JSX.Element {
  const [color, setColor] = useState(defaultColor);
  const [subtitleColor, setSubtitleColor] = useState(defaultColor);

  const colorChange = (color: any) => {
    const hexString = toHexString(color?.rgb)
    setColor(hexString)
    setSubtitleColor(hexString)
    onChange(hexString)
  }

  const toHex = (n: number) => `${n > 15 ? '' : 0}${n.toString(16)}`;

  /**
  * 颜色对象转化为16进制颜色字符串
  * @param colorObj 颜色对象
  */
  const toHexString = (colorObj: IColorObj) => {
    const { r, g, b, a = 1 } = colorObj;
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${a === 1 ? '' : toHex(Math.floor(a * 255))}`;
  };

  return <>
    {
      disabled ?
        <Space>
          <div className={styles.color_set_show} style={{ backgroundColor: color }}></div>
          <div>{subtitleColor}</div>
        </Space>
        :
        <Popover
          content={<ChromePicker
            color={color}
            onChangeComplete={(color: any) => colorChange(color)}
          />}
          trigger="click"
        >
          <Space>
            <div className={styles.color_set_show} style={{ backgroundColor: color }}></div>
            <div>{subtitleColor}</div>
          </Space>
        </Popover>
    }


  </>
}