/**
 * @DECS:
 * @AUTH: myq
 * @DATE: 2021-09-06
 */
import React, {useCallback, useLayoutEffect, useRef, useState} from "react";
import {Obj} from "./type";


const srcDoc = `<script>
      function windowMessageHandler(event) {
        if (event.data !== 'callback_init') {
          return;
        }
        window.removeEventListener('message', windowMessageHandler);
        var port = event.ports[0];
        port.postMessage('ready');
    
        port.addEventListener('message', function (event) {
          var data = event.data;
    
          var callbackName = data.callbackName;
          window.request_script_callbacks = {
            [callbackName](value) {
              if (value) {
                port.postMessage({
                  callbackName,
                  value,
                });
                var node = document.getElementById(callbackName);
                if (node) {
                  node.onerror = null;
                  node.parentNode.removeChild(node);
                }
              };
              window.request_script_callbacks[callbackName] = null;
            },
          };
          var scrpit = document.createElement('script');
          scrpit.src = data.url;
          scrpit.id = callbackName;
          scrpit.type = 'text/javascript';
          scrpit.async = !0;
          scrpit.charset = 'utf-8';
          scrpit.onerror = function (evt) {
            port.postMessage({
              callbackName,
              value: 'err',
              error: evt
            });
            scrpit.onerror = null;
            scrpit.parentNode.removeChild(scrpit);
          };
          document.getElementsByTagName('head')[0].appendChild(scrpit);
        });
        port.start();
      }
      window.addEventListener('message', windowMessageHandler);
    </script>`

const parseParams = (uri: string, params?: Obj): string => {
    if (!params || typeof params !== 'object') {
        return uri;
    }
    let url = uri;
    const paramsArray: Array<string> = [];
    Object.keys(params).forEach((key) => params[key] && paramsArray.push(`${key}=${params[key]}`));
    if (url.search(/\?/) === -1) {
        url += `?${paramsArray.join('&')}`;
    } else {
        url += `&${paramsArray.join('&')}`;
    }
    return url;
};

export default function (ref: React.RefObject<HTMLIFrameElement>, timeOut: number = 3000) {
    const temp = useRef<{
        tick: number;
        channel: MessageChannel;
    }>({tick: 0, channel: null})
    const request = useCallback((url: string, params?: Obj) => {
        if (temp.current.channel) {
            return new Promise((resolve, reject) => {
                const port = temp.current.channel.port1;
                const callbackName = 'request_script_callbacks.' + temp.current.tick
                port.postMessage({
                    url: parseParams(url, params),
                    callbackName: 'request_script_callbacks.' + callbackName
                });
                const listener = (e: MessageEvent) => {
                    if (e.data?.callbackName === callbackName) {
                        if (e.data.error) {
                            reject(e.data.error)
                        } else {
                            resolve(e.data.value)
                        }
                        port.removeEventListener('message', listener);
                    }
                }
                port.addEventListener('message', listener);
                setTimeout(() => {
                    port.removeEventListener('message', listener);
                    reject('请求超时')
                }, timeOut)
            })
        }
    }, [!!ref.current])
    useLayoutEffect(() => {
        const iframeWindow = ref.current.contentWindow;
        if (!iframeWindow) {
            return;
        }
        ref.current.srcdoc = srcDoc;
        const channel = new MessageChannel();
        temp.current.channel = channel
        iframeWindow.postMessage('callback_init', '*', [channel.port2]);
    }, []);

    return [request]
}