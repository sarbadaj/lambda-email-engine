/*
 * This is a utility file to help invoke and debug the lambda function. It is not included as part of the
 * bundle upload to Lambda.
 *
 * Credentials:
 *  The AWS SDK for Node.js will look for credentials first in the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and then
 *  fall back to the shared credentials file. For further information about credentials read the AWS SDK for Node.js documentation
 *  http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Credentials_from_the_Shared_Credentials_File_____aws_credentials_
 *
 */

// Set the region to the locations of the S3 buckets
process.env['AWS_REGION'] = 'us-east-1';

var fs = require('fs');
var app = require('./BuildEmailTemplate/index');

// Load the sample event to be passed to Lambda. The _sampleEvent.json file can be modified to match
// what you want Lambda to process on.

var context = {};
context.done = function () {
  console.log("Lambda function complete");
}
context.succeed = function (msg) {
  console.log("Lambda function success: " + msg);
}
context.fail = function (msg) {
  console.log("Lambda function failed: " + msg);
}

function singleEmail () {
  "use strict";
  var event = JSON.parse(fs.readFileSync('./_sample.json', 'utf8').trim());
  app.handler(event, context);
}

function bySnsTopicList () {
  "use strict";
  var event = JSON.parse(fs.readFileSync('./_sns_sample.json', 'utf8').trim());
  app.handler(event, context);
}
function bySnsWithEmailRecipient () {
  "use strict";
  var event = JSON.parse(fs.readFileSync('./_sns_sample_email_recipient.json', 'utf8').trim());
  app.handler(event, context);
}

function bySqsQueue () {
  "use strict";
  var event = JSON.parse(fs.readFileSync('./_sns_sample.json', 'utf8').trim());
  app.handler(event, context);
}

singleEmail();
// bySnsTopicList();
bySnsWithEmailRecipient();
// bySqsQueue();//
