import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { updateAttachmentPresignedUrl } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true,
        })
    )
    .handler(async (event) => {
        try {
            const todoId = event.pathParameters.todoId;
            const userId = getUserId(event);
            const url = await updateAttachmentPresignedUrl(userId, todoId);
            return {
                statusCode: 201,
                body: JSON.stringify({
                    uploadUrl: url,
                }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Unable to generate upload URL',
                }),
            };
        }
    });
