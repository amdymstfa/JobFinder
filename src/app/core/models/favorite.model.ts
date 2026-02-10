export interface Favorite {
  id?: number;
  userId: number;
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
  dateAdded: string;
}
