import dotenv from "dotenv";
import DetailDTO from "../dtos/detailDto.js";
import axios from "axios";
import { jsonToQueryString } from "../utils/common.js";

dotenv.config();

class TourService {
  /**
   *
   * @param {DetailDTO} detailDTO
   */
  static async callTourApi(detailDTO) {
    const qs = jsonToQueryString({
      serviceKey: process.env.TOUR_API_KEY,
      pageNo: 1,
      numOfRows: 10,
      mobileApp: "AppTest",
      mobileOS: "ETC",
      arrange: "A",
      keyword: detailDTO.district,
      _type: "JSON",
      contentTypeId: 12
    });
    const url = `http://apis.data.go.kr/B551011/KorService1/searchKeyword1?${qs}`;

    try {
      const response = await axios.get(url);

      const result = response.data.response.body.items;

      return result;
    } catch (error) {
      console.error(
        "TourAPI 요청 중 오류:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
}

export default TourService;