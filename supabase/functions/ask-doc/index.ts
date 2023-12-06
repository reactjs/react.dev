// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { askDoc } from "./ask_doc.ts";
import { AskRequest } from "./type/ask_doc_api.ts";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}


Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  console.log("request start")

  const { query, threadId }: AskRequest = await req.json()
  console.log("params parse done")


  const messageStream = await askDoc({ query, threadId: threadId });

  if (messageStream instanceof ReadableStream) {
    const headers = { "Content-Type": "text/event-stream", ...corsHeaders }
    const response = new Response(
      messageStream,
      { headers: headers },
    )
    return response;
  } else {
    const body = JSON.stringify({ messageStream });
    const headers = { "Content-Type": "application/json", ...corsHeaders }
    const response = new Response(
      body,
      { headers: headers },
    )
    return response;

  }
})

// To invoke:
// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
