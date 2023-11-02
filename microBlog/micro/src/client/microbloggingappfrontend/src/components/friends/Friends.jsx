import React, { useRef } from "react";
import "./friends.css";
import FriendsCard from "../../components/cards/friendsCard/FriendsCard";
import RequestCard from "../../components/cards/requestCard/RequestCard";
import ChatBar from "../../components/chat/chatBar/ChatBar";

const Friends = () => {
  const friendsCardRef = useRef();
  const fetchFriends = () => {
    friendsCardRef.current.fetchFriends();
  };
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 2, marginTop: "-.4rem" }}>
        <RequestCard fetchFriends={fetchFriends} />
        <FriendsCard ref={friendsCardRef} />
      </div>
      <ChatBar style={{ marginTop: "1.5rem" }} />
    </div>
  );
};

export default Friends;
