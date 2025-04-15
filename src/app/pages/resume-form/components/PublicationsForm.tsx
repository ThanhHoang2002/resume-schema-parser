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
import { useResumeStore, Publication } from '@/stores/resumeStore';

const publicationSchema = z.object({
  name: z.string().optional(),
  publisher: z.string().optional(),
  releaseDate: z.string().optional(),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  summary: z.string().optional(),
});

type PublicationFormValues = z.infer<typeof publicationSchema>;

const PublicationsForm = () => {
  const { resumeData, addPublication, updatePublication, removePublication } = useResumeStore();
  const [selectedPublicationIndex, setSelectedPublicationIndex] = useState<number | null>(null);
  
  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      name: '',
      publisher: '',
      releaseDate: '',
      url: '',
      summary: '',
    },
  });
  
  const onSubmit = (data: PublicationFormValues) => { 
    const publicationData: Publication = {
      name: data.name || '',
      publisher: data.publisher || '',
      releaseDate: data.releaseDate || '',
      url: data.url || '',
      summary: data.summary || '',
    };
    
    if (selectedPublicationIndex !== null) {
      updatePublication(selectedPublicationIndex, publicationData);
      setSelectedPublicationIndex(null);
    } else {
      addPublication(publicationData);
    }
    
    form.reset();
  };
  
  const handleEdit = (index: number) => {
    const publication = resumeData.publications[index];
    setSelectedPublicationIndex(index);
    
    form.reset({
      name: publication.name,
      publisher: publication.publisher,
      releaseDate: publication.releaseDate,
      url: publication.url,
      summary: publication.summary,
    });
  };
  
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      removePublication(index);
      
      if (selectedPublicationIndex === index) {
        setSelectedPublicationIndex(null);
        form.reset();
      }
    }
  };
  
  const handleCancel = () => {
    setSelectedPublicationIndex(null);
    form.reset();
  };
  
  // Thêm handler để cập nhật trực tiếp khi dữ liệu thay đổi
  const handleFieldChange = (field: string, value: string) => {
    if (selectedPublicationIndex !== null) {
      updatePublication(selectedPublicationIndex, {
        [field]: value
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Publications</h3>
        <p className="text-sm text-gray-500">Add articles, papers, books or other publications you&apos;ve authored</p>
      </div>
      
      {resumeData.publications.length > 0 && (
        <div className="space-y-4">
          {resumeData.publications.map((publication, index) => (
            <Card key={index} className={selectedPublicationIndex === index ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{publication.name}</CardTitle>
                    <p className="text-sm text-gray-500">Published by {publication.publisher}</p>
                    {publication.url && (
                      <a
                        href={publication.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Publication
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">{publication.releaseDate}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {publication.summary && <p className="mb-2">{publication.summary}</p>}
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
                {selectedPublicationIndex !== null ? 'Edit Publication' : 'Add Publication'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Machine Learning Fundamentals" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publisher*</FormLabel>
                      <FormControl>
                        <Input placeholder="Journal of Technology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="releaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Date*</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="YYYY-MM-DD" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            if (selectedPublicationIndex !== null) {
                              handleFieldChange('releaseDate', e.target.value);
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
                    <FormLabel>Publication URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://journal.example.com/article" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief summary of your publication" 
                        className="min-h-[100px] resize-y"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              {selectedPublicationIndex !== null && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {selectedPublicationIndex !== null ? 'Update' : 'Add'} Publication
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default PublicationsForm; 