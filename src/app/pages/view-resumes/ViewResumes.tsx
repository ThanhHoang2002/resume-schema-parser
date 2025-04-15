import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useResumeStore, Resume } from '@/stores/resumeStore';

const ViewResumes = () => {
  const { resumes, deleteResume, exportResume } = useResumeStore();
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      deleteResume(id);
    }
  };
  
  const handleExport = (id: string) => {
    exportResume(id);
  };

  const handleCopyJson = async (resume: Resume) => {
    try {
      // Remove internal properties for the copied JSON
      const resumeForExport = {
        basics: resume.basics,
        work: resume.work,
        volunteer: resume.volunteer,
        education: resume.education,
        awards: resume.awards,
        certificates: resume.certificates,
        publications: resume.publications,
        skills: resume.skills,
        languages: resume.languages,
        interests: resume.interests,
        references: resume.references,
        projects: resume.projects,
      };
      
      const jsonString = JSON.stringify(resumeForExport, null, 2);
      await navigator.clipboard.writeText(jsonString);
      
      setCopiedId(resume.id);
      toast({
        title: 'Copied!',
        description: 'JSON data copied to clipboard',
      });
      
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to copy JSON to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Saved Resumes</h1>
        <Link to="/">
          <Button variant="outline">Add New Resume</Button>
        </Link>
      </div>
      
      {resumes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-gray-500">No resumes found. Create your first resume!</p>
            <Link to="/">
              <Button>Create Resume</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume: Resume) => (
            <Card 
              key={resume.id} 
              className={`cursor-pointer transition-all ${selectedResumeId === resume.id ? 'border-primary' : ''}`}
              onClick={() => setSelectedResumeId(resume.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {resume.basics?.name || 'Unnamed Resume'}
                  </CardTitle>
                  <Badge>{new Date(resume.createdAt).toLocaleDateString()}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 line-clamp-2 text-gray-500">
                  {resume.basics?.summary || 'No summary provided'}
                </p>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyJson(resume);
                    }}
                    className="flex items-center gap-1"
                  >
                    {copiedId === resume.id ? <Check size={16} /> : <Copy size={16} />}
                    {copiedId === resume.id ? 'Copied' : 'Copy JSON'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(resume.id);
                    }}
                  >
                    Export
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(resume.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewResumes; 