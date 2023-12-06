import { AskRequest } from "./type/ask_doc_api";

const ask_doc_api = "http://localhost:54321/functions/v1/ask-doc";


export async function requestAskApiStream(request: AskRequest, callback: (chunk: any) => void, onError: (errorMsg: string) => void) {
    const url = ask_doc_api;
    const headers = {
        "Content-Type": "text/event-stream"
    }
    const body = JSON.stringify(request);
    try {
        const response = await fetch(url, { method: "POST", headers, body })
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let message: any = { content: "" }
        while (true) {
            const res = await reader?.read();
            const done = res?.done;
            const value = decoder.decode(res?.value);
            if (done) break;
            const text_arr = value.split("\r\n");
            console.log("textarr is:", text_arr);
            for (const index in text_arr) {
                const text = text_arr[index];
                if (text && text.length > 0) {
                    const json = JSON.parse(text);
                    if (json.type === 'role') {
                        message.role = json.role;
                    }

                    if (json.type === 'content') {
                        message.content = message.content + json.content;
                    }

                    if (json.type === 'ref_list') {
                        message.content_ref_list = json.content_ref_list;
                    }

                    if (json.type === 'cache') {
                        message = json.cache_message;
                    }
                }
            }
            console.log("message is", message);
            callback(message);
        }
    } catch (error) {
        onError?.("server error, please try again later.");
    }

}