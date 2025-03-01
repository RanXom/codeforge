"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Play, Save, CheckCircle, XCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

// Mock language options
const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
]

// Mock test cases
const testCases = [
  {
    input: "nums = [2,7,11,15], target = 9",
    expectedOutput: "[0,1]",
  },
  {
    input: "nums = [3,2,4], target = 6",
    expectedOutput: "[1,2]",
  },
]

// Default code templates
const codeTemplates = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your code here
}`,
  python: `def two_sum(nums, target):
    # Your code here
    pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{0, 0};
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {0, 0};
    }
};`,
}

export function CodeEditor({ problemId }: { problemId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState(codeTemplates.javascript)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const editorRef = useRef<any>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)

  // Anti-cheating measures
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isFullscreen) {
        // Log tab switch attempt
        console.log("Tab switch detected")
        toast({
          title: "Warning",
          description: "Tab switching is not allowed during the test.",
          variant: "destructive",
        })
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Escape key from exiting fullscreen
      if (e.key === "Escape" && isFullscreen) {
        e.preventDefault()
      }

      // Developer bypass: Ctrl + Shift + X
      if (e.ctrlKey && e.shiftKey && e.key === "X") {
        setIsFullscreen(false)
      }

      // Prevent copy-paste
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v") && isFullscreen) {
        e.preventDefault()
        toast({
          title: "Warning",
          description: "Copy-paste is not allowed during the test.",
          variant: "destructive",
        })
      }
    }

    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      if (isFullscreen) {
        e.preventDefault()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("contextmenu", handleContextMenu)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [isFullscreen, toast])

  // Handle language change
  useEffect(() => {
    setCode(codeTemplates[language as keyof typeof codeTemplates])
  }, [language])

  // Monaco editor setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@monaco-editor/react").then(({ default: MonacoEditor }) => {
        editorRef.current = MonacoEditor
      })
    }
  }, [])

  const handleRunCode = async () => {
    setIsRunning(true)
    setTestResults([])

    // Simulate code execution
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock test results
    const results = testCases.map((testCase, index) => {
      const passed = Math.random() > 0.3 // Randomly pass or fail for demo
      return {
        id: index,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: passed ? testCase.expectedOutput : "[1,0]",
        passed,
      }
    })

    setTestResults(results)
    setIsRunning(false)
  }

  const handleSaveCode = () => {
    toast({
      title: "Code Saved",
      description: "Your code has been saved successfully.",
    })
  }

  const handleEnterFullscreen = () => {
    if (fullscreenRef.current) {
      if (fullscreenRef.current.requestFullscreen) {
        fullscreenRef.current.requestFullscreen()
        setIsFullscreen(true)
      }
    }
  }

  const MonacoEditor = editorRef.current

  return (
    <div ref={fullscreenRef} className="min-h-[500px]">
      <Card className="min-h-[500px]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Code Editor</span>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] border-y">
            {MonacoEditor ? (
              <MonacoEditor
                height="400px"
                language={language}
                value={code}
                onChange={(value: string) => setCode(value)}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  automaticLayout: true,
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          <Tabs defaultValue="testcases" className="p-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="testcases">Test Cases</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="testcases" className="mt-4 space-y-4">
              {testCases.map((testCase, index) => (
                <div key={index} className="space-y-2 border rounded-md p-4">
                  <div>
                    <strong>Input:</strong> {testCase.input}
                  </div>
                  <div>
                    <strong>Expected Output:</strong> {testCase.expectedOutput}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="results" className="mt-4 space-y-4">
              {isRunning ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mr-2" />
                  <span>Running tests...</span>
                </div>
              ) : testResults.length > 0 ? (
                <>
                  {testResults.map((result) => (
                    <div key={result.id} className="space-y-2 border rounded-md p-4">
                      <div className="flex items-center gap-2">
                        {result.passed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <strong>Test Case {result.id + 1}</strong>
                      </div>
                      <div>
                        <strong>Input:</strong> {result.input}
                      </div>
                      <div>
                        <strong>Expected Output:</strong> {result.expectedOutput}
                      </div>
                      <div>
                        <strong>Your Output:</strong> {result.actualOutput}
                      </div>
                    </div>
                  ))}

                  <div className="text-center py-2">
                    {testResults.every((r) => r.passed) ? (
                      <div className="text-green-500 font-bold">All tests passed!</div>
                    ) : (
                      <div className="text-red-500 font-bold">
                        {testResults.filter((r) => r.passed).length} of {testResults.length} tests passed
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Run your code to see results.</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            {!isFullscreen && (
              <Button variant="outline" onClick={handleEnterFullscreen}>
                Enter Fullscreen Mode
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveCode}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleRunCode} disabled={isRunning}>
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

