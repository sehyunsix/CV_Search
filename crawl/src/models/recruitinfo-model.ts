export enum JobType {
  정규직 = "정규직",
  계약직 = "계약직",
  인턴 = "인턴",
  아르바이트 = "아르바이트",
  프리랜서 = "프리랜서",
  파견직 = "파견직"
}
export interface IGeminiResponse {
  success: boolean;
  reason? : string;
  company_name?: string;
  department?: string;
  location?: string;
  require_experince?: "경력무관" | "신입" | "경력" | null;
  job_description?: string;
  job_type?: JobType[];
  preferred_qualifications?: string;
  ideal_candidate?: string;
  apply_start_date?: Date;
  apply_end_date?: Date;
  requirements?: string;
}



// 인터페이스 정의로 TypeScript의 장점 활용
export interface IRecruitInfo extends IGeminiResponse {

  title: string;
  url: string;
  raw_text: string;

}





