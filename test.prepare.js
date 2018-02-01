import path from 'path';
import dotEnv from 'dotenv';
import dynamodbLocal from 'dynamodb-localhost';
import prepare from 'mocha-prepare';

prepare(async (done) => {
  dotEnv.config({
    path: path.resolve(process.cwd(), '.env.test'),
  });
  await dynamodbLocal.install();
  dynamodbLocal.start({ port: 8000 });
  done();
}, (done) => {
  dynamodbLocal.stop(8000);
  done();
});
