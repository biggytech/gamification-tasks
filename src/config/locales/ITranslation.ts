interface ITranslation {
  locale: string;
  translations: {
    general: {
      completedAt: string;
      submit: string;
      xpValue: string;
      title: string;
      menu: string;
      add: string;
      language: string;
      completed: string;
      caution: string;
      cancel: string;
      ok: string;
      notFound: string;
    };
    category: {
      name: {
        single: string;
        multiple: string;
      };
    };
    task: {
      name: {
        single: string;
        multiple: string;
      };
      complete: string;
      addCategoriesFirst: string;
      completeWarning: string;
      completeWarningMessage: string;
    };
    reward: {
      name: {
        single: string;
        multiple: string;
      };
      pick: string;
      timeToPick: string;
    };
    subtask: {
      name: {
        single: string;
        multiple: string;
      };
    };
    settings: {
      name: string;
      databaseSize: string;
      deleteDatabase: string;
      levelSize: string;
      changeLevelSizeWarning: string;
      editLevelSize: string;
      downloadBackup: string;
      backupSaved: string;
      backupSavedMessage: string;
      backupNotSaved: string;
      backupNotSavedMessage: string;
    };
    level: {
      name: string;
      xp: string;
      reached: string;
    };
    repetitiveTask: {
      name: {
        single: string;
        multiple: string;
      };
    };
    achievements: {
      name: {
        single: string;
        multiple: string;
      };
      completed: string;
      completedMessage: string;
      1: {
        title: string;
        message: string;
      };
      2: {
        title: string;
        message: string;
      };
    };
    error: {
      dbNotInitialized: string;
    };
    developerSettings: {
      name: string;
    };
    progress: {
      name: string;
    };
  };
}

export default ITranslation;
