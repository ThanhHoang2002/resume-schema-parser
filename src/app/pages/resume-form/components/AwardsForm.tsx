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
import { useResumeStore, Award } from '@/stores/resumeStore';

const awardSchema = z.object({
  title: z.string().min(1, 'Award title is required'),
  date: z.string().min(1, 'Date is required'),
  awarder: z.string().min(1, 'Awarder is required'),
  summary: z.string().optional(),
});

type AwardFormValues = z.infer<typeof awardSchema>;

const AwardsForm = () => {
  const { resumeData, addAward, updateAward, removeAward } = useResumeStore();
  const [selectedAwardIndex, setSelectedAwardIndex] = useState<number | null>(null);
  
  const form = useForm<AwardFormValues>({
    resolver: zodResolver(awardSchema),
    defaultValues: {
      title: '',
      date: '',
      awarder: '',
      summary: '',
    },
  });
  
  const onSubmit = (data: AwardFormValues) => {
    const awardData: Award = {
      ...data,
      summary: data.summary || '',
    };
    
    if (selectedAwardIndex !== null) {
      updateAward(selectedAwardIndex, awardData);
      setSelectedAwardIndex(null);
    } else {
      addAward(awardData);
    }
    
    form.reset();
  };
  
  const handleEdit = (index: number) => {
    const award = resumeData.awards[index];
    setSelectedAwardIndex(index);
    
    form.reset({
      title: award.title,
      date: award.date,
      awarder: award.awarder,
      summary: award.summary,
    });
  };
  
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this award?')) {
      removeAward(index);
      
      if (selectedAwardIndex === index) {
        setSelectedAwardIndex(null);
        form.reset();
      }
    }
  };
  
  const handleCancel = () => {
    setSelectedAwardIndex(null);
    form.reset();
  };
  
  // Thêm handler để cập nhật trực tiếp khi dữ liệu thay đổi
  const handleFieldChange = (field: string, value: string) => {
    if (selectedAwardIndex !== null) {
      updateAward(selectedAwardIndex, {
        [field]: value
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Awards</h3>
        <p className="text-sm text-gray-500">Add awards and recognition you&apos;ve received</p>
      </div>
      
      {resumeData.awards.length > 0 && (
        <div className="space-y-4">
          {resumeData.awards.map((award, index) => (
            <Card key={index} className={selectedAwardIndex === index ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{award.title}</CardTitle>
                    <p className="text-sm text-gray-500">Awarded by {award.awarder}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">{award.date}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {award.summary && <p className="mb-2">{award.summary}</p>}
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
                {selectedAwardIndex !== null ? 'Edit Award' : 'Add Award'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Award Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Employee of the Year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Received*</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="YYYY-MM-DD" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            if (selectedAwardIndex !== null) {
                              handleFieldChange('date', e.target.value);
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
                  name="awarder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Awarded By*</FormLabel>
                      <FormControl>
                        <Input placeholder="Company/Organization" {...field} />
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
                        placeholder="Brief description about this award" 
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
              {selectedAwardIndex !== null && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {selectedAwardIndex !== null ? 'Update' : 'Add'} Award
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default AwardsForm; 