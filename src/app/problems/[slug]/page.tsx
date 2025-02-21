'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { useUser } from '@supabase/auth-helpers-react';
import ReactMarkdown from 'react-markdown';
import LazyEditor from '../../../components/Editor';
import 'github-markdown-css';
import remarkGfm from 'remark-gfm';
import React from 'react';

// Judge0 API configuration
const JUDGE0_API_URL = 'your-judge0-api-endpoint';
const JUDGE0_API_KEY = 'your-judge0-api-key';

const executeCode = async (code, language) => {
  try {
    // Map our language selections to Judge0 language ids
    const languageIds = {
      'python': 71,
      'javascript': 63,
      'cpp': 54,
      'java': 62
    };

    const submission = {
      source_code: code,
      language_id: languageIds[language],
      stdin: '',  // Add test cases here if needed
    };

    // Create submission
    const response = await fetch(`${JUDGE0_API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY
      },
      body: JSON.stringify(submission)
    });

    const { token } = await response.json();

    // Poll for results
    let result;
    for (let i = 0; i < 10; i++) {
      const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}`, {
        headers: {
          'X-RapidAPI-Key': JUDGE0_API_KEY
        }
      });
      result = await resultResponse.json();
      
      if (result.status.id > 2) { // Not queued or processing
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before polling again
    }

    return {
      status: result.status,
      output: result.stdout,
      error: result.stderr,
      time: result.time,
      memory: result.memory
    };
  } catch (error) {
    console.error('Judge0 API Error:', error);
    throw new Error('Code execution failed');
  }
};

export default function ProblemPage({ params }) {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('python');
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Enhanced fullscreen management
  const requestFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => console.error("Fullscreen error:", err));
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }, []);

  const forceFullscreen = useCallback(() => {
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
      requestFullscreen();
    }
  }, [requestFullscreen]);

  // Aggressive fullscreen and focus management
  useEffect(() => {
    requestFullscreen();

    const fullscreenChangeHandler = () => {
      setTimeout(forceFullscreen, 100);
    };

    const visibilityChangeHandler = () => {
      if (document.visibilityState === 'hidden') {
        setTimeout(() => {
          window.focus();
          requestFullscreen();
        }, 100);
      }
    };

    const keydownHandler = (e) => {
      if (e.key === 'Escape' || e.key === 'F11') {
        e.preventDefault();
        e.stopPropagation();
        forceFullscreen();
      }
      // Prevent other common escape methods
      if ((e.ctrlKey && e.key === 'w') || (e.altKey && e.key === 'Tab')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Block browser features that could exit fullscreen
    document.addEventListener('fullscreenchange', fullscreenChangeHandler, true);
    document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler, true);
    document.addEventListener('msfullscreenchange', fullscreenChangeHandler, true);
    document.addEventListener('visibilitychange', visibilityChangeHandler, true);
    window.addEventListener('keydown', keydownHandler, true);
    window.addEventListener('blur', requestFullscreen);
    
    // Prevent context menu
    document.addEventListener('contextmenu', e => e.preventDefault(), true);

    // Block copy/paste shortcuts
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    }, true);

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('msfullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
      window.removeEventListener('keydown', keydownHandler);
      window.removeEventListener('blur', requestFullscreen);
    };
  }, [requestFullscreen, forceFullscreen]);

  // User session management
  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error && data.session?.user) {
        setUser(data.session.user);
      }
    };
    fetchSession();
  }, []);

  // Problem fetching
  useEffect(() => {
    const fetchProblem = async () => {
      if (!params?.slug) return;
      
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('slug', params.slug)
        .single();
        
      if (error) {
        console.error(error);
        router.push('/problems');
      } else {
        setProblem(data);
      }
    };
    fetchProblem();
  }, [params?.slug, router]);

  const handleSubmit = async () => {
    if (!user) {
      alert('You must be logged in to submit a solution.');
      return;
    }

    if (!code.trim()) {
      alert('Please write some code before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Execute code using Judge0 API
      const result = await executeCode(code, language);

      // Store submission in Supabase
      const { error } = await supabase.from('submissions').insert({
        user_id: user.id,
        problem_id: problem.id,
        code,
        language,
        status: result.status.description,
        execution_time: result.time,
        memory_used: result.memory,
        output: result.output,
        error: result.error,
        submitted_at: new Date(),
      });

      if (error) throw error;

      // Show success or failure based on execution result
      if (result.status.id === 3) { // Accepted
        alert('Solution submitted successfully!');
      } else {
        alert(`Execution ${result.status.description}\n${result.error || ''}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problem) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
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
      
      <div className="bg-[#1e1e1e] p-4 rounded-xl">
        <LazyEditor code={code} onChange={setCode} language={language} />
      </div>
      
      <div className="p-8 flex justify-end space-x-4">
        <button
          className="bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
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