# UI Components - Фільтри та Пошук

Цей документ описує компоненти для фільтрації та пошуку, які можна використовувати на всіх сторінках додатку.

## 🔍 SearchBar

Універсальний компонент для пошуку з debounce та можливістю очищення.

### Використання

```tsx
import SearchBar from '../components/UI/SearchBar';

const MyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <SearchBar
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="Пошук..."
      onSearch={(query) => console.log('Пошук:', query)}
      debounceMs={300}
    />
  );
};
```

### Props

- `value: string` - поточне значення пошуку
- `onChange: (query: string) => void` - функція зміни значення
- `placeholder?: string` - placeholder для інпута
- `onSearch?: (query: string) => void` - функція виконання пошуку (Enter або клік)
- `debounceMs?: number` - затримка в мс перед викликом onChange (за замовчуванням 300)
- `className?: string` - додаткові CSS класи
- `showClearButton?: boolean` - показувати кнопку очищення (за замовчуванням true)
- `autoFocus?: boolean` - автофокус на інпут (за замовчуванням false)

## 🎛️ FilterBar

Універсальний компонент для фільтрації з різними типами полів.

### Використання

```tsx
import FilterBar, { FilterConfig } from '../components/UI/FilterBar';

const MyPage = () => {
  const [filters, setFilters] = useState({});
  
  const filterConfigs: FilterConfig[] = [
    {
      key: 'location',
      label: 'Локація',
      type: 'select',
      options: [
        { value: 'kyiv', label: 'Київ' },
        { value: 'lviv', label: 'Львів' }
      ]
    },
    {
      key: 'salary',
      label: 'Зарплата',
      type: 'range',
      min: 0,
      max: 10000
    },
    {
      key: 'isRemote',
      label: 'Віддалена робота',
      type: 'checkbox'
    }
  ];
  
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({});
  };
  
  return (
    <FilterBar
      filters={filters}
      onFilterChange={handleFilterChange}
      onClearFilters={clearFilters}
      filterConfigs={filterConfigs}
      title="Фільтри пошуку"
    />
  );
};
```

### Типи полів

#### `select`
Випадаючий список з опціями.

```tsx
{
  key: 'category',
  label: 'Категорія',
  type: 'select',
  options: [
    { value: 'it', label: 'IT' },
    { value: 'marketing', label: 'Маркетинг' }
  ]
}
```

#### `input`
Текстове поле.

```tsx
{
  key: 'company',
  label: 'Компанія',
  type: 'input',
  placeholder: 'Введіть назву компанії'
}
```

#### `checkbox`
Чекбокс.

```tsx
{
  key: 'isUrgent',
  label: 'Термінова вакансія',
  type: 'checkbox'
}
```

#### `multiselect`
Множинний вибір.

```tsx
{
  key: 'skills',
  label: 'Навички',
  type: 'multiselect',
  options: [
    { value: 'react', label: 'React' },
    { value: 'node', label: 'Node.js' }
  ]
}
```

#### `range`
Діапазон значень.

```tsx
{
  key: 'experience',
  label: 'Досвід (роки)',
  type: 'range',
  min: 0,
  max: 20,
  step: 1
}
```

## 🔧 Інтеграція з існуючими сторінками

### JobsPage

```tsx
import SearchBar from '../components/UI/SearchBar';
import FilterBar, { FilterConfig } from '../components/UI/FilterBar';

const JobsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  
  const filterConfigs: FilterConfig[] = [
    {
      key: 'location',
      label: 'Локація',
      type: 'select',
      options: locations.map(loc => ({ value: loc, label: loc }))
    },
    {
      key: 'type',
      label: 'Тип роботи',
      type: 'select',
      options: jobTypes.map(type => ({ value: type, label: type }))
    },
    {
      key: 'salary',
      label: 'Зарплата',
      type: 'range',
      min: 0,
      max: 10000
    }
  ];
  
  return (
    <div>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Пошук вакансій..."
      />
      
      <FilterBar
        filters={filters}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        onClearFilters={() => setFilters({})}
        filterConfigs={filterConfigs}
        title="Фільтри вакансій"
      />
      
      {/* Список вакансій */}
    </div>
  );
};
```

### CandidateSearchPage

```tsx
const CandidateSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  
  const filterConfigs: FilterConfig[] = [
    {
      key: 'location',
      label: 'Локація',
      type: 'select',
      options: locations.map(loc => ({ value: loc, label: loc }))
    },
    {
      key: 'experienceLevel',
      label: 'Рівень досвіду',
      type: 'select',
      options: experienceLevels.map(level => ({ value: level, label: level }))
    },
    {
      key: 'skills',
      label: 'Навички',
      type: 'multiselect',
      options: skills.map(skill => ({ value: skill, label: skill }))
    },
    {
      key: 'salary',
      label: 'Зарплата',
      type: 'range',
      min: 0,
      max: 10000
    }
  ];
  
  return (
    <div>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Пошук кандидатів..."
      />
      
      <FilterBar
        filters={filters}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        onClearFilters={() => setFilters({})}
        filterConfigs={filterConfigs}
        title="Фільтри кандидатів"
      />
      
      {/* Список кандидатів */}
    </div>
  );
};
```

## 🎨 CSS Змінні

Компоненти використовують CSS змінні для стилізації:

```css
:root {
  --primary-color: #3b82f6;
  --primary-color-dark: #2563eb;
  --primary-color-alpha: rgba(59, 130, 246, 0.1);
  --surface-color: #ffffff;
  --border-color: #e5e7eb;
  --text-color: #111827;
  --text-muted: #6b7280;
  --border-radius: 0.5rem;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

## 📱 Адаптивність

Всі компоненти адаптивні та автоматично підлаштовуються під різні розміри екрану:

- **Desktop**: Фільтри розташовані в сітці
- **Tablet**: Фільтри переходять в один стовпець
- **Mobile**: Фільтри та пошук займають всю ширину

## ♿ Доступність

Компоненти включають:

- Правильну семантику HTML
- ARIA атрибути
- Клавіатурну навігацію
- Фокус стани
- Screen reader підтримку

## 🚀 Продуктивність

- **Debounce** для пошуку (за замовчуванням 300ms)
- **Lazy loading** для великих списків опцій
- **Memoization** для важких обчислень
- **Optimized re-renders** з React.memo

## 🔄 Оновлення

Для оновлення компонентів:

1. Змініть код компонента
2. Оновіть CSS стилі
3. Перевірте адаптивність
4. Протестуйте доступність
5. Оновіть документацію






