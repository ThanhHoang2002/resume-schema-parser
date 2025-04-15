import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResumeStore, Language } from '@/stores/resumeStore';

const languageSchema = z.object({
  language: z.string().optional(),
  fluency: z.string().optional(),
});

type LanguageFormValues = z.infer<typeof languageSchema>;

const fluencyLevels = [
  { value: 'Native or Bilingual', label: 'Native or Bilingual' },
  { value: 'Full Professional', label: 'Full Professional' },
  { value: 'Professional Working', label: 'Professional Working' },
  { value: 'Limited Working', label: 'Limited Working' },
  { value: 'Elementary', label: 'Elementary' },
];

const LanguagesForm = () => {
  const { resumeData, addLanguage, updateLanguage, removeLanguage } = useResumeStore();
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState<number | null>(null);
  
  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      language: '',
      fluency: '',
    },
  });
  
  const onSubmit = (data: LanguageFormValues) => {
    const languageData: Language = {
      language: data.language || '',
      fluency: data.fluency || '',
    };
    
    if (selectedLanguageIndex !== null) {
      updateLanguage(selectedLanguageIndex, languageData);
      setSelectedLanguageIndex(null);
    } else {
      addLanguage(languageData);
    }
    
    form.reset();
  };
  
  const handleEdit = (index: number) => {
    const language = resumeData.languages[index];
    setSelectedLanguageIndex(index);
    
    form.reset({
      language: language.language,
      fluency: language.fluency,
    });
  };
  
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this language?')) {
      removeLanguage(index);
      
      if (selectedLanguageIndex === index) {
        setSelectedLanguageIndex(null);
        form.reset();
      }
    }
  };
  
  const handleCancel = () => {
    setSelectedLanguageIndex(null);
    form.reset();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Languages</h3>
        <p className="text-sm text-gray-500">Add languages you speak and your proficiency level</p>
      </div>
      
      {resumeData.languages.length > 0 && (
        <div className="space-y-4">
          {resumeData.languages.map((language, index) => (
            <Card key={index} className={selectedLanguageIndex === index ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{language.language}</CardTitle>
                  <Badge>{language.fluency}</Badge>
                </div>
              </CardHeader>
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
                {selectedLanguageIndex !== null ? 'Edit Language' : 'Add Language'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder="English, Spanish, French, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fluency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fluency Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your fluency level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fluencyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              {selectedLanguageIndex !== null && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {selectedLanguageIndex !== null ? 'Update' : 'Add'} Language
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default LanguagesForm; 