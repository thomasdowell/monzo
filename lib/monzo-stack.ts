import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {IResource, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi} from 'aws-cdk-lib/aws-apigateway';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {join} from 'path';

export class MonzoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const monzoWebhookLambda = new NodejsFunction(this, 'monzo-webhook-handler', {
      entry: join(__dirname, 'lambdas', 'monzo-webhook.ts'),

      runtime: Runtime.NODEJS_20_X,
    });

    const monzoWebhookIntegration = new LambdaIntegration(monzoWebhookLambda);

    const api = new RestApi(this, 'monzoWebhookApi', {
      restApiName: 'Monzo Webhook API'
    });

    const items = api.root.addResource('{account_id}');
    items.addMethod('POST', monzoWebhookIntegration);
    addCorsOptions(items);
  }
}

function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod('OPTIONS', new MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
      },
    }],
    passthroughBehavior: PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    }]
  })
}