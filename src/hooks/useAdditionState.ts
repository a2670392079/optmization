/**
 * @DECS:
 * @AUTH: myq
 * @DATE: 2021-09-02
 */
import {Obj} from "./type";
import {useEffect, useState} from "react";


/**
 * 用于将非props及state对象转为state以更新组件
 * @param obj 转换对象
 */
export default function useAdditionState(obj: Obj) {
    const [state, setState] = useState(obj);
    useEffect(() => {
        const proxyState = new Proxy(obj, {
            set(target: Obj, p: string | symbol, value: any, receiver: any): boolean {
                const res = Reflect.set(target, p, value, receiver);
                setState(proxyState)
                return res
            },
            defineProperty(target: Obj, p: string | symbol, attributes: PropertyDescriptor): boolean {
                const res = Reflect.defineProperty(target, p, attributes);
                setState(proxyState);
                return res;
            },
            deleteProperty(target: Obj, p: string | symbol): boolean {
                invariant(p, 'delete');
                Reflect.deleteProperty(target, p)
                setState(proxyState);
                return true
            }
        })
        setState(proxyState)
    }, []);

    return state;
}

function invariant(key, action) {
    if (key[0] === '_') {
        throw new Error(`Invalid attempt to ${action} private "${key}" property`);
    }
}