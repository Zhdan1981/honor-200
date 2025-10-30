import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { TransactionType } from '../types';
import type { Category, NewTransactionData } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewTransactionData[]) => void;
  categories: Category[];
  defaultCategoryId: string;
}

interface TransactionRowState {
    id: number;
    amount: string;
    note: string;
    categoryId: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, categories, defaultCategoryId }) => {
    const [activeTab, setActiveTab] = useState<TransactionType>(TransactionType.EXPENSE);

    const createNewRow = (): TransactionRowState => ({
        id: Date.now() + Math.random(),
        amount: '',
        note: '',
        categoryId: defaultCategoryId,
    });

    const [rows, setRows] = useState<TransactionRowState[]>([createNewRow()]);

    useEffect(() => {
        setRows([createNewRow()]);
        setActiveTab(TransactionType.EXPENSE);
    }, [isOpen, defaultCategoryId]);

    if (!isOpen) return null;

    const handleRowChange = <K extends keyof TransactionRowState>(index: number, field: K, value: TransactionRowState[K]) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const addRow = () => {
        setRows([...rows, createNewRow()]);
    };
    
    const removeRow = (index: number) => {
        if(rows.length > 1) {
            const newRows = rows.filter((_, i) => i !== index);
            setRows(newRows);
        }
    };

    const handleSave = () => {
        const dataToSave: NewTransactionData[] = rows
            .filter(row => parseFloat(row.amount.replace(',', '.')) > 0)
            .map(row => {
                const category = categories.find(c => c.id === row.categoryId);
                return {
                    type: activeTab,
                    amount: parseFloat(row.amount.replace(',', '.')) || 0,
                    who: category?.name || 'Неизвестно',
                    note: row.note,
                    categoryId: row.categoryId,
                };
            });
        if(dataToSave.length > 0) {
            onSave(dataToSave);
        }
        onClose();
    };

    const titleText = `Добавить ${activeTab === TransactionType.EXPENSE ? 'расход' : 'доход'}`;
    const buttonText = `Добавить ${activeTab === TransactionType.EXPENSE ? (rows.length > 1 ? 'расходы' : 'расход') : (rows.length > 1 ? 'доходы' : 'доход')}`;

    return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-card-primary rounded-2xl shadow-xl w-[95%] max-w-md max-h-[90vh] flex flex-col text-text-primary">
        <div className="p-4 border-b border-border-primary flex justify-between items-center">
          <h2 className="text-lg font-semibold">{titleText}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-card-hover">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={() => setActiveTab(TransactionType.INCOME)}
                    className={`flex items-center justify-center p-2 rounded-lg transition-colors ${activeTab === TransactionType.INCOME ? 'bg-green-500/80 text-white' : 'bg-card-hover text-text-secondary hover:bg-opacity-80'}`}
                >
                    <Plus size={16} className="mr-1" /> Доход
                </button>
                 <button 
                    onClick={() => setActiveTab(TransactionType.EXPENSE)}
                    className={`flex items-center justify-center p-2 rounded-lg transition-colors ${activeTab === TransactionType.EXPENSE ? 'bg-red-500/80 text-white' : 'bg-card-hover text-text-secondary hover:bg-opacity-80'}`}
                >
                    <Minus size={16} className="mr-1" /> Расход
                </button>
            </div>
            {rows.map((row, index) => (
                <div key={row.id} className="p-4 bg-bg-primary border border-border-primary rounded-xl space-y-4 relative">
                     <div className="flex justify-between items-center">
                        <p className="font-semibold text-text-secondary">Транзакция {index + 1}</p>
                        {rows.length > 1 && (
                            <button onClick={() => removeRow(index)} className="p-1 text-text-secondary hover:text-red-500">
                                <Trash2 size={16}/>
                            </button>
                        )}
                     </div>
                    
                    <input 
                        type="number" 
                        placeholder="Сумма (₽)" 
                        value={row.amount} 
                        onChange={e => handleRowChange(index, 'amount', e.target.value)} 
                        className="w-full p-2.5 border-none rounded-lg bg-input-bg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-focus-ring" 
                    />
                    <input 
                        type="text" 
                        placeholder="Описание (необязательно)" 
                        value={row.note} 
                        onChange={e => handleRowChange(index, 'note', e.target.value)} 
                        className="w-full p-2.5 border-none rounded-lg bg-input-bg text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-focus-ring" 
                    />
                    <div>
                        <p className="text-text-secondary mb-2">Категория:</p>
                        <div className="flex flex-wrap gap-2">
                             {categories.map(category => (
                                <label key={category.id} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`category-${row.id}`}
                                        value={category.id}
                                        checked={row.categoryId === category.id}
                                        onChange={(e) => handleRowChange(index, 'categoryId', e.target.value)}
                                        className="hidden peer"
                                    />
                                    <div className="flex items-center px-3 py-1.5 rounded-full border border-border-primary bg-card-hover peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-offset-bg-primary"
                                        style={row.categoryId === category.id ? { borderColor: category.color, backgroundColor: `${category.color}20` } : {}}
                                    >
                                        <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: category.color }}></span>
                                        <span className="text-sm text-text-primary">{category.name}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addRow} className="w-full flex items-center justify-center p-2.5 border-2 border-dashed rounded-lg border-border-primary text-text-secondary hover:bg-card-hover hover:text-text-primary">
                <Plus size={16} className="mr-2" /> Добавить ещё транзакцию
            </button>
        </div>
        
        <div className="p-4 mt-auto">
          <button onClick={handleSave} className="w-full px-4 py-3 bg-btn-primary-bg text-btn-primary-text font-semibold rounded-lg hover:opacity-90 transition-opacity">{buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;