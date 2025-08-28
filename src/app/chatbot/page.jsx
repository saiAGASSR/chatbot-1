// import ChatClient from '@/components/ChatBotUI/ChatClient';
import ChatClient from '@/components/ChatBotUI/ChatClient';
import LoadAnimation from '@/components/ChatBotUI/LoadAnimation';
import { Loading } from '@/components/ChatBotUI/Loading';
import { lazy, Suspense,  } from 'react';



export default function Home() {

  return (
    <Suspense 
      fallback = {<Loading />}>
      <ChatClient />
    </Suspense>
  );
}
