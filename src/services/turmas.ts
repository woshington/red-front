import type { ListParams, Paginated, Turma } from "../types";
import { api, toQueryString } from "./api";

export const turmasService = {
    create: (data: any) =>
        api.post<Turma>("/school-classes", data),

    list: (params?: ListParams) =>
        api.get<Paginated<Turma>>("/school-classes" + toQueryString(params)),

    update: (id: string, data: any) =>
        api.put<Turma>(`/school-classes/${id}`, data),

    remove: (id: string) =>
        api.delete<Turma>(`/school-classes/${id}`),
        
    getStudents: (id: string) =>
        api.get<any[]>(`/school-classes/${id}/students`),
        
    transferStudents: (studentIds: string[], targetClassId: string | null) =>
        api.post(`/school-classes/transfer`, {
            student_ids: studentIds,
            target_class_id: targetClassId
        })
}