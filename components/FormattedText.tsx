import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  // Simple parser for basic markdown-like features strictly requested:
  // **bold**, lists, and newlines.
  
  const processText = (inputText: string) => {
    // Split by newlines first
    const lines = inputText.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Check for bullet points
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
      const content = isBullet ? line.trim().substring(2) : line;
      
      // Split by bold markers
      const parts = content.split(/(\*\*.*?\*\*)/g);
      
      const processedLine = parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIndex} className="font-bold text-inherit">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={partIndex}>{part}</span>;
      });

      if (isBullet) {
        return (
          <div key={lineIndex} className="flex items-start ml-4 mb-1">
            <span className="mr-2 text-current">•</span>
            <span>{processedLine}</span>
          </div>
        );
      }

      // Preserve empty lines as spacers
      if (line.trim() === '') {
        return <div key={lineIndex} className="h-4" />;
      }

      return <div key={lineIndex} className="mb-1">{processedLine}</div>;
    });
  };

  return <div className={`text-base leading-relaxed ${className}`}>{processText(text)}</div>;
};

export default FormattedText;