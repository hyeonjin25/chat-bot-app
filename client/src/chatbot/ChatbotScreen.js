import React from "react";

function ChatbotScreen() {
  const KeyPressHandler = (e) => {
    if (e.key == "Enter") {
      if (!e.target.value) {
        // 사용자가 아무것도 입력하지 않았을 때
        return alert("you need to type something first");
      }
      // 사용자가 입력한 값을 서버로 보내기

      e.target.value = "";
    }
  };

  return (
    <div
      style={{
        height: 700,
        width: 700,
        border: "3px solid black",
        borderRadius: "7px",
      }}
    >
      <div style={{ height: 644, width: "100%", overflow: "auto" }}></div>
      <input
        style={{
          margin: 0,
          width: "100%",
          height: 50,
          borderRadius: "4px",
          padding: "5px",
          fontsize: "1rem",
        }}
        placeholder='Send a message...'
        onKeyPress={KeyPressHandler}
        type='text'
      ></input>
    </div>
  );
}

export default ChatbotScreen;
