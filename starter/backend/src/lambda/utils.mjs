import { parseUserId } from '../auth/utils.mjs'

export function getUserId(event) {
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    return parseUserId(jwtToken)
}

export function buildResponse(statusCode, item) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: item
        })
    }
}

export function buildResponseItems(statusCode, items) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            items: items
        })
    }
}