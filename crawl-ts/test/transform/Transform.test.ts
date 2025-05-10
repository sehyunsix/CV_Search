import 'dotenv/config'
import {  regionText2RegionIdsAi } from '../../src/trasnform/Transform'; // 경로는

describe('regionText2RegionId()', () => {
  test('정확한 한글 입력: 서울 → [1]', async () => {
    const result = await regionText2RegionIdsAi('서울');
    expect(result).toContain(1);
  });

  test('정확한 한글 입력: 경기 → [84]', async () => {
    const result = await regionText2RegionIdsAi('경기');
    expect(result).toContain(84);
  });

  test('영문 입력: seoul → [1]',async() => {
    const result = await regionText2RegionIdsAi('seoul');
    expect(result).toContain(1);
  });

   test('영문 입력: bundang → [93]',async() => {
    const result = await regionText2RegionIdsAi('bundang');
    expect(result).toContain(93);
  });

  test('한글 멀티 기준: 서울 종로구 , 서울 중구  -> [ 2,3 ]',async() => {
    const result = await regionText2RegionIdsAi('서울 종로구 , 서울 중구');
    expect(result).toContain(2);
    expect(result).toContain(3);
  });

  test('해외 지역: 베이징 ->[] ',async() => {
    const result = await regionText2RegionIdsAi('베이징, baejing');
    expect(result.length).toEqual(0);
  });


  test('판교 경기 성남시 분당구로 분류: 판교 ->[93] ',async() => {
    const result = await regionText2RegionIdsAi('판교');
    expect(result).toContain(93);
  });

  test('복잡한 지역 : 신세계백화점 대구점  ->[44]',async() => {
    const result = await regionText2RegionIdsAi('신세계백화점 대구점');
    expect(result).toContain(44);
  });

});