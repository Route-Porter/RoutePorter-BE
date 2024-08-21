import DetailDTO from "../dtos/detailDto.js";
import GptService from "../services/detailService.js";
import TourService from "../services/tourService.js";

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export async function getDetail(req, res) {

  
  const features = req.query.features.split(',').map((word) => word.replace(/[\[|\]]/gi, ''))

  const detailDTO = new DetailDTO({
    region: req.query.region,
    district: req.query.district,
    features: features
  });
  
  try {
    const gptRes = await GptService.callChatGPT(detailDTO);
    const tourRes = await TourService.callTourApi(detailDTO);

    const result = {
      gptComment: gptRes,
      tourData: tourRes
    };

    return res.json(result);
  } catch (error) {
    res.json({
      error: "Failed to get response",
    });
  }
}