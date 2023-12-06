
import { SupabaseClient, createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { OpenAI } from "https://esm.sh/openai@4.11.0"
import { encodingForModel } from "https://esm.sh/js-tiktoken@1.0.7";


console.log("excute import ");

import { ContentRefList, Message, MessageList } from "./type/ask.ts";
import { getAnwserQuestionPrompt, getGenQuestionPrompt } from "./prompt.ts";

export interface Params {
  query: string;
  threadId: string;
}

export async function askDoc({ query, threadId }: Params): Promise<MessageList | ReadableStream> {

  console.log("excute");

  if (!threadId) {
    const responseStream: ReadableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(JSON.stringify({ role: "system", content: "threadId is required" }) + "\r\n"));
        controller.close();
      }
    })
    return responseStream;
  }

  const { supabaseClient, openAIClient } = init();
  const enc = encodingForModel("gpt-3.5-turbo-0301");

  const userMessage: Message = { role: 'user', content: query };
  const userMessageTimestamp = Date.now();


  const newQuery = await genQuery(supabaseClient, openAIClient, query, threadId);

  const embeddingResponse = await openAIClient.embeddings.create({
    model: 'text-embedding-ada-002',
    input: newQuery,
  })

  const [{ embedding }] = embeddingResponse.data;
  console.log("this embedding is", embedding);


  const { error: matchCacheError, data: askCaches } = await supabaseClient
    .rpc('match_question', {
      embedding: embedding,
      match_threshold: 0.95,
    })
    .select('ask_anwser')
    .limit(1)
  console.log("cache match is:", JSON.stringify(askCaches), "error is", matchCacheError);


  let answer_message: Message;

  if (askCaches && askCaches.length > 0) {
    const askCache = askCaches[0]
    console.log("hit cahce");
    console.log("the askCache is:", askCache);
    answer_message = (askCache as any).ask_anwser;
  } else {
    const { error: matchError, data: pageSections } = await supabaseClient
      .rpc('match_page_sections', {
        embedding: embedding,
        match_threshold: 0.78,
        min_content_length: 50,
      })
      .select('content,page!inner(path), page_id, heading')
      .limit(10)

    console.debug("query error is:", JSON.stringify(matchError));
    console.debug("query section is:", pageSections);

    let tokenCount = 0
    let contextText = ''

    let refList: ContentRefList = [];

    for (let i = 0; i < pageSections!.length; i++) {
      const pageSection = pageSections![i]
      const content = pageSection.content
      const encoded = enc.encode(content)
      tokenCount += encoded.length

      if (tokenCount >= 3000) {
        break
      }

      refList.push({ ref_desc: (pageSection as any).page.path, ref_link: ((pageSection as any).page.path as string).split('src/content')[1] });
      contextText += `${content.trim()}\n---\n`
    }

    refList = removeDuplicate(refList);
    const messages: any[] = getAnwserQuestionPrompt(contextText, newQuery);

    const completion = await openAIClient.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo-0301",
      temperature: 0,
      stream: true
    });

    const textEncoder = new TextEncoder();
    let answerContent = "";

    const responseStream: ReadableStream = new ReadableStream({
      async start(controller) {
        let isStartSend = false;
        controller.enqueue(textEncoder.encode(JSON.stringify({ role: "assistant", type: "role" }) + "\r\n"))
        for await (const chunk of completion) {
          if (isStartSend) {
            const curContent = chunk.choices[0].delta.content;
            if (curContent) {
              controller.enqueue(textEncoder.encode(JSON.stringify({ content: chunk.choices[0].delta.content, type: "content" }) + "\r\n"));
              answerContent += chunk.choices[0].delta.content;
            }
          }
          if (chunk.choices[0].delta.role === "assistant") {
            isStartSend = true;
          }
        }
        controller.enqueue(textEncoder.encode(JSON.stringify({ content_ref_list: refList, type: "ref_list" }) + "\r\n"));
        controller.close();

        const assistantMessage: Message = { role: 'assistant', content: answerContent, content_ref_list: refList };
        const assistantMessageTimestamp = Date.now();
        console.log("upsert thread");
        await upsertThread(supabaseClient, [{ thread_id: threadId, message: userMessage, message_time: userMessageTimestamp },
        { thread_id: threadId, message: assistantMessage, message_time: assistantMessageTimestamp }]);

        const { error: upsertQuestionCacheError } = await supabaseClient
          .from('ask_cache')
          .upsert(
            {
              ask_embedding: embedding,
              ask_anwser: assistantMessage
            });
        if (upsertQuestionCacheError) {
          console.log("histroy update error");
          console.error(upsertQuestionCacheError);
        }
      }
    })
    return responseStream;
  }
  const responseStream: ReadableStream = new ReadableStream({
    async start(controller) {
      const textEncoder = new TextEncoder();
      controller.enqueue(textEncoder.encode(JSON.stringify({ cache_message: answer_message, type: 'cache' }) + "\r\n"));
      controller.close();
      const assistantMessageTimestamp = Date.now();
      await upsertThread(supabaseClient, [{ thread_id: threadId, message: userMessage, message_time: userMessageTimestamp },
      { thread_id: threadId, message: answer_message, message_time: assistantMessageTimestamp }]);
    }
  })
  return responseStream;
}


function init() {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") as string,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )

  const openaiKey = Deno.env.get("OPENAI_KEY");
  console.log("openAiKey", openaiKey);

  const openAIClient = new OpenAI({ apiKey: openaiKey });
  return { supabaseClient, openAIClient }
}

async function genQuery(supabaseClient: SupabaseClient, openAIClient: OpenAI, query: string, threadId: string) {
  //query thread
  const { data: threadData, error: queryChatThreadError } = await supabaseClient
    .rpc('match_chat_thread', {
      thread_id: threadId
    })

  if (queryChatThreadError) {
    console.error(queryChatThreadError);
  }

  const historyMessageList: MessageList = [];

  for (const indx in threadData) {
    historyMessageList.push((threadData[indx] as any).message);
  }

  let newQuery = query;

  console.log("historyMessageList is:", JSON.stringify(historyMessageList));


  if (historyMessageList && historyMessageList.length > 0) {
    const message: any[] = [{ role: "user", content: getGenQuestionPrompt(historyMessageList, query) }];

    const completion = await openAIClient.chat.completions.create({
      messages: message,
      model: "gpt-3.5-turbo-0301",
      temperature: 0.3,
    });
    const res = completion.choices[0].message.content;
    if (res) {
      newQuery = res;
      console.log("new query is", newQuery);
    }
  }
  return newQuery;
}

interface ChatThreadItem {
  thread_id: string,
  message: Message,
  message_time: number
}

async function upsertThread(supabaseClient: SupabaseClient, chatThreadItems: ChatThreadItem[]) {
  console.log("upsert thread");
  const { error: upsertThreadError, data: _ } = await supabaseClient.from('chat_thread').upsert(chatThreadItems);

  // update   
  if (upsertThreadError) {
    console.log("thread update error");
    console.error(upsertThreadError);
  }
}


function removeDuplicate(arr: ContentRefList) {
  let len = arr.length
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (arr[i].ref_link === arr[j].ref_link) {
        arr.splice(j, 1);
        len--;
        j--;
      }
    }
  }
  return arr
}