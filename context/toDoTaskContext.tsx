import { ReactNode, createContext, useContext, useState } from "react";
import { ToDoTask } from "../types";

type ToDoTaskContextType = {
  TasksList: ToDoTask[];
  addTask: (newTask: ToDoTask) => void;
  updateTask: (taskId: String, attribute: Partial<ToDoTask>) => void;
  setNewTasksList: (newTasksList: ToDoTask[]) => void;
};

const ToDoTaskContext = createContext<ToDoTaskContextType | undefined>(
  undefined
);

export const ToDoTaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [TasksList, setTasksList] = useState<ToDoTask[]>([]);

  const addTask = (newTask: ToDoTask) => {
    setTasksList((prevTaskList) => [...prevTaskList, newTask]);
  };

  const updateTask = (taskId: String, attribute: Partial<ToDoTask>) => {
    setTasksList((prevTaskList) =>
      prevTaskList.map((item) =>
        item.id === taskId ? { ...item, ...attribute } : item
      )
    );
  };

  const setNewTasksList = (newTasksList: ToDoTask[]) => {
    setTasksList(newTasksList);
  };

  return (
    <ToDoTaskContext.Provider
      value={{ TasksList, addTask, updateTask, setNewTasksList }}
    >
      {children}
    </ToDoTaskContext.Provider>
  );
};
export const useTaskContext = () => {
  const context = useContext(ToDoTaskContext);

  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }

  return context;
};
