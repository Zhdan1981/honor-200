import React, { useState, useRef, useEffect } from 'react';
import type { Category } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CategoryCardProps {
  category: Category;
  onSelect: (category: Category) => void;
  onUpdateBalance: (categoryId: string, newBalance: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect, onUpdateBalance }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(category.balance.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);
    
    const handleBalanceClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent onSelect from firing
        setInputValue(category.balance.toFixed(2));
        setIsEditing(true);
    };

    const handleSave = () => {
        const newBalance = parseFloat(inputValue);
        if (!isNaN(newBalance) && newBalance !== category.balance) {
            onUpdateBalance(category.id, newBalance);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setInputValue(category.balance.toString());
            setIsEditing(false);
        }
    };

    return (
        <div
            className="flex items-center p-4 mb-3 mx-4 bg-card-primary rounded-xl cursor-pointer hover:bg-card-hover transition-colors shadow-sm"
            onClick={() => !isEditing && onSelect(category)}
        >
            <div
                className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-4"
                style={{ backgroundColor: `${category.color}2A` }}
            >
                <category.icon className="h-6 w-6" style={{ color: category.color }} />
            </div>
            <div className="flex-grow">
                <h3 className="font-semibold text-text-primary text-base">{category.name}</h3>
                <p className="text-sm" style={{ color: category.color }}>{category.group}</p>
            </div>
            <div className="text-right">
                 {isEditing ? (
                        <input
                            ref={inputRef}
                            type="number"
                            step="0.01"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-text-primary text-base text-right bg-input-bg rounded-md p-1 w-32 focus:outline-none focus:ring-2 focus:ring-focus-ring"
                        />
                    ) : (
                        <p 
                            className="font-bold text-text-primary text-base p-1 rounded-md"
                            onClick={handleBalanceClick}
                        >
                            {formatCurrency(category.balance)}
                        </p>
                    )}
            </div>
        </div>
    );
};

export default CategoryCard;