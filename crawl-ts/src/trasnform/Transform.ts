import { Logger, defaultLogger as logger } from '../utils/logger';
import regions from '../../static/regions.json';
import { GeminiParser } from '../parser/GeminiParser';

const parser = new GeminiParser();
const cdToRegionMap = createCdToRegionMap(regions);


// 입력 JSON 데이터의 타입 정의
interface Region {
  id: number;
  cd: string;
  sido: string;
  sigungu: string | null;
}

/**
 * JSON 리스트를 CD를 키로 하는 해시맵으로 변환하는 함수
 * @param regions 지역 정보가 담긴 JSON 배열
 * @returns CD를 키로 하는 해시맵
 */
function createCdToRegionMap(regions: Region[]): Record<string, Region> {
  // CD를 키로 하는 해시맵 초기화
  const cdMap: Record<string, Region> = {};

  // 배열을 순회하며 각 항목을 해시맵에 추가
  regions.forEach(region => {
    // CD를 키로 사용하여 해시맵에 저장
    cdMap[region.cd] = region;
  });

  return cdMap;
}


function simplifyRegionCode(code: string): string {
  if (code.length !== 10) throw new Error("코드는 10자리여야 합니다");
  return code.slice(0, 5) + '00000';
}


export async function regionText2RegionIds(input: string): Promise<number[]> {


  const result: number[] = [];

  regions.forEach((region) => {
    // "울산 중구" → sido="울산", sigungu="중구" 인 지역
    const fullName = region.sigungu ? `${region.sido} ${region.sigungu}` : region.sido;

    if (region.sigungu && region.sigungu.length > 0 && input.includes(region.sigungu)) {
      result.push(region.id);
    }

    if (input.includes(fullName)) {
      result.push(region.id);
    }

  });

  return result;

}

export async function regionText2RegionIdsAi(input: string): Promise<number[]> {

  return await parser.ParseRegionText(input, 100).then(
    (results) => {
    if (!results) return [];
      return Array.from(new Set(results.
        filter(cd=> cd.length == 10)
        .map(cd => cdToRegionMap[simplifyRegionCode(cd)]?.id)
        .filter(id => id !== undefined)
                  ));
    }
  ).catch(
    (error) => {
      logger.error('Region Text 로 변환하는데 실패하였습니다.')
      throw error
    }
  )
  .catch(
    (error) => {
      logger.error('Region Cd를 id로 변환하는데 실패하였습니다.')
      throw error
    }
  )

}