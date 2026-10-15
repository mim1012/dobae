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
  { title: '상담 접수', text: '전화나 온라인으로\n문의 내용을 접수해 주세요.' },
  { title: '시공 조건 확인', text: '현장 상황과 공간, 희망 일정 등\n기본 조건을 확인합니다.' },
  { title: '자재 · 견적 협의', text: '원하시는 자재와 범위에 맞춰\n견적을 안내드립니다.' },
  { title: '일정 확정', text: '작업 일정과 세부 내용을\n조율하고 확정합니다.' },
  { title: '시공 · 완료 확인', text: '약속된 일정에 맞춰 시공을 진행하고,\n마무리까지 함께 확인합니다.' },
];
export const faqs = [
  { question: '거주 중에도 시공할 수 있나요?', answer: '거주 여부와 가구 배치, 작업 범위를 확인한 뒤 가능한 방법을 안내드립니다. 상담할 때 짐의 양과 이동 가능한 가구를 함께 알려주세요.', category: '시공 준비' },
  { question: '가구와 짐은 어떻게 준비하나요?', answer: '귀중품과 파손되기 쉬운 물건은 별도로 보관해 주세요. 큰 가구의 이동과 보양 범위는 현장 조건을 확인한 뒤 시공 전에 함께 정리합니다.', category: '시공 준비' },
  { question: '벽지와 색상은 어떻게 선택하나요?', answer: '원하는 분위기와 기존 바닥, 가구 색상을 기준으로 선택합니다. 화면과 실물은 다를 수 있으니 최종 결정 전 샘플북으로 색상과 질감을 확인해 주세요.', category: '벽지 선택' },
  { question: '견적은 어떻게 안내받나요?', answer: '공간의 크기, 벽지 종류, 시공 범위, 바탕면 상태를 확인해 안내합니다. 기존 벽지 제거와 보수, 가구 이동 등 포함되는 작업을 함께 확인해 주세요.', category: '비용 · 견적' },
  { question: '시공일은 언제 확정되나요?', answer: '희망일을 남겨주시면 작업 가능 여부와 준비 사항을 확인합니다. 문의 내용 입력만으로 예약이 확정되는 것은 아니며, 상담 후 일정을 조율합니다.', category: '시공 준비' },
  { question: '시공 후 벽지가 울어 보이면 어떻게 하나요?', answer: '시공 직후에는 건조 과정에서 표면이 달라 보일 수 있습니다. 벽지를 누르거나 임의로 떼어내지 말고 현장 안내를 따라 주세요. 건조 후에도 변화가 남으면 시공 날짜와 사진을 함께 알려주세요.', category: '관리 · 하자' },
];
export const articles = [
  { slug: 'hapji-silk', title: '합지와 실크, 우리 집에는 어떤 벽지가 맞을까요?', category: '벽지 선택', kicker: '합지 vs 실크', description: '소재와 시공 방식, 생활 환경을 비교하며 선택해 보세요.', duration: '3분 읽기' },
  { slug: 'process', title: '상담부터 마무리까지, 도배 시공 순서', category: '시공 준비', kicker: '도배 진행 순서', description: '시공 전에 준비할 것과 단계별 확인 사항을 정리했습니다.', duration: '4분 읽기' },
  { slug: 'defect', title: '시공 후 확인할 부분과 관리 방법', category: '관리 · 하자', kicker: '마감 · 관리 안내', description: '건조 중의 변화와 점검이 필요한 상태를 확인해 보세요.', duration: '3분 읽기' },
  { slug: 'estimate', title: '도배 견적을 받을 때 확인할 다섯 가지', category: '비용 · 견적', kicker: '견적 체크리스트', description: '면적, 벽지, 밑작업, 현장 조건, 작업 범위를 함께 확인하세요.', duration: '3분 읽기' },
];
export const ownBlogGuides = [
  { title: '구축 아파트 도배할 때 꼭 확인해야 하는 것', source: '224429432292', category: '시공 준비' },
  { title: '도배 견적 받을 때 꼭 확인해야 하는 5가지', source: '224413797427', category: '비용 · 견적' },
  { title: '도배 시공 시 퍼티 작업은 꼭 필요할까요?', source: '224397269334', category: '시공 준비' },
];
