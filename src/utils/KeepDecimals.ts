/***
 * 强制保留两位小数
 */
 export function changeTwoDecimal_f(x: string) {  
　　var f_x = parseFloat(x);  
　　if (isNaN(f_x)) return 0; 
　　var fx = Math.round(100 * Number(x))/100;  
　　var sx = fx.toString();  
　　var pos_decimal = sx.indexOf('.');  
　　if (pos_decimal < 0)  {  
　　　　pos_decimal = sx.length;  
　　    sx += '.';  
　　}  
　　while (sx.length <= pos_decimal + 2) {  
　　　　sx += '0';  
　　}  
　　return sx;  
}