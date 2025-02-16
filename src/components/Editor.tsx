'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import MonacoEditor with SSR disabled
const MonacoEditor = dynamic(() => import('react-monaco-editor'), { ssr: false });

const Editor = ({ code, onChange, language = 'javascript' }) => {
  const handleEditorChange = (newValue) => {
    onChange(newValue);
  };

  return (
    <MonacoEditor
      width="100%"
      height="500px"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={handleEditorChange}
    />
  );
};

// Wrap the Editor in a Suspense component for lazy loading
const LazyEditor = (props) => (
  <Suspense fallback={<div>Loading editor...</div>}>
    <Editor {...props} />
  </Suspense>
);

export default LazyEditor;