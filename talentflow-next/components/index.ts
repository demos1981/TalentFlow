// Layout Components
export { default as Layout } from './Layout/Layout';
export { default as Header } from './Layout/Header';
export { default as Sidebar } from './Layout/Sidebar';
export { default as Footer } from './Layout/Footer';

// UI Components
export * from './UI';

// Forms Components
export * from './Forms';

// AI Components
export * from './AI';

// Re-export commonly used components
export { Button } from './UI/Button';
export type { ButtonProps } from './UI/Button';
export { Input } from './UI/Input';
export type { InputProps } from './UI/Input';
export { Card } from './UI/Card';
export type { CardProps } from './UI/Card';
export { Modal } from './UI/Modal';
export type { ModalProps } from './UI/Modal';
export { default as Loading } from './UI/Loading';
export type { LoadingProps } from './UI/Loading';
export { Avatar } from './UI/Avatar';
export type { AvatarProps } from './UI/Avatar';
export { DataTable } from './UI/DataTable';
export type { DataTableProps, Column } from './UI/DataTable';
export { SearchInput } from './Forms/SearchInput';
export type { SearchInputProps } from './Forms/SearchInput';
