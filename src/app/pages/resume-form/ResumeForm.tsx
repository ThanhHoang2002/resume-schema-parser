import { useState } from 'react';

import AwardsForm from './components/AwardsForm';
import BasicsForm from './components/BasicsForm';
import CertificatesForm from './components/CertificatesForm';
import EducationForm from './components/EducationForm';
import InterestsForm from './components/InterestsForm';
import JsonDataPreview from './components/JsonDataPreview';
import LanguagesForm from './components/LanguagesForm';
import ProjectsForm from './components/ProjectsForm';
import PublicationsForm from './components/PublicationsForm';
import ReferencesForm from './components/ReferencesForm';
import SkillsForm from './components/SkillsForm';
import VolunteerForm from './components/VolunteerForm';
import WorkForm from './components/WorkForm';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useResumeStore } from '@/stores/resumeStore';

const ResumeForm = () => {
  const [activeTab, setActiveTab] = useState('basics');
  const { toast } = useToast();
  const { saveResume, resumeData } = useResumeStore();

  const handleSaveResume = () => {
    saveResume();
    toast({
      title: 'Success!',
      description: 'Your resume data has been saved to local storage.',
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">JSON Resume Schema Builder</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Resume Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-2 flex flex-wrap">
                  <TabsTrigger value="basics" className="flex-grow">Basics</TabsTrigger>
                  <TabsTrigger value="work" className="flex-grow">Work</TabsTrigger>
                  <TabsTrigger value="volunteer" className="flex-grow">Volunteer</TabsTrigger>
                  <TabsTrigger value="education" className="flex-grow">Education</TabsTrigger>
                  <TabsTrigger value="skills" className="flex-grow">Skills</TabsTrigger>
                </TabsList>
                <TabsList className="mb-6 flex flex-wrap">
                  <TabsTrigger value="awards" className="flex-grow">Awards</TabsTrigger>
                  <TabsTrigger value="certificates" className="flex-grow">Certificates</TabsTrigger>
                  <TabsTrigger value="publications" className="flex-grow">Publications</TabsTrigger>
                  <TabsTrigger value="languages" className="flex-grow">Languages</TabsTrigger>
                  <TabsTrigger value="interests" className="flex-grow">Interests</TabsTrigger>
                  <TabsTrigger value="references" className="flex-grow">References</TabsTrigger>
                  <TabsTrigger value="projects" className="flex-grow">Projects</TabsTrigger>
                </TabsList>
                <TabsContent value="basics">
                  <BasicsForm />
                </TabsContent>
                <TabsContent value="work">
                  <WorkForm />
                </TabsContent>
                <TabsContent value="volunteer">
                  <VolunteerForm />
                </TabsContent>
                <TabsContent value="education">
                  <EducationForm />
                </TabsContent>
                <TabsContent value="skills">
                  <SkillsForm />
                </TabsContent>
                <TabsContent value="awards">
                  <AwardsForm />
                </TabsContent>
                <TabsContent value="certificates">
                  <CertificatesForm />
                </TabsContent>
                <TabsContent value="publications">
                  <PublicationsForm />
                </TabsContent>
                <TabsContent value="languages">
                  <LanguagesForm />
                </TabsContent>
                <TabsContent value="interests">
                  <InterestsForm />
                </TabsContent>
                <TabsContent value="references">
                  <ReferencesForm />
                </TabsContent>
                <TabsContent value="projects">
                  <ProjectsForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <JsonDataPreview 
            resumeData={resumeData} 
            onSave={handleSaveResume} 
          />
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default ResumeForm; 