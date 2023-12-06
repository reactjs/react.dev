import {useEffect, useRef, useState} from 'react';
import ReactModal from 'react-modal';
import {ChatInput} from './ChatInput';
import {ChatMessageList} from './ChatMessageList';
import {MessageList} from './type/ask';
import {requestAskApiStream} from './fetch_api';
import {AskRequest} from './type/ask_doc_api';

export function AIAskDialog() {
  const [isOpen, setOpen] = useState(false);

  // const fakeContentRefList: ContentRefList = [{ ref_desc: "this is a test ref.", ref_link: "https://www.google.com" },
  // { ref_desc: "this is a test ref.", ref_link: "https://www.google.com" },
  // { ref_desc: "this is a test ref.", ref_link: "https://www.google.com" }
  // ];
  // const fakeMessage: MessageList = [{ role: "user", content: "this is a test content from user." },

  // { role: "assistant", content: test, content_ref_list: fakeContentRefList }]

  const [messageList, setMessageList] = useState([] as MessageList);

  const [errorMsg, setErrorMsg] = useState('');

  const threadId = useRef<number | undefined>();

  async function onSend(message: string) {
    const newMessageList: MessageList = [
      ...messageList,
      {role: 'user', content: message},
    ];
    setMessageList(newMessageList);

    if (!threadId.current) {
      threadId.current = Math.floor(Math.random() * 10000);
    }

    console.log('thread is', threadId.current);

    await requestAskApiStream(
      {query: message, threadId: threadId.current} as AskRequest,
      (chunk) => {
        setMessageList([...newMessageList, chunk]);
      },
      (errorMsg: string) => {
        setErrorMsg(errorMsg);
        setMessageList(messageList);
        setTimeout(() => {
          setErrorMsg('');
        }, 2500);
      }
    );
  }

  function onClear() {
    setMessageList([]);
    threadId.current = undefined;
  }

  useEffect(() => {
    function onKeyDown(event: any) {
      if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (isOpen) {
          setOpen(false);
        } else {
          setOpen(true);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return function () {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);
  //@ts-ignore
  return (
    <ReactModal
      isOpen={isOpen}
      style={customStyle}
      shouldCloseOnEsc={true}
      onRequestClose={() => {
        setOpen(false);
      }}>
      <div className=" w-full  h-full  relative overflow-hidden">
        <ChatMessageList messageList={messageList} />

        <ChatInput onSend={onSend} onClear={onClear} />

        {errorMsg && (
          <div className=" text-xl text-red-500 absolute top-1/3 left-1/4 bg-slate-300 p-1">
            {' '}
            {errorMsg}{' '}
          </div>
        )}
      </div>
    </ReactModal>
  );
}

const customStyle = {
  content: {
    top: '5%',
    left: '25%',
    right: '25%',
    innerWidth: '80%',
    height: '80%',
    borderRadius: '12px',
  } as React.CSSProperties,
  overlay: {
    zIndex: 300,
  } as React.CSSProperties,
};
