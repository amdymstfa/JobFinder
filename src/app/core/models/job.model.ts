export interface Job {
  id: string;
  title: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
  };
  description: string;
  created: string;
  redirect_url: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
}

export interface JobSearchParams {
  keywords: string;
  location: string;
  page?: number;
  results_per_page?: number;
}

export interface JobSearchResponse {
  results: Job[];
  count: number;
}
