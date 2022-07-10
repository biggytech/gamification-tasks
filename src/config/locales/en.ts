import ITranslation from './ITranslation';

const enTranslation: ITranslation = {
  locale: 'en',
  translations: {
    general: {
      completedAt: 'Completed at',
      submit: 'Submit',
      xpValue: 'Value (in experience points)',
      title: 'Title',
      menu: 'Menu',
      add: 'Add',
      language: 'Language',
      completed: 'Completed',
      caution: 'Caution',
      cancel: 'Cancel',
      ok: 'OK',
      notFound: 'Not Found',
      error: 'Error',
      today: 'Today',
      yesterday: 'Yesterday',
    },
    category: {
      name: {
        single: 'Category',
        multiple: 'Categories',
      },
    },
    task: {
      name: {
        single: 'Task',
        multiple: 'Tasks',
      },
      complete: 'Complete',
      addCategoriesFirst: 'Add categories first',
      completeWarning: 'Are you sure to complete the task?',
      completeWarningMessage: 'This action cannot be undone',
    },
    reward: {
      name: {
        single: 'Reward',
        multiple: 'Rewards',
      },
      pick: 'Pick',
      timeToPick: 'You can pick your reward',
    },
    subtask: {
      name: {
        single: 'Subtask',
        multiple: 'Subtasks',
      },
    },
    settings: {
      name: 'Settings',
      databaseSize: 'Database size (in bytes)',
      deleteDatabase: 'Delete database',
      levelSize: 'XP in level',
      changeLevelSizeWarning: `Changing this setting will reset your current level progress. 
      Your level and gained XP will stay the same, but the level progress bar will be set to zero. Are you sure to proceed?`,
      editLevelSize: 'Edit Level Size',
      downloadBackup: 'Download Backup',
      backupSaved: 'Backup was saved',
      backupSavedMessage: 'Backup file was saved in Documents directory',
      backupNotSaved: 'Backup was not saved',
      backupNotSavedMessage: 'An error occured during saving process',
      restoreFromBackup: 'Restore from backup',
      restoreFromBackupMessage:
        'Backup will override existing values. Are you sure to proceed?',
      restoredSuccess: 'Restored successfully',
    },
    level: {
      name: 'Level',
      xp: 'Experience points (XP)',
      reached: 'Reached',
    },
    repetitiveTask: {
      name: {
        single: 'Repetitive task',
        multiple: 'Repetitive Tasks',
      },
    },
    achievements: {
      name: {
        single: 'Achievement',
        multiple: 'Achievements',
      },
      completed: 'Achievement got',
      completedMessage: 'You have got achievement',
      1: {
        title: 'Reach 10th level',
        message: 'Reach 10th level to get this achievement.',
      },
      2: {
        title: 'Complete 10 tasks',
        message: 'Complete 10 tasks to get this achievement.',
      },
    },
    error: {
      dbNotInitialized: 'The database is not initialized',
    },
    developerSettings: {
      name: 'Developer Settings',
    },
    progress: {
      name: 'Progress',
    },
  },
};

export default enTranslation;
