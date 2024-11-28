import { Chat } from '@/components/Chat/Chat';
import { MainContainer } from '@/components/MainContainer';
import type { FC } from 'react';

interface ChatPageProps {
  params: {
    id: string;
  };
}

const ChatPage: FC<ChatPageProps> = async ({ params: { id } }) => {
  // const response = await fetch(`/api/chat/${id}`);
  // const data = await response.json();
  return (
    <MainContainer className="mx-auto h-[calc(100vh-53px)]">
      <Chat
        id={id}
        // initialMessages={data.messages}
      />
    </MainContainer>
  );
};

export default ChatPage;
