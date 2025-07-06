import { useEffect, useState } from 'react';
import { useUserAuth } from '@/context/userAuthContext';
import { db } from '@/firebaseConfig';
import {
  collection,
  query,
  onSnapshot,
  doc,
  orderBy,
  addDoc,
  serverTimestamp,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import ChatBox from './ChatBox';
import type { ProfileResponse, UserProfile } from '@/types/types';
import { getAllUsers, updateLastSeen } from '@/repository/user.service';
import avatar from "@/assets/images/avatar.png";
import { useNavigate } from 'react-router';


const DirectMessage = () => {
  const { user } = useUserAuth();
  const [suggestedUser, setSuggestedUser] = useState<ProfileResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
const navigate = useNavigate();
  console.log('Direct message component rendered');
  console.log('selected user', selectedUser);
  

const getSuggestedUsers = async (userId: string) => {
    const response = (await getAllUsers(userId)) || [];
    setSuggestedUser(response);
  };

  useEffect(() => {
    if (user?.uid != null) {
      getSuggestedUsers(user.uid);
    }
  }, []);

  /* workflow
  3-onSnapshot callback below is triggered.
  useEffect runs when selectedUser changes. This sets up the onSnapshot listener once or makes onSnapshot listener active  for the selected user’s chat. onSnapshot() subscribes to changes in the Firestore collection (chats/{chatId}/messages).It does not rerun useEffect.Instead, it just keeps listening silently in the background. useEffect runs once when selectedUser changes or user selectes another user to send message. Think of onSnapshot like a live socket connection to one Firestore query.
It’s not created every time something changes in the database. It Starts once per effect run.Watches for updates.Triggers the callback when data changes.Ends when cleaned up (e.g. selecting a different chat user).


 useEffect Re-runs Only When:
The selectedUser changes (e.g., user clicks a different user). The logged-in user?.uid changes (e.g., login/logout).
When that happens:
The old onSnapshot listener is unsubscribed (cleaned up).
A new one is registered for the new chat context.

4- onSnapshot callback is triggered
const unsub = onSnapshot(q, (snapshot) => ...
This callback is triggered automatically when:
A message is addedA message is updated or deleted
It fetches all messages from the collection, sorted by timestamp.

5- setMessages() updates local state
The messages state is updated with the latest list of messages.
It shows:
Old messages already saved in the database.
New messages as soon as they’re added (real-time/live updates).
The query sorts them by timestamp: orderBy('timestamp').

6️- The ChatBox component re-renders
It receives the new messages prop and displays them in order.
  */
  
  useEffect(() => {
    if (!selectedUser) return;

    const chatId = [user?.uid, selectedUser.userId].sort().join('_');
    // fetch messages of logged in user and selected user
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return () => unsub();
  }, [selectedUser, user?.uid]);


  /* workflow-
  1- User types a message and clicks "Send", ChatBox calls handleSend(text) below.
  2- handleSend runs
   It builds a chatId based on both users' IDs.Checks if the Firestore chat document (chats/{chatId}) exists.If not, creates it using setDoc()Then it adds the new message to the messages subcollection. await addDoc below  triggers Firestore’s real-time listener (onSnapshot) automatically coz when new message is added, Firestore detects the new messageFirestore emits a real-time update to all clients listening to chats/{chatId}/messages collection.
  */
 
  const handleSend = async (text: string) => {
    if (!selectedUser || !text.trim()) return;
    /* whether userA logs in or userB logs in chatId will be same due to sort() which will sort array in alphabetical/numerical order and join will convert array to string with _ between two strings . if userA initiates chat then user.id will be userA's id and selectedUser.id will be userB's id. if userB initiates chat then user.id will be userB's id and selectedUser.id will be userA's id. if this technique not used then although same users are chatting but chatId will be different. */
    const chatId = [user?.uid, selectedUser.userId].sort().join('_');

       
    /* setDoc is used for creating document with custom id.here used to save users: [user?.uid, selectedUser.userId ] in chats collection if no previous chat between users exists .here chatId is custom id for document in chats collection. which is used for getting chat by users in  const messagesRef = collection(db, 'chats', chatId, 'messages');. 
    Although   users: [user?.uid, selectedUser.userId] is saved data in chats collection right now but it is not used anywhere. You plan to query all chat threads involving a user later (e.g., showing a chat list This lets you fetch all chat threads where the current user is a participanfor the logged-in user), then the users field is very useful.You may want to show all chats a user is part of. other purposes too. common in chat apps. though if you want can set empty document by await setDoc(chatDocRef, {});*/
    const chatDocRef = doc(db, 'chats', chatId);
    const chatDocSnap = await getDoc(chatDocRef);
    if (!chatDocSnap.exists()) {
      await setDoc(chatDocRef, {
        users: [user?.uid, selectedUser.userId],
      });
    }

    // Add message to the messages subcollection of above chats collection
    await addDoc(collection(chatDocRef, 'messages'), {
      text,
      senderId: user?.uid,
      timestamp: serverTimestamp(),
    });
    
  };

// show user's online
/* Update `lastSeen` every 1 minute. use this wherever you need to make sure user online. is done in main page or authContext.jsx for whole app. in this project we are using this in this page where user will come after clicking direct. */
  useEffect(() => {
    if (user?.uid == null) return;
    let interval: NodeJS.Timeout;

      updateLastSeen(user.uid); // Immediately update if user is logged in
      /* setInterval runs every 1 minute after user logs in not immediately after user logs in. after every 1 minute updateLastSeen will be called which will update lastSeen field in users collection and below in  jsx const isOnline uses this time. fetch  getSuggestedUsers(user.uid); in setInterval  after updateLastSeen to get latest lastSeen of users so below jsx could compare n show all online users. here not used immediately after updateLastSeen up of setInterval coz we are fetching getSuggestedUsers up in this component already in first component render */
      interval = setInterval(() => {
        updateLastSeen(user.uid);
         getSuggestedUsers(user.uid);
      }, 60 * 1000);
      console.log("updateLastSeen useEffect called");
     
    return () => {
      clearInterval(interval);
    };
    
  }, [user?.uid]);

 /* sync selectedUser with latest suggestedUser so to get latest lastSeen to make selectedUser online. isOnline compared below n passed to ChatBox . */ 
useEffect(() => {
  if (!selectedUser) return;

  const updated = suggestedUser.find(u => u.userId === selectedUser.userId);
  if (updated) {
    setSelectedUser(updated); // update selectedUser with the latest lastSeen
  }
}, [suggestedUser]);


// to pass isOnline to jsx Chatbox of selectedUser for chatting.logic same as in isOnline in jsx below
let isOnline = false;
  if (selectedUser?.lastSeen?.toMillis) {
    isOnline = (Date.now() - selectedUser.lastSeen.toMillis()) < 2 * 60 * 1000;
    console.log("selectedUser isOnline", isOnline);
    
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-screen">
      {/* Sidebar */}
      <div className="col-span-1 border-r overflow-auto">
       <div onClick={() => navigate('/user-dashboard-layout')} className="font-bold px-4 mt-4 cursor-pointer">Dashboard </div>
        <h2 className="text-xl font-semibold p-4">Suggested Users </h2>
       <ul>
  {suggestedUser.map((u) => {
    /*when user logs  in  updateLastSeen(user.uid) runs runs after every 1 min by above useEffect setInterval. isOnline will have date that is upto 1 min old so below making difference in lastSeen and current date to greater than 2 minutes makes user online till user logs out. after 2 min user will be offline. isOnline will be true if the user was last seen within the last 2 minutes.*/
    const isOnline = u.lastSeen?.toMillis && (Date.now() - u.lastSeen.toMillis()) < 2 * 60 * 1000;

    return (
      <li
        key={u.userId}
        className={`p-3 cursor-pointer hover:bg-gray-100 ${selectedUser?.userId === u.userId ? 'bg-gray-100' : ''}`}
        onClick={() => setSelectedUser(u)}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <img src={u.photoURL || avatar} alt={u.displayName} className="w-8 h-8 rounded-full" />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <span>{u.displayName}</span>
        </div>
      </li>
    );
  })}
</ul>

      </div>

      {/* Chat Box */}
      <div className="col-span-3 flex flex-col">
        
           {selectedUser ? (
          <ChatBox
            messages={messages}
            onSend={handleSend}
            currentUserId={user?.uid}
            otherUser={selectedUser}
            isOnline={isOnline}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            Select a user to start chatting
          </div>
        )}
      </div>
      
    </div>
  );
}

export default DirectMessage
