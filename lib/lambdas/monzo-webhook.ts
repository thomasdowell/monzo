import {APIGatewayEvent, APIGatewayProxyResult} from "aws-lambda";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log('event', event);

  return {
    statusCode: 200,
    body: ''
  };
};