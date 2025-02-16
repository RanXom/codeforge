'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { useUser } from '@supabase/auth-helpers-react';
import ReactMarkdown from 'react-markdown';
import LazyEditor from '../../../components/Editor';
import 'github-markdown-css';
import remarkGfm from 'remark-gfm';
import React from 'react';

export default function ProblemPage({ params }) {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('python');
  const router = useRouter();
  const user = useUser(); // Get the current user

  // Debugging: Check user object
  useEffect(() => {
    console.log('User:', user);
  }, [user]);

  // Force session refresh
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error(error);
      else console.log('Session:', data.session);
    };
    getSession();
  }, [supabase]);

  // Correct slug extraction
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

  const handleSubmit = async () => {
    if (!user) {
      alert('You must be logged in to submit a solution.');
      return;
    }

    try {
      // Execute code using Judge0 API (optional, if integrated)
      const result = await executeCode(code, language);

      // Store submission in Supabase
      const { error } = await supabase.from('submissions').insert({
        user_id: user.id,
        problem_id: problem.id,
        code,
        language,
        status: result?.status?.description || 'Pending',
        execution_time: result?.time || 0,
        memory_used: result?.memory || 0,
        submitted_at: new Date(),
      });

      if (error) {
        console.error(error);
        alert('Submission failed. Please try again.');
      } else {
        alert('Code submitted successfully!');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Problem Details */}
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">{problem.title}</h1>
        <div className="markdown-body p-8 rounded-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
        </div>
        <div className="mt-4">
          <span className="bg-green-800 text-sm text-gray-300 font-medium p-1 rounded-sm">
            {problem.difficulty}
          </span>
          <span className="ml-2 text-sm text-gray-500">
            Tags: {problem.tags.join(', ')}
          </span>
        </div>
        <div className="mt-4">
          <label className="mr-2 font-medium">Select Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-950 border p-2 rounded"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>
      </div>
      {/* Code Editor */}
      <div className="bg-[#1e1e1e] p-4 rounded-xl">
        <LazyEditor code={code} onChange={setCode} language={language} />
      </div>
      {/* Action Buttons */}
      <div className="p-8 flex justify-end space-x-4">
        <button
          className="bg-green-700 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          className="bg-red-700 text-white px-4 py-2 rounded"
          onClick={() => router.push('/problems')}
        >
          Quit
        </button>
      </div>
    </div>
  );
}