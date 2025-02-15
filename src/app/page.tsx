'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Editor from '@/components/Editor';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('test_table').select('*');
      if (error) console.error(error);
      else setData(data);
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-4xl font-bold">Welcome to CodeForge</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Editor/>
    </div>
  );
}