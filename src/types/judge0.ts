export interface CodeSubmissionRequest {
    source_code: string;
    language_id: number;
    stdin?: string;
    expected_output?: string;
    wait?: boolean;
}

export interface SubmissionResult {
    stdout: string | null;
    stderr: string | null;
    status: {
        id: number;
        description: string;
    };
    time: string;
    memory: number;
    token: string;
}

export interface ExecutionResult {
    success: boolean;
    status: {
        id: number;
        description: string;
    };
    output: string | null;
    error: string | null;
    time: string;
    memory: number;
}

export type ProgrammingLanguage = 'python' | 'javascript' | 'cpp' | 'java';