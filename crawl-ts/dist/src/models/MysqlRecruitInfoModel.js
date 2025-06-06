"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlJobRegionSequelize = exports.MysqlRecruitInfoSequelize = exports.mysqlRecruitInfoSequelize = void 0;
const sequelize_1 = require("sequelize");
exports.mysqlRecruitInfoSequelize = new sequelize_1.Sequelize(process.env.MYSQL_DATABASE ?? 'localhost', process.env.MYSQL_USER ?? 'root', process.env.MYSQL_PASSWORD ?? '', {
    host: process.env.MYSQL_HOST ?? 'localhost',
    port: (process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
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
});
class MysqlRecruitInfoSequelize extends sequelize_1.Model {
}
exports.MysqlRecruitInfoSequelize = MysqlRecruitInfoSequelize;
class MysqlJobRegionSequelize extends sequelize_1.Model {
}
exports.MysqlJobRegionSequelize = MysqlJobRegionSequelize;
MysqlRecruitInfoSequelize.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(512),
        allowNull: false,
    },
    url: {
        type: sequelize_1.DataTypes.STRING(2048),
        allowNull: false,
    },
    text: {
        type: sequelize_1.DataTypes.TEXT('long'),
        allowNull: false,
        field: 'raw_jobs_text' // MySQL 데이터베이스에서 사용할 컬럼명
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'last_updated_at',
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    is_public: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    favicon: {
        type: sequelize_1.DataTypes.TEXT,
    },
    company_name: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    department: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    region_text: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    require_experience: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    job_description: {
        allowNull: false,
        type: sequelize_1.DataTypes.TEXT,
    },
    job_type: {
        type: sequelize_1.DataTypes.STRING(100),
    },
    apply_start_date: {
        type: sequelize_1.DataTypes.DATE,
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
        type: sequelize_1.DataTypes.DATE,
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
        type: sequelize_1.DataTypes.TEXT,
    },
    preferred_qualifications: {
        type: sequelize_1.DataTypes.TEXT,
    },
    ideal_candidate: {
        type: sequelize_1.DataTypes.TEXT,
    }
}, {
    sequelize: exports.mysqlRecruitInfoSequelize,
    tableName: process.env.MYSQL_RECRUIT_TABLE,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'last_updated_at', // createdAt, updatedAt 자동 관리
    underscored: true, // 스네이크_케이스 컬럼명 사용
});
MysqlJobRegionSequelize.init({
    job_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    region_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: exports.mysqlRecruitInfoSequelize,
    tableName: process.env.MYSQL_JOB_REGION_TABLE,
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['job_id', 'region_id']
        }
    ]
});
//# sourceMappingURL=MysqlRecruitInfoModel.js.map