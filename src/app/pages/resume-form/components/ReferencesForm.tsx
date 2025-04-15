import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useResumeStore, Reference } from '@/stores/resumeStore';

const referenceSchema = z.object({
  name: z.string().optional(),
  reference: z.string().optional(),
});

type ReferenceFormValues = z.infer<typeof referenceSchema>;

const ReferencesForm = () => {
  const { resumeData, addReference, updateReference, removeReference } = useResumeStore();
  const [selectedReferenceIndex, setSelectedReferenceIndex] = useState<number | null>(null);
  
  const form = useForm<ReferenceFormValues>({
    resolver: zodResolver(referenceSchema),
    defaultValues: {
      name: '',
      reference: '',
    },
  });
  const onSubmit = (data: ReferenceFormValues) => {
    const referenceData: Reference = {
      name: data.name || '',
      reference: data.reference || ''
    };
    
    if (selectedReferenceIndex !== null) {
      updateReference(selectedReferenceIndex, referenceData);
      setSelectedReferenceIndex(null);
    } else {
      addReference(referenceData);
    }
    
    form.reset();
  };
  
  const handleEdit = (index: number) => {
    const reference = resumeData.references[index];
    setSelectedReferenceIndex(index);
    
    form.reset({
      name: reference.name,
      reference: reference.reference,
    });
  };
  
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this reference?')) {
      removeReference(index);
      
      if (selectedReferenceIndex === index) {
        setSelectedReferenceIndex(null);
        form.reset();
      }
    }
  };
  
  const handleCancel = () => {
    setSelectedReferenceIndex(null);
    form.reset();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">References</h3>
        <p className="text-sm text-gray-500">Add professional references</p>
      </div>
      
      {resumeData.references.length > 0 && (
        <div className="space-y-4">
          {resumeData.references.map((reference, index) => (
            <Card key={index} className={selectedReferenceIndex === index ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{reference.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-600">&ldquo;{reference.reference}&rdquo;</p>
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
                {selectedReferenceIndex !== null ? 'Edit Reference' : 'Add Reference'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe, CEO at Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Text*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Jane is a hardworking professional who always delivers exceptional results..." 
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
              {selectedReferenceIndex !== null && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {selectedReferenceIndex !== null ? 'Update' : 'Add'} Reference
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ReferencesForm; 