const dynamodbLocal = require('dynamodb-localhost');
dynamodbLocal.install(() => {
  console.log('test:setup complete');
});
