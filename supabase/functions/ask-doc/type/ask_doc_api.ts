import { MessageList } from "./ask.ts";

export interface AskRequest {
    query: string;
    threadId: string;
}

export interface AskResponse {
    messageList: MessageList;
}