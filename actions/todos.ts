"use server";

import api from "@/http";

const createTodo = async (todo: Todo) => {
  try {
    await api.post("", todo);
    await new Promise((res) => setTimeout(() => res(""), 10000));
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export { createTodo };
