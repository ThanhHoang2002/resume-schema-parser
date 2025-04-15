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
import { useResumeStore, Volunteer } from '@/stores/resumeStore';

const volunteerSchema = z.object({
  organization: z.string().optional(),
  position: z.string().optional(),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

type VolunteerFormValues = z.infer<typeof volunteerSchema>;

const VolunteerForm = () => {
  const { resumeData, addVolunteer, updateVolunteer, removeVolunteer } = useResumeStore();
  const [selectedVolunteerIndex, setSelectedVolunteerIndex] = useState<number | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  
  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      organization: '',
      position: '',
      url: '',
      startDate: '',
      endDate: '',
      summary: '',
      highlights: [],
    },
  });
  const onSubmit = (data: VolunteerFormValues) => {
    const volunteerData: Volunteer = {
      organization: data.organization || '',
      position: data.position || '',
      url: data.url || '',
      startDate: data.startDate || '',
      highlights: highlights,
      endDate: data.endDate || '',
      summary: data.summary || '',
    };
    
    if (selectedVolunteerIndex !== null) {
      updateVolunteer(selectedVolunteerIndex, volunteerData);
      setSelectedVolunteerIndex(null);
    } else {
      addVolunteer(volunteerData);
    }
    
    form.reset();
    setHighlights([]);
  };
  
  const handleEdit = (index: number) => {
    const volunteer = resumeData.volunteer[index];
    setSelectedVolunteerIndex(index);
    setHighlights(volunteer.highlights || []);
    
    form.reset({
      organization: volunteer.organization,
      position: volunteer.position,
      url: volunteer.url,
      startDate: volunteer.startDate,
      endDate: volunteer.endDate,
      summary: volunteer.summary,
      highlights: volunteer.highlights,
    });
  };
  
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this volunteer experience?')) {
      removeVolunteer(index);
      
      if (selectedVolunteerIndex === index) {
        setSelectedVolunteerIndex(null);
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
    setSelectedVolunteerIndex(null);
    form.reset();
    setHighlights([]);
  };
  
  // Thêm handler để cập nhật trực tiếp khi dữ liệu thay đổi
  const handleFieldChange = (field: string, value: string) => {
    if (selectedVolunteerIndex !== null) {
      updateVolunteer(selectedVolunteerIndex, {
        [field]: value
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Volunteer Experience</h3>
        <p className="text-sm text-gray-500">Add your volunteer work experience</p>
      </div>
      
      {resumeData.volunteer.length > 0 && (
        <div className="space-y-4">
          {resumeData.volunteer.map((volunteer, index) => (
            <Card key={index} className={selectedVolunteerIndex === index ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{volunteer.position}</CardTitle>
                    <p className="text-sm text-gray-500">{volunteer.organization}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">
                      {volunteer.startDate} - {volunteer.endDate || 'Present'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {volunteer.summary && <p className="mb-2">{volunteer.summary}</p>}
                {volunteer.highlights && volunteer.highlights.length > 0 && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Highlights:</h4>
                    <ul className="list-inside list-disc pl-2">
                      {volunteer.highlights.map((highlight, i) => (
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
                {selectedVolunteerIndex !== null ? 'Edit Volunteer Experience' : 'Add Volunteer Experience'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Habitat for Humanity" {...field} />
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
                      <FormLabel>Position*</FormLabel>
                      <FormControl>
                        <Input placeholder="Volunteer Coordinator" {...field} />
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
                    <FormLabel>Organization Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://organization.org" {...field} />
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
                            if (selectedVolunteerIndex !== null) {
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
                            if (selectedVolunteerIndex !== null) {
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
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief summary of your volunteer experience" 
                        className="min-h-[100px] resize-y"
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
                    placeholder="Add highlight or achievement"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={handleAddHighlight}>
                    Add
                  </Button>
                </div>
                
                {highlights.length > 0 && (
                  <div className="space-y-2">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md border p-2">
                        <span className="text-sm">{highlight}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveHighlight(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {selectedVolunteerIndex !== null && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {selectedVolunteerIndex !== null ? 'Update' : 'Add'} Volunteer Experience
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default VolunteerForm; 