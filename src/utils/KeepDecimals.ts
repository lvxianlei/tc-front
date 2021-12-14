/***
 * 强制保留两位小数
 */
 export function changeTwoDecimal_f(x: string) {  
　　var f_x = parseFloat(x);  
　　if (isNaN(f_x)) return 0; 
　　var f_x = Math.round(100 * Number(x))/100;  
　　var s_x = f_x.toString();  
　　var pos_decimal = s_x.indexOf('.');  
　　if (pos_decimal < 0)  {  
　　　　pos_decimal = s_x.length;  
　　    s_x += '.';  
　　}  
　　while (s_x.length <= pos_decimal + 2) {  
　　　　s_x += '0';  
　　}  
　　return s_x;  
}