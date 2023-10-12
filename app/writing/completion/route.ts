// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  const { action, question, answer } = await req.json();
  //   console.log("action", action);
  //   console.log("question", question);
  //   console.log("answer", answer);
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("x-api-key", process.env.ANTHROPIC_API_KEY || "");
  console.log("Received request for POST /writing/completion");

  if (action === "generateQuestion") {
    try {
      const response = await fetch("https://api.anthropic.com/v1/complete", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          prompt: "Generate a question\n\nAssistant:",
          model: "claude-v1",
          max_tokens_to_sample: 300,
          temperature: 0.9,
        }),
      });

      const responseData = await response.json();

      console.log(responseData);
      if (!responseData.completion) {
        console.error("No completion received from Anthropic API");
        return new Response(
          JSON.stringify({
            error: "Failed to generate a question due to no completion data.",
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
            status: 500,
          }
        );
      }

      const question = responseData.completion.trim();
      //   console.log(`Generated question: ${question}`);
      // Return the response in the format the client expects

      return new Response(
        JSON.stringify({
          completion: question,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    } catch (e) {
      console.log("Network request failed:", e);

      return new Response(
        JSON.stringify({
          error: "Failed to generate a question.",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 500, // This indicates an internal server error
        }
      );
    }
  } else if (action === "validateAnswer") {
    console.log("question", question);
    console.log("answer", answer);
    try {
      const response = await fetch("https://api.anthropic.com/v1/complete", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          prompt: `Question: ${question}\nAnswer: ${answer}\n\nAssistant:validate answer and do not generate another question\n\nAssistant:`,
          model: "claude-v1",
          max_tokens_to_sample: 300,
          temperature: 0.9,
        }),
      });

      const responseData = await response.json();
      //   console.log(responseData);
      if (!responseData.completion) {
        console.error("No completion received from Anthropic API");
        return {
          error: "Failed to generate a question due to no completion data.",
        };
      }

      const responseQuestion = responseData.completion.trim();
      console.log(`Generated question response: ${responseQuestion}`);
      // Return the response in the format the client expects

      return new Response(
        JSON.stringify({
          completion: responseQuestion,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    } catch (e) {
      console.log("Network request failed:", e);

      return new Response(
        JSON.stringify({
          error: "Failed to generate a question.",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 500, // This indicates an internal server error
        }
      );
    }
  } else {
    return new Response(
      JSON.stringify({
        error: "Invalid action",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400, // 400 is "Bad Request"
      }
    );
  }
}
