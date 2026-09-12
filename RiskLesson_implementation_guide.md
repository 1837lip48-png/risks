# RiskLesson — инструкция по реализации (v2, все компоненты @nlmk/ds-2.0)

В прошлой версии часть компонентов (`Stepper`, `MultiSelect`, `NotificationGroup` и др.) была отложена как «не подходит». Здесь каждый из 24 компонентов вашей библиотеки получил конкретное место в приложении — без изобретения своих аналогов там, где готовый компонент уже есть.

## Сводная карта: компонент → экран → назначение

| Компонент | Экран | Что делает |
|---|---|---|
| `Header` | Все экраны рабочего пространства | заголовок, `showBack`, `showNotification` + `notificationAmount`, breadcrumbs |
| `Tabs` | Верхний уровень навигации | переключение Дашборд / Реестр рисков / Реестр уроков |
| `Input` | Вход, форма риска, поиск в реестрах | текстовые поля, поиск со `startIcon` |
| `Radio` | Карточка риска — качественная оценка P | чек-лист из 3 вопросов Да/Нет |
| `SimpleSelect` | Форма риска, форма урока | одиночный выбор категории из фиксированного списка |
| `Select` | Форма риска | множественный выбор доп. согласующих/наблюдателей за риском |
| `MultiSelect` | Реестр уроков, дашборд | выбор нескольких тегов урока; выбор нескольких категорий для сравнения на графике |
| `Autocomplete` | Форма риска | выбор объекта/оборудования (доменная печь, конвертер и т.д.) |
| `Checkbox` | Реестр рисков, `MultiSelect` изнутри | массовое выделение строк для групповых действий |
| `Filter` + `FilterTip` | Реестр рисков, Дашборд | фильтр по статусу/категории в шапке колонки + чипы применённых фильтров |
| `DatePicker` | Форма риска, мероприятия, дашборд | дата идентификации, план/факт срок мероприятия, период дашборда |
| `Pagination` | Реестр рисков, Реестр уроков | постраничная навигация по длинным спискам |
| `Stepper` | Карточка риска — мастер оценки | 10 шагов методологии оценки (идентификация → остаточная оценка) |
| `Status` | Реестр рисков, Реестр уроков | статус риска / мероприятия / урока цветом и иконкой |
| `Legend` | Дашборд, карточка риска | цветовая легенда уровня риска L/M/H |
| `SlideToggle` | Карточка риска, карточка урока | разворачивание доп. блока (обоснование, история) по клику на заголовок |
| `Accordion` | Реестр рисков (мероприятия), карточка риска | вложенная таблица мероприятий; секции «Качественная / Количественная оценка / История» |
| `Avatar` | Везде, где есть человек | владелец, автор, ответственный за мероприятие, автор комментария |
| `Comments` | Карточка риска, карточка урока (ревью) | обсуждение риска; проверка черновика урока владельцем перед публикацией |
| `Switch` | Вход, реестр рисков | тема светлая/тёмная на входе; переключатель «только мои риски» |
| `Divider` | Карточка риска, карточка урока | разделение смысловых блоков внутри карточки |
| `Badge` | Header, реестр рисков, дашборд | счётчик уведомлений, бейдж «Новый» на риске, счётчики на вкладках |
| `NotificationItem` | Выпадающая панель под колокольчиком в `Header` | «Просрочено мероприятий», «Риски вне толеранса», «Новые уроки» |
| `NotificationGroup` | Отдельная панель истории уведомлений (drawer) | накопленные карточки: кто закрыл риск, кто опубликовал урок, что просрочено |

Дальше — по экранам, с привязкой конкретных пропов из вашей документации компонентов.

---

## 1. Экран входа

```jsx
import { Input, Radio, Switch } from '@nlmk/ds-2.0';
```

- **Имя / Фамилия** — два `Input`, фильтр цифр в `onChange`.
- **Тема оформления** — `Switch` внизу экрана (`checked={isDark} onChange={setIsDark}`), как явно указано в документе к жизненному циклу — это единственный элемент входа, не влияющий на бизнес-логику.
- **Роль** — карточки роли остаются на `Box`, т.к. отдельного «radio-card» в библиотеке нет, но выбор *значения* роли ведите через тот же паттерн, что и `Radio`: `checked={role==='rm'}` на карточке риск-менеджера и `checked={role==='initiator'}` на карточке инициатора — так поведение (взаимоисключающий выбор, сброс при очистке имени) остаётся идентичным паттерну `Radio`, даже если визуально это карточка.
- **СПП-модалка** — `Input` с посимвольным форматированием на `onChange` (как поле в форме риска, просто без готового компонента-обёртки в списке).

### Форма Инициатора — качественная оценка здесь НЕ показывается
Важно: `Radio`-чеклист P и `Stepper` оценки (см. раздел 3) относятся к карточке риска, а не к форме Инициатора — по документу Инициатор их не заполняет. На этом экране только:

```jsx
<SimpleSelect value={category} onChange={setCategory} label="Категория риска">
  {categories.map(c => <OptionItem key={c} value={c} label={c} />)}
</SimpleSelect>
<Input label="Наименование риска" value={title} onChange={setTitle} />
<Input label="Риск-событие" value={event} onChange={setEvent} />
<Input label="Прямое следствие" value={consequence} onChange={setConsequence} />
<Autocomplete
  items={equipmentOptions}
  selected={equipment}
  onChange={setEquipment}
  nameGetter={i => i.label}
  label="Связанный объект/оборудование"
/>
<Select
  options={stakeholderOptions}
  label="Дополнительно уведомить"
  multiple
  selected={watchers}
  onSelectionChange={setWatchers}
/>
<Input label="Предполагаемый владелец (необязательно)" value={owner} onChange={setOwner} />
```

`Select` здесь — не категория (для неё уже занят `SimpleSelect`), а необязательный список наблюдателей/согласующих, которых нужно уведомить о новом риске; это оправдывает второй компонент выбора на одной форме, а не дублирование функциональности.

По сабмиту риск уходит в реестр с `Badge`-пометкой «Новый» (см. раздел 2) и вкладки переключаются на Реестр рисков.

---

## 2. Header и уведомления (сквозной слой)

```jsx
<Header
  title="RiskLesson · СПП 19-1991"
  showBack
  showNotification
  notificationAmount={notifications.length}
  onNotificationClick={() => setPanelOpen(true)}
  breadcrumbs={<Breadcrumbs>...</Breadcrumbs>}
/>
```

Под колокольчиком — панель из `NotificationItem`, сгруппированная по трём категориям, как в примере библиотеки, но со смыслом вашего приложения:

```jsx
const items = [
  { label: 'Просрочено мероприятий', count: overdueCount, badgeColor: 'error' },
  { label: 'Риски вне толеранса', count: outOfToleranceCount, badgeColor: 'error' },
  { label: 'Новые уроки в базе', count: newLessonsCount, badgeColor: 'brand' }
];
items.map(i => <NotificationItem key={i.label} {...i} onClick={() => navigate(routeFor(i.label))} />)
```

Отдельно, в drawer «История» (открывается по клику «Показать все»), используйте `NotificationGroup` — накопленные карточки о свершившихся событиях (риск закрыт, урок опубликован, мероприятие просрочено третий день), в отличие от `NotificationItem`, который показывает *текущий счётчик*, а не историю событий. Это разграничение обязательно: одно и то же число не должно дублироваться в двух виджетах с разной семантикой.

`Badge` используется отдельно от `NotificationItem.count` — как самостоятельная метка **на вкладке** `Tabs.Tab` реестра рисков (`hasBadge badgeChildren={openRisksCount}`), чтобы число открытых рисков было видно, не открывая уведомления.

---

## 3. Карточка риска — мастер оценки (`Stepper`)

Методология из документа — это ровно 10 линейных шагов без возврата назад для качественной части, что *точно* совпадает с семантикой примера `Stepper` из библиотеки (`filled` / `notFilled` / `disabled`, движение только вперёд):

```jsx
const steps = [
  'Идентификация', 'Оценка P', 'Оценка I', 'Расчёт RRA',
  'Количественная оценка', 'Расчёт EL', 'Сверка слоёв',
  'Фиксация оснований', 'Верификация', 'Остаточная оценка'
].map((stepName, index) => ({ stepName, index }));

<Box flexDirection="row" gap={16}>
  {steps.map((s, i) => (
    <Stepper
      key={i}
      currentStep={currentStep}
      index={i}
      state={i < currentStep ? EStepState.filled : i === currentStep ? EStepState.notFilled : EStepState.disabled}
      stepName={s.stepName}
      showStep={i !== steps.length - 1}
      onClick={() => i <= currentStep && setCurrentStep(i)}
    />
  ))}
</Box>
```

Шаг 2 («Оценка P») рендерит три `Radio`-вопроса чек-листа — свободный ввод числа запрещён документом, поэтому это единственный способ ввода:

```jsx
{checklistQuestions.map(q => (
  <Box key={q.id} gap={12}>
    <Typography variant="Body1-Medium">{q.text}</Typography>
    <Radio checked={answers[q.id]===true} onChange={() => setAnswer(q.id, true)} value="yes" label="Да" />
    <Radio checked={answers[q.id]===false} onChange={() => setAnswer(q.id, false)} value="no" label="Нет" />
  </Box>
))}
```

Внутри карточки риска три смысловых блока разделены `Divider`, а два из них (качественная оценка, количественная оценка) свёрнуты в `Accordion`, третий («История переоценок» — только чтение, без возможности редактирования, т.к. переоценка = новая запись) — тоже в `Accordion`, initiallyExpanded=false.

`Legend` показывает итоговый RRA как цветовую метку L/M/H рядом со `Stepper`, с `isDisabled` вне режима редактирования риск-менеджером:

```jsx
<Legend type="VIEW" label="Итоговый RRA" color={rraColor} colorList={rraColorList} isDisabled={role!=='risk_manager'} />
```

Обсуждение оценки между владельцем и риск-менеджером — `Comments`, привязанные к конкретному риску:

```jsx
<Comments comments={risk.comments} handleAddRootComment={addComment} handleAddReply={addReply}>
  <Comments.Item>
    <Comments.Header><Comments.Author /><Comments.Meta /></Comments.Header>
    <Comments.Content />
    <Comments.Actions />
  </Comments.Item>
</Comments>
```

`Avatar` — везде, где в этой карточке появляется человек: автор, владелец, автор комментария (`<Avatar userName={c.authorFirst} userSurname={c.authorLast} />`).

`SlideToggle` — для необязательного блока «Дополнительное обоснование» под количественной оценкой, который нужен не всегда и не должен занимать место по умолчанию:

```jsx
<SlideToggle title="Дополнительное обоснование" isShow={showJustification} onToggle={() => setShowJustification(v=>!v)}>
  {risk.quantitative.justificationText}
</SlideToggle>
```

---

## 4. Реестр рисков

```jsx
<Input label="Поиск" startIcon={<IconSearchOutlined24 />} placeholder="Введите запрос" value={q} onChange={setQ} />
<Filter
  mode="multiselect"
  filterTypeOptions={filterTypeOptions}
  filterValueOptions={statusOptions}
  defaultSelectedValues={activeStatuses}
  onSelectedValuesChange={setActiveStatuses}
  placeholder="Статус"
/>
{activeFilters.map(f => <FilterTip key={f.id} text={f.label} isActive onDelete={() => removeFilter(f.id)} />)}
```

Массовые действия по строкам — `Checkbox` в начале строки риска (`indeterminate`, если выделены не все мероприятия внутри), плюс `MultiSelect` в панели массовых действий для выбора нового владельца сразу нескольким выделенным рискам:

```jsx
<MultiSelect value={bulkOwners} onChange={setBulkOwners} label="Назначить владельца" searchable>
  {owners.map(o => (
    <OptionItem key={o.id} value={o.id} label={o.name}>
      <Checkbox checked={bulkOwners.includes(o.id)} disabled={false} onChange={() => {}} style={{ pointerEvents: 'none' }} />
      <Typography variant="Body1-Medium">{o.name}</Typography>
    </OptionItem>
  ))}
</MultiSelect>
```

Строка риска: цветная точка светофора (см. предыдущую версию инструкции — функция от статусов мероприятий), `Avatar` владельца, `Status` вместо текста статуса конвейера:

```jsx
<Status icon={statusIcon[risk.status]} color={statusColor[risk.status]}>{statusLabel[risk.status]}</Status>
```

`Accordion` разворачивает таблицу мероприятий этого риска (одна запись `items` на один риск, `content` — сама таблица, не текст); внутри таблицы — `DatePicker` для план/факт сроков в режиме редактирования, `Status` для статуса мероприятия (Planned/In progress/Done/Rejected — 4 цвета).

`Switch` — тумблер «Показывать только мои риски» в шапке реестра (`checked={onlyMine} onChange={setOnlyMine}`).

`Pagination`:

```jsx
<Pagination
  currentPage={page}
  setCurrentPage={setPage}
  maxPageCount={Math.ceil(filteredRisks.length / pageSize)}
  withSelect
  elementsPerPage={pageSize}
  setElementsPerPage={setPageSize}
  itemsLabel="рисков"
  pageSizes={[10, 20, 50]}
/>
```

---

## 5. Дашборд

`Legend` — расшифровка цвета матрицы 3×3 и заливки столбцов категорий (L/M/H), в режиме `type="VIEW"`, без возможности менять цвета (это не настройка, а факт).

`MultiSelect` — над столбчатой диаграммой, выбор нескольких категорий для сравнения (по умолчанию показаны все 8, можно сузить до 2–3 для презентации).

`Filter` + `FilterTip` — период и владелец, применяются одновременно ко всем виджетам дашборда, отображаются чипами над первым рядом карточек-метрик.

`DatePicker` — выбор произвольного периода вместо готовых пресетов (Q3 2026 и т.п.), когда нужен нестандартный диапазон.

Клик по любому сегменту графика/матрицы — переход в Реестр рисков с уже выставленным `Filter`, а не отдельный запрос данных.

---

## 6. Реестр уроков

```jsx
<Input label="Поиск" startIcon={<IconSearchOutlined24 />} placeholder="Введите ключевое слово или тег" />
<SimpleSelect value={category} onChange={setCategory} label="Категория" />
<MultiSelect value={tags} onChange={setTags} label="Теги" searchable />
```

Карточка урока: `Divider` между блоками (проблема / описание / корневая причина / выученный урок / рекомендация), `FilterTip` в режиме просмотра (`isActive={false}`, без `onDelete`) для отображения тегов, `Avatar` автора, `Status` для статуса публикации (Черновик / Опубликован / Архив — три цвета, семантика та же, что в примере компонента: Draft/Published/Cancelled).

Ревью черновика от LLM перед публикацией — `Comments` как канал согласования между LLM-черновиком и владельцем риска:

```jsx
<Comments comments={draft.reviewNotes} handleAddRootComment={addReviewNote} handleAddReply={() => {}}>
  <Comments.Item><Comments.Header><Comments.Author /><Comments.Meta /></Comments.Header><Comments.Content /></Comments.Item>
</Comments>
```

`SlideToggle` — блок «Развёрнутый фактологический контекст» (даты, участники, цифры) под кратким описанием, скрыт по умолчанию, т.к. нужен не при каждом просмотре карточки.

`Pagination` — как в реестре рисков, тот же паттерн пропов.

---

## 7. Стилизация «Claude × НЛМК»

Не изменилось относительно предыдущей версии: нейтральные плоские поверхности НЛМК-токенов, один акцентный цвет на интерактив, статусные цвета только семантически (светофор риска, `Status`, `Badge`), компактная плотность в реестрах и просторная на дашборде, заголовки не выше `Heading4` внутри карточек.

---

## 8. Порядок работ

1. Модель данных + утилита светофора + `SessionContext`.
2. Экран входа (`Input`, `Radio`-паттерн ролей, `Switch` темы) + форма Инициатора (`SimpleSelect`, `Select`, `Autocomplete`).
3. `Header` + `NotificationItem`/`NotificationGroup`/`Badge` — сквозной слой, нужен уже на этом шаге, чтобы подсветка «Новый риск» была видна в уведомлениях, а не только в реестре.
4. Реестр рисков: список, `Filter`/`FilterTip`, `Checkbox`+`MultiSelect` массовых действий, `Accordion` мероприятий, `Pagination`.
5. Карточка риска: `Stepper` мастера оценки, `Radio`-чеклист P, `Legend`, `Comments`, `SlideToggle`, `Divider`.
6. Дашборд — целиком производный от п.4–5.
7. Реестр уроков + `Comments`-ревью черновика LLM.
8. Ролевые ограничения на переходы статусов — сквозной проход в конце.
