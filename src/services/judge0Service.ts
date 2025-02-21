import { JUDGE0_CONFIG } from '@/config/judge0';
import type { 
  CodeSubmissionRequest, 
  SubmissionResult, 
  ExecutionResult,
  ProgrammingLanguage 
} from '@/types/judge0';

export class Judge0Service {
  private readonly baseUrl: string;

  constructor(baseUrl: string = JUDGE0_CONFIG.API_URL) {
    this.baseUrl = baseUrl;
  }

  private async submitCode(
    code: string, 
    language: ProgrammingLanguage, 
    input: string = ''
  ): Promise<string> {
    const submission: CodeSubmissionRequest = {
      source_code: code,
      language_id: JUDGE0_CONFIG.LANGUAGES[language],
      stdin: input,
      wait: false
    };

    const response = await fetch(`${this.baseUrl}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission)
    });

    if (!response.ok) {
      throw new Error(`Submission failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  }

  private async getSubmission(token: string): Promise<SubmissionResult> {
    const response = await fetch(`${this.baseUrl}/submissions/${token}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get submission: ${response.statusText}`);
    }

    return response.json();
  }

  async executeCode(
    code: string, 
    language: ProgrammingLanguage, 
    input: string = ''
  ): Promise<ExecutionResult> {
    try {
      const token = await this.submitCode(code, language, input);
      
      for (let attempt = 0; attempt < JUDGE0_CONFIG.MAX_CHECK_ATTEMPTS; attempt++) {
        const result = await this.getSubmission(token);
        
        // Status IDs: 1 = In Queue, 2 = Processing, 3 = Accepted, 4+ = Various errors
        if (result.status.id > 2) {
          return {
            success: result.status.id === 3,
            status: result.status,
            output: result.stdout,
            error: result.stderr,
            time: result.time,
            memory: result.memory
          };
        }
        
        await new Promise(resolve => 
          setTimeout(resolve, JUDGE0_CONFIG.SUBMISSION_CHECK_INTERVAL)
        );
      }
      
      throw new Error('Execution timed out');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Code execution failed: ${error.message}`);
      }
      throw new Error('Code execution failed with unknown error');
    }
  }
}

// Export a singleton instance
export const judge0Service = new Judge0Service();