import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useResumeStore, Certificate } from '@/stores/resumeStore';

const certificateSchema = z.object({
  name: z.string().optional(),
  date: z.string().optional(),
  issuer: z.string().optional(),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type CertificateFormValues = z.infer<typeof certificateSchema>;

const CertificatesForm = () => {
  const { resumeData, addCertificate, updateCertificate, removeCertificate } = useResumeStore();
  const [selectedCertificateIndex, setSelectedCertificateIndex] = useState<number | null>(null);
  
  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      name: '',
      date: '',
      issuer: '',
      url: '',
    },
  });
  
  const onSubmit = (data: CertificateFormValues) => {
    const certificateData: Certificate = {
      name: data.name || '',
      date: data.date || '',
      issuer: data.issuer || '',
      url: data.url || '',
    };
    
    if (selectedCertificateIndex !== null) {
      updateCertificate(selectedCertificateIndex, certificateData);
      setSelectedCertificateIndex(null);
    } else {
      addCertificate(certificateData);
    }
    
    form.reset();
  };
  
  const handleEdit = (index: number) => {
    const certificate = resumeData.certificates[index];
    setSelectedCertificateIndex(index);
    
    form.reset({
      name: certificate.name,
      date: certificate.date,
      issuer: certificate.issuer,
      url: certificate.url,
    });
  };
  
  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      removeCertificate(index);
      
      if (selectedCertificateIndex === index) {
        setSelectedCertificateIndex(null);
        form.reset();
      }
    }
  };
  
  const handleCancel = () => {
    setSelectedCertificateIndex(null);
    form.reset();
  };
  
  // Thêm handler để cập nhật trực tiếp khi dữ liệu thay đổi
  const handleFieldChange = (field: string, value: string) => {
    if (selectedCertificateIndex !== null) {
      updateCertificate(selectedCertificateIndex, {
        [field]: value
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Certificates</h3>
        <p className="text-sm text-gray-500">Add professional certificates you&apos;ve earned</p>
      </div>
      
      {resumeData.certificates.length > 0 && (
        <div className="space-y-4">
          {resumeData.certificates.map((certificate, index) => (
            <Card key={index} className={selectedCertificateIndex === index ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{certificate.name}</CardTitle>
                    <p className="text-sm text-gray-500">Issued by {certificate.issuer}</p>
                    {certificate.url && (
                      <a
                        href={certificate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Certificate
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="outline">{certificate.date}</Badge>
                  </div>
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
                {selectedCertificateIndex !== null ? 'Edit Certificate' : 'Add Certificate'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Name</FormLabel>
                    <FormControl>
                      <Input placeholder="AWS Certified Solutions Architect" {...field} />
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
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="YYYY-MM-DD" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            if (selectedCertificateIndex !== null) {
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
                  name="issuer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuing Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="Amazon Web Services" {...field} />
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
                    <FormLabel>Certificate URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://certification.example.com/verify" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              {selectedCertificateIndex !== null && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {selectedCertificateIndex !== null ? 'Update' : 'Add'} Certificate
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default CertificatesForm; 