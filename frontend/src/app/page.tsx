// import { MainContainer } from '@/components/MainContainer';
import { redirect } from 'next/navigation';

const Home = () => {
  redirect('/signin');
  // return (
  //   <div className="flex justify-center flex-1 h-full">
  //     <MainContainer className="pt-20">
  //       <h1 className="text-6xl text-center text-foreground">
  //         Инструмент для построения и интеграции базы знаний с ИИ помощником
  //       </h1>
  //     </MainContainer>
  //   </div>
  // );
};

export default Home;
