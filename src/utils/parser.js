export function parseTravelRecommendations(response) {
    const entries = response.split('\n').filter(line => line.trim() !== '');

    return entries.map(entry => {
        // 번호와 공백 제거
        const cleanedEntry = entry.replace(/^\d+\.\s*/, '').trim();

        // ' - ' 구분자로 지역명과 나머지 분리
        const [region, districtAndFeatures] = cleanedEntry.split(' - ');

        if (!districtAndFeatures) {
            // ' - '가 없거나 형식이 잘못된 경우 예외 처리
            return {
                region: region.trim(),
                district: '',
                features: []
            };
        }

        // ' : ' 구분자로 지역구와 특징 분리
        const [district, featuresString] = districtAndFeatures.split(': ');

        if (!featuresString) {
            // ' : '가 없거나 형식이 잘못된 경우 예외 처리
            return {
                region: region.trim(),
                district: district.trim(),
                features: []
            };
        }

        // 특징들을 리스트로 변환
        const features = featuresString.split(',').map(feature => feature.trim());

        return {
            region: region.trim(),
            district: district.trim(),
            features
        };
    });
}

export function parseTravelRoute(responseData) {
    // 데이터 문자열의 앞뒤 공백을 제거합니다.
    const trimmedData = responseData.trim();

    // 날짜별 데이터로 분리합니다.
    const dayRegex = /\[\d+일차\]/g;
    const dayMatches = [...trimmedData.matchAll(dayRegex)];
    const days = trimmedData.split(dayRegex).filter(day => day.trim() !== '');

    // 날짜별 정보를 담을 배열
    const parsedDays = [];

    dayMatches.forEach((match, index) => {
        const day = parseInt(match[0].replace(/\[|\]일차/g, ''), 10);

        // 날짜별 장소 정보를 파싱합니다.
        const lines = days[index].trim().split('\n').map(line => line.trim()).filter(line => line);

        const places = [];
        let foods = []; // 유명 음식을 저장할 변수

        let currentPlace = null;

        lines.forEach(line => {
            if (line.startsWith('- 첫 번째 장소명') || line.startsWith('- 두 번째 장소명')) {
                if (currentPlace) {
                    places.push(currentPlace); // 이전 장소를 배열에 추가
                }
                currentPlace = {
                    name: line.replace('- 첫 번째 장소명:', '').replace('- 두 번째 장소명:', '').trim(),
                    hours: '',
                    tips: ''
                };
            }
            // 영업 시간을 처리
            else if (line.startsWith('- 영업 시간:')) {
                if (currentPlace) {
                    currentPlace.hours = line.replace('- 영업 시간:', '').trim();
                }
            }
            // 방문 팁을 처리
            else if (line.startsWith('- 특별한 방문 팁:')) {
                if (currentPlace) {
                    currentPlace.tips = line.replace('- 특별한 방문 팁:', '').trim();
                }
            }
            // 유명 음식을 처리
            else if (line.startsWith('- 유명 음식:')) {
                const food = line.replace('- 유명 음식:', '').trim(); // 유명 음식 정보는 바로 저장
                foods.push(...food.split(',').map(food => food.trim()));
            }
        });

        // 마지막 장소 추가
        if (currentPlace) {
            places.push(currentPlace);
        }

        parsedDays.push({
            day: day,
            places: places,
            foods: foods
        });
    });
    return parsedDays;
}










