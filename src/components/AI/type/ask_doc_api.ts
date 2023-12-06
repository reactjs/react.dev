import { MessageList } from "./ask";

export interface AskRequest {
    query: string;
    threadId: number;
}

export interface AskResponse {
    messageList: MessageList;
}