
import React from "react";

interface BlogPostImageProps {
  imageUrl?: string;
  title: string;
}

const BlogPostImage: React.FC<BlogPostImageProps> = ({ imageUrl, title }) => {
  return imageUrl ? (
    <div className="aspect-[16/9] w-full overflow-hidden rounded-t-lg">
      <img 
        src={imageUrl} 
        alt={title} 
        className="h-full w-full object-cover"
      />
    </div>
  ) : (
    <div className="aspect-[16/9] w-full bg-gradient-to-r from-primary/20 to-primary/10 rounded-t-lg" />
  );
};

export default BlogPostImage;
