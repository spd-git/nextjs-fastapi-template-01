"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PostFormat } from '@/components/ui/posts/defaults/postFormat';
import { generatePosts } from '@/components/actions/posts-action';

export interface Post {
  id: string;
  caption: string;
  image_prompt: string;
}

interface FormData {
  brandName: string;
  location: string;
  industry: string;
  websiteUrl: string;
}

export function CreatePostsForm({ initialData = {
  brandName: '',
  location: '',
  industry: '',
  websiteUrl: '',
} }: { initialData?: Partial<FormData> }) {
  const [formData, setFormData] = useState<FormData>(initialData as FormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      console.log(formData);
      const result = await generatePosts(formData);
      // Handle the response
      if (Array.isArray(result)) {
        // If response is an array, it's the success case with posts
        setGeneratedPosts(result);
      } else if (result && 'message' in result) {
        // Handle error cases
        console.error('Error generating posts:', result.message);
        // You might want to show this error to the user
      } else {
        // Handle any other unexpected response
        console.error('Unexpected response format:', result);
      }
    } catch (error) {
      console.error('Error generating posts:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              placeholder="Enter brand name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Enter industry"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="https://example.com"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Posts'}
          </Button>
        </div>
      </form>
      
      {generatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Generated Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {
              generatedPosts.map((post) => (
                <PostFormat key={post.id} post={post} />
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
