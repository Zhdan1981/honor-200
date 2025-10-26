
import React from 'react';
import { 
    User, 
    Heart, 
    ShoppingCart, 
    Landmark, 
    Palmtree, 
    Car, 
    Home, 
    BadgePercent, 
    Fuel, 
    Package, 
    ShoppingBag,
    Banknote,
    Shrimp
} from 'lucide-react';
import type { Category } from './types';

const iconProps = {
    className: "h-6 w-6 text-white"
};

export const INITIAL_CATEGORIES: Omit<Category, 'balance'>[] = [
  // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
  { id: 'moi', name: 'Мои', group: 'Личные', icon: (props) => React.createElement(User, { ...iconProps, ...props }), color: '#34D399' },
  { id: 'nadia', name: 'Надя', group: 'Личные', icon: (props) => React.createElement(User, { ...iconProps, ...props }), color: '#F472B6' },
  { id: 'andrei', name: 'Андрей', group: 'Личные', icon: (props) => React.createElement(User, { ...iconProps, ...props }), color: '#EAB308' },
  { id: 'sberbank', name: 'Суши', group: 'Расходы', icon: (props) => React.createElement(Shrimp, { ...iconProps, ...props }), color: '#22C55E' },
  { id: 'otpusk', name: 'Отпуск', group: 'Общие', icon: (props) => React.createElement(Palmtree, { ...iconProps, ...props }), color: '#60A5FA' },
  { id: 'garage', name: 'Гараж', group: 'Расходы', icon: (props) => React.createElement(Car, { ...iconProps, ...props }), color: '#F97316' },
  { id: 'zhkh', name: 'ЖКХ', group: 'Расходы', icon: (props) => React.createElement(Home, { ...iconProps, ...props }), color: '#F59E0B' },
  { id: 'cashback', name: 'Кэшбэк', group: 'Расходы', icon: (props) => React.createElement(BadgePercent, { ...iconProps, ...props }), color: '#2DD4BF' },
  { id: 'benzin', name: 'Бензин', group: 'Расходы', icon: (props) => React.createElement(Fuel, { ...iconProps, ...props }), color: '#A8A29E' },
  { id: 'producti', name: 'Продукты', group: 'Расходы', icon: (props) => React.createElement(ShoppingCart, { ...iconProps, ...props }), color: '#A78BFA' },
  { id: 'ozon', name: 'Ozon', group: 'Расходы', icon: (props) => React.createElement(Package, { ...iconProps, ...props }), color: '#8B5CF6' },
  { id: 'wb', name: 'WB', group: 'Расходы', icon: (props) => React.createElement(ShoppingBag, { ...iconProps, ...props }), color: '#EC4899' },
];

export const INITIAL_BALANCES: { [key: string]: number } = {
    'moi': 63964,
    'nadia': 5551.37,
    'otpusk': 546153,
    'garage': 6429,
    'zhkh': 0,
    'cashback': 0,
    'benzin': 1777,
    'producti': 8451.08,
    'andrei': 0,
    'sberbank': 0,
    'ozon': 0,
    'wb': 0,
};