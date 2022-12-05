/**
 * @author zyc
 * @copyright © 2022 
 * @description 快捷键输入
 */

/**
 * value: 输入数值
 * quickItems: 快捷对应列表
*/
export function quickConversion(value: string, quickItems: { value: string, label: string }[]): string {
    if (quickItems.findIndex(res => res.value === value) !== -1) {
        const newValues = quickItems.find(res => res.value === value)
        return  newValues?.label || ''
    } else {
        return value
    }
}

// 材质快捷键
export const structureTextureShortcutKeys = [
    {
        label: 'Q235B',
        value: '0'
    },
    {
        label: 'Q355B',
        value: '1'
    },
    {
        label: 'Q420B',
        value: '2'
    },
    {
        label: 'Q460B',
        value: '3'
    },
    {
        label: '20',
        value: '4'
    },
    {
        label: 'HRB235',
        value: '5'
    },
    {
        label: 'HRB335',
        value: '6'
    },
    {
        label: 'HH',
        value: '7'
    },
    {
        label: '20#',
        value: '8'
    },
    {
        label: 'Q345B',
        value: '9'
    }
]

// 材料快捷键
export const materialShortcutKeys = [
    {
        label: '角钢',
        value: '0'
    },
    {
        label: '钢板',
        value: '1'
    },
    {
        label: '圆钢',
        value: '2'
    },
    {
        label: '槽钢',
        value: '3'
    },
    {
        label: '钢管',
        value: '4'
    },
    {
        label: '花纹板',
        value: '5'
    },
    {
        label: '法兰',
        value: '6'
    },
    {
        label: '直缝焊管',
        value: '7'
    },
    {
        label: '扁铁',
        value: '8'
    },
    {
        label: '锥形管',
        value: '9'
    },
    {
        label: '多棱管',
        value: '10'
    },
    {
        label: '无缝管',
        value: '11'
    },
    {
        label: 'H型钢',
        value: '12'
    },
    {
        label: '方管',
        value: '13'
    },
    {
        label: '矩形管',
        value: '14'
    },
    {
        label: '螺纹钢',
        value: '15'
    },
    {
        label: '高颈法兰',
        value: '16'
    },
    {
        label: '工字钢',
        value: '17'
    }
]