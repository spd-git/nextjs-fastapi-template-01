"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';

interface Post {
  id: number;
  imageUrl: string;
  caption: string;
}

export function CreatePostsForm() {
  const [formData, setFormData] = useState({
    brandName: '',
    location: '',
    industry: '',
    websiteUrl: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate 3 placeholder posts
      const posts = Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        imageUrl: `https://via.placeholder.com/1080x1080?text=Post+${i + 1}`,
        caption: `Post ${i + 1} for ${formData.brandName} in ${formData.industry} industry. Location: ${formData.location}. Visit us at ${formData.websiteUrl}`,
      }));
      
      setGeneratedPosts(posts);
      setIsGenerating(false);
    }, 1500);
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
            {generatedPosts.map((post) => (
              <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={post.imageUrl} 
                  alt={`Post ${post.id}`} 
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-2">Post {post.id}</h3>
                  <p className="text-sm text-gray-600">{post.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
