import { z } from 'zod';

import { ServerActionResponse, handleServerError } from './errors';

export function createSafeAction<Args extends unknown[], ResponseData>(
    action: (...args: Args) => Promise<ResponseData>,
): (...args: Args) => Promise<ServerActionResponse<ResponseData>> {
    return async (...args: Args) => {
        try {
            const data = await action(...args);
            return { success: true, data };
        } catch (err) {
            return handleServerError(err);
        }
    };
}

export function createValidatedAction<Schema extends z.ZodTypeAny, ResponseData>(
    schema: Schema,
    action: (validatedData: z.infer<Schema>) => Promise<ResponseData>,
): (data: z.infer<Schema>) => Promise<ServerActionResponse<ResponseData>> {
    return async (data: z.infer<Schema>) => {
        try {
            const parsed = schema.safeParse(data);
            if (!parsed.success) {
                const errorMessage = parsed.error.issues.map((e) => e.message).join(', ');
                return { success: false, error: `Ошибка валидации: ${errorMessage}` };
            }

            const result = await action(parsed.data);
            return { success: true, data: result };
        } catch (err) {
            return handleServerError(err);
        }
    };
}
