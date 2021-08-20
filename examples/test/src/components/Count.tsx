import React, { useState } from "react";

const Count: React.FC = () => {
    const [count, setCount] = useState(0);
    console.log('render')

    return <div style={{ width: 200, height: 200 }}>
        <p>count:{count}</p>
        <button onClick={() => setCount(count+1)}>count+</button>
    </div>
}


export default Count