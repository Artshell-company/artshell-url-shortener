import path from 'path';
import dotEnv from 'dotenv';
import dynamodbLocal from 'dynamodb-localhost';
import prepare from 'mocha-prepare';

prepare((done) => {
  dotEnv.config({
    path: path.resolve(process.cwd(), '.env.test'),
  });
  dynamodbLocal.start({ port: 8000 });
  done();
}, (done) => {
  dynamodbLocal.stop(8000);
  done();
});
