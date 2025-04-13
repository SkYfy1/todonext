"use client";

import toDoService from "@/services/toDoService";
import React, {
  useCallback,
  useEffect,
  useOptimistic,
  useRef,
  useState,
} from "react";
import ToDoItem from "./ToDoItem";
import { Input } from "./ui/input";

const ToDoContainer = () => {
  const [toDos, setTodos] = useState<Todo[] | null>(null);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);

  const [optimisticTodos, addOptimisticTodos] = useOptimistic(
    toDos,
    (state, newTodo) => [
      ...state,
      {
        todo: newTodo,
        sending: true,
      },
    ]
  );

  useEffect(() => {
    let ignore = false;
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const data = (await toDoService.getTodos()).data;

        // Simulating long fetch
        await new Promise((res) => setTimeout(() => res(""), 1000));

        if(ignore) {
        setTodos(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
    return () => {
          ignore = true;
    }
  }, []);

  const handleAddTodo = async () => {
    const findId = toDos!.reduce((max, cur) => Math.max(max, cur.id), 0);

    const newToDo = {
      id: findId + 1,
      userId: 1,
      title: text,
      completed: false,
    };

    addOptimisticTodos(newToDo);
    ref.current.scrollIntoView();

    try {
      await toDoService.addTodo(newToDo);
      // Simulating long fetch
      await new Promise((res) => setTimeout(() => res(""), 1000));
    } catch (error) {
      console.log(error);
    }

    setTodos((prev) => [...prev, newToDo]);
    setText("");
  };

  const handleDeleteTodo = useCallback(async (id: number) => {
    await toDoService.deleteTodo(id);
    setTodos((prev) => prev!.filter((todo) => todo.id !== id));
  }, []);

  const handleUpdateTodoState = useCallback(async (id: number) => {
    setTodos((prev) =>
      prev!.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        } else {
          return todo;
        }
      })
    );
  }, []);

  if (isLoading) {
    return (
      <div className="h-[300px] w-[300px] border-2 border-b-white border-t-white border-r-transparent border-l-transparent rounded-full animate-spin"></div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col gap-6 p-6 relative">
      <h1 className="text-3xl font-semibold">To Do List</h1>
      <form action={handleAddTodo} className="flex w-full gap-4 items-center">
        <Input
          className="h-full py-4 !text-base"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type text..."
        />
        <button className="bg-white rounded-md px-3 py-4 text-black">
          Add
        </button>
      </form>
      <div className="flex flex-col gap-4 h-[724] overflow-auto no-scrollbar">
        {optimisticTodos?.map((todo, index) => (
          <ToDoItem
            key={todo.sending ? `temp-${index}` : todo.id}
            data={todo}
            deleteTodo={handleDeleteTodo}
            updateTodo={handleUpdateTodoState}
          />
        ))}
        <div ref={ref} className="mt-15"></div>
      </div>
    </div>
  );
};

export default ToDoContainer;
