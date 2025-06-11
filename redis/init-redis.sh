#!/bin/bash
# ./redis/init-redis.sh
# Redis 초기화 스크립트 - 환경변수를 통한 동적 설정

set -e

# Redis 설정 파일 경로
REDIS_CONF="/usr/local/etc/redis/redis.conf"
TEMP_CONF="/tmp/redis_temp.conf"

echo "Redis 초기화 시작..."

# 기존 설정 파일을 임시 파일로 복사
cp $REDIS_CONF $TEMP_CONF

# 비밀번호 설정 (환경변수에서)
if [ ! -z "$REDIS_PASSWORD" ]; then
    # 기존 requirepass 라인 제거 후 새로 추가
    sed -i '/^requirepass/d' $TEMP_CONF
    echo "requirepass $REDIS_PASSWORD" >> $TEMP_CONF
    echo "Redis 비밀번호 설정 완료: $REDIS_PASSWORD"

    # protected mode는 비밀번호가 있으므로 yes로 유지
    sed -i 's/^protected-mode.*/protected-mode yes/' $TEMP_CONF
else
    echo "경고: Redis 비밀번호가 설정되지 않았습니다."
    # 비밀번호가 없으면 protected mode 비활성화
    sed -i 's/^protected-mode.*/protected-mode no/' $TEMP_CONF
fi

# 데이터베이스 수 설정
if [ ! -z "$REDIS_DATABASES" ]; then
    sed -i "s/^databases.*/databases $REDIS_DATABASES/" $REDIS_CONF
    echo "Redis 데이터베이스 수 설정: $REDIS_DATABASES"
fi

# 최대 메모리 설정
if [ ! -z "$REDIS_MAXMEMORY" ]; then
    sed -i "s/^maxmemory.*/maxmemory $REDIS_MAXMEMORY/" $REDIS_CONF
    echo "Redis 최대 메모리 설정: $REDIS_MAXMEMORY"
fi

# 메모리 정책 설정
if [ ! -z "$REDIS_MAXMEMORY_POLICY" ]; then
    sed -i "s/^maxmemory-policy.*/maxmemory-policy $REDIS_MAXMEMORY_POLICY/" $REDIS_CONF
    echo "Redis 메모리 정책 설정: $REDIS_MAXMEMORY_POLICY"
fi

# 추가 환경변수 기반 설정들
if [ ! -z "$REDIS_TIMEOUT" ]; then
    sed -i "s/^timeout.*/timeout $REDIS_TIMEOUT/" $REDIS_CONF
    echo "Redis 타임아웃 설정: $REDIS_TIMEOUT"
fi

if [ ! -z "$REDIS_LOGLEVEL" ]; then
    sed -i "s/^loglevel.*/loglevel $REDIS_LOGLEVEL/" $REDIS_CONF
    echo "Redis 로그 레벨 설정: $REDIS_LOGLEVEL"
fi

# AOF 활성화/비활성화
if [ "$REDIS_APPENDONLY" = "no" ]; then
    sed -i "s/^appendonly.*/appendonly no/" $REDIS_CONF
    echo "Redis AOF 비활성화"
elif [ "$REDIS_APPENDONLY" = "yes" ]; then
    sed -i "s/^appendonly.*/appendonly yes/" $REDIS_CONF
    echo "Redis AOF 활성화"
fi

echo "Redis 초기화 완료"

# 설정 파일 권한 확인
chmod 644 $REDIS_CONF

echo "Redis 설정이 적용되었습니다."