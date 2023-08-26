
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'coursepolicy',
  applicationName: 'course-policy-ai',
  appUid: 'undefined',
  orgUid: '377fc8ef-290a-42da-9476-c33fad9f365e',
  deploymentUid: '59631a44-af7d-49af-b649-4bbedaec4c25',
  serviceName: 'core',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'staging',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '6.2.3',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'core-staging-updatePolicy', timeout: 6 };

try {
  const userHandler = require('./dist/src/http/update-policy/index.js');
  module.exports.handler = serverlessSDK.handler(userHandler.handler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}