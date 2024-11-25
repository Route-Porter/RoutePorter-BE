import { sendResponse, sendErrorResponse } from '../../config/response.js';
import chatService from '../services/chatService.js';
import routeService from "../services/routeService.js";

export async function getRecommendations(req, res) {
    try {
        const answers = req.body;
        const recommendations = await chatService.getTravelRecommendations(answers);
        sendResponse(res, recommendations);
    } catch (error) {
        sendErrorResponse(res, error);
    }
}

export async function getDetailedRoute(req, res) {
    try {

        const { answers, destination } = req.body;
        console.log('Received answers:', answers);
        console.log('Received destination:', destination);

        if (!destination || typeof destination !== 'object' || !destination.points || !Array.isArray(destination.points)) {
            return res.status(400).json({ message: 'Invalid destination data' });
        }

        if (!destination.points || !Array.isArray(destination.points)) {
            return res.status(400).json({ message: 'Invalid destination data' });
        }


        const route = await routeService.getDetailedTravelInfo({
            destination,
            answers});
        sendResponse(res, route);
    } catch (error) {
        sendErrorResponse(res, error);
    }
}
