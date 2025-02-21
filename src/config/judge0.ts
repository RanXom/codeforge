export const JUDGE0_CONFIG = {
    API_URL: process.env.NEXT_PUBLIC_JUDGE0_API_URL || 'http://localhost:2358',
    SUBMISSION_CHECK_INTERVAL: 1000, // 1 second
    MAX_CHECK_ATTEMPTS: 10,
    LANGUAGES: {
        python: 71,    // Python (3.8.1)
        javascript: 63, // JavaScript (Node.js 12.14.0)
        cpp: 54,       // C++ (GCC 9.2.0)
        java: 62,      // Java (OpenJDK 13.0.1)
    } as const
} as const;