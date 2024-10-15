import { google } from 'googleapis';
import https from 'https';

const PROJECT_ID = '<YOUR-PROJECT-ID>';
const HOST = 'fcm.googleapis.com';
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

export async function getAccessToken() {
  const key = await import('../../../../borajogarapp-7ea50-firebase-adminsdk-b98z2-b69936fc63.json', {
    assert: { type: "json" }
  });

  const jwtClient = new google.auth.JWT(
    key.default.client_email,
    null,
    key.default.private_key,
    SCOPES,
    null
  );

  return new Promise((resolve, reject) => {
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

/**
 * Send HTTP request to FCM with given message.
 */
function sendFcmMessage(fcmMessage) {
  getAccessToken().then((accessToken) => {
    const options = {
      hostname: HOST,
      path: PATH,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    };

    const request = https.request(options, (resp) => {
      resp.setEncoding('utf8');
      resp.on('data', (data) => {
        console.log('Message sent to Firebase for delivery, response:');
        console.log(data);
      });
    });

    request.on('error', (err) => {
      console.log('Unable to send message to Firebase');
      console.log(err);
    });

    request.write(JSON.stringify(fcmMessage));
    request.end();
  });
}

/**
 * Construct a JSON object that will be used to customize
 * the messages sent to iOS and Android devices.
 */
function buildOverrideMessage() {
  const fcmMessage = buildCommonMessage();
  const apnsOverride = {
    'payload': {
      'aps': {
        'badge': 1
      }
    },
    'headers': {
      'apns-priority': '10'
    }
  };

  const androidOverride = {
    'notification': {
      'click_action': 'android.intent.action.MAIN'
    }
  };

  fcmMessage['message']['android'] = androidOverride;
  fcmMessage['message']['apns'] = apnsOverride;

  return fcmMessage;
}

/**
 * Construct a JSON object that will be used to define the
 * common parts of a notification message that will be sent
 * to any app instance subscribed to the news topic.
 */
function buildCommonMessage() {
  return {
    'message': {
      'topic': 'news',
      'notification': {
        'title': 'FCM Notification',
        'body': 'Notification from FCM'
      }
    }
  };
}

const message = process.argv[2];
if (message && message === 'common-message') {
  const commonMessage = buildCommonMessage();
  console.log('FCM request body for message using common notification object:');
  console.log(JSON.stringify(commonMessage, null, 2));
  sendFcmMessage(buildCommonMessage());
} else if (message && message === 'override-message') {
  const overrideMessage = buildOverrideMessage();
  console.log('FCM request body for override message:');
  console.log(JSON.stringify(overrideMessage, null, 2));
  sendFcmMessage(buildOverrideMessage());
} else {
  console.log('Invalid command. Please use one of the following:\n'
      + 'node index.js common-message\n'
      + 'node index.js override-message');
}
