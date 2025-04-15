import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useResumeStore, Interest } from '@/stores/resumeStore';

const interestSchema = z.object({
  name: z.string().min(1, 'Interest name is required'),
});

type InterestFormValues = z.infer<typeof interestSchema>;

const InterestsForm = () => {
  const { resumeData, addInterest, updateInterest, removeInterest } = useResumeStore();
  const [selectedInterestIndex, setSelectedInterestIndex] = useState<number | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  
  const form = useForm<InterestFormValues>({
    resolver: zodResolver(interestSchema),
    defaultValues: {
      name: '',
    },
  });
  
  const onSubmit = (data: InterestFormValues) => {
    const interestData: Interest = {
      ...data,
      keywords: keywords,
    };
    
    if (selectedInterestIndex !== null) {
      updateInterest(selectedInterestIndex, interestData);
      setSelectedInterestIndex(null);
    } else {
      addInterest(interestData);
    }
    
    form.reset();
    setKeywords([]);
  };
  
  const handleEdit = (index: number) => {
    const interest = resumeData.interests[index];
    setSelectedInterestIndex(index);
    setKeywords(interest.keywords || []);
    
    form.reset({
      name: interest.name,
    });
  };
  
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this interest?')) {
      removeInterest(index);
      
      if (selectedInterestIndex === index) {
        setSelectedInterestIndex(null);
        form.reset();
        setKeywords([]);
      }
    }
  };
  
  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword('');
    }
  };
  
  const handleRemoveKeyword = (index: number) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
  };
  
  const handleCancel = () => {
    setSelectedInterestIndex(null);
    form.reset();
    setKeywords([]);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Interests</h3>
        <p className="text-sm text-gray-500">Add your personal interests or hobbies</p>
      </div>
      
      {resumeData.interests.length > 0 && (
        <div className="space-y-4">
          {resumeData.interests.map((interest, index) => (
            <Card key={index} className={selectedInterestIndex === index ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{interest.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {interest.keywords && interest.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {interest.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="secondary">{keyword}</Badge>
                    ))}
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
                {selectedInterestIndex !== null ? 'Edit Interest' : 'Add Interest'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest*</FormLabel>
                    <FormControl>
                      <Input placeholder="Photography, Music, Hiking, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Keywords</FormLabel>
                <div className="mb-2 flex space-x-2">
                  <Input 
                    placeholder="Add related keywords"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={handleAddKeyword}>
                    Add
                  </Button>
                </div>
                
                {keywords.length > 0 && (
                  <div className="space-y-2">
                    {keywords.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md border p-2">
                        <span className="text-sm">{keyword}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveKeyword(index)}
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
              {selectedInterestIndex !== null && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {selectedInterestIndex !== null ? 'Update' : 'Add'} Interest
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default InterestsForm; 