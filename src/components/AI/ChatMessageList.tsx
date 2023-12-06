import { ChatMessage } from "./ChatMessage";
import { MessageList } from "./type/ask";

export interface Props {
    messageList: MessageList
}

export function ChatMessageList({ messageList }: Props) {
    console.log("messageList:", messageList);
    return <div className=" overflow-auto h-5/6">
        {messageList.map((message, index) => {
            return <ChatMessage message={message} messageIndex={index} />
        })}
    </div>
}