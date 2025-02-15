'use client';

import React, { useState } from "react";
import MonacoEditor from "react-monaco-editor";

const Editor = () => {
    const [code, setCode] = useState('// Write your code here');

    const handleEditorChange = (newValue: string) => {
        setCode(newValue);
    };

    return (
        <MonacoEditor
            width="100%"
            height="500px"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
        />
    );
};

export default Editor;