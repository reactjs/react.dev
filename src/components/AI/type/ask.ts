export interface Message {
    role: "user" | "assistant";
    content: string;
    content_ref_list?: ContentRefList;
}

export type MessageList = Message[];

export type ContentRefList = ContentRef[];

export interface ContentRef {
    ref_desc: string;
    ref_link: string;
}
