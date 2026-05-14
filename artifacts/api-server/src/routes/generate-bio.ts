import { Router } from "express";

const router = Router();

router.post("/generate-bio", async (req: any, res: any) => {
  const { role, name, village, profession, subjects, experience } = req.body as {
    role: string;
    name: string;
    village: string;
    profession?: string;
    subjects?: string;
    experience?: string;
  };

  const baseUrl = process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"];
  const apiKey = process.env["AI_INTEGRATIONS_OPENAI_API_KEY"];

  if (!baseUrl || !apiKey) {
    // Return a mock bio if AI is not configured, instead of 503 error
    const mockBio = role === "guru"
      ? `I am ${name || "a mentor"} from ${village || "Karnataka"}. I have ${experience || "many years"} of experience teaching ${subjects || "various subjects"}. I am passionate about helping rural students through NimmaGuru.`
      : `I am ${name || "a student"} from ${village || "Karnataka"}. I am excited to learn ${subjects || "various subjects"} and grow my knowledge with my mentors.`;
    
    res.json({ bio: mockBio });
    return;
  }

  const prompt =
    role === "guru"
      ? `Write a compelling 2-3 sentence professional bio for ${name || "a mentor"}, a ${profession || "retired professional"} from ${village || "Karnataka"} with ${experience || "many years"} of experience who teaches ${subjects || "various subjects"}. Write in first person. Keep it warm, humble, and inspiring for a rural mentorship platform called NimmaGuru.`
      : `Write a brief 2-sentence bio for a student named ${name || "a student"} from ${village || "Karnataka"} who is interested in learning ${subjects || "various subjects"}. Write in first person. Keep it warm, enthusiastic, and hopeful.`;

  try {
    const response: any = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        max_completion_tokens: 150,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      req.log.error({ status: response.status }, "AI API error");
      res.status(502).json({ error: "AI service error" });
      return;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const bio = data.choices?.[0]?.message?.content?.trim() ?? "";
    res.json({ bio });
  } catch (err) {
    req.log.error({ err }, "generate-bio error");
    res.status(500).json({ error: "Failed to generate bio" });
  }
});

export default router;
