var aws = require("aws-sdk");
exports.send = function (event, context) {
  "use strict";
  if(event.hasOwnProperty('recipient') &&
    event.hasOwnProperty('subject')
  )
  var ses = new aws.SES({region: 'us-west-2'});
  var params = {
    Destination: {
      ToAddresses: [
        event.recipient
      ]
    },
    Message: {
      Subject: {
        Data: event.templateParams.subject,
        Charset: 'UTF-8'
      }
    },
    Source: event.templateParams.fromAddress,
    ReplyToAddresses: [
      event.templateParams.replyToAddress
    ]
  };

  var fileExtension = event.templateParams.templateKey.split(".").pop();
  if (fileExtension.toLowerCase() == 'html') { //email template support
    params.Message.Body = {
      Html: {
        Data: event.compiledTemplate,
        Charset: 'UTF-8'
      }
    };
  } else if (fileExtension.toLowerCase() == 'txt') { //sms support
    params.Message.Body = {
      Text: {
        Data: event.templateParams.message,
        Charset: 'UTF-8'
      }
    };
  } else {
    context.fail('Internal Error: Unrecognized template file extension: ' + fileExtension);
    return;
  }

  // Send the email
  return ses.sendEmail(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      context.fail('Internal Error: The email could not be sent.' + err);
    } else {
      console.log(data);           // successful response
      context.succeed('The email was successfully sent to ' + event.recipent);
    }
  });
}
