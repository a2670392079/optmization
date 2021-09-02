## React常用的一些hooks和component

hooks例如useAdditionState:

```typescript jsx
import React, {useMemo} from "react";
import useAdditionState from "react-utils";
// import Map from 'lib';
// ...



const components: React.FC = () => {

    // 其他库中的对象;
    const obj = useMemo(() => {
        return Map({
            container: 'test',
            url: 'mapurl'
        })
    }, [])
    const mapState = useAdditionState(obj);
    return
    <>
        <div id="test"/>
        {
            // mapState行为与普通state一致
            // <childComponent mapState={mapState} />
        }
    </>
}
```

