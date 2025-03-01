const JUDGE0_API_URL = process.env.JUDGE0_API_URL || "http://localhost:2358"

type SubmissionRequest = {
  source_code: string
  language_id: number
  stdin?: string
  expected_output?: string
}

type SubmissionResponse = {
  token: string
  status: {
    id: number
    description: string
  }
  stdout?: string
  stderr?: string
  compile_output?: string
  message?: string
  time?: string
  memory?: number
}

export const languageIds = {
  javascript: 63, // Node.js
  python: 71, // Python 3
  java: 62, // Java
  cpp: 54, // C++
}

export async function createSubmission(data: SubmissionRequest): Promise<string> {
  const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create submission")
  }

  const result = await response.json()
  return result.token
}

export async function getSubmission(token: string): Promise<SubmissionResponse> {
  const response = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to get submission")
  }

  return response.json()
}

export async function waitForSubmission(token: string): Promise<SubmissionResponse> {
  let result: SubmissionResponse

  while (true) {
    result = await getSubmission(token)

    if (result.status.id >= 3) {
      // Status >= 3 means the submission is finished
      return result
    }

    await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before checking again
  }
}

