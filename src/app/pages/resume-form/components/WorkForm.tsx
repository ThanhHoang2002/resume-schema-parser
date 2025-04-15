import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useResumeStore } from '@/stores/resumeStore';

const workSchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

type WorkFormValues = z.infer<typeof workSchema>;

interface WorkExperience {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
}

const WorkForm = () => {
  const { resumeData, addWorkExperience, updateWorkExperience, removeWorkExperience } = useResumeStore();
  const [selectedWorkIndex, setSelectedWorkIndex] = useState<number | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  
  const form = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      name: '',
      position: '',
      url: '',
      startDate: '',
      endDate: '',
      summary: '',
      highlights: [],
    },
  });
  
  const handleFieldChange = (field: string, value: string) => {
    if (selectedWorkIndex !== null) {
      updateWorkExperience(selectedWorkIndex, {
        [field]: value
      });
    }
  };
  
  const onSubmit = (data: WorkFormValues) => {
    const workData = {
      ...data,
      highlights: highlights,
      // Make sure all required fields are present
      url: data.url || '',
      endDate: data.endDate || '',
      summary: data.summary || '',
    } as WorkExperience;
    
    if (selectedWorkIndex !== null) {
      updateWorkExperience(selectedWorkIndex, workData);
      setSelectedWorkIndex(null);
    } else {
      addWorkExperience(workData);
    }
    
    form.reset();
    setHighlights([]);
  };
  
  const handleEdit = (index: number) => {
    const work = resumeData.work[index];
    setSelectedWorkIndex(index);
    setHighlights(work.highlights || []);
    
    form.reset({
      name: work.name,
      position: work.position,
      url: work.url,
      startDate: work.startDate,
      endDate: work.endDate,
      summary: work.summary,
      highlights: work.highlights,
    });
  };
  
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this work experience?')) {
      removeWorkExperience(index);
      
      if (selectedWorkIndex === index) {
        setSelectedWorkIndex(null);
        form.reset();
        setHighlights([]);
      }
    }
  };
  
  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights([...highlights, newHighlight]);
      setNewHighlight('');
    }
  };
  
  const handleRemoveHighlight = (index: number) => {
    const newHighlights = [...highlights];
    newHighlights.splice(index, 1);
    setHighlights(newHighlights);
  };
  
  const handleCancel = () => {
    setSelectedWorkIndex(null);
    form.reset();
    setHighlights([]);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Work Experience</h3>
        <p className="text-sm text-gray-500">Add your professional work experience</p>
      </div>
      
      {resumeData.work.length > 0 && (
        <div className="space-y-4">
          {resumeData.work.map((work, index) => (
            <Card key={index} className={selectedWorkIndex === index ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{work.position}</CardTitle>
                    <p className="text-sm text-gray-500">{work.name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">
                      {work.startDate} - {work.endDate || 'Present'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {work.summary && <p className="mb-2">{work.summary}</p>}
                {work.highlights && work.highlights.length > 0 && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Highlights:</h4>
                    <ul className="list-inside list-disc pl-2">
                      {work.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm">{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedWorkIndex !== null ? 'Edit Work Experience' : 'Add Work Experience'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Acme Inc." 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            if (selectedWorkIndex !== null) {
                              handleFieldChange('name', e.target.value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Senior Developer" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            if (selectedWorkIndex !== null) {
                              handleFieldChange('position', e.target.value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Website</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://company.com" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          if (selectedWorkIndex !== null) {
                            handleFieldChange('url', e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date (YYYY-MM-DD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="2023-01-15" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            if (selectedWorkIndex !== null) {
                              handleFieldChange('startDate', e.target.value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (YYYY-MM-DD or leave empty for current)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="2023-12-31" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            if (selectedWorkIndex !== null) {
                              handleFieldChange('endDate', e.target.value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your responsibilities and achievements..."
                        className="min-h-[120px]"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (selectedWorkIndex !== null) {
                            handleFieldChange('summary', e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Highlights</FormLabel>
                <div className="mb-2 flex space-x-2">
                  <Input
                    placeholder="Add a key achievement or responsibility"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddHighlight}
                  >
                    Add
                  </Button>
                </div>
                
                {highlights.length > 0 && (
                  <ul className="space-y-2">
                    {highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Badge>
                          {highlight}
                          <button
                            type="button"
                            className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-300"
                            onClick={() => handleRemoveHighlight(index)}
                          >
                            ✕
                          </button>
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {selectedWorkIndex !== null && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {selectedWorkIndex !== null ? 'Update' : 'Add'} Work Experience
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default WorkForm; 