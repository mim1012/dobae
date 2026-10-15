export const business = {
  name: '우리도배',
  phone: '0507-1309-2068',
  telephone: 'tel:050713092068',
  address: '서울 마포구 만리재로 83',
  hours: '24시간 영업 · 연중무휴',
  directions: '공덕역 5번 출구에서 792m',
  map: 'https://map.naver.com/p/search/우리도배/place/1579977828',
  blog: 'https://blog.naver.com/uridobae',
};

export const navigation = [
  { href: '/about', label: '회사소개' },
  { href: '/portfolio', label: '시공사례' },
  { href: '/stores', label: '매장위치' },
  { href: '/guide', label: '도배 가이드' },
  { href: '/consult', label: '상담신청' },
];

export { projects, featuredProjects, projectPhoto, materialExamples, type Project } from './project-data';
export const blogPost = (id: string) => `https://blog.naver.com/uridobae/${id}`;
export const areaFilters = ['전체', '20평대 이하', '30평대', '40평대', '50평 이상'];
export const spaceFilters = ['전체', '아파트', '빌라 · 주택', '원룸 · 오피스텔'];
export const steps = [
  { title: '상담', text: '주소와 평형, 시공 범위를 알려주세요.' },
  { title: '현장 확인', text: '벽면 상태와 가구 배치를 확인합니다.' },
  { title: '벽지 · 견적', text: '벽지와 작업 범위, 금액을 정합니다.' },
  { title: '일정 조율', text: '시공일과 준비할 사항을 확인합니다.' },
  { title: '시공 · 점검', text: '도배 후 벽면과 모서리를 살펴봅니다.' },
];
export const faqs = [
  { question: '거주 중에도 시공할 수 있나요?', answer: '짐의 양과 가구 배치, 시공 범위를 확인한 뒤 가능 여부를 안내합니다.', category: '시공 준비' },
  { question: '가구와 짐은 어떻게 준비하나요?', answer: '귀중품과 깨지기 쉬운 물건은 따로 보관해 주세요. 큰 가구의 이동과 보양은 시공 전에 협의합니다.', category: '시공 준비' },
  { question: '벽지와 색상은 어떻게 선택하나요?', answer: '바닥과 가구 색상에 맞춰 고른 뒤, 실물 샘플로 최종 확인합니다.', category: '벽지 선택' },
  { question: '견적은 어떻게 안내받나요?', answer: '면적, 벽지, 벽면 상태와 작업 범위를 확인해 안내합니다. 철거·보수·가구 이동의 포함 여부도 확인해 주세요.', category: '비용 · 견적' },
  { question: '시공일은 언제 확정되나요?', answer: '희망일의 작업 가능 여부를 확인한 뒤 상담으로 확정합니다. 온라인 신청만으로 예약되지는 않습니다.', category: '시공 준비' },
  { question: '시공 후 벽지가 울어 보이면 어떻게 하나요?', answer: '건조 중 생길 수 있는 현상입니다. 누르거나 떼지 말고 안내받은 방법으로 관리해 주세요. 건조 후에도 남으면 시공일과 사진을 보내주세요.', category: '관리 · 하자' },
];
export const articles = [
  { slug: 'hapji-silk', title: '합지와 실크의 차이', category: '벽지 선택', kicker: '합지 vs 실크', description: '소재, 이음매와 관리 방법 비교', duration: '3분 읽기' },
  { slug: 'process', title: '도배 시공 순서', category: '시공 준비', kicker: '도배 진행 순서', description: '상담부터 시공 후 점검까지', duration: '4분 읽기' },
  { slug: 'defect', title: '시공 후 관리', category: '관리 · 하자', kicker: '마감 · 관리 안내', description: '건조 중 주의사항과 마감 점검', duration: '3분 읽기' },
  { slug: 'estimate', title: '견적 확인사항', category: '비용 · 견적', kicker: '견적 체크리스트', description: '면적, 자재, 밑작업과 추가 작업 범위', duration: '3분 읽기' },
];
export const ownBlogGuides = [
  { title: '구축 아파트 도배할 때 꼭 확인해야 하는 것', source: '224429432292', category: '시공 준비' },
  { title: '도배 견적 받을 때 꼭 확인해야 하는 5가지', source: '224413797427', category: '비용 · 견적' },
  { title: '도배 시공 시 퍼티 작업은 꼭 필요할까요?', source: '224397269334', category: '시공 준비' },
];
