import middy from '@middy/core'
import httpCors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { buildResponse, getUserId } from '../utils.mjs'

const logger = createLogger('CreateTodo')

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        httpCors({
            credentials: true
        })
    )
    .handler(async (event) => {
        const newTodo = JSON.parse(event.body)
        const userId = getUserId(event)
        const item = await createTodo(userId, newTodo)
        logger.info('Todo created for user:', { userId })
        return buildResponse(200, item)
    })
