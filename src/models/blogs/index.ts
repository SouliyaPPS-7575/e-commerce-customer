export interface BlogsItem {
  collectionId: string;
  collectionName: string;
  id: string;
  image_url: string;
  title: string;
  description: string;
  description_la: string;
  video_url: string;
  count: number;
  created: string;
  updated: string;
}

export interface BlogDetails {
  collectionId: string
  collectionName: string
  id: string
  image_url: string
  title: string
  description: string
  video_url: string
  count: number
  description_la: string
  created: string
  updated: string
}

export interface EditCountBlogForm {
  image_url: string;
  title: string;
  description: string;
  video_url: string;
  count: number;
}
