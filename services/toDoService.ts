import api from "@/http";
import { AxiosResponse } from "axios";

class toDoService {
  static async getTodos(): Promise<AxiosResponse<Todo[]>> {
    return api.get("?_limit=10");
  }

  static async addTodo(todo: Todo): Promise<AxiosResponse<Todo>> {
    return api.post("", todo);
  }

  static async deleteTodo(id: number): Promise<AxiosResponse> {
    return api.delete(`/${id}`);
  }
}

export default toDoService;
