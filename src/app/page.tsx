'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Problems() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const { data, error } = await supabase.from('problems').select('*');
      if (error) console.error(error);
      else setProblems(data);
    };
    fetchProblems();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Problems</h1>
      <ul className="space-y-4">
        {problems.map((problem) => (
          <li key={problem.id} className="bg-[#1e1e1e] p-4 rounded shadow">
            <Link href={`/problems/${problem.slug}`}>
              <h2 className="text-xl font-semibold">{problem.title}</h2>
              <div className="mt-2">
                <span className="text-sm text-blue-500 font-medium">
                  {problem.difficulty}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  Tags: {problem.tags.join(', ')}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}