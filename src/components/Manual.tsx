import React, { memo } from 'react';

interface ManualProps {
    deps?: Array<any>;
    children: React.ReactNode
}

function is(x: any, y: any) {
    return (
        (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
    );
}


const Manual:React.FC<ManualProps> = (props) => {
    const {children} = props
    return typeof children === 'function' ? children() : children
}


export default memo(Manual, (pre, cur) => {
    const prevDeps = pre.deps || [];
    const nextDeps = cur.deps || [];
    for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
        if (is(nextDeps[i], prevDeps[i])) {
            continue
        }
        return false
    }
    return true
})