import middy from '@middy/core'
import httpCors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { buildResponse, getUserId } from '../utils.mjs'

const logger = createLogger('UpdateTodo')

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        httpCors({
            credentials: true
        })
    )
    .handler(async (event) => {
        const newTodo = JSON.parse(event.body)
        const todoId = event.pathParameters.todoId
        const userId = getUserId(event)
        const updatedTodo = await updateTodo(userId, todoId, newTodo)
        logger.info('Todo updated')


        return buildResponse(200, updatedTodo)
    })
