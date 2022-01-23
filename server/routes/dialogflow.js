const express = require("express");
const router = express.Router();
const structjson = require("./structjson.js");
const dialogflow = require("dialogflow");
const uuid = require("uuid");

const config = require("../config/keys");

const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

// Create a new session
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

//
// text query route
//
router.post("/textQuery", async (req, res) => {
  // 클라이언트에서 받은 정보를 dialogflow에 보냄

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        // 사용자가 입력한 문구가 들어감
        text: req.body.text,
        // The language used by the client (en-US)
        languageCode: languageCode,
      },
    },
  };

  // Send request and log result
  // responses에 session정보와 text등의 정보가 가공되어 들어감
  const responses = await sessionClient.detectIntent(request);
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);

  res.send(result);
});

//
// event query route
//
router.post("/eventQuery", async (req, res) => {
  // 이벤트 정보를 dialogflow에 보냄

  // The event query request.
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        // The query to send to the dialogflow agent
        // 발생한 이벤트가 들어감
        name: req.body.event,
        // The language used by the client (en-US)
        languageCode: languageCode,
      },
    },
  };

  // Send request and log result
  // responses에 session정보와 text등의 정보가 가공되어 들어감
  const responses = await sessionClient.detectIntent(request);
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);

  res.send(result);
});

module.exports = router;
