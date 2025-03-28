import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, CircleHelp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What kind of tech problems can FixItQuick help me solve?",
    answer: "FixItQuick provides solutions for common tech issues students face, including keyboard problems, Wi-Fi connectivity issues, battery optimization, display problems, and more. Our guides are designed to be easy to follow even if you're not tech-savvy."
  },
  {
    question: "Are the solutions applicable to all devices and operating systems?",
    answer: "Most of our solutions are available for both Windows and Mac, and we clearly indicate which operating system each solution applies to. When necessary, we provide separate instructions for different operating systems or device types."
  },
  {
    question: "What if I try a solution and it doesn't fix my problem?",
    answer: "If a solution doesn't work for you, try checking if there are alternative methods listed. You can also search for your specific issue or browse related solutions. If you still can't find what you need, use our suggestion form to let us know about the problem you're facing."
  },
  {
    question: "How do I save solutions for later?",
    answer: "You can bookmark any solution by clicking the bookmark icon on the solution card or at the top of the solution page. Your bookmarks are saved locally on your device and can be accessed from the Bookmarks page."
  },
  {
    question: "How can I contribute to FixItQuick?",
    answer: "We welcome contributions! You can suggest new solutions or improvements to existing ones using our suggestion form. Your insights help us build a more comprehensive resource for all students."
  },
  {
    question: "Is my data safe when using FixItQuick?",
    answer: "Yes. FixItQuick doesn't require an account and doesn't collect personal data. Your bookmarks and recently viewed items are stored locally on your device and aren't shared with our servers."
  },
  {
    question: "Are the solutions regularly updated?",
    answer: "Yes, we regularly review and update our solutions to ensure they remain accurate and useful as technology evolves. If you notice outdated information, please let us know through the suggestion form."
  }
];

export default function FAQ() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<{[key: number]: boolean}>({0: true});
  
  const toggleItem = (index: number) => {
    setOpenItems(prev => ({...prev, [index]: !prev[index]}));
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <button 
        className="flex items-center text-blue-600 mb-6 hover:underline"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={20} /> Back
      </button>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 animate-enter">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
            <CircleHelp size={24} />
          </div>
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
        </div>
        
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b dark:border-gray-700 pb-4 last:border-0">
              <button
                className="flex justify-between items-center w-full text-left py-2"
                onClick={() => toggleItem(index)}
              >
                <h3 className="font-medium text-lg">{item.question}</h3>
                <ChevronDown 
                  className={`transform transition-transform ${openItems[index] ? 'rotate-180' : ''}`} 
                  size={20} 
                />
              </button>
              {openItems[index] && (
                <div className="pl-0 py-2 text-gray-600 dark:text-gray-300 animate-slide-up">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center mb-8">
        <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions?</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/suggest')}
        >
          Suggest a New Question
        </button>
      </div>
    </div>
  );
}
