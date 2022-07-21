import ITranslation from './ITranslation';

const ruTranslation: ITranslation = {
  locale: 'ru',
  translations: {
    general: {
      completedAt: 'Завершено в',
      submit: 'Отправить',
      xpValue: 'Стоимость (в очках опыта)',
      title: 'Название',
      menu: 'Меню',
      add: 'Добавить',
      language: 'Язык',
      completed: 'Завершено',
      caution: 'Осторожно',
      cancel: 'Отменить',
      ok: 'ОК',
      notFound: 'Не найдено',
      error: 'Ошибка',
      today: 'Сегодня',
      yesterday: 'Вчера',
    },
    days: {
      mon: 'Пн',
      tues: 'Вт',
      wed: 'Ср',
      thurs: 'Чт',
      fri: 'Пт',
      sat: 'Сб',
      sun: 'Вс',
    },
    category: {
      name: {
        single: 'Категория',
        multiple: 'Категории',
      },
    },
    task: {
      name: {
        single: 'Задание',
        multiple: 'Задания',
      },
      complete: 'Завершить',
      addCategoriesFirst: 'Сперва добавьте категории',
      completeWarning: 'Вы уверены, что хотите завершить задание?',
      completeWarningMessage: 'Это действие невозможно отменить',
      hasUncompletedSubtasksMessage:
        'У этого задания есть незавершенные подзадания',
    },
    reward: {
      name: {
        single: 'Награда',
        multiple: 'Награды',
      },
      pick: 'Получить',
      timeToPick: 'Вы можете получить свою награду',
    },
    subtask: {
      name: {
        single: 'Подзадание',
        multiple: 'Подзадания',
      },
    },
    settings: {
      name: 'Настройки',
      databaseSize: 'Размер базы данных (в байтах)',
      deleteDatabase: 'Удалить базу данных',
      levelSize: 'XP в уровне',
      changeLevelSizeWarning: `Изменение этой настройки сбросит текущий прогресс уровня. 
      Ваш уровень и очки опыта останутся теми же, но прогресс бар текущего уровня будет сброшен в ноль. Вы точно хотите продолжить?`,
      editLevelSize: 'Редактировать размер уровня',
      downloadBackup: 'Скачать бэкап',
      backupSaved: 'Бэкап был сохранен',
      backupSavedMessage: 'Файл бэкапа был сохранен в папку Документы',
      backupNotSaved: 'Бэкап не был сохранен',
      backupNotSavedMessage: 'Произошла ошибка во время сохранения файла',
      restoreFromBackup: 'Восстановить из бэкапа',
      restoreFromBackupMessage:
        'Бэкап перезапишет текущие значения. Вы уверены, что хотите продолжить?',
      restoredSuccess: 'Успешно восстановлено',
    },
    level: {
      name: 'Уровень',
      xp: 'Очки опыта (XP)',
      reached: 'Получен',
    },
    repetitiveTask: {
      name: {
        single: 'Повторяющееся задание',
        multiple: 'Повторяющиеся задания',
      },
    },
    achievements: {
      name: {
        single: 'Достижение',
        multiple: 'Достижения',
      },
      completed: 'Получено достижение',
      completedMessage: 'Вы получили достижение',
      1: {
        title: 'Достичь 10-го уровня',
        message: 'Достигните 10-го уровня, чтобы получить это достижение.',
      },
      2: {
        title: 'Завершить 10 заданий',
        message: 'Завершите 10 заданий, чтобы получить это достижение.',
      },
    },
    error: {
      dbNotInitialized: 'База данных не инициализирована',
    },
    developerSettings: {
      name: 'Настройки разработчика',
    },
    progress: {
      name: 'Прогресс',
    },
  },
};

export default ruTranslation;
