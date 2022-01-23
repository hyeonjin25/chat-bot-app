import Axios from "axios";
import React from "react";

function ChatbotScreen() {
  const textQuery = async (text) => {
    // 1. 사용자가 입력한 메세지 처리
    let conversation = {
      who: "user",
      content: {
        text: {
          text: text,
        },
      },
    };

    const textQueryVariables = {
      text,
    };
    // 2. 챗봇이 보낸 메세지 처리
    try {
      // textQuery Rout에 메세지 보내기
      const response = await Axios.post(
        "api/dialogflow/textQuery",
        textQueryVariables
      );
      const content = response.data.fulfillmentMessages[0];

      conversation = {
        who: "bot",
        content: content,
      };
      console.log(conversation);
    } catch (err) {
      conversation = {
        who: "bot",
        content: {
          text: {
            text: " Error just occured, please check the problem",
          },
        },
      };
      console.log(conversation);
    }
  };

  const KeyPressHandler = (e) => {
    if (e.key == "Enter") {
      if (!e.target.value) {
        // 사용자가 아무것도 입력하지 않았을 때
        return alert("you need to type something first");
      }
      // 사용자가 입력한 값을 서버로 보내기
      textQuery(e.target.value);

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
