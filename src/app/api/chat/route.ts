import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildBusinessContext } from "@/lib/business-context";
import { resolveDataset } from "@/lib/datasets";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  messages?: ChatMessage[];
  role?: string;
};

const systemPrompt = `너는 "김비서"라는 이름의 AI 백오피스 보조야. 
아래 비즈니스 데이터셋을 이해하고 세무, 재무, HR 관련 질문에 답변해야 해. 
가능하면 숫자, 날짜, 지표를 명확하게 제시하고 사장님이 바로 실행할 수 있는 제안도 덧붙여줘. 
반드시 사실 관계는 데이터셋 기반으로 유지하고, 모르면 추측 대신 다음 행동을 제안해.`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "messages 배열이 필요합니다." },
        { status: 400 },
      );
    }

    const { dataset, displayName, role } = resolveDataset(body.role);
    const businessContext = buildBusinessContext(dataset);

    const fallbackAnswer = (userContent: string) =>
      `아직 OpenAI API 키가 설정되지 않아 로컬 데이터로만 안내드려요.

대상: ${displayName}
요청: ${userContent}

핵심 데이터:
${businessContext}

추가 분석이 필요하면 OpenAI 키를 .env.local 에 설정하고 서버를 재시작해 주세요.`;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const lastUserMessage = [...body.messages]
        .reverse()
        .find((msg) => msg.role === "user");
      return NextResponse.json({
        message: fallbackAnswer(lastUserMessage?.content ?? "요청 없음"),
        source: "fallback",
        role,
      });
    }

    const client = new OpenAI({ apiKey });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\n대상 사업장: ${displayName}\n\n데이터셋:\n${businessContext}`,
        },
        ...body.messages,
      ],
      temperature: 0.2,
    });

    const completion = response.choices[0]?.message?.content;

    if (!completion) {
      return NextResponse.json(
        { error: "응답을 생성하지 못했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: completion,
      source: "openai",
      role,
    });
  } catch (error) {
    console.error("Chat route error", error);
    return NextResponse.json(
      { error: "서버 에러가 발생했습니다." },
      { status: 500 },
    );
  }
}
