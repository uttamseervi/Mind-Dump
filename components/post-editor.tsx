'use client';

import { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { motion } from 'framer-motion';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TagInput } from '@/components/tag-input';
import { categories } from '@/data/categories';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PostEditorProps {
  onSubmit: (data: any, isDraft: boolean) => void;
  isSubmitting: boolean;
  defaultValues?: any;
}

export function PostEditor({ onSubmit, isSubmitting, defaultValues }: PostEditorProps) {
  const [title, setTitle] = useState(defaultValues?.title || '');
  const [description, setDescription] = useState(defaultValues?.description || '');
  const [companyName, setCompanyName] = useState(defaultValues?.companyName || '');
  const [difficulty, setDifficulty] = useState(defaultValues?.difficulty || 'MEDIUM');
  const [category, setCategory] = useState(defaultValues?.category || '');
  const [tags, setTags] = useState<string[]>(defaultValues?.tags || []);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageError, setImageError] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);

  // const handleUploadImage = async (file: File) => {
  //   try {
  //     const fakeUploadedUrl = 'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg';
  //     setImage(fakeUploadedUrl);
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // };

  const handleSubmit = (isDraft: boolean) => {
    const content = editorRef.current?.getContent();
    if (!title) return alert('Please enter a title');
    if (!category) return alert('Please select a category');
    if (!content || content === '<p></p>') return alert('Please add some content');

    onSubmit({
      title,
      description,
      companyName,
      difficulty,
      content,
      category,
      tags,
    }, isDraft);
  };

 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter your post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="text-base"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Role *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Short Description</Label>
          <textarea
            id="description"
            placeholder="Enter a short description of the interview experience"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={3}
          />
        </div>


        <div>
          <Label htmlFor="tags">Tags</Label>
          <TagInput
            id="tags"
            placeholder="Add tags..."
            tags={tags}
            setTags={setTags}
          />
        </div>

      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted p-2 border-b flex items-center gap-2">
          {/* Buttons kept for visual UI continuity (TinyMCE already has built-in toolbar) */}
          <Button variant="ghost" size="sm"><Bold className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Italic className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Heading2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Heading3 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><List className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><ListOrdered className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><LinkIcon className="h-4 w-4" /></Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsImageDialogOpen(true)}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <Editor
            apiKey="tw6tq75iwpm5sjrh2kmp4rld3z2fxt812x46pwu8medf3u3p"
            onInit={(_evt:any, editor: any) => (editorRef.current = editor)}
            initialValue={defaultValues?.content || ''}
            init={{
              height: 300,
              menubar: false,
              plugins: 'link image lists',
              toolbar:
                'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
            }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Publishing...' : 'Publish'}
        </Button>
      </div>

      {/* <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>Enter the URL of the image you want to insert</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImageError('');
                }}
              />
              {imageError && <p className="text-sm text-destructive mt-1">{imageError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleImageInsert}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </motion.div>
  );
}
