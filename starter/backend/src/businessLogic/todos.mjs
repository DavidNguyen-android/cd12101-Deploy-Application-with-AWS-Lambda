import * as uuid from 'uuid';
import { TodosAccess } from "../dataLayer/todosAccess.mjs";
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger("TodoItemsBusinessLogic");
const todosAccess = new TodosAccess();

export async function getTodosForUser(userId) {
    try {
        logger.info("Getting todo items for user:", { userId });
        return await todosAccess.getAll(userId);
    } catch (error) {
        logger.error("Error getting todo items:", { userId, error });
        throw error;
    }
}

export async function updateTodo(userId, todoId, updateToDoRequest) {
    try {
        logger.info("Updating todo:", { userId, todoId });
        return await todosAccess.updateTodo(userId, todoId, updateToDoRequest);
    } catch (error) {
        logger.error("Error updating todo:", { userId, todoId, error });
        throw error;
    }
}

export async function updateAttachmentPresignedUrl(userId, todoId) {
    try {
        logger.info("Updating attachment presigned URL:", { userId, todoId });
        return await todosAccess.updateAttachmentPresignedUrl(userId, todoId);
    } catch (error) {
        logger.error("Error updating attachment presigned URL:", { userId, todoId, error });
        throw error;
    }
}

export async function createTodo(userId, createTodoRequest) {
    try {
        logger.info("Creating new todo for user:", { userId });

        const todoId = uuid.v4();
        const createdAt = new Date().toISOString();

        const todoItem = {
            todoId: todoId,
            userId: userId,
            createdAt,
            done: false,
            attachmentUrl: null,
            name: createTodoRequest.name,
            dueDate: createTodoRequest.dueDate
        };

        return await todosAccess.createTodo(todoItem);
    } catch (error) {
        logger.error("Error creating todo:", { userId, error });
        throw error;
    }
}

export async function deleteTodo(userId, todoId) {
    try {
        logger.info("Deleting todo:", { userId, todoId });
        return await todosAccess.deleteTodo(userId, todoId);
    } catch (error) {
        logger.error("Error deleting todo:", { userId, todoId, error });
        throw error;
    }
}