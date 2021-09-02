import {useMemo} from 'react';
import {Obj} from "./type";

/**
 * 用于监听state和props以外的引用类型数据变化
 * @param obj 监听对象
 * @param callback 变化回调
 */
export default function useWatchState(obj: Obj, callback: (target: Obj, key: string | symbol, value: any) => void) {
    return useMemo(() => new Proxy(obj, {
        set: (target, propKey, value, receiver) => {
            const res = Reflect.set(target, propKey, value, receiver)
            callback(target, propKey, value)
            return res
        },
        defineProperty(target: Obj, p: string | symbol, attributes: PropertyDescriptor): boolean {
            const res = Reflect.defineProperty(target, p, attributes);
            callback(target, p, attributes.value);
            return res;
        }
    }), [])
}