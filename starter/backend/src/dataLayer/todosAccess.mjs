import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createLogger } from '../utils/logger.mjs';

// Create a logger with a relevant module name
const logger = createLogger("TodosAccess");

// Define the URL expiration from environment variables
const url_expiration = process.env.SIGNED_URL_EXPIRATION;

export class TodosAccess {
    constructor(
        dynamoDb = DynamoDBDocument.from(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE,
        todosIndex = process.env.TODOS_CREATED_AT_INDEX,
        S3 = new S3Client(),
        s3_bucket_name = process.env.ATTACHMENT_S3_BUCKET
    ) {
        this.dynamoDb = dynamoDb;
        this.S3 = S3;
        this.todosTable = todosTable;
        this.todosIndex = todosIndex;
        this.bucket_name = s3_bucket_name;
    }

    async createTodo(todo) {
        logger.info("Creating a new todo");

        try {
            await this.dynamoDb.put({
                TableName: this.todosTable,
                Item: todo,
            });

            return todo;
        } catch (e) {
            logger.error("Error creating todo", { error: e.message });
            throw e;
        }
    }

    async updateTodo(userId, todoId, updateToDoRequest) {
        logger.info("Updating a todo");

        try {
            await this.dynamoDb.update({
                TableName: this.todosTable,
                Key: {
                    userId,
                    todoId,
                },
                UpdateExpression:
                    "set #name = :name, #dueDate = :dueDate, #done = :done",
                ExpressionAttributeNames: {
                    "#name": "name",
                    "#dueDate": "dueDate",
                    "#done": "done",
                },
                ExpressionAttributeValues: {
                    ":name": updateToDoRequest.name,
                    ":dueDate": updateToDoRequest.dueDate,
                    ":done": updateToDoRequest.done,
                },
                ReturnValues: "UPDATED_NEW",
            });

            return "Updated";
        } catch (e) {
            logger.error("Error updating todo", { error: e.message });
            throw e;
        }
    }

    async updateAttachmentPresignedUrl(userId, todoId) {
        logger.info("Updating attachment presigned URL");

        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket_name,
                Key: todoId,
            });

            const url = await getSignedUrl(this.S3, command, {
                expiresIn: parseInt(url_expiration),
            });

            await this.dynamoDb.update({
                TableName: this.todosTable,
                Key: {
                    userId,
                    todoId,
                },
                UpdateExpression: "set attachmentUrl = :URL",
                ExpressionAttributeValues: {
                    ":URL": url.split("?")[0],
                },
                ReturnValues: "UPDATED_NEW",
            });

            return url;
        } catch (e) {
            logger.error("Error updating attachment URL", { error: e.message });
            throw e;
        }
    }

    async deleteTodo(userId, todoId) {
        logger.info("Deleting a todo:", { todoId });

        try {
            await this.dynamoDb.delete({
                TableName: this.todosTable,
                Key: {
                    userId,
                    todoId,
                },
            });

            return "Deleted";
        } catch (e) {
            logger.error("Error deleting todo", { error: e.message });
            throw e;
        }
    }

    async getAll(userId) {
        logger.info("Getting all todos");

        const result = await this.dynamoDb.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId,
            },
        });

        return result.Items;
    }
}