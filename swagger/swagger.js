import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: "RoutePorter API 명세서",
    description: "RoutePorter API",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server"
    },
    {
      url: "https://api.routeport.co.kr",
      description: "Production server"
    }
  ],
  schemes: ["https", "http"],
};

const outputFile = "./swagger-output.json"; 
const endpointsFiles = [
  "../index.js"  
];

// swaggerAutogen을 호출하여 Swagger 문서를 생성
swaggerAutogen(outputFile, endpointsFiles, doc);

