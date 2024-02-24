import middy from '@middy/core'
import httpCors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { buildResponse, getUserId } from '../utils.mjs'

const logger = createLogger('DeleteTodo')

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        httpCors({
            credentials: true
        })
    )
    .handler(async (event) => {
        const todoId = event.pathParameters.todoId
        const userId = getUserId(event)
        const updatedTodo = await deleteTodo(userId, todoId)
        logger.info('Todo deleted')
        return buildResponse(200, updatedTodo)
    })
