export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ChatRoom: { familyId: string; familyName: string };
  Settings: undefined;
};

export type MainTabParamList = {
  Chats: undefined;
  Calendar: undefined;
  FamilyTree: undefined;
  Timeline: undefined;
  AIAssistant: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type ChatsStackParamList = {
  FamiliesList: undefined;
  FamilyChat: { familyId: string };
  Microchat: { familyId: string; microchatId: string };
  CreateFamily: undefined;
  FamilySettings: { familyId: string };
  AddMember: { familyId: string };
};

export type AIAssistantStackParamList = {
  AIChat: undefined;
  AISettings: undefined;
};

export type TaskManagerStackParamList = {
  TaskList: undefined;
  CreateTask: { familyId?: string };
  EditTask: { taskId: string };
  TaskDetails: { taskId: string };
};

export type TimelineStackParamList = {
  Stories: undefined;
  CreateStory: { familyId: string };
  ViewStory: { storyId: string };
};

export type CalendarStackParamList = {
  Events: undefined;
  CreateEvent: { familyId: string };
  EventDetails: { eventId: string };
};

export type FamilyTreeStackParamList = {
  TreeView: { familyId: string };
  AddMember: { familyId: string };
  MemberDetails: { memberId: string };
}; 