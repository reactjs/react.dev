export interface Message {
    role: "user" | "assistant" | "system";
    content: string;
    content_ref_list?: ContentRefList;
}

export type MessageList = Message[];

export type ContentRefList = ContentRef[];

export interface ContentRef {
    ref_desc: string;
    ref_link: string;
}


export interface Thread {
    thread_id: string;
    message_list: MessageList;
}
