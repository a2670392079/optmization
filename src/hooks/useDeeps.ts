import {} from  'react';

interface Obj{
    [key:string]: any
}

/**
 * 用于处理state和props以外的引用类型数据变化
 */
export function useDeeps(deeps:Array<Obj>, callback:(target: Obj, key:string | symbol, value:any) => void){
    const res = deeps.map(obj => new Proxy(obj, {
        set: (target, propKey, value, receiver) =>{
            callback(target, propKey, value)
            return Reflect.set(target, propKey, value, receiver)
        }
    }))

    return res;
}