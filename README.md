# Artshell URL shortener

Written in ES6 with webpack and babel. Built and deployed with Serverless.

### Local development

You just need to run it with `npm start`.

### Production environment

You can deploy with `npm run script`. Just remember to have the AWS credentials defined in your shell (through the credentials file or via ENV variables).

The deploy script will ensure that DynamoDB tables are created, to create a qr.artshell.link subdomain, a CloudFront distribution, and to point the CF distribution to the Lambda function.

### Calling the service

There are two routes:

#### https://qr.artshell.link/shorten

- **Method**: `POST`
- **Body**: JSON object containing the url to shorten
- **Returns**: JSON object containing the original url, the short id generated, the resulting url.
- **Authentication**: via AWS Signature v4

Example using [superagent](https://github.com/visionmedia/superagent) and [superagent-aws-signed-request](https://www.npmjs.com/package/superagent-aws-signed-request), which signs requests with AWS Signature v4:

```js
request.
  post('https://qr.artshell.link/shorten').
  send({ url: 'http://www.mikamai.com' }).
  use(signRequest('execute-api', {
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-1',
  })).
  then( resp => console.log(resp.body));
```

#### https://qr.artshell.link/r/SHORT_ID

- **Method**: `GET`
- **Returns**: Redirects to the shortened url

Example using cURL:

```
$ curl -i https://qr.artshell.link/r/B105lFVlM
HTTP/2 302
content-type: application/json
content-length: 0
location: http://www.mikamai.com
date: Fri, 24 Nov 2017 09:45:44 GMT
x-amzn-requestid: 3dc9c9d3-d0fc-11e7-a501-fd7cdb42a8bd
x-amzn-trace-id: sampled=0;root=1-5a17ea48-eeac573dedd505ed1add35bf
x-cache: Miss from cloudfront
via: 1.1 e98abde3c6a5bc27d4bdd4168baa587d.cloudfront.net (CloudFront)
x-amz-cf-id: 1cIc-uKmFJh_Xmnxy0dnbIvtNSnVyGX6yvsrZjEVIgofH91MZQBbYg==
```
