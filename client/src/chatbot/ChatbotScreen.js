import Axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveMessage } from "../_actions/message_actions";
import Message from "./Section/Message";
import CardComponent from "./Section/Card";
import { List, Icon, Avatar } from "antd";

function ChatbotScreen() {
  const dispacth = useDispatch();
  const messagesFromRedux = useSelector((state) => state.message.messages);

  useEffect(() => {
    eventQuery("welcomeToMyWebsite");
  }, []);

  // text query
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

    // 사용자가 입력한 메세지 리덕스에 저장
    dispacth(saveMessage(conversation));

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
      // 받은 메세지 전부 가공
      for (let content of response.data.fulfillmentMessages) {
        conversation = {
          who: "bot",
          content: content,
        };

        // 챗봇으로 부터 받은 메세지 리덕스에 저장
        dispacth(saveMessage(conversation));
        console.log(conversation);
      }
    } catch (err) {
      conversation = {
        who: "bot",
        content: {
          text: {
            text: " Error just occured, please check the problem",
          },
        },
      };
      // 챗봇으로 부터 받은 메세지 리덕스에 저장
      dispacth(saveMessage(conversation));
    }
  };

  // event query
  const eventQuery = async (event) => {
    const eventQueryVariables = {
      event,
    };

    // dialogflow로부터 받은 메세지 처리
    try {
      // textQuery Rout에 메세지 보내기
      const response = await Axios.post(
        "api/dialogflow/eventQuery",
        eventQueryVariables
      );

      // 받은 메세지 전부 가공
      for (let content of response.data.fulfillmentMessages) {
        let conversation = {
          who: "bot",
          content: content,
        };

        // 챗봇으로 부터 받은 메세지 리덕스에 저장
        dispacth(saveMessage(conversation));
      }
    } catch (err) {
      let conversation = {
        who: "bot",
        content: {
          text: {
            text: " Error just occured, please check the problem",
          },
        },
      };
      // 챗봇으로 부터 받은 메세지 리덕스에 저장
      dispacth(saveMessage(conversation));
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

  const renderCards = (cards) => {
    return cards.map((card, i) => (
      <CardComponent key={i} cardInfo={card.structValue} />
    ));
  };

  const renderOneMessage = (message, i) => {
    // 다른 종류의 메세지를 위한 조건문
    // normal text
    if (message.content && message.content.text && message.content.text.text) {
      return (
        <Message key={i} who={message.who} text={message.content.text.text} />
      );
    }
    // card message
    else if (
      message.content &&
      message.content.payload &&
      message.content.payload.fields.card
    ) {
      // 챗봇과 사람 아이콘 달라지도록 만들기
      const AvatarSrc =
        message.who === "bot" ? <Icon type='robot' /> : <Icon type='smile' />;
      return (
        <div>
          <List.Item key={message.i} style={{ padding: "1rem" }}>
            <List.Item.Meta
              avatar={<Avatar icon={AvatarSrc} />}
              title={message.who}
              description={renderCards(
                message.content.payload.fields.card.listValue.values
              )}
            />
          </List.Item>
        </div>
      );
    }
  };

  const renderMessage = (returnedMessages) => {
    if (returnedMessages) {
      return returnedMessages.map((message, i) => {
        return renderOneMessage(message, i);
      });
    } else {
      return null;
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
      <div style={{ height: 644, width: "100%", overflow: "auto" }}>
        {renderMessage(messagesFromRedux)}
      </div>
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
