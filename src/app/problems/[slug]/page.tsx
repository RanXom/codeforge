'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import ReactMarkdown from 'react-markdown';
import LazyEditor from '../../../components/Editor';
import 'github-markdown-css'; // ✅ Import GitHub Markdown Styles
import remarkGfm from 'remark-gfm'; // ✅ Enables tables, task lists, etc.
import React from 'react';

export default function ProblemPage({ params }) {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('python');
  const router = useRouter();

  // ✅ Correct slug extraction
  const slug = React.use(params).slug;

  useEffect(() => {
    const fetchProblem = async () => {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error(error);
        alert('Problem not found!');
        router.push('/problems');
      } else {
        setProblem(data);
      }
    };
    fetchProblem();
  }, [slug, router]);

  if (!problem) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Problem Details */}
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">{problem.title}</h1>

        {/* ✅ Apply GitHub Markdown styles */}
        <div className="markdown-body p-8 rounded-xl ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {problem.description}
          </ReactMarkdown>
        </div>

        <div className="mt-4">
          <span className="bg-green-800 text-sm text-gray-300 font-medium p-1 rounded-sm">
            {problem.difficulty}
          </span>
          <span className="ml-2 text-sm text-gray-500">
            Tags: {problem.tags.join(', ')}
          </span>
        </div>
      </div>

      {/* Code Editor */}
      <div className="bg-[#1e1e1e] p-4 rounded-xl">
        <LazyEditor code={code} onChange={setCode} language="python" />
      </div>
    </div>
  );
}
