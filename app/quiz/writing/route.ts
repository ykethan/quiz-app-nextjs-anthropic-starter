// IMPORTANT! Set the runtime to edge
// export const runtime = "edge";

import { NextApiRequest, NextApiResponse } from "next";
import { Bedrock } from "langchain/llms/bedrock";

export async function POST(req: Request) {
  const { action, question, answer } = await req.json();

  const model = new Bedrock({
    model: "anthropic.claude-v2", // You can also do e.g. "anthropic.claude-v2"
    region: "us-east-1",
    temperature: 0.9,
    maxTokens: 300,
    stopSequences: ["stop"],
  });

  if (action === "generateQuestion") {
    try {
      const questionResponse = await model.invoke(
        "\nHuman: Generate a quiz question in any topic. provide just the question and dont add any other information in the response\nAssistant: \n\n"
      );

      console.log(questionResponse);
      return new Response(
        JSON.stringify({
          completion: questionResponse,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    } catch (e) {
      console.error(e);
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
    try {
      const answerResponse = await model.invoke(
        `\nHuman: Question: ${question}\nAnswer: ${answer}\nvalidate answer and say its correct or wrong with some explanation and nothing else, dont add any other information in the response\nAssistant: \n\n`
      );
      console.log(answerResponse);
      return new Response(
        JSON.stringify({
          completion: answerResponse,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    } catch (e) {
      console.error(e);
      return new Response(
        JSON.stringify({
          error: "Failed to validate the answer.",
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
