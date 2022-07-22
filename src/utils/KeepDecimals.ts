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

/**
 * 强制保留n位小数
 */
 export function doNumber(value: any,n: any) {
    var f = Math.round(value*Math.pow(10,n))/Math.pow(10,n);
    var s = f.toString();
    var rs = s.indexOf('.');   
    if (rs < 0) {     
        s += '.';   
    } 
    for(var i = s.length - s.indexOf('.'); i <= n; i++){
      s += "0";
    }
    return s;
}


/**
 * 向上取整数
 */

export function upNumber(value: string) {
  const isCeil = value.split("")[value.split("").length - 1]
  if (isCeil === "0") return value;
  const val = (+value) + 10;
  const str = (val + "").split("");
  str[str.length - 1] = "0";
  return str.join("")
}