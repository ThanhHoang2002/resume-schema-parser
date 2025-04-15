import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Profile {
  network: string;
  username: string;
  url: string;
}

export interface Location {
  address: string;
  postalCode: string;
  city: string;
  countryCode: string;
  region: string;
}

export interface Basics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: Location;
  profiles: Profile[];
}

export interface WorkExperience {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
}

export interface Volunteer {
  organization: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
}

export interface Education {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
  courses: string[];
}

export interface Award {
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

export interface Certificate {
  name: string;
  date: string;
  issuer: string;
  url: string;
}

export interface Publication {
  name: string;
  publisher: string;
  releaseDate: string;
  url: string;
  summary: string;
}

export interface Skill {
  name: string;
  level: string;
  keywords: string[];
}

export interface Language {
  language: string;
  fluency: string;
}

export interface Interest {
  name: string;
  keywords: string[];
}

export interface Reference {
  name: string;
  reference: string;
}

export interface Project {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
  url: string;
}

export interface Resume {
  id: string;
  createdAt: number;
  updatedAt: number;
  basics: {
    name: string;
    label: string;
    image: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location: {
      address: string;
      postalCode: string;
      city: string;
      countryCode: string;
      region: string;
    };
    profiles: Array<{
      network: string;
      username: string;
      url: string;
    }>;
  };
  work: Array<{
    name: string;
    position: string;
    url: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
  }>;
  volunteer: Array<{
    organization: string;
    position: string;
    url: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    url: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    score: string;
    courses: string[];
  }>;
  awards: Array<{
    title: string;
    date: string;
    awarder: string;
    summary: string;
  }>;
  certificates: Array<{
    name: string;
    date: string;
    issuer: string;
    url: string;
  }>;
  publications: Array<{
    name: string;
    publisher: string;
    releaseDate: string;
    url: string;
    summary: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
    keywords: string[];
  }>;
  languages: Array<{
    language: string;
    fluency: string;
  }>;
  interests: Array<{
    name: string;
    keywords: string[];
  }>;
  references: Array<{
    name: string;
    reference: string;
  }>;
  projects: Array<{
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    highlights: string[];
    url: string;
  }>;
}

interface ResumeState {
  resumeData: Resume;
  resumes: Resume[];
  initializeNewResume: () => void;
  updateResume: (data: Partial<Resume>) => void;
  updateBasics: (data: Partial<Basics>) => void;
  
  // Work methods
  addWorkExperience: (work: WorkExperience) => void;
  updateWorkExperience: (index: number, work: Partial<WorkExperience>) => void;
  removeWorkExperience: (index: number) => void;
  
  // Volunteer methods
  addVolunteer: (volunteer: Volunteer) => void;
  updateVolunteer: (index: number, volunteer: Partial<Volunteer>) => void;
  removeVolunteer: (index: number) => void;
  
  // Education methods
  addEducation: (education: Education) => void;
  updateEducation: (index: number, education: Partial<Education>) => void;
  removeEducation: (index: number) => void;
  
  // Award methods
  addAward: (award: Award) => void;
  updateAward: (index: number, award: Partial<Award>) => void;
  removeAward: (index: number) => void;
  
  // Certificate methods
  addCertificate: (certificate: Certificate) => void;
  updateCertificate: (index: number, certificate: Partial<Certificate>) => void;
  removeCertificate: (index: number) => void;
  
  // Publication methods
  addPublication: (publication: Publication) => void;
  updatePublication: (index: number, publication: Partial<Publication>) => void;
  removePublication: (index: number) => void;
  
  // Skill methods
  addSkill: (skill: Skill) => void;
  updateSkill: (index: number, skill: Partial<Skill>) => void;
  removeSkill: (index: number) => void;
  
  // Language methods
  addLanguage: (language: Language) => void;
  updateLanguage: (index: number, language: Partial<Language>) => void;
  removeLanguage: (index: number) => void;
  
  // Interest methods
  addInterest: (interest: Interest) => void;
  updateInterest: (index: number, interest: Partial<Interest>) => void;
  removeInterest: (index: number) => void;
  
  // Reference methods
  addReference: (reference: Reference) => void;
  updateReference: (index: number, reference: Partial<Reference>) => void;
  removeReference: (index: number) => void;
  
  // Project methods
  addProject: (project: Project) => void;
  updateProject: (index: number, project: Partial<Project>) => void;
  removeProject: (index: number) => void;
  
  saveResume: () => void;
  deleteResume: (id: string) => void;
  exportResume: (id: string) => void;
}

const emptyResume: Resume = {
  id: '',
  createdAt: 0,
  updatedAt: 0,
  basics: {
    name: '',
    label: '',
    image: '',
    email: '',
    phone: '',
    url: '',
    summary: '',
    location: {
      address: '',
      postalCode: '',
      city: '',
      countryCode: '',
      region: '',
    },
    profiles: [],
  },
  work: [],
  volunteer: [],
  education: [],
  awards: [],
  certificates: [],
  publications: [],
  skills: [],
  languages: [],
  interests: [],
  references: [],
  projects: [],
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumeData: { ...emptyResume, id: uuidv4(), createdAt: Date.now(), updatedAt: Date.now() },
      resumes: [],

      initializeNewResume: () => {
        set({
          resumeData: {
            ...emptyResume,
            id: uuidv4(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        });
      },

      updateResume: (data) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            ...data,
            updatedAt: Date.now(),
          },
        }));
      },

      updateBasics: (data) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            basics: {
              ...state.resumeData.basics,
              ...data,
            },
            updatedAt: Date.now(),
          },
        }));
      },

      // Work methods
      addWorkExperience: (work) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            work: [...state.resumeData.work, work],
            updatedAt: Date.now(),
          },
        }));
      },

      updateWorkExperience: (index, work) => {
        set((state) => {
          const updatedWork = [...state.resumeData.work];
          updatedWork[index] = { ...updatedWork[index], ...work };

          return {
            resumeData: {
              ...state.resumeData,
              work: updatedWork,
              updatedAt: Date.now(),
            },
          };
        });
      },

      removeWorkExperience: (index) => {
        set((state) => {
          const updatedWork = [...state.resumeData.work];
          updatedWork.splice(index, 1);

          return {
            resumeData: {
              ...state.resumeData,
              work: updatedWork,
              updatedAt: Date.now(),
            },
          };
        });
      },

      // Volunteer methods
      addVolunteer: (volunteer) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            volunteer: [...state.resumeData.volunteer, volunteer],
            updatedAt: Date.now(),
          },
        }));
      },

      updateVolunteer: (index, volunteer) => {
        set((state) => {
          const updatedVolunteer = [...state.resumeData.volunteer];
          updatedVolunteer[index] = { ...updatedVolunteer[index], ...volunteer };

          return {
            resumeData: {
              ...state.resumeData,
              volunteer: updatedVolunteer,
              updatedAt: Date.now(),
            },
          };
        });
      },

      removeVolunteer: (index) => {
        set((state) => {
          const updatedVolunteer = [...state.resumeData.volunteer];
          updatedVolunteer.splice(index, 1);

          return {
            resumeData: {
              ...state.resumeData,
              volunteer: updatedVolunteer,
              updatedAt: Date.now(),
            },
          };
        });
      },

      // Education methods
      addEducation: (education) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: [...state.resumeData.education, education],
            updatedAt: Date.now(),
          },
        }));
      },

      updateEducation: (index, education) => {
        set((state) => {
          const updatedEducation = [...state.resumeData.education];
          updatedEducation[index] = { ...updatedEducation[index], ...education };

          return {
            resumeData: {
              ...state.resumeData,
              education: updatedEducation,
              updatedAt: Date.now(),
            },
          };
        });
      },

      removeEducation: (index) => {
        set((state) => {
          const updatedEducation = [...state.resumeData.education];
          updatedEducation.splice(index, 1);

          return {
            resumeData: {
              ...state.resumeData,
              education: updatedEducation,
              updatedAt: Date.now(),
            },
          };
        });
      },

      // Award methods
      addAward: (award) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            awards: [...state.resumeData.awards, award],
            updatedAt: Date.now(),
          },
        }));
      },

      updateAward: (index, award) => {
        set((state) => {
          const updatedAwards = [...state.resumeData.awards];
          updatedAwards[index] = { ...updatedAwards[index], ...award };

          return {
            resumeData: {
              ...state.resumeData,
              awards: updatedAwards,
              updatedAt: Date.now(),
            },
          };
        });
      },

      removeAward: (index) => {
        set((state) => {
          const updatedAwards = [...state.resumeData.awards];
          updatedAwards.splice(index, 1);

          return {
            resumeData: {
              ...state.resumeData,
              awards: updatedAwards,
              updatedAt: Date.now(),
            },
          };
        });
      },

      // Certificate methods
      addCertificate: (certificate) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            certificates: [...state.resumeData.certificates, certificate],
            updatedAt: Date.now(),
          },
        }));
      },

      updateCertificate: (index, certificate) => {
        set((state) => {
          const updatedCertificates = [...state.resumeData.certificates];
          updatedCertificates[index] = { ...updatedCertificates[index], ...certificate };

          return {
            resumeData: {
              ...state.resumeData,
              certificates: updatedCertificates,
              updatedAt: Date.now(),
            },
          };
        });
      },

      removeCertificate: (index) => {
        set((state) => {
          const updatedCertificates = [...state.resumeData.certificates];
          updatedCertificates.splice(index, 1);

          return {
            resumeData: {
              ...state.resumeData,
              certificates: updatedCertificates,
              updatedAt: Date.now(),
            },
          };
        });
      },

      // Publication methods
      addPublication: (publication) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            publications: [...state.resumeData.publications, publication],
            updatedAt: Date.now(),
          },
        }));
      },

      updatePublication: (index, publication) => {
        set((state) => {
          const updatedPublications = [...state.resumeData.publications];
          updatedPublications[index] = { ...updatedPublications[index], ...publication };

          return {
            resumeData: {
              ...state.resumeData,
              publications: updatedPublications,
              updatedAt: Date.now(),
            },
          };
        });
      },

      removePublication: (index) => {
        set((state) => {
          const updatedPublications = [...state.resumeData.publications];
          updatedPublications.splice(index, 1);

          return {
            resumeData: {
              ...state.resumeData,
              publications: updatedPublications,
              updatedAt: Date.now(),
            },
          };
        });
      },

      // Skill methods
      addSkill: (skill) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: [...state.resumeData.skills, skill],
            updatedAt: Date.now(),
          },
        }));
      },

      updateSkill: (index, skill) => {
        set((state) => {
          const updatedSkills = [...state.resumeData.skills];
          updatedSkills[index] = { ...updatedSkills[index], ...skill };

          return {
            resumeData: {
              ...state.resumeData,
              skills: updatedSkills,
              updatedAt: Date.now(),
            },
          };
        });
      },

      removeSkill: (index) => {
        set((state) => {
          const updatedSkills = [...state.resumeData.skills];
          updatedSkills.splice(index, 1);

          return {
            resumeData: {
              ...state.resumeData,
              skills: updatedSkills,
              updatedAt: Date.now(),
            },
          };
        });
      },

      // Language methods
      addLanguage: (language) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: [...state.resumeData.languages, language],
            updatedAt: Date.now(),
          },
        }));
      },

      updateLanguage: (index, language) => {
        set((state) => {
          const updatedLanguages = [...state.resumeData.languages];
          updatedLanguages[index] = { ...updatedLanguages[index], ...language };

          return {
            resumeData: {
              ...state.resumeData,
              languages: updatedLanguages,
              updatedAt: Date.now(),
            },
          };
        });
      },

      removeLanguage: (index) => {
        set((state) => {
          const updatedLanguages = [...state.resumeData.languages];
          updatedLanguages.splice(index, 1);

          return {
            resumeData: {
              ...state.resumeData,
              languages: updatedLanguages,
              updatedAt: Date.now(),
            },
          };
        });
      },

      // Interest methods
      addInterest: (interest) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            interests: [...state.resumeData.interests, interest],
            updatedAt: Date.now(),
          },
        }));
      },

      updateInterest: (index, interest) => {
        set((state) => {
          const updatedInterests = [...state.resumeData.interests];
          updatedInterests[index] = { ...updatedInterests[index], ...interest };

          return {
            resumeData: {
              ...state.resumeData,
              interests: updatedInterests,
              updatedAt: Date.now(),
            },
          };
        });
      },

      removeInterest: (index) => {
        set((state) => {
          const updatedInterests = [...state.resumeData.interests];
          updatedInterests.splice(index, 1);

          return {
            resumeData: {
              ...state.resumeData,
              interests: updatedInterests,
              updatedAt: Date.now(),
            },
          };
        });
      },

      // Reference methods
      addReference: (reference) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            references: [...state.resumeData.references, reference],
            updatedAt: Date.now(),
          },
        }));
      },

      updateReference: (index, reference) => {
        set((state) => {
          const updatedReferences = [...state.resumeData.references];
          updatedReferences[index] = { ...updatedReferences[index], ...reference };

          return {
            resumeData: {
              ...state.resumeData,
              references: updatedReferences,
              updatedAt: Date.now(),
            },
          };
        });
      },

      removeReference: (index) => {
        set((state) => {
          const updatedReferences = [...state.resumeData.references];
          updatedReferences.splice(index, 1);

          return {
            resumeData: {
              ...state.resumeData,
              references: updatedReferences,
              updatedAt: Date.now(),
            },
          };
        });
      },

      // Project methods
      addProject: (project) => {
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: [...state.resumeData.projects, project],
            updatedAt: Date.now(),
          },
        }));
      },

      updateProject: (index, project) => {
        set((state) => {
          const updatedProjects = [...state.resumeData.projects];
          updatedProjects[index] = { ...updatedProjects[index], ...project };

          return {
            resumeData: {
              ...state.resumeData,
              projects: updatedProjects,
              updatedAt: Date.now(),
            },
          };
        });
      },

      removeProject: (index) => {
        set((state) => {
          const updatedProjects = [...state.resumeData.projects];
          updatedProjects.splice(index, 1);

          return {
            resumeData: {
              ...state.resumeData,
              projects: updatedProjects,
              updatedAt: Date.now(),
            },
          };
        });
      },

      saveResume: () => {
        const { resumeData, resumes } = get();
        
        // Check if this resume already exists in the saved list
        const existingIndex = resumes.findIndex(r => r.id === resumeData.id);
        
        if (existingIndex >= 0) {
          // Update existing resume
          const updatedResumes = [...resumes];
          updatedResumes[existingIndex] = {
            ...resumeData,
            updatedAt: Date.now(),
          };
          
          set({ resumes: updatedResumes });
        } else {
          // Add new resume
          set({
            resumes: [...resumes, { ...resumeData, updatedAt: Date.now() }],
          });
        }
        
        // Initialize new form after saving
        get().initializeNewResume();
      },

      deleteResume: (id) => {
        set((state) => ({
          resumes: state.resumes.filter((resume) => resume.id !== id),
        }));
      },

      exportResume: (id) => {
        const { resumes } = get();
        const resume = resumes.find((r) => r.id === id);
        
        if (resume) {
          const dataStr = JSON.stringify(resume, null, 2);
          const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
          
          const exportFileDefaultName = `resume-${resume.basics.name || 'export'}.json`;
          
          const linkElement = document.createElement('a');
          linkElement.setAttribute('href', dataUri);
          linkElement.setAttribute('download', exportFileDefaultName);
          linkElement.click();
        }
      },
    }),
    {
      name: 'resume-storage',
    }
  )
); 