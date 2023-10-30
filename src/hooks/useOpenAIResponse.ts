import OpenAI from "openai";
import { useEffect, useState } from "react";
import config from "../config";
import { systemPrompt } from "../constants";
import { Pokemon } from "../types";

const useOpenAIResponse = (
  turnNumber: number,
  you: Pokemon,
  enemy: Pokemon
) => {
  const [enemyMove, setEnemyMove] = useState<string | null>(null);
  useEffect(() => {
    const openai = new OpenAI({
      apiKey: config.openAISecret,
      dangerouslyAllowBrowser: true,
    });

    (async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt(you.name, enemy.name, enemy.moveNames),
          },
          {
            role: "user",
            content: `Turn ${turnNumber} ${you.name} 100% ${enemy.name} 100%`,
          },
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      if (response) setEnemyMove(response.choices[0].message.content);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnNumber]);
  return enemyMove;
};

export default useOpenAIResponse;
