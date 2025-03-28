import { Lightbulb } from 'lucide-react';

interface QuickTipProps {
  title: string;
  content: string;
}

export default function QuickTip({ title, content }: QuickTipProps) {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-4 hover:shadow-md transition-all hover:-translate-y-1 animate-enter">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-800/30 rounded-full text-yellow-600 dark:text-yellow-400 flex-shrink-0">
          <Lightbulb size={18} />
        </div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{content}</p>
        </div>
      </div>
    </div>
  );
}
