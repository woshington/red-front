import { useFetch } from "./useFetch";
import { cursosService } from "../services/cursos";
import type { ListParams } from "../types";

export function useCursos(params: ListParams = {}) {
    return useFetch(
        () => cursosService.list(params),
        [JSON.stringify(params)]
    );
}