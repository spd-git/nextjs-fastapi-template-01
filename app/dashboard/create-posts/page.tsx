import { CreatePostsForm } from '@/components/ui/create-posts-form';

export default function CreatePostsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Social Media Post</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <CreatePostsForm />
      </div>
    </div>
  );
}
