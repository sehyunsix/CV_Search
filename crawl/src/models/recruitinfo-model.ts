// 인터페이스 정의로 TypeScript의 장점 활용
export interface IRecruitInfo {
  title: string;
  url: string;
  company_name: string;
  department: string;
  experience: string;
  description: string;
  job_type: string;
  start_date: Date;
  end_date: Date;
  requirements: string;
  raw_text: string;

  // 선택적 필드
  preferred_qualifications?: string;
  ideal_candidate?: string;
  posted_at?: Date;
  expires_at?: Date | null;
  success?: boolean;
  reason?: string;

  // 메타데이터
  created_at?: Date;
  updated_at?: Date;
}

// 생성 시 필요한 필드 정의
export type CreateRecruitInfoDTO = Omit<IRecruitInfo, 'created_at' | 'updated_at'>;

// 업데이트 시 필요한 필드 정의 (모든 필드가 선택적)
export type UpdateRecruitInfoDTO = Partial<IRecruitInfo>;

// 기본 모델 클래스
export class RecruitInfoModel implements IRecruitInfo {
  title: string;
  url: string;
  company_name: string;
  department: string;
  experience: string;
  description: string;
  job_type: string;
  start_date: Date;
  end_date: Date;
  requirements: string;
  raw_text: string;

  preferred_qualifications: string;
  ideal_candidate: string;
  posted_at: Date;
  expires_at: Date | null;
  success: boolean;
  reason: string;

  created_at: Date;
  updated_at: Date;

  constructor(data: Partial<IRecruitInfo> = {}) {
    this.title = data.title || '';
    this.url = data.url || '';
    this.company_name = data.company_name || '';
    this.department = data.department || '';
    this.experience = data.experience || '';
    this.description = data.description || '';
    this.job_type = data.job_type || '';
    this.start_date = data.start_date || new Date();
    this.end_date = data.end_date || new Date();
    this.requirements = data.requirements || '';
    this.raw_text = data.raw_text || '';

    this.preferred_qualifications = data.preferred_qualifications || '';
    this.ideal_candidate = data.ideal_candidate || '';
    this.posted_at = data.posted_at || new Date();
    this.expires_at = data.expires_at || null;
    this.success = data.success !== undefined ? data.success : false;
    this.reason = data.reason || '';

    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  // 유효성 검사 메서드
  validate(): boolean {
    const requiredFields: Array<keyof IRecruitInfo> = [
      'title', 'url', 'company_name', 'department',
      'experience', 'description', 'job_type',
      'start_date', 'end_date', 'requirements', 'raw_text'
    ];

    const missingFields = requiredFields.filter(field => !this[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // URL 유효성 검사
    if (!/^https?:\/\/.+/.test(this.url)) {
      throw new Error('Invalid URL format');
    }

    // 날짜 유효성 검사
    if (this.start_date && !(this.start_date instanceof Date)) {
      throw new Error('Invalid start_date format');
    }

    if (this.end_date && !(this.end_date instanceof Date)) {
      throw new Error('Invalid end_date format');
    }

    return true;
  }

  // 데이터 직렬화
  toJSON(): IRecruitInfo {
    return {
      title: this.title,
      url: this.url,
      company_name: this.company_name,
      department: this.department,
      experience: this.experience,
      description: this.description,
      job_type: this.job_type,
      start_date: this.start_date,
      end_date: this.end_date,
      requirements: this.requirements,
      preferred_qualifications: this.preferred_qualifications,
      ideal_candidate: this.ideal_candidate,
      raw_text: this.raw_text,
      posted_at: this.posted_at,
      expires_at: this.expires_at,
      success: this.success,
      reason: this.reason,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // 정적 팩토리 메서드
  static fromJSON(data: IRecruitInfo): RecruitInfoModel {
    return new RecruitInfoModel(data);
  }
}