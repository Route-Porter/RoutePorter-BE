import chatProvider from "../providers/chatProvider.js";
import {parseTravelRoute} from "../utils/parser.js";

class routeService{
   async getDetailedTravelInfo(destinations) {
      console.log(destinations)
      const prompt = `
       일정 정보: ${destinations.answers.schedule} 
       상세 인원 정보: ${destinations.answers.groupComposition} 
       여행의 목적: ${destinations.answers.purpose}
       여행 예산: ${destinations.answers.budget}
       여행 중 가장 중요하게 생각하는 요소: ${destinations.answers.keyElement}
       동행자: ${destinations.answers.companion}
       특히 마음에 들었던 여행지: ${destinations.answers.favorite}
       마음에 들었던 이유: ${destinations.answers.favoriteReason}
       필요하거나 피하고 싶은 요소: ${destinations.answers.specialNeeds}
       AI 추천 방식: ${destinations.answers.recommendationType}
       여행 중 어느 정도의 자유 시간을 원하시나요? : ${destinations.answers.freeTime}
       
       여행 계획: ${destinations.destination.region} - ${destinations.destination.city}
       특징: ${destinations.destination.points[0]}, ${destinations.destination.points[1]}, ${destinations.destination.points[2]}

        위에서 언급된 각 여행지에 대해 여행 루트를 작성합니다.
        하루에 두 가지 일정과 해당 여행지 유명 음식 두 가지(한 줄에 작성) 를 추천해주세요.
        부가적인 말 없이 다음 정보를 다음과 동일하게 제공해 주세요:
        [일차] (e.g. [1일차])
        - 첫 번째 장소명:
        - 영업 시간:
        - 특별한 방문 팁:
        
        - 두 번째 장소명:
        - 영업 시간:
        - 특별한 방문 팁:
        
        - 유명 음식:

    `;

      try {

         const response = await chatProvider.getChatGPTResponse(prompt);
         console.log(response)
         const route = parseTravelRoute(response);
         console.log(route)
         // return response;
         return route;
      } catch (error) {
         console.error('Detailed travel info error:', error.message);
         throw error;
      }
   }
}

export default new routeService();