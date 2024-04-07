import { ReactNode, createContext, useContext, useState } from "react";
import { ToDoTask } from "../types";

type NotificationContextType = {
  NotificationList: ToDoTask[];
  addNotification: (notification: ToDoTask) => void;
  updateNotification: (
    notificationId: String,
    attribute: Partial<ToDoTask>
  ) => void;
  setNewNotificationList: (newNotificationList: ToDoTask[]) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [NotificationList, setNotificationList] = useState<ToDoTask[]>([]);

  const addNotification = (notification: ToDoTask) => {
    setNotificationList((prev) => [...prev, notification]);
  };
  const updateNotification = (
    notificationId: String,
    attribute: Partial<ToDoTask>
  ) => {
    setNotificationList((prevNotificationList) =>
      prevNotificationList.map((item) =>
        item.id === notificationId ? { ...item, attribute } : item
      )
    );
  };
  const setNewNotificationList = (newNotificationList: ToDoTask[]) => {
    setNotificationList(newNotificationList);
  };
  return (
    <NotificationContext.Provider
      value={{
        NotificationList,
        addNotification,
        updateNotification,
        setNewNotificationList,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be use within NotificationContextProvider"
    );
  }
  return context;
};
