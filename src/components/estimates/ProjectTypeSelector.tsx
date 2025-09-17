import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { TRADE_PROJECT_TYPES, getTradeDisplayName, getTradeIcon } from '@/data/tradeProjectTypes';
import { ProjectType } from '@/types/industry';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProjectTypeSelectorProps {
  userTrade: string;
  onProjectTypeSelect: (projectType: ProjectType) => void;
  onScopeExtracted?: (scope: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

export function ProjectTypeSelector({ 
  userTrade = 'general', 
  onProjectTypeSelect,
  onScopeExtracted,
  value,
  onChange
}: ProjectTypeSelectorProps) {
  const [input, setInput] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<ProjectType[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get trade-specific projects
  const tradeProjects = TRADE_PROJECT_TYPES[userTrade] || TRADE_PROJECT_TYPES.general;

  useEffect(() => {
    if (value !== undefined) {
      setInput(value);
    }
  }, [value]);

  useEffect(() => {
    // Filter suggestions based on input
    if (input.length > 0) {
      const filtered = tradeProjects.filter(project => {
        const searchTerm = input.toLowerCase();
        return project.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm)
        ) || 
        project.name.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm);
      });
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input, tradeProjects]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    onChange?.(newValue);
    setSelectedIndex(-1);
  };

  const selectProjectType = (projectType: ProjectType) => {
    setInput(projectType.name);
    onChange?.(projectType.name);
    setShowSuggestions(false);
    onProjectTypeSelect(projectType);
    
    // Extract scope from project name and description
    if (onScopeExtracted) {
      const scope = `${projectType.name} - ${projectType.description}`;
      onScopeExtracted(scope);
    }

    toast({
      title: "Project Type Selected",
      description: `Auto-populated with ${projectType.autoSequence.length} line items for ${projectType.name}`,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          selectProjectType(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="space-y-3">
      {/* Trade Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-sm">
          <span className="mr-1">{getTradeIcon(userTrade)}</span>
          {getTradeDisplayName(userTrade)}
        </Badge>
      </div>

      {/* Input Field */}
      <div className="relative">
        <Label htmlFor="project-type">What type of Project</Label>
        <div className="relative mt-1">
          <Input
            ref={inputRef}
            id="project-type"
            type="text"
            placeholder={`Start typing project type (e.g., ${tradeProjects[0]?.keywords[0] || 'kitchen'})`}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (filteredSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="pr-8"
          />
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showSuggestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground">Popular:</span>
        {tradeProjects.slice(0, 3).map(project => (
          <Button
            key={project.id}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => selectProjectType(project)}
            className="text-xs"
          >
            {project.name}
          </Button>
        ))}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <Card 
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full overflow-hidden shadow-lg"
        >
          <ScrollArea className="max-h-64">
            <div className="p-1">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => selectProjectType(suggestion)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    selectedIndex === index && "bg-accent text-accent-foreground"
                  )}
                >
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {suggestion.description}
                  </div>
                  {suggestion.estimatedDuration && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {suggestion.estimatedDuration}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* No suggestions message */}
      {showSuggestions && filteredSuggestions.length === 0 && input.length > 0 && (
        <Card className="absolute z-50 mt-1 w-full p-3">
          <p className="text-sm text-muted-foreground">
            No matching project types found. Try different keywords or continue with custom description.
          </p>
        </Card>
      )}
    </div>
  );
}