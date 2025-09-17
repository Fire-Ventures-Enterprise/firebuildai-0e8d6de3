import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Sparkles, 
  Clock, 
  ChevronRight,
  Building,
  Wrench
} from 'lucide-react';
import {
  ConstructionSequencerService,
  ProjectType,
  Trade
} from '@/services/constructionSequencer';
import { cn } from '@/lib/utils';

interface ProjectTypeSelectorProps {
  tradeType?: string;
  value?: ProjectType | null;
  onChange: (projectType: ProjectType | null) => void;
  onGenerateLineItems?: (projectType: ProjectType) => void;
  className?: string;
}

export function ProjectTypeSelector({
  tradeType = 'general',
  value,
  onChange,
  onGenerateLineItems,
  className
}: ProjectTypeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<string>(tradeType);

  // Get available trades
  const trades = useMemo(() => 
    ConstructionSequencerService.getAllTrades(),
    []
  );

  // Get project types based on search and selected trade
  const filteredProjects = useMemo(() => {
    if (searchQuery.length > 0) {
      return ConstructionSequencerService.searchProjectTypes(searchQuery, selectedTrade);
    }
    return ConstructionSequencerService.getProjectTypesForTrade(selectedTrade);
  }, [searchQuery, selectedTrade]);

  // Auto-detect project type from search query
  useEffect(() => {
    if (searchQuery.length > 3 && !value) {
      const detected = ConstructionSequencerService.detectProjectType(searchQuery, selectedTrade);
      if (detected && filteredProjects.some(p => p.id === detected.id)) {
        // Don't auto-select, just highlight it
      }
    }
  }, [searchQuery, selectedTrade, value, filteredProjects]);

  const handleProjectSelect = (project: ProjectType) => {
    onChange(project);
    setSearchQuery(project.name);
    setIsOpen(false);
  };

  const handleGenerateLineItems = () => {
    if (value && onGenerateLineItems) {
      onGenerateLineItems(value);
    }
  };

  const getTradeIcon = (trade: Trade) => {
    switch (trade.id) {
      case 'plumbing':
        return '🔧';
      case 'hvac':
        return '❄️';
      case 'electrical':
        return '⚡';
      case 'general':
        return '🏗️';
      default:
        return '🛠️';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Trade Type Selection */}
      <div>
        <Label className="text-sm font-medium mb-2">Trade Specialty</Label>
        <div className="flex flex-wrap gap-2">
          {trades.slice(0, 5).map(trade => (
            <Button
              key={trade.id}
              variant={selectedTrade === trade.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTrade(trade.id)}
              className="gap-2"
            >
              <span>{getTradeIcon(trade)}</span>
              {trade.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Project Type Search */}
      <div className="relative">
        <Label htmlFor="project-type" className="text-sm font-medium mb-2">
          What type of Project?
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="project-type"
            type="text"
            placeholder="Start typing project type (e.g., kitchen renovation, bathtub install)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
              if (!e.target.value) onChange(null);
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-4"
          />
          {value && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Selected
              </Badge>
            </div>
          )}
        </div>

        {/* Dropdown Suggestions */}
        {isOpen && filteredProjects.length > 0 && (
          <Card className="absolute z-10 w-full mt-2 p-0 shadow-lg">
            <ScrollArea className="max-h-96">
              <div className="p-2">
                <div className="text-xs text-muted-foreground px-2 py-1 mb-2">
                  {filteredProjects.length} matching project{filteredProjects.length !== 1 ? 's' : ''} found
                </div>
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      "hover:bg-accent",
                      value?.id === project.id && "bg-accent"
                    )}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <Building className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {project.description}
                      </div>
                      {project.estimated_duration && (
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {project.estimated_duration}
                          </div>
                          {project.sequence && (
                            <div className="text-xs text-muted-foreground">
                              {project.sequence.length} work items
                            </div>
                          )}
                        </div>
                      )}
                      {project.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.keywords.slice(0, 3).map(keyword => (
                            <Badge key={keyword} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>

      {/* Selected Project Details */}
      {value && (
        <Card className="p-4 bg-accent/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                {value.name}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {value.description}
              </p>
              {value.sequence && (
                <div className="mt-3 space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    Work Sequence Preview:
                  </div>
                  <div className="text-xs space-y-1">
                    {value.sequence.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-muted-foreground">{item.order}.</span>
                        <span>{item.description}</span>
                        {item.unit && (
                          <Badge variant="outline" className="text-xs ml-auto">
                            {item.unit}
                          </Badge>
                        )}
                      </div>
                    ))}
                    {value.sequence.length > 3 && (
                      <div className="text-muted-foreground">
                        ... and {value.sequence.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {onGenerateLineItems && (
              <Button
                size="sm"
                onClick={handleGenerateLineItems}
                className="ml-4"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Items
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}