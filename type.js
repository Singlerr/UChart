const { ModuleResolutionKind } = require("typescript");


function init(key,type,query){
    query.total.push({key:key,count:0,value:0});
    if(type != 'number ' && type != 'playtime' && type != 'date' && type != 'text')
        return false;
}

function total(key,value,query){//값 유효 검사추가
    for(let index = 0;index<query.total.length;++index){
        let total = query.total[index];
        let key_and_type = query.key_and_type[index];
        if(key_and_type.key == key){
            if(key_and_type.type == 'number' || key_and_type.type == 'playtime'){
                const BigNumber = require('bignumber.js');
                total.value = new BigNumber(total.value).plus(Number(value)).toString();
            }else if(key_and_type.type == 'date'){
                console.log(value);
                console.log(new Date(value).getTime());
                total.value = (BigInt(total.value) + BigInt(new Date(value).getTime())).toString();
            }else if(key_and_type.type == 'text'){
                   
            }else{
                return false;
            }
            ++total.count;
        }
    }    
    return true;
}

function totalChange(key,query,prev,current){
    for(let index = 0;index<query.total.length;++index){
        let total = query.total[index];
        let key_and_type = query.key_and_type[index];
        if(total.key == key){
            if(key_and_type.type == 'number' || key_and_type.type == 'playtime'){
                const BigNumber = require('bignumber.js');
                total.value = new BigNumber(total.value).minus(Number(prev)).toString();
                total.value = new BigNumber(total.value).plus(Number(current)).toString();
            }else if(key_and_type.type == 'date'){
                total.value = (BigInt(total.value) - BigInt(new Date(prev).getTime())).toString();
                total.value = (BigInt(total.value) + BigInt(new Date(current).getTime())).toString();
            }else if(key_and_type.type == 'text'){
                   
            }else{
                return false;
            }
        }
    }
    return true;
}

module.exports = {totalChange,init,total}