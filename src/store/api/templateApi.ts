import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { WorkoutTemplate, TemplateTag } from '@/types/workout';
import { sampleTemplates } from '@/data/sampleTemplates';

// Simulated database
let templatesDb: WorkoutTemplate[] = [...sampleTemplates];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface TemplateFilters {
  tags?: TemplateTag[];
  search?: string;
}

export const templateApi = createApi({
  reducerPath: 'templateApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Template'],
  endpoints: (builder) => ({
    getTemplates: builder.query<WorkoutTemplate[], TemplateFilters | void>({
      queryFn: async (filters) => {
        await delay(100);
        
        let result = [...templatesDb];
        
        if (filters) {
          // Filter by tags (OR within category)
          if (filters.tags && filters.tags.length > 0) {
            result = result.filter(t => 
              t.tags.some(tag => filters.tags!.includes(tag))
            );
          }
          
          // Search filter
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(t => 
              t.name.toLowerCase().includes(searchLower) ||
              t.description?.toLowerCase().includes(searchLower)
            );
          }
        }
        
        return { data: result };
      },
      providesTags: ['Template'],
    }),
    
    getTemplateById: builder.query<WorkoutTemplate | undefined, string>({
      queryFn: async (id) => {
        await delay(50);
        const template = templatesDb.find(t => t.id === id);
        return { data: template };
      },
      providesTags: (_result, _error, id) => [{ type: 'Template', id }],
    }),
    
    createTemplate: builder.mutation<WorkoutTemplate, Omit<WorkoutTemplate, 'id'>>({
      queryFn: async (newTemplate) => {
        await delay(150);
        const template: WorkoutTemplate = {
          ...newTemplate,
          id: `template-${Date.now()}`,
        };
        templatesDb.push(template);
        return { data: template };
      },
      invalidatesTags: ['Template'],
    }),
    
    updateTemplate: builder.mutation<WorkoutTemplate, WorkoutTemplate>({
      queryFn: async (updatedTemplate) => {
        await delay(150);
        const index = templatesDb.findIndex(t => t.id === updatedTemplate.id);
        if (index !== -1) {
          // Templates are "immutable" - edits overwrite the existing template
          templatesDb[index] = updatedTemplate;
          return { data: updatedTemplate };
        }
        return { error: { status: 404, data: 'Template not found' } };
      },
      invalidatesTags: (_result, _error, template) => [{ type: 'Template', id: template.id }],
    }),
    
    deleteTemplate: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay(100);
        templatesDb = templatesDb.filter(t => t.id !== id);
        return { data: undefined };
      },
      invalidatesTags: ['Template'],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateByIdQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = templateApi;
