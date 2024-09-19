import { OpenAI } from "openai";
import dotenv from "dotenv";
import DetailDTO from "../dtos/detailDto.js";

dotenv.config();

class GptService {
  /**
   *
   * @param {DetailDTO} detailDTO
   */
  static async callChatGPT(detailDTO) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 프롬프트 정의
    const prompt = `
        당신은 사용자 선호도에 따라 여행 추천을 제공하는 유용한 조수입니다.
        여행지역: ${detailDTO.region} ${detailDTO.district}
        이번 여행의 주요 키워드: [${detailDTO.features.join(', ')}]
        위 정보를 바탕으로 여행지에서 이용하기 좋은 교통수단, 숙박시설, 유명음식의 대분류를 기준으로 추천을 제공해주세요.
        교통수단과 숙박 시설은 1개를 추천해주고 그에 관련한 사이트를 5개 알려주세요. 
        각 대분류 별 상단에는 추천하는 이유를 3줄 이내로 설명하고, 하단에는 관련 사이트 이름과 주소를 "사이트 이름 : 사이트 주소" 형식으로 나열해주세요.
        상단과 하단 사이에는 [목록]이라는 구분점을 추가해주세요.
        유명음식은 설명 없이 목록만 5개, 가게도 5개 나열해주세요.
        교통수단, 숙박시설, 유명음식 각각의 대분류 사이에는 &=== 구분자를 추가해주세요.
        꼭 아래 예시 형식에 맞게 출력해줘

        예시 형식:
        교통수단
        [추천 이유]
        [목록]
        사이트 이름1 : 사이트 주소1
        사이트 이름2 : 사이트 주소2
        &=== 
        숙박시설
        [추천 이유]
        [목록]
        사이트 이름1 : 사이트 주소1
        사이트 이름2 : 사이트 주소2
        &=== 
        유명음식
        음식1 - 가게 이름1, 가게 이름2, 가게 이름3, 가게 이름4, 가게 이름5
        음식2 - 가게 이름1, 가게 이름2, 가게 이름3, 가게 이름4, 가게 이름5
    `;

    try {
      // OpenAI API 호출
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "다음은 여행 추천을 위한 프롬프트입니다. 이 프롬프트를 기반으로 답변을 생성해 주세요."
          },
          {
            role: "user",
            content: prompt
          },
        ],
        max_tokens: 4096, // 최대 토큰 수
      });

      // API 응답에서 내용 분리
      const splitData = response.choices[0].message.content
        .split("&===")
        .map((section) => section.trim())
        .filter((section) => section.length > 0);

      // 교통수단, 숙박시설, 유명음식 파싱
      const trafficData = splitData[0].split("[목록]").map((section) => section.trim());
      const hotelData = splitData[1].split("[목록]").map((section) => section.trim());
      const foodData = splitData[2].split("\n").map((line) => line.trim()).filter(line => line.length > 0);

      // 응답 데이터 정리
     
      const answer = {
        traffic: {
          reason: trafficData[0].replace('교통수단', '').trim(),
          sites: trafficData[1] 
            ? trafficData[1].split("\n").map(site => {
                const [name, url] = site.split(' : ');
                return { name: name.trim(), url: url.trim() };
              }).filter(site => site.name.length > 0 && site.url.length > 0)
            : [],
        },
        hotel: {
          reason: hotelData[0].replace('숙박시설', '').trim(),
          sites: hotelData[1] 
            ? hotelData[1].split("\n").map(site => {
                const [name, url] = site.split(' : ');
                return { name: name.trim(), url: url.trim() };
              }).filter(site => site.name.length > 0 && site.url.length > 0)
            : [],
        },
        food: foodData.map(item => {
          // 각 줄에서 음식 이름과 가게 목록을 분리
          const [foodName, shopList] = item.split(' - ');
          // 가게 목록이 있는 경우, 쉼표로 나누어 리스트로 변환
          const shops = shopList ? shopList.split(',').map(shop => shop.trim()) : [];
          return { foodName: foodName.trim(), shops };
        }).filter(food => food.foodName.length > 0),
      };

      // 결과 반환
      return answer;

    } catch (error) {
      console.error("ChatGPT 요청 중 오류:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

export default GptService;
