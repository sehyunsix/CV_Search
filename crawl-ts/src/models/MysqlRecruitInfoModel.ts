import { Sequelize ,DataTypes ,Model} from 'sequelize'
import { IDbRecruitInfo } from '../models/RecruitInfoModel';
import { z } from 'zod';

export class MysqlRecruitInfoSequelize extends Model<IDbRecruitInfo> {
  public url!: string;
  public text!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public is_public!: boolean;

}

/**
 * Sequelize 모델 초기화 함수
 * @param sequelize Sequelize 인스턴스
 * @returns 초기화된 RecruitInfo 모델
 */

console.log(process.env.MYSQL_HOST);
  export const mysqlRecruitInfoSequelize = new Sequelize(
      process.env.MYSQL_DATABASE ?? 'localhost',
      process.env.MYSQL_USER ?? 'root' ,
      process.env.MYSQL_PASSWORD ?? '',
      {
        host: process.env.MYSQL_HOST ?? 'localhost',
        port: (process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306),
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool:  {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
        define: {
          underscored: true, // 컬럼명을 스네이크 케이스로 유지
          freezeTableName: false, // 기본 테이블명 규칙 사용 (복수형)
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci',
          timestamps: true // createdAt, updatedAt 자동 관리
        }
      }
  );

MysqlRecruitInfoSequelize.init(
    {

      title: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        field: 'raw_jobs_text' // MySQL 데이터베이스에서 사용할 컬럼명
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'last_updated_at',
        defaultValue: DataTypes.NOW,
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      favicon: {
        type: DataTypes.TEXT,
      },
      company_name: {
        type: DataTypes.STRING(255),
      },
      department: {
        type: DataTypes.STRING(255),
      },
      region_text: {
        type: DataTypes.STRING(255),
      },
      region_id: {
        type: DataTypes.INTEGER,
      },
      require_experience: {
        type: DataTypes.STRING(255),
      },
      job_description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      job_type: {
        type: DataTypes.STRING(100),
      },
      apply_start_date: {
        type: DataTypes.DATE,
        validate: {
          isAfter: {
            args: '2000-01-01',
            msg: "유효한 날짜 형식이어야 합니다"
          },
          isBefore: {
            args: '2100-12-31',
            msg: "종료일은 2030년 12월 31일 이전이어야 합니다"
          }
        }
      },
      apply_end_date: {
        type: DataTypes.DATE,
           validate: {
          isAfter: {
            args: '2000-01-01',
            msg: "유효한 날짜 형식이어야 합니다"
          },
          isBefore: {
            args: '2100-12-31',
            msg: "종료일은 2030년 12월 31일 이전이어야 합니다"
          }
        }
      },
      requirements: {
        type: DataTypes.TEXT,
      },
      preferred_qualifications: {
        type: DataTypes.TEXT,
      },
      ideal_candidate: {
        type: DataTypes.TEXT,
      }
    },
    {
      sequelize: mysqlRecruitInfoSequelize,
      tableName: process.env.MYSQL_RECRUIT_TABLE,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'last_updated_at',// createdAt, updatedAt 자동 관리
      underscored: true, // 스네이크_케이스 컬럼명 사용
    }
);


const dateRangeSchema = z.preprocess(
  (date) => {
    if (date === "" || date === null || date === undefined || typeof date !== 'string') return null;
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  },
  z.date()
    .nullable()
    .refine(
      (date) => !date || (date >= new Date('2000-01-01') && date <= new Date('2100-12-31')),
      { message: "날짜는 2000-01-01부터 2100-12-31 사이여야 합니다" }
    ).catch(null)
);



const userInput = {
  apply_start_date: "2023-08-01",
  apply_end_date: "2200-01-01" // 잘못된 값
};

// ✅ 전체 입력 스키마
const formSchema = z.object({
  apply_start_date: dateRangeSchema,
  apply_end_date: dateRangeSchema,
});

// ✅ 검사 실행
const result = formSchema.safeParse(userInput);

if (!result.success) {
  console.log("❌ 검증 실패:", result.error.issues);
} else {
  console.log("✅ 유효한 값:", result.data);
}


