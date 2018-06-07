module.exports.hslToDec = (H,S,L) =>{

    /* input range:
    H: 0 - 360, 
    S: 0 - 1, 
    L: 0 - 1
    */

   if(H < 0 || H > 360 || S < 0 || S > 1 || L < 0 || L > 360){
    console.log("<!Error> hslToDec: value out of range, returning 0");
    return 0;
   }

  var H0 = H/60
    
  var C = (1 - Math.abs((2 * L) - 1)) * S;
  var X = C * (1 - Math.abs(H0 % 2- 1));
  var m = L - C / 2;
  var R = 0;
  var R1 = 0;
  var G = 0;
  var G1 = 0;
  var B = 0;
  var B1 = 0;
 
    if (H0 < 1){     
        R1 = C;
        G1 = X;
        B1 = 0;
    }else if (H0 < 2){
        R1 = X;
        G1 = C;
        B1 = 0;
    }else if (H0 < 3){
        R1 = 0;
        G1 = C;
        B1 = X;
    }else if (H0 < 4){
        R1 = 0;
        G1 = X;
        B1 = C;
    }else if (H0 < 5){
        R1 = X;
        G1 = 0;
        B1 = C;
    }else if (H0 < 6){
        R1 = C;
        G1 = 0;
        B1 = X;
    };
    
    R = Math.round((R1 + m) * 255);
    G = Math.round((G1 + m) * 255);
    B = Math.round((B1 + m) * 255);

    return Math.round(R * Math.pow(256,2) + G * 256 + B);
};