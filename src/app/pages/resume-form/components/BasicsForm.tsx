import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useResumeStore, Basics, Location, Profile } from '@/stores/resumeStore';

const locationSchema = z.object({
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  countryCode: z.string().optional(),
  region: z.string().optional(),
});

const profileSchema = z.object({
  network: z.string().min(1, 'Network is required'),
  username: z.string().min(1, 'Username is required'),
  url: z.string().url('Please enter a valid URL').optional(),
});

const basicsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  label: z.string().optional(),
  image: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  summary: z.string().optional(),
  location: locationSchema,
  profiles: z.array(profileSchema).optional(),
});

type BasicsFormValues = z.infer<typeof basicsSchema>;

const BasicsForm = () => {
  const { resumeData, updateBasics } = useResumeStore();
  const [profiles, setProfiles] = useState<Profile[]>(resumeData.basics.profiles || []);
  
  const form = useForm<BasicsFormValues>({
    resolver: zodResolver(basicsSchema),
    defaultValues: {
      name: resumeData.basics.name || '',
      label: resumeData.basics.label || '',
      image: resumeData.basics.image || '',
      email: resumeData.basics.email || '',
      phone: resumeData.basics.phone || '',
      url: resumeData.basics.url || '',
      summary: resumeData.basics.summary || '',
      location: {
        address: resumeData.basics.location?.address || '',
        postalCode: resumeData.basics.location?.postalCode || '',
        city: resumeData.basics.location?.city || '',
        countryCode: resumeData.basics.location?.countryCode || '',
        region: resumeData.basics.location?.region || '',
      },
      profiles: resumeData.basics.profiles || [],
    },
  });
  
  const handleFormChange = (field: string, value: string) => {
    if (field.startsWith('location.')) {
      const locationField = field.split('.')[1] as keyof Location;
      const locationUpdate: Partial<Location> = {};
      locationUpdate[locationField] = value;
      
      updateBasics({
        location: {
          ...resumeData.basics.location,
          ...locationUpdate
        }
      });
    } else {
      const basicField = field as keyof Basics;
      const updateData = {} as Partial<Basics>;
      
      // This is a type-safe way to update fields
      if (basicField === 'name') updateData.name = value;
      else if (basicField === 'label') updateData.label = value;
      else if (basicField === 'image') updateData.image = value;
      else if (basicField === 'email') updateData.email = value;
      else if (basicField === 'phone') updateData.phone = value;
      else if (basicField === 'url') updateData.url = value;
      else if (basicField === 'summary') updateData.summary = value;
      
      updateBasics(updateData);
    }
  };
  
  const handleProfileChange = (index: number, field: keyof Profile, value: string) => {
    const newProfiles = [...profiles];
    newProfiles[index] = {
      ...newProfiles[index],
      [field]: value,
    };
    setProfiles(newProfiles);
    
    // Update profiles directly in store
    updateBasics({
      profiles: newProfiles
    });
  };
  
  const handleAddProfile = () => {
    const newProfiles = [
      ...profiles,
      { network: '', username: '', url: '' },
    ];
    setProfiles(newProfiles);
    
    // Update profiles directly in store
    updateBasics({
      profiles: newProfiles
    });
  };
  
  const handleRemoveProfile = (index: number) => {
    const newProfiles = [...profiles];
    newProfiles.splice(index, 1);
    setProfiles(newProfiles);
    
    // Update profiles directly in store
    updateBasics({
      profiles: newProfiles
    });
  };
  
  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name*</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange('name', e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Software Developer" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange('label', e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription>Your professional title or role</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="john@example.com" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange('email', e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(555) 123-4567" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange('phone', e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://yourwebsite.com" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange('url', e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/photo.jpg" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange('image', e.target.value);
                    }}
                  />
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
              <FormLabel>Professional Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief summary of your professional background and expertise..."
                  className="min-h-[120px]"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFormChange('summary', e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="location.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123 Main St" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleFormChange('location.address', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="San Francisco" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleFormChange('location.city', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location.region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province/Region</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="California" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleFormChange('location.region', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location.postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="94103" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleFormChange('location.postalCode', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location.countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="US" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        handleFormChange('location.countryCode', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Social Profiles</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddProfile}
            >
              Add Profile
            </Button>
          </CardHeader>
          <CardContent>
            {profiles.length === 0 ? (
              <p className="text-center text-gray-500">No profiles added yet. Click &quot;Add Profile&quot; to add your social profiles.</p>
            ) : (
              <div className="space-y-4">
                {profiles.map((profile, index) => (
                  <div key={index} className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-3">
                    <div>
                      <FormLabel htmlFor={`network-${index}`}>Network*</FormLabel>
                      <Input
                        id={`network-${index}`}
                        value={profile.network}
                        onChange={(e) => handleProfileChange(index, 'network', e.target.value)}
                        placeholder="LinkedIn"
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor={`username-${index}`}>Username*</FormLabel>
                      <Input
                        id={`username-${index}`}
                        value={profile.username}
                        onChange={(e) => handleProfileChange(index, 'username', e.target.value)}
                        placeholder="johndoe"
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor={`url-${index}`}>URL</FormLabel>
                      <div className="flex space-x-2">
                        <Input
                          id={`url-${index}`}
                          value={profile.url}
                          onChange={(e) => handleProfileChange(index, 'url', e.target.value)}
                          placeholder="https://linkedin.com/in/johndoe"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveProfile(index)}
                          aria-label="Remove profile"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default BasicsForm; 