export type MainStackParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  LandingScreen: undefined;
  MainTopTab: undefined;
  DevelopersScreen: undefined;
};

export type MainTopTabParamlist = {
  TaskScreen: undefined;
  OngoingScreen: undefined;
  OverdueScreen: undefined;
  CompletedScreen: undefined;
};

export type ToDoTask = {
  id: String;
  taskTitle: String;
  dueDate: Date;
  taskDescription: String;
  status: string;
};
