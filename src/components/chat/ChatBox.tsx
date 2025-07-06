import type { UserProfile } from '@/types/types';
import avatar from '@/assets/images/avatar.png';
import { useState } from 'react';
import { formatDateTime } from '@/lib/formatDateTime';


interface Props {
  messages: any[];
  onSend: (text: string) => void;
  currentUserId?: string;
  otherUser: UserProfile;
  isOnline: boolean;
}

const ChatBox = ({ messages, onSend, currentUserId, otherUser, isOnline }: Props) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2">
  <div className="relative">
    <img src={otherUser.photoURL || avatar} alt="profile" className="w-8 h-8 rounded-full" />
    {isOnline && (
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
    )}
  </div>
  <div>
    <h2 className="font-semibold">{otherUser.displayName}</h2>
    <p className="text-sm text-gray-500">{isOnline ? 'Online' : 'Offline'}</p>
  </div>
</div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
  {messages.map((msg, idx) => (
    <div key={idx} className="space-y-1">
      <div className="text-center text-xs text-gray-500">
        {formatDateTime(msg.timestamp)}
      </div>
      <div
        className={`max-w-[75%] p-2 rounded-lg text-sm ${
          msg.senderId === currentUserId
            ? 'bg-blue-500 text-white ml-auto'
            : 'bg-gray-200 text-black'
        }`}
      >
        {msg.text}
      </div>
    </div>
  ))}
</div>


      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
export default ChatBox;