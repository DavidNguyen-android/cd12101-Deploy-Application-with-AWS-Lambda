import middy from '@middy/core'
import httpCors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getTodosForUser } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { buildResponseItems, getUserId } from '../utils.mjs'

const logger = createLogger('GetTodos')

export const handler = middy()
    .use(httpErrorHandler())
    .use(
        httpCors({
            credentials: true
        })
    )
    .handler(async (event) => {
        const userId = getUserId(event)
        const items = await getTodosForUser(userId)
        logger.info("Todo gotten for user:", { userId })

        return buildResponseItems(200, items)
    })
