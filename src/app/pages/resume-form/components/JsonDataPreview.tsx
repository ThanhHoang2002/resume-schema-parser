import { Check, Copy, Download } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Resume } from '@/stores/resumeStore';

interface JsonDataPreviewProps {
  resumeData: Resume;
  onSave: () => void;
}

const JsonDataPreview = ({ resumeData, onSave }: JsonDataPreviewProps) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  
  // Remove internal properties for the display JSON
  const resumeForExport = {
    basics: resumeData.basics,
    work: resumeData.work,
    volunteer: resumeData.volunteer,
    education: resumeData.education,
    awards: resumeData.awards,
    certificates: resumeData.certificates,
    publications: resumeData.publications,
    skills: resumeData.skills,
    languages: resumeData.languages,
    interests: resumeData.interests,
    references: resumeData.references,
    projects: resumeData.projects,
  };
  
  const stringifiedJson = JSON.stringify(resumeForExport, null, 2);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(stringifiedJson);
      setIsCopied(true);
      toast({
        title: 'Copied!',
        description: 'JSON data copied to clipboard',
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to copy JSON to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:application/json;charset=utf-8,' + encodeURIComponent(stringifiedJson);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `resume-${resumeData.basics.name || 'export'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: 'Downloaded!',
      description: 'JSON file has been downloaded',
    });
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>JSON Resume Data</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCopyJson}
                className="flex items-center gap-1"
              >
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                {isCopied ? 'Copied' : 'Copy JSON'}
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleDownloadJson}
                className="flex items-center gap-1"
              >
                <Download size={16} />
                Download JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="max-h-[600px] overflow-auto">
          <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-xs">{stringifiedJson}</pre>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={onSave} className="w-full">
            Save Resume
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            This will save your resume data to your local storage.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonDataPreview; 