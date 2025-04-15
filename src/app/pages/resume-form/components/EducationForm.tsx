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

const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  area: z.string().min(1, 'Area of study is required'),
  studyType: z.string().min(1, 'Degree/Study type is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  score: z.string().optional(),
  courses: z.array(z.string()).optional(),
});

type EducationFormValues = z.infer<typeof educationSchema>;

interface Education {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
  courses: string[];
}

const EducationForm = () => {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResumeStore();
  const [selectedEducationIndex, setSelectedEducationIndex] = useState<number | null>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [newCourse, setNewCourse] = useState('');
  
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      url: '',
      area: '',
      studyType: '',
      startDate: '',
      endDate: '',
      score: '',
      courses: [],
    },
  });
  
  const onSubmit = (data: EducationFormValues) => {
    const educationData = {
      ...data,
      courses: courses,
      // Make sure all required fields are present
      url: data.url || '',
      endDate: data.endDate || '',
      score: data.score || '',
    } as Education;
    
    if (selectedEducationIndex !== null) {
      updateEducation(selectedEducationIndex, educationData);
      setSelectedEducationIndex(null);
    } else {
      addEducation(educationData);
    }
    
    form.reset();
    setCourses([]);
  };
  
  const handleEdit = (index: number) => {
    const education = resumeData.education[index];
    setSelectedEducationIndex(index);
    setCourses(education.courses || []);
    
    form.reset({
      institution: education.institution,
      url: education.url,
      area: education.area,
      studyType: education.studyType,
      startDate: education.startDate,
      endDate: education.endDate,
      score: education.score,
      courses: education.courses,
    });
  };
  
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      removeEducation(index);
      
      if (selectedEducationIndex === index) {
        setSelectedEducationIndex(null);
        form.reset();
        setCourses([]);
      }
    }
  };
  
  const handleAddCourse = () => {
    if (newCourse.trim()) {
      setCourses([...courses, newCourse]);
      setNewCourse('');
    }
  };
  
  const handleRemoveCourse = (index: number) => {
    const newCourses = [...courses];
    newCourses.splice(index, 1);
    setCourses(newCourses);
  };
  
  const handleCancel = () => {
    setSelectedEducationIndex(null);
    form.reset();
    setCourses([]);
  };
  
  // Thêm handler để cập nhật trực tiếp khi dữ liệu thay đổi
  const handleFieldChange = (field: string, value: string) => {
    if (selectedEducationIndex !== null) {
      updateEducation(selectedEducationIndex, {
        [field]: value
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Education</h3>
        <p className="text-sm text-gray-500">Add your educational background</p>
      </div>
      
      {resumeData.education.length > 0 && (
        <div className="space-y-4">
          {resumeData.education.map((education, index) => (
            <Card key={index} className={selectedEducationIndex === index ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{education.studyType} in {education.area}</CardTitle>
                    <p className="text-sm text-gray-500">{education.institution}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">
                      {education.startDate} - {education.endDate || 'Present'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {education.score && (
                  <p className="mb-2">
                    <span className="font-medium">Score/GPA:</span> {education.score}
                  </p>
                )}
                {education.courses && education.courses.length > 0 && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Relevant Courses:</h4>
                    <ul className="list-inside list-disc pl-2">
                      {education.courses.map((course, i) => (
                        <li key={i} className="text-sm">{course}</li>
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
                {selectedEducationIndex !== null ? 'Edit Education' : 'Add Education'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution*</FormLabel>
                    <FormControl>
                      <Input placeholder="Harvard University" {...field} />
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
                    <FormLabel>Institution Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://harvard.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="studyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree/Study Type*</FormLabel>
                      <FormControl>
                        <Input placeholder="Bachelor of Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study*</FormLabel>
                      <FormControl>
                        <Input placeholder="Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                            if (selectedEducationIndex !== null) {
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
                            if (selectedEducationIndex !== null) {
                              handleFieldChange('endDate', e.target.value);
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
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score/GPA</FormLabel>
                      <FormControl>
                        <Input placeholder="3.8/4.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <FormLabel>Relevant Courses</FormLabel>
                <div className="mb-2 flex space-x-2">
                  <Input
                    placeholder="Add relevant courses"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCourse();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddCourse}
                  >
                    Add
                  </Button>
                </div>
                
                {courses.length > 0 && (
                  <ul className="space-y-2">
                    {courses.map((course, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Badge>
                          {course}
                          <button
                            type="button"
                            className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-300"
                            onClick={() => handleRemoveCourse(index)}
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
              {selectedEducationIndex !== null && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {selectedEducationIndex !== null ? 'Update' : 'Add'} Education
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default EducationForm; 