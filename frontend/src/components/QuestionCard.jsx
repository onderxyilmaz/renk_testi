import { useState, useEffect } from 'react';

const QuestionCard = ({ 
  question, 
  selectedOptions = [], 
  onOptionSelect, 
  onNextQuestion, 
  onPrevQuestion, 
  showPrev, 
  showNext, 
  showFinish 
}) => {
  const [localSelected, setLocalSelected] = useState([]);
  
  useEffect(() => {
    setLocalSelected(selectedOptions);
  }, [selectedOptions]);
  
  const handleOptionClick = (option) => {
    // If this option is already selected, remove it
    if (localSelected.some(selection => selection.key === option.key)) {
      const updatedSelections = localSelected.filter(
        selection => selection.key !== option.key
      );
      setLocalSelected(updatedSelections);
      onOptionSelect(updatedSelections);
      return;
    }
    
    // Handle max 2 selections
    if (localSelected.length >= 2) {
      return;
    }
    
    // Add the new selection with points (2 points for first, 1 point for second)
    const newSelection = {
      key: option.key,
      points: localSelected.length === 0 ? 2 : 1
    };
    
    const updatedSelections = [...localSelected, newSelection];
    setLocalSelected(updatedSelections);
    onOptionSelect(updatedSelections);
  };
  
  const isSelected = (key) => {
    return localSelected.some(option => option.key === key);
  };
  
  const getSelectionOrder = (key) => {
    const index = localSelected.findIndex(option => option.key === key);
    return index !== -1 ? index + 1 : null;
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 bg-gray-100 p-2 rounded">
        Soru {question.questionNumber}: {question.text}
      </h2>
      
      <div className="space-y-3 mb-6">
        {question.options.map((option) => (
          <div
            key={option.key}
            className={`p-3 border rounded-md cursor-pointer flex items-center ${
              isSelected(option.key) 
                ? 'border-blue-500 bg-blue-100 text-gray-800' 
                : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleOptionClick(option)}
          >
            <div className="flex-grow">
              <span className="font-medium">{option.key})</span> {option.text}
            </div>
            {isSelected(option.key) && (
              <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                {getSelectionOrder(option.key)}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-6">
        {showPrev && (
          <button
            onClick={onPrevQuestion}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Önceki Soru
          </button>
        )}
        
        <div className="flex-grow"></div>
        
        {showNext && (
          <button
            onClick={onNextQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={localSelected.length === 0}
          >
            Sonraki Soru
          </button>
        )}
        
        {showFinish && (
          <button
            onClick={onNextQuestion}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={localSelected.length === 0}
          >
            Testi Tamamla
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
