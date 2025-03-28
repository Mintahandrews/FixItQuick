import { useNavigate } from 'react-router-dom';
import { Category } from '../types';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();
  
  // Dynamically get the icon component
  const IconComponent = (Icons as any)[category.icon] || Icons.HelpCircle;
  
  const handleClick = () => {
    navigate(`/category/${category.id}`);
  };
  
  return (
    <div 
      className="card flex flex-col items-center text-center p-5 cursor-pointer hover:shadow-md group"
      onClick={handleClick}
    >
      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-3 transition-transform group-hover:scale-110">
        <IconComponent size={24} />
      </div>
      <h3 className="font-medium mb-1">{category.name}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{category.description}</p>
    </div>
  );
}
