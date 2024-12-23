import { ChatList } from '@/components/ChatList';
import { MainContainer } from '@/components/MainContainer';

const page = () => {
  return (
    <MainContainer className="mx-auto py-4">
      <ChatList />
    </MainContainer>
  );
};
export default page;
