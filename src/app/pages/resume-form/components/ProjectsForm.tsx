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

const projectSchema = z.object({
  name: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface Project {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  url: string;
}

const ProjectsForm = () => {
  const { resumeData, addProject, updateProject, removeProject } = useResumeStore();
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      description: '',
      highlights: [],
      url: '',
    },
  });
  
  const onSubmit = (data: ProjectFormValues) => {
    const projectData = {
      ...data,
      highlights: highlights,
      // Make sure all required fields are present
      endDate: data.endDate || '',
      url: data.url || '',
    } as Project;
    
    if (selectedProjectIndex !== null) {
      updateProject(selectedProjectIndex, projectData);
      setSelectedProjectIndex(null);
    } else {
      addProject(projectData);
    }
    
    form.reset();
    setHighlights([]);
  };
  
  const handleEdit = (index: number) => {
    const project = resumeData.projects[index];
    setSelectedProjectIndex(index);
    setHighlights(project.highlights || []);
    
    form.reset({
      name: project.name,
      startDate: project.startDate,
      endDate: project.endDate,
      description: project.description,
      highlights: project.highlights,
      url: project.url,
    });
  };
  
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      removeProject(index);
      
      if (selectedProjectIndex === index) {
        setSelectedProjectIndex(null);
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
    setSelectedProjectIndex(null);
    form.reset();
    setHighlights([]);
  };
  
  // Thêm handler để cập nhật trực tiếp khi dữ liệu thay đổi
  const handleFieldChange = (field: string, value: string) => {
    if (selectedProjectIndex !== null) {
      updateProject(selectedProjectIndex, {
        [field]: value
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Projects</h3>
        <p className="text-sm text-gray-500">Add your personal or professional projects</p>
      </div>
      
      {resumeData.projects.length > 0 && (
        <div className="space-y-4">
          {resumeData.projects.map((project, index) => (
            <Card 
              key={index} 
              className={selectedProjectIndex === index ? 'border-primary' : ''}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {project.startDate} - {project.endDate || 'Present'}
                    </p>
                  </div>
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Project Link
                    </a>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{project.description}</p>
                {project.highlights && project.highlights.length > 0 && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Highlights:</h4>
                    <ul className="list-inside list-disc pl-2">
                      {project.highlights.map((highlight, i) => (
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
                {selectedProjectIndex !== null ? 'Edit Project' : 'Add Project'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Portfolio Website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://myproject.com" {...field} />
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
                      <FormLabel>Start Date*</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="YYYY-MM-DD" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            if (selectedProjectIndex !== null) {
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
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="YYYY-MM-DD" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            if (selectedProjectIndex !== null) {
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project..."
                        className="min-h-[100px]"
                        {...field}
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
                    placeholder="Add key achievements or features"
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
              {selectedProjectIndex !== null && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {selectedProjectIndex !== null ? 'Update' : 'Add'} Project
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ProjectsForm; 