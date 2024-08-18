const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = {
    mode: "development",

    // context를 프로젝트 루트로 설정
    context: path.resolve(__dirname),

    entry: {
        app: './index.js', // entry 파일을 src의 상위 폴더에 있는 app.js로 설정
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js', // output 파일의 이름을 설정
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },

    target: "node",
    externalsPresets: {
        node: true,
    },
    externals: [nodeExternals()],
};
