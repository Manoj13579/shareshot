// hooks/useChatListener.ts
import { useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import type { ProfileResponse } from '@/types/types';


interface UseChatListenerProps {
  currentUserId: string;
  selectedUser: ProfileResponse;
  setMessages: (messages: any[]) => void;
}

export const useChatListener = ({currentUserId,selectedUser,setMessages}: UseChatListenerProps) => {
  useEffect(() => {
    if (!selectedUser) return;

    const chatId = [currentUserId, selectedUser.userId].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return () => unsub();
  }, [selectedUser, currentUserId, setMessages]);
};
