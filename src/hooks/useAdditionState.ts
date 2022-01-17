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
 type ProxyHanderFunction<
 K extends object,
 T extends keyof ProxyHandler<K>
> = Pick<ProxyHandler<K>, T>;

function registerProxyHanderCallback(
 obj: Record<string, any>,
 handers: Array<keyof ProxyHandler<typeof obj>>,
 callback: (target: typeof obj) => void
) {
 const registerHanders: ProxyHandler<typeof obj> = {};
 let proxy;
 handers.forEach((hander) => {
   registerHanders[hander] = (...rest: Array<any>) => {
     const res = Reflect[hander].apply(this,rest);
     callback(proxy);
     return res;
   };
 });
 proxy = new Proxy<typeof obj>(obj, registerHanders);
 return proxy;
}

export default function useAdditionState(
 obj: Record<string, any>,
 handers: Array<keyof ProxyHandler<typeof obj>> = [
   "defineProperty",
   "deleteProperty",
   "set",
 ]
) {
 const [state, setState] = useState();
 useEffect(() => {
   registerProxyHanderCallback(
     obj,
     handers,
     setState
   );
 }, []);
 return state;
}