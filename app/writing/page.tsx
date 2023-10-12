"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface HistoryItem {
  question: string;
  userInput: string;
  suggestedAnswer: string;
}

export default function WritingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch("/session");
      if (response.status === 401) {
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userInput, setUserInput] = useState("");
  const [suggestedAnswer, setSuggestedAnswer] = useState("");
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingValidate, setLoadingValidate] = useState(false);

  const generateQuestion = async () => {
    try {
      setLoadingGenerate(true);
      const response = await fetch("/writing/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "generateQuestion",
        }),
      });

      try {
        const responseData = await response.json();

        setCurrentQuestion(responseData.completion); // Set currentQuestion to the newly generated question
        setUserInput("");
        setSuggestedAnswer("");
      } catch (error) {
        console.error("Error parsing JSON response:", error);
      }
    } catch (error) {
      console.error("Error during the question generation:", error);
    } finally {
      setLoadingGenerate(false);
    }
  };

  const validateUserInput = async () => {
    console.log(userInput);
    try {
      setLoadingValidate(true);
      const trimmedInput = userInput.trim();
      const response = await fetch("/writing/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "validateAnswer",
          question: currentQuestion,
          answer: trimmedInput.trim(),
        }),
      });

      const { completion: suggestedAnswer } = await response.json();
      setSuggestedAnswer(suggestedAnswer);
      setHistory([
        { question: currentQuestion, userInput, suggestedAnswer },
        ...history,
      ]);
      setCurrentQuestion("");
      setUserInput("");
      setSuggestedAnswer("");
    } catch (error) {
      console.error("Error during the answer validation:", error);
    } finally {
      setLoadingValidate(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* NavBar at the top */}
      <div className="bg-white shadow-md p-4">
        <nav>
          <ul className="flex space-x-4 justify-center md:justify-start">
            <li>
              <Link
                href="/"
                className="text-lg md:text-xl text-gray-700 hover:text-gray-900"
              >
                Profile
              </Link>
            </li>
            <li>
              <form action="/logout" method="POST">
                <button
                  type="submit"
                  className="text-lg md:text-xl text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </form>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch flex-grow">
        {!currentQuestion && !suggestedAnswer && (
          <Button onClick={generateQuestion} disabled={loadingGenerate}>
            {loadingGenerate ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Generate a question"
            )}
          </Button>
        )}

        {currentQuestion && (
          <>
            <p>{currentQuestion}</p>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Write your response here..."
            />
            <Button onClick={validateUserInput} disabled={loadingValidate}>
              {loadingValidate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Validate Answer"
              )}
            </Button>
          </>
        )}

        {history.map((item, index) => (
          <div key={index} className="mb-5 border p-4">
            <p>
              <strong>Question:</strong> {item.question}
            </p>
            <p>
              <strong>Your Answer:</strong> {item.userInput}
            </p>
            <p>
              <strong>Suggested Answer:</strong> {item.suggestedAnswer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
