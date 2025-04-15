import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useResumeStore } from '@/stores/resumeStore';

const skillSchema = z.object({
  name: z.string().optional(),
  level: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface Skill {
  name: string;
  level: string;
  keywords: string[];
}

const SkillsForm = () => {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResumeStore();
  const [selectedSkillIndex, setSelectedSkillIndex] = useState<number | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  
  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      level: '',
      keywords: [],
    },
  });
  
  const onSubmit = (data: SkillFormValues) => {
    const skillData = {
      ...data,
      keywords: keywords,
      // Make sure all required fields are present
      level: data.level || '',
    } as Skill;
    
    if (selectedSkillIndex !== null) {
      updateSkill(selectedSkillIndex, skillData);
      setSelectedSkillIndex(null);
    } else {
      addSkill(skillData);
    }
    
    form.reset();
    setKeywords([]);
  };
  
  const handleEdit = (index: number) => {
    const skill = resumeData.skills[index];
    setSelectedSkillIndex(index);
    setKeywords(skill.keywords || []);
    
    form.reset({
      name: skill.name,
      level: skill.level,
      keywords: skill.keywords,
    });
  };
  
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      removeSkill(index);
      
      if (selectedSkillIndex === index) {
        setSelectedSkillIndex(null);
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
    setSelectedSkillIndex(null);
    form.reset();
    setKeywords([]);
  };
  
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Skills</h3>
        <p className="text-sm text-gray-500">Add your technical and professional skills</p>
      </div>
      
      {resumeData.skills.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumeData.skills.map((skill, index) => (
            <Card 
              key={index} 
              className={`${selectedSkillIndex === index ? 'border-primary' : ''}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                  {skill.level && (
                    <Badge variant="secondary">{skill.level}</Badge>
                  )}
                </div>
              </CardHeader>
              {skill.keywords && skill.keywords.length > 0 && (
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1">
                    {skill.keywords.map((keyword, i) => (
                      <Badge key={i} variant="outline">{keyword}</Badge>
                    ))}
                  </div>
                </CardContent>
              )}
              <CardFooter className="flex justify-end space-x-2 pt-4">
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
                {selectedSkillIndex !== null ? 'Edit Skill' : 'Add Skill'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Web Development" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Level</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Select skill level</option>
                          {skillLevels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <FormLabel>Keywords</FormLabel>
                <div className="mb-2 flex space-x-2">
                  <Input
                    placeholder="Add technologies, tools, etc."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddKeyword}
                  >
                    Add
                  </Button>
                </div>
                
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <Badge key={index} className="flex items-center">
                        {keyword}
                        <button
                          type="button"
                          className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-300"
                          onClick={() => handleRemoveKeyword(index)}
                        >
                          ✕
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              {selectedSkillIndex !== null && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {selectedSkillIndex !== null ? 'Update' : 'Add'} Skill
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default SkillsForm; 