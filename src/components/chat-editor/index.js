import React from "react";
import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import "./style.css";

function ChatEditor({ pushMessage, setMessageInput, messageInput }) {
  return (
    <div className="footer">
      <form onSubmit={pushMessage}>
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 5 }}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onPressEnter={pushMessage}
        />
        <button className="footer__send-btn">
          <SendOutlined style={{ fontSize: "24px", color: "#08c" }} />
        </button>
      </form>
    </div>
  );
}

export default ChatEditor;
